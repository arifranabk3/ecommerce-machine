import { FeatureFlagModel } from '../models/FeatureFlag';

export class FeatureFlagService {
  /**
   * Evaluate if feature flag is active for a given tenant
   */
  static async isEnabled(key: string, tenantId?: string): Promise<boolean> {
    const flag = await FeatureFlagModel.findOne({ key: key.toUpperCase() });
    if (!flag) return false;
    if (!flag.enabled) return false;

    if (tenantId && flag.tenantIds && flag.tenantIds.length > 0) {
      return flag.tenantIds.includes(tenantId);
    }

    if (flag.rolloutPercentage < 100 && tenantId) {
      const hashChar = tenantId.charCodeAt(tenantId.length - 1);
      const bucket = hashChar % 100;
      return bucket < flag.rolloutPercentage;
    }

    return flag.global;
  }
}
