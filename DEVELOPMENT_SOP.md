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

---

## 📊 PROFESSIONAL QUOTE GENERATION ARCHITECTURE

**Effective Date**: August 15, 2025
**Status**: NEW MODULAR SYSTEM

### 5-Section Quote Structure
The bill of material system is different from quotes. Quotes are broken into distinct sections:

#### 1. Header Section
- **Purpose**: Top of quote with logo, customer and quote info
- **Format**: Same formatting every quote, unique values entered
- **Content**: Company branding, quote number, date, customer information
- **Professional Standard**: Clean layout, consistent spacing

#### 2. Quote Overview Section  
- **Purpose**: Job type and important big picture information
- **Format**: Similar formatting for job types
- **Content**: Project name, system type, application, scope
- **Note**: Simple panel quotes may only need Header + Overview sections

#### 3. Quote Detail Section (Complex Systems)
- **Purpose**: For complex panels with automation
- **Content**: Specific details addressed by function description
- **Includes**: System assemblies, input/output processes
- **Technical Specs**: Detailed automation specifications

#### 4. Quote Options Section
- **Purpose**: Relevant yet optional additions
- **Content**: Parts, installation, commissioning, addons
- **Services**: Extended support, training, warranties
- **Pricing**: "Quote upon request" for optional items

#### 5. Quote Terms Section
- **Purpose**: Conditions for service
- **Content**: Payment terms, delivery, warranty, validity
- **Professional**: Standard terms consistently applied

### Technical Implementation

#### Core Files
- **Primary Engine**: `ProfessionalQuoteGenerator.gs`
- **JavaScript Mirror**: `ProfessionalQuoteGenerator.js`
- **Integration**: `HybridAssemblerBackend.gs/js` calls the engine
- **UI Interface**: `HybridQuoteForm.html`

#### Document Builder Architecture
- **Pattern**: Server-side function acts as "document builder"
- **Process**: Creates new sheet, constructs quote row by row
- **Efficiency**: Build content as arrays before writing to sheet
- **Separation**: Complex formatting logic separate from assembly logic

#### Professional Quote Generation Function Flow
```javascript
function generateProfessionalQuote(quoteData) {
  // 1. Generate unique quote number
  const quoteNumber = generateFinalQuoteNumber(quoteData);
  
  // 2. Create dedicated sheet for this quote
  const quoteSheet = createNewQuoteSheet(quoteNumber);
  
  // 3. Build quote content as array of arrays (virtual sheet)
  const quoteContent = buildQuoteContentArray(quoteNumber, quoteData);
  
  // 4. Write content and apply professional formatting
  writeAndFormatQuote(quoteSheet, quoteContent);
  
  // 5. Log quote in master database
  logFinalQuote(quoteNumber, quoteData);
}
```

#### Quote Numbering System
**Format**: `CQ[YY][MM][DD][NN][ProductCode][CompanyCode]-[SequenceNumber]`
- **CQ**: Craft Quote prefix
- **YY**: Last digit of year
- **MM**: Month (01-12)  
- **DD**: Day (01-31)
- **NN**: Sequence number for the day
- **ProductCode**: System type code
- **CompanyCode**: CA (Craft Automation)
- **SequenceNumber**: -01, -02, etc.

#### System Type Codes
- **BHAC**: Brewery Heating Automation Controller
- **DTAC**: Distillery Temperature Automation Controller
- **CPAC**: Canning Process Automation Controller
- **AGAC**: Aging/Glycol Automation Controller
- **GHAC**: General Heating Automation Controller
- **MCAC**: Multi-Component Automation Controller
- **PCAC**: Process Control Automation Controller
- **CUST**: Custom systems

### Professional Formatting Standards

#### Visual Design
- **Color Scheme**: Professional blue theme (#1c4587, #6fa8dc, #9fc5e8)
- **Headers**: Bold text with background colors
- **Spacing**: Consistent row spacing and section separation
- **Typography**: Professional fonts, appropriate sizing

#### Layout Standards
- **Column Widths**: Optimized for content (100px, 80px, 400px, 120px, 120px)
- **Merged Cells**: Company header spans multiple columns
- **Borders**: Professional borders around sections
- **Frozen Rows**: Header rows frozen for navigation

#### Data Formatting
- **Currency**: Standard $#,##0.00 format
- **Dates**: Full date format (Monday, January 1, 2025)
- **Alignment**: Center headers, left-align content
- **Line Items**: Letter system (A, B, C, etc.)

### Integration Workflow

#### User Experience Flow
1. User assembles components in Hybrid Assembler UI
2. "Generate Quote" button opens customer information form
3. Customer data collected and validated
4. Data package sent to Professional Quote Generator
5. Engine builds structured 5-section quote
6. Professional formatting applied automatically
7. Quote logged to master database
8. New sheet created with professional appearance

#### Data Flow Architecture
```
Hybrid Assembler → Customer Form → Quote Engine → Formatted Sheet
       ↓               ↓              ↓             ↓
   Components    Customer Info    Quote Builder   Database Log
```

### Quality Standards

#### Professional Requirements
- **Zero Emojis**: All quote interfaces must be emoji-free
- **Consistent Branding**: Craft Automation professional appearance
- **Error Handling**: Meaningful error messages with fallbacks
- **Performance**: Efficient sheet creation and formatting

#### Testing Requirements
- **Validation**: All quote sections must render correctly
- **Data Integrity**: Customer and component data preserved
- **Formatting**: Professional appearance maintained
- **Database**: Quote logging must succeed

This architecture ensures the quote generation system creates professional, customer-facing documents that match the high standards of existing PDF examples while maintaining the modular, maintainable codebase structure.

---