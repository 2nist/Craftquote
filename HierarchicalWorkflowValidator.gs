/**
 * HIERARCHICAL WORKFLOW VALIDATION
 * Test script to validate the complete Parts → Assemblies → Panels → Quotes workflow
 * August 12, 2025
 */

/**
 * Complete workflow validation and demonstration
 */
function validateHierarchicalWorkflow() {
  console.log('🚀 HIERARCHICAL WORKFLOW - Starting complete validation...');
  
  const results = {
    phase1_database: false,
    phase2_parts: false,
    phase3_assemblies: false,
    phase4_quotes: false,
    overall: false
  };
  
  try {
    // Phase 1: Initialize Database
    console.log('📊 Phase 1: Database Initialization...');
    const dbResult = testDatabaseInitialization();
    results.phase1_database = dbResult.success;
    
    if (!results.phase1_database) {
      throw new Error('Database initialization failed: ' + dbResult.error);
    }
    
    // Phase 2: Test Parts System
    console.log('🔧 Phase 2: Parts System...');
    const partsResult = testPartsSystem();
    results.phase2_parts = partsResult.success;
    
    // Phase 3: Test Assembly System
    console.log('🏗️ Phase 3: Assembly System...');
    const assemblyResult = testAssemblySystem();
    results.phase3_assemblies = assemblyResult.success;
    
    // Phase 4: Test Quote Generation
    console.log('📋 Phase 4: Quote Generation...');
    const quoteResult = testQuoteSystem();
    results.phase4_quotes = quoteResult.success;
    
    // Overall assessment
    results.overall = results.phase1_database && 
                     results.phase2_parts && 
                     results.phase3_assemblies && 
                     results.phase4_quotes;
    
    console.log('✅ HIERARCHICAL WORKFLOW - Validation completed:', results);
    
    // Show results to user
    const ui = SpreadsheetApp.getUi();
    let message = '🚀 Hierarchical Workflow Validation Results\n\n';
    message += `📊 Database Setup: ${results.phase1_database ? '✅' : '❌'}\n`;
    message += `🔧 Parts System: ${results.phase2_parts ? '✅' : '❌'}\n`;
    message += `🏗️ Assembly System: ${results.phase3_assemblies ? '✅' : '❌'}\n`;
    message += `📋 Quote Generation: ${results.phase4_quotes ? '✅' : '❌'}\n\n`;
    
    if (results.overall) {
      message += '🎉 SUCCESS: Complete workflow is ready!\n\n';
      message += 'You can now use:\n';
      message += '• 🏗️ Hierarchical Workflow → Assembly Builder\n';
      message += '• 📋 Hierarchical Workflow → Quote Generator\n';
      message += '• 📊 Hierarchical Workflow → View Database Status\n';
    } else {
      message += '⚠️ Some components need attention.\n';
      message += 'Check console logs for details.';
    }
    
    ui.alert('Workflow Validation', message, ui.ButtonSet.OK);
    
    return results;
    
  } catch (error) {
    console.error('❌ HIERARCHICAL WORKFLOW - Validation failed:', error);
    
    SpreadsheetApp.getUi().alert(
      'Validation Failed',
      'Hierarchical workflow validation encountered an error:\n\n' + error.toString(),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
    return results;
  }
}

/**
 * Test database initialization
 */
function testDatabaseInitialization() {
  console.log('🔄 Testing database initialization...');
  
  try {
    // Test if initialization function exists
    if (typeof initializeHierarchicalDatabase !== 'function') {
      throw new Error('initializeHierarchicalDatabase function not found');
    }
    
    // Run initialization
    const result = initializeHierarchicalDatabase();
    
    if (result.success) {
      console.log('✅ Database initialization successful');
      
      // Verify all required sheets exist
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const requiredSheets = ['HW_Parts', 'HW_Assemblies', 'HW_Panels', 'HW_Projects', 'HW_Quotes'];
      const missingSheets = [];
      
      requiredSheets.forEach(sheetName => {
        if (!ss.getSheetByName(sheetName)) {
          missingSheets.push(sheetName);
        }
      });
      
      if (missingSheets.length > 0) {
        throw new Error(`Missing sheets after initialization: ${missingSheets.join(', ')}`);
      }
      
      return { success: true, message: 'Database initialized with all required sheets' };
    } else {
      throw new Error(result.error || 'Database initialization returned false');
    }
    
  } catch (error) {
    console.error('❌ Database initialization test failed:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Test parts system
 */
function testPartsSystem() {
  console.log('🔄 Testing parts system...');
  
  try {
    // Test if parts function exists
    if (typeof getHierarchicalParts !== 'function') {
      throw new Error('getHierarchicalParts function not found');
    }
    
    // Get parts
    const result = getHierarchicalParts();
    
    if (result.success) {
      console.log(`✅ Parts system working: ${result.parts.length} parts found`);
      
      if (result.parts.length === 0) {
        console.log('⚠️ No parts found - this may be expected if Master Catalog is empty');
      }
      
      return { success: true, partsCount: result.parts.length };
    } else {
      throw new Error(result.error || 'Parts system returned false');
    }
    
  } catch (error) {
    console.error('❌ Parts system test failed:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Test assembly system
 */
function testAssemblySystem() {
  console.log('🔄 Testing assembly system...');
  
  try {
    // Test if assembly functions exist
    if (typeof getHierarchicalAssemblies !== 'function') {
      throw new Error('getHierarchicalAssemblies function not found');
    }
    
    if (typeof saveHierarchicalAssembly !== 'function') {
      throw new Error('saveHierarchicalAssembly function not found');
    }
    
    // Get existing assemblies
    const result = getHierarchicalAssemblies();
    
    if (result.success) {
      console.log(`✅ Assembly system working: ${result.assemblies.length} assemblies found`);
      return { success: true, assembliesCount: result.assemblies.length };
    } else {
      throw new Error(result.error || 'Assembly system returned false');
    }
    
  } catch (error) {
    console.error('❌ Assembly system test failed:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Test quote system
 */
function testQuoteSystem() {
  console.log('🔄 Testing quote system...');
  
  try {
    // Test if quote functions exist
    if (typeof generateHierarchicalQuote !== 'function') {
      throw new Error('generateHierarchicalQuote function not found');
    }
    
    // We don't actually generate a test quote here to avoid cluttering the database
    // Just verify the function exists and basic structure is ready
    console.log('✅ Quote system functions available');
    
    // Check if HW_Quotes sheet exists
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const quotesSheet = ss.getSheetByName('HW_Quotes');
    
    if (!quotesSheet) {
      throw new Error('HW_Quotes sheet not found');
    }
    
    console.log('✅ Quote system ready');
    return { success: true, message: 'Quote system ready' };
    
  } catch (error) {
    console.error('❌ Quote system test failed:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Quick demo of the complete workflow
 */
function demonstrateHierarchicalWorkflow() {
  console.log('🎬 HIERARCHICAL WORKFLOW - Starting demonstration...');
  
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Workflow Demonstration',
    'This will demonstrate the complete Parts → Assemblies → Panels → Quotes workflow.\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    // Step 1: Validate system
    console.log('Step 1: Validating system...');
    const validationResult = validateHierarchicalWorkflow();
    
    if (!validationResult.overall) {
      throw new Error('System validation failed - see validation results');
    }
    
    // Step 2: Show database status
    console.log('Step 2: Showing database status...');
    const statusResult = getHierarchicalDatabaseStatus();
    
    if (statusResult.success) {
      const summary = statusResult.status.summary;
      let statusMessage = '📊 Current Database Status:\n\n';
      statusMessage += `🔧 Parts: ${summary.partsCount}\n`;
      statusMessage += `🏗️ Assemblies: ${summary.assembliesCount}\n`;
      statusMessage += `⚡ Panels: ${summary.panelsCount}\n`;
      statusMessage += `📋 Projects: ${summary.projectsCount}\n`;
      statusMessage += `💰 Quotes: ${summary.quotesCount}\n\n`;
      statusMessage += 'Next: Open Assembly Builder to create assemblies!';
      
      ui.alert('Database Status', statusMessage, ui.ButtonSet.OK);
    }
    
    // Step 3: Offer to open Assembly Builder
    const openBuilder = ui.alert(
      'Next Step',
      'Would you like to open the Assembly Builder now?\n\n' +
      'This will allow you to:\n' +
      '• Select parts from Master Catalog\n' +
      '• Create assemblies with BOM\n' +
      '• Save for use in quotes',
      ui.ButtonSet.YES_NO
    );
    
    if (openBuilder === ui.Button.YES) {
      openHierarchicalAssemblyBuilder();
    }
    
    console.log('✅ HIERARCHICAL WORKFLOW - Demonstration completed');
    
  } catch (error) {
    console.error('❌ HIERARCHICAL WORKFLOW - Demonstration failed:', error);
    ui.alert('Demonstration Error', error.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Show workflow help and getting started guide
 */
function showHierarchicalWorkflowHelp() {
  const ui = SpreadsheetApp.getUi();
  
  const helpMessage = `🏗️ Hierarchical Workflow System Help

WORKFLOW OVERVIEW:
Parts → Assemblies → Panels → Quotes

🔧 PARTS:
• Individual components from Master Catalog
• Motors, PLCs, enclosures, sensors, etc.
• Managed in HW_Parts sheet

🏗️ ASSEMBLIES:
• Groups of parts working together
• "Motor Control Switch", "Safety Devices", etc.
• Created using Assembly Builder
• Saved with detailed BOM

⚡ PANELS:
• Complete control systems
• BHAC, DTAC, GHAC panel types
• Combine multiple assemblies
• Defined in HW_Panels sheet

📋 QUOTES:
• Final customer proposals
• Match your PDF format exactly
• Generated from selected assemblies/panels
• Saved with full traceability

GETTING STARTED:
1. Use "Initialize Database" (if not done)
2. Populate Master Catalog with components
3. Use "Assembly Builder" to create assemblies
4. Use "Quote Generator" for customer quotes

MENU LOCATIONS:
🔧 CraftQuote → 🏗️ Hierarchical Workflow

Need help? Check the console logs for detailed information.`;

  ui.alert('Hierarchical Workflow Help', helpMessage, ui.ButtonSet.OK);
}
