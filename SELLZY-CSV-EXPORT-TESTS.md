# Sellzy — CSV Export & Formula Injection Security Verification

## 1. Canonical 11-Column Header Specification
Both Email Grabber and Email Sender exports generate the exact 11 columns in canonical order:
1. `Email`
2. `First Name`
3. `Last Name`
4. `Company`
5. `Website`
6. `Industry`
7. `Country`
8. `State`
9. `City`
10. `Source URL`
11. `Verification Status`

## 2. CSV Formula Injection Defense
Untrusted cell contents beginning with any of the dangerous characters (`=`, `+`, `-`, `@`, `\t`, `\r`) are automatically escaped with a prepended single quote (`'`).

### Test Evidence
In `tests/country_email_collection.test.ts`:
- Input Payload: `=cmd|/c calc!A0`
- Sanitized Output in CSV: `'=cmd|/c calc!A0`
- Verification: Passed (Test 4.1).

## 3. Filename Convention
Exported files follow the standardized naming format:
`Sellzy-[COUNTRY]-Emails-[YYYY-MM-DD].csv`

Example: `Sellzy-GB-Emails-2026-11-01.csv`
