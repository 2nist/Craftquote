/**
 * This function is called by an installable trigger when the spreadsheet is opened.
 * It creates the main "CraftQuote" menu with enhanced hierarchical workflow.
 * @param {object} e The event object.
 */
function onOpen(e) {
  addCraftQuoteMenu(e);
}

function addCraftQuoteMenu(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 CraftQuote')
    .addItem('📝 Component Assembler', 'openHybridAssembler')
    .addSeparator()
    .addSubMenu(ui.createMenu('🏗️ Hierarchical Workflow')
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
      .addItem('📋 Check Backend Version', 'checkBackendVersion')
      .addSeparator()
      .addItem('📋 Test Quote Generation', 'testHierarchicalQuoteGeneration'))
    .addToUi();
}

/**
 * Manually refresh the CraftQuote menu - call this if menu items are missing
 */
function refreshMenu() {
  try {
    addCraftQuoteMenu();
    SpreadsheetApp.getUi().alert(
      'Menu Refreshed!\n\n' +
      'The CraftQuote menu has been refreshed.\n' +
      'You should now see all menu options including:\n' +
      '• 🚀 Initialize Database\n' +
      '• 🏗️ Assembly Builder\n' +
      '• 📋 Quote Generator\n' +
      '• ✅ Validate Complete System'
    );
  } catch (error) {
    console.error('Menu refresh failed:', error);
    SpreadsheetApp.getUi().alert('Menu refresh failed: ' + error.toString());
  }
}

/**
 * Opens the main Hybrid Component Assembler interface.
 */
function openHybridAssembler() {
  try {
    console.log('🎯 MENU DEBUG - openHybridAssembler() called');
    const html = HtmlService.createTemplateFromFile('HybridComponentAssembler')
      .evaluate()
      .setWidth(1200)
      .setHeight(800)
      .setTitle('Hybrid Component Assembler - Live Master Catalog Data');
    SpreadsheetApp.getUi().showModalDialog(html, 'Component Assembler');
  } catch (error) {
    console.error('🚨 MENU ERROR - Failed to open Hybrid Assembler:', error);
    const errorMessage = `Error opening Hybrid Assembler:\n\nMessage: ${error.message}\n\nThis usually means the 'HybridComponentAssembler.html' file is missing or has a syntax error.`;
    SpreadsheetApp.getUi().alert(errorMessage);
  }
}

/**
 * Opens the Assembly Editor UI.
 * NOTE: This function needs a corresponding HTML file named 'AssemblyEditor.html'.
 */
function openAssemblyEditor() {
    try {
        console.log('🏗️ Opening Assembly Editor...');
        const html = HtmlService.createHtmlOutputFromFile('AssemblyEditor')
            .setWidth(1200)
            .setHeight(800)
            .setTitle('🏗️ CraftQuote Assembly Editor');
        SpreadsheetApp.getUi().showModalDialog(html, 'Assembly Editor');
    } catch (error) {
        console.error('🚨 Assembly Editor Error:', error);
        SpreadsheetApp.getUi().alert('Error opening Assembly Editor: ' + error.toString());
    }
}

// =================== BRANDING EDITOR FUNCTIONS ===================

/**
 * Open the Branding Editor interface
 */
function openBrandingEditor() {
  try {
    console.log('🎨 Opening Branding Editor...');
    const html = HtmlService.createHtmlOutputFromFile('BrandingEditor')
      .setWidth(1400)
      .setHeight(900)
      .setTitle('🎨 CraftQuote Branding Editor');
    SpreadsheetApp.getUi().showModalDialog(html, 'Branding Editor');
  } catch (error) {
    console.error('🚨 Branding Editor Error:', error);
    SpreadsheetApp.getUi().alert('Error opening Branding Editor: ' + error.toString());
  }
}

/**
 * Apply current branding configuration to main system
 */
function applyCurrentBranding() {
  try {
    const config = loadCustomBrandingConfig();
    let message = `🎨 Current Branding Applied!\n\n`;
    message += `App Name: ${config.app.name}\n`;
    message += `Primary Color: ${config.colors.primary}\n`;
    message += `Company: ${config.app.company}\n\n`;
    message += `All templates will now use this branding.`;
    SpreadsheetApp.getUi().alert('Branding Applied', message, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error applying branding: ' + error.toString());
  }
}

/**
 * Export branding configuration to downloadable file
 */
function exportBrandingConfig() {
  try {
    const config = loadCustomBrandingConfig();
    const configJSON = JSON.stringify(config, null, 2);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let tempSheet = ss.getSheetByName('BrandingExport_TEMP');
    if (!tempSheet) {
      tempSheet = ss.insertSheet('BrandingExport_TEMP');
    }
    tempSheet.clear();
    tempSheet.getRange(1, 1).setValue('CraftQuote Branding Configuration Export');
    tempSheet.getRange(2, 1).setValue('Copy the JSON below to save your configuration:');
    tempSheet.getRange(3, 1).setValue(configJSON);
    tempSheet.autoResizeColumns(1, 1);
    tempSheet.getRange(1, 1).setFontWeight('bold');
    tempSheet.getRange(3, 1).setWrap(true);
    tempSheet.setRowHeight(3, 500);
    SpreadsheetApp.setActiveSheet(tempSheet);
    SpreadsheetApp.getUi().alert(
      'Configuration Exported',
      'Your branding configuration has been exported to the "BrandingExport_TEMP" sheet.\n\nCopy the JSON from cell A3 to save your configuration.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert('Export Error: ' + error.toString());
  }
}

/**
 * Import branding configuration from user input
 */
function importBrandingConfig() {
  try {
    const ui = SpreadsheetApp.getUi();
    const result = ui.prompt(
      'Import Branding Configuration',
      'Paste your JSON configuration below:',
      ui.ButtonSet.OK_CANCEL
    );
    if (result.getSelectedButton() === ui.Button.OK) {
      const configText = result.getResponseText();
      try {
        const config = JSON.parse(configText);
        const saveResult = saveBrandingConfig(config);
        if (saveResult.success) {
          ui.alert('Configuration Imported', 'Your branding configuration has been imported successfully!', ui.ButtonSet.OK);
        } else {
          ui.alert('Import Error', 'Failed to save configuration: ' + saveResult.error, ui.ButtonSet.OK);
        }
      } catch (jsonError) {
        ui.alert('Import Error', 'Invalid JSON format. Please check your configuration and try again.', ui.ButtonSet.OK);
      }
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Import Error: ' + error.toString());
  }
}

/**
 * Reset branding to default values
 */
function resetBrandingToDefaults() {
  try {
    const ui = SpreadsheetApp.getUi();
    const result = ui.alert(
      'Reset Branding',
      'This will reset all branding settings to default values. This cannot be undone.\n\nAre you sure you want to continue?',
      ui.ButtonSet.YES_NO
    );
    if (result === ui.Button.YES) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const brandingSheet = ss.getSheetByName('BrandingConfig');
      if (brandingSheet) {
        ss.deleteSheet(brandingSheet);
      }
      ui.alert('Branding Reset', 'All branding settings have been reset to default values.', ui.ButtonSet.OK);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Reset Error: ' + error.toString());
  }
}

/**
 * Get branding configuration for use in HTML templates
 */
function getBrandingForHTML() {
  try {
    return loadCustomBrandingConfig();
  } catch (error) {
    console.error('Error loading branding for HTML:', error);
    return getBrandingConfig(); // Return defaults
  }
}

function debugTemplateAPI() {
  console.log('🚨 TEMPLATE API DEBUG - Testing what main system receives...');
  try {
    let message = '=== COMPONENT LOOKUP TEST ===\n';
    const comp1 = getComponentDetails('A8066CHFL');
    message += `A8066CHFL: ${comp1 ? `✅ ${comp1.name} ($${comp1.price})` : '❌ Not found'}\n\n`;

    message += `=== TEMPLATE API TEST ===\n`;
    const result = loadProductTemplate('BHAC');
    message += `Template Name: ${result.templateName}\n`;
    message += `Components Array Length: ${result.components ? result.components.length : 'NULL'}\n\n`;

    if (result.components && result.components.length > 0) {
      message += `✅ SUCCESS! Components found.\n`;
    } else {
      message += `❌ TEMPLATE FAILED - No components returned!`;
    }
    SpreadsheetApp.getUi().alert('🚨 COMPREHENSIVE DEBUG', message, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    console.error('🚨 TEMPLATE API ERROR:', error);
    SpreadsheetApp.getUi().alert('Template API Error: ' + error.toString());
  }
}

function testComponentLookup() {
  console.log('🎯 COMPONENT LOOKUP TEST - Starting...');
  try {
    const testComponents = ['A8066CHFL', 'A10106CHFL'];
    let results = `Component Lookup Test Results:\n\n`;
    for (const componentId of testComponents) {
      const result = getComponentDetails(componentId);
      if (result) {
        results += `✅ ${componentId}: ${result.name} - $${result.price}\n`;
      } else {
        results += `❌ ${componentId}: NOT FOUND\n\n`;
      }
    }
    SpreadsheetApp.getUi().alert('Component Lookup Test', results, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    console.error('🚨 COMPONENT LOOKUP ERROR:', error);
    SpreadsheetApp.getUi().alert('Component Lookup Error: ' + error.toString());
  }
}

function testMasterCatalogDebug() {
  console.log('🎯 MASTER CATALOG DEBUG - Starting debug...');
  try {
    const result = debugMasterCatalog();
    let message = `Master Catalog Debug Results:\n\n`;
    message += `Status: ${result.success ? '✅ Success' : '❌ Failed'}\n`;
    message += `Message: ${result.message}\n`;
    SpreadsheetApp.getUi().alert('Master Catalog Debug', message, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    console.error('🚨 DEBUG ERROR:', error);
    SpreadsheetApp.getUi().alert('Debug Error: ' + error.toString());
  }
}

function testBasicIntegration() {
  console.log('🎯 BASIC TEST - Function called');
  try {
    SpreadsheetApp.getUi().alert('🎯 Google Apps Script Integration Test\n\nBasic integration is working!');
  } catch (error) {
    console.error('🚨 BASIC TEST ERROR:', error);
  }
}

function testSimpleHTML() {
  console.log('🎯 HTML TEST - Testing simple HTML loading...');
  try {
    const html = HtmlService.createTemplateFromFile('TestHTML')
      .evaluate()
      .setWidth(500)
      .setHeight(400)
      .setTitle('🎯 HTML Loading Test');
    SpreadsheetApp.getUi().showModalDialog(html, 'HTML Test');
  } catch (error) {
    console.error('🚨 HTML TEST ERROR:', error);
    SpreadsheetApp.getUi().alert('HTML Test Error: ' + error.toString());
  }
}

function checkBackendVersion() {
  console.log('📋 BACKEND VERSION CHECK - Starting...');
  try {
    const version = getBackendVersion();
    let message = `Backend Version Information:\n\n`;
    message += `Version: ${version.version}\n`;
    message += `Master Catalog Integration: ${version.masterCatalogIntegration ? 'ACTIVE' : 'INACTIVE'}\n`;
    SpreadsheetApp.getUi().alert('Backend Version Check', message, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    console.error('🚨 VERSION CHECK ERROR:', error);
    SpreadsheetApp.getUi().alert('Version Check Error: ' + error.toString());
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// =================== MASTER CATALOG POPULATION FUNCTIONS ===================

function populateMasterCatalogForTemplates() {
  console.log('🎯 MENU - populateMasterCatalogForTemplates() called from menu');
  try {
    runMasterCatalogPopulation();
  } catch (error) {
    console.error('🚨 MENU ERROR - Failed to populate Master Catalog:', error);
    SpreadsheetApp.getUi().alert('Error populating Master Catalog: ' + error.message);
  }
}

function populateBHACComponents() {
  console.log('🎯 MENU - populateBHACComponents() called from menu');
  try {
    runBHACPopulation();
  } catch (error) {
    console.error('🚨 MENU ERROR - Failed to populate BHAC components:', error);
    SpreadsheetApp.getUi().alert('Error populating BHAC components: ' + error.message);
  }
}

function runMasterCatalogPopulation() {
  console.log('🎯 POPULATOR - Starting Master Catalog population...');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let masterCatalogSheet = ss.getSheetByName('Master Catalog');
  if (!masterCatalogSheet) {
    masterCatalogSheet = ss.insertSheet('Master Catalog');
    const headers = ['yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'QTY', 'UNIT', 'LEAD', 'MOQ', 'NOTES', 'CATEGORY', 'UPDATED', 'SOURCE', 'MANUAL'];
    masterCatalogSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  const essentialComponents = getAllTemplateComponentsLocal();
  let addedCount = 0;
  essentialComponents.forEach(component => {
    if (addComponentToMasterCatalogLocal(masterCatalogSheet, component)) {
      addedCount++;
    }
  });
  formatMasterCatalogSheetLocal(masterCatalogSheet);
  SpreadsheetApp.getUi().alert(`Master Catalog Populated!\n\n✅ ${addedCount} components added`);
}

function runBHACPopulation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Master Catalog');
  if (!sheet) {
    sheet = ss.insertSheet('Master Catalog');
    const headers = ['yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  const bhacComponents = [
    ['Y', 'Enclosures', '8Hx6D Grey Type 4 Enclosure', 'A8066CHFL', 'Hoffman', 'A8066CHFL', 245],
    ['Y', 'Enclosures', '16Hx12Wx6D Grey Type 4 Enclosure', 'CSD16126', 'Hoffman', 'CSD16126', 285],
    ['Y', 'Enclosures', '16Hx16Wx6D Grey Type 4 Enclosure', 'CSD16166', 'Hoffman', 'CSD16166', 325],
    ['Y', 'Enclosures', '20Hx20Wx8D Grey Type 4 Enclosure', 'CSD20208', 'Hoffman', 'CSD20208', 485]
  ];
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, bhacComponents.length, bhacComponents[0].length).setValues(bhacComponents);
  SpreadsheetApp.getUi().alert('BHAC components added to Master Catalog!');
}

function getAllTemplateComponentsLocal() {
  return [
    { id: 'A8066CHFL', name: '8Hx6Wx6D Grey Type 4 Enclosure', price: 245, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD16126', name: '16Hx12Wx6D Grey Type 4 Enclosure', price: 285, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'A10106CHFL', name: '10Hx10Wx6D Grey Type 4 Enclosure', price: 195, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'PLC-IDEC-16IO', name: 'IDEC MicroSmart FC6A 16 I/O PLC', price: 240, category: 'Control Systems', vendor: 'IDEC' },
    { id: 'HMI-10IN', name: '10" Color Touch Screen HMI', price: 850, category: 'Control Systems', vendor: 'IDEC' },
    { id: 'VFD-1.5HP', name: '1.5HP Variable Frequency Drive', price: 270, category: 'Power & Motor Control', vendor: 'ABB' },
  ];
}

function addComponentToMasterCatalogLocal(sheet, component) {
  const data = sheet.getDataRange().getValues();
  const partNumCol = 3; // Column D (PART#)
  for (let i = 1; i < data.length; i++) {
    if (data[i][partNumCol] === component.id) {
      return false; // Skip if exists
    }
  }
  const newRow = ['Y', component.category, component.name, component.id, component.vendor, component.id, component.price, 1, 'EA', '2-3 weeks', 1, 'Auto-populated', component.category, new Date(), 'Template System', ''];
  sheet.appendRow(newRow);
  return true;
}

function formatMasterCatalogSheetLocal(sheet) {
  const range = sheet.getDataRange();
  const headerRange = sheet.getRange(1, 1, 1, range.getNumColumns());
  headerRange.setBackground('#4a90e2').setFontColor('white').setFontWeight('bold');
  for (let col = 1; col <= range.getNumColumns(); col++) {
    sheet.autoResizeColumn(col);
  }
  sheet.setFrozenRows(1);
}

function showAssemblyManager() {
  try {
    const result = getAllAssemblies();
    if (result.success) {
      let message = `📊 Assembly Manager\n\nTotal Custom Assemblies: ${result.count}\n\n`;
      if (result.assemblies.length > 0) {
        message += `Recent Assemblies:\n`;
        result.assemblies.slice(0, 10).forEach(assembly => {
          message += `• ${assembly.name} (${assembly.id}) | Price: $${assembly.price}\n`;
        });
      } else {
        message += `No custom assemblies found.`;
      }
      SpreadsheetApp.getUi().alert('Assembly Manager', message, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      SpreadsheetApp.getUi().alert('Error', 'Failed to load assemblies: ' + result.error, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Assembly Manager error: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// =================== HIERARCHICAL WORKFLOW MENU FUNCTIONS ===================

/**
 * Open Parts Manager (placeholder for future development)
 */
function openPartsManager() {
  SpreadsheetApp.getUi().alert(
    '🔧 Parts Manager',
    'Parts Manager interface coming soon!\n\n' +
    'For now, you can manage parts directly in the HW_Parts sheet.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Open Panel Configurator (placeholder for future development)
 */
function openPanelConfigurator() {
  SpreadsheetApp.getUi().alert(
    '⚡ Panel Configurator',
    'Panel Configurator interface coming soon!\n\n' +
    'For now, you can manage panels directly in the HW_Panels sheet.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * View hierarchical database status
 */
function viewHierarchicalDatabaseStatus() {
  console.log('📊 MENU - Viewing hierarchical database status...');
  
  try {
    const statusResult = getHierarchicalDatabaseStatus();
    
    if (statusResult.success) {
      const status = statusResult.status;
      const summary = status.summary;
      
      let message = '📊 Hierarchical Database Status\n\n';
      
      if (status.initialized) {
        message += '✅ Database: Initialized\n\n';
        message += `📊 Summary:\n`;
        message += `• Parts: ${summary.partsCount}\n`;
        message += `• Assemblies: ${summary.assembliesCount}\n`;
        message += `• Panels: ${summary.panelsCount}\n`;
        message += `• Projects: ${summary.projectsCount}\n`;
        message += `• Quotes: ${summary.quotesCount}\n`;
        
        if (status.details?.bomDetailsCount) {
          message += `• BOM Details: ${status.details.bomDetailsCount}\n`;
        }
        
        message += '\n✅ Ready for hierarchical workflow!';
      } else {
        message += '⚠️ Database: Not Initialized\n\n';
        message += 'Missing sheets:\n';
        Object.keys(status.sheets).forEach(sheetName => {
          if (!status.sheets[sheetName].exists) {
            message += `• ${sheetName}\n`;
          }
        });
        message += '\nUse "Initialize Database" to set up the workflow.';
      }
      
      SpreadsheetApp.getUi().alert('Database Status', message, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      throw new Error(statusResult.error);
    }
    
  } catch (error) {
    console.error('❌ MENU - Error viewing database status:', error);
    SpreadsheetApp.getUi().alert(
      'Error',
      'Failed to retrieve database status:\n' + error.toString(),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}
