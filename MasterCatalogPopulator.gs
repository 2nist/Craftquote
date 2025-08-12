/**
 * MASTER CATALOG POPULATOR
 * Populates Master Catalog with essential components for Hybrid Component Assembler
 * This ensures your templates have real data to work with
 */

/**
 * Main function to populate Master Catalog with all template components
 */
function populateMasterCatalogForTemplates() {
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
  const essentialComponents = getAllTemplateComponents();
  
  console.log(`🎯 POPULATOR - Found ${essentialComponents.length} components to add`);
  
  // Add components to Master Catalog
  let addedCount = 0;
  essentialComponents.forEach(component => {
    if (addComponentToMasterCatalog(masterCatalogSheet, component)) {
      addedCount++;
    }
  });
  
  console.log(`🎯 POPULATOR - Added ${addedCount} components to Master Catalog`);
  
  // Format the sheet
  formatMasterCatalogSheet(masterCatalogSheet);
  
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
 * Get all components from all templates
 */
function getAllTemplateComponents() {
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
 * Add component to Master Catalog if it doesn't exist
 */
function addComponentToMasterCatalog(sheet, component) {
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
 * Format Master Catalog sheet for better readability
 */
function formatMasterCatalogSheet(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  // Header formatting
  sheet.getRange(1, 1, 1, lastCol)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let col = 1; col <= lastCol; col++) {
    sheet.autoResizeColumn(col);
  }
  
  // Format price columns as currency
  if (lastRow > 1) {
    sheet.getRange(2, 7, lastRow - 1, 1).setNumberFormat('$#,##0.00'); // COST column
  }
  
  // Add borders
  sheet.getRange(1, 1, lastRow, lastCol).setBorder(true, true, true, true, true, true);
  
  console.log('🎯 POPULATOR - Master Catalog formatted');
}

/**
 * Quick test function to populate just BHAC components
 */
function populateBHACComponents() {
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
 * Add the missing testBackendConnection function
 */
function testBackendConnection() {
  console.log('🎯 BACKEND TEST - Function called successfully!');
  console.log('🎯 BACKEND TEST - Current time:', new Date().toISOString());
  console.log('🎯 BACKEND TEST - Active spreadsheet:', SpreadsheetApp.getActiveSpreadsheet().getName());
  return {
    success: true,
    message: 'Backend connection successful!',
    timestamp: new Date().toISOString(),
    spreadsheet: SpreadsheetApp.getActiveSpreadsheet().getName()
  };
}
