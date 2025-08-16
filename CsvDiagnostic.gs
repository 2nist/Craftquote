/**
 * CSV DIAGNOSTIC TOOL
 * Analyze your actual CSV file before importing
 * Prevents surprises and failed imports!
 */

function diagnoseCsvFile() {
  console.log("🔍 Starting CSV Diagnostic...");
  
  try {
    // Find the CSV file
    const csvFile = findCsvFile();
    if (!csvFile) {
      Browser.msgBox("CSV Not Found", 
        "❌ Could not find your CSV file.\n\nPlease ensure 'COMPONENT PRICE LIST [MASTER]' is accessible in Google Drive.", 
        Browser.Buttons.OK);
      return;
    }
    
    const mime = csvFile.getMimeType();
    let analysis;
    
    if (mime === 'text/csv' || /csv/.test(csvFile.getName().toLowerCase())) {
      // Read and analyze raw CSV text
      const csvText = csvFile.getBlob().getDataAsString();
      analysis = analyzeCsvStructure(csvText);
    } else if (mime === 'application/vnd.google-apps.spreadsheet') {
      // Analyze Google Sheet contents directly
      analysis = analyzeSpreadsheetStructure(csvFile);
    } else if (mime === 'application/pdf') {
      // Helpful message when a PDF is encountered
      Browser.msgBox(
        'Found PDF instead of CSV',
        '⚠️ The file resolved appears to be a PDF export.\n' +
        'Please point to a real CSV file or the original Google Sheet.\n' +
        'Tip: The diagnostic now supports Google Sheets directly.',
        Browser.Buttons.OK
      );
      return;
    } else {
      // Fallback: try reading as text, then analyze
      const text = csvFile.getBlob().getDataAsString();
      analysis = analyzeCsvStructure(text);
    }
    
    // Show detailed report
    showCsvAnalysis(analysis);
    
  } catch (error) {
    console.error("❌ Diagnostic failed:", error);
    Browser.msgBox("Diagnostic Failed", `Error: ${error.message}`, Browser.Buttons.OK);
  }
}

function findCsvFile() {
  // Try multiple search strategies
  const searchStrategies = [
    () => DriveApp.getFilesByName("COMPONENT PRICE LIST [MASTER]"),
    () => DriveApp.searchFiles("title contains 'COMPONENT PRICE LIST'"),
    () => DriveApp.searchFiles("title contains 'MASTER'"),
    () => DriveApp.searchFiles("title contains 'COMPONENT'"),
    () => DriveApp.searchFiles("mimeType = 'text/csv'"),
    () => DriveApp.searchFiles("mimeType = 'application/vnd.google-apps.spreadsheet'")
  ];
  
  for (let i = 0; i < searchStrategies.length; i++) {
    try {
      const files = searchStrategies[i]();
      if (files.hasNext()) {
        const file = files.next();
        console.log(`📄 Found file using strategy ${i + 1}: ${file.getName()}`);
        return file;
      }
    } catch (e) {
      continue;
    }
  }
  
  return null;
}

function analyzeSpreadsheetStructure(file) {
  const ss = SpreadsheetApp.openById(file.getId());
  const sheet = ss.getSheets()[0];
  const values = sheet.getDataRange().getValues();
  if (!values || values.length === 0) {
    throw new Error('Spreadsheet appears to be empty');
  }
  const headers = (values[0] || []).map(v => (v !== null && v !== undefined ? v.toString().trim() : ''));
  const sampleRows = values.slice(1, Math.min(6, values.length)).map(row => row.map(v => (v !== null && v !== undefined ? v.toString() : '')));
  const dataQuality = analyzeDataQuality(sampleRows, headers);
  return {
    fileName: file.getName(),
    totalLines: values.length,
    delimiter: 'sheet',
    columnCount: headers.length,
    headers,
    sampleRows,
    dataQuality
  };
}

function analyzeCsvStructure(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim()).slice(0, 10); // First 10 lines
  
  if (lines.length === 0) {
    throw new Error("CSV appears to be empty");
  }
  
  // Analyze first line (headers)
  const firstLine = lines[0];
  const potentialDelimiters = [',', ';', '\t', '|'];
  let bestDelimiter = ',';
  let maxColumns = 0;
  
  for (const delimiter of potentialDelimiters) {
    const columnCount = firstLine.split(delimiter).length;
    if (columnCount > maxColumns) {
      maxColumns = columnCount;
      bestDelimiter = delimiter;
    }
  }
  
  const headers = parseCSVLine(firstLine, bestDelimiter);
  
  // Analyze sample data rows
  const sampleRows = lines.slice(1, Math.min(6, lines.length)).map(line => 
    parseCSVLine(line, bestDelimiter)
  );
  
  // Data quality check
  const dataQuality = analyzeDataQuality(sampleRows, headers);
  
  return {
    fileName: "Found CSV file",
    totalLines: csvText.split('\n').length,
    delimiter: bestDelimiter,
    columnCount: headers.length,
    headers: headers,
    sampleRows: sampleRows,
    dataQuality: dataQuality
  };
}

function parseCSVLine(line, delimiter = ',') {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function analyzeDataQuality(sampleRows, headers) {
  const issues = [];
  const columnAnalysis = [];
  
  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const columnName = headers[colIndex];
    const values = sampleRows.map(row => row[colIndex] || '');
    
    const analysis = {
      name: columnName,
      emptyCount: values.filter(v => !v || v.trim() === '').length,
      sampleValues: values.slice(0, 3),
      hasNumbers: values.some(v => /\d/.test(v)),
      hasCurrency: values.some(v => /[$£€¥]/.test(v)),
      hasCommas: values.some(v => /,/.test(v))
    };
    
    columnAnalysis.push(analysis);
  }
  
  return { columnAnalysis, issues };
}

function showCsvAnalysis(analysis) {
  let report = `🔍 CSV DIAGNOSTIC REPORT\n\n`;
  report += `📄 File Analysis:\n`;
  report += `  • Total Lines: ${analysis.totalLines}\n`;
  report += `  • Delimiter: "${analysis.delimiter}"\n`;
  report += `  • Columns: ${analysis.columnCount}\n\n`;
  
  report += `📊 Column Structure:\n`;
  analysis.headers.forEach((header, i) => {
    report += `  ${i + 1}. "${header}"\n`;
  });
  
  report += `\n📋 Sample Data (First Row):\n`;
  analysis.sampleRows[0]?.forEach((value, i) => {
    report += `  ${analysis.headers[i]}: "${value}"\n`;
  });
  
  report += `\n🔧 Data Quality:\n`;
  analysis.dataQuality.columnAnalysis.forEach(col => {
    if (col.emptyCount > 0) {
      report += `  ⚠️ Column "${col.name}" has ${col.emptyCount} empty values\n`;
    }
    if (col.hasCurrency) {
      report += `  💰 Column "${col.name}" contains currency symbols\n`;
    }
  });
  
  report += `\n🎯 RECOMMENDATION:\n`;
  report += `Based on this analysis, the import should ${analysis.columnCount >= 6 ? 'work' : 'need adjustment'}.\n`;
  
  Browser.msgBox("CSV Diagnostic Complete", report, Browser.Buttons.OK);
  console.log("📊 Full Analysis:", analysis);
}
