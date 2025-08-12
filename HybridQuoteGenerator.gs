// ============================================================
// HYBRID QUOTE GENERATOR - Bridge Between Assembler & Quotes
// ============================================================
// Connects the Hybrid Component Assembler to your professional quote system
// Creates formatted Google Sheets quotes that match your existing templates

/**
 * Generate professional quote from Hybrid Assembler data
 * Called when user clicks "Generate Quote" in Hybrid interface
 */
function generateQuoteFromHybridData(hybridData) {
  try {
    // Get next quote number using your existing system
    const quoteNumber = generateNextQuoteNumber();
    
    // Transform hybrid data to quote format
    const quoteData = transformHybridToQuoteData(hybridData, quoteNumber);
    
    // Generate formatted quote using your existing system
    const formattedQuote = generateFormattedQuote(quoteData);
    
    // Create new sheet for this quote
    const quoteSheet = createQuoteSheet(quoteNumber, formattedQuote);
    
    // Save quote data to tracking sheets
    saveQuoteToDatabase(quoteData);
    
    return {
      success: true,
      quoteNumber: quoteNumber,
      sheetName: quoteSheet.getName(),
      message: `Professional quote ${quoteNumber} generated successfully!`
    };
    
  } catch (error) {
    console.error('Error generating quote from hybrid data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Transform Hybrid Assembler data to your quote system format
 */
function transformHybridToQuoteData(hybridData, quoteNumber) {
  const {
    customerInfo = {},
    projectInfo = {},
    components = [],
    productType = 'CUSTOM'
  } = hybridData;
  
  // Calculate electrical data
  let totalFLA = 0;
  const selectedComponents = components.map(component => {
    if (component.fla) {
      totalFLA += parseFloat(component.fla) || 0;
    }
    
    return {
      description: component.description || component.partNumber,
      partNumber: component.partNumber,
      quantity: component.quantity || 1,
      price: component.price || 0,
      fla: component.fla || 0,
      voltage: component.voltage || '480V',
      category: component.category
    };
  });
  
  // Calculate disconnect size based on total FLA
  const disconnectSize = calculateDisconnectSize(totalFLA);
  
  return {
    quoteNumber: quoteNumber,
    customerName: customerInfo.companyName || 'Customer Name Required',
    companyName: customerInfo.companyName || '',
    shippingAddress: customerInfo.address || '',
    email: customerInfo.email || '',
    phone: customerInfo.phone || '',
    contactPerson: customerInfo.contactPerson || '',
    projectName: projectInfo.projectName || 'Automation Project',
    selectedComponents: selectedComponents,
    productType: productType,
    totalFLA: totalFLA,
    disconnectSize: disconnectSize,
    miscPercentage: 15 // Standard misc materials percentage
  };
}

/**
 * Create new quote sheet with formatted data
 */
function createQuoteSheet(quoteNumber, formattedQuote) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create new sheet with quote number as name
  const sheetName = `Quote_${quoteNumber}`;
  let quoteSheet = spreadsheet.getSheetByName(sheetName);
  
  if (quoteSheet) {
    // Sheet exists, clear it
    quoteSheet.clear();
  } else {
    // Create new sheet
    quoteSheet = spreadsheet.insertSheet(sheetName);
  }
  
  // Add formatted quote data
  if (formattedQuote && formattedQuote.length > 0) {
    const range = quoteSheet.getRange(1, 1, formattedQuote.length, formattedQuote[0].length);
    range.setValues(formattedQuote);
    
    // Apply formatting to match your professional style
    applyQuoteFormatting(quoteSheet, formattedQuote.length);
  }
  
  return quoteSheet;
}

/**
 * Apply professional formatting to match your existing quote style
 */
function applyQuoteFormatting(sheet, numRows) {
  // Set column widths (matches your existing templates)
  const columnWidths = [
    60,   // A - Line Item
    50,   // B - Qty
    80,   // C - Description column 1
    300,  // D - Main description
    80,   // E - Extra space
    80,   // F - Extra space
    80,   // G - Extra space
    120,  // H - Contact info
    150,  // I - Customer data
    80,   // J - Net Price
    100   // K - Total Price
  ];
  
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // Set font to Tahoma 9pt (matches your templates)
  const fullRange = sheet.getRange(1, 1, numRows, 11);
  fullRange.setFontFamily('Tahoma');
  fullRange.setFontSize(9);
  
  // Header formatting (first 15 rows typically)
  if (numRows > 15) {
    const headerRange = sheet.getRange(1, 1, 15, 11);
    headerRange.setBackground('#f8f9fa');
    
    // Company info in bold
    const companyRange = sheet.getRange(8, 7, 3, 2);
    companyRange.setFontWeight('bold');
  }
  
  // Line items table formatting (find where line items start)
  for (let row = 15; row <= numRows; row++) {
    const cellValue = sheet.getRange(row, 1).getValue();
    if (cellValue === 'Line Item') {
      // Header row
      const headerRow = sheet.getRange(row, 1, 1, 11);
      headerRow.setFontWeight('bold');
      headerRow.setBackground('#e9ecef');
      
      // Add borders to line items section
      const lineItemsRange = sheet.getRange(row, 1, numRows - row + 1, 11);
      lineItemsRange.setBorder(true, true, true, true, true, true);
      break;
    }
  }
  
  // Price column formatting (right align)
  const priceColumns = sheet.getRange(1, 10, numRows, 2);
  priceColumns.setHorizontalAlignment('right');
}

/**
 * Save quote data to your tracking database
 */
function saveQuoteToDatabase(quoteData) {
  try {
    // Save to Quotes tracking sheet
    const quotesSheet = getOrCreateSheet('Quotes_Database');
    const quotesHeaders = [
      'QuoteNumber', 'Date', 'CustomerName', 'ProductType', 'ProjectName',
      'TotalFLA', 'DisconnectSize', 'ComponentCount', 'QuoteTotal', 'Status'
    ];
    
    // Add headers if sheet is empty
    if (quotesSheet.getLastRow() === 0) {
      quotesSheet.appendRow(quotesHeaders);
    }
    
    // Calculate total
    const quoteTotal = quoteData.selectedComponents.reduce((sum, comp) => 
      sum + (comp.quantity * comp.price), 0);
    
    // Add quote record
    const quoteRecord = [
      quoteData.quoteNumber,
      new Date(),
      quoteData.customerName,
      quoteData.productType,
      quoteData.projectName,
      quoteData.totalFLA,
      quoteData.disconnectSize,
      quoteData.selectedComponents.length,
      quoteTotal,
      'Generated'
    ];
    
    quotesSheet.appendRow(quoteRecord);
    
    // Save line items to Line_Items sheet
    saveQuoteLineItems(quoteData.quoteNumber, quoteData.selectedComponents);
    
  } catch (error) {
    console.error('Error saving quote to database:', error);
  }
}

/**
 * Add "Generate Quote" button to Hybrid Assembler
 * This function is called from the HTML interface
 */
function generateQuoteFromHybridAssembler() {
  // Use the inline HTML from getCustomerInfoForm instead of external file
  return getCustomerInfoForm()
    .setWidth(600)
    .setHeight(500)
    .setTitle('Generate Professional Quote');
}

/**
 * Get customer info form for quote generation
 */
function getCustomerInfoForm() {
  const html = `
    <div style="font-family: Tahoma, sans-serif; padding: 20px;">
      <h3>Customer Information</h3>
      <form id="customerForm">
        <div style="margin-bottom: 15px;">
          <label><strong>Company Name:</strong></label><br>
          <input type="text" id="companyName" style="width: 100%; padding: 8px;" required>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Contact Person:</strong></label><br>
          <input type="text" id="contactPerson" style="width: 100%; padding: 8px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Email:</strong></label><br>
          <input type="email" id="email" style="width: 100%; padding: 8px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Phone:</strong></label><br>
          <input type="tel" id="phone" style="width: 100%; padding: 8px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Shipping Address:</strong></label><br>
          <textarea id="address" rows="3" style="width: 100%; padding: 8px;"></textarea>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label><strong>Project Name:</strong></label><br>
          <input type="text" id="projectName" style="width: 100%; padding: 8px;" 
                 placeholder="e.g., Brewery Control System">
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button type="button" onclick="generateQuoteWithCustomerInfo()" 
                  style="background: #28a745; color: white; padding: 12px 24px; 
                         border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
            Generate Professional Quote
          </button>
        </div>
      </form>
    </div>
    
    <script>
      function generateQuoteWithCustomerInfo() {
        const form = document.getElementById('customerForm');
        const formData = new FormData(form);
        
        const customerInfo = {
          companyName: document.getElementById('companyName').value,
          contactPerson: document.getElementById('contactPerson').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
          projectName: document.getElementById('projectName').value
        };
        
        // Get quote data from parent window (Hybrid Assembler)
        if (window.parent && window.parent.getQuoteData) {
          const hybridData = window.parent.getQuoteData();
          hybridData.customerInfo = customerInfo;
          hybridData.projectInfo = { projectName: customerInfo.projectName };
          
          google.script.run
            .withSuccessHandler(onQuoteGenerated)
            .withFailureHandler(onQuoteError)
            .generateQuoteFromHybridData(hybridData);
        } else {
          alert('Error: Could not access quote data from Hybrid Assembler');
        }
      }
      
      function onQuoteGenerated(result) {
        if (result.success) {
          alert('Success!\\n\\n' + result.message + 
                '\\n\\nCheck the "' + result.sheetName + '" tab for your professional quote.');
          google.script.host.close();
        } else {
          alert('Error generating quote: ' + result.error);
        }
      }
      
      function onQuoteError(error) {
        alert('Error: ' + error.message);
      }
    </script>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

/**
 * Utility function to get or create sheet
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  return sheet;
}
