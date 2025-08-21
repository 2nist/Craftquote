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
export function num(x: any): number { const n = Number(x); return isNaN(n) ? 0 : n; }
