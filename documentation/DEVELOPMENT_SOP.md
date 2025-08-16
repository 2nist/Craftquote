# 📋 Craft Automation Development Standards & SOPs

## 🚫 NO EMOJIS POLICY

**Effective Date**: August 15, 2025
**Status**: MANDATORY for all development

### Rule: Zero Emoji Usage
- **NEVER** use emojis in menu items, function names, or user interfaces
- **NEVER** use emojis in error messages, alerts, or system notifications  
- **NEVER** use emojis in documentation intended for end users
- **NEVER** use emojis in variable names, comments, or code structure

### Professional Alternatives:
```
❌ WRONG: "🔧 Debug Menu"
✅ CORRECT: "Debug Menu"

❌ WRONG: "📋 Create Testing Tracker" 
✅ CORRECT: "Create Testing Tracker"

❌ WRONG: "⚡ Craft Automation"
✅ CORRECT: "Craft Automation"
```

### Custom Icon Strategy:
- Reserve space for custom professional icons in future
- Use clean text labels for now
- Design custom icon set for branding consistency
- Implement professional iconography when branding system is mature

### Implementation Priority:
1. **IMMEDIATE**: Remove all emojis from menu systems
2. **HIGH**: Remove emojis from user-facing interfaces  
3. **MEDIUM**: Clean up documentation emojis
4. **FUTURE**: Implement custom professional icon system

---

## 📁 DIRECTORY ORGANIZATION STANDARDS

**Effective Date**: August 15, 2025
**Status**: MANDATORY for production system

### Core System Files (Stay in Root)
**These files are CRITICAL and remain in `/Production_System/`:**

#### Google Apps Script Files (.gs)
- `CompleteMasterCatalogSystem_V2.gs` - Main system orchestrator
- `CsvCatalogImporter.gs` - CSV import functionality  
- `HybridAssemblerBackend.gs` - Assembly system backend
- `Branding.gs` - Branding configuration system
- `NasExplorer.gs` - Network file explorer backend
- `SystemTestingTracker.gs` - Testing and development tracking
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

### Directory Structure for Non-Critical Files

#### `/archive/` - Legacy and Backup Files
- All `*_backup.*` files
- All `*_OLD.*` files  
- All `*_Clean.*` files
- Legacy menu systems
- Deprecated implementations

#### `/documentation/` - Project Documentation
- All `*.md` files except critical ones
- User guides and setup instructions
- API documentation
- Development notes

#### `/testing/` - Testing and Development Files
- Test HTML files
- Validation scripts
- Debug utilities
- Development experiments

#### `/scripts/` - Utility Scripts
- PowerShell deployment scripts
- Conversion utilities
- Build automation
- Maintenance scripts

#### `/reference/` - Reference Materials
- Code examples
- Templates
- Best practices
- Architecture diagrams

### File Naming Conventions
- **NO** spaces in filenames
- **NO** special characters except hyphens and underscores
- Use `PascalCase` for main system files
- Use `kebab-case` for documentation files
- Use `snake_case` for utility scripts

### Cleanup Implementation Plan
1. **Phase 1**: Create directory structure
2. **Phase 2**: Move non-critical files to appropriate directories
3. **Phase 3**: Update `.claspignore` to reflect new structure
4. **Phase 4**: Test deployment to ensure no critical files are missing
5. **Phase 5**: Document final structure

---

## 🎯 IMPLEMENTATION CHECKLIST

### Immediate Actions (Today)
- [ ] Remove all emojis from menu system
- [ ] Remove all emojis from user interfaces
- [ ] Create directory structure
- [ ] Move non-critical files

### This Week
- [ ] Update all documentation to remove emojis
- [ ] Standardize function naming
- [ ] Complete directory reorganization
- [ ] Update deployment scripts

### Future Development
- [ ] Design professional icon system
- [ ] Implement custom branding icons
- [ ] Create style guide for UI consistency
- [ ] Establish code review process for emoji prevention

---

## 🔒 ENFORCEMENT

### Code Review Requirements
- All pull requests must be emoji-free
- Directory structure must follow standards
- No exceptions without written approval

### Quality Gates
- Automated checks for emoji usage
- Directory structure validation
- Professional appearance verification

This SOP ensures the Craft Automation system maintains a professional, enterprise-grade appearance while organizing code for maintainability and scalability.
