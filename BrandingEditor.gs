/**
 * @OnlyCurrentDoc
 *
 * Backend functions for the Branding Editor UI.
 * This script provides the logic to load and save branding configurations
 * from the 'Branding' sheet in the CraftQuote System Database.
 */

/**
 * Displays the Branding Editor user interface.
 * This function is called from the custom menu.
 */
function showBrandingEditor() {
  const html = HtmlService.createHtmlOutputFromFile('BrandingEditor')
    .setWidth(600)
    .setHeight(550);
  SpreadsheetApp.getUi().showModalDialog(html, '🎨 Branding Editor');
}

/**
 * Fetches the current branding configuration from the 'Branding' sheet.
 * @returns {object} A configuration object with the current branding settings.
 */
function getBrandingConfig() {
  try {
    const spreadsheet = getDatabaseSpreadsheet();
    const brandingSheet = spreadsheet.getSheetByName('Branding');
    if (!brandingSheet) {
      throw new Error('"Branding" sheet not found.');
    }
    const data = brandingSheet.getRange('A2:B' + brandingSheet.getLastRow()).getValues();
    const config = {};
    data.forEach(row => {
      if (row[0]) { // Ensure the key is not empty
        // Convert key to camelCase (e.g., "App Name" -> "appName")
        const key = row[0].trim().replace(/\s+/g, ' ').split(' ').map((word, index) => 
          index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        config[key] = row[1];
      }
    });
    return config;
  } catch (e) {
    Logger.log('Error in getBrandingConfig: ' + e.message);
    return { error: e.message };
  }
}

/**
 * Saves the updated branding configuration to the 'Branding' sheet.
 * @param {object} config The configuration object to save.
 * @returns {object} A success or error message.
 */
function saveBrandingConfig(config) {
  try {
    const spreadsheet = getDatabaseSpreadsheet();
    const brandingSheet = spreadsheet.getSheetByName('Branding');
    if (!brandingSheet) {
      throw new Error('"Branding" sheet not found.');
    }
    const range = brandingSheet.getRange('A2:B' + brandingSheet.getLastRow());
    const values = range.getValues();

    // Create a map of keys to their row index for efficient lookup
    const keyMap = {};
    values.forEach((row, index) => {
      const key = row[0].trim().replace(/\s+/g, ' ').split(' ').map((word, i) => 
        i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      keyMap[key] = index;
    });

    // Update the values array with the new config
    for (const key in config) {
      if (keyMap.hasOwnProperty(key)) {
        const rowIndex = keyMap[key];
        values[rowIndex][1] = config[key];
      }
    }

    range.setValues(values);
    SpreadsheetApp.flush(); // Ensure changes are saved immediately
    
    return { success: true, message: 'Branding settings saved successfully!' };
  } catch (e) {
    Logger.log('Error in saveBrandingConfig: ' + e.message);
    return { success: false, message: 'Error saving settings: ' + e.message };
  }
}
