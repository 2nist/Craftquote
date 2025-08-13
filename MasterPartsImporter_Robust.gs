/**
 * ROBUST MASTER PARTS IMPORTER - GOOGLE APPS SCRIPT COMPATIBLE
 * This version has enhanced error handling and full ES5 compatibility
 */

function importMasterCatalog() {
  console.log('📦 Starting Master Catalog Import...');
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create or get the parts database sheet
    var partsSheet = getOrCreatePartsDatabase(ss);
    
    // Get catalog data safely
    var catalogData = processMasterCatalogData();
    
    // Format the data with robust error handling
    var formattedData = formatPartsForAI(catalogData);
    
    // Write to sheet
    writePartsToSheet(partsSheet, formattedData);
    
    // Create analysis sheet
    createCategoryAnalysis(ss, formattedData);
    
    // Show results
    showImportResults(formattedData);
    
    // Integration with AI system
    integrateWithAIAnalyzer(formattedData);
    
    console.log('✅ Master catalog import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.toString());
    try {
      SpreadsheetApp.getUi().alert(
        '❌ IMPORT FAILED\n\n' +
        'Error: ' + error.toString() + '\n\n' +
        'Check the Apps Script console for details.'
      );
    } catch (uiError) {
      console.error('Could not show error alert:', uiError.toString());
    }
  }
}

/**
 * Robust data processing with comprehensive error handling
 */
function formatPartsForAI(rawData) {
  console.log('🤖 Formatting parts for AI analysis...');
  
  if (!rawData || !Array.isArray(rawData)) {
    console.error('❌ Invalid rawData provided to formatPartsForAI');
    return [];
  }
  
  console.log('📊 Processing ' + rawData.length + ' parts...');
  
  var validParts = [];
  var errorCount = 0;
  
  for (var i = 0; i < rawData.length; i++) {
    try {
      var part = rawData[i];
      
      // Ensure part is an object and has some data
      if (!part || typeof part !== 'object') {
        console.warn('⚠️ Part ' + i + ' is not a valid object, skipping');
        continue;
      }
      
      // Create safe string versions of all properties
      var safePartNumber = safeString(part.partNumber);
      var safeDescription = safeString(part.description);
      var safeVendor = safeString(part.vendor);
      var safeCategory = safeString(part.category);
      var safeSubcategory = safeString(part.subcategory);
      var safeAvailability = safeString(part.availability);
      
      // Skip parts with no meaningful identification
      if (!safePartNumber && !safeDescription) {
        console.warn('⚠️ Part ' + i + ' has no partNumber or description, skipping');
        continue;
      }
      
      // Create safe part object for categorization
      var safePart = {
        partNumber: safePartNumber,
        description: safeDescription,
        vendor: safeVendor,
        category: safeCategory
      };
      
      // Build the formatted part with safe operations
      var formatted = {
        // Core identification
        partNumber: safePartNumber || 'PART_' + (i + 1),
        description: cleanDescriptionSafe(safeDescription) || 'No Description',
        vendor: normalizeVendorSafe(safeVendor) || 'Unknown',
        
        // AI analysis fields
        category: categorizePartSafe(safePart),
        subCategory: safeSubcategory || 'Standard',
        functionalGroup: determineFunctionalGroupSafe(safePart),
        
        // Cost and availability  
        unitCost: safeNumber(part.unitCost),
        availability: safeAvailability || 'Unknown',
        
        // AI pattern matching fields
        keywords: extractKeywordsSafe(safeDescription),
        compatibility: determineCompatibilitySafe(safePart),
        typicalQuantity: determineTypicalQuantitySafe(safePart),
        
        // Assembly relationship hints
        commonPartners: [],
        substituteOptions: [],
        
        // Metadata
        lastUsed: new Date(),
        usageFrequency: 0,
        successRate: 1.0
      };
      
      validParts.push(formatted);
      
    } catch (partError) {
      errorCount++;
      console.error('❌ Error processing part ' + i + ':', partError.toString());
      if (rawData[i]) {
        console.error('Part data:', JSON.stringify(rawData[i]));
      }
      // Continue processing other parts
    }
  }
  
  console.log('✅ Successfully formatted ' + validParts.length + ' parts');
  if (errorCount > 0) {
    console.warn('⚠️ ' + errorCount + ' parts had errors and were skipped');
  }
  
  return validParts;
}

/**
 * Safe string conversion that handles null/undefined
 */
function safeString(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Safe number conversion
 */
function safeNumber(value) {
  var num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Safe categorization function
 */
function categorizePartSafe(part) {
  try {
    var desc = safeString(part.description).toLowerCase();
    var partNum = safeString(part.partNumber).toLowerCase();
    
    // Control system components
    if (stringContains(desc, 'plc') || stringContains(desc, 'controller') || stringContains(partNum, '1756')) {
      return 'PLC_CONTROLLERS';
    }
    if (stringContains(desc, 'hmi') || stringContains(desc, 'panelview') || stringContains(desc, 'touch screen')) {
      return 'HMI_DISPLAYS';
    }
    if (stringContains(desc, 'vfd') || stringContains(desc, 'drive') || stringContains(desc, 'inverter')) {
      return 'VFD_DRIVES';
    }
    
    // Field devices
    if (stringContains(desc, 'sensor') || stringContains(desc, 'transmitter')) {
      return 'SENSORS';
    }
    if (stringContains(desc, 'valve') || stringContains(desc, 'actuator')) {
      return 'VALVES_ACTUATORS';
    }
    
    // Power and distribution
    if (stringContains(desc, 'transformer') || stringContains(desc, 'power supply')) {
      return 'POWER_SUPPLIES';
    }
    if (stringContains(desc, 'breaker') || stringContains(desc, 'disconnect') || stringContains(desc, 'fuse')) {
      return 'PROTECTION_DEVICES';
    }
    
    // Wiring and connectivity
    if (stringContains(desc, 'cable') || stringContains(desc, 'wire') || stringContains(partNum, 'cable')) {
      return 'CABLES_WIRING';
    }
    if (stringContains(desc, 'terminal') || stringContains(desc, 'connector')) {
      return 'TERMINALS_CONNECTORS';
    }
    
    // Enclosures and hardware
    if (stringContains(desc, 'enclosure') || stringContains(desc, 'cabinet') || stringContains(desc, 'box')) {
      return 'ENCLOSURES';
    }
    if (stringContains(desc, 'din rail') || stringContains(desc, 'mounting') || stringContains(desc, 'bracket')) {
      return 'MOUNTING_HARDWARE';
    }
    
    // Process specific
    if (stringContains(desc, 'temperature') && (stringContains(desc, 'sensor') || stringContains(desc, 'probe'))) {
      return 'TEMPERATURE_SENSORS';
    }
    if (stringContains(desc, 'pressure') && stringContains(desc, 'sensor')) {
      return 'PRESSURE_SENSORS';
    }
    if (stringContains(desc, 'flow') && stringContains(desc, 'meter')) {
      return 'FLOW_METERS';
    }
    
    return 'MISCELLANEOUS';
    
  } catch (error) {
    console.error('Error in categorizePartSafe:', error.toString());
    return 'MISCELLANEOUS';
  }
}

/**
 * Safe string contains check (replaces .includes())
 */
function stringContains(str, searchTerm) {
  if (!str || !searchTerm) return false;
  return str.indexOf(searchTerm) !== -1;
}

/**
 * Safe keyword extraction
 */
function extractKeywordsSafe(description) {
  try {
    var keywords = [];
    var desc = safeString(description).toLowerCase();
    
    if (!desc) return keywords;
    
    // Extract technical specifications using regex
    var specPatterns = [
      /(\d+)\s*(amp|ampere|a)\b/g,
      /(\d+)\s*(volt|voltage|v)\b/g,
      /(\d+)\s*(hp|horsepower)\b/g,
      /(\d+)\s*(inch|in|")\b/g,
      /(\d+)\s*(mb|gb|memory)\b/g
    ];
    
    for (var i = 0; i < specPatterns.length; i++) {
      var matches = desc.match(specPatterns[i]);
      if (matches) {
        for (var j = 0; j < matches.length; j++) {
          keywords.push(matches[j]);
        }
      }
    }
    
    // Extract key technical terms
    var techTerms = [
      'ethernet', 'profinet', 'devicenet', 'modbus',
      'nema', 'ip65', 'ip67', 'explosion proof',
      'stainless steel', 'carbon steel', 'plastic',
      'normally open', 'normally closed', '4-20ma',
      'din rail', 'panel mount', 'field mount'
    ];
    
    for (var k = 0; k < techTerms.length; k++) {
      if (stringContains(desc, techTerms[k])) {
        keywords.push(techTerms[k]);
      }
    }
    
    return keywords;
    
  } catch (error) {
    console.error('Error in extractKeywordsSafe:', error.toString());
    return [];
  }
}

/**
 * Safe functional group determination
 */
function determineFunctionalGroupSafe(part) {
  try {
    var category = categorizePartSafe(part);
    
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
    
  } catch (error) {
    console.error('Error in determineFunctionalGroupSafe:', error.toString());
    return 'SUPPORT';
  }
}

/**
 * Safe compatibility determination
 */
function determineCompatibilitySafe(part) {
  try {
    var compatibility = [];
    var desc = safeString(part.description).toLowerCase();
    
    // Add basic compatibility rules
    if (stringContains(desc, 'allen-bradley') || stringContains(desc, 'rockwell')) {
      compatibility.push('AB_ECOSYSTEM');
    }
    if (stringContains(desc, 'siemens')) {
      compatibility.push('SIEMENS_ECOSYSTEM');  
    }
    if (stringContains(desc, 'schneider')) {
      compatibility.push('SCHNEIDER_ECOSYSTEM');
    }
    
    return compatibility;
    
  } catch (error) {
    console.error('Error in determineCompatibilitySafe:', error.toString());
    return [];
  }
}

/**
 * Safe typical quantity determination
 */
function determineTypicalQuantitySafe(part) {
  try {
    var desc = safeString(part.description).toLowerCase();
    var category = categorizePartSafe(part);
    
    // Quantity rules based on category
    var categoryQuantities = {
      'PLC_CONTROLLERS': 1,
      'HMI_DISPLAYS': 1,
      'VFD_DRIVES': 1,
      'POWER_SUPPLIES': 1,
      'CABLES_WIRING': 10,
      'TERMINALS_CONNECTORS': 20,
      'MOUNTING_HARDWARE': 5
    };
    
    return categoryQuantities[category] || 1;
    
  } catch (error) {
    console.error('Error in determineTypicalQuantitySafe:', error.toString());
    return 1;
  }
}

/**
 * Safe description cleaning
 */
function cleanDescriptionSafe(description) {
  try {
    var cleaned = safeString(description);
    if (cleaned) {
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
    }
    return cleaned;
  } catch (error) {
    console.error('Error in cleanDescriptionSafe:', error.toString());
    return safeString(description);
  }
}

/**
 * Safe vendor normalization
 */
function normalizeVendorSafe(vendor) {
  try {
    var vendorMap = {
      'Allen-Bradley': 'Allen-Bradley',
      'AB': 'Allen-Bradley', 
      'Rockwell': 'Allen-Bradley',
      'Siemens': 'Siemens',
      'Schneider': 'Schneider Electric',
      'SE': 'Schneider Electric'
    };
    
    var safeVendor = safeString(vendor);
    return vendorMap[safeVendor] || safeVendor;
    
  } catch (error) {
    console.error('Error in normalizeVendorSafe:', error.toString());
    return safeString(vendor);
  }
}

/**
 * Test the robust import system
 */
function testRobustImport() {
  console.log('🧪 Testing robust import system...');
  
  try {
    // Test with sample data including edge cases
    var testData = [
      {
        partNumber: 'TEST-001',
        description: '24V VFD Motor Drive',
        vendor: 'Allen-Bradley',
        unitCost: 500.00
      },
      {
        partNumber: null,  // Test null value
        description: 'Temperature Sensor',
        vendor: '',       // Test empty string
        unitCost: 'invalid' // Test invalid number
      },
      {
        // Test missing properties
        partNumber: 'TEST-003'
      },
      null,  // Test null entry
      {
        partNumber: 'TEST-004',
        description: undefined, // Test undefined
        vendor: 'Siemens'
      }
    ];
    
    var result = formatPartsForAI(testData);
    
    console.log('✅ Test completed successfully');
    console.log('Input: ' + testData.length + ' parts (including invalid)');
    console.log('Output: ' + result.length + ' valid parts');
    
    if (result.length > 0) {
      console.log('Sample processed part:');
      console.log('  Part Number: ' + result[0].partNumber);
      console.log('  Description: ' + result[0].description);
      console.log('  Category: ' + result[0].category);
      console.log('  Keywords: ' + result[0].keywords.join(', '));
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Robust import test failed:', error.toString());
    return null;
  }
}
