/**
 * COMPLETE MANUAL SETUP
 * Run this function directly if menu is not visible
 */

function completeManualSetup() {
  console.log('🚀 Starting complete manual setup...');
  
  try {
    SpreadsheetApp.getUi().alert(
      '🚀 MANUAL SETUP STARTING\n\n' +
      'This will:\n' +
      '✅ Initialize hierarchical database\n' +
      '✅ Create all required sheets\n' +
      '✅ Populate with data\n' +
      '✅ Set up menu system\n\n' +
      'Please click OK to continue...'
    );
    
    // Step 1: Initialize database
    console.log('Step 1: Database initialization...');
    const dbResult = initializeHierarchicalDatabase();
    
    if (!dbResult.success) {
      throw new Error('Database initialization failed: ' + dbResult.error);
    }
    
    // Step 2: Create/refresh menu
    console.log('Step 2: Menu creation...');
    addCraftQuoteMenu();
    
    // Step 3: Validate system
    console.log('Step 3: System validation...');
    const status = getHierarchicalDatabaseStatus();
    
    console.log('Final status:', status);
    
    SpreadsheetApp.getUi().alert(
      '🎉 SETUP COMPLETE!\n\n' +
      '✅ Database initialized successfully\n' +
      '✅ Created ' + status.summary.partsCount + ' parts\n' +
      '✅ Created ' + status.summary.assembliesCount + ' assemblies\n' +
      '✅ Created ' + status.summary.panelsCount + ' panels\n' +
      '✅ Menu system ready\n\n' +
      'NEXT STEPS:\n' +
      '1. Look for "🔧 CraftQuote" menu at top\n' +
      '2. Go to: 🏗️ Hierarchical Workflow\n' +
      '3. Try: 🏗️ Assembly Builder\n' +
      '4. Try: 📋 Quote Generator\n\n' +
      'System is ready for production use!'
    );
    
    return {
      success: true,
      message: 'Complete manual setup successful',
      status: status
    };
    
  } catch (error) {
    console.error('❌ Complete manual setup failed:', error);
    SpreadsheetApp.getUi().alert(
      '❌ SETUP FAILED\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'Please:\n' +
      '1. Check the console log for details\n' +
      '2. Try refreshing the page\n' +
      '3. Make sure scripts are enabled\n' +
      '4. Contact support if issue persists'
    );
    
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Quick status check - run this to see current state
 */
function quickStatusCheck() {
  try {
    console.log('🔍 Checking system status...');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets().map(sheet => sheet.getName());
    
    console.log('Current sheets:', sheets);
    
    const hwSheets = sheets.filter(name => name.startsWith('HW_'));
    const hasHierarchicalSheets = hwSheets.length > 0;
    
    let message = '📊 SYSTEM STATUS CHECK\n\n';
    
    if (hasHierarchicalSheets) {
      message += '✅ Hierarchical sheets found:\n';
      hwSheets.forEach(sheet => {
        const sheetObj = ss.getSheetByName(sheet);
        const rowCount = sheetObj.getLastRow() - 1;
        message += `• ${sheet}: ${rowCount} records\n`;
      });
      message += '\n🎯 SYSTEM IS READY!\n';
      message += 'Look for menu: 🔧 CraftQuote → 🏗️ Hierarchical Workflow';
    } else {
      message += '❌ No hierarchical sheets found\n';
      message += 'System needs initialization.\n\n';
      message += '🔧 NEXT STEP:\n';
      message += 'Run function: completeManualSetup';
    }
    
    console.log(message);
    SpreadsheetApp.getUi().alert(message);
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
    SpreadsheetApp.getUi().alert('❌ Status check failed: ' + error.toString());
  }
}
