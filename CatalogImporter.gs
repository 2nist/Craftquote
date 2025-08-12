/**
 * @OnlyCurrentDoc
 *
 * Backend functions for the Master Catalog CSV Importer.
 * This script provides the logic to display the UI, parse a CSV file,
 * and intelligently add new components to the 'Master Catalog' sheet.
 */

/**
 * Displays the Catalog Importer user interface.
 * This function is called from the custom menu.
 */
function showCatalogImporter() {
  const html = HtmlService.createHtmlOutputFromFile('CatalogImporter')
    .setWidth(500)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, '🗂️ Master Catalog CSV Importer');
}

/**
 * Imports catalog data from a user-provided CSV file.
 * It checks for existing PART# to avoid duplicates.
 *
 * @param {string} csvData The raw text content of the CSV file.
 * @returns {object} A result object with counts of added and skipped items.
 */
function importCatalogFromCSV(csvData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Master Catalog');
    if (!sheet) {
      throw new Error("'Master Catalog' sheet not found. Please run the initial setup first.");
    }

    // Get existing PART#s to prevent duplicates
    const existingPartNumbers = new Set();
    const partNumberColumn = 4; // Column D is PART#
    const range = sheet.getRange(2, partNumberColumn, sheet.getLastRow() - 1, 1);
    range.getValues().forEach(row => {
      if (row[0]) {
        existingPartNumbers.add(row[0].toString().trim());
      }
    });

    const data = Utilities.parseCsv(csvData);
    if (data.length < 2) {
      return { success: true, added: 0, skipped: 0, message: "CSV file is empty or contains only headers." };
    }

    const headers = data[0].map(h => h.trim().toUpperCase());
    const partNumHeaderIndex = headers.indexOf('PART#');
    if (partNumHeaderIndex === -1) {
      throw new Error("CSV must contain a 'PART#' column.");
    }

    const newRows = [];
    let addedCount = 0;
    let skippedCount = 0;

    // Start from row 1 to skip header row of CSV
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const partNumber = row[partNumHeaderIndex] ? row[partNumHeaderIndex].toString().trim() : '';

      if (!partNumber) {
        skippedCount++;
        continue; // Skip rows without a part number
      }

      if (existingPartNumbers.has(partNumber)) {
        skippedCount++;
      } else {
        // This assumes the CSV columns are in the same order as the sheet.
        // A more robust implementation would map CSV headers to sheet headers.
        newRows.push(row);
        existingPartNumbers.add(partNumber); // Add to set to handle duplicates within the CSV itself
        addedCount++;
      }
    }

    if (newRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
    }

    return {
      success: true,
      added: addedCount,
      skipped: skippedCount,
      message: `Import complete. Added: ${addedCount}, Skipped (duplicates or empty): ${skippedCount}.`
    };

  } catch (e) {
    Logger.log('Error in importCatalogFromCSV: ' + e.message);
    return { success: false, message: 'Error: ' + e.message };
  }
}
