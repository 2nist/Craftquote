# 📁 GOOGLE APPS SCRIPT FILE STRUCTURE
## Complete File List for CraftQuote Hierarchical Workflow System

### 🚨 **IMPORTANT: Apps Script File Management**

Google Apps Script doesn't automatically sync files from your local drive. Each `.gs` and `.html` file needs to be **manually created** in the Apps Script editor.

---

## 📋 **REQUIRED FILES CHECKLIST**

### **🔧 CORE SYSTEM FILES (EXISTING)**
These should already be in your Apps Script project:

✅ **MenuFunctions.gs** - Main menu system  
✅ **HybridAssemblerBackend.gs** - Original backend  
✅ **Setup.gs** - System setup functions  
✅ **Branding.gs** - Branding system  
✅ **PipedriveIntegration.gs** - Pipedrive integration  

### **🏗️ HIERARCHICAL WORKFLOW FILES (NEW - NEED TO ADD)**
These are the NEW files for the hierarchical system:

❌ **HierarchicalWorkflowBuilder.gs** - Database creation  
❌ **HierarchicalWorkflowBackend.gs** - Backend functions  
❌ **HierarchicalWorkflowValidator.gs** - Testing & validation  
❌ **HierarchicalQuoteGenerator.gs** - Quote generation  
❌ **HierarchicalAssemblyBuilder.html** - Assembly Builder interface  

### **🔧 TROUBLESHOOTING FILES (NEW - OPTIONAL)**
These help with setup and debugging:

❌ **ManualSetup.gs** - Manual initialization  
❌ **MenuTroubleshooter.gs** - Menu debugging  
❌ **WalkthroughTester.gs** - Testing functions  

---

## 🔨 **HOW TO ADD MISSING FILES**

### **Step 1: Open Apps Script Editor**
1. Go to your Google Sheets CraftQuote spreadsheet
2. Click **Extensions → Apps Script**
3. You'll see the Apps Script editor with your existing files

### **Step 2: Add New Files**
For each missing file:
1. Click the **+** button next to "Files"
2. Choose **Script** for .gs files or **HTML** for .html files
3. Name the file exactly as shown (e.g., "HierarchicalWorkflowBuilder")
4. Copy/paste the content from our files

### **Step 3: Essential Files Priority**
Start with these **MUST-HAVE** files in this order:

**Priority 1** (Required for basic functionality):
1. **HierarchicalWorkflowBuilder.gs**
2. **MenuFunctions.gs** (update existing)
3. **ManualSetup.gs**

**Priority 2** (For full functionality):
4. **HierarchicalWorkflowBackend.gs**
5. **HierarchicalAssemblyBuilder.html**
6. **HierarchicalQuoteGenerator.gs**

**Priority 3** (For advanced features):
7. **HierarchicalWorkflowValidator.gs**
8. **MenuTroubleshooter.gs**

---

## 📂 **YOUR CURRENT APPS SCRIPT PROJECT SHOULD LOOK LIKE THIS:**

```
📁 CraftQuote Apps Script Project
├── 📄 MenuFunctions.gs (EXISTING - needs update)
├── 📄 Setup.gs (EXISTING)
├── 📄 HybridAssemblerBackend.gs (EXISTING)
├── 📄 Branding.gs (EXISTING)
├── 📄 PipedriveIntegration.gs (EXISTING)
│
├── 🆕 HierarchicalWorkflowBuilder.gs (NEW - ADD THIS)
├── 🆕 HierarchicalWorkflowBackend.gs (NEW - ADD THIS)
├── 🆕 HierarchicalQuoteGenerator.gs (NEW - ADD THIS)
├── 🆕 HierarchicalWorkflowValidator.gs (NEW - ADD THIS)
├── 🆕 ManualSetup.gs (NEW - ADD THIS)
│
├── 📄 HybridComponentAssembler.html (EXISTING)
├── 📄 BrandingEditor.html (EXISTING)
├── 🆕 HierarchicalAssemblyBuilder.html (NEW - ADD THIS)
│
└── 📄 Other existing files...
```

---

## 🚀 **QUICK START SOLUTION**

Since you're missing files, here's the **fastest path**:

### **Option A: Minimum Files (Start Here)**
1. Add **ManualSetup.gs** first
2. Run function `completeManualSetup()`
3. This will tell you what other files you need

### **Option B: Add Core Files**
1. **HierarchicalWorkflowBuilder.gs** - Contains database creation
2. Update **MenuFunctions.gs** - Adds hierarchical menu
3. **ManualSetup.gs** - For easy initialization

---

## 🔍 **CHECK YOUR CURRENT FILES**

In your Apps Script editor, you should see these files in the left sidebar:

**Existing Files:**
- MenuFunctions.gs
- Setup.gs  
- HybridAssemblerBackend.gs
- Branding.gs
- (and others)

**Missing Files (need to add):**
- HierarchicalWorkflowBuilder.gs ❌
- HierarchicalWorkflowBackend.gs ❌
- HierarchicalQuoteGenerator.gs ❌
- HierarchicalAssemblyBuilder.html ❌
- ManualSetup.gs ❌

---

## 📞 **NEXT STEPS**

1. **Check Current Files**: Look at your Apps Script editor sidebar
2. **Add Priority 1 Files**: Start with ManualSetup.gs and HierarchicalWorkflowBuilder.gs
3. **Test**: Run `quickStatusCheck()` from ManualSetup.gs
4. **Add Remaining Files**: Based on what you need

Would you like me to help you add the most critical files first?
