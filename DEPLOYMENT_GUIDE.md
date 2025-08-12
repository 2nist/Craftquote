# 🚀 CraftQuote System - Complete Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Name it **"CraftQuote System"**

### Step 2: Upload All Files

**Upload these 11 .gs files to Apps Script:**
```
✅ DeploymentScript.gs          (NEW - Upload this first!)
✅ HybridAssemblerBackend.gs
✅ AssemblyQuoteBuilder.gs
✅ HybridQuoteGenerator.gs
✅ MenuFunctions.gs
✅ BrandingConfig.gs
✅ BrandingSheetIntegration.gs
✅ MasterCatalogPopulator.gs
✅ TestGoogleAppsScript.gs
✅ PipedriveIntegration.gs      (Optional - for CRM)
✅ AutomationWorkflows.gs       (Optional - for automation)
```

**Upload these 4 HTML files to Apps Script:**
```
✅ HybridComponentAssembler.html
✅ HybridQuoteForm.html
✅ BrandingEditor.html
✅ AssemblyEditor.html
```

### Step 3: Run Automatic Deployment

**In the Apps Script editor:**
1. Select **`DeploymentScript.gs`** from the file list
2. Choose function: **`deployCraftQuoteSystem`**
3. Click **▶️ Run**
4. Grant permissions when prompted
5. Wait for **"DEPLOYMENT COMPLETE! 🎉"** message

### Step 4: Start Using the System

**Option A - From Spreadsheet:**
1. Open the created spreadsheet (check the console for the URL)
2. Use the **CraftQuote** menu that appears
3. Click **"Component Assembler"** to start building quotes

**Option B - From Apps Script:**
```javascript
// Run any of these functions:
openComponentAssembler()  // Main quote builder
openBrandingEditor()      // Customize appearance  
openAssemblyEditor()      // Create custom assemblies
```

---

## 🎯 That's It! Your system is ready!

### What the deployment script created:
- ✅ **Google Spreadsheet** with all required sheets
- ✅ **Component database** ready for searching
- ✅ **Assembly-based quote builder** with 5+ pre-built assemblies
- ✅ **Branding system** with customizable colors and icons
- ✅ **Menu integration** in Google Sheets
- ✅ **Professional quote generation**

### Main Functions Available:
```javascript
openComponentAssembler()     // Start building quotes
openBrandingEditor()         // Customize colors/branding
openAssemblyEditor()         // Create custom assemblies
testBackendConnection()      // Test system health
checkSystemHealth()          // Full system diagnosis
```

---

## 🔧 Optional Enhancements

### Add Pipedrive CRM Integration:
1. Get your Pipedrive API token (Settings → Personal → API)
2. Run this code in Apps Script:
```javascript
PropertiesService.getScriptProperties().setProperties({
  'PIPEDRIVE_API_TOKEN': 'your-token-here',
  'PIPEDRIVE_COMPANY_DOMAIN': 'yourcompany.pipedrive.com'
});
```
3. Run: `setupPipedriveIntegration()`

### Connect Your Master Catalog:
1. Upload your component spreadsheet to Google Drive
2. Get the spreadsheet ID from the URL
3. Update the sheet reference in `HybridAssemblerBackend.gs`

---

## 🆘 Troubleshooting

### If deployment fails:
1. **Check permissions**: Make sure you granted all requested permissions
2. **Verify files**: Ensure all 15 files (.gs and .html) are uploaded
3. **Run health check**: Execute `checkSystemHealth()` for diagnosis
4. **Manual setup**: Run individual functions if needed

### Common issues:
- **"Function not found"**: Make sure all .gs files are uploaded
- **"Sheet not found"**: Re-run `deployCraftQuoteSystem()`
- **"Permission denied"**: Grant permissions in the Apps Script console

### Test your system:
```javascript
// Run these to verify everything works:
testBackendConnection()      // Test core system
checkSystemHealth()          // Full system check
getAvailableAssemblies()     // Test assembly system
```

---

## 📞 System Ready!

Your CraftQuote system is now live and ready to create professional automation quotes! 

**Next:** Open your spreadsheet and start building quotes with the assembly-first approach! 🎉
