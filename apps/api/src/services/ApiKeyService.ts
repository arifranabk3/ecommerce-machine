import crypto from 'crypto';
import { ApiKeyModel } from '../models/ApiKey';
import { AppError } from '../middleware/error';

export class ApiKeyService {
  /**
   * Create a new tenant API Key. Raw key is displayed ONLY ONCE.
   */
  static async createApiKey(tenantId: string, name: string, scopes: string[]) {
    const rawSecret = crypto.randomBytes(24).toString('hex');
    const keyPrefix = `sz_live_${rawSecret.substring(0, 6)}`;
    const fullKey = `${keyPrefix}_${rawSecret}`;

    const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');

    const apiKeyDoc = await ApiKeyModel.create({
      tenantId,
      name,
      keyPrefix,
      keyHash,
      scopes: scopes && scopes.length > 0 ? scopes : ['orders.read']
    });

    return {
      apiKey: apiKeyDoc,
      rawKey: fullKey
    };
  }

  /**
   * Validate key, update lastUsedAt, check revocation and scope match
   */
  static async authenticateApiKey(rawKey: string, requiredScope?: string) {
    if (!rawKey || !rawKey.startsWith('sz_live_')) return null;

    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const apiKeyDoc = await ApiKeyModel.findOne({ keyHash, revokedAt: null });

    if (!apiKeyDoc) return null;

    if (requiredScope && !apiKeyDoc.scopes.includes('*') && !apiKeyDoc.scopes.includes(requiredScope)) {
      throw new AppError(`API Key missing required scope: ${requiredScope}`, 403, 'FORBIDDEN');
    }

    apiKeyDoc.lastUsedAt = new Date();
    await apiKeyDoc.save();

    return apiKeyDoc;
  }

  /**
   * Revoke an active API Key
   */
  static async revokeApiKey(tenantId: string, keyId: string) {
    const keyDoc = await ApiKeyModel.findOneAndUpdate(
      { _id: keyId, tenantId },
      { revokedAt: new Date() },
      { new: true }
    );
    if (!keyDoc) throw new AppError('API Key not found or already revoked', 404, 'NOT_FOUND');
    return keyDoc;
  }
}
