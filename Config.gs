/**
 * Global configuration and shared constants
 * Centralizes sheet names and the canonical Master Catalog column mapping
 */

// Canonical sheet names
const SHEET_NAMES = {
  MASTER_CATALOG: 'Master Catalog',
  PRODUCT_TEMPLATES: 'Product_Templates',
  OPTIONS: 'Options',
  OPTION_BOM: 'Option_BOM_Mapping',
  QUOTES_DB: 'Quotes_Database'
};

// Canonical Master Catalog header order (A–P core) used across backend
const CANONICAL_HEADERS = [
  'yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'UNIT',
  'VOLT', 'PHASE', 'AMPS', 'ASSEMBLY', 'TAGS', 'NOTES', 'LAST PRICE UPDATE', 'MANUAL Link'
];

// Column map for the canonical schema (0-indexed)
const COLUMN_MAP = {
  yn: 0,
  part: 1,
  description: 2,
  partNum: 3,
  vendor: 4,
  vendorNum: 5,
  cost: 6,
  unit: 7,
  volt: 8,
  phase: 9,
  amps: 10,
  assembly: 11,
  tags: 12,
  notes: 13,
  lastUpdate: 14,
  manualLink: 15
};

/**
 * Derive a column map from a header row, falling back to COLUMN_MAP when needed.
 */
function deriveColumnMapFromHeaders(headers) {
  try {
    if (!Array.isArray(headers) || headers.length === 0) return COLUMN_MAP;

    const lower = headers.map(h => (h || '').toString().trim().toLowerCase());
    const indexOf = (name) => lower.indexOf(name.toLowerCase());

    const map = {
      yn: indexOf('yn'),
      part: indexOf('part'),
      description: indexOf('description'),
      partNum: indexOf('part#'),
      vendor: indexOf('vndr'),
      vendorNum: indexOf('vndr#'),
      cost: indexOf('cost'),
      unit: indexOf('unit'),
      volt: indexOf('volt'),
      phase: indexOf('phase'),
      amps: indexOf('amps'),
      assembly: indexOf('assembly'),
      tags: indexOf('tags'),
      notes: indexOf('notes'),
      lastUpdate: indexOf('last price update'),
      manualLink: indexOf('manual link')
    };

    // If critical fields are missing, fall back to canonical COLUMN_MAP
    if (map.partNum < 0 || map.description < 0 || map.cost < 0) {
      return COLUMN_MAP;
    }
    return map;
  } catch (e) {
    console.log('deriveColumnMapFromHeaders fallback to COLUMN_MAP due to error:', e);
    return COLUMN_MAP;
  }
}
