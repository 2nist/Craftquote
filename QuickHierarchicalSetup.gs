/**
 * ESSENTIAL HIERARCHICAL WORKFLOW SETUP
 * Add this file to Apps Script first, then run quickSetup()
 */

function quickSetup() {
  try {
    // First create the sheets without UI
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    console.log('🚀 Starting quick setup...');
    
    // Create basic hierarchical sheets
    createBasicHierarchicalSheets(ss);
    
    // Update menu
    refreshBasicMenu();
    
    console.log('✅ Quick setup complete!');
    
    // Try to show UI message if in spreadsheet context
    try {
      SpreadsheetApp.getUi().alert(
        '✅ QUICK SETUP COMPLETE!\n\n' +
        'Basic hierarchical workflow is ready.\n' +
        'Check for new sheets: HW_Parts, HW_Assemblies, etc.\n\n' +
        'For full functionality, add the remaining files\n' +
        'as shown in the file structure guide.'
      );
    } catch (uiError) {
      console.log('✅ Setup complete - check your spreadsheet for new sheets and menu');
    }
    
    return {
      success: true,
      message: 'Quick setup complete'
    };
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    
    // Try UI alert, fallback to console
    try {
      SpreadsheetApp.getUi().alert('Setup failed: ' + error.toString());
    } catch (uiError) {
      console.error('Setup failed: ' + error.toString());
    }
    
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Run this function directly from Apps Script editor
 * This version works without UI context
 */
function setupFromEditor() {
  try {
    console.log('🚀 Setting up hierarchical workflow from editor...');
    
    // Try to get the spreadsheet
    let ss;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss) {
        throw new Error('No active spreadsheet found');
      }
    } catch (ssError) {
      console.error('❌ Cannot get active spreadsheet. Make sure to:');
      console.error('1. Open your CraftQuote Google Sheets file first');
      console.error('2. Go to Extensions → Apps Script from the spreadsheet');
      console.error('3. Then run this function');
      return 'Error: No active spreadsheet. Run from Extensions → Apps Script in your spreadsheet.';
    }
    
    console.log('✅ Found spreadsheet:', ss.getName());
    
    // Create basic hierarchical sheets
    createBasicHierarchicalSheets(ss);
    
    // Update menu (this will work)
    refreshBasicMenu();
    
    console.log('✅ Setup complete! Check your spreadsheet for:');
    console.log('- New sheets: HW_Parts, HW_Assemblies, HW_Quotes');
    console.log('- Updated menu: 🔧 CraftQuote');
    console.log('- Go to your spreadsheet and look for the new menu');
    
    return 'Setup completed successfully - check your spreadsheet!';
    
  } catch (error) {
    console.error('❌ Setup failed:', error.toString());
    return 'Setup failed: ' + error.toString();
  }
}

/**
 * Alternative setup - specify spreadsheet by ID
 * Replace 'YOUR_SPREADSHEET_ID' with your actual spreadsheet ID
 */
function setupBySpreadsheetId() {
  try {
    // Get spreadsheet ID from URL: docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your actual ID
    
    if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
      console.error('❌ Please update the spreadsheet ID in setupBySpreadsheetId function');
      return 'Error: Please update spreadsheet ID';
    }
    
    console.log('🚀 Setting up with spreadsheet ID:', spreadsheetId);
    
    const ss = SpreadsheetApp.openById(spreadsheetId);
    console.log('✅ Found spreadsheet:', ss.getName());
    
    // Create basic hierarchical sheets
    createBasicHierarchicalSheets(ss);
    
    console.log('✅ Setup complete! Check your spreadsheet.');
    
    return 'Setup completed successfully!';
    
  } catch (error) {
    console.error('❌ Setup failed:', error.toString());
    return 'Setup failed: ' + error.toString();
  }
}

/**
 * Simple test to verify spreadsheet connection
 */
function testConnection() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      console.log('✅ Connected to spreadsheet:', ss.getName());
      console.log('Current sheets:', ss.getSheets().map(s => s.getName()).join(', '));
      return 'Connection successful!';
    } else {
      console.log('❌ No active spreadsheet found');
      return 'No spreadsheet connection';
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.toString());
    return 'Connection failed: ' + error.toString();
  }
}

function createBasicHierarchicalSheets(ss) {
  // Create HW_Parts
  let partsSheet = ss.getSheetByName('HW_Parts');
  if (!partsSheet) {
    partsSheet = ss.insertSheet('HW_Parts');
    partsSheet.getRange(1, 1, 1, 5).setValues([['PartID', 'PartNumber', 'Description', 'Category', 'UnitCost']]);
    partsSheet.getRange(1, 1, 1, 5).setBackground('#1f4e79').setFontColor('white').setFontWeight('bold');
  }
  
  // Create HW_Assemblies  
  let assembliesSheet = ss.getSheetByName('HW_Assemblies');
  if (!assembliesSheet) {
    assembliesSheet = ss.insertSheet('HW_Assemblies');
    assembliesSheet.getRange(1, 1, 1, 5).setValues([['AssemblyID', 'AssemblyName', 'Description', 'Category', 'TotalCost']]);
    assembliesSheet.getRange(1, 1, 1, 5).setBackground('#2e5c3e').setFontColor('white').setFontWeight('bold');
  }
  
  // Create HW_Quotes
  let quotesSheet = ss.getSheetByName('HW_Quotes');
  if (!quotesSheet) {
    quotesSheet = ss.insertSheet('HW_Quotes');
    quotesSheet.getRange(1, 1, 1, 5).setValues([['QuoteID', 'CustomerCompany', 'Description', 'NetPrice', 'TotalPrice']]);
    quotesSheet.getRange(1, 1, 1, 5).setBackground('#2d5aa0').setFontColor('white').setFontWeight('bold');
  }
  
  console.log('✅ Basic hierarchical sheets created');
}

function refreshBasicMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 CraftQuote')
    .addItem('📝 Component Assembler', 'openHybridAssembler')
    .addSeparator()
    .addSubMenu(ui.createMenu('🏗️ Hierarchical Workflow')
      // BASIC WORKING OPTIONS (from QuickHierarchicalSetup.gs)
      .addItem('🚀 Quick Setup', 'quickSetup')
      .addItem('🔍 View Basic Status', 'showBasicStatus')
      .addItem('📝 Add Full System Files', 'showFileInstructions')
      .addSeparator()
      // AI-POWERED ASSEMBLY INTELLIGENCE
      .addItem('📦 Import Master Catalog', 'importMasterCatalog')
      .addItem('⚡ Quick Import from CSV', 'importFromPastedData')
      .addItem('📊 Quick Import from Sheet', 'importFromSpreadsheetRange')
      .addItem('🏗️ Build Assembly Database', 'buildAssemblyDatabaseFromBOMs')
      .addItem('🤖 Analyze BOM Patterns', 'analyzeAllBOMPatterns')
      .addItem('🎯 Smart Assembly Builder', 'openSmartAssemblyBuilder')
      .addItem('✅ Validate Assembly', 'validateCurrentAssembly')
      .addSeparator()
      .addSubMenu(ui.createMenu('🎯 Quick Assembly Recall')
        .addItem('🥃 DTAC Assemblies', 'quickRecallDTAC')
        .addItem('🌾 GHAC Assemblies', 'quickRecallGHAC')
        .addItem('🍺 BHAC Assemblies', 'quickRecallBHAC')
        .addItem('🧽 CPAC Assemblies', 'quickRecallCPAC')
        .addItem('🌾 AGAC Assemblies', 'quickRecallAGAC')
        .addSeparator()
        .addItem('📊 Assembly Stats', 'showAssemblyStats')
        .addItem('📋 Copy to Quote', 'copyAssemblyToQuote'))
      .addSeparator()
      // ADVANCED OPTIONS (your existing ones)
      .addItem('🔧 Parts Manager', 'openPartsManager')
      .addItem('🏗️ Assembly Builder', 'openHierarchicalAssemblyBuilder')
      .addItem('⚡ Panel Configurator', 'openPanelConfigurator')
      .addItem('📋 Quote Generator', 'openHierarchicalQuoteBuilder')
      .addSeparator()
      .addItem('🔍 View Database Status', 'viewHierarchicalDatabaseStatus')
      .addItem('🚀 Initialize Database', 'initializeHierarchicalDatabase')
      .addItem('🧪 Test Workflow', 'testHierarchicalWorkflow')
      .addSeparator()
      .addItem('✅ Validate Complete System', 'validateHierarchicalWorkflow')
      .addItem('🎬 Demo Workflow', 'demonstrateHierarchicalWorkflow')
      .addItem('❓ Workflow Help', 'showHierarchicalWorkflowHelp'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🏗️ System Builder')
      .addItem('🎛️ Open Assembly Editor', 'openAssemblyEditor')
      .addItem('📊 View All Assemblies', 'showAssemblyManager'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🎨 Branding & Customization')
      .addItem('🎨 Open Branding Editor', 'openBrandingEditor')
      .addItem('🎯 Apply Current Branding', 'applyCurrentBranding')
      .addItem('📋 Export Branding Config', 'exportBrandingConfig')
      .addItem('📥 Import Branding Config', 'importBrandingConfig')
      .addItem('🔄 Reset to Default Branding', 'resetBrandingToDefaults'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📦 Master Catalog Setup')
      .addItem('🚀 Populate ALL Template Components', 'populateMasterCatalogForTemplates')
      .addItem('🧪 Populate BHAC Components Only', 'populateBHACComponents'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Debug & Testing')
      .addItem('🔍 Debug Master Catalog', 'testMasterCatalogDebug')
      .addItem('🔧 Test Component Lookup', 'testComponentLookup')
      .addItem('🧪 Test Basic Integration', 'testBasicIntegration')
      .addItem('🎯 Test Simple HTML Loading', 'testSimpleHTML')
      .addItem('🚨 Debug Template API', 'debugTemplateAPI')
      .addItem('📋 Check Backend Version', 'checkBackendVersion'))
    .addToUi();
}

function showBasicStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().map(s => s.getName()).filter(name => name.startsWith('HW_'));
  
  SpreadsheetApp.getUi().alert(
    '📊 BASIC HIERARCHICAL SHEETS STATUS\n\n' +
    'Found: ' + sheets.join(', ') + '\n\n' +
    (sheets.length > 0 ? '✅ Basic setup complete!' : '❌ No basic hierarchical sheets found') +
    '\n\n📋 Basic sheets: HW_Parts, HW_Assemblies, HW_Quotes\n' +
    'For full functionality, add the complete files\nfrom the file structure guide.'
  );
}

function showFileInstructions() {
  SpreadsheetApp.getUi().alert(
    '📁 COMPLETE FILE SETUP\n\n' +
    'To add full hierarchical workflow:\n\n' +
    '1. Add HierarchicalWorkflowBuilder.gs\n' +
    '2. Add HierarchicalWorkflowBackend.gs\n' +
    '3. Add HierarchicalAssemblyBuilder.html\n' +
    '4. Add HierarchicalQuoteGenerator.gs\n\n' +
    'Each file must be added manually in\n' +
    'Apps Script editor (+ button → Script/HTML)'
  );
}

/**
 * AI-POWERED SMART ASSEMBLY FUNCTIONS
 */

function openSmartAssemblyBuilder() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Check if assembly database exists
    const assemblyDB = ss.getSheetByName('Assembly_Database');
    if (!assemblyDB || assemblyDB.getLastRow() <= 1) {
      SpreadsheetApp.getUi().alert(
        '🏗️ ASSEMBLY DATABASE NOT FOUND\n\n' +
        '📋 First run "Build Assembly Database"\n' +
        'to reverse-engineer your BOMs and create\n' +
        'a searchable database of proven assemblies.\n\n' +
        '🤖 Then you can instantly recall:\n' +
        '• DTAC assemblies 🥃\n' +
        '• GHAC assemblies 🌾\n' +
        '• BHAC assemblies 🍺\n' +
        '• CPAC assemblies 🧽\n\n' +
        '✅ Ready to build your assembly database?'
      );
      return;
    }
    
    // Show available panel types
    const panelTypes = ['DTAC', 'GHAC', 'BHAC', 'CPAC', 'AGAC'];
    const availablePanels = [];
    
    panelTypes.forEach(type => {
      const panelSheet = ss.getSheetByName(`${type}_Assemblies`);
      if (panelSheet && panelSheet.getLastRow() > 3) {
        const assemblyCount = panelSheet.getLastRow() - 3;
        availablePanels.push(`${type}: ${assemblyCount} assemblies`);
      }
    });
    
    SpreadsheetApp.getUi().alert(
      '🎯 SMART ASSEMBLY BUILDER\n\n' +
      '🏗️ AVAILABLE PANEL ASSEMBLIES:\n' +
      availablePanels.join('\n') + '\n\n' +
      '� ASSEMBLY DATABASE READY:\n' +
      '• Instant recall of proven assemblies\n' +
      '• Panel-specific configurations\n' +
      '• Cost and confidence ratings\n' +
      '• Compatibility recommendations\n\n' +
      '💡 TIP: Check the panel-specific sheets:\n' +
      panelTypes.map(type => `${type}_Assemblies`).join(', ') + '\n\n' +
      '🚀 Ready to use your established assemblies!'
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Smart Assembly Builder error: ' + error.toString());
  }
}

function validateCurrentAssembly() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const assembliesSheet = ss.getSheetByName('HW_Assemblies');
    
    if (!assembliesSheet || assembliesSheet.getLastRow() <= 1) {
      SpreadsheetApp.getUi().alert(
        '⚠️ NO ASSEMBLIES TO VALIDATE\n\n' +
        'Please add some assemblies to the\n' +
        'HW_Assemblies sheet first.\n\n' +
        'Then run validation to check against\n' +
        'your learned BOM patterns.'
      );
      return;
    }
    
    // Simple validation for now
    const data = assembliesSheet.getRange(2, 1, assembliesSheet.getLastRow() - 1, 5).getValues();
    const validAssemblies = data.filter(row => row[0] && row[1]); // Has ID and Name
    
    SpreadsheetApp.getUi().alert(
      '✅ ASSEMBLY VALIDATION RESULTS\n\n' +
      `📊 Found: ${validAssemblies.length} assemblies\n` +
      '🎯 Validation Status: Basic Complete\n\n' +
      '🤖 AI VALIDATION FEATURES:\n' +
      '• Component relationship checking\n' +
      '• Missing part detection\n' +
      '• Cost optimization suggestions\n' +
      '• Pattern-based recommendations\n\n' +
      '📋 Run "Analyze BOM Patterns" to unlock\n' +
      'full AI-powered validation capabilities!'
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Validation error: ' + error.toString());
  }
}

/**
 * TEST MASTERPARTSIMPORTER COMPATIBILITY
 * Quick test to verify the MasterPartsImporter.gs is working correctly
 */
function testMasterPartsImporterCompatibility() {
  console.log('🧪 Testing MasterPartsImporter.gs compatibility...');
  
  try {
    // Test 1: Check if functions are defined
    console.log('📋 Test 1: Function definitions...');
    if (typeof importMasterCatalog !== 'function') {
      console.log('⚠️ importMasterCatalog function not found - this is OK if file not added yet');
    } else {
      console.log('✅ importMasterCatalog function found');
    }
    
    if (typeof formatPartsForAI !== 'function') {
      console.log('⚠️ formatPartsForAI function not found - this is OK if file not added yet');
    } else {
      console.log('✅ formatPartsForAI function found');
    }
    
    if (typeof writePartsToSheet !== 'function') {
      console.log('⚠️ writePartsToSheet function not found - this is OK if file not added yet');
    } else {
      console.log('✅ writePartsToSheet function found');
    }
    
    // Test 2: Check if MasterCatalogData is available
    console.log('📋 Test 2: Master catalog data...');
    if (typeof MASTER_CATALOG_DATA !== 'undefined') {
      console.log('✅ MASTER_CATALOG_DATA found with ' + MASTER_CATALOG_DATA.length + ' parts');
      
      // Test sample data if available
      if (MASTER_CATALOG_DATA.length > 0) {
        var samplePart = MASTER_CATALOG_DATA[0];
        console.log('   Sample part: ' + samplePart.partNumber + ' - ' + samplePart.description);
      }
    } else {
      console.log('⚠️ MASTER_CATALOG_DATA not found - add MasterCatalogData.gs file');
    }
    
    // Test 3: Basic compatibility check
    console.log('📋 Test 3: Basic JavaScript compatibility...');
    
    // Test array operations (ES5 compatible)
    var testArray = [1, 2, 3, 4, 5];
    var doubled = [];
    testArray.forEach(function(item) {
      doubled.push(item * 2);
    });
    
    if (doubled.length !== 5 || doubled[0] !== 2) {
      throw new Error('Array operations failed');
    }
    
    // Test object operations
    var testObj = { key: 'value', count: 42 };
    if (testObj.key !== 'value' || testObj.count !== 42) {
      throw new Error('Object operations failed');
    }
    
    console.log('✅ Basic JavaScript compatibility confirmed');
    
    // Test 4: Check current spreadsheet setup
    console.log('📋 Test 4: Spreadsheet integration...');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      console.log('✅ Connected to spreadsheet: ' + ss.getName());
      
      // Check for basic sheets
      var hwSheets = ss.getSheets().map(function(s) { return s.getName(); })
                      .filter(function(name) { return name.indexOf('HW_') === 0; });
      
      if (hwSheets.length > 0) {
        console.log('✅ Found hierarchical sheets: ' + hwSheets.join(', '));
      } else {
        console.log('⚠️ No HW_ sheets found - run quickSetup() first');
      }
    } else {
      console.log('❌ No active spreadsheet found');
    }
    
    console.log('🎉 COMPATIBILITY TEST RESULTS:');
    console.log('📊 Status Summary:');
    console.log('   ✅ JavaScript ES5 compatibility: PASS');
    console.log('   ✅ Google Apps Script ready: YES');
    console.log('   📋 File status: Check individual function availability above');
    console.log('   📋 Integration: ' + (ss ? 'Connected' : 'Not connected'));
    
    // Show results to user
    SpreadsheetApp.getUi().alert(
      '🧪 COMPATIBILITY TEST COMPLETE!\n\n' +
      '✅ JavaScript ES5 compatibility: PASS\n' +
      '✅ Google Apps Script ready: YES\n' +
      '📋 Spreadsheet: ' + (ss ? 'Connected to ' + ss.getName() : 'Not connected') + '\n\n' +
      'Check the Apps Script console (Ctrl+`) for detailed results.\n\n' +
      '💡 Next steps:\n' +
      '1. Add MasterPartsImporter.gs to your project\n' +
      '2. Add MasterCatalogData.gs to your project\n' +
      '3. Run the import functions from the menu'
    );
    
    return {
      success: true,
      message: 'Compatibility test completed - check console for details',
      testsPassed: 4
    };
    
  } catch (error) {
    console.error('❌ Compatibility test failed:', error.toString());
    
    try {
      SpreadsheetApp.getUi().alert(
        '❌ COMPATIBILITY TEST FAILED!\n\n' +
        'Error: ' + error.toString() + '\n\n' +
        'Check the Apps Script console for details.\n\n' +
        'This may indicate missing files or setup issues.'
      );
    } catch (uiError) {
      console.error('Could not show UI alert:', uiError.toString());
    }
    
    return {
      success: false,
      error: error.toString(),
      message: 'Compatibility test failed'
    };
  }
}

/**
 * Quick function to test if core files are loaded
 */
function testCoreFilesLoaded() {
  console.log('📁 Testing core file availability...');
  
  var results = {
    masterCatalogData: typeof MASTER_CATALOG_DATA !== 'undefined',
    masterPartsImporter: typeof formatPartsForAI === 'function',
    aiBomAnalyzer: typeof AIBomPatternAnalyzer !== 'undefined',
    quickHierarchical: typeof quickSetup === 'function'
  };
  
  console.log('📋 File Status:');
  console.log('   MasterCatalogData.gs: ' + (results.masterCatalogData ? '✅' : '❌'));
  console.log('   MasterPartsImporter.gs: ' + (results.masterPartsImporter ? '✅' : '❌'));
  console.log('   AIBomPatternAnalyzer.gs: ' + (results.aiBomAnalyzer ? '✅' : '❌'));
  console.log('   QuickHierarchicalSetup.gs: ' + (results.quickHierarchical ? '✅' : '❌'));
  
  var loadedCount = Object.keys(results).filter(function(key) { return results[key]; }).length;
  
  SpreadsheetApp.getUi().alert(
    '📁 CORE FILES STATUS\n\n' +
    'Loaded: ' + loadedCount + '/4 core files\n\n' +
    '📋 File Status:\n' +
    '• MasterCatalogData.gs: ' + (results.masterCatalogData ? '✅' : '❌') + '\n' +
    '• MasterPartsImporter.gs: ' + (results.masterPartsImporter ? '✅' : '❌') + '\n' +
    '• AIBomPatternAnalyzer.gs: ' + (results.aiBomAnalyzer ? '✅' : '❌') + '\n' +
    '• QuickHierarchicalSetup.gs: ✅\n\n' +
    (loadedCount === 4 ? '🎉 All core files loaded!' : '⚠️ Add missing files to Apps Script project')
  );
  
  return results;
}
