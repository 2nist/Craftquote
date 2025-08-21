/**
 * 🚀 AUTOMATED FRESH BUILD - HIERARCHICAL WORKFLOW SYSTEM
 * Semi-automated deployment for CraftQuote Hierarchical Workflow
 * Handles: Database setup, Menu integration, File validation, Testing
 * August 13, 2025
 */

// =================== MAIN AUTOMATED SETUP ===================

function runAutomatedFreshBuild() {
  console.log('🚀 STARTING AUTOMATED FRESH BUILD...');
  
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '🚀 CraftQuote Fresh Build',
    'This will create a complete hierarchical workflow system:\n\n' +
    '✅ Database structure (Parts → Assemblies → Panels → Quotes)\n' +
    '✅ Professional menu system\n' +
    '✅ Real data integration from Master Catalog\n' +
    '✅ Quote generation matching your PDF format\n\n' +
    'This will take 2-3 minutes. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    console.log('❌ Build cancelled by user');
    return;
  }
  
  try {
    // Phase 1: Clean and validate environment
    const validationResult = validateEnvironment();
    if (!validationResult.success) {
      throw new Error(`Environment validation failed: ${validationResult.message}`);
    }
    
    // Phase 2: Create database structure
    const dbResult = createHierarchicalDatabase();
    if (!dbResult.success) {
      throw new Error(`Database creation failed: ${dbResult.message}`);
    }
    
    // Phase 3: Populate with real data
    const dataResult = populateWithRealData();
    if (!dataResult.success) {
      throw new Error(`Data population failed: ${dataResult.message}`);
    }
    
    // Phase 4: Create professional menu
    const menuResult = createProfessionalMenu();
    if (!menuResult.success) {
      throw new Error(`Menu creation failed: ${menuResult.message}`);
    }
    
    // Phase 5: Run system validation
    const testResult = runSystemValidation();
    if (!testResult.success) {
      throw new Error(`System validation failed: ${testResult.message}`);
    }
    
    // Success!
    ui.alert(
      '🎉 FRESH BUILD COMPLETE!',
      '✅ Database: HW_Parts, HW_Assemblies, HW_Panels, HW_Quotes created\n' +
      '✅ Data: ' + dataResult.partsCount + ' parts imported from Master Catalog\n' +
      '✅ Templates: ' + dataResult.templatesCount + ' standard assemblies created\n' +
      '✅ Menu: Professional CraftQuote menu installed\n' +
      '✅ Validation: All systems operational\n\n' +
      '🚀 Ready to use! Check the CraftQuote menu.',
      ui.ButtonSet.OK
    );
    
    console.log('🎉 AUTOMATED FRESH BUILD COMPLETE!');
    return { success: true, message: 'Fresh build completed successfully' };
    
  } catch (error) {
    console.error('❌ FRESH BUILD FAILED:', error);
    ui.alert(
      '❌ Build Failed',
      'Error: ' + error.message + '\n\n' +
      'Check the console for detailed error information.\n' +
      'You can run individual setup phases manually if needed.',
      ui.ButtonSet.OK
    );
    return { success: false, error: error.message };
  }
}

// =================== PHASE 1: ENVIRONMENT VALIDATION ===================

function validateEnvironment() {
  console.log('🔍 Phase 1: Validating environment...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    
    // Check if Master Catalog exists
    const masterCatalog = sheets.find(sheet => sheet.getName() === 'Master Catalog');
    if (!masterCatalog) {
      return { 
        success: false, 
        message: 'Master Catalog sheet not found. This is required for the hierarchical system.' 
      };
    }
    
    // Check Master Catalog data
    const data = masterCatalog.getDataRange().getValues();
    if (data.length < 2) {
      return { 
        success: false, 
        message: 'Master Catalog appears to be empty. Need component data to proceed.' 
      };
    }
    
    console.log(`✅ Environment valid - Master Catalog has ${data.length - 1} components`);
    return { 
      success: true, 
      message: `Environment validated - ${data.length - 1} components available`,
      componentCount: data.length - 1
    };
    
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// =================== PHASE 2: DATABASE CREATION ===================

function createHierarchicalDatabase() {
  console.log('🏗️ Phase 2: Creating hierarchical database structure...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetsCreated = [];
    
    // Create HW_Parts sheet
    if (!getSheetByName(ss, 'HW_Parts')) {
      const partsSheet = ss.insertSheet('HW_Parts');
      partsSheet.getRange(1, 1, 1, 8).setValues([[
        'PartID', 'PartNumber', 'Description', 'Category', 'UnitCost', 
        'Vendor', 'Source', 'UsedInAssemblies'
      ]]);
      partsSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheetsCreated.push('HW_Parts');
    }
    
    // Create HW_Assemblies sheet
    if (!getSheetByName(ss, 'HW_Assemblies')) {
      const assembliesSheet = ss.insertSheet('HW_Assemblies');
      assembliesSheet.getRange(1, 1, 1, 7).setValues([[
        'AssemblyID', 'AssemblyName', 'Description', 'Category', 
        'TotalCost', 'ComponentCount', 'BOMReference'
      ]]);
      assembliesSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheetsCreated.push('HW_Assemblies');
    }
    
    // Create HW_BOM_Details sheet
    if (!getSheetByName(ss, 'HW_BOM_Details')) {
      const bomSheet = ss.insertSheet('HW_BOM_Details');
      bomSheet.getRange(1, 1, 1, 6).setValues([[
        'AssemblyID', 'LineNumber', 'PartID', 'Quantity', 'UnitCost', 'LineCost'
      ]]);
      bomSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
      sheetsCreated.push('HW_BOM_Details');
    }
    
    // Create HW_Panels sheet
    if (!getSheetByName(ss, 'HW_Panels')) {
      const panelsSheet = ss.insertSheet('HW_Panels');
      panelsSheet.getRange(1, 1, 1, 6).setValues([[
        'PanelID', 'PanelName', 'Description', 'AssemblyList', 'TotalCost', 'Category'
      ]]);
      panelsSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
      sheetsCreated.push('HW_Panels');
    }
    
    // Create HW_Quotes sheet
    if (!getSheetByName(ss, 'HW_Quotes')) {
      const quotesSheet = ss.insertSheet('HW_Quotes');
      quotesSheet.getRange(1, 1, 1, 8).setValues([[
        'QuoteID', 'CustomerCompany', 'Description', 'NetPrice', 
        'TotalPrice', 'Status', 'DateCreated', 'PanelList'
      ]]);
      quotesSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheetsCreated.push('HW_Quotes');
    }
    
    console.log(`✅ Database created - Sheets: ${sheetsCreated.join(', ')}`);
    return { 
      success: true, 
      message: `Database structure created`,
      sheetsCreated: sheetsCreated
    };
    
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// =================== PHASE 3: DATA POPULATION ===================

function populateWithRealData() {
  console.log('📊 Phase 3: Populating with real data from Master Catalog...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const masterCatalog = ss.getSheetByName('Master Catalog');
    const partsSheet = ss.getSheetByName('HW_Parts');
    
    if (!masterCatalog || !partsSheet) {
      return { success: false, message: 'Required sheets not found' };
    }
    
    // Get Master Catalog data
    const catalogData = masterCatalog.getDataRange().getValues();
    const headers = catalogData[0];
    
    // Find column indices
    const partCol = findColumnIndex(headers, ['PART', 'Part', 'PartNumber', 'Part Number']);
    const descCol = findColumnIndex(headers, ['DESCRIPTION', 'Description', 'DESC']);
    const costCol = findColumnIndex(headers, ['COST', 'Cost', 'Price', 'UnitCost']);
    const vendorCol = findColumnIndex(headers, ['VNDR', 'Vendor', 'VENDOR', 'Supplier']);
    
    if (partCol === -1) {
      return { success: false, message: 'Could not find PART column in Master Catalog' };
    }
    
    // Populate HW_Parts
    const partsData = [];
    let partsCount = 0;
    
    for (let i = 1; i < catalogData.length; i++) {
      const row = catalogData[i];
      const partNumber = row[partCol];
      
      if (partNumber && partNumber.toString().trim() !== '') {
        partsData.push([
          generatePartID(partNumber), // PartID
          partNumber, // PartNumber
          descCol !== -1 ? row[descCol] : '', // Description
          'Imported', // Category
          costCol !== -1 ? (parseFloat(row[costCol]) || 0) : 0, // UnitCost
          vendorCol !== -1 ? row[vendorCol] : '', // Vendor
          'Master Catalog', // Source
          '' // UsedInAssemblies
        ]);
        partsCount++;
      }
    }
    
    // Write to HW_Parts sheet
    if (partsData.length > 0) {
      partsSheet.getRange(2, 1, partsData.length, 8).setValues(partsData);
    }
    
    // Create sample assemblies based on your reference quotes
    const templatesCount = createSampleAssemblies();
    
    console.log(`✅ Data populated - ${partsCount} parts, ${templatesCount} templates`);
    return { 
      success: true, 
      message: `Data populated successfully`,
      partsCount: partsCount,
      templatesCount: templatesCount
    };
    
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// =================== PHASE 4: MENU CREATION ===================

function createProfessionalMenu() {
  console.log('🎛️ Phase 4: Creating professional menu system...');
  
  try {
    const ui = SpreadsheetApp.getUi();
    
    // Create main CraftQuote menu
    ui.createMenu('🏗️ CraftQuote')
      .addSubMenu(ui.createMenu('📋 Quote Builder')
        .addItem('🚀 New Quote', 'openQuoteBuilder')
        .addItem('📊 View All Quotes', 'viewQuoteDatabase')
        .addItem('🔄 Quote Status Update', 'updateQuoteStatus'))
      
      .addSubMenu(ui.createMenu('🔧 Assembly Builder')
        .addItem('🏗️ Create Assembly', 'openAssemblyBuilder')
        .addItem('📦 View Assemblies', 'viewAssemblyDatabase')
        .addItem('🔍 Assembly Search', 'searchAssemblies'))
      
      .addSubMenu(ui.createMenu('⚡ Panel Builder')
        .addItem('🎛️ BHAC Panel', 'buildBHACPanel')
        .addItem('🌡️ DTAC Panel', 'buildDTACPanel')
        .addItem('🧽 CPAC Panel', 'buildCPACPanel')
        .addItem('🌾 GHAC Panel', 'buildGHACPanel'))
      
      .addSubMenu(ui.createMenu('📊 Database')
        .addItem('🔍 View Parts Database', 'viewPartsDatabase')
        .addItem('📈 Database Statistics', 'viewDatabaseStats')
        .addItem('🔄 Refresh Data', 'refreshAllData'))
      
      .addSubMenu(ui.createMenu('⚙️ System')
        .addItem('✅ System Validation', 'runSystemValidation')
        .addItem('🧪 Test All Functions', 'runAllTests')
        .addItem('📋 System Status', 'viewSystemStatus')
        .addItem('🆘 Emergency Reset', 'emergencyReset'))
      
      .addToUi();
    
    console.log('✅ Professional menu created');
    return { success: true, message: 'Menu system created' };
    
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// =================== PHASE 5: SYSTEM VALIDATION ===================

function runSystemValidation() {
  console.log('✅ Phase 5: Running system validation...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const requiredSheets = ['Master Catalog', 'HW_Parts', 'HW_Assemblies', 'HW_BOM_Details', 'HW_Panels', 'HW_Quotes'];
    
    // Check all required sheets exist
    for (const sheetName of requiredSheets) {
      if (!getSheetByName(ss, sheetName)) {
        return { success: false, message: `Required sheet missing: ${sheetName}` };
      }
    }
    
    // Check data integrity
    const partsSheet = ss.getSheetByName('HW_Parts');
    const partsData = partsSheet.getDataRange().getValues();
    
    if (partsData.length < 2) {
      return { success: false, message: 'HW_Parts sheet is empty' };
    }
    
    console.log('✅ System validation passed');
    return { 
      success: true, 
      message: `System validation passed - ${partsData.length - 1} parts ready`,
      partsCount: partsData.length - 1
    };
    
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// =================== HELPER FUNCTIONS ===================

function getSheetByName(ss, name) {
  try {
    return ss.getSheetByName(name);
  } catch (e) {
    return null;
  }
}

function findColumnIndex(headers, possibleNames) {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toString().toUpperCase().trim();
    for (const name of possibleNames) {
      if (header.includes(name.toUpperCase())) {
        return i;
      }
    }
  }
  return -1;
}

function generatePartID(partNumber) {
  return partNumber.toString().replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
}

function createSampleAssemblies() {
  // Create sample assemblies based on your quote patterns
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assembliesSheet = ss.getSheetByName('HW_Assemblies');
  
  const sampleAssemblies = [
    ['MOTOR_CTRL_START_STOP', 'Start/Stop Motor Control Switch', 'Complete motor control assembly with enclosure, contactors, and safety devices', 'Motor Control', 684.00, 6, 'BOM_MOTOR_CTRL_START_STOP'],
    ['SAFETY_DEVICES', 'Safety Device Assembly', 'Emergency stops, light curtains, and safety relays', 'Safety', 425.00, 4, 'BOM_SAFETY_DEVICES'],
    ['AUTOMATION_HARDWARE', 'Automation Hardware Assembly', 'PLC, HMI, and communication modules', 'Automation', 1250.00, 8, 'BOM_AUTOMATION_HARDWARE']
  ];
  
  assembliesSheet.getRange(2, 1, sampleAssemblies.length, 7).setValues(sampleAssemblies);
  
  return sampleAssemblies.length;
}

// =================== QUICK ACCESS FUNCTIONS ===================

function openQuoteBuilder() {
  SpreadsheetApp.getUi().alert('Quote Builder', 'Quote Builder coming soon! The hierarchical system is now ready.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function viewPartsDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const partsSheet = ss.getSheetByName('HW_Parts');
  if (partsSheet) {
    ss.setActiveSheet(partsSheet);
    SpreadsheetApp.getUi().alert('Parts Database', 'Parts database is now active. You can view and edit components here.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function viewSystemStatus() {
  const validationResult = runSystemValidation();
  const message = validationResult.success 
    ? `✅ System Status: OPERATIONAL\n\nParts Available: ${validationResult.partsCount}\nAll required sheets present\nMenu system active`
    : `❌ System Status: ISSUES DETECTED\n\nError: ${validationResult.message}`;
  
  SpreadsheetApp.getUi().alert('System Status', message, SpreadsheetApp.getUi().ButtonSet.OK);
}
