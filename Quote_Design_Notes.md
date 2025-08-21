Quote Generator - Design Notes

Goals:
- Reproduce existing CQ PDF output format as closely as possible
- Make templates modular and data-driven
- Provide simple developer-readable mapping between template sheets and generator

Ideas and Enhancements:
- Use named ranges in reference templates to mark header fields (Company, Contact, Email, Phone, Address, QuoteDate)
- Standardize color palette and typography across templates
- Introduce a master template for header/footer so all templates share branding consistently
- Add a 'render preview' button in the reference spreadsheet to visually inspect generated quotes
- Consider a modern redesign option (Concept) with updated logo and fonts; keep legacy templates for compatibility

Mapping:
- Header fields -> Named ranges: HEADER_COMPANY, HEADER_CONTACT, HEADER_EMAIL, HEADER_PHONE, HEADER_ADDRESS
- Line items -> Table starting at LINEITEM_HEADER
- Optional services -> NAMED_RANGE_OPTIONAL
- Terms -> NAMED_RANGE_TERMS

Next Steps:
1. Implement named ranges in the reference templates (or detect via scanning) to map fields programmatically.
2. Wire template loader to extract mapping positions and default values.
3. Iteratively render each template and compare PDF output to reference CQ PDFs.
