fu  ui.createMenu('🔧 Component Assembler')
    .addItem('Open Hybrid Quote Builder', 'openHybridAssembler')
    .addSeparator()
    .addSubMenu(ui.createMenu('🏗️ System Builder')
      .addItem('🎛️ Open Assembly Editor', 'openAssemblyEditor')
      .addItem('🗂️ Initialize System Database', 'initializeHybridSystem')
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
      .addItem('🧪 Populate BHAC Components Only', 'populateBHACComponents')
      .addItem('🔍 Debug Master Catalog', 'testMasterCatalogDebug')
      .addItem('🔧 Test Component Lookup', 'testComponentLookup'))() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 Component Assembler')
    .addItem('Open Hybrid Quote Builder', 'openHybridAssembler')
    .addSeparator()
    .addSubMenu(ui.createMenu('🏗️ System Builder')
      .addItem('🎛️ Open Assembly Editor', 'openAssemblyEditor')
      .addItem('🗂️ Initialize System Database', 'initializeHybridSystem')
      .addItem('� View All Assemblies', 'showAssemblyManager'))
    .addSeparator()
    .addSubMenu(ui.createMenu('�📦 Master Catalog Setup')
      .addItem('🚀 Populate ALL Template Components', 'populateMasterCatalogForTemplates')
      .addItem('🧪 Populate BHAC Components Only', 'populateBHACComponents')
      .addItem('🔍 Debug Master Catalog', 'testMasterCatalogDebug')
      .addItem('🔧 Test Component Lookup', 'testComponentLookup'))
    .addSeparator()
    .addItem('🧪 Test Google Apps Script', 'testBasicIntegration')
    .addItem('🎯 Test Simple HTML Loading', 'testSimpleHTML')
    .addItem('🚨 Debug Template API', 'debugTemplateAPI')
    .addItem('📋 Check Backend Version', 'checkBackendVersion')
    .addItem('🔥 EMERGENCY FIX', 'emergencyTemplateFix')
    .addItem('🎯 TEST EXACT HTML CALL', 'testExactHTMLCall')
    .addItem('🆘 FORCE REAL DATA HTML', 'forceRealDataHTML')
    .addToUi();
  console.log('🎯 ON OPEN - Menu created successfully with Assembly Editor access');
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
    
    // Create a temporary sheet with the config
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let tempSheet = ss.getSheetByName('BrandingExport_TEMP');
    
    if (!tempSheet) {
      tempSheet = ss.insertSheet('BrandingExport_TEMP');
    }
    
    tempSheet.clear();
    tempSheet.getRange(1, 1).setValue('CraftQuote Branding Configuration Export');
    tempSheet.getRange(2, 1).setValue('Copy the JSON below to save your configuration:');
    tempSheet.getRange(3, 1).setValue(configJSON);
    
    // Auto-resize and format
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
      // Delete the custom branding sheet
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

function forceRealDataHTML() {
  console.log('🆘 FORCING REAL DATA HTML - Creating HTML with hardcoded backend data...');
  try {
    // Get the real template data
    const templateData = loadProductTemplate('BHAC');
    console.log('Got template data:', templateData);
    
    // Create HTML with the data embedded
    const html = HtmlService.createTemplate(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>REAL DATA TEST</title>
        <style>
          body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
          .component { background: #333; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .real { border-left: 4px solid green; }
          .placeholder { border-left: 4px solid red; }
        </style>
      </head>
      <body>
        <h1>🚀 REAL DATA FROM MASTER CATALOG</h1>
        <p><strong>Template:</strong> ${templateData.templateName}</p>
        <p><strong>Total Components:</strong> ${templateData.components.length}</p>
        
        <h2>Components:</h2>
        <div id="components">
          ${templateData.components.map(comp => `
            <div class="component ${comp.isPlaceholder ? 'placeholder' : 'real'}">
              <strong>${comp.name}</strong><br>
              Price: $${comp.price}<br>
              Source: ${comp.source || 'Unknown'}<br>
              Type: ${comp.isPlaceholder ? '❌ PLACEHOLDER' : '✅ REAL DATA'}
            </div>
          `).join('')}
        </div>
        
        <h2>Raw Data:</h2>
        <pre style="background: #222; padding: 10px; overflow: auto;">
${JSON.stringify(templateData, null, 2)}
        </pre>
      </body>
      </html>
    `);
    
    const htmlOutput = html.evaluate()
      .setWidth(800)
      .setHeight(600)
      .setTitle('🚀 REAL DATA TEST - Direct from Master Catalog');
    
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, '🚀 REAL DATA PROOF');
    
  } catch (error) {
    console.error('🆘 FORCE REAL DATA ERROR:', error);
    SpreadsheetApp.getUi().alert('Force Real Data Error: ' + error.toString());
  }
}

function testExactHTMLCall() {
  console.log('🎯 TESTING EXACT HTML CALL - This is what the HTML is calling...');
  try {
    // This is EXACTLY what the HTML calls
    const result = loadProductTemplate('BHAC');
    
    let message = `🎯 EXACT HTML CALL TEST\n\n`;
    message += `Function Call: loadProductTemplate('BHAC')\n`;
    message += `Return Value Type: ${typeof result}\n`;
    message += `Return Value is null: ${result === null}\n`;
    message += `Return Value is undefined: ${result === undefined}\n\n`;
    
    if (result) {
      message += `✅ RESULT OBJECT:\n`;
      message += `- productType: ${result.productType}\n`;
      message += `- templateName: ${result.templateName}\n`;
      message += `- components: ${result.components ? `Array(${result.components.length})` : 'null/undefined'}\n`;
      message += `- suggestions: ${result.suggestions ? `Array(${result.suggestions.length})` : 'null/undefined'}\n`;
      message += `- defaultConfig: ${result.defaultConfig ? 'Object' : 'null/undefined'}\n\n`;
      
      if (result.components && result.components.length > 0) {
        message += `FIRST COMPONENT:\n`;
        const comp = result.components[0];
        message += `- name: ${comp.name}\n`;
        message += `- price: $${comp.price}\n`;
        message += `- isPlaceholder: ${comp.isPlaceholder}\n`;
      }
    } else {
      message += `❌ RESULT IS NULL/UNDEFINED!\n`;
      message += `This is why the HTML is crashing.\n`;
    }
    
    // Try to stringify it like the HTML would
    try {
      const jsonString = JSON.stringify(result);
      message += `\nJSON Serialization: ${jsonString ? 'SUCCESS' : 'FAILED'}\n`;
      message += `JSON Length: ${jsonString ? jsonString.length : 0} chars\n`;
    } catch (jsonError) {
      message += `\nJSON Serialization ERROR: ${jsonError.message}\n`;
    }
    
    SpreadsheetApp.getUi().alert('🎯 EXACT HTML CALL TEST', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    console.error('🎯 EXACT HTML CALL ERROR:', error);
    SpreadsheetApp.getUi().alert('Exact HTML Call Error: ' + error.toString());
  }
}

function emergencyTemplateFix() {
  console.log('🔥 EMERGENCY FIX - Forcing template update...');
  try {
    let message = `🔥 EMERGENCY TEMPLATE FIX\n\n`;
    
    // Test individual component pricing to see if it's correct
    message += `=== INDIVIDUAL COMPONENT PRICING ===\n`;
    const comp1 = getComponentDetails('A8066CHFL');
    const comp2 = getComponentDetails('A10106CHFL');
    
    if (comp1) message += `A8066CHFL: ${comp1.name} - $${comp1.price} (${comp1.source})\n`;
    if (comp2) message += `A10106CHFL: ${comp2.name} - $${comp2.price} (${comp2.source})\n\n`;
    
    // Check what components are actually in the BHAC template definition
    message += `=== TEMPLATE COMPONENTS ===\n`;
    
    // Manually call createTemplateFromKnowledge to see what it returns
    const template = createTemplateFromKnowledge('BHAC');
    
    message += `Template Name: ${template.templateName}\n`;
    message += `Components Found: ${template.components.length}\n\n`;
    
    if (template.components.length > 0) {
      message += `Components List:\n`;
      template.components.forEach((comp, i) => {
        message += `${i+1}. ${comp.name} - $${comp.price} (${comp.isPlaceholder ? 'PLACEHOLDER' : 'REAL'} from ${comp.source})\n`;
      });
      
      message += `\n🎉 SUCCESS! Real components are loading!\n`;
      message += `Main system should now show real parts.`;
    } else {
      message += `❌ NO COMPONENTS FOUND!\n`;
      message += `This means the component search is failing.\n`;
    }
    
    SpreadsheetApp.getUi().alert('🔥 EMERGENCY FIX RESULTS', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    console.error('🔥 EMERGENCY FIX ERROR:', error);
    SpreadsheetApp.getUi().alert('Emergency Fix Error: ' + error.toString());
  }
}

function debugTemplateAPI() {
  console.log('🚨 TEMPLATE API DEBUG - Testing what main system receives...');
  try {
    // FIRST: Test individual component lookup to verify backend is working
    console.log('Testing individual component lookup...');
    const comp1 = getComponentDetails('A8066CHFL');
    const comp2 = getComponentDetails('A10106CHFL');
    
    let message = `=== COMPONENT LOOKUP TEST ===\n`;
    message += `A8066CHFL: ${comp1 ? `✅ ${comp1.name} ($${comp1.price})` : '❌ Not found'}\n`;
    message += `A10106CHFL: ${comp2 ? `✅ ${comp2.name} ($${comp2.price})` : '❌ Not found'}\n\n`;
    
    // SECOND: Test the template creation
    console.log('Testing template creation...');
    const result = loadProductTemplate('BHAC');
    
    message += `=== TEMPLATE API TEST ===\n`;
    message += `Template Name: ${result.templateName}\n`;
    message += `Product Type: ${result.productType}\n`;
    message += `Components Array Length: ${result.components ? result.components.length : 'NULL'}\n\n`;
    
    if (result.components && result.components.length > 0) {
      message += `✅ SUCCESS! Components found:\n`;
      for (let i = 0; i < Math.min(5, result.components.length); i++) {
        const comp = result.components[i];
        message += `${i+1}. ${comp.name} ($${comp.price}) - ${comp.isPlaceholder ? 'PLACEHOLDER' : 'REAL'}\n`;
      }
      
      const realCount = result.components.filter(c => !c.isPlaceholder).length;
      const placeholderCount = result.components.filter(c => c.isPlaceholder).length;
      message += `\nSummary: ${realCount} real, ${placeholderCount} placeholders`;
    } else {
      message += `❌ TEMPLATE FAILED - No components returned!`;
    }
    
    // THIRD: Test backend version
    message += `\n\n=== BACKEND VERSION ===\n`;
    try {
      const version = getBackendVersion();
      message += `Version: ${version.version}\n`;
      message += `Master Catalog Integration: ${version.masterCatalogIntegration ? 'ACTIVE' : 'INACTIVE'}\n`;
    } catch (versionError) {
      message += `Version check failed: ${versionError.message}\n`;
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
    // Test the exact components we know exist
    const testComponents = ['A8066CHFL', 'A10106CHFL'];
    let results = `Component Lookup Test Results:\n\n`;
    
    for (const componentId of testComponents) {
      console.log(`Testing component: ${componentId}`);
      const result = getComponentDetails(componentId);
      
      if (result) {
        results += `✅ ${componentId}:\n`;
        results += `  Name: ${result.name}\n`;
        results += `  Price: $${result.price}\n`;
        results += `  Category: ${result.category}\n`;
        results += `  Placeholder: ${result.isPlaceholder ? 'YES' : 'NO'}\n`;
        results += `  Source: ${result.source}\n\n`;
      } else {
        results += `❌ ${componentId}: NOT FOUND\n\n`;
      }
    }
    
    // Also test the template loading directly
    console.log('Testing BHAC template loading...');
    const template = loadProductTemplate('BHAC');
    results += `BHAC Template Results:\n`;
    results += `Components Found: ${template.components.length}\n`;
    results += `Real Components: ${template.components.filter(c => !c.isPlaceholder).length}\n`;
    results += `Placeholders: ${template.components.filter(c => c.isPlaceholder).length}\n`;
    
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
    
    if (result.success) {
      message += `\nSheet Info:\n`;
      message += `- Total Rows: ${result.totalRows}\n`;
      message += `- Total Columns: ${result.totalColumns}\n`;
      message += `- Headers: ${result.headers.slice(0, 8).join(', ')}...\n`;
      
      if (result.foundTemplateComponents && result.foundTemplateComponents.length > 0) {
        message += `\n🎯 Found Template Components:\n`;
        result.foundTemplateComponents.forEach(comp => {
          message += `- ${comp.component} (Row ${comp.row})\n`;
        });
      } else {
        message += `\n⚠️ No template components found in sample data\n`;
        message += `Looking for: A8066CHFL, CSD16126, CSD16166, CSD20208, A10106CHFL\n`;
      }
    }
    
    if (result.availableSheets) {
      message += `\nAvailable Sheets: ${result.availableSheets.join(', ')}`;
    }
    
    SpreadsheetApp.getUi().alert('Master Catalog Debug', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    console.error('🚨 DEBUG ERROR:', error);
    SpreadsheetApp.getUi().alert('Debug Error: ' + error.toString());
  }
}

function testBasicIntegration() {
  console.log('🎯 BASIC TEST - Function called');
  try {
    SpreadsheetApp.getUi().alert('🎯 Google Apps Script Integration Test\n\nBasic integration is working!\n\nSpreadsheet: ' + SpreadsheetApp.getActiveSpreadsheet().getName());
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
    
    console.log('🎯 HTML TEST - Simple HTML created successfully');
    SpreadsheetApp.getUi().showModalDialog(html, 'HTML Test');
    console.log('🎯 HTML TEST - Simple HTML dialog shown');
  } catch (error) {
    console.error('🚨 HTML TEST ERROR:', error);
    SpreadsheetApp.getUi().alert('HTML Test Error: ' + error.toString());
  }
}

function openHybridAssembler() {
  try {
    console.log('🎯 MENU DEBUG - openHybridAssembler() called');
    console.log('🎯 MENU DEBUG - Creating HTML template from file: HybridComponentAssembler');
    
    // Try to create the HTML template
    const template = HtmlService.createTemplateFromFile('HybridComponentAssembler');
    console.log('🎯 MENU DEBUG - Template created, now evaluating...');
    
    const html = template.evaluate()
      .setWidth(1200)
      .setHeight(800)
      .setTitle('Hybrid Component Assembler - Live Master Catalog Data');
    
    console.log('🎯 MENU DEBUG - HTML template evaluated successfully');
    console.log('🎯 MENU DEBUG - Showing modal dialog');
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Component Assembler');
    
    console.log('🎯 MENU DEBUG - Modal dialog shown successfully');
  } catch (error) {
    console.error('🚨 MENU ERROR - Failed to open Hybrid Assembler:', error);
    console.error('🚨 MENU ERROR - Error message:', error.message);
    console.error('🚨 MENU ERROR - Error stack:', error.stack);
    
    // Show detailed error to user
    const errorMessage = `Error opening Hybrid Assembler:\n\nType: ${error.name}\nMessage: ${error.message}\n\nThis usually means:\n1. HybridComponentAssembler.html file is missing\n2. There's a syntax error in the HTML file\n3. File permissions issue`;
    
    SpreadsheetApp.getUi().alert(errorMessage);
  }
}

function checkBackendVersion() {
  console.log('📋 BACKEND VERSION CHECK - Starting...');
  try {
    const version = getBackendVersion();
    
    let message = `Backend Version Information:\n\n`;
    message += `Version: ${version.version}\n`;
    message += `Last Updated: ${version.lastUpdated}\n`;
    message += `Features: ${version.features}\n`;
    message += `Master Catalog Integration: ${version.masterCatalogIntegration ? 'ACTIVE' : 'INACTIVE'}\n`;
    message += `Real Data Enabled: ${version.realDataEnabled ? 'YES' : 'NO'}\n\n`;
    
    // Also check if functions exist
    message += `Function Check:\n`;
    message += `- loadProductTemplate: ${typeof loadProductTemplate === 'function' ? '✅' : '❌'}\n`;
    message += `- getComponentDetails: ${typeof getComponentDetails === 'function' ? '✅' : '❌'}\n`;
    message += `- searchMasterCatalogForComponent: ${typeof searchMasterCatalogForComponent === 'function' ? '✅' : '❌'}\n`;
    
    SpreadsheetApp.getUi().alert('Backend Version Check', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    console.error('🚨 VERSION CHECK ERROR:', error);
    SpreadsheetApp.getUi().alert('Version Check Error: ' + error.toString());
  }
}

// Include function for HTML templates
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// =================== MASTER CATALOG POPULATION FUNCTIONS ===================

/**
 * Wrapper function to populate Master Catalog - calls the main populator
 */
function populateMasterCatalogForTemplates() {
  console.log('🎯 MENU - populateMasterCatalogForTemplates() called from menu');
  
  try {
    // Try to call the function directly
    return runMasterCatalogPopulation();
  } catch (error) {
    console.error('🚨 MENU ERROR - Failed to populate Master Catalog:', error);
    SpreadsheetApp.getUi().alert('Error populating Master Catalog: ' + error.message);
  }
}

/**
 * Wrapper function to populate BHAC components - calls the BHAC populator
 */
function populateBHACComponents() {
  console.log('🎯 MENU - populateBHACComponents() called from menu');
  
  try {
    return runBHACPopulation();
  } catch (error) {
    console.error('🚨 MENU ERROR - Failed to populate BHAC components:', error);
    SpreadsheetApp.getUi().alert('Error populating BHAC components: ' + error.message);
  }
}

/**
 * Main function to populate Master Catalog with all template components
 */
function runMasterCatalogPopulation() {
  console.log('🎯 POPULATOR - Starting Master Catalog population...');
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let masterCatalogSheet = ss.getSheetByName('Master Catalog');
  
  if (!masterCatalogSheet) {
    console.log('🎯 POPULATOR - Creating Master Catalog sheet...');
    masterCatalogSheet = ss.insertSheet('Master Catalog');
    
    // Set up headers based on backend expectation
    const headers = [
      'yn',         // Column A - Active flag
      'PART',       // Column B - Part type/category
      'DESCRIPTION', // Column C - Description  
      'PART#',      // Column D - Part number (ID)
      'VNDR',       // Column E - Vendor
      'VNDR#',      // Column F - Vendor number
      'COST',       // Column G - Cost
      'QTY',        // Column H - Quantity
      'UNIT',       // Column I - Unit
      'LEAD',       // Column J - Lead time
      'MOQ',        // Column K - Minimum order quantity
      'NOTES',      // Column L - Notes
      'CATEGORY',   // Column M - Category
      'UPDATED',    // Column N - Last updated
      'SOURCE',     // Column O - Data source
      'MANUAL'      // Column P - Manual link
    ];
    
    masterCatalogSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    console.log('🎯 POPULATOR - Headers created');
  }
  
  // Get essential components from all templates
  const essentialComponents = getAllTemplateComponentsLocal();
  
  console.log(`🎯 POPULATOR - Found ${essentialComponents.length} components to add`);
  
  // Add components to Master Catalog
  let addedCount = 0;
  essentialComponents.forEach(component => {
    if (addComponentToMasterCatalogLocal(masterCatalogSheet, component)) {
      addedCount++;
    }
  });
  
  console.log(`🎯 POPULATOR - Added ${addedCount} components to Master Catalog`);
  
  // Format the sheet
  formatMasterCatalogSheetLocal(masterCatalogSheet);
  
  SpreadsheetApp.getUi().alert(
    `Master Catalog Populated!\n\n` +
    `✅ ${addedCount} components added\n` +
    `✅ All template components now available\n` +
    `✅ Hybrid Component Assembler ready for real data\n\n` +
    `You can now test your templates with real components!`
  );
  
  return {
    success: true,
    componentsAdded: addedCount,
    totalComponents: essentialComponents.length
  };
}

/**
 * Quick function to populate just BHAC components
 */
function runBHACPopulation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Master Catalog');
  
  if (!sheet) {
    sheet = ss.insertSheet('Master Catalog');
    const headers = ['yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  const bhacComponents = [
    ['Y', 'Enclosures', '8Hx6Wx6D Grey Type 4 Enclosure', 'A8066CHFL', 'Hoffman', 'A8066CHFL', 245],
    ['Y', 'Enclosures', '16Hx12Wx6D Grey Type 4 Enclosure', 'CSD16126', 'Hoffman', 'CSD16126', 285],
    ['Y', 'Enclosures', '16Hx16Wx6D Grey Type 4 Enclosure', 'CSD16166', 'Hoffman', 'CSD16166', 325],
    ['Y', 'Enclosures', '20Hx20Wx8D Grey Type 4 Enclosure', 'CSD20208', 'Hoffman', 'CSD20208', 485]
  ];
  
  // Add components to sheet
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, bhacComponents.length, bhacComponents[0].length)
    .setValues(bhacComponents);
  
  SpreadsheetApp.getUi().alert('BHAC components added to Master Catalog!');
}

/**
 * Get all components from all templates (local copy)
 */
function getAllTemplateComponentsLocal() {
  const components = [];
  
  // BHAC Template Components
  components.push(
    { id: 'A8066CHFL', name: '8Hx6Wx6D Grey Type 4 Enclosure', price: 245, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD16126', name: '16Hx12Wx6D Grey Type 4 Enclosure', price: 285, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD16166', name: '16Hx16Wx6D Grey Type 4 Enclosure', price: 325, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD20208', name: '20Hx20Wx8D Grey Type 4 Enclosure', price: 485, category: 'Enclosures', vendor: 'Hoffman' }
  );
  
  // DTAC Template Components  
  components.push(
    { id: 'A10106CHFL', name: '10Hx10Wx6D Grey Type 4 Enclosure', price: 195, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'A16148CHFL', name: '16Hx14Wx8D Grey Type 4 Enclosure', price: 365, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD16610', name: '16Hx16Wx10D Grey Type 4 Enclosure', price: 395, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CP1612G', name: 'Galvanized Subpanel for 16x12 Enclosure', price: 125, category: 'Panels', vendor: 'Hoffman' }
  );
  
  // CPAC Template Components
  components.push(
    { id: 'CSD20160SS', name: 'STAINLESS 20Hx16Wx10D Type 4x Enclosure', price: 895, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD20168SS', name: 'STAINLESS 20Hx16Wx8D Type 4x Enclosure', price: 825, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CP2016G', name: 'Galvanized Subpanel for 20x16 Enclosure', price: 165, category: 'Panels', vendor: 'Hoffman' },
    { id: 'CP2020G', name: 'Galvanized Subpanel for 20x20 Enclosure', price: 185, category: 'Panels', vendor: 'Hoffman' }
  );
  
  // AGAC Template Components
  components.push(
    { id: 'CSD20206', name: '20Hx20Wx6D Grey Type 4 Enclosure', price: 465, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'CSD20210', name: '20Hx20Wx10D Grey Type 4 Enclosure', price: 525, category: 'Enclosures', vendor: 'Hoffman' }
  );
  
  // GHAC Template Components
  components.push(
    { id: 'A6044CHNFSS', name: '6Hx4Wx4D SS JBOX', price: 145, category: 'Enclosures', vendor: 'Hoffman' },
    { id: 'A8P6G', name: 'Galvanized Subpanel for 8x6 Enclosure', price: 85, category: 'Panels', vendor: 'Hoffman' },
    { id: 'CP1610G', name: 'Galvanized Subpanel for 16x10 Enclosure', price: 135, category: 'Panels', vendor: 'Hoffman' },
    { id: 'CP1616G', name: 'Galvanized Subpanel for 16x16 Enclosure', price: 145, category: 'Panels', vendor: 'Hoffman' }
  );
  
  // Add essential control components
  components.push(
    { id: 'PLC-IDEC-16IO', name: 'IDEC MicroSmart FC6A 16 I/O PLC', price: 240, category: 'Control Systems', vendor: 'IDEC' },
    { id: 'PLC-IDEC-40IO', name: 'IDEC MicroSmart FC6A 40 I/O PLC', price: 310, category: 'Control Systems', vendor: 'IDEC' },
    { id: 'HMI-10IN', name: '10" Color Touch Screen HMI', price: 850, category: 'Control Systems', vendor: 'IDEC' },
    { id: 'HMI-12IN', name: '12.1" Color Touch Screen HMI', price: 1085, category: 'Control Systems', vendor: 'IDEC' },
    { id: 'VFD-1.5HP', name: '1.5HP Variable Frequency Drive', price: 270, category: 'Power & Motor Control', vendor: 'ABB' },
    { id: 'VFD-3HP', name: '3HP Variable Frequency Drive', price: 420, category: 'Power & Motor Control', vendor: 'ABB' },
    { id: 'SAFETY-RELAY', name: 'Safety Relay System MSR127RP', price: 139, category: 'Safety Systems', vendor: 'Allen Bradley' },
    { id: 'E-STOP', name: 'Emergency Stop Button 22mm Red', price: 22, category: 'Safety Systems', vendor: 'Schneider' },
    { id: 'DISCONNECT-60A', name: '60A Non-Fused Disconnect 3-Pole', price: 103, category: 'Power & Motor Control', vendor: 'Square D' }
  );
  
  return components;
}

/**
 * Add component to Master Catalog if it doesn't exist (local copy)
 */
function addComponentToMasterCatalogLocal(sheet, component) {
  // Check if component already exists
  const data = sheet.getDataRange().getValues();
  const partNumCol = 3; // Column D (PART#)
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][partNumCol] === component.id) {
      console.log(`🎯 POPULATOR - Component ${component.id} already exists, skipping`);
      return false;
    }
  }
  
  // Add new component
  const newRow = [
    'Y',                    // Column A - yn (active)
    component.category,     // Column B - PART (category) 
    component.name,         // Column C - DESCRIPTION
    component.id,           // Column D - PART# (ID)
    component.vendor,       // Column E - VNDR
    component.id,           // Column F - VNDR# (use same as part#)
    component.price,        // Column G - COST
    1,                      // Column H - QTY
    'EA',                   // Column I - UNIT
    '2-3 weeks',           // Column J - LEAD
    1,                      // Column K - MOQ
    'Auto-populated',       // Column L - NOTES
    component.category,     // Column M - CATEGORY
    new Date(),            // Column N - UPDATED
    'Template System',     // Column O - SOURCE
    ''                     // Column P - MANUAL
  ];
  
  sheet.appendRow(newRow);
  console.log(`🎯 POPULATOR - Added component: ${component.id} - ${component.name}`);
  return true;
}

/**
 * Format Master Catalog sheet for better readability (local copy)
 */
function formatMasterCatalogSheetLocal(sheet) {
  const range = sheet.getDataRange();
  
  // Header formatting
  const headerRange = sheet.getRange(1, 1, 1, range.getNumColumns());
  headerRange.setBackground('#4a90e2');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Auto-resize columns
  for (let col = 1; col <= range.getNumColumns(); col++) {
    sheet.autoResizeColumn(col);
  }
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log('🎯 POPULATOR - Master Catalog formatted');
}

/**
 * Menu functions for the new Assembly Editor system
 */
function showAssemblyManager() {
  try {
    const result = getAllAssemblies();
    
    if (result.success) {
      let message = `📊 Assembly Manager\n\n`;
      message += `Total Custom Assemblies: ${result.count}\n\n`;
      
      if (result.assemblies.length > 0) {
        message += `Recent Assemblies:\n`;
        result.assemblies.slice(0, 10).forEach(assembly => {
          message += `• ${assembly.name} (${assembly.id})\n`;
          message += `  Category: ${assembly.category} | Price: $${assembly.price}\n\n`;
        });
      } else {
        message += `No custom assemblies found.\nUse the Assembly Editor to create your first one!`;
      }
      
      SpreadsheetApp.getUi().alert('Assembly Manager', message, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      SpreadsheetApp.getUi().alert('Error', 'Failed to load assemblies: ' + result.error, SpreadsheetApp.getUi().ButtonSet.OK);
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Assembly Manager error: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}
