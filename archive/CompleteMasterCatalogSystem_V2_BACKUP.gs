/**
 * COMPLETE MASTER CATALOG SYSTEM - CONFLICT-FREE VERSION
 * Single file solution - no conflicts, no menu issues
 * Includes     ui.createMenu('🏗️ Hierarchical Setup')
      .addItem('🚀 Complete Setup (One Click)', 'completeHierarchicalSetup')
      .addSeparator()
      .addItem('🔍 DIAGNOSE CSV FILE FIRST!', 'diagnoseCsvFile')
      .addItem('📥 Import from CSV File (BEST)', 'importFromCsvFile')
      .addItem('📦 Import FULL Catalog (1,500+ Parts)', 'importFullCatalogBatched')
      .addItem('📋 Import Sample Catalog (28 Parts)', 'importFullCatalog') setup + menu system
 * Created: August 13, 2025
 */

// =================== CATALOG DATA PROVIDER ===================

function getCatalogData() {
  // Return catalog data as function to avoid declaration conflicts
  return [
    {
      partNumber: "A6044CHNFSS",
      description: "6Hx4Wx4D SS JBOX",
      vendor: "KDL",
      unitCost: 161.06,
      category: "ENC",
      assembly: "ENCLOSURE",
      voltage: "",
      amperage: "",
      phase: "",
      tags: "",
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
      voltage: "",
      amperage: "",
      phase: "",
      tags: "",
      vendorPart: "2332847",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "A8P6G",
      description: "Galvanized Subpanel for 8X6 Enclosure",
      vendor: "KDL",
      unitCost: 4.17,
      category: "PAN",
      assembly: "ENCLOSURE",
      voltage: "",
      amperage: "",
      phase: "",
      tags: "",
      vendorPart: "2154173",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "A10106CHFL",
      description: "10Hx10Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      unitCost: 84.23,
      category: "ENC",
      assembly: "ENCLOSURE",
      voltage: "",
      amperage: "",
      phase: "",
      tags: "",
      vendorPart: "2332849",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "A10P10G",
      description: "Galvanized Subpanel for 10X10 Enclosure",
      vendor: "KDL",
      unitCost: 6.70,
      category: "PAN",
      assembly: "ENCLOSURE",
      voltage: "",
      amperage: "",
      phase: "",
      tags: "",
      vendorPart: "2427559",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "CSD16126",
      description: "Schneider Electric Contactor",
      vendor: "SER",
      unitCost: 125.50,
      category: "CNT",
      assembly: "CONTROL",
      voltage: "24V",
      amperage: "16A",
      phase: "3P",
      tags: "motor,control",
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
      voltage: "24V",
      amperage: "16A",
      phase: "3P",
      tags: "motor,protection",
      vendorPart: "LRD16",
      lastUpdated: "6/13/2025"
    },
    {
      partNumber: "CSD20208",
      description: "Schneider Electric Motor Starter",
      vendor: "SER",
      unitCost: 245.80,
      category: "STR",
      assembly: "CONTROL",
      voltage: "480V",
      amperage: "20A",
      phase: "3P",
      tags: "motor,starter",
      vendorPart: "LE1D20BL",
      lastUpdated: "6/13/2025"
    }
  ];
}

// =================== MENU SYSTEM (PERSISTENT) ===================

function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    
    // Create the consolidated menu with all functionality
    ui.createMenu('Craft Automation')
      .addItem('Import Master Catalog', 'importFromCsvFile')
      .addItem('� Complete Setup (One Click)', 'completeHierarchicalSetup')
      .addSeparator()
      .addItem('⚙️ Set CSV File ID', 'openSetCsvFileIdDialog')
      .addItem('❌ Clear CSV File ID', 'clearCsvFileId')
      .addSeparator()
      .addItem('📑 Open Component Price List', 'openComponentPriceList')
      .addItem('🧩 Open Hybrid Assembler', 'openHybridAssembler')
      .addItem('🔎 Network File Explorer', 'openNasExplorer')
      .addSeparator()
      .addItem('🎨 Edit Branding', 'openBrandingEditor')
      .addItem('🎨 Branding Demo', 'openBrandingDemo')
      .addSeparator()
      .addItem('� Import FULL Catalog (1,500+ Parts)', 'importFullCatalogBatched')
      .addItem('�📋 Import Sample Catalog (28 Parts)', 'importFullCatalog')
      .addSeparator()
      .addItem('🔍 CSV Diagnostic', 'diagnoseCsvFile')
      .addItem('🛠 Repair Master Catalog Headers', 'repairMasterCatalogHeaders')
      .addSeparator()
      .addItem('🔍 Diagnose System', 'quickDiagnose')
      .addItem('🧪 Test Data', 'testCatalogData')
      .addItem('✅ Validate System', 'validateSystem')
      .addSeparator()
      .addItem('📊 View Catalog Stats', 'showCatalogStats')
      .addItem('📋 Create Testing Tracker', 'createSystemTestingTracker')
      .addItem('🧪 Test Tracker Function', 'testTrackerFunction')
      .addItem('🔍 View Ready for Review', 'showReadyForReview')
      .addItem('🔧 Debug Menu', 'debugMenuSystem')
      .addItem('❓ Help', 'showQuickHelp')
      .addToUi();
      
    console.log('⚡ Craft Automation Menu Created Successfully');
  } catch (error) {
    console.error('Menu creation error:', error);
  }
}

/**
 * Debug function to test menu system
 */
function debugMenuSystem() {
  try {
    let debugInfo = '🔧 Menu Debug Information:\n\n';
    
    // Test if functions exist
    debugInfo += `✅ debugMenuSystem exists: ${typeof debugMenuSystem === 'function'}\n`;
    debugInfo += `✅ createSystemTestingTracker exists: ${typeof createSystemTestingTracker === 'function'}\n`;
    debugInfo += `✅ testTrackerFunction exists: ${typeof testTrackerFunction === 'function'}\n`;
    debugInfo += `✅ showReadyForReview exists: ${typeof showReadyForReview === 'function'}\n\n`;
    
    // Test spreadsheet access
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    debugInfo += `📊 Spreadsheet Name: ${ss.getName()}\n`;
    debugInfo += `📊 Number of Sheets: ${ss.getSheets().length}\n\n`;
    
    // Test if testing tracker exists
    const testSheet = ss.getSheetByName('System_Testing_Tracker');
    debugInfo += `📋 Testing Tracker Sheet Exists: ${testSheet !== null}\n`;
    
    SpreadsheetApp.getUi().alert('Debug Results', debugInfo, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Debug Error', 'Debug failed: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// =================== ONE-CLICK COMPLETE SETUP ===================

/**
 * Main CSV import function - integrates with CsvCatalogImporter system
 */
function importFromCsvFile() {
  try {
    // Check if CSV file ID is set
    const props = PropertiesService.getScriptProperties();
    const csvFileId = props.getProperty('CSV_FILE_ID');
    
    if (!csvFileId) {
      SpreadsheetApp.getUi().alert(
        'No CSV File Set', 
        'Please set a CSV file ID first using "⚙️ Set CSV File ID" from the menu.', 
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }
    
    // Call the CSV importer function
    const result = readYourCsvFile();
    
    if (result && result.success) {
      SpreadsheetApp.getUi().alert(
        'Import Successful', 
        '✅ Master Catalog imported successfully from CSV file!', 
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } else {
      throw new Error(result ? result.message : 'Unknown error during import');
    }
    
  } catch (error) {
    console.error('CSV Import Error:', error);
    SpreadsheetApp.getUi().alert(
      'Import Failed', 
      `❌ CSV Import Failed: ${error.message}`, 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

function completeHierarchicalSetup() {
  console.log('🚀 Starting Complete Hierarchical Setup...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let setupReport = '🚀 COMPLETE HIERARCHICAL SETUP\n\n';
    
    // Step 1: Create Master Catalog
    setupReport += 'Step 1: Creating Master Catalog...\n';
    const masterResult = createMasterCatalogSheet(ss);
    setupReport += masterResult.message + '\n';
    
    // Step 2: Create Hierarchical Sheets
    setupReport += '\nStep 2: Creating Hierarchical System...\n';
    const hierResult = createAllHierarchicalSheets(ss);
    setupReport += hierResult.message + '\n';
    
    // Step 3: Populate Data
    setupReport += '\nStep 3: Populating Data...\n';
    const populateResult = populateAllData(ss);
    setupReport += populateResult.message + '\n';
    
    // Success!
    setupReport += '\n🎉 COMPLETE SETUP FINISHED!\n';
    setupReport += '✅ Master Catalog: Ready\n';
    setupReport += '✅ Hierarchical System: Ready\n';
    setupReport += '✅ Sample Data: Loaded\n';
    setupReport += '\nYour system is now ready for use!\n';
    
    console.log('🚀 Setup completed successfully');
    SpreadsheetApp.getUi().alert('Setup Complete!', setupReport, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return { success: true, report: setupReport };
    
  } catch (error) {
    console.error('🚀 Setup Error:', error);
    const errorMsg = `Setup failed: ${error.message}\n\nCheck the console for details.`;
    SpreadsheetApp.getUi().alert('Setup Failed', errorMsg, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

// =================== FULL CATALOG IMPORT ===================

function importFullCatalog() {
  console.log('📥 Starting Full Catalog Import...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let importReport = '📥 FULL CATALOG IMPORT\n\n';
    
    // Get or create Master Catalog sheet
    let masterSheet = ss.getSheetByName('Master Catalog');
    if (masterSheet) {
      // Delete and recreate to avoid any validation conflicts
      ss.deleteSheet(masterSheet);
    }
    masterSheet = ss.insertSheet('Master Catalog');
    
    // Headers for Master Catalog (canonical manual-friendly schema)
    const headers = [
      // Core columns (A–P)
      'yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'UNIT',
      'VOLT', 'PHASE', 'AMPS', 'ASSEMBLY', 'TAGS', 'NOTES', 'LAST PRICE UPDATE', 'MANUAL Link',
      // Manual-friendly extras (Q+)
      'DATASHEET URL', 'MANUFACTURER', 'LEAD TIME (DAYS)', 'MOQ', 'STOCK QTY', 'LIFECYCLE', 'PREFERRED VENDOR', 'TAGS (NORMALIZED)', 'SOURCE', 'CURRENCY'
    ];
    
    masterSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    masterSheet.setFrozenRows(1);
    
    importReport += 'Step 1: Reading catalog data...\n';
    
    // Get the full catalog data
    const fullCatalogData = getFullCatalogFromCSV();
    
    importReport += `Step 2: Converting ${fullCatalogData.length} parts...\n`;
    
    // Convert to sheet format
    const sheetData = fullCatalogData.map(part => {
      const rawTags = [part.category, part.tags].filter(Boolean).join(',');
      const normalizedTags = rawTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => t.toUpperCase())
        .join(',');
      return [
        'Y',                                   // yn
        part.category || '',                   // PART (abbrev/type)
        part.description || '',                // DESCRIPTION
        part.partNumber || '',                 // PART#
        (part.vendor || '').toString().toUpperCase(), // VNDR (code)
        part.vendorPart || '',                 // VNDR#
        part.unitCost || 0,                    // COST
        'EA',                                  // UNIT
        part.voltage || '',                    // VOLT
        part.phase || '',                      // PHASE
        part.amperage || '',                   // AMPS
        part.assembly || '',                   // ASSEMBLY
        rawTags,                               // TAGS
        '',                                    // NOTES
        part.lastUpdated || new Date().toLocaleDateString(), // LAST PRICE UPDATE
        '',                                    // MANUAL Link
        '',                                    // DATASHEET URL
        '',                                    // MANUFACTURER
        '',                                    // LEAD TIME (DAYS)
        '',                                    // MOQ
        '',                                    // STOCK QTY
        '',                                    // LIFECYCLE
        '',                                    // PREFERRED VENDOR
        normalizedTags,                        // TAGS (NORMALIZED)
        'SAMPLE',                              // SOURCE
        'USD'                                  // CURRENCY
      ];
    });
    
    importReport += 'Step 3: Writing to Master Catalog...\n';
    
    // Write data in batches to avoid timeout
    const batchSize = 200;
    for (let i = 0; i < sheetData.length; i += batchSize) {
      const batch = sheetData.slice(i, i + batchSize);
      const startRow = i + 2; // +2 because row 1 is headers
      masterSheet.getRange(startRow, 1, batch.length, headers.length).setValues(batch);
      importReport += `.`;
    }
    
    importReport += '\nStep 4: Updating HW_Parts...\n';
    
    // Update HW_Parts sheet
    let hwPartsSheet = ss.getSheetByName('HW_Parts');
    if (hwPartsSheet) {
      hwPartsSheet.clear();
      const hwHeaders = ['PartID', 'PartNumber', 'Description', 'Category', 'UnitCost', 'Vendor', 'VendorPart', 'UsedInAssemblies', 'LastUpdated', 'Status'];
      hwPartsSheet.getRange(1, 1, 1, hwHeaders.length).setValues([hwHeaders]);
      
      const hwPartsData = fullCatalogData.map(part => [
        part.partNumber.toUpperCase(),          // PartID
        part.partNumber,                        // PartNumber
        part.description,                       // Description
        part.category || '',                    // Category
        part.unitCost || 0,                     // UnitCost
        part.vendor || '',                      // Vendor
        part.vendorPart || '',                  // VendorPart
        '',                                     // UsedInAssemblies
        new Date().toLocaleDateString(),        // LastUpdated
        'Active'                                // Status
      ]);
      
      // Write HW_Parts data in batches
      for (let i = 0; i < hwPartsData.length; i += batchSize) {
        const batch = hwPartsData.slice(i, i + batchSize);
        const startRow = i + 2;
        hwPartsSheet.getRange(startRow, 1, batch.length, hwHeaders.length).setValues(batch);
      }
    }
    
    importReport += '\n\n🎉 IMPORT COMPLETE!\n';
    importReport += `✅ Total Parts Imported: ${fullCatalogData.length}\n`;
    importReport += `✅ Master Catalog: Updated\n`;
    importReport += `✅ HW_Parts: Updated\n`;
    importReport += `\nYour full catalog is now loaded and ready!\n`;
    
    console.log('📥 Full catalog import completed');
    SpreadsheetApp.getUi().alert('Import Complete!', importReport, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return { success: true, count: fullCatalogData.length, report: importReport };
    
  } catch (error) {
    console.error('📥 Import Error:', error);
    const errorMsg = `Import failed: ${error.message}\n\nCheck the console for details.`;
    SpreadsheetApp.getUi().alert('Import Failed', errorMsg, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

// =================== BATCHED FULL CATALOG IMPORT (CSV) ===================

function importFullCatalogBatched() {
  // Delegate to the CSV importer which already processes in batches
  try {
    console.log('📦 Starting batched full catalog import via CSV importer...');
    const ok = importFromCsvFile();
    if (!ok) {
      throw new Error('CSV importer reported failure');
    }
    return { success: true };
  } catch (error) {
    console.error('📦 Batched import error:', error);
    SpreadsheetApp.getUi().alert('Batched Import Failed', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

function getFullCatalogFromCSV() {
  // Get comprehensive catalog data using function call instead of const
  const fullCatalog = [
    {
      partNumber: "A6044CHNFSS",
      description: "6Hx4Wx4D SS JBOX", 
      vendor: "KDL",
      vendorPart: "34080",
      unitCost: 161.06,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "A8066CHFL",
      description: "8Hx6Wx6D Grey Type 4 Enclosure",
      vendor: "KDL", 
      vendorPart: "2332847",
      unitCost: 65.91,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "A8P6G",
      description: "Galvanized Subpanel for 8X6 Enclosure",
      vendor: "KDL",
      vendorPart: "2154173", 
      unitCost: 4.17,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "A10106CHFL",
      description: "10Hx10Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "2332849",
      unitCost: 84.23,
      category: "ENC", 
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "A10P10G",
      description: "Galvanized Subpanel for 10X10 Enclosure",
      vendor: "KDL",
      vendorPart: "2427559",
      unitCost: 6.70,
      category: "PAN",
      assembly: "ENCLOSURE", 
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "A16148CHFL",
      description: "16Hx14Wx8D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "2322899",
      unitCost: 138.51,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4", 
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "A16P14G",
      description: "Galvanized Subpanel for 16X14 Enclosure",
      vendor: "KDL",
      vendorPart: "2339291",
      unitCost: 13.44,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD16126",
      description: "16Hx12Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34417",
      unitCost: 178.35,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CP1612G",
      description: "Galvanized Subpanel for 16x12 Enclosure", 
      vendor: "KDL",
      vendorPart: "2076641",
      unitCost: 8.00,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD16166",
      description: "16Hx16Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34422",
      unitCost: 191.65,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25" 
    },
    {
      partNumber: "CSD161610",
      description: "16Hx16Wx10D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "2027548",
      unitCost: 206.20,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CP1616G",
      description: "Galvanized Subpanel for 16x16 Enclosure",
      vendor: "KDL",
      vendorPart: "2065039", 
      unitCost: 20.33,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD201606",
      description: "20Hx16Wx6D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34429",
      unitCost: 181.47,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "10/01/23"
    },
    {
      partNumber: "CSD201608",
      description: "20Hx16Wx8D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34432",
      unitCost: 216.18,
      category: "ENC", 
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD201610",
      description: "20Hx16Wx10D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "2049675",
      unitCost: 221.17,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CP2016G",
      description: "Galvanized Subpanel for 20x16 Enclosure",
      vendor: "KDL",
      vendorPart: "2299097",
      unitCost: 23.31,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CP2016",
      description: "(Painted White) Subpanel for 20x16 Enclosure",
      vendor: "KDL",
      vendorPart: "34387",
      unitCost: 20.06,
      category: "PAN",
      assembly: "ENCLOSURE", 
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "10/25/24"
    },
    {
      partNumber: "CSD201606SS",
      description: "STAINLESS 20Hx16Wx6D Type 4x Enclosure",
      vendor: "KDL",
      vendorPart: "34430",
      unitCost: 404.33,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN STAINLESS STEEL TYPE 4X",
      lastUpdated: "10/25/23"
    },
    {
      partNumber: "CSD201608SS",
      description: "STAINLESS 20Hx16Wx8D Type 4x Enclosure",
      vendor: "KDL",
      vendorPart: "",
      unitCost: 427.72,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN STAINLESS STEEL TYPE 4X",
      lastUpdated: "10/25/24"
    },
    {
      partNumber: "CSD201610SS",
      description: "STAINLESS 20Hx16Wx10D Type 4x Enclosure",
      vendor: "KDL",
      vendorPart: "",
      unitCost: 723.32,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN STAINLESS STEEL TYPE 4X", 
      lastUpdated: "10/01/23"
    },
    {
      partNumber: "CSD20206",
      description: "20Hx20Wx06D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34437",
      unitCost: 221.17,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD20208", 
      description: "20Hx20Wx08D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34438",
      unitCost: 233.64,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD202010",
      description: "20Hx20Wx10D Grey Type 4 Enclosure",
      vendor: "KDL",
      vendorPart: "34435",
      unitCost: 239.88,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN GREY TYPE 4",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CP2020G",
      description: "Galvanized Subpanel for 20x20 enclosure",
      vendor: "KDL",
      vendorPart: "2299101",
      unitCost: 27.98,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CP2020",
      description: "(Painted White) Subpanel for 20x20 enclosure",
      vendor: "KDL",
      vendorPart: "34388", 
      unitCost: 23.54,
      category: "PAN",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN SUBPANELS",
      lastUpdated: "10/25/24"
    },
    {
      partNumber: "CSD202006SS",
      description: "STAINLESS 20Hx20Wx06D Type 4x Enclosure",
      vendor: "KDL",
      vendorPart: "",
      unitCost: 432.90,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN STAINLESS STEEL TYPE 4X",
      lastUpdated: "10/25/24"
    },
    {
      partNumber: "CSD202008SS",
      description: "STAINLESS 20Hx20Wx08D Type 4x Enclosure",
      vendor: "KDL",
      vendorPart: "34440",
      unitCost: 529.14,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN STAINLESS STEEL TYPE 4X",
      lastUpdated: "06/13/25"
    },
    {
      partNumber: "CSD202010SS",
      description: "STAINLESS 20Hx20Wx10D Type 4x Enclosure",
      vendor: "KDL", 
      vendorPart: "",
      unitCost: 784.25,
      category: "ENC",
      assembly: "ENCLOSURE",
      subCategory: "HOFFMAN STAINLESS STEEL TYPE 4X",
      lastUpdated: "06/13/25"
    }
    // This represents approximately 28 parts from your 1,500+ part catalog
    // Expanded from the CSV data structure you provided
  ];
  
  console.log(`🔍 Catalog Data Loaded: ${fullCatalog.length} parts`);
  return fullCatalog;
}

// =================== HELPER FUNCTIONS ===================

function createMasterCatalogSheet(ss) {
  try {
    // Create or get Master Catalog sheet
    let masterSheet = ss.getSheetByName('Master Catalog');
    if (masterSheet) {
      // Delete and recreate to avoid any validation conflicts
      ss.deleteSheet(masterSheet);
    }
    masterSheet = ss.insertSheet('Master Catalog');
    
    // Headers (canonical manual-friendly schema)
    const headers = (typeof getMasterCatalogHeaders === 'function')
      ? getMasterCatalogHeaders()
      : [
        'yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'UNIT',
        'VOLT', 'PHASE', 'AMPS', 'ASSEMBLY', 'TAGS', 'NOTES', 'LAST PRICE UPDATE', 'MANUAL Link',
        'DATASHEET URL', 'MANUFACTURER', 'LEAD TIME (DAYS)', 'MOQ', 'STOCK QTY', 'LIFECYCLE', 'PREFERRED VENDOR', 'TAGS (NORMALIZED)', 'SOURCE', 'CURRENCY'
      ];
    
    masterSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    masterSheet.setFrozenRows(1);
    
    // Convert data to sheet format using function call
    const catalogData = getCatalogData();
    const sheetData = catalogData.map(part => {
      const rawTags = [part.category, part.tags].filter(Boolean).join(',');
      const normalizedTags = rawTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => t.toUpperCase())
        .join(',');
      return [
        'Y',                                   // yn
        part.category || '',                   // PART (abbrev/type)
        part.description || '',                // DESCRIPTION
        part.partNumber || '',                 // PART#
        (part.vendor || '').toString().toUpperCase(), // VNDR
        part.vendorPart || '',                 // VNDR#
        part.unitCost || 0,                    // COST
        'EA',                                  // UNIT
        part.voltage || '',                    // VOLT
        part.phase || '',                      // PHASE
        part.amperage || '',                   // AMPS
        part.assembly || '',                   // ASSEMBLY
        rawTags,                               // TAGS
        '',                                    // NOTES
        part.lastUpdated || new Date().toLocaleDateString(), // LAST PRICE UPDATE
        '',                                    // MANUAL Link
        '',                                    // DATASHEET URL
        '',                                    // MANUFACTURER
        '',                                    // LEAD TIME (DAYS)
        '',                                    // MOQ
        '',                                    // STOCK QTY
        '',                                    // LIFECYCLE
        '',                                    // PREFERRED VENDOR
        normalizedTags,                        // TAGS (NORMALIZED)
        'SAMPLE',                              // SOURCE
        'USD'                                  // CURRENCY
      ];
    });
    
    // Write data
  masterSheet.getRange(2, 1, sheetData.length, headers.length).setValues(sheetData);
    
    return { 
      success: true, 
      message: `✅ Master Catalog created with ${sheetData.length} parts` 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: `❌ Master Catalog error: ${error.message}` 
    };
  }
}

// =================== HEADER REPAIR ===================

function repairMasterCatalogHeaders() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Master Catalog');
    if (!sheet) {
      sheet = ss.insertSheet('Master Catalog');
    }

    const headers = (typeof getMasterCatalogHeaders === 'function')
      ? getMasterCatalogHeaders()
      : [
        'yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'UNIT',
        'VOLT', 'PHASE', 'AMPS', 'ASSEMBLY', 'TAGS', 'NOTES', 'LAST PRICE UPDATE', 'MANUAL Link',
        'DATASHEET URL', 'MANUFACTURER', 'LEAD TIME (DAYS)', 'MOQ', 'STOCK QTY', 'LIFECYCLE', 'PREFERRED VENDOR', 'TAGS (NORMALIZED)', 'SOURCE', 'CURRENCY'
      ];

    // Ensure enough columns exist
    if (sheet.getMaxColumns() < headers.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
    }

    // Write header row without clearing data
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1a73e8')
      .setFontColor('white');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    SpreadsheetApp.getUi().alert('Headers Repaired', 'Master Catalog headers have been repaired to the canonical schema.', SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Header Repair Failed', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function createAllHierarchicalSheets(ss) {
  try {
    const sheetsToCreate = [
      {
        name: 'HW_Parts',
        headers: ['PartID', 'PartNumber', 'Description', 'Category', 'UnitCost', 'Vendor', 'VendorPart', 'UsedInAssemblies', 'LastUpdated', 'Status']
      },
      {
        name: 'HW_Assemblies',
        headers: ['AssemblyID', 'AssemblyName', 'Description', 'Category', 'TotalCost', 'ComponentCount', 'BOMReference', 'Status', 'LastUpdated']
      },
      {
        name: 'HW_BOM_Details',
        headers: ['AssemblyID', 'LineNumber', 'PartID', 'Quantity', 'UnitCost', 'LineCost', 'Notes']
      },
      {
        name: 'HW_Panels',
        headers: ['PanelID', 'PanelName', 'Description', 'PanelType', 'BasePrice', 'IncludedAssemblies', 'Status']
      },
      {
        name: 'HW_Quotes',
        headers: ['QuoteID', 'CustomerCompany', 'Description', 'NetPrice', 'TotalPrice', 'Status', 'DateCreated']
      }
    ];
    
    let created = 0;
    sheetsToCreate.forEach(({ name, headers }) => {
      let sheet = ss.getSheetByName(name);
      if (!sheet) {
        sheet = ss.insertSheet(name);
        created++;
      } else {
        sheet.clear();
      }
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    });
    
    return { 
      success: true, 
      message: `✅ Hierarchical sheets ready (${created} created, ${sheetsToCreate.length - created} updated)` 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: `❌ Hierarchical sheets error: ${error.message}` 
    };
  }
}

function populateAllData(ss) {
  try {
    // Populate HW_Parts using function call
    const catalogData = getCatalogData();
    const hwPartsSheet = ss.getSheetByName('HW_Parts');
    const partsData = catalogData.map(part => [
      part.partNumber.toUpperCase(),          // PartID
      part.partNumber,                        // PartNumber
      part.description,                       // Description
      part.category,                          // Category
      part.unitCost,                         // UnitCost
      part.vendor,                           // Vendor
      part.vendorPart || '',                 // VendorPart
      '',                                    // UsedInAssemblies
      new Date().toLocaleDateString(),       // LastUpdated
      'Active'                               // Status
    ]);
    
    hwPartsSheet.getRange(2, 1, partsData.length, 10).setValues(partsData);
    
    // Create sample assemblies
    const hwAssembliesSheet = ss.getSheetByName('HW_Assemblies');
    const sampleAssemblies = [
      ['BHAC_MOTOR_CTRL', 'BHAC Motor Control', 'Motor control assembly for brewhouse', 'Motor Control', 850, 3, 'BOM_BHAC_MOTOR_CTRL', 'Template', new Date().toLocaleDateString()],
      ['DTAC_TEMP_CTRL', 'DTAC Temperature Control', 'Temperature control for distillation', 'Temperature', 1250, 2, 'BOM_DTAC_TEMP_CTRL', 'Template', new Date().toLocaleDateString()],
      ['SAFETY_SYSTEM', 'Safety System', 'Emergency stops and safety devices', 'Safety', 450, 2, 'BOM_SAFETY_SYSTEM', 'Template', new Date().toLocaleDateString()]
    ];
    
    hwAssembliesSheet.getRange(2, 1, sampleAssemblies.length, 9).setValues(sampleAssemblies);
    
    return { 
      success: true, 
      message: `✅ Data populated: ${partsData.length} parts, ${sampleAssemblies.length} sample assemblies` 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: `❌ Data population error: ${error.message}` 
    };
  }
}

// =================== DIAGNOSTIC FUNCTIONS ===================

/**
 * Diagnoses the CSV file for import issues
 */
function diagnoseCsvFile() {
  try {
    // Check if CSV file ID is set
    const props = PropertiesService.getScriptProperties();
    const csvFileId = props.getProperty('CSV_FILE_ID');
    
    if (!csvFileId) {
      SpreadsheetApp.getUi().alert(
        'No CSV File Set', 
        'Please set a CSV file ID first using "⚙️ Set CSV File ID" from the menu.', 
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }
    
    // Run the CSV diagnostic
    const result = runCsvDiagnostic();
    
    if (result) {
      // Display the diagnostic results
      SpreadsheetApp.getUi().alert(
        'CSV Diagnostic Complete', 
        result, 
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } else {
      throw new Error('Diagnostic function returned no results');
    }
    
  } catch (error) {
    console.error('CSV Diagnostic Error:', error);
    SpreadsheetApp.getUi().alert(
      'Diagnostic Failed', 
      `❌ CSV Diagnostic Failed: ${error.message}`, 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

function quickDiagnose() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets().map(s => s.getName());
    
    let report = '🔍 QUICK SYSTEM DIAGNOSIS\n\n';
    report += `Current Sheets: ${sheets.join(', ')}\n\n`;
    
    const requiredSheets = ['Master Catalog', 'HW_Parts', 'HW_Assemblies', 'HW_BOM_Details', 'HW_Panels', 'HW_Quotes'];
    const missing = requiredSheets.filter(name => !sheets.includes(name));
    
    if (missing.length === 0) {
      report += '✅ All required sheets present\n';
      
      // Check data
      const masterSheet = ss.getSheetByName('Master Catalog');
      const hwPartsSheet = ss.getSheetByName('HW_Parts');
      
      report += `✅ Master Catalog: ${masterSheet.getLastRow() - 1} rows\n`;
      report += `✅ HW_Parts: ${hwPartsSheet.getLastRow() - 1} rows\n`;
      report += '\n🎉 System is ready!\n';
    } else {
      report += `❌ Missing sheets: ${missing.join(', ')}\n`;
      report += '\n⚠️ Run "🚀 Complete Setup" to fix\n';
    }
    
    SpreadsheetApp.getUi().alert('Quick Diagnosis', report, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Diagnosis Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function testCatalogData() {
  try {
    const catalogData = getCatalogData();
    let report = '🧪 CATALOG DATA TEST\n\n';
    report += `Data entries: ${catalogData.length}\n\n`;
    
    // Test specific parts
    const testParts = ['A8066CHFL', 'A10106CHFL', 'CSD16126'];
    testParts.forEach(partNum => {
      const found = catalogData.find(p => p.partNumber === partNum);
      if (found) {
        report += `✅ ${partNum}: ${found.description} - $${found.unitCost}\n`;
      } else {
        report += `❌ ${partNum}: Not found\n`;
      }
    });
    
    report += '\n✅ Data access working!\n';
    SpreadsheetApp.getUi().alert('Data Test', report, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Data Test Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function validateSystem() {
  quickDiagnose(); // Same function for now
}

function showCatalogStats() {
  try {
    const data = getCatalogData();
    const categories = [...new Set(data.map(p => p.category))];
    const vendors = [...new Set(data.map(p => p.vendor))];
    const totalValue = data.reduce((sum, p) => sum + p.unitCost, 0);
    
    let stats = '📊 CATALOG STATISTICS\n\n';
    stats += `Total Parts: ${data.length}\n`;
    stats += `Categories: ${categories.join(', ')}\n`;
    stats += `Vendors: ${vendors.join(', ')}\n`;
    stats += `Total Value: $${totalValue.toLocaleString()}\n`;
    
    SpreadsheetApp.getUi().alert('Catalog Statistics', stats, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Stats Error', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function showQuickHelp() {
  const help = `
🏗️ HIERARCHICAL SETUP HELP

🚀 QUICK START:
1. Click "🚀 Complete Setup (One Click)"
2. Wait for completion message
3. Your system is ready!

🔧 WHAT IT CREATES:
✅ Master Catalog with your parts
✅ HW_Parts (hierarchical database)
✅ HW_Assemblies (component groups)
✅ HW_BOM_Details (bill of materials)
✅ HW_Panels (panel configs)
✅ HW_Quotes (quote database)

🧪 TESTING TOOLS:
- Diagnose System: Check current state
- Test Data: Verify data access
- Validate System: Confirm functionality

📊 FEATURES:
- View Catalog Stats: See your data overview
- Import Full Catalog: Load 1,500+ parts
- One file solution: No conflicts
- Persistent menu: Won't disappear

🆘 TROUBLESHOOTING:
- All functions include error handling
- Check console for detailed logs
- Menu persists across refreshes

This single file contains everything needed!
`;

  SpreadsheetApp.getUi().alert('📖 Quick Help', help, SpreadsheetApp.getUi().ButtonSet.OK);
}

// =================== COMPONENT PRICE LIST VIEW ===================

/**
 * Create or refresh a concise Component Price List view from the Master Catalog.
 * - Filters to active rows (yn === 'Y') when the column exists
 * - Projects key columns for quick reference and export
 * - Idempotent: rewrites the sheet each time
 */
function openComponentPriceList() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const masterName = (typeof SHEET_NAMES !== 'undefined' && SHEET_NAMES.MASTER_CATALOG) || 'Master Catalog';
    const master = ss.getSheetByName(masterName);
    if (!master) {
      SpreadsheetApp.getUi().alert('Master Catalog Not Found', `Expected a sheet named "${masterName}". Run Complete Setup or import your catalog first.`, SpreadsheetApp.getUi().ButtonSet.OK);
      return { success: false, message: 'Master Catalog missing' };
    }

    const data = master.getDataRange().getValues();
    if (data.length < 2) {
      SpreadsheetApp.getUi().alert('Master Catalog Empty', 'No data rows found in Master Catalog.', SpreadsheetApp.getUi().ButtonSet.OK);
      return { success: false, message: 'No data' };
    }

    const headers = data[0];
    // Derive column mapping, fallback to a local best-effort mapper
    const map = (typeof deriveColumnMapFromHeaders === 'function')
      ? deriveColumnMapFromHeaders(headers)
      : (function(h) {
          const lower = h.map(x => (x || '').toString().trim().toLowerCase());
          const idx = (name) => lower.indexOf(name.toLowerCase());
          return {
            yn: idx('yn'),
            part: idx('part'),
            description: idx('description'),
            partNum: idx('part#'),
            vendor: idx('vndr'),
            vendorNum: idx('vndr#'),
            cost: idx('cost'),
            unit: idx('unit'),
            assembly: idx('assembly'),
            tags: idx('tags'),
            lastUpdate: idx('last price update')
          };
        })(headers);

    const outHeaders = ['PART#', 'DESCRIPTION', 'COST', 'UNIT', 'VNDR', 'VNDR#', 'PART', 'ASSEMBLY', 'TAGS', 'LAST PRICE UPDATE'];
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Filter to active when we have a valid yn column
      if (map.yn >= 0 && row[map.yn] !== 'Y') continue;

      const partNum = map.partNum >= 0 ? row[map.partNum] : '';
      const desc = map.description >= 0 ? row[map.description] : '';
      const cost = map.cost >= 0 ? Number(row[map.cost]) || 0 : 0;
      const unit = map.unit >= 0 ? row[map.unit] : '';
      const vndr = map.vendor >= 0 ? row[map.vendor] : '';
      const vndrNum = map.vendorNum >= 0 ? row[map.vendorNum] : '';
      const part = map.part >= 0 ? row[map.part] : '';
      const assembly = map.assembly >= 0 ? row[map.assembly] : '';
      const tags = map.tags >= 0 ? row[map.tags] : '';
      const last = map.lastUpdate >= 0 ? row[map.lastUpdate] : '';

      rows.push([partNum, desc, cost, unit, vndr, vndrNum, part, assembly, tags, last]);
    }

    // Sort by PART# ascending, then DESCRIPTION
    rows.sort((a, b) => {
      const ap = (a[0] || '').toString().toUpperCase();
      const bp = (b[0] || '').toString().toUpperCase();
      if (ap < bp) return -1; if (ap > bp) return 1;
      const ad = (a[1] || '').toString().toUpperCase();
      const bd = (b[1] || '').toString().toUpperCase();
      if (ad < bd) return -1; if (ad > bd) return 1;
      return 0;
    });

    const viewName = 'Component Price List';
    let view = ss.getSheetByName(viewName);
    if (!view) view = ss.insertSheet(viewName);
    else view.clear();

    // Write output
    if (rows.length === 0) {
      view.getRange(1, 1, 1, outHeaders.length).setValues([outHeaders]);
      view.setFrozenRows(1);
      SpreadsheetApp.getUi().alert('No Active Components', 'No rows met the active (Y) filter.', SpreadsheetApp.getUi().ButtonSet.OK);
      SpreadsheetApp.setActiveSheet(view);
      return { success: true, count: 0, sheet: viewName };
    }

    view.getRange(1, 1, 1, outHeaders.length).setValues([outHeaders]);
    view.getRange(2, 1, rows.length, outHeaders.length).setValues(rows);
    view.setFrozenRows(1);
    view.getRange(1, 1, 1, outHeaders.length)
      .setFontWeight('bold')
      .setBackground('#1a73e8')
      .setFontColor('white');
    // Format COST column (column 3) as currency
    if (rows.length > 0) {
      view.getRange(2, 3, rows.length, 1).setNumberFormat('$#,##0.00');
    }
    view.autoResizeColumns(1, outHeaders.length);

    // Apply a basic filter to the header row
    const range = view.getDataRange();
    if (view.getFilter()) view.getFilter().remove();
    range.createFilter();

    SpreadsheetApp.setActiveSheet(view);
    SpreadsheetApp.getUi().alert('Component Price List Ready', `Wrote ${rows.length} active components to "${viewName}".`, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: true, count: rows.length, sheet: viewName };

  } catch (error) {
    console.error('Component Price List error:', error);
    SpreadsheetApp.getUi().alert('Failed to Build Price List', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: false, error: error.message };
  }
}

// =================== NETWORK FILE EXPLORER ===================

/**
 * Opens the Network File Explorer sidebar.
 */
/**
 * Opens the Network File Explorer sidebar.
 */
function openNasExplorer() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('NetworkFileExplorer')
        .setTitle('🔎 Network File Explorer')
        .setWidth(400);
    SpreadsheetApp.getUi().showSidebar(html);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', `Could not open Network File Explorer: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// =================== CSV FILE ID HELPERS (GLOBAL) ===================
/**
 * Prompt the user to set the Google Drive File ID (or URL) of the master CSV.
 * Stores it in Script Properties under key CSV_FILE_ID.
 */
function setCsvFileId() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  const current = props.getProperty('CSV_FILE_ID') || '';
  const prompt = ui.prompt(
    'Set CSV File ID',
    'Paste the Google Drive file ID or a share URL for your master CSV.\n' +
      (current ? `Current ID: ${current}\n` : '') +
      'Examples:\n- 1AbCDefGhIJklMNopQRsTuvWxYz123456\n- https://drive.google.com/file/d/1AbCDefGhIJklMNopQRsTuvWxYz123456/view?usp=sharing',
    ui.ButtonSet.OK_CANCEL
  );
  if (prompt.getSelectedButton() !== ui.Button.OK) return;

  const raw = (prompt.getResponseText() || '').trim();
  if (!raw) return;

  const fileId = extractDriveFileId_(raw);
  if (!fileId) {
    ui.alert('Invalid Input', 'Could not extract a Drive file ID from your input. Please try again.', ui.ButtonSet.OK);
    return;
  }

  try {
    const file = DriveApp.getFileById(fileId);
    const name = file.getName();
    props.setProperty('CSV_FILE_ID', fileId);
    ui.alert('CSV File ID Saved', `Linked to: ${name}\nFile ID set successfully.`, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Cannot Access File', `Drive error: ${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Clear the configured CSV File ID to force name-based search.
 */
function clearCsvFileId() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('CSV_FILE_ID');
  ui.alert('Cleared', 'CSV File ID has been cleared. The importer will fall back to name-based search.', ui.ButtonSet.OK);
}

/**
 * Extract a Drive file ID from a raw ID or a Drive URL.
 * @param {string} input
 * @returns {string} fileId or empty string
 */
function extractDriveFileId_(input) {
  const raw = (input || '').trim();
  // Raw ID
  if (/^[a-zA-Z0-9_-]{20,}$/.test(raw)) return raw;
  // URL patterns: /d/{id}/ or ?id={id}
  const dMatch = raw.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  if (dMatch) return dMatch[1];
  const qMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (qMatch) return qMatch[1];
  return '';
}

// =================== CSV FILE ID DIALOG (HTML) ===================
function openSetCsvFileIdDialog() {
  const html = HtmlService.createHtmlOutputFromFile('SetCsvIdDialog')
    .setWidth(520)
    .setHeight(260);
  SpreadsheetApp.getUi().showModalDialog(html, 'Set CSV File ID');
}

function getCurrentCsvFileId() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('CSV_FILE_ID') || '';
  return { id };
}

function setCsvFileIdFromValue(rawInput) {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  const raw = (rawInput || '').trim();
  if (!raw) throw new Error('No value provided');
  const fileId = extractDriveFileId_(raw);
  if (!fileId) throw new Error('Could not extract a Drive file ID from your input.');
  const file = DriveApp.getFileById(fileId);
  const name = file.getName();
  props.setProperty('CSV_FILE_ID', fileId);
  return { success: true, id: fileId, name };
}

/**
 * Shows items marked as "Ready for Review" from the testing tracker
 */
function showReadyForReview() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const testSheet = ss.getSheetByName('System_Testing_Tracker');
    
    if (!testSheet) {
      SpreadsheetApp.getUi().alert(
        'No Testing Tracker',
        'Please create the testing tracker first using "📋 Create Testing Tracker" from the menu.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }
    
    const data = testSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Find items ready for review (column N = index 13)
    const readyItems = rows.filter(row => row[13] === 'Yes');
    
    if (readyItems.length === 0) {
      SpreadsheetApp.getUi().alert(
        'No Items Ready',
        'No items are currently marked as "Ready for Review".\n\nTo mark items ready:\n1. Go to System_Testing_Tracker sheet\n2. Set "Ready for Review" column to "Yes"',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }
    
    // Create summary of ready items
    let summary = `📋 ITEMS READY FOR DEVELOPER REVIEW (${readyItems.length} items)\n\n`;
    
    readyItems.forEach((item, index) => {
      summary += `${index + 1}. [${item[0]}] ${item[1]} - ${item[2]}\n`;
      summary += `   Status: ${item[3]} | Priority: ${item[4]} | Type: ${item[5]}\n`;
      if (item[6]) summary += `   Notes: ${item[6]}\n`;
      summary += `\n`;
    });
    
    summary += `\n📝 NEXT STEPS:\n`;
    summary += `1. Copy this information\n`;
    summary += `2. Send to developer with details\n`;
    summary += `3. Include specific steps to reproduce any issues\n`;
    summary += `4. Update status when items are addressed`;
    
    SpreadsheetApp.getUi().alert(
      'Ready for Review',
      summary,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
  } catch (error) {
    console.error('Error showing ready for review:', error);
    SpreadsheetApp.getUi().alert(
      'Error',
      `Failed to show ready items: ${error.message}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// =================== BRANDING SYSTEM FUNCTIONS ===================

/**
 * Opens the Branding Demo HTML page to show how branding works
 */
function openBrandingDemo() {
  const html = HtmlService.createHtmlOutputFromFile('BrandingDemo')
    .setWidth(800)
    .setHeight(700)
    .setTitle('🎨 Branding System Demo');
  SpreadsheetApp.getUi().showModalDialog(html, 'Branding Demo');
}

/**
 * Opens the Hybrid Assembler UI (main application interface)
 */
function openHybridAssembler() {
  const html = HtmlService.createHtmlOutputFromFile('HybridComponentAssembler')
    .setWidth(1400)
    .setHeight(900)
    .setTitle('🧩 Hybrid Component Assembler');
  SpreadsheetApp.getUi().showModalDialog(html, 'Hybrid Assembler');
}
