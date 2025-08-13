/**
 * HIERARCHICAL WORKFLOW BACKEND
 * Phase 2: Backend Functions for Assembly Builder
 * Supports the hierarchical Parts → Assemblies → Panels → Quotes workflow
 * August 12, 2025
 */

// =================== HIERARCHICAL DATABASE FUNCTIONS ===================

/**
 * Get all parts from HW_Parts sheet for Assembly Builder
 */
function getHierarchicalParts() {
  console.log('🔄 HIERARCHICAL - Getting parts for Assembly Builder...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const partsSheet = ss.getSheetByName('HW_Parts');
    
    if (!partsSheet) {
      // Try to initialize database if parts sheet doesn't exist
      const initResult = initializeHierarchicalDatabase();
      if (!initResult.success) {
        throw new Error('HW_Parts sheet not found and database initialization failed');
      }
      return getHierarchicalParts(); // Retry after initialization
    }
    
    const data = partsSheet.getDataRange().getValues();
    if (data.length < 2) {
      return {
        success: true,
        parts: [],
        message: 'No parts found in HW_Parts sheet'
      };
    }
    
    const headers = data[0];
    const parts = [];
    
    // Column mapping based on HW_Parts sheet structure
    const colMap = {
      partId: 0,        // A - PartID
      partNumber: 1,    // B - PartNumber
      description: 2,   // C - Description
      category: 3,      // D - Category
      subcategory: 4,   // E - Subcategory
      unitCost: 5,      // F - UnitCost
      unit: 6,          // G - Unit
      vendor: 7,        // H - Vendor
      vendorPN: 8,      // I - VendorPN
      specifications: 9, // J - Specifications (JSON)
      usedInAssemblies: 10, // K - UsedInAssemblies
      notes: 11,        // L - Notes
      datasheetLink: 12, // M - DatasheetLink
      lastUpdated: 13,  // N - LastUpdated
      isActive: 14      // O - IsActive
    };
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip inactive parts
      if (row[colMap.isActive] === false) continue;
      
      const part = {
        partId: row[colMap.partId],
        partNumber: row[colMap.partNumber],
        description: row[colMap.description] || '',
        category: row[colMap.category] || 'General',
        subcategory: row[colMap.subcategory] || '',
        unitCost: parseFloat(row[colMap.unitCost]) || 0,
        unit: row[colMap.unit] || 'EA',
        vendor: row[colMap.vendor] || '',
        vendorPN: row[colMap.vendorPN] || '',
        specifications: row[colMap.specifications] || '{}',
        usedInAssemblies: row[colMap.usedInAssemblies] || '',
        notes: row[colMap.notes] || '',
        datasheetLink: row[colMap.datasheetLink] || '',
        lastUpdated: row[colMap.lastUpdated] || '',
        source: 'HW_Parts'
      };
      
      parts.push(part);
    }
    
    console.log(`✅ HIERARCHICAL - Retrieved ${parts.length} parts`);
    
    return {
      success: true,
      parts: parts,
      message: `Found ${parts.length} active parts`
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Error getting parts:', error);
    return {
      success: false,
      error: error.toString(),
      parts: []
    };
  }
}

/**
 * Save a hierarchical assembly to HW_Assemblies sheet
 */
function saveHierarchicalAssembly(assemblyData) {
  console.log('💾 HIERARCHICAL - Saving assembly:', assemblyData);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let assembliesSheet = ss.getSheetByName('HW_Assemblies');
    
    if (!assembliesSheet) {
      // Initialize database if assemblies sheet doesn't exist
      const initResult = initializeHierarchicalDatabase();
      if (!initResult.success) {
        throw new Error('HW_Assemblies sheet not found and database initialization failed');
      }
      assembliesSheet = ss.getSheetByName('HW_Assemblies');
    }
    
    // Check if assembly ID already exists
    const existingData = assembliesSheet.getDataRange().getValues();
    const existingAssemblyIds = existingData.slice(1).map(row => row[0]).filter(id => id);
    
    if (existingAssemblyIds.includes(assemblyData.assemblyId)) {
      throw new Error(`Assembly ID "${assemblyData.assemblyId}" already exists`);
    }
    
    // Save to HW_Assemblies sheet
    const assemblyRow = [
      assemblyData.assemblyId,        // A - AssemblyID
      assemblyData.assemblyName,      // B - AssemblyName
      assemblyData.description,       // C - Description
      assemblyData.category,          // D - Category
      assemblyData.totalCost,         // E - TotalCost
      assemblyData.componentCount,    // F - ComponentCount
      `BOM_${assemblyData.assemblyId}`, // G - BOMReference
      '',                             // H - UsedInPanels (to be updated later)
      JSON.stringify({}),             // I - Configuration (empty for now)
      new Date(),                     // J - CreatedDate
      new Date(),                     // K - ModifiedDate
      'Assembly Builder',             // L - CreatedBy
      false,                          // M - IsStandard (custom assembly)
      true                            // N - IsActive
    ];
    
    assembliesSheet.appendRow(assemblyRow);
    
    // Save detailed BOM to separate sheet or structure
    saveBOMDetails(ss, assemblyData.assemblyId, assemblyData.bomComponents);
    
    // Update parts usage tracking
    updatePartsUsage(ss, assemblyData.bomComponents, assemblyData.assemblyId);
    
    console.log(`✅ HIERARCHICAL - Assembly "${assemblyData.assemblyName}" saved successfully`);
    
    return {
      success: true,
      assemblyId: assemblyData.assemblyId,
      message: `Assembly "${assemblyData.assemblyName}" saved successfully`
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Error saving assembly:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Save BOM details to a dedicated BOM tracking sheet
 */
function saveBOMDetails(ss, assemblyId, bomComponents) {
  console.log('📋 HIERARCHICAL - Saving BOM details for:', assemblyId);
  
  let bomSheet = ss.getSheetByName('HW_BOM_Details');
  if (!bomSheet) {
    bomSheet = ss.insertSheet('HW_BOM_Details');
    
    const headers = [
      'AssemblyID',     // A - Link to assembly
      'LineNumber',     // B - BOM line number
      'PartID',         // C - Part identifier
      'PartNumber',     // D - Part number
      'Description',    // E - Part description
      'Quantity',       // F - Quantity needed
      'UnitCost',       // G - Unit cost
      'LineCost',       // H - Line cost (qty × unit cost)
      'CreatedDate',    // I - When added
      'IsActive'        // J - Active flag
    ];
    
    bomSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    bomSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    bomSheet.getRange(1, 1, 1, headers.length).setBackground('#3d5aa0');
    bomSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    bomSheet.setFrozenRows(1);
  }
  
  // Add BOM components
  bomComponents.forEach((component, index) => {
    const bomRow = [
      assemblyId,                    // AssemblyID
      index + 1,                     // LineNumber
      component.partId,              // PartID
      component.partNumber,          // PartNumber
      component.description,         // Description
      component.quantity,            // Quantity
      component.unitCost,           // UnitCost
      component.totalCost,          // LineCost
      new Date(),                   // CreatedDate
      true                          // IsActive
    ];
    
    bomSheet.appendRow(bomRow);
  });
  
  console.log(`✅ HIERARCHICAL - BOM details saved: ${bomComponents.length} components`);
}

/**
 * Update parts usage tracking in HW_Parts sheet
 */
function updatePartsUsage(ss, bomComponents, assemblyId) {
  console.log('🔄 HIERARCHICAL - Updating parts usage tracking...');
  
  const partsSheet = ss.getSheetByName('HW_Parts');
  if (!partsSheet) return;
  
  const data = partsSheet.getDataRange().getValues();
  const headers = data[0];
  const usedInAssembliesCol = headers.indexOf('UsedInAssemblies'); // Column K
  
  if (usedInAssembliesCol === -1) {
    console.log('⚠️ HIERARCHICAL - UsedInAssemblies column not found');
    return;
  }
  
  bomComponents.forEach(component => {
    // Find the part row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === component.partId) { // Match PartID in column A
        const currentUsage = data[i][usedInAssembliesCol] || '';
        const usageList = currentUsage ? currentUsage.split(',') : [];
        
        if (!usageList.includes(assemblyId)) {
          usageList.push(assemblyId);
          const updatedUsage = usageList.join(',');
          
          partsSheet.getRange(i + 1, usedInAssembliesCol + 1).setValue(updatedUsage);
        }
        break;
      }
    }
  });
  
  console.log('✅ HIERARCHICAL - Parts usage tracking updated');
}

/**
 * Get all hierarchical assemblies
 */
function getHierarchicalAssemblies() {
  console.log('🔄 HIERARCHICAL - Getting assemblies...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const assembliesSheet = ss.getSheetByName('HW_Assemblies');
    
    if (!assembliesSheet) {
      return {
        success: true,
        assemblies: [],
        message: 'No assemblies sheet found'
      };
    }
    
    const data = assembliesSheet.getDataRange().getValues();
    if (data.length < 2) {
      return {
        success: true,
        assemblies: [],
        message: 'No assemblies found'
      };
    }
    
    const assemblies = [];
    
    // Column mapping based on HW_Assemblies sheet structure
    const colMap = {
      assemblyId: 0,      // A - AssemblyID
      assemblyName: 1,    // B - AssemblyName
      description: 2,     // C - Description
      category: 3,        // D - Category
      totalCost: 4,       // E - TotalCost
      componentCount: 5,  // F - ComponentCount
      bomReference: 6,    // G - BOMReference
      usedInPanels: 7,    // H - UsedInPanels
      configuration: 8,   // I - Configuration
      createdDate: 9,     // J - CreatedDate
      modifiedDate: 10,   // K - ModifiedDate
      createdBy: 11,      // L - CreatedBy
      isStandard: 12,     // M - IsStandard
      isActive: 13        // N - IsActive
    };
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip inactive assemblies
      if (row[colMap.isActive] === false) continue;
      
      const assembly = {
        assemblyId: row[colMap.assemblyId],
        assemblyName: row[colMap.assemblyName],
        description: row[colMap.description] || '',
        category: row[colMap.category] || 'General',
        totalCost: parseFloat(row[colMap.totalCost]) || 0,
        componentCount: parseInt(row[colMap.componentCount]) || 0,
        bomReference: row[colMap.bomReference] || '',
        usedInPanels: row[colMap.usedInPanels] || '',
        configuration: row[colMap.configuration] || '{}',
        createdDate: row[colMap.createdDate] || '',
        modifiedDate: row[colMap.modifiedDate] || '',
        createdBy: row[colMap.createdBy] || '',
        isStandard: row[colMap.isStandard] || false,
        source: 'HW_Assemblies'
      };
      
      assemblies.push(assembly);
    }
    
    console.log(`✅ HIERARCHICAL - Retrieved ${assemblies.length} assemblies`);
    
    return {
      success: true,
      assemblies: assemblies,
      message: `Found ${assemblies.length} active assemblies`
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Error getting assemblies:', error);
    return {
      success: false,
      error: error.toString(),
      assemblies: []
    };
  }
}

/**
 * Get BOM details for a specific assembly
 */
function getAssemblyBOM(assemblyId) {
  console.log('📋 HIERARCHICAL - Getting BOM for assembly:', assemblyId);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const bomSheet = ss.getSheetByName('HW_BOM_Details');
    
    if (!bomSheet) {
      return {
        success: true,
        bomComponents: [],
        message: 'No BOM details sheet found'
      };
    }
    
    const data = bomSheet.getDataRange().getValues();
    if (data.length < 2) {
      return {
        success: true,
        bomComponents: [],
        message: 'No BOM details found'
      };
    }
    
    const bomComponents = [];
    
    // Column mapping for HW_BOM_Details sheet
    const colMap = {
      assemblyId: 0,     // A - AssemblyID
      lineNumber: 1,     // B - LineNumber
      partId: 2,         // C - PartID
      partNumber: 3,     // D - PartNumber
      description: 4,    // E - Description
      quantity: 5,       // F - Quantity
      unitCost: 6,       // G - UnitCost
      lineCost: 7,       // H - LineCost
      createdDate: 8,    // I - CreatedDate
      isActive: 9        // J - IsActive
    };
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip if not for this assembly or inactive
      if (row[colMap.assemblyId] !== assemblyId || row[colMap.isActive] === false) {
        continue;
      }
      
      const bomComponent = {
        lineNumber: parseInt(row[colMap.lineNumber]) || 0,
        partId: row[colMap.partId],
        partNumber: row[colMap.partNumber],
        description: row[colMap.description] || '',
        quantity: parseInt(row[colMap.quantity]) || 0,
        unitCost: parseFloat(row[colMap.unitCost]) || 0,
        lineCost: parseFloat(row[colMap.lineCost]) || 0,
        createdDate: row[colMap.createdDate] || ''
      };
      
      bomComponents.push(bomComponent);
    }
    
    // Sort by line number
    bomComponents.sort((a, b) => a.lineNumber - b.lineNumber);
    
    console.log(`✅ HIERARCHICAL - Retrieved ${bomComponents.length} BOM components for ${assemblyId}`);
    
    return {
      success: true,
      bomComponents: bomComponents,
      message: `Found ${bomComponents.length} BOM components`
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Error getting BOM:', error);
    return {
      success: false,
      error: error.toString(),
      bomComponents: []
    };
  }
}

/**
 * Get hierarchical database status and statistics
 */
function getHierarchicalDatabaseStatus() {
  console.log('📊 HIERARCHICAL - Getting database status...');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const requiredSheets = ['HW_Parts', 'HW_Assemblies', 'HW_Panels', 'HW_Projects', 'HW_Quotes'];
    
    const status = {
      initialized: true,
      sheets: {},
      summary: {},
      details: {}
    };
    
    requiredSheets.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        const rowCount = sheet.getLastRow() - 1; // Exclude header
        const colCount = sheet.getLastColumn();
        
        status.sheets[sheetName] = {
          exists: true,
          records: rowCount,
          columns: colCount,
          lastModified: sheet.getLastRow() > 1 ? 
            sheet.getRange(sheet.getLastRow(), 1).getValue() : null
        };
      } else {
        status.sheets[sheetName] = {
          exists: false,
          records: 0,
          columns: 0
        };
        status.initialized = false;
      }
    });
    
    // Calculate summary statistics
    status.summary = {
      partsCount: status.sheets['HW_Parts']?.records || 0,
      assembliesCount: status.sheets['HW_Assemblies']?.records || 0,
      panelsCount: status.sheets['HW_Panels']?.records || 0,
      projectsCount: status.sheets['HW_Projects']?.records || 0,
      quotesCount: status.sheets['HW_Quotes']?.records || 0
    };
    
    // Additional details
    const bomSheet = ss.getSheetByName('HW_BOM_Details');
    status.details.bomDetailsCount = bomSheet ? (bomSheet.getLastRow() - 1) : 0;
    
    console.log('✅ HIERARCHICAL - Database status retrieved:', status.summary);
    
    return {
      success: true,
      status: status,
      message: `Database ${status.initialized ? 'ready' : 'needs initialization'}`
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Error getting status:', error);
    return {
      success: false,
      error: error.toString(),
      status: null
    };
  }
}

/**
 * Open the Hierarchical Assembly Builder interface
 */
function openHierarchicalAssemblyBuilder() {
  console.log('🏗️ HIERARCHICAL - Opening Assembly Builder...');
  
  try {
    const htmlOutput = HtmlService.createTemplateFromFile('HierarchicalAssemblyBuilder');
    const html = htmlOutput.evaluate()
      .setWidth(1400)
      .setHeight(800)
      .setTitle('🏗️ Hierarchical Assembly Builder - Parts → Assemblies → Panels → Quotes');
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Hierarchical Assembly Builder');
    
    return {
      success: true,
      message: 'Assembly Builder opened successfully'
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Error opening Assembly Builder:', error);
    SpreadsheetApp.getUi().alert(
      'Error Opening Assembly Builder\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'Please check the console logs for more details.'
    );
    
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test hierarchical workflow functions
 */
function testHierarchicalWorkflow() {
  console.log('🧪 HIERARCHICAL - Running workflow tests...');
  
  try {
    // Test 1: Check database status
    console.log('Test 1: Database Status');
    const statusResult = getHierarchicalDatabaseStatus();
    console.log('Status Result:', statusResult);
    
    // Test 2: Initialize database if needed
    if (!statusResult.status?.initialized) {
      console.log('Test 2: Initialize Database');
      const initResult = initializeHierarchicalDatabase();
      console.log('Init Result:', initResult);
    }
    
    // Test 3: Get parts
    console.log('Test 3: Get Parts');
    const partsResult = getHierarchicalParts();
    console.log('Parts Result:', { success: partsResult.success, count: partsResult.parts?.length });
    
    // Test 4: Get assemblies
    console.log('Test 4: Get Assemblies');
    const assembliesResult = getHierarchicalAssemblies();
    console.log('Assemblies Result:', { success: assembliesResult.success, count: assembliesResult.assemblies?.length });
    
    const testResults = {
      databaseStatus: statusResult.success,
      partsAvailable: partsResult.success && partsResult.parts.length > 0,
      assembliesAvailable: assembliesResult.success,
      overallStatus: 'Tests completed'
    };
    
    console.log('✅ HIERARCHICAL - Test results:', testResults);
    
    SpreadsheetApp.getUi().alert(
      'Hierarchical Workflow Test Results\n\n' +
      `Database Status: ${testResults.databaseStatus ? '✅ Ready' : '❌ Issues'}\n` +
      `Parts Available: ${testResults.partsAvailable ? '✅ ' + partsResult.parts.length : '❌ None'}\n` +
      `Assemblies Ready: ${testResults.assembliesAvailable ? '✅ Ready' : '❌ Issues'}\n\n` +
      'Check console logs for detailed results.'
    );
    
    return testResults;
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Test failed:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
