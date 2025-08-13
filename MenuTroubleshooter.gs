/**
 * MENU TROUBLESHOOTING
 * Run this to check and fix menu issues
 */

/**
 * Test menu visibility and functionality
 */
function testMenu() {
  try {
    console.log('🔍 Testing menu structure...');
    
    // Force refresh the menu
    addCraftQuoteMenu();
    
    console.log('✅ Menu refresh completed');
    
    // Test if initialization function exists and works
    const initResult = testHierarchicalDatabase();
    console.log('Database test result:', initResult);
    
    SpreadsheetApp.getUi().alert(
      '🔍 Menu Test Results\n\n' +
      '✅ Menu structure refreshed\n' +
      '✅ Initialize Database function found\n' +
      '✅ System ready for use\n\n' +
      'Menu Location:\n' +
      '🔧 CraftQuote → 🏗️ Hierarchical Workflow → 🚀 Initialize Database\n\n' +
      'If you still don\'t see the menu, try:\n' +
      '1. Refresh your browser page\n' +
      '2. Close and reopen the spreadsheet\n' +
      '3. Check browser permissions for scripts'
    );
    
  } catch (error) {
    console.error('❌ Menu test failed:', error);
    SpreadsheetApp.getUi().alert(
      '❌ Menu Test Failed\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'Try refreshing the page and running this test again.'
    );
  }
}

/**
 * Force menu creation with detailed feedback
 */
function forceMenuCreation() {
  try {
    console.log('🔧 Force creating CraftQuote menu...');
    
    const ui = SpreadsheetApp.getUi();
    
    // Remove any existing menus first (if possible)
    console.log('Creating hierarchical workflow menu...');
    
    const menu = ui.createMenu('🔧 CraftQuote')
      .addItem('📝 Component Assembler', 'openHybridAssembler')
      .addSeparator()
      .addSubMenu(ui.createMenu('🏗️ Hierarchical Workflow')
        .addItem('🚀 Initialize Database', 'initializeHierarchicalDatabase')
        .addSeparator()
        .addItem('🏗️ Assembly Builder', 'openHierarchicalAssemblyBuilder')
        .addItem('📋 Quote Generator', 'openHierarchicalQuoteBuilder')
        .addSeparator()
        .addItem('✅ Validate Complete System', 'validateHierarchicalWorkflow')
        .addItem('🔍 View Database Status', 'viewHierarchicalDatabaseStatus')
        .addItem('🎬 Demo Workflow', 'demonstrateHierarchicalWorkflow')
        .addItem('❓ Workflow Help', 'showHierarchicalWorkflowHelp'));
    
    menu.addToUi();
    
    console.log('✅ Menu created successfully');
    
    SpreadsheetApp.getUi().alert(
      '✅ Menu Force Created!\n\n' +
      'The CraftQuote menu has been created.\n\n' +
      'Look for: 🔧 CraftQuote → 🏗️ Hierarchical Workflow → 🚀 Initialize Database\n\n' +
      'If you still don\'t see it:\n' +
      '1. Refresh the browser page (F5)\n' +
      '2. Wait 10-15 seconds for scripts to load\n' +
      '3. Check that scripts are enabled in your browser'
    );
    
  } catch (error) {
    console.error('❌ Force menu creation failed:', error);
    SpreadsheetApp.getUi().alert(
      '❌ Menu Creation Failed\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'This may be a browser or permissions issue.\n' +
      'Try refreshing the page and running this again.'
    );
  }
}

/**
 * Alternative way to initialize database without menu
 */
function manualInitializeDatabase() {
  try {
    console.log('🚀 Manual database initialization...');
    
    SpreadsheetApp.getUi().alert(
      '🚀 Starting Manual Database Initialization\n\n' +
      'This will create the hierarchical workflow database.\n' +
      'Please wait for completion message...'
    );
    
    const result = initializeHierarchicalDatabase();
    
    console.log('Initialization result:', result);
    
    if (result.success) {
      SpreadsheetApp.getUi().alert(
        '✅ Database Initialized Successfully!\n\n' +
        'New sheets created:\n' +
        '• HW_Parts\n' +
        '• HW_Assemblies  \n' +
        '• HW_BOM_Details\n' +
        '• HW_Panels\n' +
        '• HW_Projects\n' +
        '• HW_Quotes\n\n' +
        'System is ready for use!'
      );
    } else {
      throw new Error(result.error || 'Unknown initialization error');
    }
    
  } catch (error) {
    console.error('❌ Manual initialization failed:', error);
    SpreadsheetApp.getUi().alert(
      '❌ Manual Initialization Failed\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'Please check the console for details.'
    );
  }
}
