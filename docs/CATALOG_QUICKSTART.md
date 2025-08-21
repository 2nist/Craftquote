# Catalog Quickstart (Import → Verify → Search → Quote)

Use this checklist to bring the Catalog online and validate that the Hybrid Assembler panel is using it correctly.

## 1) Import components into Master Catalog

- In the Sheet menu, set the CSV File ID (or URL) using: “⚙️ Set CSV File ID…”
- Run: “Import from CSV File (BEST)”
- Expected: A “Master Catalog” sheet with canonical headers, and data rows populated.

If you don’t have the menu, open Apps Script and run the onOpen from CompleteMasterCatalogSystem_V2.gs, or reload the spreadsheet.

## 2) Verify catalog health

- In Apps Script, run: debugMasterCatalog()
- Expected output:
  - success: true
  - headers array with canonical columns
  - message indicating N components available

Optional: Run a tiny search sanity test:

- Run: searchComponents('PLC', 5)
- Expected: success: true with some results (if catalog contains PLCs)

## 3) Confirm UI search

- Open the Hybrid Component Assembler (menu → 🧩 Open Hybrid Assembler)
- In the right panel:
  - Ensure the “🔧 Assembly-First Quote Building” instructions show by default.
  - Type at least 2 characters (e.g., “PLC”, “Enclosure”) and see results.
  - Use quick filters to test “Assemblies” vs “Components”.

If search fails in the dialog, click the 🐞 Debug button to view logs inside the dialog and note any errors.

## 4) Product templates dropdown

- In Quote Configuration, open “Product Code” dropdown.
- Expected: Templates listed from Product_Templates (backend listProductTemplates()).
- Selecting a template should load components; Category does not auto-change unless UI flag is enabled.

## 5) Generate a Professional Quote

- Add a few search results into the left canvas.
- Click “Generate Quote”.
- Fill customer info in the modal, then submit.
- Expected: A new quote sheet created with your professional format and computed totals.

## Common issues

- No Master Catalog sheet: Run import or ensure correct sheet name configured via SHEET_NAMES.MASTER_CATALOG.
- Empty search results: Ensure Y/N column marks active rows as “Y” and CSV mappings match canonical headers.
- Product dropdown empty: Run initializeHybridSystem() to create Product_Templates and related tables.
- Dialog can’t reach backend: If testing outside Apps Script, mock data will be used; test inside the bound spreadsheet for live data.

## Where to look in code

- Backend search: HybridAssemblerBackend.gs → searchComponents(), searchAssembliesForQuoteBuilder()
- Product templates: initializeProductTemplatesDatabase(), listProductTemplates(), loadTemplateFromDatabase()
- UI wiring: HybridComponentAssembler.html → populateProductCodes(), performComponentSearch(), performAssemblySearch()

When in doubt, open the in-dialog Debug Console (🐞) and capture logs while reproducing the issue.
