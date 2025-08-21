export const SHEET_CFG = 'Panel_Config';
export const SHEET_LIB = 'Component_Library';
export const SHEET_QB  = 'Quote_Builder';

export function ss(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error(`Sheet not found: ${name}`);
  return sh;
}
export function v(sh: GoogleAppsScript.Spreadsheet.Sheet, a1: string): string {
  return sh.getRange(a1).getDisplayValue().trim();
}
export function num(x: unknown): number { const n = Number(x as any); return isNaN(n) ? 0 : n; }

// Find value by label in column A (label) -> column B (value)
export function findCfgLabel(label: string): string | undefined {
  const sh = ss(SHEET_CFG);
  const last = Math.min(200, sh.getLastRow());
  for (let r=1; r<=last; r++) {
    const a = sh.getRange(r,1).getDisplayValue().trim();
    if (a && a.toLowerCase() === label.toLowerCase()) {
      const b = sh.getRange(r,2).getDisplayValue().trim();
      return b || undefined;
    }
  }
  return undefined;
}
