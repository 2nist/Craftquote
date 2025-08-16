# Production_System (Curated V2)

This folder contains only the minimal, deployable Apps Script backend and UI for the Hybrid Assembler + Master Catalog system.

Keep files:

- appsscript.json (manifest)
- .clasp.json and .claspignore (deployment control)
- CompleteMasterCatalogSystem_V2.gs (single menu owner + actions)
- CsvCatalogImporter.gs (Drive CSV → Master Catalog importer)
- CsvDiagnostic.gs (pre-import diagnostics)
- Config.gs (centralized sheet names + column map)
- HybridAssemblerBackend.gs (search/templates/quote/BOM/assemblies backend)
- HybridComponentAssembler.html (UI)
- AssemblyEditor.html (UI for defining assemblies)

Everything else lives in ../olddev (archived).

## Why so few files?

We consolidated multiple overlapping scripts into one coherent system:

- One onOpen/menu owner
- One importer + one diagnostic
- One backend + two UI files
- One shared config

This is faster to deploy, easier to reason about, and reduces menu conflicts.

## Deploy strategy (clasp)

1) In this folder, ensure you’re logged in:
	- If needed, run clasp login (browser) or clasp login --no-localhost

2) Push the curated set:
	- clasp push

3) In Apps Script, review files and run a quick smoke test:
	- getBackendVersion(), debugMasterCatalog(), initializeHybridSystem()

The .claspignore ensures only curated files are pushed.

## Cleanup utility

Use CLEANUP.ps1 to move all non-curated files into ../olddev while keeping the keep-list intact.

Example:

- pwsh ./CLEANUP.ps1 -WhatIf   # dry run
- pwsh ./CLEANUP.ps1           # execute

## Notes

- HybridAssemblerBackend.gs now uses Config.gs for sheet names and column mapping.
- Removed reliance on hard-coded templates; database-driven templates only.
- Quote numbering uses document properties for a daily sequence.
