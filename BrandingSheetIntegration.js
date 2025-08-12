/**
 * Google Sheets Integration for CraftQuote Branding System
 * Connects the branding editor with Google Sheets for data persistence
 * and Pipedrive API for CRM integration
 */

// Configuration Constants
const BRANDING_SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with actual Sheet ID
const BRANDING_SHEET_NAME = 'BrandingConfig';
const PIPEDRIVE_API_TOKEN = 'YOUR_PIPEDRIVE_TOKEN'; // Store in Script Properties instead
const PIPEDRIVE_COMPANY_DOMAIN = 'YOUR_COMPANY.pipedrive.com';

/**
 * Initialize the branding configuration sheet
 */
function initializeBrandingSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(BRANDING_SHEET_ID);
    let sheet = spreadsheet.getSheetByName(BRANDING_SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(BRANDING_SHEET_NAME);
      
      // Set up headers
      const headers = [
        ['Section', 'Key', 'Value', 'Description', 'Last Modified', 'Modified By']
      ];
      
      sheet.getRange(1, 1, 1, 6).setValues(headers);
      sheet.getRange(1, 1, 1, 6).setBackground('#4a90e2').setFontColor('white').setFontWeight('bold');
      
      // Initialize default configuration
      initializeDefaultBrandingData(sheet);
    }
    
    Logger.log('✅ Branding sheet initialized successfully');
    return sheet;
    
  } catch (error) {
    Logger.log('❌ Error initializing branding sheet: ' + error.toString());
    throw error;
  }
}

/**
 * Set up default branding configuration in the sheet
 */
function initializeDefaultBrandingData(sheet) {
  const defaultConfig = [
    ['App', 'name', 'CraftQuote', 'Application name', new Date(), Session.getActiveUser().getEmail()],
    ['App', 'tagline', 'Professional Automation Quote Builder', 'Application tagline', new Date(), Session.getActiveUser().getEmail()],
    ['App', 'icon', '🔧', 'Application icon', new Date(), Session.getActiveUser().getEmail()],
    ['App', 'company', 'Craft Automation Systems', 'Company name', new Date(), Session.getActiveUser().getEmail()],
    
    ['Colors', 'primary', '#4a90e2', 'Primary brand color', new Date(), Session.getActiveUser().getEmail()],
    ['Colors', 'primaryDark', '#357abd', 'Primary dark variant', new Date(), Session.getActiveUser().getEmail()],
    ['Colors', 'secondary', '#60a5fa', 'Secondary color', new Date(), Session.getActiveUser().getEmail()],
    ['Colors', 'accent', '#10b981', 'Accent color', new Date(), Session.getActiveUser().getEmail()],
    ['Colors', 'success', '#22c55e', 'Success color', new Date(), Session.getActiveUser().getEmail()],
    ['Colors', 'warning', '#f59e0b', 'Warning color', new Date(), Session.getActiveUser().getEmail()],
    ['Colors', 'danger', '#ef4444', 'Danger color', new Date(), Session.getActiveUser().getEmail()],
    
    ['ProductIcons', 'BHAC', '🍺', 'Brewery Automated Control icon', new Date(), Session.getActiveUser().getEmail()],
    ['ProductIcons', 'DTAC', '🥃', 'Distillery Temperature Control icon', new Date(), Session.getActiveUser().getEmail()],
    ['ProductIcons', 'CPAC', '🧽', 'CIP Automated Control icon', new Date(), Session.getActiveUser().getEmail()],
    ['ProductIcons', 'GHAC', '🌾', 'Grain Handling Control icon', new Date(), Session.getActiveUser().getEmail()],
    ['ProductIcons', 'AGAC', '🌾', 'Advanced Grain Control icon', new Date(), Session.getActiveUser().getEmail()],
    
    ['ActionIcons', 'add', '➕', 'Add action icon', new Date(), Session.getActiveUser().getEmail()],
    ['ActionIcons', 'remove', '❌', 'Remove action icon', new Date(), Session.getActiveUser().getEmail()],
    ['ActionIcons', 'edit', '✏️', 'Edit action icon', new Date(), Session.getActiveUser().getEmail()],
    ['ActionIcons', 'save', '💾', 'Save action icon', new Date(), Session.getActiveUser().getEmail()],
    ['ActionIcons', 'generate', '✨', 'Generate action icon', new Date(), Session.getActiveUser().getEmail()]
  ];
  
  sheet.getRange(2, 1, defaultConfig.length, 6).setValues(defaultConfig);
  
  // Format the sheet
  sheet.autoResizeColumns(1, 6);
  sheet.setFrozenRows(1);
}

/**
 * Load branding configuration from Google Sheets
 */
function loadBrandingFromSheet() {
  try {
    const sheet = SpreadsheetApp.openById(BRANDING_SHEET_ID).getSheetByName(BRANDING_SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Branding sheet not found. Please run initializeBrandingSheet() first.');
    }
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    const config = {
      app: {},
      colors: {},
      productCategories: {},
      icons: {},
      messages: {
        templateLauncher: "Quick Start with Smart Templates",
        templateDescription: "Load a proven template, then customize with full freedom",
        quoteConfiguration: "Quote Configuration",
        componentLibrary: "Component Library",
        smartSuggestions: "Smart Suggestions"
      }
    };
    
    // Process each row
    data.forEach(row => {
      const [section, key, value] = row;
      
      switch (section) {
        case 'App':
          config.app[key] = value;
          break;
        case 'Colors':
          config.colors[key] = value;
          break;
        case 'ProductIcons':
          if (!config.productCategories[key]) {
            config.productCategories[key] = {};
          }
          config.productCategories[key].icon = value;
          // Add default names and colors
          config.productCategories[key] = {
            ...config.productCategories[key],
            ...getDefaultProductInfo(key)
          };
          break;
        case 'ActionIcons':
          config.icons[key] = value;
          break;
      }
    });
    
    // Add standard icons
    config.icons = {
      ...config.icons,
      app: config.app.icon || '🔧',
      quote: '📋',
      component: '⚙️',
      template: '📋',
      info: '💡'
    };
    
    Logger.log('✅ Branding configuration loaded from sheet');
    return config;
    
  } catch (error) {
    Logger.log('❌ Error loading branding from sheet: ' + error.toString());
    
    // Return default configuration if sheet fails
    return getDefaultBrandingConfig();
  }
}

/**
 * Save branding configuration to Google Sheets
 */
function saveBrandingToSheet(config) {
  try {
    const sheet = SpreadsheetApp.openById(BRANDING_SHEET_ID).getSheetByName(BRANDING_SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Branding sheet not found. Please run initializeBrandingSheet() first.');
    }
    
    const timestamp = new Date();
    const user = Session.getActiveUser().getEmail();
    const updates = [];
    
    // Prepare updates array
    Object.entries(config.app || {}).forEach(([key, value]) => {
      updates.push(['App', key, value, getDescriptionForKey('App', key), timestamp, user]);
    });
    
    Object.entries(config.colors || {}).forEach(([key, value]) => {
      updates.push(['Colors', key, value, getDescriptionForKey('Colors', key), timestamp, user]);
    });
    
    Object.entries(config.productIcons || {}).forEach(([key, value]) => {
      updates.push(['ProductIcons', key, value, getDescriptionForKey('ProductIcons', key), timestamp, user]);
    });
    
    Object.entries(config.actionIcons || {}).forEach(([key, value]) => {
      updates.push(['ActionIcons', key, value, getDescriptionForKey('ActionIcons', key), timestamp, user]);
    });
    
    // Clear existing data and insert new data
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).clear();
    }
    
    if (updates.length > 0) {
      sheet.getRange(2, 1, updates.length, 6).setValues(updates);
    }
    
    Logger.log('✅ Branding configuration saved to sheet');
    
    // Trigger Pipedrive sync if enabled
    syncBrandingToPipedrive(config);
    
    return { success: true, message: 'Configuration saved successfully' };
    
  } catch (error) {
    Logger.log('❌ Error saving branding to sheet: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * Get default product information
 */
function getDefaultProductInfo(productCode) {
  const productInfo = {
    'BHAC': { name: 'Brewery Automated Control', color: '#f59e0b' },
    'DTAC': { name: 'Distillery Temperature Control', color: '#8b5cf6' },
    'CPAC': { name: 'CIP Automated Control', color: '#06b6d4' },
    'GHAC': { name: 'Grain Handling Control', color: '#84cc16' },
    'AGAC': { name: 'Advanced Grain Control', color: '#22c55e' }
  };
  
  return productInfo[productCode] || { name: productCode, color: '#6b7280' };
}

/**
 * Get description for configuration keys
 */
function getDescriptionForKey(section, key) {
  const descriptions = {
    'App': {
      'name': 'Application name',
      'tagline': 'Application tagline',
      'icon': 'Application icon',
      'company': 'Company name'
    },
    'Colors': {
      'primary': 'Primary brand color',
      'primaryDark': 'Primary dark variant',
      'secondary': 'Secondary color',
      'accent': 'Accent color',
      'success': 'Success color',
      'warning': 'Warning color',
      'danger': 'Danger color'
    },
    'ProductIcons': {
      'BHAC': 'Brewery Automated Control icon',
      'DTAC': 'Distillery Temperature Control icon',
      'CPAC': 'CIP Automated Control icon',
      'GHAC': 'Grain Handling Control icon',
      'AGAC': 'Advanced Grain Control icon'
    },
    'ActionIcons': {
      'add': 'Add action icon',
      'remove': 'Remove action icon',
      'edit': 'Edit action icon',
      'save': 'Save action icon',
      'generate': 'Generate action icon'
    }
  };
  
  return descriptions[section]?.[key] || `${section} ${key}`;
}

/**
 * Sync branding configuration to Pipedrive custom fields
 */
function syncBrandingToPipedrive(config) {
  try {
    const apiToken = PropertiesService.getScriptProperties().getProperty('PIPEDRIVE_API_TOKEN');
    
    if (!apiToken) {
      Logger.log('⚠️ Pipedrive API token not configured');
      return;
    }
    
    // Create custom fields in Pipedrive for branding
    const customFields = [
      { name: 'Quote_Primary_Color', field_type: 'varchar' },
      { name: 'Quote_Template_Style', field_type: 'varchar' },
      { name: 'Company_Branding_Theme', field_type: 'varchar' }
    ];
    
    customFields.forEach(field => {
      createPipedriveCustomField(field, apiToken);
    });
    
    Logger.log('✅ Branding synced to Pipedrive');
    
  } catch (error) {
    Logger.log('❌ Error syncing to Pipedrive: ' + error.toString());
  }
}

/**
 * Create custom field in Pipedrive
 */
function createPipedriveCustomField(fieldConfig, apiToken) {
  try {
    const url = `https://${PIPEDRIVE_COMPANY_DOMAIN}/api/v1/dealFields?api_token=${apiToken}`;
    
    const payload = {
      name: fieldConfig.name,
      field_type: fieldConfig.field_type,
      add_visible_flag: true
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() === 201) {
      Logger.log(`✅ Custom field ${fieldConfig.name} created in Pipedrive`);
    }
    
  } catch (error) {
    Logger.log(`❌ Error creating Pipedrive field ${fieldConfig.name}: ` + error.toString());
  }
}

/**
 * API endpoint for the branding editor
 */
function getBrandingForHTML() {
  return loadBrandingFromSheet();
}

/**
 * API endpoint to save branding from HTML editor
 */
function saveBrandingFromHTML(config) {
  return saveBrandingToSheet(config);
}

/**
 * Setup script properties for API tokens
 */
function setupScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  
  // Set these with your actual values
  properties.setProperties({
    'PIPEDRIVE_API_TOKEN': 'YOUR_ACTUAL_PIPEDRIVE_TOKEN',
    'BRANDING_SHEET_ID': 'YOUR_ACTUAL_SHEET_ID'
  });
  
  Logger.log('✅ Script properties configured. Please update with actual values.');
}

/**
 * Test function to verify integration
 */
function testBrandingIntegration() {
  try {
    Logger.log('🧪 Testing branding integration...');
    
    // Test 1: Initialize sheet
    const sheet = initializeBrandingSheet();
    Logger.log('✅ Test 1 passed: Sheet initialization');
    
    // Test 2: Load configuration
    const config = loadBrandingFromSheet();
    Logger.log('✅ Test 2 passed: Configuration loading');
    Logger.log('Loaded config:', JSON.stringify(config, null, 2));
    
    // Test 3: Save configuration
    const result = saveBrandingToSheet(config);
    Logger.log('✅ Test 3 passed: Configuration saving');
    Logger.log('Save result:', result);
    
    Logger.log('🎉 All integration tests passed!');
    
  } catch (error) {
    Logger.log('❌ Integration test failed: ' + error.toString());
  }
}
