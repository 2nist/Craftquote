/**
 * QUICK CATALOG LOADER
 * Fast import for large master catalogs
 */

/**
 * Import catalog from pasted CSV data
 * Use this for quick testing with your full 1,330+ parts
 */
function importFromPastedData() {
  const ui = SpreadsheetApp.getUi();
  
  // Get CSV data from user
  const response = ui.prompt(
    '📦 PASTE YOUR MASTER CATALOG DATA',
    'Paste your CSV data here (Part#, Description, Vendor, Cost):\n\n' +
    'Format: "PartNum","Description","Vendor",Cost\n' +
    'Or just paste from Excel and we\'ll auto-detect format.',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.CANCEL) {
    return;
  }
  
  const csvData = response.getResponseText();
  if (!csvData || csvData.trim() === '') {
    ui.alert('❌ No data provided');
    return;
  }
  
  try {
    // Parse CSV data
    const parsedData = parseCSVData(csvData);
    console.log('📊 Parsed', parsedData.length, 'parts from CSV');
    
    if (parsedData.length === 0) {
      ui.alert('❌ No valid parts found in data');
      return;
    }
    
    // Process with existing importer
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const partsSheet = getOrCreatePartsDatabase(ss);
    
    // Format for AI analysis using existing functions
    const formattedData = formatPartsForAI(parsedData);
    
    // Save to sheets
    saveFormattedParts(partsSheet, formattedData);
    createCategoryAnalysis(ss, formattedData);
    
    // Show results
    const categories = [...new Set(formattedData.map(p => p.category))];
    const totalValue = formattedData.reduce((sum, p) => sum + p.unitCost, 0);
    
    ui.alert(
      '🚀 QUICK IMPORT COMPLETE!\n\n' +
      `✅ ${formattedData.length} parts imported\n` +
      `📁 ${categories.length} categories created\n` +
      `💰 $${totalValue.toLocaleString()} total value\n\n` +
      '🤖 AI categorization complete!\n' +
      'Check Master_Parts_Database sheet.'
    );
    
    return {
      success: true,
      partsCount: formattedData.length,
      categories: categories.length
    };
    
  } catch (error) {
    console.error('❌ Quick import failed:', error);
    ui.alert('Import failed: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Parse CSV data with flexible format detection
 */
function parseCSVData(csvText) {
  const lines = csvText.trim().split('\n');
  const parsedParts = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      // Try to parse as CSV (with or without quotes)
      let fields = [];
      
      if (line.includes('","') || line.startsWith('"')) {
        // Quoted CSV
        fields = parseQuotedCSV(line);
      } else if (line.includes(',')) {
        // Simple comma-separated
        fields = line.split(',').map(f => f.trim());
      } else if (line.includes('\t')) {
        // Tab-separated (Excel paste)
        fields = line.split('\t').map(f => f.trim());
      } else {
        // Skip lines that don't look like data
        continue;
      }
      
      // Map fields to part structure
      if (fields.length >= 3) {
        const part = {
          partNumber: fields[0] || `PART_${i}`,
          description: fields[1] || 'No Description',
          vendor: fields[2] || 'Unknown Vendor',
          unitCost: parseFloat(fields[3]) || 0
        };
        
        // Only add if it looks like real data (not header)
        if (!part.partNumber.toLowerCase().includes('part') || 
            !part.partNumber.toLowerCase().includes('number')) {
          parsedParts.push(part);
        }
      }
      
    } catch (lineError) {
      console.warn('⚠️ Skipping line', i, ':', lineError.toString());
      continue;
    }
  }
  
  return parsedParts;
}

/**
 * Parse quoted CSV fields properly
 */
function parseQuotedCSV(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add final field
  fields.push(current.trim());
  
  return fields;
}

/**
 * Import from spreadsheet range (if you have data in another sheet)
 */
function importFromSpreadsheetRange() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.prompt(
    '📊 IMPORT FROM SPREADSHEET RANGE',
    'Enter the range to import from (e.g., "Sheet1!A1:D1000"):\n\n' +
    'Format: SheetName!A1:D[lastRow]\n' +
    'Columns should be: Part#, Description, Vendor, Cost',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.CANCEL) {
    return;
  }
  
  const range = response.getResponseText().trim();
  if (!range) {
    ui.alert('❌ No range provided');
    return;
  }
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = ss.getRange(range).getValues();
    
    // Convert to part objects
    const parts = data.map((row, index) => {
      if (index === 0 && (
        String(row[0]).toLowerCase().includes('part') ||
        String(row[0]).toLowerCase().includes('number')
      )) {
        return null; // Skip header row
      }
      
      return {
        partNumber: String(row[0] || `PART_${index}`),
        description: String(row[1] || 'No Description'),
        vendor: String(row[2] || 'Unknown Vendor'),
        unitCost: parseFloat(row[3]) || 0
      };
    }).filter(part => part !== null);
    
    console.log('📊 Loaded', parts.length, 'parts from range:', range);
    
    // Process with existing system
    const partsSheet = getOrCreatePartsDatabase(ss);
    const formattedData = formatPartsForAI(parts);
    
    saveFormattedParts(partsSheet, formattedData);
    createCategoryAnalysis(ss, formattedData);
    
    ui.alert(
      '📊 SPREADSHEET IMPORT COMPLETE!\n\n' +
      `✅ ${formattedData.length} parts imported\n` +
      `📁 From range: ${range}\n\n` +
      '🤖 AI processing complete!'
    );
    
  } catch (error) {
    console.error('❌ Spreadsheet import failed:', error);
    ui.alert('Range import failed: ' + error.toString());
  }
}
