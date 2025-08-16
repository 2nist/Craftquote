# Production System Directory Organization

## Current Structure (Post-Cleanup)

### Core System Files (Root Directory)
These files are **CRITICAL** and deployed with the system:

#### Google Apps Script Backend (.gs)
- `CompleteMasterCatalogSystem_V2.gs` - Main system orchestrator
- `CsvCatalogImporter.gs` - CSV import functionality  
- `HybridAssemblerBackend.gs` - Assembly system backend
- `Branding.gs` - Branding configuration system
- `NasExplorer.gs` - Network file explorer backend
- `SystemTestingTracker.gs` - Testing and development tracking (MISSING - needs restoration)
- `Config.gs` - System configuration
- `CsvDiagnostic.gs` - CSV diagnostic tools

#### HTML Interface Files (.html)
- `HybridComponentAssembler.html` - Main assembly interface
- `BrandingEditor.html` - Branding configuration UI
- `BrandingDemo.html` - Branding demonstration
- `NetworkFileExplorer.html` - File explorer interface
- `SetCsvIdDialog.html` - CSV configuration dialog
- `AssemblyEditor.html` - Assembly editing interface

#### Configuration Files
- `appsscript.json` - Apps Script manifest
- `.claspignore` - Deployment exclusion rules
- `.clasp.json` - Clasp configuration

### Organized Subdirectories

#### `/archive/` - Legacy and Backup Files
- Backup files (*_backup.*, *_BACKUP.*, *_CLEAN.*)
- Legacy implementations
- Deprecated code

#### `/documentation/` - Project Documentation  
- All Markdown files (*.md)
- User guides and setup instructions
- API documentation
- Development notes

#### `/testing/` - Testing and Development Files
- Test HTML files
- Validation scripts  
- Debug utilities
- Development experiments

#### `/scripts/` - Utility Scripts
- PowerShell scripts (*.ps1)
- Shell scripts (*.sh)
- Deployment automation
- Maintenance utilities

#### `/legacy/` - Legacy System Files
- Old menu systems
- Deprecated implementations
- Historical code for reference

## Files That Need Organization

### Still in Root (Need Moving)
- JavaScript files (*.js) → `/legacy/`
- Additional test files → `/testing/`
- Legacy Google Apps Script files → `/legacy/`
- Reference materials → `/documentation/`

### Missing Critical Files
- `SystemTestingTracker.gs` - Not deployed (needs restoration)

## Next Steps
1. Complete file organization
2. Update .claspignore for new structure  
3. Restore missing SystemTestingTracker.gs
4. Test deployment
5. Document final structure

## Professional Standards Applied
- ✅ Removed ALL emojis from menu system
- ✅ Clean, professional menu labels
- ✅ Organized directory structure
- ✅ Separated critical from non-critical files
- ✅ Professional naming conventions

## Menu System (Emoji-Free)
```
Craft Automation
├── Import Master Catalog
├── Complete Setup (One Click)
├── Set CSV File ID
├── Clear CSV File ID
├── Open Component Price List
├── Open Hybrid Assembler  
├── Network File Explorer
├── Edit Branding
├── Branding Demo
├── Import FULL Catalog (1,500+ Parts)
├── Import Sample Catalog (28 Parts)
├── CSV Diagnostic
├── Repair Master Catalog Headers
├── Diagnose System
├── Test Data
├── Validate System
├── View Catalog Stats
├── Create Testing Tracker
├── Test Tracker Function
├── View Ready for Review
├── Debug Menu
└── Help
```

The system now maintains a professional, enterprise-grade appearance with organized code structure.
