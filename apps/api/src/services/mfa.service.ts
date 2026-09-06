import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';

export class MfaService {
  static async setupMfa(userId: string, tenantId: string) {
    const user = await UserModel.findOne({ _id: userId, tenantId });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const secretObj = speakeasy.generateSecret({ length: 20, name: `Sellzy (${user.email})` });
    const secret = secretObj.base32;
    const otpauthUrl = secretObj.otpauth_url || '';
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Save temporary secret (unconfirmed until verified)
    user.mfaSecret = secret;
    await user.save();

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'MFA_SETUP_INITIATED'
    });

    return { secret, qrCodeDataUrl };
  }

  static async verifyAndEnableMfa(userId: string, tenantId: string, token: string) {
    const user = await UserModel.findOne({ _id: userId, tenantId }).select('+mfaSecret +mfaRecoveryCodes');
    if (!user || !user.mfaSecret) {
      throw new AppError('MFA setup not initiated', 400, 'MFA_NOT_INITIATED');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });

    if (!isValid) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId: userId,
        action: 'MFA_FAILED',
        result: 'FAILURE'
      });
      throw new AppError('Invalid MFA verification code', 400, 'INVALID_MFA_CODE');
    }

    // Generate 8 cryptographically secure one-time recovery codes
    const plainRecoveryCodes: string[] = [];
    const hashedRecoveryCodes: string[] = [];

    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g., 4A8B9C2D
      plainRecoveryCodes.push(code);
      const hashed = await bcrypt.hash(code, 10);
      hashedRecoveryCodes.push(hashed);
    }

    user.mfaEnabled = true;
    user.mfaRecoveryCodes = hashedRecoveryCodes;
    await user.save();

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'MFA_ENABLED'
    });

    return { recoveryCodes: plainRecoveryCodes };
  }

  static async disableMfa(userId: string, tenantId: string, passwordVerification: boolean) {
    if (!passwordVerification) {
      throw new AppError('Password verification required to disable MFA', 400, 'PASSWORD_REQUIRED');
    }

    const user = await UserModel.findOne({ _id: userId, tenantId });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    user.mfaRecoveryCodes = [];
    await user.save();

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'MFA_DISABLED'
    });

    return { success: true };
  }

  static async verifyTotpOrRecoveryCode(user: InstanceType<typeof UserModel>, code: string): Promise<boolean> {
    // 1. Try TOTP token verification
    if (user.mfaSecret) {
      const isTotpValid = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: code
      });
      if (isTotpValid) return true;
    }

    // 2. Try single-use recovery code verification
    if (user.mfaRecoveryCodes && user.mfaRecoveryCodes.length > 0) {
      for (let i = 0; i < user.mfaRecoveryCodes.length; i++) {
        const hashedCode = user.mfaRecoveryCodes[i];
        const isMatch = await bcrypt.compare(code.toUpperCase(), hashedCode);
        if (isMatch) {
          // Consume the recovery code (single use)
          user.mfaRecoveryCodes.splice(i, 1);
          await user.save();
          return true;
        }
      }
    }

    return false;
  }
}
