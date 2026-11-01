import { LeadModel } from '../models/Lead';
import { LeadListModel } from '../models/LeadList';
import { CollectionJobModel, ICollectionJobDocument } from '../models/CollectionJob';
import { EmailSuppressionModel } from '../models/EmailSuppression';
import { EmailVerificationService } from './EmailVerificationService';
import { DataProviderRegistry } from './CountryDataProvider';
import { SpreadsheetParserService } from './SpreadsheetParserService';
import { AuditLogModel } from '../models/AuditLog';
import { 
  CollectionJobStatus, 
  ICollectionJobFilters, 
  CANONICAL_LEAD_HEADERS, 
  LeadVerificationStatus 
} from '@sellzy/shared';

export class CountryLeadService {
  /**
   * Retrieves all supported countries and their active provider status
   */
  public static getSupportedCountries() {
    return DataProviderRegistry.getSupportedCountries();
  }

  /**
   * Create and trigger an asynchronous or synchronous background collection job
   */
  public static async startCollectionJob(
    tenantId: string,
    filters: ICollectionJobFilters,
    storeId?: string,
    actorUserId?: string
  ): Promise<ICollectionJobDocument> {
    const country = (filters.country || '').trim().toUpperCase();

    // 1. Check if provider supports country
    const provider = DataProviderRegistry.getProviderForCountry(country);

    // Initial Job Creation
    const job = await CollectionJobModel.create({
      tenantId,
      storeId,
      country,
      status: provider ? CollectionJobStatus.QUEUED : CollectionJobStatus.FAILED,
      filters,
      totalDiscovered: 0,
      emailsCollected: 0,
      duplicatesSkipped: 0,
      invalidRecords: 0,
      recordsSaved: 0,
      progressPercentage: 0,
      startedAt: new Date(),
      errorDetails: provider ? undefined : `No configured data provider supports this country (${country}).`
    });

    if (!provider) {
      // Log failed audit event
      await AuditLogModel.create({
        tenantId,
        actorUserId: actorUserId || 'system',
        action: 'COLLECTION_JOB_UNSUPPORTED_COUNTRY',
        resourceType: 'COLLECTION_JOB',
        resourceId: (job._id as any).toString(),
        source: 'API',
        result: 'FAILURE',
        metadata: { country, error: job.errorDetails }
      });
      return job;
    }

    // Trigger execution
    this.executeCollectionJobAsync((job._id as any).toString(), tenantId, filters, provider, storeId, actorUserId)
      .catch(err => {
        console.error(`Collection job ${job._id} execution error:`, err);
      });

    return job;
  }

  /**
   * Worker task processor for country collection
   */
  private static async executeCollectionJobAsync(
    jobId: string,
    tenantId: string,
    filters: ICollectionJobFilters,
    provider: any,
    storeId?: string,
    actorUserId?: string
  ): Promise<void> {
    const job = await CollectionJobModel.findOne({ _id: jobId, tenantId });
    if (!job || job.status === CollectionJobStatus.CANCELLED) return;

    job.status = CollectionJobStatus.RUNNING;
    job.progressPercentage = 15;
    await job.save();

    try {
      // Query provider
      const discovered = await provider.discoverLeads({
        country: filters.country,
        industry: filters.industry,
        state: filters.state,
        city: filters.city,
        businessName: filters.businessName,
        website: filters.website,
        limit: filters.maxRecords || 25
      });

      job.totalDiscovered = discovered.length;
      job.progressPercentage = 40;
      await job.save();

      let savedCount = 0;
      let duplicateCount = 0;
      let invalidCount = 0;

      for (let i = 0; i < discovered.length; i++) {
        // Cancellation check
        const freshJob = await CollectionJobModel.findById(jobId);
        if (freshJob?.status === CollectionJobStatus.CANCELLED) {
          return;
        }

        const item = discovered[i];
        const normalizedEmail = (item.email || '').toLowerCase().trim();

        // 1. Syntax check
        if (!EmailVerificationService.isSyntaxValid(normalizedEmail)) {
          invalidCount++;
          continue;
        }

        // 2. Suppression check
        const isSuppressed = await EmailSuppressionModel.findOne({ tenantId, normalizedEmail });
        if (isSuppressed) {
          duplicateCount++;
          continue;
        }

        // 3. Duplicate in tenant check
        const existing = await LeadModel.findOne({ tenantId, normalizedEmail });
        if (existing) {
          duplicateCount++;
          if (filters.targetListId && !existing.listIds?.includes(filters.targetListId)) {
            existing.listIds = existing.listIds || [];
            existing.listIds.push(filters.targetListId);
            await existing.save();
          }
          continue;
        }

        // 4. Verify email
        const verification = await EmailVerificationService.verifyEmail(normalizedEmail);

        // 5. Persist lead
        await LeadModel.create({
          tenantId,
          storeId,
          companyName: item.companyName,
          website: item.website,
          email: item.email,
          normalizedEmail,
          phone: item.phone,
          city: item.city,
          state: item.state,
          country: item.country || filters.country,
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
          listIds: filters.targetListId ? [filters.targetListId] : []
        });

        savedCount++;
        job.progressPercentage = Math.min(95, 40 + Math.floor(((i + 1) / discovered.length) * 55));
        job.recordsSaved = savedCount;
        job.duplicatesSkipped = duplicateCount;
        job.emailsCollected = savedCount;
        job.invalidRecords = invalidCount;
        await job.save();
      }

      // Update list count if target list provided
      if (filters.targetListId && savedCount > 0) {
        await LeadListModel.findOneAndUpdate(
          { _id: filters.targetListId, tenantId },
          { $inc: { leadCount: savedCount } }
        );
      }

      job.status = CollectionJobStatus.COMPLETED;
      job.progressPercentage = 100;
      job.completedAt = new Date();
      job.recordsSaved = savedCount;
      job.duplicatesSkipped = duplicateCount;
      job.invalidRecords = invalidCount;
      job.emailsCollected = savedCount;
      await job.save();

      // Log success audit
      await AuditLogModel.create({
        tenantId,
        actorUserId: actorUserId || 'system',
        action: 'COLLECTION_JOB_COMPLETED',
        resourceType: 'COLLECTION_JOB',
        resourceId: jobId,
        source: 'WORKER',
        result: 'SUCCESS',
        metadata: {
          country: filters.country,
          savedCount,
          duplicateCount,
          totalDiscovered: discovered.length
        }
      });
    } catch (err: any) {
      job.status = CollectionJobStatus.FAILED;
      job.errorDetails = err.message || 'Worker failed executing collection.';
      job.completedAt = new Date();
      await job.save();

      await AuditLogModel.create({
        tenantId,
        actorUserId: actorUserId || 'system',
        action: 'COLLECTION_JOB_FAILED',
        resourceType: 'COLLECTION_JOB',
        resourceId: jobId,
        source: 'WORKER',
        result: 'FAILURE',
        metadata: { error: job.errorDetails }
      });
    }
  }

  /**
   * Cancel an ongoing collection job
   */
  public static async cancelJob(tenantId: string, jobId: string) {
    const job = await CollectionJobModel.findOne({ _id: jobId, tenantId });
    if (!job) return null;

    if (job.status === CollectionJobStatus.QUEUED || job.status === CollectionJobStatus.RUNNING) {
      job.status = CollectionJobStatus.CANCELLED;
      job.errorDetails = 'Job was cancelled by the user.';
      job.completedAt = new Date();
      await job.save();
    }
    return job;
  }

  /**
   * Retry an eligible failed or cancelled collection job
   */
  public static async retryJob(tenantId: string, jobId: string, actorUserId?: string) {
    const job = await CollectionJobModel.findOne({ _id: jobId, tenantId });
    if (!job) return null;

    const provider = DataProviderRegistry.getProviderForCountry(job.country);
    if (!provider) {
      job.status = CollectionJobStatus.FAILED;
      job.errorDetails = `No configured data provider supports this country (${job.country}).`;
      await job.save();
      return job;
    }

    job.status = CollectionJobStatus.QUEUED;
    job.progressPercentage = 0;
    job.errorDetails = undefined;
    job.startedAt = new Date();
    await job.save();

    this.executeCollectionJobAsync(jobId, tenantId, job.filters as any, provider, job.storeId, actorUserId)
      .catch(console.error);

    return job;
  }

  /**
   * Query Job Status & Live Metrics
   */
  public static async getJobStatus(tenantId: string, jobId: string) {
    return CollectionJobModel.findOne({ _id: jobId, tenantId });
  }

  /**
   * List Recent Collection Jobs
   */
  public static async getRecentJobs(tenantId: string, limit = 10) {
    return CollectionJobModel.find({ tenantId }).sort({ createdAt: -1 }).limit(limit);
  }

  /**
   * Formula-Sanitized Canonical CSV Export
   */
  public static async exportCanonicalCsv(
    tenantId: string,
    options: {
      leadIds?: string[];
      listId?: string;
      country?: string;
    }
  ): Promise<{ csvContent: string; filename: string }> {
    const query: Record<string, any> = { tenantId };
    if (options.leadIds && options.leadIds.length > 0) {
      query._id = { $in: options.leadIds };
    } else if (options.listId) {
      query.listIds = options.listId;
    }
    if (options.country) {
      query.country = options.country.toUpperCase();
    }

    const leads = await LeadModel.find(query).sort({ collectedAt: -1 }).limit(10000);

    const headers = [...CANONICAL_LEAD_HEADERS];
    const rows = leads.map(l => [
      `"${SpreadsheetParserService.sanitizeCellForExport(l.email || '').replace(/"/g, '""')}"`,
      `""`,
      `""`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.companyName || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.website || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.industry || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.country || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.state || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.city || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.sourceUrl || l.source || '').replace(/"/g, '""')}"`,
      `"${SpreadsheetParserService.sanitizeCellForExport(l.verificationStatus || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const countryLabel = options.country ? options.country.toUpperCase() : 'All-Countries';
    const filename = `Sellzy-${countryLabel}-Emails-${new Date().toISOString().split('T')[0]}.csv`;

    return { csvContent, filename };
  }
}
