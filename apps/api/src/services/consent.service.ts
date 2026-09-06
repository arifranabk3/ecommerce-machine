import { CommunicationPreferenceModel } from '../models/CommunicationPreference';

export class ConsentService {
  async getPreferences(tenantId: string, customerId: string) {
    let pref = await CommunicationPreferenceModel.findOne({ tenantId, customerId });
    if (!pref) {
      // Default: marketing is STRICTLY OPTED-OUT (false) until explicit consent is given!
      // Transactional is allowed by default.
      pref = await CommunicationPreferenceModel.create({
        tenantId,
        customerId,
        whatsapp: false,
        email: false,
        sms: false,
        marketingAllowed: false,
        transactionalAllowed: true,
        topics: {
          promotions: false,
          newsletter: false,
          orderUpdates: true,
        },
        auditTrail: [
          {
            updatedAt: new Date(),
            action: 'CREATED_DEFAULT_OPTED_OUT',
            channels: { whatsapp: false, email: false, sms: false },
          },
        ],
      });
    }
    return pref;
  }

  async updatePreferences(
    tenantId: string,
    customerId: string,
    channels?: { whatsapp?: boolean; email?: boolean; sms?: boolean },
    topics?: { promotions?: boolean; newsletter?: boolean; orderUpdates?: boolean },
    sourceInfo?: { ipAddress?: string; userAgent?: string; optInSource?: string }
  ) {
    let pref = await this.getPreferences(tenantId, customerId);

    if (channels) {
      if (channels.whatsapp !== undefined) pref.whatsapp = channels.whatsapp;
      if (channels.email !== undefined) pref.email = channels.email;
      if (channels.sms !== undefined) pref.sms = channels.sms;
    }

    if (topics) {
      if (topics.promotions !== undefined) pref.topics.promotions = topics.promotions;
      if (topics.newsletter !== undefined) pref.topics.newsletter = topics.newsletter;
      if (topics.orderUpdates !== undefined) pref.topics.orderUpdates = topics.orderUpdates;
    }

    // Set marketingAllowed to true if any marketing channel or topic is explicitly enabled
    pref.marketingAllowed = pref.whatsapp || pref.email || pref.sms || pref.topics.promotions || pref.topics.newsletter;
    if (pref.marketingAllowed && !pref.optInAt) {
      pref.optInAt = new Date();
      if (sourceInfo?.optInSource) pref.optInSource = sourceInfo.optInSource;
    }

    pref.auditTrail.push({
      updatedAt: new Date(),
      action: 'UPDATE_PREFERENCES',
      channels: { whatsapp: pref.whatsapp, email: pref.email, sms: pref.sms },
      topics: { ...pref.topics },
      ipAddress: sourceInfo?.ipAddress,
      userAgent: sourceInfo?.userAgent,
    });

    await pref.save();
    return pref;
  }

  async optIn(
    tenantId: string,
    customerId: string,
    channel: 'whatsapp' | 'email' | 'sms',
    sourceInfo: { optInSource: string; ipAddress?: string; userAgent?: string }
  ) {
    let pref = await this.getPreferences(tenantId, customerId);

    pref[channel] = true;
    pref.marketingAllowed = true;
    pref.optInAt = new Date();
    pref.optInSource = sourceInfo.optInSource;

    pref.auditTrail.push({
      updatedAt: new Date(),
      action: `EXPLICIT_OPT_IN_${channel.toUpperCase()}`,
      channels: { whatsapp: pref.whatsapp, email: pref.email, sms: pref.sms },
      ipAddress: sourceInfo.ipAddress,
      userAgent: sourceInfo.userAgent,
    });

    await pref.save();
    return pref;
  }

  async optOut(
    tenantId: string,
    customerId: string,
    channel: 'whatsapp' | 'email' | 'sms',
    reason?: string,
    sourceInfo?: { ipAddress?: string; userAgent?: string }
  ) {
    let pref = await this.getPreferences(tenantId, customerId);

    pref[channel] = false;
    pref.marketingAllowed = pref.whatsapp || pref.email || pref.sms;
    pref.optOutAt = new Date();
    if (reason) pref.unsubscribeReason = reason;

    pref.auditTrail.push({
      updatedAt: new Date(),
      action: `OPT_OUT_${channel.toUpperCase()}`,
      channels: { whatsapp: pref.whatsapp, email: pref.email, sms: pref.sms },
      reason,
      ipAddress: sourceInfo?.ipAddress,
      userAgent: sourceInfo?.userAgent,
    });

    await pref.save();
    return pref;
  }

  async idempotentUnsubscribe(
    tenantId: string,
    customerId: string,
    channel: 'whatsapp' | 'email' | 'sms',
    reason?: string
  ) {
    let pref = await this.getPreferences(tenantId, customerId);

    if (!pref[channel]) {
      // Already unsubscribed - idempotent return without adding duplicate audit entry
      return { pref, alreadyUnsubscribed: true };
    }

    const updated = await this.optOut(tenantId, customerId, channel, reason);
    return { pref: updated, alreadyUnsubscribed: false };
  }

  async isOptedIn(tenantId: string, customerId: string, channel: 'whatsapp' | 'email' | 'sms', isMarketing = true): Promise<boolean> {
    const pref = await this.getPreferences(tenantId, customerId);
    if (!isMarketing) {
      // Transactional communication check
      return !!pref.transactionalAllowed;
    }
    // Marketing communication check: requires explicit marketing consent!
    return !!(pref.marketingAllowed && pref[channel]);
  }
}
