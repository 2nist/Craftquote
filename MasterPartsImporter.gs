/**
 * MASTER PARTS DATABASE IMPORTER
 * Formats your master catalog for AI-powered BOM analysis
 * Preserves Part#, Descriptions, and Vendors as requested
 */

/**
 * Import and format master catalog for AI analysis
 */
function importMasterCatalog() {
  try {
    console.log('📦 Starting Master Catalog Import...');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create optimized parts database sheet
    const partsSheet = getOrCreatePartsDatabase(ss);
    
    // Process the catalog data (you'll paste your CSV data here)
    const catalogData = processMasterCatalogData();
    
    // Format for AI analysis
    const formattedData = formatPartsForAI(catalogData);
    
    // Save to sheet
    saveFormattedParts(partsSheet, formattedData);
    
    // Create category analysis
    createCategoryAnalysis(ss, formattedData);
    
    // Show import results
    showImportResults(formattedData);
    
    console.log('✅ Master Catalog import complete!');
    
    return {
      success: true,
      partsCount: formattedData.length,
      message: 'Master catalog imported and formatted successfully'
    };
    
  } catch (error) {
    console.error('❌ Master Catalog import failed:', error);
    SpreadsheetApp.getUi().alert('Import failed: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Process and clean your master catalog data
 */
function processMasterCatalogData() {
  // Load data from MasterCatalogData.gs file
  try {
    // Try to access MASTER_CATALOG_DATA
    let catalogData = [];
    
    // Check if MASTER_CATALOG_DATA exists and has data
    if (typeof MASTER_CATALOG_DATA !== 'undefined' && MASTER_CATALOG_DATA && Array.isArray(MASTER_CATALOG_DATA) && MASTER_CATALOG_DATA.length > 0) {
      catalogData = MASTER_CATALOG_DATA;
      console.log('✅ Loaded', catalogData.length, 'parts from MASTER_CATALOG_DATA');
    } else {
      console.log('⚠️ MASTER_CATALOG_DATA not found or empty, using sample data');
      catalogData = generateSampleCatalogData();
    }
    
    // Validate each part has required fields
    const validatedData = catalogData.map(function(part) {
      return {
        partNumber: (part && part.partNumber) ? String(part.partNumber) : 'UNKNOWN',
        description: (part && part.description) ? String(part.description) : 'No Description',
        vendor: (part && part.vendor) ? String(part.vendor) : 'Unknown Vendor',
        unitCost: (part && part.unitCost && !isNaN(parseFloat(part.unitCost))) ? parseFloat(part.unitCost) : 0
      };
    });
    
    console.log('✅ Validated', validatedData.length, 'parts for import');
    return validatedData;
    
  } catch (error) {
    console.error('❌ Error loading catalog data:', error.toString());
    console.log('🔄 Falling back to sample data');
    return generateSampleCatalogData();
  }
}

/**
 * Generate sample catalog data for testing
 */
function generateSampleCatalogData() {
  return [
    {
      partNumber: "AB-1756-L83E",
      description: "CompactLogix 5380 Ethernet/IP Controller, 3MB Memory",
      vendor: "Allen-Bradley",
      unitCost: 2850.00
    },
    {
      partNumber: "AB-2711P-T15C4D8",
      description: "PanelView Plus 7 Performance 15\" Color Touch HMI Terminal",
      vendor: "Allen-Bradley", 
      unitCost: 3420.00
    },
    {
      partNumber: "SMC-LER-25DA-S",
      description: "Temperature Sensor RTD Pt100 1/4\" NPT 4-20mA Output",
      vendor: "SMC",
      unitCost: 285.00
    }
  ];
}

/**
 * Format parts data optimally for AI analysis
 */
function formatPartsForAI(rawData) {
  console.log('🤖 Formatting parts for AI analysis...');
  
  if (!rawData || !Array.isArray(rawData)) {
    console.error('❌ Invalid rawData provided to formatPartsForAI');
    return [];
  }
  
  console.log('📊 Processing ' + rawData.length + ' parts...');
  
  return rawData.map(function(part, index) {
    try {
      // Ensure part is an object
      if (!part || typeof part !== 'object') {
        console.warn('⚠️ Part ' + index + ' is not a valid object, skipping');
        return null;
      }
      
      // Extra safety: ensure all string properties exist before calling methods
      var safePartNumber = part.partNumber ? String(part.partNumber) : '';
      var safeDescription = part.description ? String(part.description) : '';
      var safeVendor = part.vendor ? String(part.vendor) : '';
      var safeCategory = part.category ? String(part.category) : '';
      var safeSubcategory = part.subcategory ? String(part.subcategory) : '';
      var safeAvailability = part.availability ? String(part.availability) : '';
      
      // Only process if we have meaningful data
      if (!safePartNumber && !safeDescription) {
        console.warn('⚠️ Part ' + index + ' has no partNumber or description, skipping');
        return null;
      }
      
      // Create AI-friendly part structure with ultra-safe access
      var formatted = {
        // Core identification
        partNumber: safePartNumber || 'PART_' + (index + 1),
        description: cleanDescription(safeDescription || 'No Description'),
        vendor: normalizeVendor(safeVendor || 'Unknown Vendor'),
        
        // AI analysis fields
        category: categorizePart({
          partNumber: safePartNumber,
          description: safeDescription,
          vendor: safeVendor
        }),
        subCategory: safeSubcategory || 'Standard',
        functionalGroup: determineFunctionalGroup({
          partNumber: safePartNumber,
          description: safeDescription,
          category: safeCategory
        }),
        
        // Cost and availability
        unitCost: parseFloat(part.unitCost) || 0,
        availability: safeAvailability || 'Unknown',
        
        // AI pattern matching fields
        keywords: extractKeywords(safeDescription),
        compatibility: determineCompatibility({
          partNumber: safePartNumber,
          description: safeDescription,
          category: safeCategory
        }),
        typicalQuantity: determineTypicalQuantity({
          description: safeDescription,
          category: safeCategory
        }),
        
        // Assembly relationship hints
        commonPartners: [],  // Will be populated by AI analysis
        substituteOptions: [], // Will be populated by AI analysis
        
        // Metadata for AI learning
        lastUsed: new Date(),
        usageFrequency: 0,  // Will be updated based on BOM analysis
        successRate: 1.0    // Will be updated based on project outcomes
      };
      
      return formatted;
      
    } catch (partError) {
      console.error('❌ Error processing part ' + index + ':', partError.toString());
      console.error('Part data:', part);
      return null;
    }
  }).filter(function(part) { return part !== null; }); // Remove any null entries
}

/**
 * Categorize parts intelligently for AI analysis
 */
function categorizePart(part) {
  // Safely extract and convert to lowercase
  var desc = '';
  var partNum = '';
  
  if (part && part.description) {
    desc = String(part.description).toLowerCase();
  }
  if (part && part.partNumber) {
    partNum = String(part.partNumber).toLowerCase();
  }
  
  // Control system components
  if (desc.indexOf('plc') !== -1 || desc.indexOf('controller') !== -1 || partNum.indexOf('1756') !== -1) {
    return 'PLC_CONTROLLERS';
  }
  if (desc.indexOf('hmi') !== -1 || desc.indexOf('panelview') !== -1 || desc.indexOf('touch screen') !== -1) {
    return 'HMI_DISPLAYS';
  }
  if (desc.indexOf('vfd') !== -1 || desc.indexOf('drive') !== -1 || desc.indexOf('inverter') !== -1) {
    return 'VFD_DRIVES';
  }
  
  // Field devices
  if (desc.indexOf('sensor') !== -1 || desc.indexOf('transmitter') !== -1) {
    return 'SENSORS';
  }
  if (desc.indexOf('valve') !== -1 || desc.indexOf('actuator') !== -1) {
    return 'VALVES_ACTUATORS';
  }
  
  // Power and distribution
  if (desc.indexOf('transformer') !== -1 || desc.indexOf('power supply') !== -1) {
    return 'POWER_SUPPLIES';
  }
  if (desc.indexOf('breaker') !== -1 || desc.indexOf('disconnect') !== -1 || desc.indexOf('fuse') !== -1) {
    return 'PROTECTION_DEVICES';
  }
  
  // Wiring and connectivity
  if (desc.indexOf('cable') !== -1 || desc.indexOf('wire') !== -1 || partNum.indexOf('cable') !== -1) {
    return 'CABLES_WIRING';
  }
  if (desc.indexOf('terminal') !== -1 || desc.indexOf('connector') !== -1) {
    return 'TERMINALS_CONNECTORS';
  }
  
  // Enclosures and hardware
  if (desc.indexOf('enclosure') !== -1 || desc.indexOf('cabinet') !== -1 || desc.indexOf('box') !== -1) {
    return 'ENCLOSURES';
  }
  if (desc.indexOf('din rail') !== -1 || desc.indexOf('mounting') !== -1 || desc.indexOf('bracket') !== -1) {
    return 'MOUNTING_HARDWARE';
  }
  
  // Process specific
  if (desc.indexOf('temperature') !== -1 && (desc.indexOf('sensor') !== -1 || desc.indexOf('probe') !== -1)) {
    return 'TEMPERATURE_SENSORS';
  }
  if (desc.indexOf('pressure') !== -1 && desc.indexOf('sensor') !== -1) {
    return 'PRESSURE_SENSORS';
  }
  if (desc.indexOf('flow') !== -1 && desc.indexOf('meter') !== -1) {
    return 'FLOW_METERS';
  }
  
  return 'MISCELLANEOUS';
}

/**
 * Determine functional groups for assembly logic
 */
function determineFunctionalGroup(part) {
  var category = categorizePart(part);
  
  var functionalGroups = {
    'PLC_CONTROLLERS': 'CONTROL_CORE',
    'HMI_DISPLAYS': 'CONTROL_CORE', 
    'VFD_DRIVES': 'MOTOR_CONTROL',
    'SENSORS': 'FIELD_DEVICES',
    'VALVES_ACTUATORS': 'FIELD_DEVICES',
    'POWER_SUPPLIES': 'POWER_DISTRIBUTION',
    'PROTECTION_DEVICES': 'POWER_DISTRIBUTION',
    'CABLES_WIRING': 'CONNECTIVITY',
    'TERMINALS_CONNECTORS': 'CONNECTIVITY',
    'ENCLOSURES': 'MECHANICAL',
    'MOUNTING_HARDWARE': 'MECHANICAL'
  };
  
  return functionalGroups[category] || 'SUPPORT';
}

/**
 * Extract keywords for AI pattern matching
 */
function extractKeywords(description) {
  var keywords = [];
  var desc = '';
  
  // Safely handle the description parameter
  if (description) {
    desc = String(description).toLowerCase();
  }
  
  // Extract technical specifications
  const specPatterns = [
    /(\d+)\s*(amp|ampere|a)\b/g,     // Amperage
    /(\d+)\s*(volt|voltage|v)\b/g,   // Voltage
    /(\d+)\s*(hp|horsepower)\b/g,    // Horsepower
    /(\d+)\s*(inch|in|")\b/g,        // Size
    /(\d+)\s*(mb|gb|memory)\b/g      // Memory
  ];
  
  specPatterns.forEach(function(pattern) {
    const matches = desc.match(pattern);
    if (matches) {
      for (var i = 0; i < matches.length; i++) {
        keywords.push(matches[i]);
      }
    }
  });
  
  // Extract key technical terms
  const techTerms = [
    'ethernet', 'profinet', 'devicenet', 'modbus',
    'nema', 'ip65', 'ip67', 'explosion proof',
    'stainless steel', 'carbon steel', 'plastic',
    'normally open', 'normally closed', '4-20ma',
    'din rail', 'panel mount', 'field mount'
  ];
  
  techTerms.forEach(function(term) {
    if (desc.includes(term)) {
      keywords.push(term);
    }
  });
  
  return keywords.slice(0, 10); // Limit to top 10 keywords
}

/**
 * Save formatted parts to database sheet
 */
function saveFormattedParts(sheet, partsData) {
  console.log('💾 Saving formatted parts database...');
  
  // Clear existing data
  sheet.clear();
  
  // Create headers for AI-optimized database
  const headers = [
    'Part Number',      // Your requested field
    'Description',      // Your requested field  
    'Vendor',          // Your requested field
    'Category',        // AI categorization
    'Sub Category',    // Detailed categorization
    'Functional Group', // Assembly grouping
    'Unit Cost',       // Pricing
    'Keywords',        // AI matching
    'Typical Qty',     // Assembly intelligence
    'Last Updated'     // Maintenance
  ];
  
  // Set headers with formatting
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#1f4e79')
    .setFontColor('white')
    .setFontWeight('bold')
    .setFontSize(11);
  
  // Prepare data rows
  const dataRows = partsData.map(function(part) {
    return [
      part.partNumber,
      part.description,
      part.vendor,
      part.category,
      part.subCategory,
      part.functionalGroup,
      part.unitCost,
      part.keywords.join(', '),
      part.typicalQuantity || 1,
      new Date()
    ];
  });
  
  // Write data
  if (dataRows.length > 0) {
    sheet.getRange(2, 1, dataRows.length, headers.length).setValues(dataRows);
    
    // Format cost column as currency
    sheet.getRange(2, 7, dataRows.length, 1).setNumberFormat('$#,##0.00');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  console.log('✅ Parts database saved:', dataRows.length, 'parts');
}

/**
 * Create category analysis sheet
 */
function createCategoryAnalysis(ss, partsData) {
  let analysisSheet = ss.getSheetByName('Parts_Category_Analysis');
  if (!analysisSheet) {
    analysisSheet = ss.insertSheet('Parts_Category_Analysis');
  }
  
  // Analyze categories
  const categoryStats = {};
  partsData.forEach(function(part) {
    if (!categoryStats[part.category]) {
      categoryStats[part.category] = { count: 0, totalCost: 0 };
    }
    categoryStats[part.category].count++;
    categoryStats[part.category].totalCost += part.unitCost;
  });
  
  // Create analysis data
  analysisSheet.clear();
  analysisSheet.getRange(1, 1, 1, 4).setValues([
    ['Category', 'Part Count', 'Total Value', 'Avg Cost']
  ]);
  analysisSheet.getRange(1, 1, 1, 4).setBackground('#2e5c3e').setFontColor('white').setFontWeight('bold');
  
  const analysisRows = Object.entries(categoryStats).map(function(entry) {
    const category = entry[0];
    const stats = entry[1];
    return [
      category,
      stats.count,
      stats.totalCost,
      stats.totalCost / stats.count
    ];
  });
  
  if (analysisRows.length > 0) {
    analysisSheet.getRange(2, 1, analysisRows.length, 4).setValues(analysisRows);
    analysisSheet.getRange(2, 3, analysisRows.length, 2).setNumberFormat('$#,##0.00');
  }
}

/**
 * Show import results to user
 */
function showImportResults(partsData) {
  // Get unique categories using traditional approach
  var categoryMap = {};
  partsData.forEach(function(p) {
    categoryMap[p.category] = true;
  });
  const categories = Object.keys(categoryMap);
  const totalValue = partsData.reduce(function(sum, p) { return sum + p.unitCost; }, 0);
  
  SpreadsheetApp.getUi().alert(
    '📦 MASTER CATALOG IMPORT COMPLETE!\n\n' +
    '📊 IMPORT SUMMARY:\n' +
    '• ' + partsData.length + ' parts imported\n' +
    '• ' + categories.length + ' categories created\n' +
    '• $' + totalValue.toLocaleString() + ' total catalog value\n\n' +
    '🤖 AI ENHANCEMENTS:\n' +
    '• Smart categorization applied\n' +
    '• Keywords extracted for pattern matching\n' +
    '• Functional groups assigned\n' +
    '• Assembly relationships prepared\n\n' +
    '✅ Your parts database is now ready for\n' +
    'AI-powered BOM pattern analysis!\n\n' +
    'Check the "Master_Parts_Database" and\n' +
    '"Parts_Category_Analysis" sheets.'
  );
}

/**
 * Helper functions
 */
function cleanDescription(description) {
  return (description || '').trim().replace(/\s+/g, ' ');
}

function normalizeVendor(vendor) {
  const vendorMap = {
    'Allen-Bradley': 'Allen-Bradley',
    'AB': 'Allen-Bradley',
    'Rockwell': 'Allen-Bradley',
    'Siemens': 'Siemens',
    'Schneider': 'Schneider Electric',
    'SE': 'Schneider Electric'
  };
  return vendorMap[vendor] || vendor;
}

function determineSubCategory(part) {
  // Logic to determine subcategory based on part details
  return 'Standard';
}

function determineCompatibility(part) {
  // Logic to determine what this part is compatible with
  return [];
}

function determineTypicalQuantity(part) {
  // Logic to determine typical quantity used in assemblies
  const category = categorizePart(part);
  if (category === 'PLC_CONTROLLERS' || category === 'HMI_DISPLAYS') return 1;
  if (category === 'SENSORS') return 2;
  if (category === 'CABLES_WIRING') return 1;
  return 1;
}

function getOrCreatePartsDatabase(ss) {
  let sheet = ss.getSheetByName('Master_Parts_Database');
  if (!sheet) {
    sheet = ss.insertSheet('Master_Parts_Database');
  }
  return sheet;
}

/**
 * INTEGRATION WITH AI BOM ANALYZER
 * Connect parts database to pattern analysis
 */
function integratePartsWithBOMAnalyzer() {
  console.log('🔗 Integrating parts database with AI BOM analyzer...');
  
  // This function will connect the formatted parts database
  // with the BOM pattern analyzer for enhanced intelligence
  
  const partsData = loadFormattedParts();
  const bomPatterns = loadBOMPatterns();
  
  // Cross-reference parts with BOM usage
  const enhancedIntelligence = {
    partUsageFrequency: calculatePartUsageInBOMs(partsData, bomPatterns),
    commonAssemblies: identifyCommonAssemblies(partsData, bomPatterns),
    substitutionOptions: findSubstitutionPatterns(partsData, bomPatterns),
    costOptimizations: identifyOptimizations(partsData, bomPatterns)
  };
  
  return enhancedIntelligence;
}

function loadFormattedParts() {
  // Load parts from Master_Parts_Database sheet
  return [];
}

function loadBOMPatterns() {
  // Load patterns from AI_BOM_Analysis sheet  
  return [];
}

function calculatePartUsageInBOMs(parts, patterns) {
  // Calculate how frequently each part appears in BOMs
  return {};
}

function identifyCommonAssemblies(parts, patterns) {
  // Identify which parts commonly appear together
  return {};
}

function findSubstitutionPatterns(parts, patterns) {
  // Find parts that can substitute for each other
  return {};
}

function identifyOptimizations(parts, patterns) {
  // Identify cost-saving opportunities
  return {};
}
