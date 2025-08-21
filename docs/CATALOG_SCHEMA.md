# Catalog Schema and UI/Backend Contract

Purpose: make the Catalog work end-to-end with the Hybrid Assembler. This doc defines the data shapes, how they’re stored, searched, edited, and rendered.

## Entities

- Component: the atomic item in the Master Catalog (one row per component).
- Assembly: a curated set of components with quantities and metadata.
- Product Template: a top-level quote template that pre-fills configuration and one or more assemblies.

## Component

Required columns in Master Catalog sheet (canonical names; the importer can map alternative headers):

- id: stable string id (if blank, derive from Part Number or Name)
- name: display name
- description: brief text
- partNumber: vendor or internal P/N
- category: normalized category (e.g., PLC, VFD, Enclosure)
- subcategory: optional
- manufacturer: optional
- price: number (USD)
- uom: unit of measure, e.g., EA
- voltage: optional (e.g., 24VDC, 120VAC, 480VAC)
- tags: pipe- or comma-delimited keywords

Validation:

- price must be a finite number >= 0.
- name, category, and either partNumber or id must be present.

Client shape returned from backend searchComponents(term, limit?):
{
  success: boolean,
  components: Array<{
    id: string,
    name: string,
    description?: string,
    category: string,
    subcategory?: string,
    manufacturer?: string,
    partNumber?: string,
    price: number,
    uom?: string,
    voltage?: string,
    tags?: string[]
  }>
}

## Assembly

- id: stable string id
- name: display name
- category: e.g., Motor Control, Safety Systems, HMI Package
- description: brief text
- components: Array<{ componentId: string, qty: number }>
- pricing:
  - componentTotal (computed)
  - laborHours? (optional)
  - laborRate? (optional)
  - overheadPct? (optional)
  - marginPct? (optional)

Client shape returned from searchAssembliesForQuoteBuilder(term):
{
  success: boolean,
  results: Array<{
    id: string,
    name: string,
    category: string,
    description?: string,
    componentCount: number,
    totalCost: number,
    components?: Array<{ id: string, name: string, cost?: number, qty?: number }>
  }>
}

Notes:

- Backend may store assemblies in a separate sheet or JSON; search should match on name, category, tags.
- totalCost should include componentTotal and optional labor/overhead if available.

## Product Template

- code: short code shown in Product Code dropdown (e.g., BHAC, DTAC, CPAC)
- name: friendly name
- defaultConfig: { categoryCode?: string, voltage?: string, notes?: string }
- assemblies: Array<{ assemblyId: string, qty: number }>

Client shape returned by listProductTemplates():
{
  success: boolean,
  templates: Array<{
    code: string,
    name: string,
    defaultConfig?: { categoryCode?: string, voltage?: string, notes?: string },
    priceHint?: number
  }>
}

Contract used by UI when a template is selected (loadTemplate(code)):

- Backend returns build sheet: initial assemblies/components and config.
{
  success: boolean,
  template: {
    code: string,
    name: string,
    config?: { categoryCode?: string, voltage?: string },
    assemblies: Array<{
      id: string,
      name: string,
      qty: number,
      components: Array<{ id: string, name: string, qty: number, price: number }>
    }>
  }
}

## Search Behavior

- Components:
  - Index across name, description, partNumber, category, tags, voltage.
  - Minimum 2 characters before running search.
  - Limit results (default 20–50); paginate if necessary.

- Assemblies:
  - Index across name, category, description, tags.
  - Minimum 2 characters.
  - Return lightweight rows in list, expand to full on demand (expandAssembly).

Edge cases:

- Empty/null values are normalized to '' in UI; price defaults to 0 for formatting, not persistence.
- Very large datasets: cap results and show counts; consider streaming later.

## Editing & Implementation

- Components added to quote are kept in memory (quoteData.components) with fields: { id, name, qty, price, partNumber?, category? }.
- Assembly add performs a bulk add of its components with qty multiplier.
- Edits within the canvas update the local model and re-render totals; persistence to Sheets occurs when Generate Quote or Save as Template is invoked.

Server calls used by the UI (current and near-term):

- searchComponents(term: string, limit?: number)
- searchAssembliesForQuoteBuilder(term: string)
- listProductTemplates() — for the Product Code dropdown
- loadProductTemplate(code: string)
- expandAssemblyForQuoteBuilder(assemblyId: string) — optional; may piggyback on load
- generateQuoteFromHybridData(payload) — writes a professional quote sheet

## CSV Importer Expectations

- Accepts a CSV with mappable headers into the Component shape above.
- Deduplicates by partNumber or id; updates existing, inserts new.
- Writes to Master Catalog sheet with canonical header row.

## Success Criteria

- Product Code dropdown populates from listProductTemplates().
- Category does not auto-set unless UI flag is true.
- Search returns relevant components/assemblies from imported data within ~300ms–2s.
- Adding items updates counts and totals in the canvas; Generate Quote writes rows into the spreadsheet.

## Next Steps Checklist

- [ ] Confirm backend function names match this contract (HybridAssemblerBackend.gs).
- [ ] Ensure importer writes canonical headers.
- [ ] Implement listProductTemplates() and loadTemplate() if not present.
- [ ] Validate component search against real catalog data after CSV import.
- [ ] Wire Generate Quote to write to the current sheet with proper formatting.
