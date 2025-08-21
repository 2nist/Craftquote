import { SHEET_LIB, ss } from "./utils";
import { PanelConfig } from "./config";

export interface ComponentRecord {
  ID: string;
  Category?: string;
  Name?: string;
  Body?: string;
  Tokens?: string;
  Visibility_Condition?: string;
  Mutual_Exclusion_Key?: string;
  Depends_On?: string;
  Default_Qty?: number;
  Sort_Order?: number;
  Notes?: string;
}

export function readLibrary(): ComponentRecord[] {
  const sh = ss(SHEET_LIB);
  const values = sh.getRange(1,1, sh.getLastRow(), sh.getLastColumn()).getValues();
  if (!values.length) return [];
  const [hdr, ...rows] = values as any[];
  const out: ComponentRecord[] = [];
  rows.forEach((r: any[]) => {
    if (!r[0]) return;
    const idx = (name: string) => hdr.indexOf(name);
    const toNum = (val: any) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    };
    const rec: ComponentRecord = {
      ID: String(r[idx('ID')] ?? r[0] ?? '').trim(),
      Category: (String(r[idx('Category')] ?? '').trim() || undefined),
      Name: (String(r[idx('Name')] ?? '').trim() || undefined),
      Body: (String(r[idx('Body')] ?? '').trim() || undefined),
      Tokens: (String(r[idx('Tokens')] ?? '').trim() || undefined),
      Visibility_Condition: (String(r[idx('Visibility_Condition')] ?? '').trim() || undefined),
      Mutual_Exclusion_Key: (String(r[idx('Mutual_Exclusion_Key')] ?? '').trim() || undefined),
      Depends_On: (String(r[idx('Depends_On')] ?? '').trim() || undefined),
      Default_Qty: toNum(r[idx('Default_Qty')]),
      Sort_Order: toNum(r[idx('Sort_Order')]),
      Notes: (String(r[idx('Notes')] ?? '').trim() || undefined),
    };
    out.push(rec);
  });
  return out;
}

export function sortLibrary(recs: ComponentRecord[]): ComponentRecord[] {
  return [...recs].sort((a, b) => (a.Sort_Order ?? 0) - (b.Sort_Order ?? 0));
}

export function filterVisible(recs: ComponentRecord[], _cfg?: PanelConfig): ComponentRecord[] {
  // Placeholder for rules evaluation
  return recs;
}
