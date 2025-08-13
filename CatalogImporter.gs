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
    .setWidth(600)
    .setHeight(520);
  SpreadsheetApp.getUi().showModalDialog(html, '🗂️ Master Catalog CSV Importer');
}

/**
 * Imports catalog data from a user-provided CSV file.
 * It checks for existing PART# to avoid duplicates and can optionally update existing rows.
 *
 * @param {string} csvData The raw text content of the CSV file.
 * @param {boolean} updateExisting When true, rows with existing PART# will be updated instead of skipped.
 * @returns {object} A result object with counts of added/updated/skipped items.
 */
function importCatalogFromCSV(csvData, updateExisting) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Master Catalog');
    if (!sheet) {
      throw new Error("'Master Catalog' sheet not found. Please run the initial setup first.");
    }

    const sheetHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => (h || '').toString().trim());
    const headerIndex = {};
    sheetHeaders.forEach((name, idx) => headerIndex[name.toUpperCase()] = idx);

    // Helper to get column index by canonical header key; falls back if sheet changed order
    function colIndex(key) {
      const i = headerIndex[key.toUpperCase()];
      if (i === undefined) throw new Error(`Required column '${key}' not found in Master Catalog sheet.`);
      return i;
    }

    const idxYN = colIndex('yn');
    const idxPART = colIndex('PART');
    const idxDESCRIPTION = colIndex('DESCRIPTION');
    const idxPARTNUM = colIndex('PART#');
    const idxVNDR = colIndex('VNDR');
    const idxVNDRNUM = colIndex('VNDR#');
    const idxCOST = colIndex('COST');
    const idxQTY = colIndex('QTY');
    const idxUNIT = colIndex('UNIT');
    const idxLEAD = colIndex('LEAD');
    const idxMOQ = colIndex('MOQ');
    const idxNOTES = colIndex('NOTES');
    const idxCATEGORY = colIndex('CATEGORY');
    const idxUPDATED = colIndex('UPDATED');
    const idxSOURCE = colIndex('SOURCE');
    const idxMANUAL = colIndex('MANUAL');

    // Build map of existing PART# -> rowIndex (1-based in sheet)
    const lastRow = sheet.getLastRow();
    const partNumCol = idxPARTNUM + 1; // to A1 index
    const existingMap = new Map();
    if (lastRow > 1) {
      const partRange = sheet.getRange(2, partNumCol, lastRow - 1, 1).getValues();
      for (let i = 0; i < partRange.length; i++) {
        const v = (partRange[i][0] || '').toString().trim();
        if (v) existingMap.set(v, i + 2); // actual row number
      }
    }

    // Parse CSV
    const data = Utilities.parseCsv(csvData);
    if (!data || data.length < 2) {
      return { success: true, added: 0, updated: 0, skipped: 0, message: 'CSV is empty or missing data rows.' };
    }

    const csvHeadersRaw = data[0];
    const csvHeaders = csvHeadersRaw.map(h => (h || '').toString().trim());

    // Header alias mapping
    const aliases = new Map([
      ['yn', ['yn', 'include', 'active']],
      ['PART', ['part', 'department', 'class', 'category top', 'group']],
      ['DESCRIPTION', ['description', 'desc', 'item description', 'name', 'item name']],
      ['PART#', ['part#', 'part number', 'sku', 'sku#', 'mpn', 'mfr part#', 'manufacturer part #', 'item#']],
      ['VNDR', ['vndr', 'vendor', 'manufacturer', 'brand', 'mfr']],
      ['VNDR#', ['vndr#', 'vendor#', 'vendor part#', 'mfr#', 'mfr part#']],
      ['COST', ['cost', 'price', 'unit cost', 'unit price', 'list price', 'base cost']],
      ['QTY', ['qty', 'quantity', 'stock qty', 'order qty']],
      ['UNIT', ['unit', 'uom', 'unit of measure']],
      ['LEAD', ['lead', 'lead time', 'leadtime']],
      ['MOQ', ['moq', 'minimum order', 'min order qty']],
      ['NOTES', ['notes', 'note', 'comments', 'comment']],
      ['CATEGORY', ['category', 'product category', 'class']]
    ]);

    // Build mapping from CSV column index -> target sheet column index
    const csvToSheetCol = new Map();
    for (let i = 0; i < csvHeaders.length; i++) {
      const h = csvHeaders[i].toLowerCase();
      for (const [target, list] of aliases.entries()) {
        if (list.some(alias => alias.toLowerCase() === h)) {
          csvToSheetCol.set(i, colIndex(target));
          break;
        }
      }
    }

    function toNumber(val) {
      if (val === null || val === undefined) return '';
      const s = val.toString().replace(/[$,\s]/g, '');
      const n = parseFloat(s);
      return isNaN(n) ? '' : n;
    }

    const now = new Date();
    const results = { success: true, added: 0, updated: 0, skipped: 0 };
    const toAppend = [];

    // Track duplicates within the same CSV import
    const seenInCsv = new Set();

    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      if (!row || row.length === 0) { results.skipped++; continue; }

      // Build a target row initialized with blanks
      const targetRow = new Array(sheetHeaders.length).fill('');

      // Defaults
      targetRow[idxYN] = 'Y';
      targetRow[idxQTY] = 1;
      targetRow[idxUPDATED] = now;
      targetRow[idxSOURCE] = updateExisting ? 'CSV Import (update allowed)' : 'CSV Import';
      targetRow[idxMANUAL] = '';

      // Map CSV fields → target columns
      for (let c = 0; c < row.length; c++) {
        const targetIdx = csvToSheetCol.get(c);
        if (targetIdx === undefined) continue;
        let val = row[c];
        if (targetIdx === idxCOST) val = toNumber(val);
        if (targetIdx === idxQTY) val = toNumber(val) || 1;
        targetRow[targetIdx] = val;
      }

      const partNumber = (targetRow[idxPARTNUM] || '').toString().trim();
      if (!partNumber) { results.skipped++; continue; }

      if (seenInCsv.has(partNumber)) { results.skipped++; continue; }
      seenInCsv.add(partNumber);

      // Existing?
      const existingRow = existingMap.get(partNumber);
      if (existingRow) {
        if (updateExisting) {
          // Write back the entire row (respecting sheet header length)
          targetRow[idxUPDATED] = new Date();
          targetRow[idxSOURCE] = 'CSV Import (updated)';
          sheet.getRange(existingRow, 1, 1, sheetHeaders.length).setValues([targetRow]);
          results.updated++;
        } else {
          results.skipped++;
        }
      } else {
        toAppend.push(targetRow);
      }
    }

    if (toAppend.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, toAppend.length, sheetHeaders.length).setValues(toAppend);
      results.added += toAppend.length;
    }

    const message = `Import complete. Added: ${results.added}, Updated: ${results.updated}, Skipped: ${results.skipped}.`;
    return Object.assign(results, { message });

  } catch (e) {
    Logger.log('Error in importCatalogFromCSV: ' + e.message);
    return { success: false, message: 'Error: ' + e.message };
  }
}
