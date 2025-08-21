/**
 * ============================================================
 * PROFESSIONAL QUOTE GENERATOR ENGINE
 * ============================================================
 * 
 * Modular quote generation system with 5 distinct sections:
 * 1. Header - Logo, customer and quote info (consistent format, unique values)
 * 2. Quote Overview - Job type and big picture information 
 * 3. Quote Detail - Complex panels with automation details and process descriptions
 * 4. Quote Options - Optional additions (parts, installation, commissioning, addons)
 * 5. Quote Terms - Conditions for service
 * 
 * This is the main engine that takes assembled components from the UI 
 * and creates the final, customer-facing, professionally formatted quote document.
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
  const year = now.getFullYear().toString().slice(-1); // Last digit of year
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Get sequence number for today
  const sequenceNumber = getTodaysQuoteSequence();
  const sequenceStr = String(sequenceNumber).padStart(2, '0');
  
  // Determine product code from quote data
  let productCode = 'CUST'; // Default for custom
  if (quoteData.productType) {
    const productCodes = {
      'BHAC': 'BHAC',  // Brewery Heater Automation Controller
      'DTAC': 'DTAC',  // Distillery Temperature Automation Controller  
      'CPAC': 'CPAC',  // Canning Process Automation Controller
      'AGAC': 'AGAC',  // Aging/Glycol Automation Controller
      'GHAC': 'GHAC',  // General Heater Automation Controller
      'MCAC': 'MCAC',  // Multi-Component Automation Controller
      'PCAC': 'PCAC'   // Process Control Automation Controller
    };
    productCode = productCodes[quoteData.productType] || 'CUST';
  }
  
  // Company code (CA for Craft Automation)
  const companyCode = 'CA';
  
  // Build final quote number
  const baseNumber = `CQ${year}${month}${day}${sequenceStr}${productCode}${companyCode}`;
  
  return `${baseNumber}-01`; // Start with -01, increment if exists
}

/**
 * Get today's quote sequence number by counting existing quotes
 */
function getTodaysQuoteSequence() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD format
    
    // Count sheets that start with "Quote_CQ" and were created today
    const sheets = ss.getSheets();
    let todayQuoteCount = 0;
    
    sheets.forEach(sheet => {
      const name = sheet.getName();
      if (name.startsWith('Quote_CQ')) {
        // Check if sheet was created today (rough approximation)
        todayQuoteCount++;
      }
    });
    
    return todayQuoteCount + 1;
    
  } catch (error) {
    console.error('Error getting today\'s quote sequence:', error);
    return 1; // Default to 1 if error
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
  
  // Ensure unique sheet name
  while (ss.getSheetByName(sheetName)) {
    sheetName = `${baseSheetName}_v${counter}`;
    counter++;
  }
  
  // Create and configure the new sheet
  const quoteSheet = ss.insertSheet(sheetName);
  
  // Set up initial sheet properties
  quoteSheet.setTabColor('#1c4587'); // Professional blue
  
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
  // Top of quote with logo, customer and quote info
  // Formatted the same every quote, but with unique values
  
  content.push(['CRAFT AUTOMATION', '', '', '', 'QUOTATION']);
  content.push(['Professional Control System Solutions', '', '', '', '']);
  content.push(['Visit us at CraftAutomation.com', '', '', '', '']);
  content.push(['', '', '', '', '']); // Spacer
  
  // Quote identification section
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
  content.push(['', '', '', '', '']); // Spacer
  
  // Customer information section
  content.push(['CUSTOMER INFORMATION:', '', '', '', '']);
  content.push(['Company:', customer.companyName || 'Customer Name Required', '', '', '']);
  content.push(['Contact:', customer.contactPerson || '', '', '', '']);
  content.push(['Phone:', customer.phone || '', '', '', '']);
  content.push(['Email:', customer.email || '', '', '', '']);
  content.push(['Address:', customer.address || '', '', '', '']);
  content.push(['', '', '', '', '']); // Spacer
  
  // ==========================================
  // SECTION 2: QUOTE OVERVIEW
  // ==========================================
  // Type of job and important big picture information
  // Similar formatting for job types - some simple quotes may only need this
  
  content.push(['PROJECT OVERVIEW:', '', '', '', '']);
  content.push(['Project Name:', project.projectName || 'Automation Control System', '', '', '']);
  content.push(['System Type:', determineSystemType(quoteData), '', '', '']);
  content.push(['Application:', determineApplication(quoteData), '', '', '']);
  content.push(['Scope:', determineProjectScope(quoteData), '', '', '']);
  content.push(['', '', '', '', '']); // Spacer
  
  // ==========================================
  // SECTION 3: QUOTE DETAIL
  // ==========================================
  // For complex panels with automation - specific details addressed 
  // and described by function, description, assemblies and process
  
  if (isComplexSystem(quoteData)) {
    content.push(['SYSTEM DETAILS & SPECIFICATIONS:', '', '', '', '']);
    content.push(['', '', '', '', '']);
    
    // Add detailed system descriptions
    const systemDetails = buildSystemDetails(quoteData);
    systemDetails.forEach(detail => content.push(detail));
    
    content.push(['', '', '', '', '']); // Spacer
  }
  
  // ==========================================
  // COMPONENTS/LINE ITEMS SECTION
  // ==========================================
  
  content.push(['SYSTEM COMPONENTS:', '', '', '', '']);
  content.push(['Line Item', 'Qty.', 'Description', 'Net Price', 'Total Price']);
  
  // Add components with line item letters
  let lineItemLetter = 'A';
  let runningTotal = 0;
  
  components.forEach(component => {
    const qty = component.quantity || 1;
    const unitPrice = component.price || 0;
    const lineTotal = qty * unitPrice;
    runningTotal += lineTotal;
    
    // Format prices for display (leave blank for manual entry if needed)
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
  
  content.push(['', '', '', '', '']); // Spacer
  
  // ==========================================
  // SECTION 4: QUOTE OPTIONS  
  // ==========================================
  // Relevant yet optional additions: parts, installation, commissioning, addons
  
  content.push(['OPTIONAL SERVICES & ADDITIONS:', '', '', '', '']);
  
  const optionalServices = buildOptionalServices(quoteData);
  optionalServices.forEach(service => content.push(service));
  
  content.push(['', '', '', '', '']); // Spacer
  
  // ==========================================
  // PRICING SUMMARY
  // ==========================================
  
  content.push(['', '', 'Equipment Subtotal:', '', runningTotal > 0 ? `$${runningTotal.toFixed(2)}` : 'TBD']);
  content.push(['', '', 'Miscellaneous (15%):', '', runningTotal > 0 ? `$${(runningTotal * 0.15).toFixed(2)}` : 'TBD']);
  content.push(['', '', 'Labor & Engineering:', '', 'TBD']);
  content.push(['', '', '', '', '']);
  content.push(['', '', 'TOTAL INVESTMENT:', '', 'TBD']);
  content.push(['', '', '', '', '']); // Spacer
  
  // ==========================================
  // SECTION 5: QUOTE TERMS
  // ==========================================
  // Conditions for service
  
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

/**
 * Helper function to get quote valid until date (30 days from now)
 */
function getValidUntilDate() {
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 30);
  return validDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Determine system type based on quote data
 */
function determineSystemType(quoteData) {
  const productType = quoteData.productType;
  
  const systemTypes = {
    'BHAC': 'Brewery Heating Automation Controller',
    'DTAC': 'Distillery Temperature Automation Controller',
    'CPAC': 'Canning Process Automation Controller', 
    'AGAC': 'Aging/Glycol Automation Controller',
    'GHAC': 'General Heating Automation Controller',
    'MCAC': 'Multi-Component Automation Controller',
    'PCAC': 'Process Control Automation Controller'
  };
  
  return systemTypes[productType] || 'Custom Automation Control System';
}

/**
 * Determine application based on components and system type
 */
function determineApplication(quoteData) {
  const productType = quoteData.productType;
  
  const applications = {
    'BHAC': 'Brewery heating and temperature control',
    'DTAC': 'Distillery process temperature management',
    'CPAC': 'Automated canning line control',
    'AGAC': 'Aging room and glycol system control',
    'GHAC': 'General heating system automation',
    'MCAC': 'Multi-zone process control',
    'PCAC': 'General process control automation'
  };
  
  return applications[productType] || 'Custom process control and automation';
}

/**
 * Determine project scope based on complexity
 */
function determineProjectScope(quoteData) {
  const componentCount = (quoteData.components || []).length;
  
  if (componentCount <= 3) {
    return 'Simple control panel with basic automation';
  } else if (componentCount <= 8) {
    return 'Standard automation system with multiple control points';
  } else {
    return 'Complex automation system with advanced process control';
  }
}

/**
 * Check if this is a complex system requiring detailed specifications
 */
function isComplexSystem(quoteData) {
  const componentCount = (quoteData.components || []).length;
  const complexTypes = ['MCAC', 'PCAC', 'CPAC'];
  
  return componentCount > 5 || complexTypes.includes(quoteData.productType);
}

/**
 * Build detailed system specifications for complex systems
 */
function buildSystemDetails(quoteData) {
  const details = [];
  
  // Add functional descriptions based on system type
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

/**
 * Build optional services section
 */
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

/**
 * Write content to sheet and apply professional formatting
 * This function applies all the specific formatting to match professional aesthetic
 */
function writeAndFormatQuote(sheet, content) {
  // Write all data to the sheet in one operation (fast and efficient)
  const numRows = content.length;
  const numCols = content[0] ? content[0].length : 5;
  
  sheet.getRange(1, 1, numRows, numCols).setValues(content);
  
  // ==========================================
  // APPLY PROFESSIONAL FORMATTING
  // ==========================================
  
  // Set column widths for optimal display
  sheet.setColumnWidth(1, 100);  // Line Item / Labels
  sheet.setColumnWidth(2, 80);   // Qty / Values  
  sheet.setColumnWidth(3, 400);  // Description / Main content
  sheet.setColumnWidth(4, 120);  // Net Price / Company info
  sheet.setColumnWidth(5, 120);  // Total Price / Extra info
  
  // Header section formatting (rows 1-3)
  sheet.getRange('A1:E1').merge();
  sheet.getRange('A1').setFontSize(18).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange('A1').setBackground('#1c4587').setFontColor('#ffffff');
  
  sheet.getRange('A2:E2').merge();
  sheet.getRange('A2').setFontSize(12).setHorizontalAlignment('center');
  sheet.getRange('A2').setBackground('#6fa8dc').setFontColor('#ffffff');
  
  sheet.getRange('A3:E3').merge();
  sheet.getRange('A3').setFontSize(10).setHorizontalAlignment('center');
  sheet.getRange('A3').setBackground('#9fc5e8').setFontColor('#000000');
  
  // Quote info section formatting
  const quoteInfoRows = sheet.getRange('A5:E11');
  quoteInfoRows.setBackground('#f4f4f4');
  
  // Section headers formatting (find and format dynamically)
  for (let i = 1; i <= numRows; i++) {
    const cellValue = sheet.getRange(i, 1).getValue();
    if (typeof cellValue === 'string' && cellValue.includes(':') && cellValue.toUpperCase() === cellValue) {
      // This is a section header
      sheet.getRange(i, 1, 1, 5).setFontWeight('bold').setBackground('#e1ecf7');
    }
  }
  
  // Line items table formatting
  const lineItemHeaderRow = findRowContaining(content, 'Line Item');
  if (lineItemHeaderRow > 0) {
    sheet.getRange(lineItemHeaderRow, 1, 1, 5)
      .setFontWeight('bold')
      .setBackground('#d9ead3')
      .setHorizontalAlignment('center');
  }
  
  // Price columns formatting (currency format)
  sheet.getRange(`D:E`).setNumberFormat('$#,##0.00');
  
  // Terms section formatting
  const termsRow = findRowContaining(content, 'TERMS & CONDITIONS');
  if (termsRow > 0) {
    sheet.getRange(termsRow, 1, 1, 5).setFontWeight('bold').setBackground('#fce5cd');
  }
  
  // Add borders to important sections
  sheet.getRange(1, 1, numRows, numCols).setBorder(true, true, true, true, false, false);
  
  // Freeze header rows
  sheet.setFrozenRows(4);
  
  console.log('✅ Professional formatting applied successfully');
}

/**
 * Helper function to find a row containing specific text
 */
function findRowContaining(content, searchText) {
  for (let i = 0; i < content.length; i++) {
    for (let j = 0; j < content[i].length; j++) {
      if (content[i][j] && content[i][j].toString().includes(searchText)) {
        return i + 1; // Convert to 1-based indexing
      }
    }
  }
  return 0;
}

/**
 * Log the final quote in the master 'Quotes' database for tracking
 */
function logFinalQuote(quoteNumber, quoteData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let quotesSheet = ss.getSheetByName('Quotes_Database');
    
    // Create quotes database sheet if it doesn't exist
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
    
    // Calculate estimated total
    const components = quoteData.components || [];
    const estTotal = components.reduce((sum, comp) => sum + ((comp.quantity || 1) * (comp.price || 0)), 0);
    
    // Add quote record
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
    // Don't fail the entire quote generation for logging errors
  }
}
