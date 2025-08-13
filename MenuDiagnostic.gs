/**
 * MENU DIAGNOSTIC TOOL
 * Run this to diagnose menu issues
 */

function diagnosePage() {
  try {
    console.log('🔍 Starting menu diagnostics...');
    
    // Test if functions exist
    const functions = [
      'quickSetup',
      'showBasicStatus', 
      'importMasterCatalog',
      'buildAssemblyDatabaseFromBOMs',
      'analyzeAllBOMPatterns',
      'openSmartAssemblyBuilder',
      'quickRecallDTAC'
    ];
    
    console.log('Testing function availability:');
    functions.forEach(funcName => {
      try {
        if (typeof eval(funcName) === 'function') {
          console.log(`✅ ${funcName} - FOUND`);
        } else {
          console.log(`❌ ${funcName} - NOT A FUNCTION`);
        }
      } catch (error) {
        console.log(`❌ ${funcName} - ERROR: ${error.message}`);
      }
    });
    
    // Test menu creation
    console.log('\n🔍 Testing menu creation...');
    try {
      refreshBasicMenu();
      console.log('✅ Menu creation succeeded');
    } catch (menuError) {
      console.log('❌ Menu creation failed:', menuError.message);
    }
    
    // Test spreadsheet access
    console.log('\n🔍 Testing spreadsheet access...');
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      console.log('✅ Spreadsheet found:', ss.getName());
      
      const sheets = ss.getSheets().map(s => s.getName());
      console.log('📋 Available sheets:', sheets.join(', '));
      
    } catch (ssError) {
      console.log('❌ Spreadsheet access failed:', ssError.message);
    }
    
    console.log('\n✅ Diagnostics complete - check console output');
    
  } catch (error) {
    console.error('❌ Diagnostics failed:', error.toString());
  }
}

/**
 * FORCE MENU REFRESH
 */
function forceMenuRefresh() {
  try {
    console.log('🔄 Force refreshing menu...');
    
    const ui = SpreadsheetApp.getUi();
    
    // Create simple basic menu first
    ui.createMenu('🔧 CraftQuote')
      .addItem('🧪 Test Function', 'testBasicFunction')
      .addSeparator()
      .addSubMenu(ui.createMenu('🏗️ Hierarchical Workflow')
        .addItem('🚀 Quick Setup', 'quickSetup')
        .addItem('🔍 View Status', 'showBasicStatus'))
      .addToUi();
      
    console.log('✅ Basic menu created');
    
    SpreadsheetApp.getUi().alert('✅ Menu refreshed!\n\nCheck for 🔧 CraftQuote menu');
    
  } catch (error) {
    console.error('❌ Force refresh failed:', error.toString());
    SpreadsheetApp.getUi().alert('Menu refresh failed: ' + error.toString());
  }
}

function testBasicFunction() {
  SpreadsheetApp.getUi().alert('✅ Basic function test successful!\n\nYour Apps Script setup is working.');
}
