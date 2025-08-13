/**
 * HIERARCHICAL WORKFLOW BUILDER
 * Phase 1: Database Foundation Enhancement
 * Implements Parts → Assemblies → Panels → Quotes workflow
 * Based on reference analysis from user's quote screenshots
 * August 12, 2025
 */

// =================== PHASE 1: DATABASE FOUNDATION ===================

/**
 * Initialize the enhanced hierarchical database structure
 * Builds upon existing Master Catalog and Product_Templates
 */
function initializeHierarchicalDatabase() {
  console.log('🏗️ HIERARCHICAL - Initializing enhanced database structure...');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    // Create new sheets for hierarchical workflow
    createPartsSheet(ss);
    createAssembliesSheet(ss);
    createBOMDetailsSheet(ss);
    createPanelsSheet(ss);
    createProjectsSheet(ss);
    createQuotesSheet(ss);
    
    // Populate with reference data from user's attachments
    populatePartsFromMasterCatalog(ss);
    populateAssembliesFromReference(ss);
    populatePanelsFromCatalog(ss);
    
    console.log('✅ HIERARCHICAL - Database structure initialized successfully');
    
    SpreadsheetApp.getUi().alert(
      'Hierarchical Workflow Initialized!\n\n' +
      '✅ Parts database enhanced\n' +
      '✅ Assemblies structure created\n' +
      '✅ Panel configurations ready\n' +
      '✅ Project tracking enabled\n' +
      '✅ Quote generation prepared\n\n' +
      'System now supports Parts → Assemblies → Panels → Quotes workflow!'
    );
    
    return {
      success: true,
      message: 'Hierarchical workflow database initialized',
      sheetsCreated: ['HW_Parts', 'HW_Assemblies', 'HW_Panels', 'HW_Projects', 'HW_Quotes']
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL - Database initialization failed:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Create enhanced Parts sheet - individual components
 */
function createPartsSheet(ss) {
  let partsSheet = ss.getSheetByName('HW_Parts');
  if (!partsSheet) {
    partsSheet = ss.insertSheet('HW_Parts');
    
    const headers = [
      'PartID',           // A - Unique identifier (e.g., "IDEC FC6A")
      'PartNumber',       // B - Manufacturer part number  
      'Description',      // C - Full description
      'Category',         // D - Control Systems, Motor Control, etc.
      'Subcategory',      // E - PLC, VFD, Enclosure, etc.
      'UnitCost',         // F - Base unit cost
      'Unit',             // G - EA, FT, etc.
      'Vendor',           // H - Primary vendor
      'VendorPN',         // I - Vendor part number
      'Specifications',   // J - JSON: voltage, phase, amps, etc.
      'UsedInAssemblies', // K - List of assemblies using this part
      'Notes',            // L - Technical notes
      'DatasheetLink',    // M - Link to documentation
      'LastUpdated',      // N - Last price/spec update
      'IsActive'          // O - Active flag
    ];
    
    partsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    partsSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    partsSheet.getRange(1, 1, 1, headers.length).setBackground('#1f4e79');
    partsSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    partsSheet.setFrozenRows(1);
    
    console.log('✅ HIERARCHICAL - HW_Parts sheet created');
  }
  return partsSheet;
}

/**
 * Create Assemblies sheet - groupings of parts
 */
function createAssembliesSheet(ss) {
  let assembliesSheet = ss.getSheetByName('HW_Assemblies');
  if (!assembliesSheet) {
    assembliesSheet = ss.insertSheet('HW_Assemblies');
    
    const headers = [
      'AssemblyID',       // A - Unique identifier (e.g., "MOTOR_CTRL_1HP")
      'AssemblyName',     // B - Display name (e.g., "1HP Motor Control Switch")
      'Description',      // C - Full description
      'Category',         // D - Motor Control, Safety Devices, etc.
      'TotalCost',        // E - Calculated from BOM
      'ComponentCount',   // F - Number of parts in assembly
      'BOMReference',     // G - Link to detailed BOM
      'UsedInPanels',     // H - List of panels using this assembly
      'Configuration',    // I - JSON config options
      'CreatedDate',      // J - Creation date
      'ModifiedDate',     // K - Last modification
      'CreatedBy',        // L - Who created this assembly
      'IsStandard',       // M - Standard vs custom assembly
      'IsActive'          // N - Active flag
    ];
    
    assembliesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    assembliesSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    assembliesSheet.getRange(1, 1, 1, headers.length).setBackground('#2e5c3e');
    assembliesSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    assembliesSheet.setFrozenRows(1);
    
    console.log('✅ HIERARCHICAL - HW_Assemblies sheet created');
  }
  return assembliesSheet;
}

/**
 * Create BOM Details sheet - bill of materials for assemblies
 */
function createBOMDetailsSheet(ss) {
  let bomSheet = ss.getSheetByName('HW_BOM_Details');
  if (!bomSheet) {
    bomSheet = ss.insertSheet('HW_BOM_Details');
    
    const headers = [
      'AssemblyID',       // A - Links to HW_Assemblies
      'LineNumber',       // B - BOM line sequence
      'PartID',           // C - Links to HW_Parts
      'Quantity',         // D - Parts needed
      'UnitCost',         // E - Part unit cost
      'LineCost',         // F - Extended cost (Quantity × UnitCost)
      'Notes',            // G - Line item notes
      'CreatedDate',      // H - When BOM line added
      'ModifiedDate',     // I - Last modification
      'IsActive'          // J - Active flag
    ];
    
    bomSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    bomSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    bomSheet.getRange(1, 1, 1, headers.length).setBackground('#8b4513');
    bomSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    bomSheet.setFrozenRows(1);
    
    console.log('✅ HIERARCHICAL - HW_BOM_Details sheet created');
  }
  return bomSheet;
}

/**
 * Create Panels sheet - complete control systems
 */
function createPanelsSheet(ss) {
  let panelsSheet = ss.getSheetByName('HW_Panels');
  if (!panelsSheet) {
    panelsSheet = ss.insertSheet('HW_Panels');
    
    const headers = [
      'PanelCode',        // A - BHAC, DTAC, GHAC, etc.
      'PanelName',        // B - Full name
      'Description',      // C - Detailed description
      'BasePrice',        // D - Starting price
      'AssemblyList',     // E - List of included assemblies
      'OEMPartners',      // F - Compatible OEMs
      'Variations',       // G - Standard, Manual, Automated
      'Configuration',    // H - JSON: voltage, phase, features
      'CertificationLevel', // I - UL508a, cUL, etc.
      'InstallationType', // J - Indoor, Outdoor, Hazardous
      'CreatedDate',      // K - Creation date
      'ModifiedDate',     // L - Last modification
      'ProjectsUsed',     // M - Count of projects using this panel
      'IsActive'          // N - Active flag
    ];
    
    panelsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    panelsSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    panelsSheet.getRange(1, 1, 1, headers.length).setBackground('#7a2e2e');
    panelsSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    panelsSheet.setFrozenRows(1);
    
    console.log('✅ HIERARCHICAL - HW_Panels sheet created');
  }
  return panelsSheet;
}

/**
 * Create Projects sheet - specific customer implementations
 */
function createProjectsSheet(ss) {
  let projectsSheet = ss.getSheetByName('HW_Projects');
  if (!projectsSheet) {
    projectsSheet = ss.insertSheet('HW_Projects');
    
    const headers = [
      'ProjectCode',      // A - e.g., "BHAC-Zipline-Standard"
      'ProjectName',      // B - Full project name
      'PanelType',        // C - Base panel type (BHAC, DTAC, etc.)
      'OEM',              // D - OEM partner
      'Customer',         // E - End customer
      'QuoteID',          // F - Link to quote
      'BasedOn',          // G - Template used
      'Variations',       // H - Customizations made
      'TotalValue',       // I - Project value
      'Status',           // J - Quote, Approved, Built, Delivered
      'SalesID',          // K - Sales person ID
      'CreatedDate',      // L - Project start date
      'DeliveryDate',     // M - Planned/actual delivery
      'Files',            // N - Links to related files
      'Notes'             // O - Project notes
    ];
    
    projectsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    projectsSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    projectsSheet.getRange(1, 1, 1, headers.length).setBackground('#4a4a4a');
    projectsSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    projectsSheet.setFrozenRows(1);
    
    console.log('✅ HIERARCHICAL - HW_Projects sheet created');
  }
  return projectsSheet;
}

/**
 * Create Quotes sheet - final customer proposals
 */
function createQuotesSheet(ss) {
  let quotesSheet = ss.getSheetByName('HW_Quotes');
  if (!quotesSheet) {
    quotesSheet = ss.insertSheet('HW_Quotes');
    
    const headers = [
      'QuoteID',          // A - CQ24031201DTABT-00 format
      'QuoteNumber',      // B - Display number
      'CustomerCompany',  // C - Customer company name
      'CustomerContact',  // D - Contact person
      'ProjectCode',      // E - Link to project
      'Description',      // F - Quote description
      'NetPrice',         // G - Net price
      'TotalPrice',       // H - Total price with multiplier
      'PriceMultiplier',  // I - Standard, Preferred, etc.
      'Status',           // J - Draft, Sent, Approved, etc.
      'CreatedDate',      // K - Quote creation date
      'ValidUntil',       // L - Quote expiration
      'SalesID',          // M - Sales person
      'Terms',            // N - Payment terms
      'PDFGenerated',     // O - PDF file status
      'IsActive'          // P - Active flag
    ];
    
    quotesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    quotesSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    quotesSheet.getRange(1, 1, 1, headers.length).setBackground('#2d5aa0');
    quotesSheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    quotesSheet.setFrozenRows(1);
    
    console.log('✅ HIERARCHICAL - HW_Quotes sheet created');
  }
  return quotesSheet;
}

/**
 * Populate Parts sheet from existing Master Catalog
 */
function populatePartsFromMasterCatalog(ss) {
  console.log('🔄 HIERARCHICAL - Populating Parts from Master Catalog...');
  
  const masterSheet = ss.getSheetByName('Master Catalog');
  const partsSheet = ss.getSheetByName('HW_Parts');
  
  if (!masterSheet || !partsSheet) {
    console.log('⚠️ HIERARCHICAL - Missing required sheets for parts population');
    return;
  }
  
  const masterData = masterSheet.getDataRange().getValues();
  if (masterData.length < 3) {
    console.log('⚠️ HIERARCHICAL - No data in Master Catalog');
    return;
  }
  
  const headers = masterData[1]; // Row 2 has headers
  const partsData = [];
  
  // Map Master Catalog columns to Parts structure
  const colMap = {
    part: headers.indexOf('PART'),
    description: headers.indexOf('DESCRIPTION'),
    partNum: headers.indexOf('PART#'),
    vendor: headers.indexOf('VNDR'),
    vendorNum: headers.indexOf('VNDR#'),
    cost: headers.indexOf('COST'),
    unit: headers.indexOf('UNIT')
  };
  
  // Convert Master Catalog data to Parts format
  for (let i = 2; i < masterData.length; i++) {
    const row = masterData[i];
    if (row[colMap.partNum]) { // Only process rows with part numbers
      const partData = [
        row[colMap.partNum],                    // PartID
        row[colMap.partNum],                    // PartNumber
        row[colMap.description] || '',          // Description
        row[colMap.part] || 'General',          // Category
        determineSubcategory(row[colMap.part]), // Subcategory
        parseFloat(row[colMap.cost]) || 0,      // UnitCost
        row[colMap.unit] || 'EA',               // Unit
        row[colMap.vendor] || '',               // Vendor
        row[colMap.vendorNum] || '',            // VendorPN
        JSON.stringify({}),                     // Specifications (empty for now)
        '',                                     // UsedInAssemblies (to be calculated)
        '',                                     // Notes
        '',                                     // DatasheetLink
        new Date(),                             // LastUpdated
        true                                    // IsActive
      ];
      partsData.push(partData);
    }
  }
  
  if (partsData.length > 0) {
    partsSheet.getRange(2, 1, partsData.length, partsData[0].length).setValues(partsData);
    console.log(`✅ HIERARCHICAL - Populated ${partsData.length} parts from Master Catalog`);
  }
}

/**
 * Helper function to determine subcategory based on part type
 */
function determineSubcategory(partType) {
  if (!partType) return 'Other';
  
  const subcategoryMap = {
    'Control Systems': 'PLC',
    'Motor Control': 'VFD',
    'Enclosures': 'NEMA',
    'Safety': 'E-Stop',
    'Sensors': 'Temperature',
    'Valves': 'Solenoid'
  };
  
  return subcategoryMap[partType] || 'Other';
}

/**
 * Populate Assemblies sheet with reference data from user's quote examples
 */
function populateAssembliesFromReference(ss) {
  console.log('🔄 HIERARCHICAL - Populating Assemblies from reference data...');
  
  const assembliesSheet = ss.getSheetByName('HW_Assemblies');
  if (!assembliesSheet) return;
  
  // Based on user's quote screenshots, create standard assemblies
  const standardAssemblies = [
    {
      id: 'MOTOR_CTRL_START_STOP',
      name: 'Start/Stop Motor Control Switch (230V or 480V ±10%)',
      description: 'Powder Coat Gray NEMA Four Enclosure (Indoor Use Only) with Manual Motor Protector, Motor Contact, Operation Pilot LED, Operation ON/OFF Selector Switch, Safety and Switch Labeling',
      category: 'Motor Control',
      cost: 684.00 // From screenshot
    },
    {
      id: 'AUTOMATION_HW_ASSEMBLY',
      name: 'Automation Hardware Assembly',
      description: '12" Full Color Bold Touchscreen User Interface with IDEC HG Series or Allen Bradley Series, Action Notifications for User Feedback, Touchscreen Motor and Valve Control, Alarm Log, Continuous Data Streaming, Graphical Trending',
      category: 'Automation',
      cost: 54748.00 // From screenshot
    },
    {
      id: 'TOUCHSCREEN_ENCLOSURE',
      name: 'Stainless Steel Touchscreen Enclosure (Type 4X)',
      description: 'Touchscreen HMI located in Remote Cabinet, Heat/Cool Switch, Safety and Switch Labeling, Safe 24VDC Control Voltage, Safety and Switch Labeling, Craft Automation Enclosure Decal',
      category: 'Enclosures',
      cost: 0 // Price varies by configuration
    },
    {
      id: 'SAFETY_DEVICES',
      name: 'Safety Devices',
      description: 'E-Stop Pushbutton Device, Non-Fused Main Panel Disconnect, Engineered Branch Protection, Integrated Safety Relay for All Motors for Class Protection',
      category: 'Safety',
      cost: 0 // Price varies by configuration
    },
    {
      id: 'CIP_PROCESS_AUTOMATION',
      name: 'CIP Process Automation Functionality',
      description: 'Automated CIP Assembly - Clean in Place automation for vessels using tank fill levels with water selection, caustic selection, and sanitization functionality',
      category: 'Process Control',
      cost: 0 // Complex pricing
    },
    {
      id: 'THREE_DAY_STARTUP',
      name: 'THREE Day Startup Assistance (REQUIRED)',
      description: 'Three Day Onsite (8hr/day) Setup Assistance and Process Automation Tutorial. Control and Power Wiring must be Wired per Schematics Prior to Arrival',
      category: 'Services',
      cost: 4350.00 // From screenshot
    }
  ];
  
  const assemblyData = [];
  standardAssemblies.forEach((assembly, index) => {
    assemblyData.push([
      assembly.id,                           // AssemblyID
      assembly.name,                         // AssemblyName
      assembly.description,                  // Description
      assembly.category,                     // Category
      assembly.cost,                         // TotalCost
      0,                                     // ComponentCount (to be calculated)
      `BOM_${assembly.id}`,                  // BOMReference
      '',                                    // UsedInPanels (to be calculated)
      JSON.stringify({}),                    // Configuration
      new Date(),                           // CreatedDate
      new Date(),                           // ModifiedDate
      'System',                             // CreatedBy
      true,                                 // IsStandard
      true                                  // IsActive
    ]);
  });
  
  if (assemblyData.length > 0) {
    assembliesSheet.getRange(2, 1, assemblyData.length, assemblyData[0].length).setValues(assemblyData);
    console.log(`✅ HIERARCHICAL - Populated ${assemblyData.length} standard assemblies`);
  }
}

/**
 * Populate Panels sheet with data from project catalog
 */
function populatePanelsFromCatalog(ss) {
  console.log('🔄 HIERARCHICAL - Populating Panels from project catalog...');
  
  const panelsSheet = ss.getSheetByName('HW_Panels');
  if (!panelsSheet) return;
  
  // Based on projectcatalog.json from user's reference files
  const panelTypes = [
    {
      code: 'AGAC',
      name: 'Advanced Grain Automation Control',
      description: 'Automated grain handling control system with load cell interfaces, pneumatic gates, and motor assemblies',
      basePrice: 25000
    },
    {
      code: 'BHAC',
      name: 'Brewhouse Automation Control',
      description: 'Automated brewhouse control solution with cUL Listed components, touchscreen interface, and safety systems',
      basePrice: 35000
    },
    {
      code: 'BHMC',
      name: 'Brewhouse Manual Control',
      description: 'Manual brewhouse control system with simplified interface and manual overrides',
      basePrice: 15000
    },
    {
      code: 'CIP',
      name: 'Clean-in-Place Automation',
      description: 'Automated cleaning system for tanks and vessels with multi-loop capability',
      basePrice: 45000
    },
    {
      code: 'CRAC',
      name: 'Cellar/Rack Automation Control',
      description: 'Cellar automation with tank controls, transfer systems, and monitoring',
      basePrice: 30000
    },
    {
      code: 'DTAC',
      name: 'Distillery Temperature Automation Control',
      description: 'Automated distillation control with proportional valve regulation and VFD integration',
      basePrice: 40000
    },
    {
      code: 'DTMC',
      name: 'Distillery Temperature Manual Control',
      description: 'Manual distillation control system with operator interface',
      basePrice: 18000
    },
    {
      code: 'GHAC',
      name: 'Grain Handling Automation Control',
      description: 'Full process automation with load cell interfaces, pneumatic gates, and Class II Div II pressurization',
      basePrice: 32000
    },
    {
      code: 'GHMC',
      name: 'Grain Handling Manual Control',
      description: 'Manual grain handling control with VFD and pneumatic gate control',
      basePrice: 12000
    },
    {
      code: 'SSMS',
      name: 'Silo/Scale Monitoring System',
      description: 'Load cell monitoring and motor control system for silo operations',
      basePrice: 8000
    },
    {
      code: 'WT',
      name: 'Water Treatment Panel',
      description: 'Water treatment control with RO pump VFDs and system monitoring',
      basePrice: 22000
    }
  ];
  
  const panelData = [];
  panelTypes.forEach(panel => {
    panelData.push([
      panel.code,                           // PanelCode
      panel.name,                           // PanelName
      panel.description,                    // Description
      panel.basePrice,                      // BasePrice
      '',                                   // AssemblyList (to be defined)
      'Multiple',                           // OEMPartners
      'Standard,Manual,Automated',          // Variations
      JSON.stringify({                      // Configuration
        voltage: '480V',
        phase: '3',
        certification: 'UL508a'
      }),
      'UL508a',                            // CertificationLevel
      'Indoor/Outdoor',                    // InstallationType
      new Date(),                          // CreatedDate
      new Date(),                          // ModifiedDate
      0,                                   // ProjectsUsed
      true                                 // IsActive
    ]);
  });
  
  if (panelData.length > 0) {
    panelsSheet.getRange(2, 1, panelData.length, panelData[0].length).setValues(panelData);
    console.log(`✅ HIERARCHICAL - Populated ${panelData.length} panel types`);
  }
}

// =================== UTILITY FUNCTIONS ===================

/**
 * Get hierarchical database status
 */
function getHierarchicalDatabaseStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const requiredSheets = ['HW_Parts', 'HW_Assemblies', 'HW_BOM_Details', 'HW_Panels', 'HW_Projects', 'HW_Quotes'];
  
  const status = {
    initialized: true,
    sheets: {},
    summary: {}
  };
  
  requiredSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      const rowCount = sheet.getLastRow() - 1; // Exclude header
      status.sheets[sheetName] = {
        exists: true,
        records: rowCount
      };
    } else {
      status.sheets[sheetName] = {
        exists: false,
        records: 0
      };
      status.initialized = false;
    }
  });
  
  status.summary = {
    partsCount: status.sheets['HW_Parts']?.records || 0,
    assembliesCount: status.sheets['HW_Assemblies']?.records || 0,
    bomCount: status.sheets['HW_BOM_Details']?.records || 0,
    panelsCount: status.sheets['HW_Panels']?.records || 0,
    projectsCount: status.sheets['HW_Projects']?.records || 0,
    quotesCount: status.sheets['HW_Quotes']?.records || 0
  };
  
  return status;
}

/**
 * Test function for hierarchical database
 */
function testHierarchicalDatabase() {
  console.log('🧪 Testing hierarchical database...');
  
  try {
    const status = getHierarchicalDatabaseStatus();
    console.log('Database Status:', status);
    
    if (!status.initialized) {
      console.log('🔧 Initializing database...');
      return initializeHierarchicalDatabase();
    } else {
      console.log('✅ Database already initialized');
      return {
        success: true,
        status: status,
        message: 'Hierarchical database is ready'
      };
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
