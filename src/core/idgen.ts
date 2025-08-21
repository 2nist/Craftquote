import { ss, SHEET_CFG, findCfgLabel, v } from './utils';

export interface BaseNumberOpts { category?: string; product?: string; date?: Date; }

function pad2(n: number): string { return String(n).padStart(2,'0'); }

export function buildBaseQuoteNumber(opts: BaseNumberOpts): string {
  const now = opts.date || new Date();
  const yy = pad2(now.getFullYear() % 100);
  const mm = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());
  const cat = (opts.category || '01').toUpperCase();
  const prod = (opts.product || 'PNLB').toUpperCase();
  return `CQ${yy}${mm}${dd}${cat}${prod}-00`;
}

function readCatProdFromSheet(): {category?: string, product?: string} {
  // Prefer labeled values if present
  const category = findCfgLabel('Category') || undefined;
  const product = findCfgLabel('Product') || undefined;
  return { category, product };
}

export function generateAndStampBaseNumber(): string {
  const sh = ss(SHEET_CFG);
  const { category, product } = readCatProdFromSheet();
  const qn = buildBaseQuoteNumber({ category, product });
  sh.getRange('B3').setValue(qn);
  return qn;
}

export function bumpRevision(qn: string): string {
  const m = qn.match(/^(.*-)(\d{2})$/);
  if (!m) return qn.replace(/-?$/, '-00');
  const base = m[1]; const rev = parseInt(m[2], 10);
  const next = (isNaN(rev) ? 0 : rev + 1);
  return base + String(next).padStart(2, '0');
}

export function incrementRevisionInPlace(): string {
  const sh = ss(SHEET_CFG);
  const cur = v(sh,'B3');
  const next = bumpRevision(cur || '');
  sh.getRange('B3').setValue(next);
  return next;
}
