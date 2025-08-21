# Craftquote (Refactor Scaffold)

TypeScript-based Apps Script scaffold for the quoting system. Build with esbuild, push with clasp.

## Quick Start
1. Install Node.js 18+
2. npm install
3. npm run build
4. Authenticate clasp (once), then npm run push (not run by this script).

This expects a bound Sheet with tabs: Panel_Config, Component_Library, Quote_Builder.

## Script Properties
- PIPEDRIVE_API_TOKEN (string)
- PIPEDRIVE_BASE_URL (string, optional; default: https://api.pipedrive.com/v1)
- DOC_OUTPUT_PARENT_ID (string, optional Drive Folder ID override)

## Menus
- Quote Tools → Validate Panel Config
- Quote Tools → Build PDF Preview (creates Doc and saves PDF next to Sheet or in DOC_OUTPUT_PARENT_ID)
- Quote Tools → Generate Quote # (Rev 00)
- Quote Tools → Increment Revision
- Quote Tools → Push to Pipedrive (stub)
- Quote Tools → List Pipedrive Deal Fields
