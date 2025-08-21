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

function mapRow(hdr: string[], row: any[]): ComponentRecord | null {
  if (!row[0]) return null;
  const o: any = {};
  hdr.forEach((h, i) => {
    const key = String(h || '').trim();
    if (!key) return;
    o[key.replace(/\s+/g,'_')] = row[i];
  });
  if (!o.ID) o.ID = String(row[0]);
  if (o.Default_Qty != null) o.Default_Qty = Number(o.Default_Qty) || 0;
  if (o.Sort_Order != null) o.Sort_Order = Number(o.Sort_Order) || 0;
  return o as ComponentRecord;
}

export function readLibrary(): ComponentRecord[] {
  const sh = ss(SHEET_LIB);
  const values = sh.getRange(1,1, sh.getLastRow(), sh.getLastColumn()).getValues();
  if (!values.length) return [];
  const [hdr, ...rows] = values as any[];
  const out: ComponentRecord[] = [];
  rows.forEach(r => {
    const rec = mapRow(hdr, r as any[]);
    if (rec) out.push(rec);
  });
  return out;
}

export function visibleFor(cfg: PanelConfig, rec: ComponentRecord): boolean {
  const cond = (rec.Visibility_Condition || '').trim();
  if (!cond) return true;
  // very small expression support: key=value AND key!=value
  const clauses = cond.split(/\s*AND\s*/i);
  return clauses.every((c)=>{
    const mNe = c.match(/^([A-Za-z0-9_]+)\s*!=\s*(.+)$/);
    if (mNe) {
      const k = mNe[1] as keyof PanelConfig; const v = mNe[2];
      return String((cfg as any)[k] ?? '').toLowerCase() !== String(v).toLowerCase();
    }
    const mEq = c.match(/^([A-Za-z0-9_]+)\s*=\s*(.+)$/);
    if (mEq) {
      const k = mEq[1] as keyof PanelConfig; const v = mEq[2];
      return String((cfg as any)[k] ?? '').toLowerCase() === String(v).toLowerCase();
    }
    return true; // unknown clause -> ignore
  });
}

// Token syntax: ${TOKEN}
export function renderTokens(body: string, cfg: PanelConfig): string {
  if (!body) return '';
  return body.replace(/\$\{\s*([A-Za-z0-9_]+)\s*\}/g, (_m, k) => {
    const key = String(k).toUpperCase();
    // Map standard tokens to config keys
    const map: Record<string, keyof PanelConfig> = {
      'SERVICE_VOLTAGE': 'serviceVoltage',
      'PHASE': 'phase',
      'CONTROL_VOLTAGE': 'controlVoltage',
      'PLATFORM': 'platform',
      'HMI_SIZE': 'hmiSize',
      'PANEL_TYPE': 'panelType'
    };
    const cfgKey = map[key] as keyof PanelConfig | undefined;
    const val = cfgKey ? (cfg as any)[cfgKey] : (cfg as any)[k];
    return String(val ?? '');
  });
}
