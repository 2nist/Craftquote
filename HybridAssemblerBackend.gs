/**
 * HYBRID COMPONENT ASSEMBLER - Backend System
 * Database-driven "brain in spreadsheet" with smart template assistance
 * August 9, 2025 - Updated August 11, 2025
 * VERSION: 3.1 - Master Catalog Integration Active
 */

// Version check function
function getBackendVersion() {
  return {
    version: '3.1',
    lastUpdated: 'August 12, 2025',
    features: 'Master Catalog Integration Active',
    masterCatalogIntegration: true,
    realDataEnabled: true
  };
}

// =================== DEBUG TEST FUNCTIONS ===================

/**
 * Simple test function to verify Google Apps Script backend is working
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

/**
 * Debug function to check Master Catalog structure and find components
 */
function debugMasterCatalog() {
  console.log('🎯 DEBUG - Checking Master Catalog structure...');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Check if Master Catalog sheet exists
  let masterSheet = ss.getSheetByName('Master Catalog');
  if (!masterSheet) {
    console.log('❌ Master Catalog sheet not found in current spreadsheet');
    console.log('Available sheets:', ss.getSheets().map(s => s.getName()).join(', '));
    return {
      success: false,
      message: 'Master Catalog sheet not found',
      availableSheets: ss.getSheets().map(s => s.getName())
    };
  }
  
  // Get sheet info
  const lastRow = masterSheet.getLastRow();
  const lastCol = masterSheet.getLastColumn();
  console.log(`📊 Master Catalog found: ${lastRow} rows × ${lastCol} columns`);
  
  if (lastRow < 3) {
    return {
      success: false,
      message: 'Master Catalog appears to be empty (no data rows)'
    };
  }
  
  // Get headers
  const headers = masterSheet.getRange(2, 1, 1, lastCol).getValues()[0];
  console.log('📋 Headers:', headers);
  
  // Get sample data (first 6 rows)
  const sampleRows = Math.min(7, lastRow); // Header + 5 data rows
  const sampleData = masterSheet.getRange(2, 1, sampleRows, lastCol).getValues();
  
  // Look for template components
  const templateComponents = ['A8067CHFL', 'CSD16126', 'CSD16166', 'CSD20208', 'A10106CHFL'];
  const foundComponents = [];
  
  for (let i = 2; i < sampleData.length; i++) {
    const row = sampleData[i];
    for (let j = 1; j < row.length; j++) {
      if (templateComponents.includes(row[j])) {
        foundComponents.push({
          component: row[j],
          row: i + 2,
          column: j + 2,
          data: row
        });
      }
    }
  }
  
  return {
    success: true,
    sheetName: 'Master Catalog',
    totalRows: lastRow,
    totalColumns: lastCol,
    headers: headers,
    sampleData: sampleData,
    foundTemplateComponents: foundComponents,
    message: `Master Catalog ready: ${lastRow0} components available`
  };
}

// =================== CORE HYBRID FUNCTIONS ===================

/**
 * Load the complete component library from Master Catalog
 * Returns organized component groups for the UI library panel
 */
function loadComponentLibrary() {
  console.log('🎯 LOADING COMPONENT LIBRARY from Master Catalog...');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let masterSheet = ss.getSheetByName('Master Catalog');
  if (!masterSheet) {
    console.log('❌ Master Catalog sheet not found');
    return {
      success: false,
      message: 'Master Catalog not found',
      componentGroups: []
    };
  }
  
  try {
    const data = masterSheet.getDataRange().getValues();
    if (data.length < 3) {
      return {
        success: false,
        message: 'Master Catalog appears to be empty',
        componentGroups: []
      };
    }
    
    // Use the same column mapping as our search function
    const columnMap = {
      yn: 0,           // Column A
      part: 1,         // Column B - PART (category)
      description: 2,   // Column C - DESCRIPTION  
      partNum: 3,      // Column D - PART#
      vendor: 4,       // Column E - VNDR
      vendorNum: 5,    // Column F - VNDR#
      cost: 6,         // Column G - COST
    };
    
    // Process all active components
    const componentsByCategory = {};
    
    for (let i = 2; i < data.length; i++) { // Skip header rows
      const row = data[i];
      
      // Only include active components
      if (row[columnMap.yn] !== 'Y') continue;
      
      const category = row[columnMap.part] || 'General';
      const component = {
        id: row[columnMap.partNum] || `COMP_${i}`,
        name: row[columnMap.description] || 'Unknown Component',
        description: row[columnMap.description] || 'No description available',
        price: parseFloat(row[columnMap.cost]) || 0,
        category: category,
        vendor: row[columnMap.vendor] || '',
        partNumber: row[columnMap.partNum] || ''
      };
      
      // Group by category
      if (!componentsByCategory[category]) {
        componentsByCategory[category] = [];
      }
      componentsByCategory[category].push(component);
    }
    
    // Convert to UI format with proper icons and grouping
    const componentGroups = [];
    
    // Define category mappings with icons
    const categoryMap = {
      'Enclosures': { icon: '🏠', displayName: 'Enclosures & Panels' },
      'Panels': { icon: '🏠', displayName: 'Enclosures & Panels' },
      'Control Systems': { icon: '🎛️', displayName: 'Control Systems' },
      'Control': { icon: '🎛️', displayName: 'Control Systems' },
      'Power & Motor Control': { icon: '⚡', displayName: 'Power & Motor Control' },
      'Power': { icon: '⚡', displayName: 'Power & Motor Control' },
      'Motor': { icon: '⚡', displayName: 'Power & Motor Control' },
      'Safety Systems': { icon: '🛡️', displayName: 'Safety Systems' },
      'Safety': { icon: '🛡️', displayName: 'Safety Systems' }
    };
    
    // Group similar categories together
    const consolidatedGroups = {
      'Enclosures & Panels': [],
      'Control Systems': [],
      'Power & Motor Control': [],
      'Safety Systems': [],
      'Other Components': []
    };
    
    // Consolidate components into proper groups
    Object.keys(componentsByCategory).forEach(category => {
      let targetGroup = 'Other Components';
      
      // Find matching group
      Object.keys(categoryMap).forEach(key => {
        if (category.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(category.toLowerCase())) {
          targetGroup = categoryMap[key].displayName;
        }
      });
      
      consolidatedGroups[targetGroup] = consolidatedGroups[targetGroup].concat(componentsByCategory[category]);
    });
    
    // Convert to final format with aggressive pagination
    Object.keys(consolidatedGroups).forEach(groupName => {
      if (consolidatedGroups[groupName].length > 0) {
        let icon = '📦';
        if (groupName.includes('Enclosures')) icon = '🏠';
        else if (groupName.includes('Control')) icon = '🎛️';
        else if (groupName.includes('Power')) icon = '⚡';
        else if (groupName.includes('Safety')) icon = '🛡️';
        
        componentGroups.push({
          name: groupName,
          icon: icon,
          components: consolidatedGroups[groupName].slice(0, 8), // Reduced from 20 to 8
          totalCount: consolidatedGroups[groupName].length,
          hasMore: consolidatedGroups[groupName].length > 8
        });
      }
    });
    
    console.log(`✅ Loaded ${componentGroups.length} component groups with total components:`);
    componentGroups.forEach(group => {
      console.log(`  - ${group.name}: ${group.components.length} components`);
    });
    
    return {
      success: true,
      message: `Loaded ${componentGroups.reduce((sum, g) => sum + g.components.length, 0)} components`,
      componentGroups: componentGroups,
      totalComponents: componentGroups.reduce((sum, g) => sum + g.components.length, 0)
    };
    
  } catch (error) {
    console.error('❌ Error loading component library:', error);
    return {
      success: false,
      message: 'Error loading components: ' + error.message,
      componentGroups: []
    };
  }
}

/**
 * Load more components for a specific category (pagination)
 */
function loadMoreComponents(categoryName, currentCount = 8) {
  console.log(`🎯 LOADING MORE COMPONENTS for ${categoryName}, starting from ${currentCount}...`);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let masterSheet = ss.getSheetByName('Master Catalog');
  if (!masterSheet) {
    return { success: false, components: [] };
  }
  
  try {
    const data = masterSheet.getDataRange().getValues();
    const columnMap = {
      yn: 0,           // Column A
      part: 1,         // Column B - PART (category)
      description: 2,   // Column C - DESCRIPTION  
      partNum: 3,      // Column D - PART#
      vendor: 4,       // Column E - VNDR
      vendorNum: 5,    // Column F - VNDR#
      cost: 6,         // Column G - COST
    };
    
    // Find components for this category
    const categoryComponents = [];
    
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (row[columnMap.yn] !== 'Y') continue;
      
      const category = row[columnMap.part] || 'General';
      
      // Match category (flexible matching)
      let matches = false;
      if (categoryName === 'Enclosures & Panels' && 
          (category.toLowerCase().includes('enclosures') || category.toLowerCase().includes('panels'))) {
        matches = true;
      } else if (categoryName === 'Control Systems' && 
          (category.toLowerCase().includes('control') || category.toLowerCase().includes('plc'))) {
        matches = true;
      } else if (categoryName === 'Power & Motor Control' && 
          (category.toLowerCase().includes('power') || category.toLowerCase().includes('motor'))) {
        matches = true;
      } else if (categoryName === 'Safety Systems' && 
          category.toLowerCase().includes('safety')) {
        matches = true;
      } else if (categoryName === 'Other Components') {
        // Default catch-all
        matches = !category.toLowerCase().includes('enclosures') && 
                 !category.toLowerCase().includes('panels') &&
                 !category.toLowerCase().includes('control') &&
                 !category.toLowerCase().includes('power') &&
                 !category.toLowerCase().includes('motor') &&
                 !category.toLowerCase().includes('safety');
      }
      
      if (matches) {
        categoryComponents.push({
          id: row[columnMap.partNum] || `COMP_${i}`,
          name: row[columnMap.description] || 'Unknown Component',
          description: row[columnMap.description] || 'No description available',
          price: parseFloat(row[columnMap.cost]) || 0,
          category: category,
          vendor: row[columnMap.vendor] || '',
          partNumber: row[columnMap.partNum] || ''
        });
      }
    }
    
    // Return the next batch
    const nextBatch = categoryComponents.slice(currentCount, currentCount + 8);
    const hasMore = currentCount + 8 < categoryComponents.length;
    
    return {
      success: true,
      components: nextBatch,
      hasMore: hasMore,
      totalCount: categoryComponents.length
    };
    
  } catch (error) {
    console.error('❌ Error loading more components:', error);
    return { success: false, components: [] };
  }
}

/**
 * Fast search components by keyword (much faster than loading all)
 */
function searchComponents(searchTerm, maxResults = 20) {
  console.log(`🔍 SEARCHING COMPONENTS for: "${searchTerm}"`);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let masterSheet = ss.getSheetByName('Master Catalog');
  if (!masterSheet) {
    return { success: false, components: [] };
  }
  
  try {
    const data = masterSheet.getDataRange().getValues();
    const columnMap = {
      yn: 0,           // Column A
      part: 1,         // Column B - PART (category)
      description: 2,   // Column C - DESCRIPTION  
      partNum: 3,      // Column D - PART#
      vendor: 4,       // Column E - VNDR
      vendorNum: 5,    // Column F - VNDR#
      cost: 6,         // Column G - COST
    };
    
    const searchResults = [];
    const searchUpper = searchTerm.toUpperCase();
    
    for (let i = 2; i < data.length && searchResults.length < maxResults; i++) {
      const row = data[i];
      if (row[columnMap.yn] !== 'Y') continue;
      
      // Search in multiple fields
      const description = (row[columnMap.description] || '').toString().toUpperCase();
      const partNum = (row[columnMap.partNum] || '').toString().toUpperCase();
      const category = (row[columnMap.part] || '').toString().toUpperCase();
      const vendor = (row[columnMap.vendor] || '').toString().toUpperCase();
      
      if (description.includes(searchUpper) || 
          partNum.includes(searchUpper) || 
          category.includes(searchUpper) ||
          vendor.includes(searchUpper)) {
        
        searchResults.push({
          id: row[columnMap.partNum] || `COMP_${i}`,
          name: row[columnMap.description] || 'Unknown Component',
          description: row[columnMap.description] || 'No description available',
          price: parseFloat(row[columnMap.cost]) || 0,
          category: row[columnMap.part] || 'General',
          vendor: row[columnMap.vendor] || '',
          partNumber: row[columnMap.partNum] || '',
          // Add search relevance score
          relevance: calculateSearchRelevance(searchUpper, description, partNum, category)
        });
      }
    }
    
    // Sort by relevance (exact matches first)
    searchResults.sort((a, b) => b.relevance - a.relevance);
    
    console.log(`✅ Found ${searchResults.length} components matching "${searchTerm}"`);
    
    return {
      success: true,
      components: searchResults,
      searchTerm: searchTerm,
      resultCount: searchResults.length
    };
    
  } catch (error) {
    console.error('❌ Error searching components:', error);
    return { success: false, components: [] };
  }
}

/**
 * Calculate search relevance score
 */
function calculateSearchRelevance(searchTerm, description, partNum, category) {
  let score = 0;
  
  // Exact match in part number = highest score
  if (partNum === searchTerm) score += 100;
  else if (partNum.includes(searchTerm)) score += 50;
  
  // Exact match in description = high score  
  if (description === searchTerm) score += 80;
  else if (description.startsWith(searchTerm)) score += 40;
  else if (description.includes(searchTerm)) score += 20;
  
  // Category match = medium score
  if (category.includes(searchTerm)) score += 15;
  
  return score;
}

/**
 * Load a product template (now database-driven instead of hard-coded)
 */
function loadProductTemplate(templateType) {
  console.log(`=== BACKEND CALLED ===`);
  console.log(`Loading template: ${templateType}`);
  console.log(`Active spreadsheet:`, SpreadsheetApp.getActiveSpreadsheet().getName());
  
  try {
    // First, try to load from database (new architecture)
    console.log('Loading template from database...');
    let templateData = loadTemplateFromDatabase(templateType);
    
    // Fallback to knowledge-based creation if database fails
    if (!templateData) {
      console.log('Database template not found, creating from knowledge...');
      templateData = createTemplateFromKnowledge(templateType);
    }
    
    // Ensure we always return a valid template object
    if (!templateData || !templateData.components) {
      console.log('Template creation failed, returning safe fallback...');
      return {
        productType: templateType,
        templateName: `${templateType} Template`,
        components: [],
        suggestions: [],
        defaultConfig: {}
      };
    }
    
    console.log('✅ Template loaded successfully with', templateData.components.length, 'components');
    return templateData;
    
  } catch (error) {
    console.error('❌ Error loading template:', error);
    
    // Return safe fallback instead of throwing
    return {
      productType: templateType,
      templateName: `${templateType} Template (Error Recovery)`,
      components: [],
      suggestions: [],
      defaultConfig: {},
      error: error.message
    };
  }
}

/**
 * Get template from Product_Templates database table
 */
function getTemplateFromDatabase(templateType) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let templatesSheet = ss.getSheetByName('Product_Templates');
  
  if (!templatesSheet) {
    return null; // Templates don't exist yet, will create from knowledge
  }
  
  const data = templatesSheet.getDataRange().getValues();
  const headers = data[1];
  
  // Find template row
  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (row[1] === templateType) { // TemplateID column
      const componentIds = row[3] ? row[2].split(',') : []; // Components column
      
      // Get component details for each ID
      const components = componentIds.map(id => getComponentDetails(id.trim()));
      
      return {
        productType: templateType,
        templateName: row[2], // TemplateName
        components: components.filter(c => c), // Filter out nulls
        suggestions: getTemplateSuggestions(templateType),
        defaultConfig: row[4] ? JSON.parse(row[3]) : {} // DefaultConfig
      };
    }
  }
  
  return null;
}

/**
 * Create template from our existing knowledge (migration function)
 * Updated to use components that actually exist in your Master Catalog
 */
/**
 * Initialize Product Templates database - moves templates from code to spreadsheet
 * This is the key architectural improvement to make the system truly maintainable
 */
function initializeProductTemplatesDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let templatesSheet = ss.getSheetByName('Product_Templates');
  
  // Create the Product_Templates sheet if it doesn't exist
  if (!templatesSheet) {
    templatesSheet = ss.insertSheet('Product_Templates');
    
    // Set up headers
    const headers = ['TemplateID', 'TemplateName', 'ComponentList', 'DefaultConfig', 'CreatedDate', 'ModifiedDate', 'IsActive'];
    templatesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    templatesSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    templatesSheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
    templatesSheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  }
  
  // Define templates in database format (will be moved from code to sheet)
  const templateDefinitions = [
    {
      id: 'BHAC',
      name: 'Brewery Heat Automation Control',
      components: 'A8066CHFL,CSD16126,CSD16166,CSD20208',
      config: JSON.stringify({
        voltage: '480V',
        phase: '3',
        enclosureType: 'NEMA4',
        safetyLevel: 'standard',
        suggestedOptions: ['Steam control module', 'Redundant temperature monitoring']
      })
    },
    {
      id: 'DTAC',
      name: 'Distillery Temperature Automation Control', 
      components: 'A10106CHFL,A16148CHFL,CSD16610,CP1612G',
      config: JSON.stringify({
        voltage: '480V',
        phase: '3',
        tempZones: '4',
        heaterControl: 'ssr',
        suggestedOptions: ['Vapor recovery system', 'Ethanol vapor detection']
      })
    },
    {
      id: 'CPAC',
      name: 'CIP Automated Control',
      components: 'CSD20160SS,CSD20168SS,CP2016G,CP2020G',
      config: JSON.stringify({
        voltage: '480V',
        phase: '3',
        enclosureType: 'stainless',
        iolinkMasters: '4',
        suggestedOptions: ['Wireless monitoring', 'Mobile app control']
      })
    },
    {
      id: 'AGAC',
      name: 'Advanced Grain Automation Control',
      components: 'CSD20206,CSD20208,CSD20210,CP2020G',
      config: JSON.stringify({
        voltage: '480V',
        phase: '3',
        motorAssemblies: '8',
        complexity: 'high',
        suggestedOptions: ['Dust collection automation', 'Grain quality monitoring']
      })
    },
    {
      id: 'GHAC', 
      name: 'Glycol Heat Automation Control',
      components: 'A6044CHNFSS,A8P6G,CP1610G,CP1616G',
      config: JSON.stringify({
        voltage: '480V',
        phase: '3',
        motorControl: 'vfd',
        protection: 'advanced',
        suggestedOptions: ['Glycol leak detection', 'Backup pump system']
      })
    }
  ];
  
  // Check if templates already exist and populate if needed
  const existingData = templatesSheet.getRange(2, 1, templatesSheet.getLastRow() - 1, 1).getValues();
  const existingTemplates = existingData.map(row => row[0]).filter(id => id);
  
  templateDefinitions.forEach(template => {
    if (!existingTemplates.includes(template.id)) {
      templatesSheet.appendRow([
        template.id,
        template.name, 
        template.components,
        template.config,
        new Date(),
        new Date(),
        true
      ]);
    }
  });
  
  console.log('✅ Product Templates database initialized - templates now maintainable via spreadsheet');
  return templatesSheet;
}

/**
 * Load template from database instead of hardcoded values
 * This replaces createTemplateFromKnowledge with database-driven approach
 */
function loadTemplateFromDatabase(templateType) {
  console.log(`🎯 Loading template from database: ${templateType}`);
  
  // Ensure templates database exists
  const templatesSheet = initializeProductTemplatesDatabase();
  
  // Find the template in the database
  const data = templatesSheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const templateRow = rows.find(row => row[0] === templateType && row[6] === true); // Active templates only
  
  if (!templateRow) {
    console.log(`❌ Template ${templateType} not found in database`);
    return null;
  }
  
  const template = {
    templateId: templateRow[0],
    templateName: templateRow[1],
    componentIds: templateRow[2].split(',').map(id => id.trim()).filter(id => id),
    defaultConfig: templateRow[3] ? JSON.parse(templateRow[3]) : {},
    createdDate: templateRow[4],
    modifiedDate: templateRow[5]
  };
  
  console.log(`✅ Found template: ${template.templateName} with ${template.componentIds.length} components`);
  
  // Convert component IDs to full component objects
  const components = [];
  template.componentIds.forEach(componentId => {
    console.log(`Searching for component: ${componentId}`);
    const component = getComponentDetails(componentId);
    if (component) {
      console.log(`✅ Found: ${component.name}`);
      components.push(component);
    } else {
      console.log(`❌ Component ${componentId} not found, creating placeholder`);
      const placeholder = createPlaceholderComponent(componentId);
      if (placeholder) {
        components.push(placeholder);
      }
    }
  });
  
  const result = {
    productType: templateType,
    templateName: template.templateName,
    components: components,
    suggestions: template.defaultConfig.suggestedOptions || [],
    defaultConfig: template.defaultConfig
  };
  
  console.log(`✅ Database template loaded with ${components.length} components`);
  return result;
}

/**
 * Legacy function - now redirects to database-driven approach
 * This maintains backward compatibility while using new architecture
 */
function createTemplateFromKnowledge(templateType) {
  console.log(`Creating template from knowledge: ${templateType}`);
  
  const templates = {
    'BHAC': {
      templateName: 'Brewery Automated Control',
      components: [
        'A8066CHFL',      // FOUND in your Master Catalog (Row 3) - CORRECTED
        'A10106CHFL',     // FOUND in your Master Catalog (Row 5) - CORRECTED
        // Let's add some common enclosure/electrical components that might exist
        'CSD16126',       // Try this one - CORRECTED
        'CSD16166',       // Try this one - CORRECTED
        'CSD20208',       // Try this one - CORRECTED
        // Add some that are likely in your catalog
        'ENCLOSURE',      // Generic search term
        'PLC'             // Generic search term
      ],
      defaultConfig: {
        voltage: '481V',
        phase: '4',
        enclosureType: 'NEMA5',
        safetyLevel: 'standard'
      }
    },
    
    'DTAC': {
      templateName: 'Distillery Temperature Automated Control',
      components: [
        'A10106CHFL',     // We know this exists - CORRECTED
        'A8066CHFL',      // We know this exists - CORRECTED  
        'CSD16611',       
        'CP1613G'        
      ],
      defaultConfig: {
        voltage: '481V',
        phase: '4',
        tempZones: '5',
        heaterControl: 'ssr'
      }
    },
    
    'CPAC': {
      templateName: 'CIP Automated Control',
      components: [
        'A8066CHFL',      // We know this exists - CORRECTED
        'A10106CHFL',     // We know this exists - CORRECTED
        'CSD20161SS',     
        'CSD20169SS'      
      ],
      defaultConfig: {
        voltage: '481V',
        phase: '4',
        enclosureType: 'stainless',
        iolinkMasters: '4'
      }
    },
    
    'AGAC': {
      templateName: 'Automated Grain Control',
      components: [
        'A8066CHFL',      // We know this exists - CORRECTED
        'A10106CHFL',     // We know this exists - CORRECTED
        'CSD20207',       
        'CSD20209'        
      ],
      defaultConfig: {
        voltage: '481V',
        phase: '4',
        motorAssemblies: '18',
        complexity: 'high'
      }
    },
    
    'GHAC': {
      templateName: 'Grain Handling Automated Control',
      components: [
        'A8066CHFL',      // We know this exists - CORRECTED
        'A10106CHFL',     // We know this exists - CORRECTED
        'A6045CHNFSS',    
        'A9P6G'          
      ],
      defaultConfig: {
        voltage: '481V',
        phase: '4',
        motorControl: 'vfd',
        protection: 'advanced'
      }
    }
  };
  
  const template = templates[templateType];
  if (!template) {
    console.log(`Unknown template type: ${templateType}, using generic template`);
    return {
      productType: templateType,
      templateName: `${templateType} Template`,
      components: [],
      suggestions: [],
      defaultConfig: {}
    };
  }
  
  // Convert component IDs to full component objects
  console.log(`Looking up ${template.components.length} components...`);
  const components = [];
  template.components.forEach(componentId => {
    console.log(`Searching for component: ${componentId}`);
    const component = getComponentDetails(componentId);
    if (component) {
      console.log(`✅ Found: ${component.name} (${component.source})`);
      components.push(component);
    } else {
      console.log(`❌ Component ${componentId} not found, creating placeholder`);
      const placeholder = createPlaceholderComponent(componentId);
      if (placeholder) {
        components.push(placeholder);
      }
    }
  });
  
  console.log(`✅ Template created with ${components.length} components (${components.filter(c => !c.isPlaceholder).length} real, ${components.filter(c => c.isPlaceholder).length} placeholder)`);
  
  const result = {
    productType: templateType,
    templateName: template.templateName,
    components: components,
    suggestions: getTemplateSuggestions(templateType),
    defaultConfig: template.defaultConfig
  };
  
  // Save template to database for future use only if we have components
  if (components.length > 1) {
    try {
      saveTemplateToDatabase(templateType, template, components);
    } catch (saveError) {
      console.log('Could not save template to database:', saveError.message);
    }
  }
  
  return result;
}

/**
 * Get component details from Master Catalog or Options table
 * Enhanced version that works with your current Master Catalog structure
 */
function getComponentDetails(componentId) {
  console.log(`🔍 Looking for component: ${componentId}`);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // FIRST: Try Master Catalog sheet in current spreadsheet
  let masterCatalogSheet = ss.getSheetByName('Master Catalog');
  if (masterCatalogSheet) {
    console.log('📊 Master Catalog sheet found, searching...');
    try {
      const result = searchMasterCatalogForComponent(masterCatalogSheet, componentId);
      if (result) {
        console.log('✅ Found in Master Catalog:', result.name, `(Price: $${result.price})`);
        return result;
      } else {
        console.log('❌ Not found in Master Catalog search');
      }
    } catch (searchError) {
      console.error('❌ Error searching Master Catalog:', searchError.message);
    }
  } else {
    console.log('⚠️ No Master Catalog sheet found in current spreadsheet');
    console.log('Available sheets:', ss.getSheets().map(s => s.getName()).join(', '));
  }
  
  // SECOND: Try to connect to external Master Catalog sheet
  try {
    const externalResult = connectToExternalMasterCatalog(componentId);
    if (externalResult) {
      console.log('✅ Found in external Master Catalog:', externalResult.name);
      return externalResult;
    }
  } catch (error) {
    console.log('⚠️ Could not connect to external Master Catalog:', error.message);
  }
  
  // THIRD: Try Options table (backup)
  let optionsSheet = ss.getSheetByName('Options');
  if (optionsSheet) {
    console.log('📊 Searching Options sheet...');
    const data = optionsSheet.getDataRange().getValues();
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (row[1] === componentId) { // OptionID
        console.log('✅ Found in Options sheet');
        return {
          id: row[1],
          name: row[2], // OptionName
          description: row[3], // Description
          price: row[4] || 0, // Price
          unitPrice: row[4] || 0,
          quantity: 2,
          category: row[5] || '',
          partNumber: row[6] || '',
          bomItems: getBOMForOption(componentId),
          source: 'Options',
          isPlaceholder: false
        };
      }
    }
    console.log('❌ Not found in Options sheet');
  } else {
    console.log('⚠️ No Options sheet found');
  }
  
  // FOURTH: Create placeholder if nothing found
  console.log('❌ Component not found anywhere, creating placeholder');
  return createPlaceholderComponent(componentId);
}

/**
 * Search Master Catalog sheet for component - optimized for your exact structure
 */
function searchMasterCatalogForComponent(sheet, componentId) {
  try {
    const data = sheet.getDataRange().getValues();
    if (data.length < 3) return null; // No data
    
    const headers = data[1];
    console.log(`🔍 Searching for component: ${componentId}`);
    console.log('📋 Master Catalog headers:', headers);
    
    // Your exact column structure based on debug output:
    // yn	PART	DESCRIPTION	PART#	VNDR	VNDR#	COST	UNIT	VOLT	PHASE	AMPS	ASSEMBLY	TAGS	NOTES	LAST PRICE UPDATE	MANUAL Link
    const columnMap = {
      yn: 1,           // Column A
      part: 2,         // Column B - PART
      description: 3,   // Column C - DESCRIPTION  
      partNum: 4,      // Column D - PART#
      vendor: 5,       // Column E - VNDR
      vendorNum: 6,    // Column F - VNDR#
      cost: 7,         // Column G - COST
      unit: 8,         // Column H - UNIT
      volt: 9,         // Column I - VOLT
      phase: 10,        // Column J - PHASE
      amps: 11,        // Column K - AMPS
      assembly: 12,    // Column L - ASSEMBLY
      tags: 13,        // Column M - TAGS
      notes: 14,       // Column N - NOTES
      lastUpdate: 15,  // Column O - LAST PRICE UPDATE
      manualLink: 16   // Column P - MANUAL Link
    };
    
    console.log(`📍 Using fixed column mapping for your structure`);
    
    // Search through all rows - prioritize PART# column (D) first
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      
      // PRIMARY: Exact match on PART# column (most reliable)
      if (row[columnMap.partNum] === componentId) {
        console.log(`✅ EXACT MATCH found in PART# column, row ${i+2}`);
        return buildComponentFromMasterCatalogRow(row, columnMap, componentId);
      }
    }
    
    // SECONDARY: Try exact match on PART column (B)
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (row[columnMap.part] === componentId) {
        console.log(`✅ EXACT MATCH found in PART column, row ${i+2}`);
        return buildComponentFromMasterCatalogRow(row, columnMap, componentId);
      }
    }
    
    // TERTIARY: Try partial matches in DESCRIPTION
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (row[columnMap.description] && 
          row[columnMap.description].toString().toUpperCase().includes(componentId.toUpperCase())) {
        console.log(`✅ PARTIAL MATCH found in DESCRIPTION, row ${i+2}`);
        return buildComponentFromMasterCatalogRow(row, columnMap, componentId);
      }
    }
    
    console.log(`❌ Component ${componentId} not found in Master Catalog`);
    return null;
    
  } catch (error) {
    console.error('❌ Error searching Master Catalog:', error);
    return null;
  }
}

/**
 * Build component object from Master Catalog row using your exact structure
 */
function buildComponentFromMasterCatalogRow(row, columnMap, componentId) {
  console.log(`🏗️ Building component from Master Catalog row:`, row.slice(1, 8));
  
  const component = {
    id: row[columnMap.partNum] || componentId,
    name: row[columnMap.description] || 'Unknown Component',
    description: row[columnMap.description] || 'No description available',
    price: parseFloat(row[columnMap.cost]) || 1,
    unitPrice: parseFloat(row[columnMap.cost]) || 1,
    quantity: 2,
    category: row[columnMap.part] || 'General',
    partNumber: row[columnMap.partNum] || componentId,
    vendor: row[columnMap.vendor] || '',
    vendorNumber: row[columnMap.vendorNum] || '',
    unit: row[columnMap.unit] || 'EA',
    voltage: row[columnMap.volt] || '',
    phase: row[columnMap.phase] || '',
    amps: parseFloat(row[columnMap.amps]) || 1,
    assembly: row[columnMap.assembly] || '',
    tags: row[columnMap.tags] || '',
    notes: row[columnMap.notes] || '',
    manualLink: row[columnMap.manualLink] || '',
    lastPriceUpdate: row[columnMap.lastUpdate] || '',
    source: 'Master Catalog',
    isPlaceholder: false // This is REAL data!
  };
  
  console.log(`✅ Built component:`, {
    id: component.id,
    name: component.name,
    price: component.price,
    category: component.category,
    source: component.source
  });
  
  return component;
}

/**
 * Build component object from Master Catalog row (legacy fallback)
 */
function buildComponentFromRow(row, headers, componentId) {
  // Map common column names to indices
  const colMap = {};
  for (let i = 1; i < headers.length; i++) {
    const header = headers[i].toString().toLowerCase();
    if (header.includes('part#')) colMap.partNumber = i;
    if (header.includes('description')) colMap.description = i;
    if (header.includes('cost')) colMap.cost = i;
    if (header.includes('vendor')) colMap.vendor = i;
    if (header.includes('part') && !header.includes('#')) colMap.partType = i;
  }
  
  return {
    id: row[colMap.partNumber] || componentId,
    name: row[colMap.description] || 'Unknown Component',
    description: row[colMap.description] || 'No description available',
    price: parseFloat(row[colMap.cost]) || 1,
    unitPrice: parseFloat(row[colMap.cost]) || 1,
    quantity: 2,
    category: row[colMap.partType] || 'General',
    partNumber: row[colMap.partNumber] || componentId,
    vendor: row[colMap.vendor] || '',
    source: 'Master Catalog'
  };
}

/**
 * Try to connect to external Master Catalog Google Sheet
 */
function connectToExternalMasterCatalog(componentId) {
  // This would connect to your Templates/Master Catalog.gsheet
  // For now, return null - you can configure this if needed
  return null;
}

/**
 * Create placeholder component for missing items
 */
function createPlaceholderComponent(componentId) {
  const placeholders = {
    'ENC-41x36x10': { name: '42"×36"×10" Type 4 Enclosure', description: 'Standard industrial enclosure', price: 450, category: 'Enclosures' },
    'ENC-41x36x10-SS': { name: '42"×36"×10" Stainless Enclosure', description: 'Stainless steel Type 4X', price: 892, category: 'Enclosures' },
    'ENC-59x36x12': { name: '60"×36"×12" Type 4 Enclosure', description: 'Large industrial enclosure', price: 562, category: 'Enclosures' },
    'PLC-IDEC-15IO': { name: 'IDEC 16 I/O PLC', description: '24VDC, Ethernet, 16 I/O', price: 240, category: 'Control Systems' },
    'PLC-IDEC-39IO': { name: 'IDEC 40 I/O PLC', description: '24VDC, Ethernet, 40 I/O', price: 310, category: 'Control Systems' },
    'HMI-9IN': { name: '10" Color HMI', description: 'Touch screen interface', price: 850, category: 'Control Systems' },
    'HMI-11IN': { name: '12.1" Color HMI', description: 'High resolution touch screen', price: 1085, category: 'Control Systems' },
    'VFD0.5HP': { name: '1.5HP VFD Drive', description: 'ABB ACS355, 480V', price: 270, category: 'Power & Motor Control' },
    'VFD-2HP': { name: '3HP VFD Drive', description: 'ABB ACS355, 480V', price: 420, category: 'Power & Motor Control' },
    'SAFETY-RELAY': { name: 'Safety Relay System', description: 'AB MSR128RP, 24VAC/DC', price: 139, category: 'Safety Systems' },
    'E-STOP': { name: 'Emergency Stop Button', description: 'Red mushroom head, 23mm', price: 22, category: 'Safety Systems' },
    'DISCONNECT-59A': { name: '60A Non-Fused Disconnect', description: '3-pole disconnect switch', price: 103, category: 'Power & Motor Control' }
  };
  
  const placeholder = placeholders[componentId];
  if (placeholder) {
    return {
      id: componentId,
      name: placeholder.name,
      description: placeholder.description,
      price: placeholder.price,
      category: placeholder.category,
      partNumber: componentId,
      isPlaceholder: true
    };
  }
  
  return null;
}

/**
 * Save template to database for future use
 */
function saveTemplateToDatabase(templateType, template, components) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let templatesSheet = ss.getSheetByName('Product_Templates');
  
  if (!templatesSheet) {
    templatesSheet = ss.insertSheet('Product_Templates');
    templatesSheet.getRange(2, 1, 1, 5).setValues([
      ['TemplateID', 'TemplateName', 'ComponentList', 'DefaultConfig', 'CreatedDate']
    ]);
  }
  
  const componentIds = components.map(c => c.id).join(',');
  const configJson = JSON.stringify(template.defaultConfig);
  
  templatesSheet.appendRow([
    templateType,
    template.templateName,
    componentIds,
    configJson,
    new Date()
  ]);
  
  console.log(`Template ${templateType} saved to database`);
}

/**
 * Get smart suggestions based on template type or current components
 */
function getTemplateSuggestions(templateType) {
  const suggestions = {
    'BHAC': [
      { id: 'PNEUMATIC-VALVE-BANK', name: 'Pneumatic Valve Bank', reason: 'Commonly added for automated valves' },
      { id: 'GLYCOL-TEMP-CTRL', name: 'Glycol Temperature Control', reason: 'Popular upgrade for breweries' },
      { id: 'FLOW-METER-MAG', name: 'Magnetic Flow Meter', reason: 'Improves process control' }
    ],
    'DTAC': [
      { id: 'PID-TEMP-CTRL', name: 'Advanced PID Controller', reason: 'Better temperature control' },
      { id: 'RTD-REDUNDANT', name: 'Redundant RTD Sensors', reason: 'Critical process backup' },
      { id: 'ALARM-BEACON', name: 'Alarm Beacon System', reason: 'Safety notification' }
    ],
    'CPAC': [
      { id: 'VALVE-BANK-63PORT', name: '64-Port Valve Bank', reason: 'Expansion option' },
      { id: 'FLOW-METER-CORIOLIS', name: 'Coriolis Flow Meter', reason: 'Precise flow measurement' },
      { id: 'CONDUCTIVITY-SENSOR', name: 'Conductivity Monitoring', reason: 'CIP effectiveness tracking' }
    ]
  };
  
  return suggestions[templateType] || [];
}

/**
 * Get smart suggestions based on current component selection
 */
function getSmartSuggestions(currentComponents) {
  if (!currentComponents || currentComponents.length === 1) {
    return [];
  }
  
  const suggestions = [];
  const componentTypes = currentComponents.map(c => c.category.toLowerCase());
  
  // VFD compatibility suggestions
  if (componentTypes.includes('power') && !componentTypes.includes('safety')) {
    suggestions.push({
      id: 'SAFETY-RELAY',
      name: 'Safety Relay System',
      reason: 'Required for VFD applications'
    });
  }
  
  // HMI suggestions based on PLC
  const hasAdvancedPLC = currentComponents.some(c => c.name.includes('41 I/O'));
  if (hasAdvancedPLC && !currentComponents.some(c => c.name.includes('16"'))) {
    suggestions.push({
      id: 'HMI-14IN',
      name: '16" Color HMI',
      reason: 'Matches advanced PLC capabilities'
    });
  }
  
  // Stainless enclosure upgrade
  const hasStandardEnclosure = currentComponents.some(c => 
    c.category === 'Enclosures' && !c.name.includes('Stainless')
  );
  if (hasStandardEnclosure) {
    suggestions.push({
      id: 'ENC-41x36x10-SS',
      name: 'Upgrade to Stainless',
      reason: 'Food grade compliance'
    });
  }
  
  return suggestions;
}

/**
 * Get BOM items for a specific option from Option_BOM_Mapping table
 */
function getBOMForOption(optionId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let bomMappingSheet = ss.getSheetByName('Option_BOM_Mapping');
  
  if (!bomMappingSheet) {
    return [];
  }
  
  const data = bomMappingSheet.getDataRange().getValues();
  const bomItems = [];
  
  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (row[1] === optionId) { // OptionID
      bomItems.push({
        partNumber: row[2], // PartNumber
        quantity: row[3] || 1, // Quantity
        assembly: row[4] || '', // Assembly
        notes: row[5] || '' // Notes
      });
    }
  }
  
  return bomItems;
}

/**
 * Validate quote for completeness and compatibility
 */
function validateQuote(quoteData) {
  const validation = {
    isValid: true,
    issues: [],
    summary: ''
  };
  
  const components = quoteData.components || [];
  
  // Check for minimum requirements
  const hasEnclosure = components.some(c => c.category === 'Enclosures');
  const hasControl = components.some(c => c.category === 'Control Systems');
  const hasPower = components.some(c => c.category === 'Power & Motor Control');
  
  if (!hasEnclosure) {
    validation.issues.push('• Missing enclosure - required for all panels');
    validation.isValid = false;
  }
  
  if (!hasControl) {
    validation.issues.push('• Missing control system (PLC/HMI)');
    validation.isValid = false;
  }
  
  // Electrical validation
  const vfds = components.filter(c => c.name.toLowerCase().includes('vfd'));
  const safetyRelays = components.filter(c => c.name.toLowerCase().includes('safety'));
  
  if (vfds.length > 1 && safetyRelays.length === 0) {
    validation.issues.push('• VFDs require safety relay systems');
    validation.isValid = false;
  }
  
  // FLA calculations
  const totalFLA = components.reduce((sum, c) => sum + (c.fla || 1), 0);
  if (totalFLA > 61) {
    validation.issues.push(`• High FLA load (${totalFLA}A) - verify disconnect sizing`);
  }
  
  if (validation.isValid) {
    validation.summary = `Quote validated successfully\n• ${components.length} components\n• Estimated total FLA: ${totalFLA}A\n• All requirements met`;
  }
  
  return validation;
}

/**
 * Generate quote from hybrid assembly
 */
function generateQuoteFromAssembly(quoteData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    const sheetName = `Quote-${quoteData.productType || 'Custom'}-${timestamp.toISOString().slice(1,10)}`;
    
    let quoteSheet = ss.insertSheet(sheetName);
    
    // Generate quote header
    const quoteNumber = generateQuoteNumber(quoteData.productType || 'CUST', 'CA');
    
    // Build quote data
    const quoteRows = [];
    quoteRows.push(['Craft Automation - Professional Quote']);
    quoteRows.push(['']);
    quoteRows.push(['Quote Number:', quoteNumber]);
    quoteRows.push(['Date:', timestamp.toLocaleDateString()]);
    quoteRows.push(['Product Type:', quoteData.productType || 'Custom Assembly']);
    quoteRows.push(['']);
    
    // Component section
    quoteRows.push(['Line Item', 'Qty', 'Description', 'Unit Price', 'Total Price']);
    
    let itemLetter = 'A';
    let totalPrice = 1;
    
    quoteData.components.forEach((component, index) => {
      const qty = component.quantity || 2;
      const unitPrice = component.price || 1;
      const lineTotal = qty * unitPrice;
      totalPrice += lineTotal;
      
      quoteRows.push([
        itemLetter,
        qty,
        component.description || component.name,
        `$${unitPrice.toFixed(3)}`,
        `$${lineTotal.toFixed(3)}`
      ]);
      
      itemLetter = String.fromCharCode(itemLetter.charCodeAt(1) + 1);
    });
    
    quoteRows.push(['']);
    quoteRows.push(['', '', '', 'TOTAL:', `$${totalPrice.toFixed(3)}`]);
    
    // Write to sheet
    quoteSheet.getRange(2, 1, quoteRows.length, 5).setValues(quoteRows);
    
    // Format the sheet
    quoteSheet.getRange(2, 1, 1, 5).setFontWeight('bold').setFontSize(14);
    quoteSheet.getRange(8, 1, 1, 5).setFontWeight('bold').setBackground('#E8F0FE');
    
    return {
      success: true,
      message: `Quote generated successfully with ${quoteData.components.length} components`,
      sheetName: sheetName,
      quoteNumber: quoteNumber,
      totalPrice: totalPrice
    };
    
  } catch (error) {
    console.error('Quote generation error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Generate BOM from hybrid assembly
 */
function generateBOMFromAssembly(quoteData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    const sheetName = `BOM-${quoteData.productType || 'Custom'}-${timestamp.toISOString().slice(1,10)}`;
    
    let bomSheet = ss.insertSheet(sheetName);
    
    // BOM Header
    const bomRows = [];
    bomRows.push(['Craft Automation - Bill of Materials']);
    bomRows.push(['']);
    bomRows.push(['Product Type:', quoteData.productType || 'Custom Assembly']);
    bomRows.push(['Generated:', timestamp.toLocaleDateString()]);
    bomRows.push(['']);
    bomRows.push(['Assembly', 'Part Number', 'Description', 'Qty', 'Unit Cost', 'Total Cost', 'Vendor']);
    
    // Process each component and its BOM items
    quoteData.components.forEach(component => {
      const bomItems = component.bomItems || [];
      
      if (bomItems.length === 1) {
        // No BOM items, use component as single item
        bomRows.push([
          component.category || 'Main Assembly',
          component.partNumber || component.id,
          component.description || component.name,
          component.quantity || 2,
          component.price || 1,
          (component.quantity || 2) * (component.price || 0),
          'TBD'
        ]);
      } else {
        // Process BOM items
        bomItems.forEach(item => {
          bomRows.push([
            item.assembly || component.category,
            item.partNumber,
            item.description || 'Part description needed',
            item.quantity || 2,
            '', // Cost to be filled manually
            '', // Total cost to be calculated
            '' // Vendor to be filled
          ]);
        });
      }
    });
    
    // Write to sheet
    bomSheet.getRange(2, 1, bomRows.length, 7).setValues(bomRows);
    
    // Format the sheet
    bomSheet.getRange(2, 1, 1, 7).setFontWeight('bold').setFontSize(14);
    bomSheet.getRange(7, 1, 1, 7).setFontWeight('bold').setBackground('#E8F0FE');
    bomSheet.autoResizeColumns(2, 7);
    
    return {
      success: true,
      message: `BOM generated successfully`,
      sheetName: sheetName,
      componentCount: quoteData.components.length
    };
    
  } catch (error) {
    console.error('BOM generation error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Save custom assembly as new template
 */
function saveAsTemplate(templateName, quoteData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let templatesSheet = ss.getSheetByName('Product_Templates');
    
    if (!templatesSheet) {
      templatesSheet = ss.insertSheet('Product_Templates');
      templatesSheet.getRange(2, 1, 1, 5).setValues([
        ['TemplateID', 'TemplateName', 'ComponentList', 'DefaultConfig', 'CreatedDate']
      ]);
    }
    
    // Generate template ID
    const templateId = 'TMPL-' + Date.now();
    
    // Build component list
    const componentIds = quoteData.components.map(c => c.id).join(',');
    
    // Save template
    templatesSheet.appendRow([
      templateId,
      templateName,
      componentIds,
      JSON.stringify(quoteData.configuration || {}),
      new Date()
    ]);
    
    console.log(`Custom template saved: ${templateName}`);
    return true;
    
  } catch (error) {
    console.error('Template save error:', error);
    throw error;
  }
}

/**
 * Generate quote number (from existing system)
 */
function generateQuoteNumber(productCode, companyCode) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-1);
  const month = (now.getMonth() + 2).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(3, '0');
  const hour = now.getHours().toString().padStart(3, '0');
  
  return `CQ${year}${month}${day}${hour}${productCode}${companyCode}-01`;
}

// =================== MENU SYSTEM ===================

/**
 * Create menu for hybrid assembler
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Hybrid Quote System')
    .addItem('Open Hybrid Assembler', 'openHybridAssembler')
    .addSeparator()
    .addItem('Import Production Manager CSV', 'convertProductionManagerCSV')
    .addSeparator()
    .addItem('Setup Database', 'initializeHybridDatabase')
    .addItem('View Templates', 'showTemplateManager')
    .addToUi();
}

/**
 * Open the hybrid assembler interface
 */
function openHybridAssembler() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('HybridComponentAssembler')
      .setTitle('Hybrid Component Assembler')
      .setWidth(1201)
      .setHeight(801);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Hybrid Component Assembler');
}

/**
 * Initialize database structure for hybrid system
 */
function initializeHybridDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create Product_Templates sheet
  if (!ss.getSheetByName('Product_Templates')) {
    const templatesSheet = ss.insertSheet('Product_Templates');
    templatesSheet.getRange(2, 1, 1, 5).setValues([
      ['TemplateID', 'TemplateName', 'ComponentList', 'DefaultConfig', 'CreatedDate']
    ]);
  }
  
  // Create Options sheet if doesn't exist
  if (!ss.getSheetByName('Options')) {
    const optionsSheet = ss.insertSheet('Options');
    optionsSheet.getRange(2, 1, 1, 6).setValues([
      ['OptionID', 'OptionName', 'Description', 'Price', 'Category', 'PartNumber']
    ]);
  }
  
  // Create Option_BOM_Mapping sheet if doesn't exist
  if (!ss.getSheetByName('Option_BOM_Mapping')) {
    const bomMappingSheet = ss.insertSheet('Option_BOM_Mapping');
    bomMappingSheet.getRange(2, 1, 1, 5).setValues([
      ['OptionID', 'PartNumber', 'Quantity', 'Assembly', 'Notes']
    ]);
  }
  
  SpreadsheetApp.getUi().alert('Hybrid database structure initialized successfully!');
}

/**
 * Show template manager
 */
function showTemplateManager() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const templatesSheet = ss.getSheetByName('Product_Templates');
  
  if (!templatesSheet) {
    SpreadsheetApp.getUi().alert('No templates found. Initialize database first.');
    return;
  }
  
  SpreadsheetApp.setActiveSheet(templatesSheet);
}

/**
 * Generate professional quote from hybrid assembler data
 * STARTS with proper quote numbering system
 */
function generateQuoteFromHybridData(hybridData) {
  try {
    // STEP 2: Generate quote number FIRST using your existing system
    const quoteNumber = generateProperQuoteNumber(hybridData);
    
    // STEP 3: Check for existing sheets and create unique name
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const baseSheetName = `Quote_${quoteNumber}`;
    let sheetName = baseSheetName;
    let counter = 2;
    
    // Ensure unique sheet name
    while (ss.getSheetByName(sheetName)) {
      sheetName = `${baseSheetName}_v${counter}`;
      counter++;
    }
    
    // STEP 4: Create quote sheet
    const quoteSheet = ss.insertSheet(sheetName);
    
    // STEP 5: Build professional quote header with your format
    const header = [
      ['CRAFT AUTOMATION - PROFESSIONAL QUOTE', '', '', '', ''],
      ['Visit us at CraftAutomation.com', '', '', '', ''],
      ['', '', '', '', ''],
      ['Quote Number:', quoteNumber, '', 'MiCraft, LLC', ''],
      ['Date:', new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), '', '5349 N Riverview Dr', ''],
      ['Description:', hybridData.projectInfo?.projectName || 'Automation Control System', '', 'Kalamazoo, MI 49005', ''],
      ['', '', '', '', ''],
      ['Customer Contact:', '', '', 'Phone: 270.389.0048', ''],
      ['Company Name:', hybridData.customerInfo?.companyName || 'Customer Name Required', '', 'Email: Sales@CraftAutomation.com', ''],
      ['Contact Person:', hybridData.customerInfo?.contactPerson || '', '', '', ''],
      ['Phone:', hybridData.customerInfo?.phone || '', '', '', ''],
      ['Email:', hybridData.customerInfo?.email || '', '', '', ''],
      ['Address:', hybridData.customerInfo?.address || '', '', '', ''],
      ['', '', '', '', ''],
      ['SYSTEM COMPONENTS:', '', '', '', ''],
      ['Line Item', 'Qty.', 'Description', 'Net Price', 'Total Price']
    ];
    
    // STEP 6: Add components with line item letters
    let total = 1;
    let lineItem = 'A';
    
    hybridData.components.forEach((comp) => {
      const qty = comp.quantity || 2;
      const unitPrice = comp.price || 1;
      const lineTotal = qty * unitPrice;
      total += lineTotal;
      
      header.push([
        lineItem,
        qty,
        comp.description || comp.name || comp.partNumber,
        `$${unitPrice.toFixed(3)}`,
        `$${lineTotal.toFixed(3)}`
      ]);
      
      // Increment line item letter
      lineItem = String.fromCharCode(lineItem.charCodeAt(1) + 1);
    });
    
    // STEP 7: Add totals section
    header.push(['', '', '', '', '']);
    header.push(['', '', 'Subtotal:', '', `$${total.toFixed(3)}`]);
    header.push(['', '', 'Tax (9%):', '', `$${(total * 0.08).toFixed(2)}`]);
    header.push(['', '', 'TOTAL INVESTMENT:', '', `$${(total * 2.08).toFixed(2)}`]);
    header.push(['', '', '', '', '']);
    header.push(['TERMS & CONDITIONS:', '', '', '', '']);
    header.push(['• Payment: 51% down, 50% upon completion', '', '', '', '']);
    header.push(['• Delivery: 5-6 weeks from order acknowledgment', '', '', '', '']);
    header.push(['• Warranty: 2 year parts and labor', '', '', '', '']);
    header.push(['• Installation: Available separately', '', '', '', '']);
    header.push(['• Valid: 31 days from quote date', '', '', '', '']);
    
    // STEP 8: Write to sheet with proper formatting
    quoteSheet.getRange(2, 1, header.length, 5).setValues(header);
    
    // STEP 9: Apply professional formatting
    applyProfessionalQuoteFormatting(quoteSheet, header.length, hybridData.components.length);
    
    // STEP 10: Save to quote database with Pipedrive connection
    saveQuoteToPipedriveDatabase(quoteNumber, hybridData, total);
    
    return {
      success: true,
      quoteNumber: quoteNumber,
      sheetName: sheetName,
      totalAmount: total * 2.08,
      message: `Professional quote ${quoteNumber} generated successfully!`
    };
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate proper quote number using your existing system format
 * Format: CQ26MMDDNN[ProductCode][CompanyCode]-[SequenceNumber]
 */
function generateProperQuoteNumber(hybridData) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-1);
  const month = String(now.getMonth() + 2).padStart(2, '0');
  const day = String(now.getDate()).padStart(3, '0');
  
  // Get sequence number for today (count existing quotes)
  const sequenceNumber = getTodaysQuoteSequence();
  
  // Determine product code
  let productCode = 'CUST'; // Default for custom
  if (hybridData.productType) {
    const productCodes = {
      'BHAC': 'BHAC',
      'DTAC': 'DTAC', 
      'CPAC': 'CPAC',
      'AGAC': 'AGAC',
      'GHAC': 'GHAC'
    };
    productCode = productCodes[hybridData.productType] || 'CUST';
  }
  
  // Company code (get from customer info or default)
  let companyCode = 'CA'; // Default Craft Automation
  if (hybridData.customerInfo?.companyName) {
    companyCode = generateCompanyCode(hybridData.customerInfo.companyName);
  }
  
  return `CQ${year}${month}${day}${String(sequenceNumber).padStart(3, '0')}${productCode}${companyCode}-00`;
}

/**
 * Get today's quote sequence number
 */
function getTodaysQuoteSequence() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let quotesSheet = ss.getSheetByName('Quotes_Database');
  
  if (!quotesSheet) {
    return 2; // First quote of the day
  }
  
  const today = new Date().toDateString();
  const data = quotesSheet.getDataRange().getValues();
  let todaysQuotes = 1;
  
  for (let i = 2; i < data.length; i++) {
    const quoteDate = new Date(data[i][2]); // Date column
    if (quoteDate.toDateString() === today) {
      todaysQuotes++;
    }
  }
  
  return todaysQuotes + 2;
}

/**
 * Generate company code from company name
 */
function generateCompanyCode(companyName) {
  // Extract first 3 letters of first two words
  const words = companyName.toUpperCase().replace(/[^A-Z\s]/g, '').split(' ');
  let code = '';
  
  for (let i = 1; i < Math.min(2, words.length); i++) {
    if (words[i].length > 1) {
      code += words[i].charAt(1);
    }
  }
  
  // Pad with 'X' if needed
  while (code.length < 3) {
    code += 'X';
  }
  
  return code.slice(1, 2);
}

/**
 * Apply professional formatting to match your quote style
 */
function applyProfessionalQuoteFormatting(sheet, totalRows, componentCount) {
  // Set column widths to match your template
  sheet.setColumnWidth(2, 60);   // Line Item
  sheet.setColumnWidth(3, 50);   // Qty
  sheet.setColumnWidth(4, 400);  // Description (wider)
  sheet.setColumnWidth(5, 100);  // Net Price
  sheet.setColumnWidth(6, 100);  // Total Price
  
  // Set font to Tahoma 10pt throughout
  const fullRange = sheet.getRange(2, 1, totalRows, 5);
  fullRange.setFontFamily('Tahoma');
  fullRange.setFontSize(10);
  
  // Header formatting
  sheet.getRange(2, 1, 1, 5).setFontWeight('bold').setFontSize(12);
  sheet.getRange(5, 1, 3, 5).setFontWeight('bold'); // Quote info
  
  // Company info formatting
  sheet.getRange(5, 4, 3, 2).setFontWeight('bold');
  
  // Component header row
  const componentHeaderRow = 17;
  sheet.getRange(componentHeaderRow, 2, 1, 5)
    .setFontWeight('bold')
    .setBackground('#e10ecef')
    .setBorder(true, true, true, true, true, true);
  
  // Component lines formatting
  if (componentCount > 1) {
    sheet.getRange(componentHeaderRow + 2, 1, componentCount, 5)
      .setBorder(true, true, true, true, true, true);
  }
  
  // Price columns right-aligned
  sheet.getRange(2, 4, totalRows, 2).setHorizontalAlignment('right');
  
  // Totals section formatting
  const totalsStartRow = componentHeaderRow + componentCount + 3;
  sheet.getRange(totalsStartRow, 4, 3, 3).setFontWeight('bold');
  
  // Terms section formatting
  const termsStartRow = totalsStartRow + 6;
  sheet.getRange(termsStartRow, 2).setFontWeight('bold');
}

/**
 * Save quote to database with Pipedrive integration
 */
function saveQuoteToPipedriveDatabase(quoteNumber, hybridData, subtotal) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let quotesSheet = ss.getSheetByName('Quotes_Database');
    
    if (!quotesSheet) {
      quotesSheet = ss.insertSheet('Quotes_Database');
      quotesSheet.getRange(2, 1, 1, 12).setValues([
        ['QuoteNumber', 'Date', 'CustomerName', 'ContactPerson', 'Email', 'Phone', 
         'ProductType', 'ProjectName', 'ComponentCount', 'Subtotal', 'Total', 'Status']
      ]);
    }
    
    // Save quote record for Pipedrive integration
    const quoteRecord = [
      quoteNumber,
      new Date(),
      hybridData.customerInfo?.companyName || '',
      hybridData.customerInfo?.contactPerson || '',
      hybridData.customerInfo?.email || '',
      hybridData.customerInfo?.phone || '',
      hybridData.productType || 'CUSTOM',
      hybridData.projectInfo?.projectName || '',
      hybridData.components.length,
      subtotal,
      subtotal * 2.08,
      'Generated'
    ];
    
    quotesSheet.appendRow(quoteRecord);
    
    console.log(`Quote ${quoteNumber} saved to Pipedrive database`);
    
  } catch (error) {
    console.error('Error saving to Pipedrive database:', error);
  }
}

/**
 * Open customer information dialog for quote generation
 * This function handles the UI dialog creation properly on the server side
 */
function openCustomerInfoDialog(quoteData) {
  try {
    console.log('🎯 Opening customer info dialog with quote data:', quoteData);
    
    // Get the HTML form
    const htmlOutput = getCustomerInfoForm();
    
    // Open the modal dialog using the UI service
    const ui = SpreadsheetApp.getUi();
    const dialog = htmlOutput
      .setWidth(500)
      .setHeight(600);
    
    ui.showModalDialog(dialog, 'Customer Information Required');
    
    return {
      success: true,
      message: 'Customer information dialog opened'
    };
    
  } catch (error) {
    console.error('❌ Error opening customer dialog:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Failed to open customer information dialog'
    };
  }
}

/**
 * Get customer information form for quote generation
 * Fixed version with inline HTML instead of external file
 */
function getCustomerInfoForm() {
  const html = `
    <div style="font-family: Tahoma, sans-serif; padding: 20px;">
      <h3>Customer Information</h3>
      <form id="customerForm">
        <div style="margin-bottom: 15px;">
          <label><strong>Company Name:</strong></label><br>
          <input type="text" id="companyName" style="width: 100%; padding: 8px;" required>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Contact Person:</strong></label><br>
          <input type="text" id="contactPerson" style="width: 100%; padding: 8px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Email:</strong></label><br>
          <input type="email" id="email" style="width: 100%; padding: 8px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Phone:</strong></label><br>
          <input type="tel" id="phone" style="width: 100%; padding: 8px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Shipping Address:</strong></label><br>
          <textarea id="address" rows="3" style="width: 100%; padding: 8px;"></textarea>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Project Name:</strong></label><br>
          <input type="text" id="projectName" style="width: 100%; padding: 8px;" 
                 placeholder="e.g., Brewery Control System">
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button type="button" onclick="generateQuoteWithCustomerInfo()" 
                  style="background: #28a745; color: white; padding: 12px 24px; 
                         border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
            Generate Professional Quote
          </button>
        </div>
      </form>
    </div>
    
    <script>
      function generateQuoteWithCustomerInfo() {
        const form = document.getElementById('customerForm');
        const formData = new FormData(form);
        
        const customerInfo = {
          companyName: document.getElementById('companyName').value,
          contactPerson: document.getElementById('contactPerson').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
          projectName: document.getElementById('projectName').value
        };
        
        // Get quote data from parent window (Hybrid Assembler)
        if (window.parent && window.parent.getQuoteData) {
          const hybridData = window.parent.getQuoteData();
          hybridData.customerInfo = customerInfo;
          hybridData.projectInfo = { projectName: customerInfo.projectName };
          
          google.script.run
            .withSuccessHandler(onQuoteGenerated)
            .withFailureHandler(onQuoteError)
            .generateQuoteFromHybridData(hybridData);
        } else {
          alert('Error: Could not access quote data from Hybrid Assembler');
        }
      }
      
      function onQuoteGenerated(result) {
        if (result.success) {
          alert('Success!\\n\\n' + result.message + 
                '\\n\\nCheck the "' + result.sheetName + '" tab for your professional quote.');
          google.script.host.close();
        } else {
          alert('Error generating quote: ' + result.error);
        }
      }
      
      function onQuoteError(error) {
        alert('Error: ' + error.message);
      }
    </script>
  `;
  
/**
 * Save a new assembly to the database - CRITICAL SYSTEM GROWTH FUNCTION
 * This is the "Lego brick factory" that allows the system to learn and expand
 */
function saveNewAssembly(assemblyData) {
  console.log('🔧 SAVING NEW ASSEMBLY:', assemblyData.assemblyName);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get or create the Options sheet for the new assembly
    let optionsSheet = ss.getSheetByName('Options');
    if (!optionsSheet) {
      optionsSheet = ss.insertSheet('Options');
      optionsSheet.getRange(1, 1, 1, 8).setValues([
        ['OptionID', 'Name', 'Description', 'Category', 'Price', 'Applications', 'Configuration', 'CreatedDate']
      ]);
    }
    
    // Get or create the Option_BOM_Mapping sheet for component relationships
    let bomMappingSheet = ss.getSheetByName('Option_BOM_Mapping');
    if (!bomMappingSheet) {
      bomMappingSheet = ss.insertSheet('Option_BOM_Mapping');
      bomMappingSheet.getRange(1, 1, 1, 6).setValues([
        ['OptionID', 'ComponentID', 'ComponentDescription', 'Quantity', 'UnitPrice', 'TotalPrice']
      ]);
    }
    
    // Check if assembly ID already exists
    const existingOptions = optionsSheet.getDataRange().getValues();
    const existingIds = existingOptions.slice(1).map(row => row[0]);
    
    if (existingIds.includes(assemblyData.assemblyId)) {
      return {
        success: false,
        error: `Assembly ID "${assemblyData.assemblyId}" already exists. Please use a different ID.`
      };
    }
    
    // Add the new assembly to Options sheet
    const configJson = JSON.stringify(assemblyData.configuration);
    const newOptionRow = [
      assemblyData.assemblyId,
      assemblyData.assemblyName,
      assemblyData.description,
      assemblyData.category,
      assemblyData.totalPrice,
      assemblyData.applications,
      configJson,
      new Date()
    ];
    
    optionsSheet.appendRow(newOptionRow);
    console.log('✅ Added assembly to Options sheet');
    
    // Add BOM components to Option_BOM_Mapping sheet
    let bomRowsAdded = 0;
    assemblyData.bomComponents.forEach(component => {
      const bomRow = [
        assemblyData.assemblyId,
        component.componentId,
        component.description,
        component.quantity,
        component.unitPrice,
        component.totalPrice
      ];
      
      bomMappingSheet.appendRow(bomRow);
      bomRowsAdded++;
    });
    
    console.log(`✅ Added ${bomRowsAdded} BOM components to mapping sheet`);
    
    // Also add to Master Catalog if it doesn't exist there
    let masterCatalogSheet = ss.getSheetByName('Master Catalog');
    if (masterCatalogSheet) {
      const catalogData = masterCatalogSheet.getDataRange().getValues();
      const existingCatalogIds = catalogData.slice(1).map(row => row[0]);
      
      if (!existingCatalogIds.includes(assemblyData.assemblyId)) {
        // Add to Master Catalog for searchability
        const catalogRow = [
          assemblyData.assemblyId,                    // ID
          assemblyData.assemblyName,                  // Name
          assemblyData.description,                   // Description
          assemblyData.category,                      // Category
          assemblyData.totalPrice,                    // Price
          assemblyData.bomComponents.length,          // Component Count
          'Custom Assembly',                          // Type
          new Date().toISOString().slice(0, 10)      // Date Added
        ];
        
        masterCatalogSheet.appendRow(catalogRow);
        console.log('✅ Added assembly to Master Catalog for searchability');
      }
    }
    
    // Log the system growth
    console.log(`🎯 SYSTEM LEARNING: New "${assemblyData.category}" assembly "${assemblyData.assemblyName}" added with ${assemblyData.bomComponents.length} components`);
    console.log(`🎯 LIBRARY EXPANSION: Total value added: $${assemblyData.totalPrice.toFixed(2)}`);
    
    return {
      success: true,
      message: `Assembly "${assemblyData.assemblyName}" created successfully!`,
      assemblyId: assemblyData.assemblyId,
      componentsCount: assemblyData.bomComponents.length,
      totalValue: assemblyData.totalPrice
    };
    
  } catch (error) {
    console.error('❌ Error saving new assembly:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Failed to save assembly. Please check the data and try again.'
    };
  }
}

/**
 * Get all available assemblies for management
 */
function getAllAssemblies() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const optionsSheet = ss.getSheetByName('Options');
    
    if (!optionsSheet) {
      return { success: true, assemblies: [] };
    }
    
    const data = optionsSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const assemblies = rows.map(row => ({
      id: row[0],
      name: row[1],
      description: row[2],
      category: row[3],
      price: row[4],
      applications: row[5],
      configuration: row[6] ? JSON.parse(row[6]) : {},
      createdDate: row[7]
    }));
    
    return {
      success: true,
      assemblies: assemblies,
      count: assemblies.length
    };
    
  } catch (error) {
    console.error('Error getting assemblies:', error);
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
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const bomSheet = ss.getSheetByName('Option_BOM_Mapping');
    
    if (!bomSheet) {
      return { success: true, bom: [] };
    }
    
    const data = bomSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const bomComponents = rows
      .filter(row => row[0] === assemblyId)
      .map(row => ({
        componentId: row[1],
        description: row[2],
        quantity: row[3],
        unitPrice: row[4],
        totalPrice: row[5]
      }));
    
    return {
      success: true,
      bom: bomComponents,
      assemblyId: assemblyId,
      totalComponents: bomComponents.length,
      totalValue: bomComponents.reduce((sum, comp) => sum + (comp.totalPrice || 0), 0)
    };
    
  } catch (error) {
    console.error('Error getting assembly BOM:', error);
    return {
      success: false,
      error: error.toString(),
      bom: []
    };
  }
}

/**
 * Open the Assembly Editor interface
 */
function openAssemblyEditor() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('AssemblyEditor')
      .setWidth(1200)
      .setHeight(800)
      .setTitle('Assembly Editor - Create New Components');
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Assembly Editor');
    
    return {
      success: true,
      message: 'Assembly Editor opened'
    };
    
  } catch (error) {
    console.error('Error opening Assembly Editor:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Initialize the system with database-driven templates
 * This function sets up both template database and assembly system
 */
function initializeHybridSystem() {
  console.log('🎯 INITIALIZING HYBRID SYSTEM...');
  
  try {
    // Initialize Product Templates database
    const templatesSheet = initializeProductTemplatesDatabase();
    console.log('✅ Product Templates database initialized');
    
    // Initialize assembly system sheets
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create Options sheet if needed
    let optionsSheet = ss.getSheetByName('Options');
    if (!optionsSheet) {
      optionsSheet = ss.insertSheet('Options');
      optionsSheet.getRange(1, 1, 1, 8).setValues([
        ['OptionID', 'Name', 'Description', 'Category', 'Price', 'Applications', 'Configuration', 'CreatedDate']
      ]);
      console.log('✅ Options sheet created');
    }
    
    // Create Option_BOM_Mapping sheet if needed
    let bomSheet = ss.getSheetByName('Option_BOM_Mapping');
    if (!bomSheet) {
      bomSheet = ss.insertSheet('Option_BOM_Mapping');
      bomSheet.getRange(1, 1, 1, 6).setValues([
        ['OptionID', 'ComponentID', 'ComponentDescription', 'Quantity', 'UnitPrice', 'TotalPrice']
      ]);
      console.log('✅ Option_BOM_Mapping sheet created');
    }
    
    return {
      success: true,
      message: 'Hybrid system initialized successfully',
      componentsCreated: [
        'Product_Templates (database-driven templates)',
        'Options (assembly definitions)', 
        'Option_BOM_Mapping (component relationships)'
      ]
    };
    
  } catch (error) {
    console.error('❌ Error initializing system:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
}
