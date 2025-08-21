/**
 * ============================================================
 * PROFESSIONAL QUOTE GENERATOR ENGINE - JavaScript Version
 * ============================================================
 * 
 * This is the JavaScript mirror of ProfessionalQuoteGenerator.gs
 * Provides the same structured 5-section quote format for consistency
 */

/**
 * Main entry point: Takes the final data package from the UI and generates a 
 * professional, formatted quote in a new sheet.
 * @param {object} quoteData The complete data package from hybrid assembler + customer info
 * @returns {object} A result object with the new quote number and sheet name
 */
function generateProfessionalQuote(quoteData) {
  try {
    console.log('🚀 Starting Professional Quote Generation...');
    
    // STEP 1: Generate the final, unique quote number
    const quoteNumber = generateFinalQuoteNumber(quoteData);
    console.log(`📋 Generated Quote Number: ${quoteNumber}`);
    
    // STEP 2: Create a new, dedicated sheet for this quote
    const quoteSheet = createNewQuoteSheet(quoteNumber);
    console.log(`📄 Created Quote Sheet: ${quoteSheet.getName()}`);
    
    // STEP 3: Build the quote content as an array of arrays (a "virtual sheet")
    const quoteContent = buildQuoteContentArray(quoteNumber, quoteData);
    console.log(`🔧 Built quote content with ${quoteContent.length} rows`);
    
    // STEP 4: Write the content to the new sheet and apply professional formatting
    writeAndFormatQuote(quoteSheet, quoteContent);
    console.log(`✨ Applied professional formatting`);
    
    // STEP 5: Log the final quote in the master 'Quotes' database
    logFinalQuote(quoteNumber, quoteData);
    console.log(`💾 Logged quote to database`);
    
    return { 
      success: true, 
      quoteNumber: quoteNumber, 
      sheetName: quoteSheet.getName(),
      message: `Professional quote ${quoteNumber} generated successfully!`
    };
    
  } catch (error) {
    console.error('❌ Error in generateProfessionalQuote:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to generate quote: ${error.message}`
    };
  }
}

/**
 * Generate the final, unique quote number using the established system format
 * Format: CQ[YY][MM][DD][NN][ProductCode][CompanyCode]-[SequenceNumber]
 */
function generateFinalQuoteNumber(quoteData) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-1);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Get sequence number for today
  const sequenceNumber = getTodaysQuoteSequence();
  const sequenceStr = String(sequenceNumber).padStart(2, '0');
  
  // Determine product code from quote data
  let productCode = 'CUST';
  if (quoteData.productType) {
    const productCodes = {
      'BHAC': 'BHAC',
      'DTAC': 'DTAC',
      'CPAC': 'CPAC',
      'AGAC': 'AGAC',
      'GHAC': 'GHAC',
      'MCAC': 'MCAC',
      'PCAC': 'PCAC'
    };
    productCode = productCodes[quoteData.productType] || 'CUST';
  }
  
  const companyCode = 'CA';
  const baseNumber = `CQ${year}${month}${day}${sequenceStr}${productCode}${companyCode}`;
  
  return `${baseNumber}-01`;
}

/**
 * Get today's quote sequence number by counting existing quotes
 */
function getTodaysQuoteSequence() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    let todayQuoteCount = 0;
    
    sheets.forEach(sheet => {
      const name = sheet.getName();
      if (name.startsWith('Quote_CQ')) {
        todayQuoteCount++;
      }
    });
    
    return todayQuoteCount + 1;
    
  } catch (error) {
    console.error('Error getting today\'s quote sequence:', error);
    return 1;
  }
}

/**
 * Create a new, dedicated sheet for this quote with unique naming
 */
function createNewQuoteSheet(quoteNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const baseSheetName = `Quote_${quoteNumber}`;
  let sheetName = baseSheetName;
  let counter = 2;
  
  while (ss.getSheetByName(sheetName)) {
    sheetName = `${baseSheetName}_v${counter}`;
    counter++;
  }
  
  const quoteSheet = ss.insertSheet(sheetName);
  quoteSheet.setTabColor('#1c4587');
  
  return quoteSheet;
}

/**
 * Build the complete quote content as an array of arrays (virtual sheet)
 * This constructs all 5 sections in the proper format before writing to the sheet
 */
function buildQuoteContentArray(quoteNumber, quoteData) {
  const content = [];
  const customer = quoteData.customerInfo || {};
  const project = quoteData.projectInfo || {};
  const components = quoteData.components || [];
  
  // ==========================================
  // SECTION 1: HEADER 
  // ==========================================
  
  content.push(['CRAFT AUTOMATION', '', '', '', 'QUOTATION']);
  content.push(['Professional Control System Solutions', '', '', '', '']);
  content.push(['Visit us at CraftAutomation.com', '', '', '', '']);
  content.push(['', '', '', '', '']);
  
  content.push(['Quote Number:', quoteNumber, '', 'MiCraft, LLC', '']);
  content.push(['Date:', new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), '', '5349 N Riverview Dr', '']);
  content.push(['Valid Until:', getValidUntilDate(), '', 'Kalamazoo, MI 49005', '']);
  content.push(['', '', '', '', '']);
  content.push(['', '', '', 'Phone: (270) 389-0048', '']);
  content.push(['', '', '', 'Email: Sales@CraftAutomation.com', '']);
  content.push(['', '', '', '', '']);
  
  content.push(['CUSTOMER INFORMATION:', '', '', '', '']);
  content.push(['Company:', customer.companyName || 'Customer Name Required', '', '', '']);
  content.push(['Contact:', customer.contactPerson || '', '', '', '']);
  content.push(['Phone:', customer.phone || '', '', '', '']);
  content.push(['Email:', customer.email || '', '', '', '']);
  content.push(['Address:', customer.address || '', '', '', '']);
  content.push(['', '', '', '', '']);
  
  // ==========================================
  // SECTION 2: QUOTE OVERVIEW
  // ==========================================
  
  content.push(['PROJECT OVERVIEW:', '', '', '', '']);
  content.push(['Project Name:', project.projectName || 'Automation Control System', '', '', '']);
  content.push(['System Type:', determineSystemType(quoteData), '', '', '']);
  content.push(['Application:', determineApplication(quoteData), '', '', '']);
  content.push(['Scope:', determineProjectScope(quoteData), '', '', '']);
  content.push(['', '', '', '', '']);
  
  // ==========================================
  // SECTION 3: QUOTE DETAIL (for complex systems)
  // ==========================================
  
  if (isComplexSystem(quoteData)) {
    content.push(['SYSTEM DETAILS & SPECIFICATIONS:', '', '', '', '']);
    content.push(['', '', '', '', '']);
    
    const systemDetails = buildSystemDetails(quoteData);
    systemDetails.forEach(detail => content.push(detail));
    
    content.push(['', '', '', '', '']);
  }
  
  // ==========================================
  // COMPONENTS/LINE ITEMS SECTION
  // ==========================================
  
  content.push(['SYSTEM COMPONENTS:', '', '', '', '']);
  content.push(['Line Item', 'Qty.', 'Description', 'Net Price', 'Total Price']);
  
  let lineItemLetter = 'A';
  let runningTotal = 0;
  
  components.forEach(component => {
    const qty = component.quantity || 1;
    const unitPrice = component.price || 0;
    const lineTotal = qty * unitPrice;
    runningTotal += lineTotal;
    
    const unitPriceDisplay = unitPrice > 0 ? `$${unitPrice.toFixed(2)}` : '';
    const lineTotalDisplay = lineTotal > 0 ? `$${lineTotal.toFixed(2)}` : '';
    
    content.push([
      lineItemLetter,
      qty,
      component.description || component.name || component.partNumber || 'Component Description',
      unitPriceDisplay,
      lineTotalDisplay
    ]);
    
    lineItemLetter = String.fromCharCode(lineItemLetter.charCodeAt(0) + 1);
  });
  
  content.push(['', '', '', '', '']);
  
  // ==========================================
  // SECTION 4: QUOTE OPTIONS  
  // ==========================================
  
  content.push(['OPTIONAL SERVICES & ADDITIONS:', '', '', '', '']);
  
  const optionalServices = buildOptionalServices(quoteData);
  optionalServices.forEach(service => content.push(service));
  
  content.push(['', '', '', '', '']);
  
  // ==========================================
  // PRICING SUMMARY
  // ==========================================
  
  content.push(['', '', 'Equipment Subtotal:', '', runningTotal > 0 ? `$${runningTotal.toFixed(2)}` : 'TBD']);
  content.push(['', '', 'Miscellaneous (15%):', '', runningTotal > 0 ? `$${(runningTotal * 0.15).toFixed(2)}` : 'TBD']);
  content.push(['', '', 'Labor & Engineering:', '', 'TBD']);
  content.push(['', '', '', '', '']);
  content.push(['', '', 'TOTAL INVESTMENT:', '', 'TBD']);
  content.push(['', '', '', '', '']);
  
  // ==========================================
  // SECTION 5: QUOTE TERMS
  // ==========================================
  
  content.push(['TERMS & CONDITIONS:', '', '', '', '']);
  content.push(['• Payment: 50% down payment, 50% upon completion', '', '', '', '']);
  content.push(['• Delivery: 4-6 weeks from order acknowledgment', '', '', '', '']);
  content.push(['• Warranty: 2 year parts and labor warranty', '', '', '', '']);
  content.push(['• Installation: Available separately - see optional services', '', '', '', '']);
  content.push(['• Commissioning: Available separately - see optional services', '', '', '', '']);
  content.push(['• Valid: 30 days from quote date', '', '', '', '']);
  content.push(['• Shipping: FOB Kalamazoo, MI unless otherwise specified', '', '', '', '']);
  content.push(['', '', '', '', '']);
  content.push(['Thank you for considering Craft Automation for your project!', '', '', '', '']);
  content.push(['Questions? Contact us at Sales@CraftAutomation.com', '', '', '', '']);
  
  return content;
}

// Helper functions (simplified versions)
function getValidUntilDate() {
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 30);
  return validDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function determineSystemType(quoteData) {
  const systemTypes = {
    'BHAC': 'Brewery Heating Automation Controller',
    'DTAC': 'Distillery Temperature Automation Controller',
    'CPAC': 'Canning Process Automation Controller', 
    'AGAC': 'Aging/Glycol Automation Controller',
    'GHAC': 'General Heating Automation Controller',
    'MCAC': 'Multi-Component Automation Controller',
    'PCAC': 'Process Control Automation Controller'
  };
  return systemTypes[quoteData.productType] || 'Custom Automation Control System';
}

function determineApplication(quoteData) {
  const applications = {
    'BHAC': 'Brewery heating and temperature control',
    'DTAC': 'Distillery process temperature management',
    'CPAC': 'Automated canning line control',
    'AGAC': 'Aging room and glycol system control',
    'GHAC': 'General heating system automation',
    'MCAC': 'Multi-zone process control',
    'PCAC': 'General process control automation'
  };
  return applications[quoteData.productType] || 'Custom process control and automation';
}

function determineProjectScope(quoteData) {
  const componentCount = (quoteData.components || []).length;
  if (componentCount <= 3) return 'Simple control panel with basic automation';
  if (componentCount <= 8) return 'Standard automation system with multiple control points';
  return 'Complex automation system with advanced process control';
}

function isComplexSystem(quoteData) {
  const componentCount = (quoteData.components || []).length;
  const complexTypes = ['MCAC', 'PCAC', 'CPAC'];
  return componentCount > 5 || complexTypes.includes(quoteData.productType);
}

function buildSystemDetails(quoteData) {
  const details = [];
  details.push(['FUNCTIONAL DESCRIPTION:', '', '', '', '']);
  details.push(['This system provides automated control and monitoring', '', '', '', '']);
  details.push(['capabilities for your process requirements. The system', '', '', '', '']);
  details.push(['includes all necessary components for safe, reliable', '', '', '', '']);
  details.push(['operation with user-friendly interface controls.', '', '', '', '']);
  details.push(['', '', '', '', '']);
  
  details.push(['TECHNICAL SPECIFICATIONS:', '', '', '', '']);
  details.push(['• Control Voltage: 120VAC / 24VDC', '', '', '', '']);
  details.push(['• Power: 480VAC, 3-phase (as required)', '', '', '', '']);
  details.push(['• Enclosure: NEMA 4X stainless steel', '', '', '', '']);
  details.push(['• Interface: Color touchscreen HMI', '', '', '', '']);
  details.push(['• Communication: Ethernet/ModBus RTU', '', '', '', '']);
  details.push(['• Safety: Emergency stop and safety interlocks', '', '', '', '']);
  
  return details;
}

function buildOptionalServices(quoteData) {
  const services = [];
  
  services.push(['Installation & Commissioning:', '', '', '', '']);
  services.push(['• Field installation and wiring', '', '', 'Quote upon request', '']);
  services.push(['• System commissioning and startup', '', '', 'Quote upon request', '']);
  services.push(['• Operator training (4 hours)', '', '', 'Quote upon request', '']);
  services.push(['', '', '', '', '']);
  
  services.push(['Extended Support Options:', '', '', '', '']);
  services.push(['• Remote monitoring setup', '', '', 'Quote upon request', '']);
  services.push(['• Annual maintenance contract', '', '', 'Quote upon request', '']);
  services.push(['• Extended warranty (3rd year)', '', '', 'Quote upon request', '']);
  services.push(['', '', '', '', '']);
  
  services.push(['Additional Components:', '', '', '', '']);
  services.push(['• Spare parts kit', '', '', 'Quote upon request', '']);
  services.push(['• Additional I/O expansion', '', '', 'Quote upon request', '']);
  services.push(['• Custom software modifications', '', '', 'Quote upon request', '']);
  
  return services;
}

function writeAndFormatQuote(sheet, content) {
  const numRows = content.length;
  const numCols = content[0] ? content[0].length : 5;
  
  sheet.getRange(1, 1, numRows, numCols).setValues(content);
  
  // Column widths
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 400);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 120);
  
  // Header formatting
  sheet.getRange('A1:E1').merge();
  sheet.getRange('A1').setFontSize(18).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange('A1').setBackground('#1c4587').setFontColor('#ffffff');
  
  sheet.getRange('A2:E2').merge();
  sheet.getRange('A2').setFontSize(12).setHorizontalAlignment('center');
  sheet.getRange('A2').setBackground('#6fa8dc').setFontColor('#ffffff');
  
  sheet.getRange('A3:E3').merge();
  sheet.getRange('A3').setFontSize(10).setHorizontalAlignment('center');
  sheet.getRange('A3').setBackground('#9fc5e8').setFontColor('#000000');
  
  // Section headers
  for (let i = 1; i <= numRows; i++) {
    const cellValue = sheet.getRange(i, 1).getValue();
    if (typeof cellValue === 'string' && cellValue.includes(':') && cellValue.toUpperCase() === cellValue) {
      sheet.getRange(i, 1, 1, 5).setFontWeight('bold').setBackground('#e1ecf7');
    }
  }
  
  // Line items table
  const lineItemHeaderRow = findRowContaining(content, 'Line Item');
  if (lineItemHeaderRow > 0) {
    sheet.getRange(lineItemHeaderRow, 1, 1, 5)
      .setFontWeight('bold')
      .setBackground('#d9ead3')
      .setHorizontalAlignment('center');
  }
  
  // Price formatting
  sheet.getRange(`D:E`).setNumberFormat('$#,##0.00');
  
  // Terms section
  const termsRow = findRowContaining(content, 'TERMS & CONDITIONS');
  if (termsRow > 0) {
    sheet.getRange(termsRow, 1, 1, 5).setFontWeight('bold').setBackground('#fce5cd');
  }
  
  // Borders and freeze
  sheet.getRange(1, 1, numRows, numCols).setBorder(true, true, true, true, false, false);
  sheet.setFrozenRows(4);
  
  console.log('✅ Professional formatting applied successfully');
}

function findRowContaining(content, searchText) {
  for (let i = 0; i < content.length; i++) {
    for (let j = 0; j < content[i].length; j++) {
      if (content[i][j] && content[i][j].toString().includes(searchText)) {
        return i + 1;
      }
    }
  }
  return 0;
}

function logFinalQuote(quoteNumber, quoteData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let quotesSheet = ss.getSheetByName('Quotes_Database');
    
    if (!quotesSheet) {
      quotesSheet = ss.insertSheet('Quotes_Database');
      const headers = [
        'Quote Number', 'Date Created', 'Customer Name', 'Contact Person', 
        'Project Name', 'System Type', 'Component Count', 'Est. Total', 
        'Status', 'Valid Until', 'Created By'
      ];
      quotesSheet.appendRow(headers);
      quotesSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#cccccc');
    }
    
    const components = quoteData.components || [];
    const estTotal = components.reduce((sum, comp) => sum + ((comp.quantity || 1) * (comp.price || 0)), 0);
    
    const quoteRecord = [
      quoteNumber,
      new Date(),
      quoteData.customerInfo?.companyName || 'Unknown',
      quoteData.customerInfo?.contactPerson || '',
      quoteData.projectInfo?.projectName || 'Automation Project',
      determineSystemType(quoteData),
      components.length,
      estTotal > 0 ? estTotal : 'TBD',
      'Generated',
      getValidUntilDate(),
      Session.getActiveUser().getEmail()
    ];
    
    quotesSheet.appendRow(quoteRecord);
    console.log('✅ Quote logged to database successfully');
    
  } catch (error) {
    console.error('❌ Error logging quote to database:', error);
  }
}

/**
 * Update the existing generateQuoteFromHybridData to use the new engine
 */
function generateQuoteFromHybridData(hybridData) {
  try {
    console.log('🔄 Redirecting to Professional Quote Generator Engine...');
    
    const result = generateProfessionalQuote(hybridData);
    
    if (result.success) {
      console.log(`✅ Professional quote generated: ${result.quoteNumber}`);
      return result;
    } else {
      console.error('❌ Professional quote generation failed:', result.error);
      return result;
    }
    
  } catch (error) {
    console.error('❌ Error in generateQuoteFromHybridData:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to generate quote: ${error.message}`
    };
  }
}
