import { readLibrary, visibleFor, renderTokens, ComponentRecord } from './library';
import { PanelConfig } from './config';

export interface QuoteBlock {
  id: string;
  body: string;
  category?: string;
  sort?: number;
}

export function addComponentById(cfg: PanelConfig, id: string): QuoteBlock | null {
  const rec = readLibrary().find(r => String(r.ID).trim() === String(id).trim());
  if (!rec) return null;
  if (!visibleFor(cfg, rec)) return null;
  const body = renderTokens(rec.Body || rec.Name || '', cfg).trim();
  if (!body) return null;
  return { id: rec.ID, body, category: rec.Category, sort: rec.Sort_Order ?? 0 };
}

export function getQuoteBodyBlocks(cfg: PanelConfig): QuoteBlock[] {
  const all = readLibrary();
  const visible = all.filter(r => visibleFor(cfg, r));
  const byId = new Map<string, ComponentRecord>();
  visible.forEach(r => byId.set(String(r.ID).trim(), r));
  // duplicate key prevention for Mutual_Exclusion_Key (keep first lowest sort)
  const taken = new Set<string>();
  const blocks: QuoteBlock[] = [];
  visible.sort((a,b)=> (a.Sort_Order||0) - (b.Sort_Order||0)).forEach(rec=>{
    const mx = (rec.Mutual_Exclusion_Key || '').trim();
    if (mx) {
      if (taken.has(mx)) return;
      taken.add(mx);
    }
    const deps = String(rec.Depends_On || '').trim();
    if (deps) {
      const ok = deps.split(/[,;]+/).map(s=>s.trim()).filter(Boolean).every(did => byId.has(did));
      if (!ok) return; // dependency missing or not visible
    }
    const body = renderTokens(rec.Body || rec.Name || '', cfg).trim();
    if (!body) return;
    blocks.push({ id: rec.ID, body, category: rec.Category, sort: rec.Sort_Order ?? 0 });
  });
  return blocks;
}

export function sortQuote(xs: QuoteBlock[]): QuoteBlock[] {
  return [...xs].sort((a,b)=> (a.sort||0) - (b.sort||0));
}
