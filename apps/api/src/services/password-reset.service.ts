import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { PasswordResetTokenModel } from '../models/PasswordResetToken';
import { UserModel } from '../models/User';
import { SessionModel } from '../models/Session';
import { mailProvider } from '../utils/mail.provider';
import { SecurityService } from './security.service';
import { AppError } from '../middleware/error';
import { env } from '@sellzy/config';

export class PasswordResetService {
  static async requestPasswordReset(email: string, tenantSlug: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Return safe message without leaking account existence
      return { message: 'If an account exists with that email, a password reset link has been sent.' };
    }

    // Create cryptographically secure token
    const plainToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour TTL

    // Remove any existing active reset tokens for user
    await PasswordResetTokenModel.deleteMany({ tenantId: user.tenantId, userId: user._id.toString() });

    await PasswordResetTokenModel.create({
      tenantId: user.tenantId,
      userId: user._id.toString(),
      tokenHash,
      expiresAt
    });

    const resetUrl = `${env.CORS_ORIGIN}/reset-password?token=${plainToken}`;
    await mailProvider.sendEmail(
      user.email,
      'Reset Your Sellzy Password',
      `<p>Click the link below to reset your password (valid for 1 hour):</p><a href="${resetUrl}">${resetUrl}</a>`
    );

    await SecurityService.logSecurityEvent({
      tenantId: user.tenantId,
      actorUserId: user._id.toString(),
      action: 'PASSWORD_RESET_REQUESTED'
    });

    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  static async resetPassword(plainToken: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    const tokenDoc = await PasswordResetTokenModel.findOne({ tokenHash, usedAt: { $exists: false } });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new AppError('Password reset token is invalid or has expired', 400, 'INVALID_RESET_TOKEN');
    }

    const user = await UserModel.findOne({ _id: tokenDoc.userId, tenantId: tokenDoc.tenantId }).select('+passwordHash');
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Set new password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    await user.save();

    // Mark token as used (single use enforcement)
    tokenDoc.usedAt = new Date();
    await tokenDoc.save();

    // Revoke all existing sessions for security
    await SessionModel.updateMany(
      { userId: user._id.toString(), tenantId: user.tenantId, revokedAt: { $exists: false } },
      { revokedAt: new Date(), revokeReason: 'PASSWORD_RESET' }
    );

    await SecurityService.logSecurityEvent({
      tenantId: user.tenantId,
      actorUserId: user._id.toString(),
      action: 'PASSWORD_RESET_COMPLETED'
    });

    await SecurityService.notifySecurityAlert(user.email, 'Password Changed', 'Your password was successfully reset.');

    return { success: true };
  }
}
