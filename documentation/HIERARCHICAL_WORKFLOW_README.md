# 🏗️ Hierarchical Workflow System
## Parts → Assemblies → Panels → Quotes

### **Overview**

The Hierarchical Workflow System transforms your CraftQuote process from individual components to a structured, scalable workflow that matches your reference PDF quotes exactly.

**Current Flow**: Master Catalog → Individual Components → Quote  
**New Flow**: Parts → Assemblies → Panels → Quotes

---

### **🎯 System Architecture**

#### **Phase 1: Parts (🔧)**
- **Source**: Enhanced Master Catalog
- **Storage**: `HW_Parts` sheet
- **Function**: Individual components with detailed specifications
- **Examples**: IDEC FC6A PLC, 1HP Motor Control, Touch Screen HMI

#### **Phase 2: Assemblies (🏗️)**
- **Source**: User-created groupings of parts
- **Storage**: `HW_Assemblies` + `HW_BOM_Details` sheets
- **Function**: Functional units matching your quote line items
- **Examples**: "Start/Stop Motor Control Switch", "Automation Hardware Assembly"

#### **Phase 3: Panels (⚡)**
- **Source**: Complete control systems
- **Storage**: `HW_Panels` sheet
- **Function**: Full panel configurations (BHAC, DTAC, GHAC, etc.)
- **Examples**: Brewhouse Automation Control, Distillation Temperature Control

#### **Phase 4: Quotes (📋)**
- **Source**: Customer-specific proposals
- **Storage**: `HW_Quotes` sheet
- **Function**: PDF-ready quotes matching your reference format
- **Examples**: CQ24031201DTABT-00 format quotes

---

### **🚀 Quick Start Guide**

#### **1. Initialize System**
```
Menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → 🚀 Initialize Database
```
- Creates all required sheets with proper structure
- Populates parts from existing Master Catalog
- Sets up standard assemblies from your reference quotes

#### **2. Build Assemblies**
```
Menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → 🏗️ Assembly Builder
```
- Visual interface for selecting parts
- Create assemblies matching your quote sections
- Automatically calculates costs and saves BOM

#### **3. Generate Quotes**
```
Menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → 📋 Quote Generator
```
- Select assemblies and panels
- Generate quotes in your exact PDF format
- Save to database with full traceability

---

### **📊 Database Structure**

#### **HW_Parts** - Individual Components
| Column | Description | Example |
|--------|-------------|---------|
| PartID | Unique identifier | IDEC_FC6A_16IO |
| PartNumber | Manufacturer part number | FC6A-C16R |
| Description | Full description | IDEC MicroSmart FC6A 16 I/O PLC |
| Category | Component type | Control Systems |
| UnitCost | Base unit cost | 240.00 |
| Vendor | Primary vendor | IDEC |
| UsedInAssemblies | Assembly usage tracking | MOTOR_CTRL_1HP,SAFETY_DEVICES |

#### **HW_Assemblies** - Component Groupings
| Column | Description | Example |
|--------|-------------|---------|
| AssemblyID | Unique identifier | MOTOR_CTRL_START_STOP |
| AssemblyName | Display name | Start/Stop Motor Control Switch |
| Description | Detailed description | Powder Coat Gray NEMA enclosure with... |
| Category | Assembly type | Motor Control |
| TotalCost | Calculated from BOM | 684.00 |
| ComponentCount | Number of parts | 6 |
| BOMReference | Link to detailed BOM | BOM_MOTOR_CTRL_START_STOP |

#### **HW_BOM_Details** - Bill of Materials
| Column | Description | Example |
|--------|-------------|---------|
| AssemblyID | Links to assembly | MOTOR_CTRL_START_STOP |
| LineNumber | BOM line sequence | 1 |
| PartID | Links to part | ENCL_NEMA4_8x6 |
| Quantity | Parts needed | 1 |
| UnitCost | Part unit cost | 245.00 |
| LineCost | Extended cost | 245.00 |

#### **HW_Quotes** - Customer Proposals
| Column | Description | Example |
|--------|-------------|---------|
| QuoteID | CraftAutomation format | CQ24031201DTABT-00 |
| CustomerCompany | Customer name | Big Grove Brewing |
| Description | Quote description | Brewhouse Control Solution |
| NetPrice | Price before markup | 45000.00 |
| TotalPrice | Final quoted price | 56250.00 |
| Status | Quote status | Draft, Sent, Approved |

---

### **🎨 Quote Output Format**

The system generates quotes matching your reference screenshots **exactly**:

- **Header**: Company branding, customer contact info, quote details
- **Line Items**: Hierarchical structure with assembly descriptions
- **Component Details**: Nested bullet points showing assembly contents
- **Pricing**: Net price and total price columns
- **Footer**: Terms, conditions, signature blocks
- **Format**: Ready for PDF export or direct printing

---

### **🔧 Usage Examples**

#### **Creating a Motor Control Assembly**
1. Open Assembly Builder
2. Search for "motor" in parts list
3. Select components:
   - Motor contactor
   - Pilot LED
   - NEMA enclosure
   - Safety switch
4. Set quantities and save
5. Assembly now available for quotes

#### **Generating a BHAC Quote**
1. Open Quote Generator
2. Select BHAC panel type
3. Choose assemblies:
   - Motor Control assemblies
   - Safety Devices
   - Automation Hardware
4. Enter customer details
5. Generate quote in PDF format

---

### **📈 Benefits**

#### **For Users**
- **Consistency**: Every quote follows the same professional format
- **Speed**: Pre-built assemblies accelerate quote generation
- **Accuracy**: BOM-driven pricing eliminates calculation errors
- **Traceability**: Full audit trail from parts to final quote

#### **For Business**
- **Scalability**: Easy to add new assemblies and panel types
- **Knowledge Capture**: Assembly definitions preserve engineering knowledge
- **Price Intelligence**: Historical pricing data and trends
- **Customer Tracking**: Complete project and quote history

---

### **🛠️ Maintenance**

#### **Adding New Parts**
- Add to Master Catalog (existing process)
- System automatically imports to HW_Parts
- Available immediately in Assembly Builder

#### **Creating Standard Assemblies**
- Use Assembly Builder to create common groupings
- Mark as "Standard" for company-wide use
- Include in default panel configurations

#### **Panel Configuration**
- Define in HW_Panels sheet
- Specify included assemblies
- Set base pricing and options

---

### **🧪 Testing & Validation**

#### **System Validation**
```
Menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → ✅ Validate Complete System
```

#### **Demo Workflow**
```
Menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → 🎬 Demo Workflow
```

#### **Database Status**
```
Menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → 🔍 View Database Status
```

---

### **📞 Support**

For questions or issues:
1. Check **❓ Workflow Help** in the menu
2. Use **✅ Validate Complete System** to diagnose problems
3. Review console logs for detailed error information
4. All functions include comprehensive error handling and user feedback

---

### **🔄 Integration**

The hierarchical workflow system integrates seamlessly with your existing CraftQuote components:
- **Master Catalog**: Source of truth for all parts data
- **Branding System**: Quote formatting uses existing branding
- **Pipedrive Integration**: Quote data compatible with existing workflows
- **CSV Export**: All data exportable for external use

---

**Status**: ✅ **READY FOR PRODUCTION USE**  
**Version**: 1.0  
**Last Updated**: August 12, 2025  
**Compatibility**: Existing CraftQuote system
