import { CANONICAL_LEAD_HEADERS, ISchemaValidationResult } from '@sellzy/shared';

export interface IParsedSpreadsheet {
  headers: string[];
  rows: Array<Record<string, string>>;
  totalRows: number;
  preview: Array<Record<string, string>>;
  schemaValidation: ISchemaValidationResult;
  isCanonical: boolean;
}

export class SpreadsheetParserService {
  public static MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  public static MAX_ROW_LIMIT = 5000;

  /**
   * Sanitizes spreadsheet cell output to prevent CSV / Formula Injection
   * Cells starting with =, +, -, @, \t, or \r are prefixed with a single quote.
   */
  public static sanitizeCellForExport(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val);
    const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
    if (dangerousPrefixes.some(prefix => str.startsWith(prefix))) {
      return `'${str}`;
    }
    return str;
  }

  /**
   * Validates header names and exact ordering against the shared canonical schema.
   */
  public static validateHeadersAgainstCanonical(headers: string[]): ISchemaValidationResult {
    const expected = CANONICAL_LEAD_HEADERS;
    const actual = headers.map(h => h.trim());

    const missingHeaders = expected.filter(exp => !actual.includes(exp));
    const extraHeaders = actual.filter(act => !(expected as readonly string[]).includes(act));

    // Check exact order
    let orderMismatch = false;
    if (missingHeaders.length === 0 && actual.length === expected.length) {
      for (let i = 0; i < expected.length; i++) {
        if (actual[i] !== expected[i]) {
          orderMismatch = true;
          break;
        }
      }
    } else {
      orderMismatch = true;
    }

    const isValid = missingHeaders.length === 0 && extraHeaders.length === 0 && !orderMismatch;

    return {
      isValid,
      missingHeaders,
      extraHeaders,
      orderMismatch,
      actualHeaders: actual,
      expectedHeaders: expected
    };
  }

  /**
   * Parses CSV string content into headers and key-value records with canonical schema validation.
   */
  public static parseCsv(content: string): IParsedSpreadsheet {
    if (!content || typeof content !== 'string') {
      const validation = this.validateHeadersAgainstCanonical([]);
      return { headers: [], rows: [], totalRows: 0, preview: [], schemaValidation: validation, isCanonical: false };
    }

    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) {
      const validation = this.validateHeadersAgainstCanonical([]);
      return { headers: [], rows: [], totalRows: 0, preview: [], schemaValidation: validation, isCanonical: false };
    }

    // Split headers by comma handling quotes
    const headers = this.parseCsvLine(lines[0]).map(h => h.trim());
    const schemaValidation = this.validateHeadersAgainstCanonical(headers);
    const rows: Array<Record<string, string>> = [];

    const rowLimit = Math.min(lines.length - 1, this.MAX_ROW_LIMIT);
    for (let i = 1; i <= rowLimit; i++) {
      const values = this.parseCsvLine(lines[i]);
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = (values[index] || '').trim();
      });
      rows.push(record);
    }

    return {
      headers,
      rows,
      totalRows: rows.length,
      preview: rows.slice(0, 5),
      schemaValidation,
      isCanonical: schemaValidation.isValid
    };
  }

  private static parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
}
