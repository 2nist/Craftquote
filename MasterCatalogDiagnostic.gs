/**
 * MASTER CATALOG INTEGRATION DIAGNOSTIC
 * Helps diagnose and fix Master Catalog integration issues
 * Created: August 13, 2025
 */

function diagnoseSystemIntegration() {
  console.log('🔍 SYSTEM DIAGNOSTIC - Starting comprehensive check...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let report = '🔍 MASTER CATALOG INTEGRATION DIAGNOSTIC\n\n';
    
    // Step 1: Check spreadsheet structure
    report += '=== SPREADSHEET STRUCTURE ===\n';
    const sheets = ss.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    report += `Total Sheets: ${sheets.length}\n`;
    report += `Sheet Names: ${sheetNames.join(', ')}\n\n`;
    
    // Check for required sheets
    const requiredSheets = ['Master Catalog', 'HW_Parts', 'HW_Assemblies', 'HW_Panels'];
    const missingSheets = requiredSheets.filter(name => !sheetNames.includes(name));
    const existingSheets = requiredSheets.filter(name => sheetNames.includes(name));
    
    report += `✅ Existing Required Sheets: ${existingSheets.join(', ')}\n`;
    if (missingSheets.length > 0) {
      report += `❌ Missing Required Sheets: ${missingSheets.join(', ')}\n`;
    }
    report += '\n';
    
    // Step 2: Check Master Catalog sheet
    report += '=== MASTER CATALOG ANALYSIS ===\n';
    const masterCatalogSheet = ss.getSheetByName('Master Catalog');
    if (masterCatalogSheet) {
      const lastRow = masterCatalogSheet.getLastRow();
      const lastCol = masterCatalogSheet.getLastColumn();
      const headers = masterCatalogSheet.getRange(1, 1, 1, lastCol).getValues()[0];
      
      report += `✅ Master Catalog Sheet Found\n`;
      report += `Data Rows: ${lastRow - 1} (excluding header)\n`;
      report += `Columns: ${lastCol}\n`;
      report += `Headers: ${headers.join(', ')}\n\n`;
      
      // Check for key columns
      const keyColumns = ['PART', 'DESCRIPTION', 'COST', 'VNDR'];
      const foundColumns = keyColumns.filter(col => headers.includes(col));
      const missingColumns = keyColumns.filter(col => !headers.includes(col));
      
      report += `✅ Found Key Columns: ${foundColumns.join(', ')}\n`;
      if (missingColumns.length > 0) {
        report += `❌ Missing Key Columns: ${missingColumns.join(', ')}\n`;
      }
      
      // Sample data check
      if (lastRow > 1) {
        const sampleData = masterCatalogSheet.getRange(2, 1, Math.min(5, lastRow - 1), lastCol).getValues();
        report += `\nSample Data (First ${sampleData.length} rows):\n`;
        sampleData.forEach((row, index) => {
          report += `Row ${index + 2}: ${row.slice(0, 4).join(' | ')}\n`;
        });
      }
      
    } else {
      report += `❌ Master Catalog Sheet NOT FOUND\n`;
      report += `Available sheets: ${sheetNames.join(', ')}\n`;
    }
    report += '\n';
    
    // Step 3: Check if catalog data is accessible programmatically
    report += '=== PROGRAMMATIC DATA ACCESS ===\n';
    try {
      if (typeof MASTER_CATALOG_DATA !== 'undefined') {
        report += `✅ MASTER_CATALOG_DATA variable found\n`;
        report += `Data entries: ${MASTER_CATALOG_DATA.length}\n`;
        if (MASTER_CATALOG_DATA.length > 0) {
          const sampleEntry = MASTER_CATALOG_DATA[0];
          report += `Sample entry: ${sampleEntry.partNumber} - ${sampleEntry.description}\n`;
        }
      } else {
        report += `❌ MASTER_CATALOG_DATA variable NOT FOUND\n`;
      }
    } catch (dataError) {
      report += `❌ Error accessing MASTER_CATALOG_DATA: ${dataError.message}\n`;
    }
    report += '\n';
    
    // Step 4: Check hierarchical sheets status
    report += '=== HIERARCHICAL SYSTEM STATUS ===\n';
    const hwSheets = ['HW_Parts', 'HW_Assemblies', 'HW_Panels', 'HW_Quotes'];
    hwSheets.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        const rows = sheet.getLastRow();
        const cols = sheet.getLastColumn();
        report += `✅ ${sheetName}: ${rows} rows, ${cols} columns\n`;
      } else {
        report += `❌ ${sheetName}: Missing\n`;
      }
    });
    report += '\n';
    
    // Step 5: Test function availability
    report += '=== FUNCTION AVAILABILITY ===\n';
    const testFunctions = [
      'importMasterCatalog',
      'initializeHierarchicalDatabase', 
      'createBasicHierarchicalSheets',
      'populatePartsFromMasterCatalog'
    ];
    
    testFunctions.forEach(funcName => {
      try {
        const func = eval(funcName);
        if (typeof func === 'function') {
          report += `✅ ${funcName}: Available\n`;
        } else {
          report += `❌ ${funcName}: Not a function\n`;
        }
      } catch (error) {
        report += `❌ ${funcName}: ${error.message}\n`;
      }
    });
    
    report += '\n=== RECOMMENDATIONS ===\n';
    
    if (missingSheets.length > 0) {
      report += `1. Create missing sheets: ${missingSheets.join(', ')}\n`;
    }
    
    if (!masterCatalogSheet) {
      report += `2. Import or create Master Catalog sheet with your parts data\n`;
    }
    
    if (missingColumns.length > 0) {
      report += `3. Add missing columns to Master Catalog: ${missingColumns.join(', ')}\n`;
    }
    
    report += `4. Run integration test to verify data flow\n`;
    report += `5. Initialize hierarchical database if not done\n`;
    
    console.log(report);
    
    // Show report to user
    try {
      SpreadsheetApp.getUi().alert('Diagnostic Complete', report, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (uiError) {
      console.log('Report generated - check console for full details');
    }
    
    return {
      success: true,
      report: report,
      issues: {
        missingSheets: missingSheets,
        missingColumns: missingColumns,
        hasMasterCatalog: !!masterCatalogSheet
      }
    };
    
  } catch (error) {
    console.error('🔍 DIAGNOSTIC ERROR:', error);
    const errorReport = `❌ DIAGNOSTIC FAILED: ${error.message}`;
    
    try {
      SpreadsheetApp.getUi().alert('Diagnostic Error', errorReport, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (uiError) {
      console.error('Could not show diagnostic error');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Quick fix for common Master Catalog integration issues
 */
function quickFixMasterCatalogIntegration() {
  console.log('🔧 QUICK FIX - Starting Master Catalog integration repair...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let fixReport = '🔧 MASTER CATALOG QUICK FIX\n\n';
    
    // Step 1: Create missing hierarchical sheets
    fixReport += 'Step 1: Creating missing hierarchical sheets...\n';
    try {
      const result = createBasicHierarchicalSheets(ss);
      fixReport += `✅ Hierarchical sheets created/verified\n`;
    } catch (error) {
      fixReport += `❌ Error creating sheets: ${error.message}\n`;
    }
    
    // Step 2: Check Master Catalog and try to populate HW_Parts
    fixReport += '\nStep 2: Populating HW_Parts from Master Catalog...\n';
    try {
      const masterSheet = ss.getSheetByName('Master Catalog');
      if (masterSheet) {
        const result = populatePartsFromMasterCatalog(ss);
        fixReport += `✅ Parts populated from Master Catalog\n`;
      } else {
        fixReport += `❌ Master Catalog sheet not found\n`;
        fixReport += `Available sheets: ${ss.getSheets().map(s => s.getName()).join(', ')}\n`;
      }
    } catch (error) {
      fixReport += `❌ Error populating parts: ${error.message}\n`;
    }
    
    // Step 3: Try to initialize complete system
    fixReport += '\nStep 3: Initializing complete hierarchical system...\n';
    try {
      const result = initializeHierarchicalDatabase();
      fixReport += `✅ Hierarchical database initialized\n`;
    } catch (error) {
      fixReport += `❌ Error initializing database: ${error.message}\n`;
    }
    
    // Step 4: Validation
    fixReport += '\nStep 4: System validation...\n';
    const hwParts = ss.getSheetByName('HW_Parts');
    if (hwParts && hwParts.getLastRow() > 1) {
      fixReport += `✅ HW_Parts has ${hwParts.getLastRow() - 1} parts\n`;
    } else {
      fixReport += `❌ HW_Parts is empty or missing\n`;
    }
    
    fixReport += '\n✅ QUICK FIX COMPLETE!\n';
    fixReport += 'Check your spreadsheet for new HW_* sheets with your Master Catalog data.\n';
    
    console.log(fixReport);
    
    try {
      SpreadsheetApp.getUi().alert('Quick Fix Complete', fixReport, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (uiError) {
      console.log('Quick fix completed - check console and spreadsheet');
    }
    
    return {
      success: true,
      report: fixReport
    };
    
  } catch (error) {
    console.error('🔧 QUICK FIX ERROR:', error);
    const errorReport = `❌ QUICK FIX FAILED: ${error.message}`;
    
    try {
      SpreadsheetApp.getUi().alert('Quick Fix Error', errorReport, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (uiError) {
      console.error('Could not show quick fix error');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test Master Catalog data access and processing
 */
function testMasterCatalogAccess() {
  console.log('🧪 TESTING - Master Catalog data access...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let testReport = '🧪 MASTER CATALOG ACCESS TEST\n\n';
    
    // Test 1: Direct sheet access
    testReport += 'Test 1: Direct sheet access...\n';
    const masterSheet = ss.getSheetByName('Master Catalog');
    if (masterSheet) {
      const data = masterSheet.getRange(1, 1, Math.min(10, masterSheet.getLastRow()), masterSheet.getLastColumn()).getValues();
      testReport += `✅ Read ${data.length} rows from Master Catalog\n`;
      testReport += `Headers: ${data[0].join(', ')}\n`;
      
      if (data.length > 1) {
        testReport += `Sample row: ${data[1].slice(0, 4).join(' | ')}\n`;
      }
    } else {
      testReport += `❌ Master Catalog sheet not accessible\n`;
    }
    
    // Test 2: Programmatic data access
    testReport += '\nTest 2: Programmatic data access...\n';
    try {
      if (typeof MASTER_CATALOG_DATA !== 'undefined') {
        testReport += `✅ MASTER_CATALOG_DATA accessible: ${MASTER_CATALOG_DATA.length} items\n`;
        if (MASTER_CATALOG_DATA.length > 0) {
          const sample = MASTER_CATALOG_DATA[0];
          testReport += `Sample: ${sample.partNumber} - ${sample.description} - $${sample.unitCost}\n`;
        }
      } else {
        testReport += `❌ MASTER_CATALOG_DATA not available\n`;
      }
    } catch (dataError) {
      testReport += `❌ Error accessing programmatic data: ${dataError.message}\n`;
    }
    
    // Test 3: Component search
    testReport += '\nTest 3: Component search test...\n';
    try {
      const testParts = ['A8066CHFL', 'A10106CHFL'];
      testParts.forEach(partNum => {
        try {
          const result = getComponentDetails(partNum);
          if (result && !result.isPlaceholder) {
            testReport += `✅ ${partNum}: Found - $${result.price}\n`;
          } else {
            testReport += `❌ ${partNum}: Not found or placeholder\n`;
          }
        } catch (searchError) {
          testReport += `❌ ${partNum}: Search error - ${searchError.message}\n`;
        }
      });
    } catch (testError) {
      testReport += `❌ Component search test failed: ${testError.message}\n`;
    }
    
    testReport += '\n✅ ACCESS TEST COMPLETE!\n';
    
    console.log(testReport);
    
    try {
      SpreadsheetApp.getUi().alert('Access Test Complete', testReport, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (uiError) {
      console.log('Access test completed - check console for details');
    }
    
    return {
      success: true,
      report: testReport
    };
    
  } catch (error) {
    console.error('🧪 ACCESS TEST ERROR:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
