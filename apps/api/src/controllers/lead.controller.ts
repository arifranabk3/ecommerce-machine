import { AuditLogModel } from '../models/AuditLog';
import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/LeadService';
import { LeadMatchingService } from '../services/LeadMatchingService';
import { SpreadsheetParserService } from '../services/SpreadsheetParserService';
import { LeadModel } from '../models/Lead';
import { ImportJobModel } from '../models/ImportJob';
import { CampaignModel } from '../models/Campaign';
import { CampaignRecipientModel } from '../models/CampaignRecipient';
import { EmailSuppressionModel } from '../models/EmailSuppression';
import { CampaignStatus, CampaignRecipientStatus, CommunicationChannel, IImportColumnMapping, CANONICAL_LEAD_HEADERS } from '@sellzy/shared';

export class LeadController {
  /**
   * Stage 1: Collect US business leads based on filters and save to list
   * Strictly read & save only. ZERO messages sent.
   */
  public static async collectLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const storeId = (req as any).storeId || (req.headers['x-store-id'] as string);
      const { state, city, industry, keywords, businessName, limit, targetListId } = req.body;

      const result = await LeadService.collectAndSaveLeads(
        tenantId,
        { state, city, industry, keywords, businessName, limit },
        targetListId,
        storeId
      );

      res.status(200).json({
        success: true,
        message: 'Leads collected, validated, and saved successfully. Zero emails sent.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get paginated saved leads
   */
  public static async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { listId, verificationStatus, state, industry, search, page, limit } = req.query;

      const result = await LeadService.getLeads(tenantId, {
        listId: listId as string,
        verificationStatus: verificationStatus as any,
        state: state as string,
        industry: industry as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20
      });

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Export leads to CSV with Formula Injection Defense
   */
  public static async exportLeadsCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { listId } = req.query;

      const query: Record<string, any> = { tenantId };
      if (listId) query.listIds = listId;

      const leads = await LeadModel.find(query).sort({ collectedAt: -1 }).limit(1000);

      // Construct clean CSV using shared canonical lead headers in exact order
      // 1. Email, 2. First Name, 3. Last Name, 4. Company, 5. Website, 6. Industry, 7. Country, 8. State, 9. City, 10. Source URL, 11. Verification Status
      const headers = [...CANONICAL_LEAD_HEADERS];
      const rows = leads.map(l => [
        `"${SpreadsheetParserService.sanitizeCellForExport(l.email || '').replace(/"/g, '""')}"`,
        `""`, // First Name (optional)
        `""`, // Last Name (optional)
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

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="leads_export_${Date.now()}.csv"`);
      res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Bulk import leads from CSV
   */
  public static async importLeadsCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const storeId = (req as any).storeId || (req.headers['x-store-id'] as string);
      const { records, targetListId } = req.body;

      if (!Array.isArray(records)) {
        res.status(400).json({ error: 'records array is required' });
        return;
      }

      const result = await LeadService.importLeadsFromCsv(tenantId, records, targetListId, storeId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Upload & Parse Excel / CSV Spreadsheet for Preview and Column Mapping
   */
  public static async parseSpreadsheetUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fileContent, fileName } = req.body;

      if (!fileContent || typeof fileContent !== 'string') {
        res.status(400).json({ error: 'fileContent (CSV / TSV text) is required' });
        return;
      }

      if (Buffer.byteLength(fileContent, 'utf8') > SpreadsheetParserService.MAX_FILE_SIZE_BYTES) {
        res.status(400).json({ error: 'File size exceeds maximum permitted limit (10MB)' });
        return;
      }

      const parsed = SpreadsheetParserService.parseCsv(fileContent);

      res.status(200).json({
        success: true,
        fileName: fileName || 'uploaded_list.csv',
        headers: parsed.headers,
        totalRows: parsed.totalRows,
        preview: parsed.preview,
        schemaValidation: parsed.schemaValidation,
        isCanonical: parsed.isCanonical
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Match Imported Dataset Against Collected CRM Leads
   * Returns: exact_match, grabbed_only, excel_only, duplicate_in_file, invalid_email, suppressed
   * ZERO messages sent.
   */
  public static async matchImportedDataset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const storeId = (req as any).storeId || (req.headers['x-store-id'] as string);
      const { fileName, fileSize, rows, mapping } = req.body;

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(400).json({ error: 'rows array is required and must not be empty' });
        return;
      }

      // Automatic zero-friction mapping if canonical schema is used
      let effectiveMapping = mapping;
      if (!effectiveMapping || Object.keys(effectiveMapping).length === 0) {
        // Auto-map canonical headers directly
        if (rows.length > 0 && ('Email' in rows[0] || 'email' in rows[0])) {
          effectiveMapping = {
            email: 'Email' in rows[0] ? 'Email' : 'email',
            companyName: 'Company' in rows[0] ? 'Company' : undefined,
            website: 'Website' in rows[0] ? 'Website' : undefined,
            firstName: 'First Name' in rows[0] ? 'First Name' : undefined,
            lastName: 'Last Name' in rows[0] ? 'Last Name' : undefined,
            phone: 'Phone' in rows[0] ? 'Phone' : undefined,
            city: 'City' in rows[0] ? 'City' : undefined,
            state: 'State' in rows[0] ? 'State' : undefined,
            industry: 'Industry' in rows[0] ? 'Industry' : undefined,
            source: 'Source URL' in rows[0] ? 'Source URL' : undefined
          };
        }
      }

      if (!effectiveMapping || !effectiveMapping.email) {
        res.status(400).json({ error: 'mapping with email column is required' });
        return;
      }

      const matchingSummary = await LeadMatchingService.matchDatasets(tenantId, rows, effectiveMapping as IImportColumnMapping);

      // Persist import job record
      const importJob = await ImportJobModel.create({
        tenantId,
        storeId,
        fileName: fileName || 'import.csv',
        fileSize: fileSize || 1024,
        totalRows: matchingSummary.totalImportedRows,
        validRows: matchingSummary.validRows,
        invalidRows: matchingSummary.invalidRows,
        duplicateRows: matchingSummary.duplicateInFileRows,
        exactMatchRows: matchingSummary.exactMatchRows,
        excelOnlyRows: matchingSummary.excelOnlyRows,
        grabbedOnlyRows: matchingSummary.grabbedOnlyRows,
        suppressedRows: matchingSummary.suppressedRows,
        mapping
      });

      res.status(200).json({
        success: true,
        message: 'Dataset matching completed successfully. Zero emails sent.',
        jobId: (importJob._id as any).toString(),
        summary: matchingSummary
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Export Matching Results Report to CSV
   */
  public static async exportMatchingReportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { records } = req.body;

      if (!Array.isArray(records)) {
        res.status(400).json({ error: 'records array is required' });
        return;
      }

      const headers = ['Row Number', 'Original Email', 'Normalized Email', 'Company Name', 'Website', 'Matching Status', 'Reason'];
      const rows = records.map((r: any) => [
        `"${SpreadsheetParserService.sanitizeCellForExport(r.rowNumber)}"`,
        `"${SpreadsheetParserService.sanitizeCellForExport(r.originalEmail).replace(/"/g, '""')}"`,
        `"${SpreadsheetParserService.sanitizeCellForExport(r.normalizedEmail).replace(/"/g, '""')}"`,
        `"${SpreadsheetParserService.sanitizeCellForExport(r.companyName || '').replace(/"/g, '""')}"`,
        `"${SpreadsheetParserService.sanitizeCellForExport(r.website || '').replace(/"/g, '""')}"`,
        `"${SpreadsheetParserService.sanitizeCellForExport(r.status)}"`,
        `"${SpreadsheetParserService.sanitizeCellForExport(r.reason).replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="matching_report_${Date.now()}.csv"`);
      res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Saved Lead Lists CRUD
   */
  public static async createList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const storeId = (req as any).storeId || (req.headers['x-store-id'] as string);
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({ error: 'name is required' });
        return;
      }

      const list = await LeadService.createList(tenantId, name, description, storeId);
      res.status(201).json({ success: true, data: list });
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ error: 'A list with this name already exists' });
        return;
      }
      next(err);
    }
  }

  public static async getLists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const lists = await LeadService.getLists(tenantId);
      res.status(200).json({ success: true, data: lists });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const list = await LeadService.deleteList(tenantId, id);
      if (!list) {
        res.status(404).json({ error: 'List not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'List deleted' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Stage 2: Create a manual campaign draft from selected saved leads or an entire list.
   * STRICT SAFETY GATE: Campaign is created in DRAFT / PENDING_APPROVAL.
   * Sending requires explicit subsequent approval.
   */
  public static async createCampaignFromLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || (req as any).user?.id || 'system';
      const storeId = (req as any).storeId || (req.headers['x-store-id'] as string);
      const { name, listId, leadIds, subject, content, senderName, senderEmail, physicalPostalAddress } = req.body;

      if (!name || !subject || !content) {
        res.status(400).json({ error: 'name, subject, and content are required' });
        return;
      }

      if (!physicalPostalAddress) {
        res.status(400).json({ error: 'CAN-SPAM compliance requires a valid physical postal address for commercial outreach' });
        return;
      }

      // Query eligible leads
      const query: Record<string, any> = { tenantId };
      if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
        query._id = { $in: leadIds };
      } else if (listId) {
        query.listIds = listId;
      } else {
        res.status(400).json({ error: 'Either leadIds array or listId is required' });
        return;
      }

      const leads = await LeadModel.find(query);
      if (leads.length === 0) {
        res.status(400).json({ error: 'No leads found matching criteria' });
        return;
      }

      // Filter out any suppressed leads
      const suppressions = await EmailSuppressionModel.find({
        tenantId,
        normalizedEmail: { $in: leads.map(l => l.normalizedEmail) }
      });
      const suppressedSet = new Set(suppressions.map(s => s.normalizedEmail));

      const eligibleLeads = leads.filter(l => !suppressedSet.has(l.normalizedEmail));

      // Create Campaign in DRAFT status
      const campaign = await CampaignModel.create({
        tenantId,
        storeId,
        name,
        channel: CommunicationChannel.EMAIL,
        status: CampaignStatus.DRAFT,
        audienceFilter: { leadListId: listId, count: eligibleLeads.length },
        messageContent: `${content}\n\n---\n${physicalPostalAddress}\nTo unsubscribe, reply STOP or click here: {{unsubscribe_url}}`,
        createdBy: userId,
        statistics: {
          totalRecipients: eligibleLeads.length,
          sentCount: 0,
          deliveredCount: 0,
          failedCount: 0
        }
      });

      // Prepare campaign recipient records
      const recipients = eligibleLeads.map(l => ({
        tenantId,
        campaignId: (campaign._id as any).toString(),
        customerId: `lead_${(l._id as any).toString()}`,
        recipientEmail: l.email,
        status: CampaignRecipientStatus.PENDING
      }));

      if (recipients.length > 0) {
        await CampaignRecipientModel.insertMany(recipients);
      }

      res.status(201).json({
        success: true,
        message: 'Campaign draft created. Requires explicit approval before any emails can be dispatched.',
        data: {
          campaignId: (campaign._id as any).toString(),
          status: campaign.status,
          totalEligibleLeads: eligibleLeads.length,
          suppressedCount: suppressions.length,
          senderIdentity: { senderName, senderEmail },
          physicalPostalAddress
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Explicit approval endpoint for campaign dispatch
   */
  public static async approveCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || (req as any).user?.id || 'admin';
      const { id } = req.params;

      const campaign = await CampaignModel.findOne({ _id: id, tenantId });
      if (!campaign) {
        res.status(404).json({ error: 'Campaign not found' });
        return;
      }

      if (campaign.status !== CampaignStatus.DRAFT && campaign.status !== CampaignStatus.PENDING_APPROVAL) {
        res.status(400).json({ error: `Cannot approve campaign in status ${campaign.status}` });
        return;
      }

      campaign.status = CampaignStatus.APPROVED;
      campaign.approvedBy = userId;
      await campaign.save();

      res.status(200).json({
        success: true,
        message: 'Campaign explicitly approved for sending.',
        data: campaign
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Add email to suppression list
   */
  public static async addSuppression(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { email, reason, source } = req.body;

      if (!email) {
        res.status(400).json({ error: 'email is required' });
        return;
      }

      const result = await LeadService.suppressEmail(tenantId, email, reason || 'MANUAL', source);
      res.status(200).json({ success: true, message: 'Email suppressed successfully', data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Lead Generation Overview Analytics & Metrics
   */
  public static async getLeadOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const data = await LeadService.getLeadOverview(tenantId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Grab Emails from Domains (Domain Email Grabber)
   */
  public static async grabEmails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || (req as any).user?.id || 'system';
      const storeId = (req as any).storeId || (req.headers['x-store-id'] as string);
      const { domains, targetListId } = req.body;

      if (!Array.isArray(domains) || domains.length === 0) {
        res.status(400).json({ error: 'domains array is required and must not be empty' });
        return;
      }

      const result = await LeadService.grabEmailsFromDomains(tenantId, domains, targetListId, storeId);

      // Audit Log Entry
      await AuditLogModel.create({
        tenantId,
        actorUserId: userId,
        action: 'LEAD_GRABBER_EXECUTE',
        resourceType: 'LEAD_GRABBER',
        resourceId: targetListId || 'all',
        source: 'API',
        result: 'SUCCESS',
        metadata: {
          processedDomains: domains.length,
          collectedCount: result.collectedCount,
          duplicateCount: result.duplicateCount
        }
      });

      res.status(200).json({
        success: true,
        message: 'Domain emails grabbed successfully with source attribution. Status set to unverified.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Batch Email Verification
   */
  public static async verifyBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || (req as any).user?.id || 'system';
      const { leadIds, targetStatus } = req.body;

      const result = await LeadService.verifyBatchLeads(tenantId, leadIds, targetStatus);

      // Audit Log Entry
      await AuditLogModel.create({
        tenantId,
        actorUserId: userId,
        action: 'EMAIL_VERIFICATION_BATCH',
        resourceType: 'EMAIL_VERIFICATION',
        resourceId: 'batch',
        source: 'API',
        result: 'SUCCESS',
        metadata: {
          totalProcessed: result.totalProcessed
        }
      });

      res.status(200).json({
        success: true,
        message: 'Batch email verification completed.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update List Details
   */
  public static async updateList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || (req as any).user?.id || 'system';
      const { id } = req.params;
      const { name, description } = req.body;

      const list = await LeadService.updateList(tenantId, id, { name, description });
      if (!list) {
        res.status(404).json({ error: 'Lead list not found' });
        return;
      }

      await AuditLogModel.create({
        tenantId,
        actorUserId: userId,
        action: 'LEAD_LIST_UPDATE',
        resourceType: 'LEAD_LIST',
        resourceId: id,
        source: 'API',
        result: 'SUCCESS',
        metadata: { name, description }
      });

      res.status(200).json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Manage List Members (Add or Remove leads)
   */
  public static async manageListMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const { leadIds, action } = req.body;

      if (!Array.isArray(leadIds) || leadIds.length === 0 || !['ADD', 'REMOVE'].includes(action)) {
        res.status(400).json({ error: 'leadIds array and valid action (ADD | REMOVE) are required' });
        return;
      }

      const result = await LeadService.manageListMembers(tenantId, id, leadIds, action);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

}
