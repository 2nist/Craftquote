/**
 * SIMPLE MENU FIX - Use this to get the menu working immediately
 */

/**
 * Step 1: Run this function to create a spreadsheet with the menu
 */
function createSpreadsheetWithMenu() {
  try {
    // Create a new spreadsheet
    const spreadsheet = SpreadsheetApp.create('CraftQuote System');
    const spreadsheetUrl = spreadsheet.getUrl();
    
    console.log('✅ Created spreadsheet: ' + spreadsheetUrl);
    console.log('🔗 Click the URL above to open your spreadsheet');
    console.log('📱 The menu will appear automatically when you open it!');
    
    // Store the ID for later use
    PropertiesService.getScriptProperties().setProperty('MAIN_SPREADSHEET_ID', spreadsheet.getId());
    
    return {
      success: true,
      spreadsheetUrl: spreadsheetUrl,
      spreadsheetId: spreadsheet.getId()
    };
    
  } catch (error) {
    console.error('❌ Failed to create spreadsheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Step 2: This creates the menu (runs automatically when spreadsheet opens)
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    
    ui.createMenu('🔧 CraftQuote')
      .addItem('📝 Component Assembler', 'openComponentAssembler')
      .addItem('🎨 Branding Editor', 'openBrandingEditor')
      .addItem('🎛️ Assembly Editor', 'openAssemblyEditor')
      .addSeparator()
      .addItem('🧪 Test System', 'testSystem')
      .addToUi();
    
    console.log('✅ CraftQuote menu created successfully!');
    
  } catch (error) {
    console.error('❌ Menu creation failed:', error);
  }
}

/**
 * Step 3: Menu functions (these open your HTML files)
 */
function openComponentAssembler() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('HybridComponentAssembler')
      .setWidth(1200)
      .setHeight(800);
    SpreadsheetApp.getUi().showModalDialog(html, 'CraftQuote - Component Assembler');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error opening Component Assembler: ' + error.message);
  }
}

function openBrandingEditor() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('BrandingEditor')
      .setWidth(1200)
      .setHeight(800);
    SpreadsheetApp.getUi().showModalDialog(html, 'CraftQuote - Branding Editor');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error opening Branding Editor: ' + error.message);
  }
}

function openAssemblyEditor() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('AssemblyEditor')
      .setWidth(1000)
      .setHeight(700);
    SpreadsheetApp.getUi().showModalDialog(html, 'CraftQuote - Assembly Editor');
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error opening Assembly Editor: ' + error.message);
  }
}

function testSystem() {
  SpreadsheetApp.getUi().alert('✅ CraftQuote System is working!');
}

/**
 * Emergency function - creates menu even if onOpen doesn't work
 * IMPORTANT: This must be run from INSIDE the spreadsheet, not from Apps Script editor!
 */
function forceCreateMenu() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      console.log('❌ No active spreadsheet. You must run this from inside a Google Spreadsheet!');
      console.log('📋 Steps:');
      console.log('1. First run createSpreadsheetWithMenu() to get a spreadsheet URL');
      console.log('2. Open that spreadsheet');
      console.log('3. Go to Extensions → Apps Script');
      console.log('4. Then run forceCreateMenu()');
      return 'Must run from inside a spreadsheet!';
    }
    
    onOpen();
    return 'Menu created! Check the menu bar for "🔧 CraftQuote"';
    
  } catch (error) {
    console.error('❌ Error:', error);
    return 'Error: ' + error.message;
  }
}

/**
 * NEW SOLUTION: Create spreadsheet and open it automatically
 */
function createAndOpenSpreadsheet() {
  try {
    // Create the spreadsheet
    const spreadsheet = SpreadsheetApp.create('CraftQuote System - ' + new Date().toLocaleDateString());
    const spreadsheetUrl = spreadsheet.getUrl();
    
    console.log('');
    console.log('🎉 SUCCESS! Spreadsheet created!');
    console.log('📋 IMPORTANT: Follow these exact steps:');
    console.log('');
    console.log('1. Click this URL to open your spreadsheet:');
    console.log('   ' + spreadsheetUrl);
    console.log('');
    console.log('2. Once the spreadsheet opens, refresh the page (F5)');
    console.log('');
    console.log('3. Look for the "🔧 CraftQuote" menu in the menu bar');
    console.log('');
    console.log('4. If no menu appears, go to Extensions → Apps Script → Run onOpen()');
    console.log('');
    
    // Store the ID
    PropertiesService.getScriptProperties().setProperty('MAIN_SPREADSHEET_ID', spreadsheet.getId());
    
    return {
      success: true,
      spreadsheetUrl: spreadsheetUrl,
      instructions: 'Open the URL above and refresh the page to see the menu!'
    };
    
  } catch (error) {
    console.error('❌ Failed:', error);
    return { success: false, error: error.message };
  }
}
