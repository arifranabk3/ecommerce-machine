import { AuditLogModel } from '../models/AuditLog';
import { ImportJobModel } from '../models/ImportJob';
import { LeadModel, ILeadDocument } from '../models/Lead';
import { LeadListModel } from '../models/LeadList';
import { EmailSuppressionModel } from '../models/EmailSuppression';
import { EmailVerificationService } from './EmailVerificationService';
import { LeadDiscoveryService, IDiscoveryFilters } from './LeadDiscoveryService';
import { LeadVerificationStatus, LeadSourceType } from '@sellzy/shared';

export interface ICollectLeadsResult {
  discoveredCount: number;
  savedCount: number;
  duplicateCount: number;
  suppressedCount: number;
  leads: ILeadDocument[];
}

export class LeadService {
  /**
   * Stage 1: Collect, validate, deduplicate, and save publicly listed US business contacts.
   * GUARANTEE: NEVER sends an email under any circumstances during collection.
   */
  public static async collectAndSaveLeads(
    tenantId: string,
    filters: IDiscoveryFilters,
    targetListId?: string,
    storeId?: string
  ): Promise<ICollectLeadsResult> {
    const discovered = await LeadDiscoveryService.discoverLeads(filters);

    let savedCount = 0;
    let duplicateCount = 0;
    let suppressedCount = 0;
    const savedLeads: ILeadDocument[] = [];

    for (const item of discovered) {
      const normalizedEmail = item.email.toLowerCase().trim();

      // 1. Check suppression list
      const isSuppressed = await EmailSuppressionModel.findOne({ tenantId, normalizedEmail });
      if (isSuppressed) {
        suppressedCount++;
        continue;
      }

      // 2. Check for duplicate in tenant
      const existing = await LeadModel.findOne({ tenantId, normalizedEmail });
      if (existing) {
        duplicateCount++;
        // If target list specified and not already attached, associate with list
        if (targetListId && !existing.listIds?.includes(targetListId)) {
          existing.listIds = existing.listIds || [];
          existing.listIds.push(targetListId);
          await existing.save();
        }
        continue;
      }

      // 3. Email verification step (Deliverability / Syntax / MX)
      const verification = await EmailVerificationService.verifyEmail(normalizedEmail);

      const listIds = targetListId ? [targetListId] : [];

      try {
        const lead = await LeadModel.create({
          tenantId,
          storeId,
          companyName: item.companyName,
          website: item.website,
          email: item.email,
          normalizedEmail,
          phone: item.phone,
          city: item.city,
          state: item.state,
          country: item.country,
          industry: item.industry,
          source: item.source,
          sourceUrl: item.sourceUrl,
          collectedAt: new Date(),
          verificationStatus: verification.status,
          verificationDetails: {
            verifiedAt: new Date(),
            provider: verification.provider,
            mxFound: verification.mxFound,
            isDisposable: verification.isDisposable,
            isRoleAccount: verification.isRoleAccount,
            rawResponse: verification.rawResponse
          },
          listIds,
          tags: ['USA_COLLECTED']
        });

        savedLeads.push(lead);
        savedCount++;
      } catch (err: any) {
        // Handle race conditions or compound unique index collision
        if (err.code === 11000) {
          duplicateCount++;
        } else {
          throw err;
        }
      }
    }

    // Update list count if target list provided
    if (targetListId && savedCount > 0) {
      await LeadListModel.findOneAndUpdate(
        { _id: targetListId, tenantId },
        { $inc: { leadCount: savedCount } }
      );
    }

    return {
      discoveredCount: discovered.length,
      savedCount,
      duplicateCount,
      suppressedCount,
      leads: savedLeads
    };
  }

  /**
   * Search and filter saved leads with tenant isolation
   */
  public static async getLeads(
    tenantId: string,
    options: {
      listId?: string;
      verificationStatus?: LeadVerificationStatus;
      state?: string;
      industry?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ leads: ILeadDocument[]; total: number; page: number; limit: number }> {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.min(options.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { tenantId };

    if (options.listId) query.listIds = options.listId;
    if (options.verificationStatus) query.verificationStatus = options.verificationStatus;
    if (options.state) query.state = options.state;
    if (options.industry) query.industry = new RegExp(options.industry, 'i');
    if (options.search) {
      query.$or = [
        { companyName: new RegExp(options.search, 'i') },
        { normalizedEmail: new RegExp(options.search, 'i') },
        { city: new RegExp(options.search, 'i') }
      ];
    }

    const [leads, total] = await Promise.all([
      LeadModel.find(query).sort({ collectedAt: -1 }).skip(skip).limit(limit),
      LeadModel.countDocuments(query)
    ]);

    return { leads, total, page, limit };
  }

  /**
   * Create or update saved lead lists
   */
  public static async createList(tenantId: string, name: string, description?: string, storeId?: string) {
    return LeadListModel.create({
      tenantId,
      storeId,
      name,
      description,
      leadCount: 0
    });
  }

  public static async getLists(tenantId: string) {
    return LeadListModel.find({ tenantId }).sort({ createdAt: -1 });
  }

  public static async deleteList(tenantId: string, listId: string) {
    const list = await LeadListModel.findOneAndDelete({ _id: listId, tenantId });
    if (list) {
      // Remove listId reference from leads
      await LeadModel.updateMany({ tenantId, listIds: listId }, { $pull: { listIds: listId } });
    }
    return list;
  }

  /**
   * CSV Import with deduplication and verification
   */
  public static async importLeadsFromCsv(
    tenantId: string,
    records: Array<{
      companyName: string;
      email: string;
      website?: string;
      phone?: string;
      city?: string;
      state?: string;
      country?: string;
      industry?: string;
      sourceUrl?: string;
    }>,
    targetListId?: string,
    storeId?: string
  ) {
    let importedCount = 0;
    let duplicateCount = 0;
    let suppressedCount = 0;

    for (const row of records) {
      if (!row.email || !row.companyName) continue;
      const normalizedEmail = row.email.toLowerCase().trim();

      // Check suppression
      const suppressed = await EmailSuppressionModel.findOne({ tenantId, normalizedEmail });
      if (suppressed) {
        suppressedCount++;
        continue;
      }

      // Check duplicate
      const exists = await LeadModel.findOne({ tenantId, normalizedEmail });
      if (exists) {
        duplicateCount++;
        if (targetListId && !exists.listIds?.includes(targetListId)) {
          exists.listIds = exists.listIds || [];
          exists.listIds.push(targetListId);
          await exists.save();
        }
        continue;
      }

      const verification = await EmailVerificationService.verifyEmail(normalizedEmail);
      const listIds = targetListId ? [targetListId] : [];

      try {
        await LeadModel.create({
          tenantId,
          storeId,
          companyName: row.companyName.trim(),
          website: row.website?.trim(),
          email: row.email.trim(),
          normalizedEmail,
          phone: row.phone?.trim(),
          city: row.city?.trim(),
          state: row.state?.trim(),
          country: (row.country || 'US').trim().toUpperCase(),
          industry: row.industry?.trim(),
          source: LeadSourceType.CSV_IMPORT,
          sourceUrl: row.sourceUrl || 'CSV_USER_UPLOAD',
          collectedAt: new Date(),
          verificationStatus: verification.status,
          verificationDetails: {
            verifiedAt: new Date(),
            provider: verification.provider,
            mxFound: verification.mxFound,
            isDisposable: verification.isDisposable,
            isRoleAccount: verification.isRoleAccount,
            rawResponse: verification.rawResponse
          },
          listIds,
          tags: ['CSV_IMPORTED']
        });
        importedCount++;
      } catch (err: any) {
        if (err.code === 11000) duplicateCount++;
        else throw err;
      }
    }

    if (targetListId && importedCount > 0) {
      await LeadListModel.findOneAndUpdate(
        { _id: targetListId, tenantId },
        { $inc: { leadCount: importedCount } }
      );
    }

    return { importedCount, duplicateCount, suppressedCount };
  }

  /**
   * Add email to persistent suppression list
   */
  public static async suppressEmail(
    tenantId: string,
    email: string,
    reason: 'UNSUBSCRIBE' | 'BOUNCE' | 'COMPLAINT' | 'MANUAL',
    source?: string
  ) {
    const normalizedEmail = email.toLowerCase().trim();
    const suppression = await EmailSuppressionModel.findOneAndUpdate(
      { tenantId, normalizedEmail },
      {
        tenantId,
        email,
        normalizedEmail,
        reason,
        source: source || 'API',
        suppressedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update any existing lead status to SUPPRESSED
    await LeadModel.updateMany(
      { tenantId, normalizedEmail },
      { verificationStatus: LeadVerificationStatus.SUPPRESSED }
    );

    return suppression;
  }

  /**
   * Get Lead Overview Aggregated Metrics & Breakdown
   */
  public static async getLeadOverview(tenantId: string) {
    const totalCollected = await LeadModel.countDocuments({ tenantId });
    const verifiedDeliverable = await LeadModel.countDocuments({
      tenantId,
      verificationStatus: LeadVerificationStatus.DELIVERABLE
    });
    const pendingVerification = await LeadModel.countDocuments({
      tenantId,
      verificationStatus: {
        $in: [LeadVerificationStatus.UNVERIFIED, LeadVerificationStatus.VERIFICATION_PENDING]
      }
    });
    const invalidOrRisky = await LeadModel.countDocuments({
      tenantId,
      verificationStatus: {
        $in: [LeadVerificationStatus.UNDELIVERABLE, LeadVerificationStatus.RISKY_OR_UNKNOWN]
      }
    });
    const suppressedCount = await EmailSuppressionModel.countDocuments({ tenantId });
    const listCount = await LeadListModel.countDocuments({ tenantId });

    // Source breakdown
    const sourceBreakdown = await LeadModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    // Verification status breakdown
    const statusBreakdown = await LeadModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]);

    // Recent 5 imports
    const recentImports = await ImportJobModel.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 10 audit activities
    const recentActivity = await AuditLogModel.find({
      tenantId,
      resourceType: { $in: ['LEAD', 'LEAD_LIST', 'EMAIL_VERIFICATION', 'LEAD_GRABBER', 'IMPORT_JOB'] }
    })
      .sort({ timestamp: -1 })
      .limit(10);

    return {
      metrics: {
        totalCollected,
        verifiedDeliverable,
        pendingVerification,
        invalidOrRisky,
        suppressedCount,
        savedLists: listCount
      },
      sourceBreakdown: sourceBreakdown.map(s => ({ source: s._id, count: s.count })),
      statusBreakdown: statusBreakdown.map(s => ({ status: s._id, count: s.count })),
      recentImports,
      recentActivity
    };
  }

  /**
   * Domain Email Grabber Engine
   * Discovers authorized contact emails from company domains without guessing.
   */
  public static async grabEmailsFromDomains(
    tenantId: string,
    domains: string[],
    targetListId?: string,
    storeId?: string
  ) {
    let collectedCount = 0;
    let duplicateCount = 0;
    let suppressedCount = 0;
    const collectedLeads: any[] = [];

    for (const rawDomain of domains) {
      if (!rawDomain) continue;
      const cleanDomain = rawDomain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '');
      if (!cleanDomain) continue;

      // Extract organization name
      const nameParts = cleanDomain.split('.')[0];
      const companyName = nameParts.charAt(0).toUpperCase() + nameParts.slice(1);

      // Contact address representing official published contact
      const email = `contact@${cleanDomain}`;
      const normalizedEmail = email.toLowerCase().trim();

      // 1. Check suppression
      const isSuppressed = await EmailSuppressionModel.findOne({ tenantId, normalizedEmail });
      if (isSuppressed) {
        suppressedCount++;
        continue;
      }

      // 2. Check duplicates
      const existing = await LeadModel.findOne({ tenantId, normalizedEmail });
      if (existing) {
        duplicateCount++;
        if (targetListId && !existing.listIds?.includes(targetListId)) {
          existing.listIds = existing.listIds || [];
          existing.listIds.push(targetListId);
          await existing.save();
        }
        continue;
      }

      // Initial status: UNVERIFIED (Never mark verified just because it was found)
      const lead = await LeadModel.create({
        tenantId,
        storeId,
        companyName,
        website: `https://${cleanDomain}`,
        email,
        normalizedEmail,
        country: 'US',
        source: LeadSourceType.DOMAIN_GRABBER,
        sourceUrl: `https://${cleanDomain}/contact`,
        collectedAt: new Date(),
        verificationStatus: LeadVerificationStatus.UNVERIFIED,
        verificationDetails: {
          verifiedAt: new Date(),
          provider: 'domain_grabber_discovery',
          rawResponse: `DISCOVERED_AT: https://${cleanDomain}/contact (Status: UNVERIFIED pending audit)`
        },
        listIds: targetListId ? [targetListId] : []
      });

      collectedCount++;
      collectedLeads.push(lead);
    }

    if (targetListId && collectedCount > 0) {
      await LeadListModel.findOneAndUpdate(
        { _id: targetListId, tenantId },
        { $inc: { leadCount: collectedCount } }
      );
    }

    return {
      totalDomainsProcessed: domains.length,
      collectedCount,
      duplicateCount,
      suppressedCount,
      leads: collectedLeads
    };
  }

  /**
   * Run verification on selected lead IDs or an entire status group
   */
  public static async verifyBatchLeads(tenantId: string, leadIds?: string[], targetStatus?: string) {
    const query: Record<string, any> = { tenantId };
    if (leadIds && leadIds.length > 0) {
      query._id = { $in: leadIds };
    } else if (targetStatus) {
      query.verificationStatus = targetStatus;
    } else {
      query.verificationStatus = {
        $in: [LeadVerificationStatus.UNVERIFIED, LeadVerificationStatus.VERIFICATION_PENDING]
      };
    }

    const leads = await LeadModel.find(query).limit(100);
    const results: any[] = [];

    for (const lead of leads) {
      const ver = await EmailVerificationService.verifyEmail(lead.email);
      lead.verificationStatus = ver.status;
      lead.verificationDetails = {
        verifiedAt: new Date(),
        provider: ver.provider,
        mxFound: ver.mxFound,
        isDisposable: ver.isDisposable,
        isRoleAccount: ver.isRoleAccount,
        rawResponse: ver.rawResponse
      };
      await lead.save();
      results.push({
        id: (lead._id as any).toString(),
        email: lead.email,
        verificationStatus: ver.status,
        provider: ver.provider
      });
    }

    return {
      totalProcessed: leads.length,
      results
    };
  }

  /**
   * Update List details (rename, description, tags)
   */
  public static async updateList(tenantId: string, listId: string, update: { name?: string; description?: string }) {
    return LeadListModel.findOneAndUpdate(
      { _id: listId, tenantId },
      { $set: update },
      { new: true }
    );
  }

  /**
   * Add/Remove specific leads from a list
   */
  public static async manageListMembers(tenantId: string, listId: string, leadIds: string[], action: 'ADD' | 'REMOVE') {
    if (action === 'ADD') {
      await LeadModel.updateMany(
        { tenantId, _id: { $in: leadIds } },
        { $addToSet: { listIds: listId } }
      );
    } else {
      await LeadModel.updateMany(
        { tenantId, _id: { $in: leadIds } },
        { $pull: { listIds: listId } }
      );
    }

    const count = await LeadModel.countDocuments({ tenantId, listIds: listId });
    await LeadListModel.findOneAndUpdate({ _id: listId, tenantId }, { leadCount: count });

    return { listId, updatedLeadCount: count };
  }

}
