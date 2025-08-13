/****************************************************************
 * CraftQuote System - Branding Configuration
 * Version: 1.0
 * Date: August 12, 2025
 *
 * This script manages all branding-related functionality,
 * including loading and saving settings from a dedicated
 * 'Branding' sheet and displaying the editor UI.
 ****************************************************************/

// ===============================================================
// 🎨 UI & MENU FUNCTIONS
// ===============================================================

/**
 * Displays the Branding Editor user interface.
 * This function is called from the custom menu in Setup.gs.
 */
function showBrandingEditor() {
  const html = HtmlService.createTemplateFromFile('BrandingEditor')
    .evaluate()
    .setWidth(1200)
    .setHeight(800)
    .setTitle('🎨 CraftQuote Branding Editor');
  SpreadsheetApp.getUi().showModalDialog(html, 'Branding Editor');
}

// ===============================================================
// ⚙️ CONFIGURATION MANAGEMENT (SERVER-SIDE)
// ===============================================================

/**
 * Fetches the current branding configuration.
 * It reads from the 'Branding' sheet. If the sheet or data is
 * missing, it initializes it with default values.
 * This is called by the BrandingEditor.html frontend.
 *
 * @returns {object} A configuration object for the UI.
 */
function getBrandingConfig() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let brandingSheet = spreadsheet.getSheetByName('Branding');

    if (!brandingSheet || brandingSheet.getLastRow() < 2) {
      console.log("Branding sheet not found or empty, initializing...");
      brandingSheet = setupBrandingSheet(spreadsheet);
    }

    const data = brandingSheet.getRange(2, 1, brandingSheet.getLastRow() - 1, 2).getValues();
    const config = {};
    data.forEach(row => {
      if (row[0]) { // Key is in column A
        config[row[0]] = row[1]; // Value is in column B
      }
    });
    console.log("Successfully loaded branding config.");
    return { success: true, config: config };
  } catch (e) {
    console.error(`Error in getBrandingConfig: ${e.toString()}`, e.stack);
    return { success: false, error: e.message };
  }
}

/**
 * Saves the updated branding configuration to the 'Branding' sheet.
 * This is called by the BrandingEditor.html frontend.
 *
 * @param {object} config The configuration object received from the UI.
 * @returns {object} A result object with success status.
 */
function saveBrandingConfig(config) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const brandingSheet = spreadsheet.getSheetByName('Branding');
    if (!brandingSheet) {
      throw new Error("'Branding' sheet not found. Please run the main installer again.");
    }

    const range = brandingSheet.getRange(2, 1, brandingSheet.getLastRow() - 1, 2);
    const values = range.getValues();
    const user = Session.getActiveUser().getEmail();
    const timestamp = new Date();

    // Create a map of keys for efficient updating
    const keyMap = {};
    values.forEach((row, index) => {
      keyMap[row[0]] = index;
    });

    // Update values in the 2D array
    for (const key in config) {
      if (keyMap.hasOwnProperty(key)) {
        const rowIndex = keyMap[key];
        values[rowIndex][1] = config[key]; // Update value
        brandingSheet.getRange(rowIndex + 2, 3).setValue(timestamp); // Update timestamp
        brandingSheet.getRange(rowIndex + 2, 4).setValue(user); // Update user
      }
    }

    // Write the updated values back to the sheet
    range.setValues(values);
    SpreadsheetApp.flush(); // Ensure changes are saved immediately

    console.log("Successfully saved branding config.");
    return { success: true, message: 'Branding settings saved successfully!' };
  } catch (e) {
    console.error(`Error in saveBrandingConfig: ${e.toString()}`, e.stack);
    return { success: false, message: 'Error saving settings: ' + e.message };
  }
}


// ===============================================================
// 🔩 INITIALIZATION & HELPER FUNCTIONS
// ===============================================================

/**
 * Creates and initializes the 'Branding' sheet with default values.
 * This function is called by the main setup script.
 * @param {Spreadsheet} ss The spreadsheet object.
 * @returns {Sheet} The initialized branding sheet.
 */
function setupBrandingSheet(ss) {
  let sheet = ss.getSheetByName('Branding');
  if (sheet) {
    console.log("'Branding' sheet already exists. Clearing and re-populating.");
    sheet.clear();
  } else {
    sheet = ss.insertSheet('Branding');
    console.log("'Branding' sheet created.");
  }
  
  // Set up headers
  const headers = ['Key', 'Value', 'Last Modified', 'Modified By'];
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold').setBackground('#4a90e2').setFontColor('white');
  sheet.setFrozenRows(1);

  // Get default data and populate the sheet
  const defaultConfig = getDefaultBrandingData();
  const dataRows = Object.keys(defaultConfig).map(key => [key, defaultConfig[key], new Date(), Session.getActiveUser().getEmail()]);
  
  sheet.getRange(2, 1, dataRows.length, dataRows[0].length).setValues(dataRows);

  // Auto-resize columns for readability
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  return sheet;
}


/**
 * Provides the default branding configuration.
 * @returns {object} The default branding key-value pairs.
 */
function getDefaultBrandingData() {
    return {
        // Application Identity
        appName: "CraftQuote",
        appTagline: "Professional Automation Quote Builder",
        appIcon: "🔧",
        companyName: "Craft Automation Systems",
        // Color Scheme
        primaryColor: "#4a90e2",
        secondaryColor: "#60a5fa",
        accentColor: "#10b981",
        successColor: "#22c55e",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444",
        // Product Category Icons
        bhacIcon: "🍺",
        dtacIcon: "🥃",
        cpacIcon: "🧽",
        ghacIcon: "🌾",
        agacIcon: "⚙️",
        // Action Icons
        addIcon: "➕",
        removeIcon: "❌",
        editIcon: "✏️",
        saveIcon: "💾",
        generateIcon: "✨"
    };
}
