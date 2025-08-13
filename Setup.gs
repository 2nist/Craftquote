/****************************************************************
 * CraftQuote System - Setup & Configuration
 * Version: 2.0 (Consolidated)
 * Date: August 12, 2025
 *
 * This single script handles the complete installation and
 * contains all menu-related functions for the CraftQuote system.
 ****************************************************************/

// ===============================================================
// 🚀 ONE-TIME INSTALLATION
// ===============================================================

/**
 * MAIN INSTALLATION FUNCTION
 * Run this function once from the Apps Script Editor to set up the entire CraftQuote system.
 */
function installCraftQuoteSystem() {
  try {
    console.log('Starting CraftQuote System Installation...');
    console.log('This process will create a new Google Sheet and set up the required database structure.');

    console.log('🚀 Starting CraftQuote System Deployment...');

    // Step 1: Create or find the main spreadsheet
    const spreadsheet = createSystemSpreadsheet();
    console.log(`✅ Spreadsheet ready with ID: ${spreadsheet.getId()}`);

    // Step 2: Create all necessary sheets
    setupAllSheets(spreadsheet);
    console.log('✅ All database sheets created.');

    // Step 3: Create the branding sheet
    setupBrandingSheet(spreadsheet);
    console.log('✅ Branding sheet created.');

    // Step 4: Populate the database with initial data
    populateInitialData(spreadsheet);
    console.log('✅ Initial data populated into Master Catalog and Product Templates.');

    // Step 5: Install the all-important menu trigger
    installMenuTrigger(spreadsheet.getId());
    console.log('✅ onOpen trigger installed successfully.');

    const successMessage = `🎉 DEPLOYMENT COMPLETE! 🎉\n\nThe "CraftQuote System Database" spreadsheet is ready.\n\nPlease open it from your Google Drive to begin. The "🔧 CraftQuote" menu will appear shortly after opening.`;
    console.log(successMessage);

  } catch (e) {
    console.error(`❌ INSTALLATION FAILED: ${e.toString()}`, e.stack);
    // Since we can't show a UI alert, we'll log the error prominently.
    console.error("The installation failed. Please check the logs above for details.");
  }
}

// ===============================================================
// 🍽️ MENU & TRIGGER FUNCTIONS (Formerly MenuFunctions.gs)
// ===============================================================

/**
 * Creates the CraftQuote menu. This is called by an installable onOpen trigger.
 * @param {object} e The onOpen event object.
 */
function addCraftQuoteMenu(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 CraftQuote')
    .addItem('📝 Component Assembler', 'openHybridAssembler')
    .addSeparator()
    .addItem('🎨 Branding Editor', 'showBrandingEditor')
    .addItem('📁 File Transfer Wizard', 'showFileWizard')
    .addSeparator()
    .addItem('📎 Upload Quote to Pipedrive', 'showPipedriveUploader')
    .addSubMenu(ui.createMenu('🏗️ System Builder')
      .addItem('🎛️ Open Assembly Editor', 'openAssemblyEditor')
      .addItem('📊 View All Assemblies', 'showAssemblyManager'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📦 Master Catalog Setup')
      .addItem('�️ Import from CSV', 'showCatalogImporter')
      .addItem('🚀 Populate Demo Components', 'populateMasterCatalogForTemplates'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Debug & Testing')
      .addItem('🔍 Debug Master Catalog', 'testMasterCatalogDebug')
      .addItem('📋 Check Backend Version', 'checkBackendVersion'))
    .addToUi();
}

/**
 * Opens the main Hybrid Component Assembler interface.
 */
function openHybridAssembler() {
  try {
    const html = HtmlService.createTemplateFromFile('HybridComponentAssembler')
      .evaluate()
      .setWidth(1200)
      .setHeight(800)
      .setTitle('Hybrid Component Assembler');
    SpreadsheetApp.getUi().showModalDialog(html, 'Component Assembler');
  } catch (error) {
    const errorMessage = `Error opening Hybrid Assembler:\n\nMessage: ${error.message}`;
    SpreadsheetApp.getUi().alert(errorMessage);
  }
}

/**
 * Opens the Assembly Editor UI.
 */
function openAssemblyEditor() {
    try {
        const html = HtmlService.createHtmlOutputFromFile('AssemblyEditor')
            .setWidth(1200)
            .setHeight(800)
            .setTitle('🏗️ CraftQuote Assembly Editor');
        SpreadsheetApp.getUi().showModalDialog(html, 'Assembly Editor');
    } catch (error) {
        SpreadsheetApp.getUi().alert('Error opening Assembly Editor: ' + error.toString());
    }
}

/**
 * Includes HTML content from another file into a template.
 * Used inside HTML files like: <?= include('Stylesheet'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


// ===============================================================
// ⚙️ INSTALLATION HELPER FUNCTIONS
// ===============================================================

/**
 * Creates or finds the main spreadsheet for the system.
 * @returns {Spreadsheet} The spreadsheet object.
 */
function createSystemSpreadsheet() {
  const spreadsheetName = 'CraftQuote System Database';
  const files = DriveApp.getFilesByName(spreadsheetName);

  if (files.hasNext()) {
    const file = files.next();
    console.log(`Found existing spreadsheet: ${file.getName()}`);
    return SpreadsheetApp.openById(file.getId());
  } else {
    console.log(`Creating new spreadsheet: ${spreadsheetName}`);
    return SpreadsheetApp.create(spreadsheetName);
  }
}

/**
 * Creates all the required sheets in the spreadsheet.
 * @param {Spreadsheet} ss The spreadsheet object.
 */
function setupAllSheets(ss) {
  const sheetsToCreate = {
    'Product_Templates': ['TemplateID', 'TemplateName', 'ComponentList', 'DefaultConfig', 'CreatedDate', 'ModifiedDate', 'IsActive'],
    'Master Catalog': ['yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'QTY', 'UNIT', 'LEAD', 'MOQ', 'NOTES', 'CATEGORY', 'UPDATED', 'SOURCE', 'MANUAL'],
    'Assemblies': ['Assembly ID', 'Name', 'Category', 'Components', 'Total Cost', 'Description'],
    'Quotes': ['Quote Number', 'Date', 'Customer', 'Project', 'Total', 'Status', 'Created By'],
    'AuditLog': ['Timestamp', 'Action', 'User', 'Details', 'ReferenceID']
  };

  for (const sheetName in sheetsToCreate) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    // Clear existing content and set headers
    sheet.clear();
    const headers = sheetsToCreate[sheetName];
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold').setBackground('#4a90e2').setFontColor('white');
    sheet.setFrozenRows(1);
    // Auto-resize columns for readability
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  // Delete the default "Sheet1" if it exists
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }
}

/**
 * Populates the database with initial product templates and components.
 * @param {Spreadsheet} ss The spreadsheet object.
 */
function populateInitialData(ss) {
  // 1. Populate Product Templates
  const templatesSheet = ss.getSheetByName('Product_Templates');
  const templateDefinitions = [
    ['BHAC', 'Brewery Heat Automation Control', 'A8066CHFL,CSD16126,CSD16166,CSD20208', '{"voltage":"480V","phase":"3"}', new Date(), new Date(), true],
    ['DTAC', 'Distillery Temperature Automation Control', 'A10106CHFL,A16148CHFL,CSD16610,CP1612G', '{"voltage":"480V","phase":"3"}', new Date(), new Date(), true],
    ['CPAC', 'CIP Automated Control', 'CSD20160SS,CSD20168SS,CP2016G,CP2020G', '{"enclosureType":"stainless"}', new Date(), new Date(), true],
  ];
  templatesSheet.getRange(2, 1, templateDefinitions.length, templateDefinitions[0].length).setValues(templateDefinitions);

  // 2. Populate Master Catalog with some essential components
  const catalogSheet = ss.getSheetByName('Master Catalog');
  const components = [
    ['Y', 'Enclosures', '8Hx6Wx6D Grey Type 4 Enclosure', 'A8066CHFL', 'Hoffman', 'A8066CHFL', 245, 10, 'EA', '1 week', 1, '', 'Enclosures', new Date(), 'Initial Import', ''],
    ['Y', 'Enclosures', '16Hx12Wx6D Grey Type 4 Enclosure', 'CSD16126', 'Hoffman', 'CSD16126', 285, 10, 'EA', '1 week', 1, '', 'Enclosures', new Date(), 'Initial Import', ''],
    ['Y', 'Enclosures', '10Hx10Wx6D Grey Type 4 Enclosure', 'A10106CHFL', 'Hoffman', 'A10106CHFL', 195, 10, 'EA', '1 week', 1, '', 'Enclosures', new Date(), 'Initial Import', ''],
    ['Y', 'Enclosures', 'STAINLESS 20Hx16Wx10D Type 4x Enclosure', 'CSD20160SS', 'Hoffman', 'CSD20160SS', 895, 5, 'EA', '2 weeks', 1, '', 'Enclosures', new Date(), 'Initial Import', ''],
    ['Y', 'Control Systems', 'IDEC MicroSmart FC6A 16 I/O PLC', 'PLC-IDEC-16IO', 'IDEC', 'FC6A-C16R1AE', 240, 15, 'EA', '1 week', 1, '', 'Control Systems', new Date(), 'Initial Import', ''],
    ['Y', 'Control Systems', '10" Color Touch Screen HMI', 'HMI-10IN', 'IDEC', 'HG3G-AJT22MF-B', 850, 8, 'EA', '1 week', 1, '', 'Control Systems', new Date(), 'Initial Import', ''],
  ];
  catalogSheet.getRange(2, 1, components.length, components[0].length).setValues(components);
}

/**
 * Deletes any old triggers and creates a new, clean onOpen trigger for the menu.
 * @param {string} spreadsheetId The ID of the spreadsheet to attach the trigger to.
 */
function installMenuTrigger(spreadsheetId) {
  // Delete all existing triggers for this script to avoid duplicates.
  const allTriggers = ScriptApp.getProjectTriggers();
  for (const trigger of allTriggers) {
    if (trigger.getHandlerFunction() === 'addCraftQuoteMenu') {
      ScriptApp.deleteTrigger(trigger);
      console.log('Deleted existing menu trigger.');
    }
  }

  // Create the new trigger.
  ScriptApp.newTrigger('addCraftQuoteMenu')
    .forSpreadsheet(spreadsheetId)
    .onOpen()
    .create();
  console.log('New menu trigger created successfully.');
}
