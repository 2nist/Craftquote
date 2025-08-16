/**
 * CSV CATALOG IMPORTER - READS YOUR ACTUAL CSV FILE
 * Based on your real COMPONENT PRICE LIST [MASTER] format
 * Column structure: VENDORCODE,PART ABBREV.,Vendor Part Code,Manufacturer PART NUMBER,PART DESCRIPTION & DETAILS,COST,Unit/Qty,SUB CATEGORY,LAST PRICE UPDATE
 */

function importFromCsvFile() {
  console.log("🚀 Starting Real CSV Import...");
  
  try {
    // Read your actual CSV file
    const csvData = readYourCsvFile();
    
    if (!csvData || csvData.length === 0) {
      throw new Error("Could not read CSV file or no data found");
    }
    
    console.log(`📄 Found ${csvData.length} parts in CSV`);
    
    // Import in batches
    const result = importRealCsvData(csvData);
    
    // Show results
    const report = `🎉 REAL CSV IMPORT COMPLETE!\n` +
                  `✅ Total Parts: ${result.totalParts}\n` +
                  `✅ Categories: ${result.categories}\n` +
                  `✅ Vendors: ${result.vendors}\n` +
                  `💰 Total Value: $${result.totalValue.toFixed(2)}`;
                  
    console.log(report);
    Browser.msgBox("CSV Import Complete", report, Browser.Buttons.OK);
    
    return true;
    
  } catch (error) {
    console.error("❌ CSV Import failed:", error);
    Browser.msgBox("CSV Import Failed", 
      `❌ Error: ${error.message}`, 
      Browser.Buttons.OK);
    return false;
  }
}

/**
 * Read your actual CSV file from the workspace
 */
function readYourCsvFile() {
  try {
    const props = PropertiesService.getScriptProperties();
    const configuredId = props.getProperty('CSV_FILE_ID');
    let csvText = '';

    if (!configuredId) {
      throw new Error("CSV File ID is not set. Please use the 'Set CSV File ID' menu item first.");
    }

    console.log(`🔗 Using configured File ID: ${configuredId}`);
    const file = DriveApp.getFileById(configuredId);
    const mimeType = file.getMimeType();
    console.log(`📄 Found file: ${file.getName()} with MIME type: ${mimeType}`);

    if (mimeType === MimeType.GOOGLE_SHEETS) {
      console.log('Detected Google Sheet. Reading data directly.');
      // Use the first visible sheet in the spreadsheet as the source
      const sheet = SpreadsheetApp.openById(configuredId).getSheets().find(s => s.isSheetHidden() === false);
      if (!sheet) {
        throw new Error("No visible sheets found in the Google Sheet document.");
      }
      console.log(`Reading from sheet: "${sheet.getName()}"`);
      const data = sheet.getDataRange().getValues();
      // Convert array of arrays to a CSV string so the rest of the script can process it
      csvText = data.map(row => 
        row.map(cell => {
          let cellStr = cell.toString();
          // Escape quotes by doubling them
          if (cellStr.includes('"')) {
            cellStr = cellStr.replace(/"/g, '""');
          }
          // If the cell contains a comma, newline, or quote, enclose it in quotes
          if (/[",\n]/.test(cellStr)) {
            cellStr = `"${cellStr}"`;
          }
          return cellStr;
        }).join(',')
      ).join('\n');
      
    } else if (mimeType === 'text/csv' || mimeType === 'text/plain' || file.getName().toLowerCase().endsWith('.csv')) {
      console.log('Detected CSV file. Reading as text.');
      csvText = file.getBlob().getDataAsString('UTF-8');
    } else {
      throw new Error(`Unsupported file type: ${mimeType}. Please provide the ID of a CSV file or a Google Sheet.`);
    }

    if (!csvText || csvText.trim() === '') {
        throw new Error("The file appears to be empty or could not be read.");
    }

    return parseRealCsvData(csvText);
    
  } catch (error) {
    console.error("❌ Error reading data source:", error);
    throw error;
  }
}

/**
 * Parse your actual CSV data format
 */
function parseRealCsvData(csvText) {
  try {
    // Find the first line to detect the delimiter
    const firstLine = csvText.substring(0, csvText.indexOf('\n')).trim();
    const delimiter = (firstLine.includes('\t') && !firstLine.includes(',')) ? '\t' : ',';
    console.log(`Delimiter detected: '${delimiter === '\t' ? 'TAB' : 'COMMA'}'`);

    const data = Utilities.parseCsv(csvText, delimiter);
    console.log(`📄 Processing ${data.length} lines from your CSV using Utilities.parseCsv`);

    if (data.length < 2) {
      throw new Error("CSV file appears to be empty or could not be parsed");
    }

    const headers = data[0].map(h => (h || '').toString().trim());
    const upper = headers.map(h => h.toUpperCase());

    // Helper to find header index by any of the provided names
    const hIdx = (...names) => {
      for (const name of names) {
        const i = upper.indexOf(name.toUpperCase());
        if (i !== -1) return i;
      }
      return -1;
    };

    // Detect canonical Master Catalog header (PART#, DESCRIPTION, VNDR, VNDR#, COST, UNIT, LAST PRICE UPDATE, etc.)
    const isCanonical = hIdx('PART#') !== -1 && hIdx('DESCRIPTION') !== -1 && hIdx('VNDR') !== -1 && hIdx('COST') !== -1;

    const parts = [];

    if (isCanonical) {
      console.log('🧭 Detected canonical Master Catalog header');
      const idx = {
        yn: hIdx('YN'),
        partCat: hIdx('PART'),
        desc: hIdx('DESCRIPTION'),
        partNum: hIdx('PART#', 'PART NUMBER', 'PN'),
        vndr: hIdx('VNDR', 'VENDOR', 'VENDORCODE'),
        vndrNum: hIdx('VNDR#', 'VENDOR PART', 'VENDOR PART CODE'),
        cost: hIdx('COST', 'UNIT COST', 'PRICE'),
        unit: hIdx('UNIT', 'UOM', 'UNIT/QTY'),
        volt: hIdx('VOLT', 'VOLTAGE'),
        phase: hIdx('PHASE'),
        amps: hIdx('AMPS'),
        assembly: hIdx('ASSEMBLY'),
        tags: hIdx('TAGS'),
        notes: hIdx('NOTES'),
        last: hIdx('LAST PRICE UPDATE', 'LAST UPDATED', 'UPDATED'),
        manual: hIdx('MANUAL LINK', 'MANUAL', 'LINK')
      };

      // Start from row 1 to skip header
      for (let i = 1; i < data.length; i++) {
        try {
          const values = data[i];
          if (!values || values.length === 0 || values.every(v => v === '')) continue;

          const part = {
            vendorCode: idx.vndr >= 0 ? cleanCsvValue(values[idx.vndr]) : '',
            partCategory: idx.partCat >= 0 ? cleanCsvValue(values[idx.partCat]) : '',
            vendorPart: idx.vndrNum >= 0 ? cleanCsvValue(values[idx.vndrNum]) : '',
            partNumber: idx.partNum >= 0 ? cleanCsvValue(values[idx.partNum]) : '',
            description: idx.desc >= 0 ? cleanCsvValue(values[idx.desc]) : '',
            cost: idx.cost >= 0 ? parseCostValue(values[idx.cost]) : 0,
            unit: idx.unit >= 0 ? cleanCsvValue(values[idx.unit]) || 'EA' : 'EA',
            category: (idx.assembly >= 0 ? cleanCsvValue(values[idx.assembly]) : '') || (idx.partCat >= 0 ? cleanCsvValue(values[idx.partCat]) : '') || 'MISC',
            lastUpdated: idx.last >= 0 ? cleanCsvValue(values[idx.last]) : ''
          };

          // Keep rows with essential fields; allow cost 0
          if (part.partNumber && part.description) {
            parts.push(part);
          }
        } catch (rowError) {
          console.warn(`⚠️ Skipping row ${i}: ${rowError.message}`);
          continue;
        }
      }
    } else {
      console.log('🧭 Detected vendor CSV format (VENDORCODE, PART ABBREV., ...), using legacy mapping');
      // Original mapping for the vendor-export format
      // Start from row 1 to skip header
      for (let i = 1; i < data.length; i++) {
        try {
          const values = data[i];
          if (values.length < 6) continue; // Skip incomplete rows

          const part = {
            vendorCode: cleanCsvValue(values[0]),
            partCategory: cleanCsvValue(values[1]),
            vendorPart: cleanCsvValue(values[2]),
            partNumber: cleanCsvValue(values[3]),
            description: cleanCsvValue(values[4]),
            cost: parseCostValue(values[5]),
            unit: cleanCsvValue(values[6]) || 'ea.',
            category: cleanCsvValue(values[7]) || values[1] || 'MISC',
            lastUpdated: cleanCsvValue(values[8]) || new Date().toLocaleDateString()
          };

          if (part.partNumber && part.description) {
            parts.push(part);
          }
        } catch (rowError) {
          console.warn(`⚠️ Skipping row ${i}: ${rowError.message}`);
          continue;
        }
      }
    }

    console.log(`✅ Successfully parsed ${parts.length} valid parts`);
    return parts;

  } catch (error) {
    console.error("❌ Error parsing CSV:", error);
    throw error;
  }
}

/**
 * Parse a CSV row handling your data format
 */
function parseRealCsvRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

/**
 * Clean CSV values
 */
function cleanCsvValue(value) {
  if (!value) return '';
  return value.toString().replace(/^"|"$/g, '').trim();
}

/**
 * Parse cost values handling $, commas, etc.
 */
function parseCostValue(costStr) {
  if (!costStr) return 0;
  
  // Remove $, commas, quotes
  const cleaned = costStr.toString()
    .replace(/[$",]/g, '')
    .trim();
  
  const cost = parseFloat(cleaned);
  return isNaN(cost) ? 0 : cost;
}

/**
 * Import the real CSV data
 */
function importRealCsvData(csvData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const batchSize = 100; // Smaller batches for safety
  const batches = Math.ceil(csvData.length / batchSize);

  console.log(`📊 Processing ${csvData.length} real parts in ${batches} batches`);

  // Preserve existing Active flags (yn) by PART# before clearing the sheet
  const existingYnByPartNum = getExistingYnMap_();

  // Setup Master Catalog sheet with canonical headers
  const masterSheet = setupMasterCatalogSheet(ss);
  const headers = getMasterCatalogHeaders();
  const colCount = headers.length;

  let totalProcessed = 0;
  const allCategories = new Set();
  const allVendors = new Set();
  let totalValue = 0;

  // Process each batch
  for (let batchNum = 0; batchNum < batches; batchNum++) {
    const startIdx = batchNum * batchSize;
    const endIdx = Math.min(startIdx + batchSize, csvData.length);
    const batchData = csvData.slice(startIdx, endIdx);

    console.log(`📦 Processing batch ${batchNum + 1}/${batches} (parts ${startIdx + 1}-${endIdx})`);

    // Convert to sheet format exactly matching our manual-friendly schema
    const sheetData = batchData.map(part => {
      allCategories.add(part.category);
      if (part.vendorCode) allVendors.add(part.vendorCode);
      totalValue += part.cost;

      // Compose base tags from category/partCategory if available
      const rawTags = [part.category, part.partCategory]
        .filter(Boolean)
        .map(v => v.toString().trim())
        .join(',');
      const normalizedTags = rawTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length)
        .map(t => t.toUpperCase())
        .join(',');

      // Determine Active flag: preserve existing N/Y if present; default to 'Y' for new parts
      const ynFlag = (() => {
        const v = existingYnByPartNum[part.partNumber];
        if (!v) return 'Y';
        const up = (v + '').trim().toUpperCase();
        return up === 'N' ? 'N' : 'Y';
      })();

      return [
        // A-P: Core columns expected by backend (keep positions stable)
        ynFlag,                              // yn (active)
        part.partCategory || '',              // PART (abbrev/type)
        part.description || '',               // DESCRIPTION
        part.partNumber || '',                // PART# (manufacturer PN)
        part.vendorCode || '',                // VNDR (vendor code)
        part.vendorPart || '',                // VNDR# (vendor part code)
        part.cost || 0,                       // COST (number)
        part.unit || 'EA',                    // UNIT
        '',                                   // VOLT
        '',                                   // PHASE
        '',                                   // AMPS
        '',                                   // ASSEMBLY
        rawTags,                              // TAGS (freeform)
        '',                                   // NOTES
        part.lastUpdated || '',               // LAST PRICE UPDATE
        '',                                   // MANUAL Link

        // Q+: Manual-friendly extras (safe to leave blank and fill later)
        '',                                   // DATASHEET URL
        '',                                   // MANUFACTURER
        '',                                   // LEAD TIME (DAYS)
        '',                                   // MOQ
        '',                                   // STOCK QTY
        '',                                   // LIFECYCLE
        '',                                   // PREFERRED VENDOR (Y/N)
        normalizedTags,                       // TAGS (NORMALIZED)
        'CSV',                                // SOURCE
        'USD'                                 // CURRENCY
      ];
    });

    // Append batch to sheet
    if (sheetData.length > 0) {
      const range = masterSheet.getRange(masterSheet.getLastRow() + 1, 1, sheetData.length, colCount);
      range.setValues(sheetData);
      totalProcessed += sheetData.length;
    }

    // Small delay
    Utilities.sleep(100);
  }

  console.log(`✅ Import complete: ${totalProcessed} parts imported`);

  return {
    totalParts: totalProcessed,
    categories: allCategories.size,
    vendors: allVendors.size,
    totalValue: totalValue
  };
}

/**
 * Setup Master Catalog sheet
 */
function setupMasterCatalogSheet(ss) {
  try {
    let sheet = ss.getSheetByName('Master Catalog');
    if (sheet) {
      // Delete and recreate to avoid any validation conflicts
      ss.deleteSheet(sheet);
    }
    sheet = ss.insertSheet('Master Catalog');

    // Set up canonical manual-friendly headers
    const headers = getMasterCatalogHeaders();

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#1a73e8');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    sheet.setFrozenRows(1);

    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);

    return sheet;

  } catch (error) {
    console.error("❌ Error setting up Master Catalog sheet:", error);
    throw error;
  }
}

/**
 * Canonical Master Catalog headers (manual-friendly), ordered to match backend expectations (A–P), plus extras (Q+)
 */
function getMasterCatalogHeaders() {
  return [
    // Core columns (A–P)
    'yn', 'PART', 'DESCRIPTION', 'PART#', 'VNDR', 'VNDR#', 'COST', 'UNIT',
    'VOLT', 'PHASE', 'AMPS', 'ASSEMBLY', 'TAGS', 'NOTES', 'LAST PRICE UPDATE', 'MANUAL Link',
    // Manual-friendly extras (Q+)
    'DATASHEET URL', 'MANUFACTURER', 'LEAD TIME (DAYS)', 'MOQ', 'STOCK QTY', 'LIFECYCLE', 'PREFERRED VENDOR', 'TAGS (NORMALIZED)', 'SOURCE', 'CURRENCY'
  ];
}

/**
 * Build a map of existing Active flags (yn) keyed by PART# from the current Master Catalog.
 * Allows us to preserve manual deactivations (N) across imports.
 */
function getExistingYnMap_() {
  const map = {};
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Master Catalog');
    if (!sheet) return map;
    const data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return map;
    const headers = data[0];
    // Use canonical/derived mapping to locate columns
    const columnMap = (typeof deriveColumnMapFromHeaders === 'function')
      ? deriveColumnFromHeaders(headers)
      : {
          yn: 0,
          partNum: 3
        };
    const ynIdx = columnMap.yn != null ? columnMap.yn : 0;
    const pnIdx = columnMap.partNum != null ? columnMap.partNum : 3;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const pn = (row[pnIdx] || '').toString().trim();
      if (!pn) continue;
      const yn = (row[ynIdx] || '').toString().trim();
      if (yn) map[pn] = yn; // store raw; normalization happens on write
    }
  } catch (e) {
    console.log('getExistingYnMap_() failed or skipped:', e);
  }
  return map;
}

/**
 * Find and read the CSV file from Google Drive
 */
function findAndReadCsvFile() {
  try {
    // Try exact name first
    let files = DriveApp.getFilesByName("COMPONENT PRICE LIST [MASTER]");
    
    if (!files.hasNext()) {
      // Try variations
      console.log("⚠️ Exact name not found, searching for variations...");
      
      const searchTerms = [
        "COMPONENT PRICE LIST",
        "MASTER CATALOG", 
        "PRICE LIST MASTER",
        "COMPONENT"
      ];
      
      for (const term of searchTerms) {
        files = DriveApp.searchFiles(`title contains "${term}"`);
        if (files.hasNext()) {
          console.log(`📄 Found file using search term: ${term}`);
          break;
        }
      }
    }
    
    if (!files.hasNext()) {
      throw new Error("CSV file not found. Please ensure it's named 'COMPONENT PRICE LIST [MASTER]' and is accessible.");
    }
    
    const file = files.next();
    console.log(`📄 Reading file: ${file.getName()}`);
    
    // Read and parse the CSV content
    const csvText = file.getBlob().getDataAsString();
    return parseCsvFile(csvText);
    
  } catch (error) {
    console.error("❌ Error reading CSV file:", error);
    throw error;
  }
}

/**
 * Parse CSV text into structured data
 */
function parseCsvFile(csvText) {
  try {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    console.log(`📄 Processing ${lines.length} lines from CSV`);
    
    if (lines.length < 2) {
      throw new Error("CSV file appears to be empty or invalid");
    }
    
    // Parse header row
    const headers = parseCSVRow(lines[0]);
    console.log(`📊 Headers found: ${headers.join(', ')}`);
    
    const parts = [];
    
    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVRow(lines[i]);
        
        if (values.length < 6) continue; // Skip incomplete rows
        
        // Map your CSV structure to our data model
        // Expected columns: VENDORCODE, PART ABBREV., Vendor Part Code, Manufacturer PART NUMBER, PART DESCRIPTION & DETAILS, COST, Unit/Qty, SUB CATEGORY, LAST PRICE UPDATE
        const part = {
          vendorCode: cleanValue(values[0]),
          partNumber: cleanValue(values[1]),
          vendorPart: cleanValue(values[2]),
          manufacturerPart: cleanValue(values[3]),
          description: cleanValue(values[4]),
          cost: parseFloat(cleanValue(values[5])) || 0,
          unit: cleanValue(values[6]) || 'EA',
          category: cleanValue(values[7]) || 'MISC',
          lastUpdated: cleanValue(values[8]) || new Date().toLocaleDateString()
        };
        
        // Only add if we have essential data
        if (part.partNumber && part.description) {
          parts.push(part);
        }
        
      } catch (rowError) {
        console.warn(`⚠️ Skipping row ${i}: ${rowError.message}`);
        continue;
      }
    }
    
    console.log(`✅ Successfully parsed ${parts.length} valid parts`);
    return parts;
    
  } catch (error) {
    console.error("❌ Error parsing CSV:", error);
    throw error;
  }
}

/**
 * Parse a single CSV row, handling quotes and commas
 */
function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  return result;
}

/**
 * Clean a CSV value (remove quotes, trim whitespace)
 */
function cleanValue(value) {
  if (!value) return '';
  return value.toString().replace(/^"|"$/g, '').trim();
}

/**
 * Import CSV data in batches to avoid timeouts
 */
function importCsvDataInBatches(csvData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const batchSize = 200; // Process 200 parts at a time
  const batches = Math.ceil(csvData.length / batchSize);
  
  console.log(`📊 Processing ${csvData.length} parts in ${batches} batches`);
  
  // Setup Master Catalog sheet (legacy 8-column layout)
  const masterSheet = setupMasterCatalogSheetLegacy(ss);
  
  let totalProcessed = 0;
  const allCategories = new Set();
  const allVendors = new Set();
  let totalValue = 0;
  
  // Process each batch
  for (let batchNum = 0; batchNum < batches; batchNum++) {
    const startIdx = batchNum * batchSize;
    const endIdx = Math.min(startIdx + batchSize, csvData.length);
    const batchData = csvData.slice(startIdx, endIdx);
    
    console.log(`📦 Processing batch ${batchNum + 1}/${batches} (parts ${startIdx + 1}-${endIdx})`);
    
    // Convert to sheet format and append
    const sheetData = batchData.map(part => {
      allCategories.add(part.category);
      allVendors.add(part.vendorCode);
      totalValue += part.cost;
      
      return [
        part.partNumber,
        part.description,
        part.vendorCode,
        part.vendorPart,
        part.cost,
        part.unit,
        part.category,
        part.lastUpdated
      ];
    });
    
    // Append batch to sheet
    if (sheetData.length > 0) {
      const range = masterSheet.getRange(masterSheet.getLastRow() + 1, 1, sheetData.length, 8);
      range.setValues(sheetData);
      totalProcessed += sheetData.length;
    }
    
    // Small delay to prevent timeout
    Utilities.sleep(100);
  }
  
  // Update hierarchical sheets
  updateHierarchicalSheets();
  
  console.log(`✅ Batch processing complete: ${totalProcessed} parts imported`);
  
  return {
    totalParts: totalProcessed,
    categories: allCategories.size,
    vendors: allVendors.size,
    totalValue: totalValue
  };
}

/**
 * Setup or clear the Master Catalog sheet
 */
function setupMasterCatalogSheetLegacy(ss) {
  try {
    let sheet = ss.getSheetByName('Master Catalog');
    if (sheet) {
      // Delete and recreate to avoid any validation conflicts
      ss.deleteSheet(sheet);
    }
    sheet = ss.insertSheet('Master Catalog');
    
    // Set up headers
    const headers = [
      'Part Number', 'Description', 'Vendor', 'Vendor Part', 
      'Cost', 'Unit', 'Category', 'Last Updated'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
  return sheet;
    
  } catch (error) {
    console.error("❌ Error setting up Master Catalog sheet:", error);
    throw error;
  }
}

/**
 * Update the hierarchical HW_Parts sheets
 */
function updateHierarchicalSheets() {
  try {
    // This would call your existing hierarchical system
    // You can copy the updateHierarchicalSheets function from your V2 system
    console.log("📊 Updating hierarchical sheets...");
    
    // For now, just a placeholder - you can integrate with your existing system
    return true;
    
  } catch (error) {
    console.error("⚠️ Error updating hierarchical sheets:", error);
    // Don't fail the entire import for this
    return false;
  }
}
