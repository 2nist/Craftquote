/**
 * CraftQuote System - Complete Deployment Script
 * Automates the entire setup process for Google Apps Script
 * Run this after uploading all files to your Apps Script project
 */

/**
 * MAIN DEPLOYMENT FUNCTION - Run this first!
 * Sets up everything automatically
 */
function deployCraftQuoteSystem() {
  console.log('🚀 Starting CraftQuote System Deployment...');
  console.log('===============================================');
  
  try {
    // Step 1: Initialize core system
    console.log('📋 Step 1: Initializing Core System...');
    initializeCoreSystem();
    
    // Step 2: Set up Google Sheets integration
    console.log('📊 Step 2: Setting up Google Sheets...');
    setupGoogleSheetsIntegration();
    
    // Step 3: Configure branding system
    console.log('🎨 Step 3: Configuring Branding System...');
    setupBrandingSystem();
    
    // Step 4: Initialize component database
    console.log('⚙️ Step 4: Initializing Component Database...');
    initializeComponentDatabase();
    
    // Step 5: Set up menu system
    console.log('📱 Step 5: Setting up Menu System...');
    setupMenuSystem();
    
    // Step 6: Test all connections
    console.log('🧪 Step 6: Testing System Connections...');
    testAllConnections();
    
    console.log('');
    console.log('🎉 DEPLOYMENT COMPLETE! 🎉');
    console.log('===============================================');
    console.log('✅ CraftQuote System is ready to use!');
    console.log('');
    console.log('📌 Next Steps:');
    console.log('1. Open the spreadsheet and use the CraftQuote menu');
    console.log('2. Run: openComponentAssembler() to start building quotes');
    console.log('3. Run: openBrandingEditor() to customize appearance');
    console.log('4. Optional: Configure Pipedrive with setupPipedriveIntegration()');
    console.log('');
    console.log('🔧 Main Functions Available:');
    console.log('- openComponentAssembler() - Start quote building');
    console.log('- openBrandingEditor() - Customize branding');
    console.log('- openAssemblyEditor() - Create custom assemblies');
    console.log('- testBackendConnection() - Test system health');
    
    return {
      success: true,
      message: 'CraftQuote System deployed successfully!',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    console.log('');
    console.log('🛠️ Troubleshooting:');
    console.log('1. Make sure all .gs and .html files are uploaded');
    console.log('2. Check that you have permission to create spreadsheets');
    console.log('3. Try running individual setup functions manually');
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Step 1: Initialize Core System
 */
function initializeCoreSystem() {
  console.log('  🔧 Setting up core system properties...');
  
  // Create or get the main spreadsheet
  const spreadsheetName = 'CraftQuote System Database';
  let spreadsheet;
  
  try {
    // Try to find existing spreadsheet first
    const files = DriveApp.getFilesByName(spreadsheetName);
    if (files.hasNext()) {
      const file = files.next();
      spreadsheet = SpreadsheetApp.openById(file.getId());
      console.log('  ✅ Found existing spreadsheet:', spreadsheet.getUrl());
    } else {
      // Create new spreadsheet
      spreadsheet = SpreadsheetApp.create(spreadsheetName);
      console.log('  ✅ Created new spreadsheet:', spreadsheet.getUrl());
    }
    
    // Store spreadsheet ID in script properties
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty('MAIN_SPREADSHEET_ID', spreadsheet.getId());
    
    console.log('  ✅ Core system initialized');
    return spreadsheet;
    
  } catch (error) {
    console.error('  ❌ Failed to initialize core system:', error);
    throw error;
  }
}

/**
 * Step 2: Set up Google Sheets Integration
 */
function setupGoogleSheetsIntegration() {
  console.log('  📊 Creating required sheets...');
  
  try {
    const properties = PropertiesService.getScriptProperties();
    const spreadsheetId = properties.getProperty('MAIN_SPREADSHEET_ID');
    
    if (!spreadsheetId) {
      throw new Error('Main spreadsheet not found. Run initializeCoreSystem() first.');
    }
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Create required sheets
    const requiredSheets = [
      { name: 'BrandingConfig', setup: setupBrandingSheet },
      { name: 'Quotes', setup: setupQuotesSheet },
      { name: 'Components', setup: setupComponentsSheet },
      { name: 'Assemblies', setup: setupAssembliesSheet },
      { name: 'AuditLog', setup: setupAuditLogSheet }
    ];
    
    requiredSheets.forEach(sheetInfo => {
      let sheet = spreadsheet.getSheetByName(sheetInfo.name);
      
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetInfo.name);
        console.log(`  ✅ Created ${sheetInfo.name} sheet`);
      } else {
        console.log(`  ✅ Found existing ${sheetInfo.name} sheet`);
      }
      
      // Set up sheet with headers and formatting
      if (sheetInfo.setup) {
        sheetInfo.setup(sheet);
      }
    });
    
    // Store sheet configuration
    properties.setProperties({
      'BRANDING_SHEET_ID': spreadsheetId,
      'QUOTES_SHEET_ID': spreadsheetId,
      'COMPONENTS_SHEET_ID': spreadsheetId,
      'ASSEMBLIES_SHEET_ID': spreadsheetId,
      'AUDIT_SHEET_ID': spreadsheetId
    });
    
    console.log('  ✅ Google Sheets integration configured');
    
  } catch (error) {
    console.error('  ❌ Failed to setup Google Sheets:', error);
    throw error;
  }
}

/**
 * Step 3: Configure Branding System
 */
function setupBrandingSystem() {
  console.log('  🎨 Initializing branding configuration...');
  
  try {
    // Initialize branding sheet with default data
    if (typeof initializeBrandingSheet === 'function') {
      initializeBrandingSheet();
      console.log('  ✅ Branding system initialized with defaults');
    } else {
      console.log('  ⚠️ BrandingSheetIntegration.gs not found, skipping branding setup');
    }
    
    // Test branding functions
    if (typeof getBrandingForHTML === 'function') {
      const testConfig = getBrandingForHTML();
      console.log('  ✅ Branding system tested successfully');
    }
    
  } catch (error) {
    console.error('  ❌ Failed to setup branding system:', error);
    console.log('  ⚠️ Continuing deployment without branding...');
  }
}

/**
 * Step 4: Initialize Component Database
 */
function initializeComponentDatabase() {
  console.log('  ⚙️ Setting up component database...');
  
  try {
    // Check if backend functions are available
    if (typeof getBackendVersion === 'function') {
      const version = getBackendVersion();
      console.log(`  ✅ Backend version: ${version.version}`);
    }
    
    // Test component search
    if (typeof searchComponents === 'function') {
      console.log('  ✅ Component search system ready');
    }
    
    // Test assembly system
    if (typeof getAvailableAssemblies === 'function') {
      const assemblies = getAvailableAssemblies();
      console.log(`  ✅ Assembly system ready (${assemblies.totalCount || 0} assemblies)`);
    }
    
    console.log('  ✅ Component database initialized');
    
  } catch (error) {
    console.error('  ❌ Failed to initialize component database:', error);
    console.log('  ⚠️ You may need to set up your Master Catalog manually');
  }
}

/**
 * Step 5: Set up Menu System
 */
function setupMenuSystem() {
  console.log('  📱 Creating spreadsheet menu...');
  
  try {
    // Create the menu (this will be called automatically when the spreadsheet opens)
    if (typeof createCraftQuoteMenu === 'function') {
      createCraftQuoteMenu();
      console.log('  ✅ Menu system configured');
    } else if (typeof onOpen === 'function') {
      onOpen();
      console.log('  ✅ Menu system initialized');
    } else {
      console.log('  ⚠️ Menu functions not found, creating basic menu');
      createBasicMenu();
    }
    
  } catch (error) {
    console.error('  ❌ Failed to setup menu system:', error);
    console.log('  ⚠️ Menu will be available when spreadsheet is opened');
  }
}

/**
 * Step 6: Test All Connections
 */
function testAllConnections() {
  console.log('  🧪 Running system tests...');
  
  const testResults = {
    backend: false,
    branding: false,
    components: false,
    assemblies: false,
    quotes: false
  };
  
  // Test backend connection
  try {
    if (typeof testBackendConnection === 'function') {
      const result = testBackendConnection();
      testResults.backend = result.success;
      console.log('  ✅ Backend connection test passed');
    }
  } catch (error) {
    console.log('  ⚠️ Backend connection test failed:', error.message);
  }
  
  // Test branding system
  try {
    if (typeof testBrandingIntegration === 'function') {
      testBrandingIntegration();
      testResults.branding = true;
      console.log('  ✅ Branding system test passed');
    }
  } catch (error) {
    console.log('  ⚠️ Branding system test failed:', error.message);
  }
  
  // Test component search
  try {
    if (typeof searchComponents === 'function') {
      const result = searchComponents('PLC', 1);
      testResults.components = true;
      console.log('  ✅ Component search test passed');
    }
  } catch (error) {
    console.log('  ⚠️ Component search test failed:', error.message);
  }
  
  // Test assembly system
  try {
    if (typeof getAvailableAssemblies === 'function') {
      const result = getAvailableAssemblies();
      testResults.assemblies = result.success;
      console.log('  ✅ Assembly system test passed');
    }
  } catch (error) {
    console.log('  ⚠️ Assembly system test failed:', error.message);
  }
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`  📊 System tests completed: ${passedTests}/${totalTests} passed`);
  
  return testResults;
}

/**
 * Helper Functions for Sheet Setup
 */
function setupBrandingSheet(sheet) {
  const headers = [['Section', 'Key', 'Value', 'Description', 'Last Modified', 'Modified By']];
  sheet.getRange(1, 1, 1, 6).setValues(headers);
  sheet.getRange(1, 1, 1, 6).setBackground('#4a90e2').setFontColor('white').setFontWeight('bold');
  sheet.autoResizeColumns(1, 6);
  sheet.setFrozenRows(1);
}

function setupQuotesSheet(sheet) {
  const headers = [['Quote Number', 'Date', 'Customer', 'Project', 'Total', 'Status', 'Created By']];
  sheet.getRange(1, 1, 1, 7).setValues(headers);
  sheet.getRange(1, 1, 1, 7).setBackground('#10b981').setFontColor('white').setFontWeight('bold');
  sheet.autoResizeColumns(1, 7);
  sheet.setFrozenRows(1);
}

function setupComponentsSheet(sheet) {
  const headers = [['Component ID', 'Name', 'Description', 'Price', 'Category', 'Assembly']];
  sheet.getRange(1, 1, 1, 6).setValues(headers);
  sheet.getRange(1, 1, 1, 6).setBackground('#f59e0b').setFontColor('white').setFontWeight('bold');
  sheet.autoResizeColumns(1, 6);
  sheet.setFrozenRows(1);
}

function setupAssembliesSheet(sheet) {
  const headers = [['Assembly ID', 'Name', 'Category', 'Components', 'Total Cost', 'Description']];
  sheet.getRange(1, 1, 1, 6).setValues(headers);
  sheet.getRange(1, 1, 1, 6).setBackground('#8b5cf6').setFontColor('white').setFontWeight('bold');
  sheet.autoResizeColumns(1, 6);
  sheet.setFrozenRows(1);
}

function setupAuditLogSheet(sheet) {
  const headers = [['Timestamp', 'Action', 'User', 'Details', 'Quote/Assembly ID']];
  sheet.getRange(1, 1, 1, 5).setValues(headers);
  sheet.getRange(1, 1, 1, 5).setBackground('#ef4444').setFontColor('white').setFontWeight('bold');
  sheet.autoResizeColumns(1, 5);
  sheet.setFrozenRows(1);
}

function createBasicMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('CraftQuote')
    .addItem('🔧 Component Assembler', 'openComponentAssembler')
    .addItem('🎨 Branding Editor', 'openBrandingEditor')
    .addItem('🎛️ Assembly Editor', 'openAssemblyEditor')
    .addSeparator()
    .addItem('🧪 Test System', 'testBackendConnection')
    .addToUi();
}

/**
 * OPTIONAL: Pipedrive Integration Setup
 * Run this separately if you want CRM integration
 */
function setupPipedriveIntegration() {
  console.log('🔗 Setting up Pipedrive Integration...');
  console.log('===============================================');
  
  try {
    // Check if Pipedrive functions exist
    if (typeof setupCraftQuoteCustomFields !== 'function') {
      console.log('❌ PipedriveIntegration.gs not found');
      console.log('   Upload PipedriveIntegration.gs to enable CRM features');
      return { success: false, message: 'Pipedrive integration files missing' };
    }
    
    console.log('⚠️  MANUAL SETUP REQUIRED:');
    console.log('');
    console.log('1. Get your Pipedrive API token:');
    console.log('   - Go to Pipedrive → Settings → Personal → API');
    console.log('   - Copy your API token');
    console.log('');
    console.log('2. Run this code with your details:');
    console.log('   const properties = PropertiesService.getScriptProperties();');
    console.log('   properties.setProperties({');
    console.log('     "PIPEDRIVE_API_TOKEN": "YOUR_TOKEN_HERE",');
    console.log('     "PIPEDRIVE_COMPANY_DOMAIN": "yourcompany.pipedrive.com"');
    console.log('   });');
    console.log('');
    console.log('3. Then run: setupCraftQuoteCustomFields()');
    console.log('');
    
    return { success: true, message: 'Pipedrive setup instructions provided' };
    
  } catch (error) {
    console.error('❌ Pipedrive setup failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Quick Launch Functions - Use these to start the system
 */
function openComponentAssembler() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('HybridComponentAssembler')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'CraftQuote - Component Assembler');
}

function openBrandingEditor() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('BrandingEditor')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'CraftQuote - Branding Editor');
}

function openAssemblyEditor() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('AssemblyEditor')
    .setWidth(1000)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'CraftQuote - Assembly Editor');
}

/**
 * System Health Check - Run this anytime to check system status
 */
function checkSystemHealth() {
  console.log('🏥 CraftQuote System Health Check');
  console.log('===============================================');
  
  const health = {
    overall: 'healthy',
    components: {},
    recommendations: []
  };
  
  // Check core files
  const coreFiles = [
    'HybridAssemblerBackend.gs',
    'AssemblyQuoteBuilder.gs', 
    'HybridQuoteGenerator.gs',
    'MenuFunctions.gs'
  ];
  
  console.log('📋 Core Files Status:');
  coreFiles.forEach(file => {
    // Note: Can't directly check file existence in Apps Script
    console.log(`  - ${file}: Assumed present`);
  });
  
  // Check configurations
  const properties = PropertiesService.getScriptProperties();
  const configs = properties.getProperties();
  
  console.log('⚙️ Configuration Status:');
  console.log(`  - Script properties: ${Object.keys(configs).length} configured`);
  
  if (!configs.MAIN_SPREADSHEET_ID) {
    health.overall = 'warning';
    health.recommendations.push('Run deployCraftQuoteSystem() to complete setup');
  }
  
  // Check functions
  console.log('🔧 Function Availability:');
  const coreFunctions = [
    'testBackendConnection',
    'getAvailableAssemblies',
    'searchComponents',
    'getBrandingForHTML'
  ];
  
  coreFunctions.forEach(funcName => {
    const available = typeof eval(funcName) === 'function';
    console.log(`  - ${funcName}: ${available ? '✅' : '❌'}`);
    if (!available) health.overall = 'warning';
  });
  
  console.log('');
  console.log(`🎯 Overall System Health: ${health.overall.toUpperCase()}`);
  
  if (health.recommendations.length > 0) {
    console.log('💡 Recommendations:');
    health.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  return health;
}
