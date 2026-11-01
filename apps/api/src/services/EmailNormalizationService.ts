export class EmailNormalizationService {
  /**
   * Safely normalizes an email address for matching and database storage.
   * Rules:
   * - Trim surrounding whitespace.
   * - Lowercase the domain.
   * - Lowercase local part while preserving intentional user mailbox characters.
   * - Does NOT remove plus-tags or universal dots destructively.
   */
  public static normalize(email: string): { normalized: string; original: string; isValid: boolean; domain: string } {
    if (!email || typeof email !== 'string') {
      return { normalized: '', original: '', isValid: false, domain: '' };
    }

    const original = email.trim();
    if (!original.includes('@')) {
      return { normalized: original.toLowerCase(), original, isValid: false, domain: '' };
    }

    const parts = original.split('@');
    if (parts.length !== 2) {
      return { normalized: original.toLowerCase(), original, isValid: false, domain: '' };
    }

    const localPart = parts[0].trim();
    const domainPart = parts[1].trim().toLowerCase();

    // Standard RFC check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    const normalized = `${localPart.toLowerCase()}@${domainPart}`;
    const isValid = emailRegex.test(normalized) && normalized.length <= 254;

    return {
      normalized,
      original,
      isValid,
      domain: domainPart
    };
  }
}

