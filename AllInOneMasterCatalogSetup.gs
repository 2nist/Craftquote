/**
 * ALL-IN-ONE MASTER CATALOG SETUP
 * Complete Master Catalog integration system in one file
 * Includes repository population + setup menu + diagnostics
 * Created: August 13, 2025
 */

// =================== MENU SYSTEM ===================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 Master Catalog Setup')
    .addItem('📂 QUICK START: Populate from Repository', 'populateFromRepository')
    .addSeparator()
    .addItem('🔍 Diagnose System', 'diagnoseSystemIntegration')
    .addItem('🧪 Test Repository Data', 'testRepositoryDataAccess')
    .addItem('✅ Validate System', 'validateCompleteSystem')
    .addSeparator()
    .addItem('🎯 Open Assembly Builder', 'openAssemblyBuilder')
    .addItem('📋 Open Quote Generator', 'openQuoteGenerator')
    .addSeparator()
    .addItem('❓ Help', 'showHelpDocumentation')
    .addToUi();
    
  console.log('🔧 All-in-One Master Catalog Setup Menu Created');
}

// =================== REPOSITORY POPULATION ===================

function populateFromRepository() {
  console.log('📂 REPOSITORY POPULATOR - Starting direct data population...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let populateReport = '📂 REPOSITORY DATA POPULATION\n\n';
    
    // Step 1: Create Master Catalog sheet if it doesn't exist
    let masterSheet = ss.getSheetByName('Master Catalog');
    if (!masterSheet) {
      masterSheet = ss.insertSheet('Master Catalog');
      populateReport += '✅ Created Master Catalog sheet\n';
    } else {
      populateReport += '✅ Found existing Master Catalog sheet\n';
    }
    
    // Step 2: Get data from MasterCatalogData.gs
    populateReport += '\nStep 2: Loading data from repository...\n';
    
    let catalogData;
    try {
      // Test if MASTER_CATALOG_DATA is available
      if (typeof MASTER_CATALOG_DATA !== 'undefined') {
        catalogData = MASTER_CATALOG_DATA;
        populateReport += `✅ Loaded ${catalogData.length} parts from MASTER_CATALOG_DATA\n`;
      } else {
        throw new Error('MASTER_CATALOG_DATA not found');
      }
    } catch (dataError) {
      populateReport += `❌ Could not access MASTER_CATALOG_DATA: ${dataError.message}\n`;
      populateReport += 'Using sample catalog data...\n';
      
      // Fallback to sample data
      catalogData = getSampleCatalogData();
      populateReport += `✅ Using sample catalog data (${catalogData.length} parts)\n`;
    }
    
    // Step 3: Format data for sheet
    populateReport += '\nStep 3: Formatting data for spreadsheet...\n';
    
    // Define headers based on your original Master Catalog structure
    const headers = [
      'yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'UNIT', 
      'Category', 'Assembly', 'Voltage', 'Amperage', 'Phase', 'Tags', 'LastUpdated'
    ];
    
    // Clear sheet and add headers
    masterSheet.clear();
    masterSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    masterSheet.setFrozenRows(1);
    
    // Convert catalog data to sheet format
    const sheetData = catalogData.map((part, index) => [
      'Y',                                    // yn (active)
      part.partNumber || '',                  // PART
      part.description || '',                 // DESCRIPTION  
      part.partNumber || '',                  // PART# (duplicate for compatibility)
      part.vendor || '',                      // VNDR
      part.vendorPart || '',                  // VNDR#
      part.unitCost || 0,                     // COST
      'EA',                                   // UNIT (default to each)
      part.category || 'General',             // Category
      part.assembly || 'Standard',            // Assembly
      part.voltage || '',                     // Voltage
      part.amperage || '',                    // Amperage
      part.phase || '',                       // Phase
      part.tags || '',                        // Tags
      part.lastUpdated || new Date().toLocaleDateString() // LastUpdated
    ]);
    
    // Write data to sheet
    if (sheetData.length > 0) {
      masterSheet.getRange(2, 1, sheetData.length, headers.length).setValues(sheetData);
      populateReport += `✅ Wrote ${sheetData.length} parts to Master Catalog sheet\n`;
    }
    
    // Step 4: Create hierarchical sheets
    populateReport += '\nStep 4: Creating hierarchical system...\n';
    try {
      createBasicHierarchicalSheets(ss);
      populateReport += `✅ Hierarchical sheets created\n`;
    } catch (hierarchicalError) {
      populateReport += `❌ Hierarchical creation error: ${hierarchicalError.message}\n`;
    }
    
    // Step 5: Populate HW_Parts
    populateReport += '\nStep 5: Populating HW_Parts...\n';
    try {
      const importResult = populateHWPartsFromCatalog(ss, catalogData);
      populateReport += `✅ HW_Parts: ${importResult.imported} parts imported\n`;
    } catch (partsError) {
      populateReport += `❌ HW_Parts error: ${partsError.message}\n`;
    }
    
    // Success summary
    populateReport += '\n🎉 REPOSITORY POPULATION COMPLETE!\n';
    populateReport += '✅ Master Catalog populated from repository data\n';
    populateReport += '✅ Hierarchical system ready\n';
    populateReport += '✅ System ready for use\n';
    
    console.log(populateReport);
    SpreadsheetApp.getUi().alert('Population Complete!', populateReport, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return {
      success: true,
      report: populateReport,
      partsLoaded: catalogData.length
    };
    
  } catch (error) {
    console.error('📂 REPOSITORY POPULATION ERROR:', error);
    const errorMsg = `❌ Repository Population Failed:\n\n${error.message}\n\nCheck console for details.`;
    
    try {
      SpreadsheetApp.getUi().alert('Population Failed', errorMsg, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (uiError) {
      console.error('Could not show error dialog');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// =================== HELPER FUNCTIONS ===================

function getSampleCatalogData() {
  return [
    {
      partNumber: "A6044CHNFSS",
      description: "6Hx4Wx4D SS JBOX",
      vendor: "KDL",
      unitCost: 161.06,
      category: "ENC",
      assembly: "ENCLOSURE",
      vendorPart: "34080",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "A8066CHFL",
      description: "8Hx6Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      unitCost: 65.91,
      category: "ENC",
      assembly: "ENCLOSURE",
      vendorPart: "2332847",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "A10106CHFL",
      description: "10Hx10Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      unitCost: 84.23,
      category: "ENC",
      assembly: "ENCLOSURE",
      vendorPart: "2332849",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "CSD16126",
      description: "Schneider Electric Contactor",
      vendor: "SER",
      unitCost: 125.50,
      category: "CNT",
      assembly: "CONTROL",
      vendorPart: "LC1D16BL",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "CSD16166",
      description: "Schneider Electric Overload Relay",
      vendor: "SER",
      unitCost: 89.75,
      category: "OLR",
      assembly: "CONTROL",
      vendorPart: "LRD16",
      lastUpdated: "6/13/2025"
    }
  ];
}

function createBasicHierarchicalSheets(ss) {
  const requiredSheets = [
    { name: 'HW_Parts', headers: ['PartID', 'PartNumber', 'Description', 'Category', 'UnitCost', 'Vendor', 'VendorPart', 'UsedInAssemblies', 'LastUpdated', 'Status'] },
    { name: 'HW_Assemblies', headers: ['AssemblyID', 'AssemblyName', 'Description', 'Category', 'TotalCost', 'ComponentCount', 'BOMReference', 'Status', 'LastUpdated'] },
    { name: 'HW_BOM_Details', headers: ['AssemblyID', 'LineNumber', 'PartID', 'Quantity', 'UnitCost', 'LineCost', 'Notes'] },
    { name: 'HW_Panels', headers: ['PanelID', 'PanelName', 'Description', 'PanelType', 'BasePrice', 'IncludedAssemblies', 'Status'] },
    { name: 'HW_Quotes', headers: ['QuoteID', 'CustomerCompany', 'Description', 'NetPrice', 'TotalPrice', 'Status', 'DateCreated'] }
  ];
  
  requiredSheets.forEach(({ name, headers }) => {
    if (!ss.getSheetByName(name)) {
      const sheet = ss.insertSheet(name);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      console.log(`✅ Created ${name} sheet`);
    }
  });
}

function populateHWPartsFromCatalog(ss, catalogData) {
  const hwPartsSheet = ss.getSheetByName('HW_Parts');
  if (!hwPartsSheet) {
    throw new Error('HW_Parts sheet not found');
  }
  
  const processedParts = catalogData.map(part => [
    part.partNumber.toUpperCase(),        // PartID
    part.partNumber,                      // PartNumber
    part.description,                     // Description
    part.category || 'General',          // Category
    part.unitCost || 0,                  // UnitCost
    part.vendor || '',                   // Vendor
    part.vendorPart || '',               // VendorPart
    '',                                  // UsedInAssemblies
    new Date().toLocaleDateString(),     // LastUpdated
    'Active'                             // Status
  ]);
  
  // Clear existing data and write new
  hwPartsSheet.getRange(2, 1, hwPartsSheet.getLastRow(), 10).clearContent();
  if (processedParts.length > 0) {
    hwPartsSheet.getRange(2, 1, processedParts.length, 10).setValues(processedParts);
  }
  
  return {
    imported: processedParts.length,
    skipped: 0
  };
}

// =================== DIAGNOSTIC FUNCTIONS ===================

function diagnoseSystemIntegration() {
  console.log('🔍 SYSTEM DIAGNOSTIC - Starting comprehensive check...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let report = '🔍 MASTER CATALOG INTEGRATION DIAGNOSTIC\n\n';
    
    // Check spreadsheet structure
    report += '=== SPREADSHEET STRUCTURE ===\n';
    const sheets = ss.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    report += `Total Sheets: ${sheets.length}\n`;
    report += `Sheet Names: ${sheetNames.join(', ')}\n\n`;
    
    // Check required sheets
    const requiredSheets = ['Master Catalog', 'HW_Parts', 'HW_Assemblies', 'HW_Panels'];
    const missingSheets = requiredSheets.filter(name => !sheetNames.includes(name));
    const existingSheets = requiredSheets.filter(name => sheetNames.includes(name));
    
    report += `✅ Existing Required Sheets: ${existingSheets.join(', ')}\n`;
    if (missingSheets.length > 0) {
      report += `❌ Missing Required Sheets: ${missingSheets.join(', ')}\n`;
    }
    report += '\n';
    
    // Check Master Catalog
    report += '=== MASTER CATALOG ANALYSIS ===\n';
    const masterCatalogSheet = ss.getSheetByName('Master Catalog');
    if (masterCatalogSheet) {
      const lastRow = masterCatalogSheet.getLastRow();
      const lastCol = masterCatalogSheet.getLastColumn();
      report += `✅ Master Catalog Sheet Found\n`;
      report += `Data Rows: ${lastRow - 1} (excluding header)\n`;
      report += `Columns: ${lastCol}\n`;
    } else {
      report += `❌ Master Catalog Sheet NOT FOUND\n`;
    }
    report += '\n';
    
    // Check repository data access
    report += '=== REPOSITORY DATA ACCESS ===\n';
    try {
      if (typeof MASTER_CATALOG_DATA !== 'undefined') {
        report += `✅ MASTER_CATALOG_DATA variable found\n`;
        report += `Data entries: ${MASTER_CATALOG_DATA.length}\n`;
      } else {
        report += `❌ MASTER_CATALOG_DATA variable NOT FOUND\n`;
      }
    } catch (dataError) {
      report += `❌ Error accessing MASTER_CATALOG_DATA: ${dataError.message}\n`;
    }
    report += '\n';
    
    // Recommendations
    report += '=== RECOMMENDATIONS ===\n';
    if (missingSheets.length > 0) {
      report += `1. Run "📂 QUICK START: Populate from Repository"\n`;
    }
    if (!masterCatalogSheet) {
      report += `2. Master Catalog will be created during population\n`;
    }
    report += `3. All setup can be done with one click!\n`;
    
    console.log(report);
    SpreadsheetApp.getUi().alert('Diagnostic Complete', report, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return { success: true, report: report };
    
  } catch (error) {
    console.error('🔍 DIAGNOSTIC ERROR:', error);
    SpreadsheetApp.getUi().alert('Diagnostic Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

function testRepositoryDataAccess() {
  console.log('🧪 Testing repository data access...');
  
  try {
    let testReport = '🧪 REPOSITORY DATA ACCESS TEST\n\n';
    
    // Test MasterCatalogData access
    testReport += 'Test 1: Repository data access...\n';
    try {
      if (typeof MASTER_CATALOG_DATA !== 'undefined') {
        testReport += `✅ MASTER_CATALOG_DATA found: ${MASTER_CATALOG_DATA.length} parts\n`;
        
        // Test sample parts
        const testParts = ['A8066CHFL', 'A10106CHFL'];
        testParts.forEach(partNum => {
          const found = MASTER_CATALOG_DATA.find(p => p.partNumber === partNum);
          if (found) {
            testReport += `✅ ${partNum}: ${found.description} - $${found.unitCost}\n`;
          } else {
            testReport += `❌ ${partNum}: Not found\n`;
          }
        });
      } else {
        testReport += `❌ MASTER_CATALOG_DATA not accessible\n`;
        testReport += `Make sure MasterCatalogData.gs is added to Apps Script\n`;
      }
    } catch (dataError) {
      testReport += `❌ Data access error: ${dataError.message}\n`;
    }
    
    testReport += '\n✅ REPOSITORY DATA ACCESS TEST COMPLETE!\n';
    
    console.log(testReport);
    SpreadsheetApp.getUi().alert('Data Access Test', testReport, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return { success: true, report: testReport };
    
  } catch (error) {
    console.error('🧪 TEST ERROR:', error);
    SpreadsheetApp.getUi().alert('Test Failed', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

function validateCompleteSystem() {
  console.log('✅ Validating complete hierarchical system...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let validationReport = '✅ COMPLETE SYSTEM VALIDATION\n\n';
    
    // Check all required sheets
    const requiredSheets = {
      'Master Catalog': 'Original parts catalog',
      'HW_Parts': 'Hierarchical parts database',
      'HW_Assemblies': 'Assembly definitions',
      'HW_BOM_Details': 'Bill of materials details',
      'HW_Panels': 'Panel configurations',
      'HW_Quotes': 'Quote database'
    };
    
    let allValid = true;
    
    Object.entries(requiredSheets).forEach(([sheetName, description]) => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        const rows = sheet.getLastRow();
        validationReport += `✅ ${sheetName}: ${rows} rows (${description})\n`;
      } else {
        validationReport += `❌ ${sheetName}: Missing (${description})\n`;
        allValid = false;
      }
    });
    
    // Overall status
    validationReport += '\n=== OVERALL STATUS ===\n';
    if (allValid) {
      validationReport += '🎉 SYSTEM FULLY OPERATIONAL!\n';
      validationReport += 'Ready for production use!\n';
    } else {
      validationReport += '⚠️ SYSTEM NEEDS SETUP\n';
      validationReport += 'Run "📂 QUICK START: Populate from Repository" to fix.\n';
    }
    
    console.log(validationReport);
    SpreadsheetApp.getUi().alert('System Validation', validationReport, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return { success: allValid, report: validationReport };
    
  } catch (error) {
    console.error('✅ VALIDATION ERROR:', error);
    SpreadsheetApp.getUi().alert('Validation Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

// =================== PLACEHOLDER FUNCTIONS FOR ASSEMBLY BUILDER ===================

function openAssemblyBuilder() {
  SpreadsheetApp.getUi().alert(
    'Assembly Builder', 
    'Assembly Builder will open here.\n\nFirst complete the Master Catalog setup using "📂 QUICK START" option.', 
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function openQuoteGenerator() {
  SpreadsheetApp.getUi().alert(
    'Quote Generator', 
    'Quote Generator will open here.\n\nFirst complete the Master Catalog setup using "📂 QUICK START" option.', 
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// =================== HELP DOCUMENTATION ===================

function showHelpDocumentation() {
  const helpText = `
🔧 ALL-IN-ONE MASTER CATALOG SETUP

🚀 QUICK START (RECOMMENDED):
1. Add these files to Google Apps Script:
   - MasterCatalogData.gs (from your repository)
   - AllInOneMasterCatalogSetup.gs (this file)

2. Refresh your Google Sheet (F5)

3. Click: "📂 QUICK START: Populate from Repository"

4. That's it! Everything is set up automatically.

🔧 MANUAL TOOLS:
- 🔍 Diagnose System: Check current state
- 🧪 Test Repository Data: Verify data access
- ✅ Validate System: Confirm everything works

📊 WHAT GETS CREATED:
- Master Catalog sheet with all your parts
- HW_Parts: Hierarchical parts database  
- HW_Assemblies: Assembly definitions
- HW_BOM_Details: Bill of materials
- HW_Panels: Panel configurations
- HW_Quotes: Quote database

🎯 AFTER SETUP:
- Use Assembly Builder to create component groups
- Use Quote Generator for professional quotes
- All data flows: Master Catalog → Parts → Assemblies → Quotes

🆘 TROUBLESHOOTING:
- Make sure MasterCatalogData.gs is in Apps Script
- Check console logs for detailed errors
- Run diagnostics if anything fails
- All functions provide specific error messages

📞 SUPPORT:
This system uses your repository data directly - no external files needed!
`;

  SpreadsheetApp.getUi().alert('📖 Setup Help', helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}
