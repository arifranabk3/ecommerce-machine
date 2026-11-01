import { LeadModel } from '../models/Lead';
import { EmailSuppressionModel } from '../models/EmailSuppression';
import { EmailNormalizationService } from './EmailNormalizationService';
import { EmailVerificationService } from './EmailVerificationService';
import { MatchResultStatus, IMatchRecord, IImportColumnMapping } from '@sellzy/shared';

export interface IMatchingSummary {
  totalImportedRows: number;
  validRows: number;
  invalidRows: number;
  duplicateInFileRows: number;
  exactMatchRows: number;
  excelOnlyRows: number;
  grabbedOnlyRows: number;
  suppressedRows: number;
  records: IMatchRecord[];
  grabbedOnlyLeads: Array<{
    id: string;
    companyName: string;
    email: string;
    state?: string;
    industry?: string;
  }>;
}

export class LeadMatchingService {
  /**
   * Compares an imported spreadsheet dataset against existing collected leads and suppression records.
   * STRICT SAFETY GUARANTEE: This method is strictly read-only and analytical. ZERO messages are sent.
   */
  public static async matchDatasets(
    tenantId: string,
    rawRows: Array<Record<string, string>>,
    mapping: IImportColumnMapping
  ): Promise<IMatchingSummary> {
    const emailKey = mapping.email;
    const companyKey = mapping.companyName;
    const websiteKey = mapping.website;

    const seenInFile = new Set<string>();
    const matchedRecords: IMatchRecord[] = [];

    let validRows = 0;
    let invalidRows = 0;
    let duplicateInFileRows = 0;
    let exactMatchRows = 0;
    let excelOnlyRows = 0;
    let suppressedRows = 0;

    // 1. Fetch all tenant suppressions into memory for rapid matching
    const suppressions = await EmailSuppressionModel.find({ tenantId }).select('normalizedEmail');
    const suppressionSet = new Set(suppressions.map(s => s.normalizedEmail));

    // 2. Fetch all collected leads for tenant
    const collectedLeads = await LeadModel.find({ tenantId });
    const leadMapByEmail = new Map<string, any>();
    const leadMapByDomain = new Map<string, any>();

    collectedLeads.forEach(lead => {
      leadMapByEmail.set(lead.normalizedEmail, lead);
      if (lead.website) {
        try {
          const host = new URL(lead.website.startsWith('http') ? lead.website : `https://${lead.website}`).hostname.replace(/^www\./, '');
          leadMapByDomain.set(host.toLowerCase(), lead);
        } catch (_) {}
      }
    });

    const matchedLeadIds = new Set<string>();

    // 3. Process each row of the imported file
    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index];
      const rawEmail = row[emailKey] || '';
      const companyName = companyKey ? row[companyKey] : undefined;
      const website = websiteKey ? row[websiteKey] : undefined;
      const rowNumber = index + 2; // spreadsheet 1-based index including header

      const { normalized, original, isValid, domain } = EmailNormalizationService.normalize(rawEmail);

      // A. Check Syntax Validity
      if (!isValid) {
        invalidRows++;
        matchedRecords.push({
          rowNumber,
          originalEmail: original,
          normalizedEmail: normalized,
          companyName,
          website,
          status: MatchResultStatus.INVALID_EMAIL,
          reason: 'Email fails RFC 5322 syntax validation'
        });
        continue;
      }

      // B. Check Duplicate in File
      if (seenInFile.has(normalized)) {
        duplicateInFileRows++;
        matchedRecords.push({
          rowNumber,
          originalEmail: original,
          normalizedEmail: normalized,
          companyName,
          website,
          status: MatchResultStatus.DUPLICATE_IN_FILE,
          reason: 'Duplicate address repeated within the uploaded spreadsheet'
        });
        continue;
      }
      seenInFile.add(normalized);
      validRows++;

      // C. Check Suppression
      if (suppressionSet.has(normalized)) {
        suppressedRows++;
        matchedRecords.push({
          rowNumber,
          originalEmail: original,
          normalizedEmail: normalized,
          companyName,
          website,
          status: MatchResultStatus.SUPPRESSED,
          reason: 'Address is present on persistent unsubscribe or suppression list'
        });
        continue;
      }

      // D. Check Exact Match Against Collected Leads
      const matchedLead = leadMapByEmail.get(normalized);
      if (matchedLead) {
        exactMatchRows++;
        matchedLeadIds.add((matchedLead._id as any).toString());

        matchedRecords.push({
          rowNumber,
          originalEmail: original,
          normalizedEmail: normalized,
          companyName: companyName || matchedLead.companyName,
          website: website || matchedLead.website,
          status: MatchResultStatus.EXACT_MATCH,
          reason: 'Normalized email matches an existing collected business lead in your CRM',
          matchedLeadId: (matchedLead._id as any).toString(),
          secondaryIndicators: {
            sameDomain: true,
            sameCompany: companyName ? matchedLead.companyName.toLowerCase() === companyName.toLowerCase() : undefined
          }
        });
        continue;
      }

      // E. Check Secondary Indicators (Same Domain/Website Match only)
      let sameDomain = false;
      if (domain && leadMapByDomain.has(domain)) {
        sameDomain = true;
      }

      // F. Excel Only (Valid lead present in Excel, but not collected yet)
      excelOnlyRows++;
      matchedRecords.push({
        rowNumber,
        originalEmail: original,
        normalizedEmail: normalized,
        companyName,
        website,
        status: MatchResultStatus.EXCEL_ONLY,
        reason: 'Valid email present in uploaded spreadsheet but absent from collected CRM leads',
        secondaryIndicators: {
          sameDomain
        }
      });
    }

    // 4. Identify Grabbed-Only Leads (Leads present in CRM but absent from Excel)
    const grabbedOnlyLeads: Array<{ id: string; companyName: string; email: string; state?: string; industry?: string }> = [];
    collectedLeads.forEach(lead => {
      const leadIdStr = (lead._id as any).toString();
      if (!matchedLeadIds.has(leadIdStr) && !seenInFile.has(lead.normalizedEmail)) {
        grabbedOnlyLeads.push({
          id: leadIdStr,
          companyName: lead.companyName,
          email: lead.email,
          state: lead.state,
          industry: lead.industry
        });
      }
    });

    return {
      totalImportedRows: rawRows.length,
      validRows,
      invalidRows,
      duplicateInFileRows,
      exactMatchRows,
      excelOnlyRows,
      grabbedOnlyRows: grabbedOnlyLeads.length,
      suppressedRows,
      records: matchedRecords,
      grabbedOnlyLeads
    };
  }
}

