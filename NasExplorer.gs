/**
 * Backend functions for the Network File Explorer tool.
 * Handles importing NAS index data and searching for jobs.
 */

/**
 * Imports NAS index data from CSV files in a specific Google Drive folder
 * into the 'Jobs_Database' sheet.
 */
function importNasIndex() {
  const FOLDER_NAME = "NAS_CSV_INDEX"; // The Google Drive folder where your CSVs are stored
  const TARGET_SHEET_NAME = "Jobs_Database";
  const CSV_FILES = ["CraftAuto_Sales_Index.csv", "CraftAuto_Production_Index.csv"];

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let targetSheet = ss.getSheetByName(TARGET_SHEET_NAME);
    if (!targetSheet) {
      targetSheet = ss.insertSheet(TARGET_SHEET_NAME);
    }
    targetSheet.clear(); // Clear existing data

    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    if (!folders.hasNext()) {
      throw new Error(`Cannot find the source folder in Google Drive. Please create a folder named '${FOLDER_NAME}' and upload your CSV index files.`);
    }
    const folder = folders.next();

    let allData = [];
    let headersSet = false;

    CSV_FILES.forEach(fileName => {
      const files = folder.getFilesByName(fileName);
      if (files.hasNext()) {
        const file = files.next();
        const csvText = file.getBlob().getDataAsString('UTF-8');
        const data = Utilities.parseCsv(csvText);

        if (data.length > 0) {
          if (!headersSet) {
            allData.push(data[0]); // Add headers from the first file
            headersSet = true;
          }
          allData.push(...data.slice(1)); // Add data rows
        }
      } else {
        Logger.log(`Warning: CSV file not found: ${fileName}`);
      }
    });

    if (allData.length > 0) {
      targetSheet.getRange(1, 1, allData.length, allData[0].length).setValues(allData);
      SpreadsheetApp.getUi().alert('Success', 'The Jobs Database has been updated from the NAS index files.', SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      throw new Error("No data was imported. Check if the CSV files exist and are not empty.");
    }

  } catch (e) {
    Logger.log(e);
    SpreadsheetApp.getUi().alert('Error', `Failed to import NAS index: ${e.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Searches the Jobs_Database sheet for a given term.
 * @param {string} searchTerm The term to search for.
 * @returns {Array<Object>} An array of job objects matching the search.
 */
function searchNasIndex(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return []; // Don't search for very short terms
  }
  
  const TARGET_SHEET_NAME = "Jobs_Database";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(TARGET_SHEET_NAME);

  if (!sheet) {
    throw new Error("The 'Jobs_Database' sheet was not found. Please run the import first.");
  }

  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Get headers and remove from data

  // Find column indices to make search robust
  const jobNameIndex = headers.indexOf('JobName');
  const customerNameIndex = headers.indexOf('CustomerName');
  const quoteNumberIndex = headers.indexOf('QuoteNumber');
  const folderPathIndex = headers.indexOf('FolderPath');

  if (jobNameIndex === -1 || customerNameIndex === -1 || quoteNumberIndex === -1 || folderPathIndex === -1) {
      throw new Error("The 'Jobs_Database' sheet is missing required headers (JobName, CustomerName, QuoteNumber, FolderPath).");
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const results = [];

  data.forEach(row => {
    const jobName = row[jobNameIndex] || '';
    const customerName = row[customerNameIndex] || '';
    const quoteNumber = row[quoteNumberIndex] || '';

    if (jobName.toLowerCase().includes(lowerCaseSearchTerm) ||
        customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
        quoteNumber.toLowerCase().includes(lowerCaseSearchTerm)) {
      
      results.push({
        JobName: jobName,
        CustomerName: customerName,
        QuoteNumber: quoteNumber,
        FolderPath: row[folderPathIndex]
      });
    }
  });

  return results;
}

/**
 * Simulates the creation of a directory on the NAS.
 * @param {string} quoteNumber The quote number to use for the directory name.
 * @returns {string} A success message.
 */
function createSmartDir(quoteNumber) {
  if (!quoteNumber || quoteNumber.trim() === '') {
    return "Error: Please provide a quote number.";
  }
  // This is a placeholder as Apps Script cannot access local network.
  Logger.log(`Simulated directory creation for quote: ${quoteNumber}`);
  return `Success! A directory for quote '${quoteNumber}' would have been created on the NAS.`;
}
