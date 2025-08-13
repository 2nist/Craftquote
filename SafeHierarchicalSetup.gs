/**
 * SAFE HIERARCHICAL SETUP - MINIMAL VERSION
 * Use this if your main file got corrupted
 */

function quickSetup() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create basic sheets
    createBasicHierarchicalSheets(ss);
    
    // Update menu
    refreshBasicMenu();
    
    SpreadsheetApp.getUi().alert('✅ Quick Setup Complete!\n\nBasic hierarchical sheets created:\n• HW_Parts\n• HW_Assemblies\n• HW_Quotes');
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Setup failed: ' + error.toString());
  }
}

function createBasicHierarchicalSheets(ss) {
  // Create HW_Parts sheet
  let partsSheet = ss.getSheetByName('HW_Parts');
  if (!partsSheet) {
    partsSheet = ss.insertSheet('HW_Parts');
    partsSheet.getRange(1, 1, 1, 6).setValues([
      ['Part Number', 'Description', 'Vendor', 'Unit Cost', 'Category', 'Stock']
    ]);
  }
  
  // Create HW_Assemblies sheet  
  let assembliesSheet = ss.getSheetByName('HW_Assemblies');
  if (!assembliesSheet) {
    assembliesSheet = ss.insertSheet('HW_Assemblies');
    assembliesSheet.getRange(1, 1, 1, 6).setValues([
      ['Assembly Name', 'Components', 'Total Cost', 'Date Created', 'Notes', 'Status']
    ]);
  }
  
  // Create HW_Quotes sheet
  let quotesSheet = ss.getSheetByName('HW_Quotes');
  if (!quotesSheet) {
    quotesSheet = ss.insertSheet('HW_Quotes');
    quotesSheet.getRange(1, 1, 1, 7).setValues([
      ['Quote ID', 'Customer', 'Assemblies', 'Total Cost', 'Date', 'Status', 'Notes']
    ]);
  }
}

function refreshBasicMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 CraftQuote')
    .addItem('📝 Component Assembler', 'openHybridAssembler')
    .addSeparator()
    .addSubMenu(ui.createMenu('🏗️ Hierarchical Workflow')
      .addItem('🚀 Quick Setup', 'quickSetup')
      .addItem('🔍 View Status', 'showBasicStatus'))
    .addToUi();
}

function showBasicStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().map(s => s.getName()).filter(name => name.startsWith('HW_'));
  
  SpreadsheetApp.getUi().alert(
    '📊 HIERARCHICAL WORKFLOW STATUS\n\n' +
    'Found sheets: ' + sheets.join(', ') + '\n\n' +
    (sheets.length >= 3 ? '✅ Basic setup complete!' : '❌ Setup incomplete') +
    '\n\nRun Quick Setup if needed.'
  );
}
