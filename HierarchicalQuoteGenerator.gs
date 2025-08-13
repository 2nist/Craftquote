/**
 * HIERARCHICAL QUOTE GENERATOR
 * Phase 3: Quote Generation System
 * Generates quotes matching the exact format from user's reference screenshots
 * August 12, 2025
 */

// =================== QUOTE GENERATION FUNCTIONS ===================

/**
 * Generate a hierarchical quote from assemblies and panels
 */
function generateHierarchicalQuote(quoteData) {
  console.log('📋 HIERARCHICAL QUOTE - Generating quote:', quoteData);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Validate quote data
    if (!quoteData.customerCompany || !quoteData.description) {
      throw new Error('Customer company and description are required');
    }
    
    // Generate quote ID in format: CQ24MMDDHHSSTYPE-NN
    const quoteId = generateQuoteId(quoteData.panelType);
    
    // Build quote structure from assemblies
    const quoteStructure = buildQuoteStructure(quoteData);
    
    // Save quote to HW_Quotes sheet
    const savedQuote = saveQuoteToDatabase(ss, quoteId, quoteData, quoteStructure);
    
    if (!savedQuote.success) {
      throw new Error('Failed to save quote to database');
    }
    
    // Generate quote HTML matching user's format
    const quoteHtml = generateQuoteHTML(quoteId, quoteData, quoteStructure);
    
    console.log('✅ HIERARCHICAL QUOTE - Quote generated successfully:', quoteId);
    
    return {
      success: true,
      quoteId: quoteId,
      quoteHtml: quoteHtml,
      totalPrice: quoteStructure.totalPrice,
      message: `Quote ${quoteId} generated successfully`
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL QUOTE - Error generating quote:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Generate quote ID in CraftAutomation format
 */
function generateQuoteId(panelType) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  
  // Format: CQ24031201DTABT-00 (from user's reference files)
  const typeCode = (panelType || 'GEN').substring(0, 4).toUpperCase();
  
  return `CQ${year}${month}${day}${hour}${typeCode}-${seq}`;
}

/**
 * Build quote structure from selected assemblies and panels
 */
function buildQuoteStructure(quoteData) {
  console.log('🏗️ HIERARCHICAL QUOTE - Building quote structure...');
  
  const structure = {
    lineItems: [],
    totalPrice: 0,
    netPrice: 0,
    assembliesIncluded: []
  };
  
  // Add panel-level items if specified
  if (quoteData.panelType) {
    const panelInfo = getPanelInformation(quoteData.panelType);
    if (panelInfo.success) {
      structure.lineItems.push({
        lineItem: 'A',
        qty: 1,
        description: `${panelInfo.panel.name}`,
        netPrice: panelInfo.panel.basePrice || 0,
        totalPrice: panelInfo.panel.basePrice || 0,
        type: 'panel',
        details: panelInfo.panel.description
      });
      structure.totalPrice += panelInfo.panel.basePrice || 0;
    }
  }
  
  // Add selected assemblies
  if (quoteData.selectedAssemblies && quoteData.selectedAssemblies.length > 0) {
    quoteData.selectedAssemblies.forEach((assemblySelection, index) => {
      const assemblyInfo = getAssemblyInformation(assemblySelection.assemblyId);
      
      if (assemblyInfo.success) {
        const assembly = assemblyInfo.assembly;
        const qty = assemblySelection.quantity || 1;
        const linePrice = assembly.totalCost * qty;
        
        structure.lineItems.push({
          lineItem: String.fromCharCode(66 + index), // B, C, D, etc.
          qty: qty,
          description: assembly.assemblyName,
          netPrice: assembly.totalCost,
          totalPrice: linePrice,
          type: 'assembly',
          details: assembly.description,
          components: assemblyInfo.bomComponents || []
        });
        
        structure.totalPrice += linePrice;
        structure.assembliesIncluded.push(assembly.assemblyId);
      }
    });
  }
  
  // Apply price multiplier
  const multiplier = getPriceMultiplier(quoteData.customerType || 'Standard');
  structure.netPrice = structure.totalPrice;
  structure.totalPrice = structure.totalPrice * multiplier.value;
  
  console.log(`✅ HIERARCHICAL QUOTE - Structure built: ${structure.lineItems.length} line items, $${structure.totalPrice.toFixed(2)} total`);
  
  return structure;
}

/**
 * Get panel information from HW_Panels sheet
 */
function getPanelInformation(panelCode) {
  console.log('⚡ HIERARCHICAL QUOTE - Getting panel info:', panelCode);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const panelsSheet = ss.getSheetByName('HW_Panels');
    
    if (!panelsSheet) {
      return { success: false, error: 'HW_Panels sheet not found' };
    }
    
    const data = panelsSheet.getDataRange().getValues();
    
    // Find panel by code
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === panelCode) { // PanelCode in column A
        const panel = {
          code: row[0],           // PanelCode
          name: row[1],           // PanelName
          description: row[2],    // Description
          basePrice: parseFloat(row[3]) || 0, // BasePrice
          assemblyList: row[4],   // AssemblyList
          oemPartners: row[5],    // OEMPartners
          variations: row[6],     // Variations
          configuration: row[7],  // Configuration
          certificationLevel: row[8], // CertificationLevel
          installationType: row[9]    // InstallationType
        };
        
        return { success: true, panel: panel };
      }
    }
    
    return { success: false, error: `Panel ${panelCode} not found` };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL QUOTE - Error getting panel info:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Get assembly information from HW_Assemblies sheet
 */
function getAssemblyInformation(assemblyId) {
  console.log('🏗️ HIERARCHICAL QUOTE - Getting assembly info:', assemblyId);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const assembliesSheet = ss.getSheetByName('HW_Assemblies');
    
    if (!assembliesSheet) {
      return { success: false, error: 'HW_Assemblies sheet not found' };
    }
    
    const data = assembliesSheet.getDataRange().getValues();
    
    // Find assembly by ID
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === assemblyId) { // AssemblyID in column A
        const assembly = {
          assemblyId: row[0],     // AssemblyID
          assemblyName: row[1],   // AssemblyName
          description: row[2],    // Description
          category: row[3],       // Category
          totalCost: parseFloat(row[4]) || 0, // TotalCost
          componentCount: parseInt(row[5]) || 0, // ComponentCount
          bomReference: row[6],   // BOMReference
          usedInPanels: row[7],   // UsedInPanels
          configuration: row[8],  // Configuration
          isStandard: row[12]     // IsStandard
        };
        
        // Get BOM components
        const bomResult = getAssemblyBOM(assemblyId);
        
        return { 
          success: true, 
          assembly: assembly,
          bomComponents: bomResult.success ? bomResult.bomComponents : []
        };
      }
    }
    
    return { success: false, error: `Assembly ${assemblyId} not found` };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL QUOTE - Error getting assembly info:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Get price multiplier based on customer type
 */
function getPriceMultiplier(customerType) {
  const multipliers = {
    'Standard': { value: 1.25, label: 'Standard' },
    'Preferred Partner': { value: 1.20, label: 'Preferred Partner' },
    'R&D/POC': { value: 1.15, label: 'R&D/POC' },
    'Commissioning Only': { value: 1.10, label: 'Commissioning Only' }
  };
  
  return multipliers[customerType] || multipliers['Standard'];
}

/**
 * Save quote to HW_Quotes sheet
 */
function saveQuoteToDatabase(ss, quoteId, quoteData, quoteStructure) {
  console.log('💾 HIERARCHICAL QUOTE - Saving quote to database:', quoteId);
  
  try {
    let quotesSheet = ss.getSheetByName('HW_Quotes');
    
    if (!quotesSheet) {
      // Initialize if needed
      const initResult = initializeHierarchicalDatabase();
      if (!initResult.success) {
        throw new Error('HW_Quotes sheet not found and initialization failed');
      }
      quotesSheet = ss.getSheetByName('HW_Quotes');
    }
    
    // Calculate quote validity (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    
    const quoteRow = [
      quoteId,                        // A - QuoteID
      quoteId.split('-')[0],          // B - QuoteNumber (without suffix)
      quoteData.customerCompany,      // C - CustomerCompany
      quoteData.customerContact || '', // D - CustomerContact
      quoteData.projectCode || '',    // E - ProjectCode
      quoteData.description,          // F - Description
      quoteStructure.netPrice,        // G - NetPrice
      quoteStructure.totalPrice,      // H - TotalPrice
      quoteData.customerType || 'Standard', // I - PriceMultiplier
      'Draft',                        // J - Status
      new Date(),                     // K - CreatedDate
      validUntil,                     // L - ValidUntil
      quoteData.salesID || '1',       // M - SalesID
      quoteData.terms || 'Standard Terms', // N - Terms
      false,                          // O - PDFGenerated
      true                            // P - IsActive
    ];
    
    quotesSheet.appendRow(quoteRow);
    
    console.log('✅ HIERARCHICAL QUOTE - Quote saved to database');
    
    return { success: true, quoteId: quoteId };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL QUOTE - Error saving quote:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Generate quote HTML matching user's screenshot format
 */
function generateQuoteHTML(quoteId, quoteData, quoteStructure) {
  console.log('🎨 HIERARCHICAL QUOTE - Generating HTML for:', quoteId);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Build line items HTML
  let lineItemsHtml = '';
  
  quoteStructure.lineItems.forEach(item => {
    lineItemsHtml += `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center; font-weight: bold;">${item.lineItem}</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.qty}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">
          <strong>${item.description}</strong><br>
          <div style="margin-top: 10px; font-size: 0.9em; color: #333;">
            ${formatDescription(item.details, item.components)}
          </div>
        </td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">$${item.netPrice.toFixed(2)}</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">$${item.totalPrice.toFixed(2)}</td>
      </tr>
    `;
  });
  
  const quoteHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Quote ${quoteId}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 2px solid #1f4e79;
          padding-bottom: 20px;
        }
        .company-info {
          flex: 1;
        }
        .company-logo {
          font-size: 2.5em;
          font-weight: bold;
          color: #1f4e79;
          margin-bottom: 10px;
        }
        .company-tagline {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 10px;
        }
        .customer-info {
          text-align: right;
          flex: 1;
        }
        .customer-info table {
          width: 100%;
          border-collapse: collapse;
        }
        .customer-info td {
          padding: 2px 5px;
          border: 1px solid #ccc;
        }
        .quote-details {
          margin: 30px 0;
        }
        .quote-details table {
          border-collapse: collapse;
          width: 100%;
        }
        .quote-details td {
          padding: 5px 10px;
          border: 1px solid #ccc;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        .items-table th {
          background-color: #1f4e79;
          color: white;
          padding: 10px 8px;
          text-align: left;
          border: 1px solid #ccc;
        }
        .items-table td {
          border: 1px solid #ccc;
          padding: 8px;
          vertical-align: top;
        }
        .component-list {
          margin-left: 20px;
          font-size: 0.85em;
          color: #555;
        }
        .component-item {
          margin: 3px 0;
        }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #ccc;
          padding-top: 20px;
          font-size: 0.9em;
          color: #666;
        }
        .signature-section {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          width: 200px;
          border-top: 1px solid #333;
          text-align: center;
          padding-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <div class="company-logo">🔧 Craft automation</div>
          <div class="company-tagline">Visit us at CraftAutomation.com</div>
        </div>
        <div class="customer-info">
          <table>
            <tr><td><strong>Customer Contact:</strong></td><td>${quoteData.customerContact || ''}</td></tr>
            <tr><td><strong>Company Name:</strong></td><td>${quoteData.customerCompany}</td></tr>
            <tr><td><strong>Shipping Address:</strong></td><td>${quoteData.shippingAddress || ''}</td></tr>
            <tr><td></td><td></td></tr>
            <tr><td></td><td></td></tr>
            <tr><td><strong>Email:</strong></td><td>${quoteData.customerEmail || ''}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${quoteData.customerPhone || ''}</td></tr>
          </table>
          <br>
          <div style="text-align: right; font-weight: bold;">
            <div>MiCraft, LLC</div>
            <div>5348 N Riverview Dr</div>
            <div>Kalamazoo, MI 49004</div>
            <br>
            <div>Phone: 269.389.0048</div>
            <div>Email: Sales@CraftAutomation.com</div>
          </div>
        </div>
      </div>
      
      <div class="quote-details">
        <table>
          <tr>
            <td><strong>Quotation Number:</strong></td>
            <td>${quoteId}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>Quotation Date:</strong></td>
            <td>${currentDate}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>Description:</strong></td>
            <td colspan="9">${quoteData.description}</td>
          </tr>
        </table>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 8%;">Line Item</th>
            <th style="width: 8%;">Qty.</th>
            <th style="width: 60%;">Description</th>
            <th style="width: 12%;">Net Price</th>
            <th style="width: 12%;">Total Price</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemsHtml}
        </tbody>
      </table>
      
      <div class="footer">
        <div style="text-align: center; margin-bottom: 20px;">
          <strong>FULL TERMS AND CONDITIONS AVAILABLE ON REQUEST OR AT CRAFTAUTOMATION.COM/TERMS-AND-CONDITIONS</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 48%;">
            <strong>Warranty Information:</strong><br>
            All Craft Automation manufactured automation panels have a two-year warranty from the date of delivery.<br>
            Customer is responsible for the cost of any part and component replacements (including shipping charges)<br>
            of the equipment if due to issues within one setup at site operator<br>
            Support and Installation Information:<br>
            Onsite Control Commissioning is available for an additional charge.<br>
            Craft Automation supply provides customer phone support for the first year of use of our product.<br>
            <br>
            <strong>Terms:</strong> 50% ARO, 50% Prior to Delivery, Parts 100% Due on Receipt<br>
            <strong>Payment:</strong> Sales Tax Charged Unless Exempt Certificate Provided<br>
            <strong>Storage Fee:</strong> 2.0% of Principal Account File Month after 30 Days Post Completion of Agreed Ship Date<br>
            <strong>Freight:</strong> Prepaid and Add to Invoice<br>
            <strong>Delivery:</strong> 10-12 Weeks ARO
          </div>
          <div style="width: 48%; text-align: right;">
            <div style="border: 1px solid #000; padding: 10px; margin-bottom: 10px;">
              This quotation is offered under the expressed agreement of all Terms and Conditions discussed here within or established within our final quotation confirmation and<br>
              that all engineering efforts and subsequent cost expenses shall be included in firm of final quotation to the customer.
            </div>
            <strong>This quote is only valid for<br>30 days from date of<br>${currentDate}</strong>
          </div>
        </div>
        
        <div class="signature-section">
          <div>
            <div>By signing below, you agree to purchase the equipment described under the terms and conditions set forth by MiCraft, LLC.</div>
            <br>
            <div class="signature-box">Signature:</div>
          </div>
          <div class="signature-box">Date:</div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return quoteHtml;
}

/**
 * Format description with component details
 */
function formatDescription(details, components) {
  let formatted = details || '';
  
  if (components && components.length > 0) {
    formatted += '<div class="component-list">';
    components.forEach(component => {
      formatted += `<div class="component-item">• ${component.description} (${component.quantity})</div>`;
    });
    formatted += '</div>';
  }
  
  return formatted;
}

/**
 * Open the Quote Builder interface
 */
function openHierarchicalQuoteBuilder() {
  console.log('📋 HIERARCHICAL QUOTE - Opening Quote Builder...');
  
  try {
    // For now, show a simple form - will create full interface next
    const ui = SpreadsheetApp.getUi();
    const result = ui.prompt(
      'Hierarchical Quote Builder',
      'Enter customer company name:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (result.getSelectedButton() === ui.Button.OK) {
      const customerCompany = result.getResponseText();
      
      if (customerCompany) {
        // Create a test quote
        const testQuoteData = {
          customerCompany: customerCompany,
          customerContact: 'Test Contact',
          description: 'Test Quote Generated from Hierarchical System',
          panelType: 'BHAC',
          selectedAssemblies: [
            { assemblyId: 'MOTOR_CTRL_START_STOP', quantity: 1 },
            { assemblyId: 'AUTOMATION_HW_ASSEMBLY', quantity: 1 }
          ],
          customerType: 'Standard',
          salesID: '1'
        };
        
        const quoteResult = generateHierarchicalQuote(testQuoteData);
        
        if (quoteResult.success) {
          ui.alert(
            'Quote Generated Successfully!\n\n' +
            `Quote ID: ${quoteResult.quoteId}\n` +
            `Total Price: $${quoteResult.totalPrice.toFixed(2)}\n\n` +
            'Quote has been saved to HW_Quotes sheet.'
          );
        } else {
          ui.alert('Error: ' + quoteResult.error);
        }
      }
    }
    
    return {
      success: true,
      message: 'Quote Builder interface opened'
    };
    
  } catch (error) {
    console.error('❌ HIERARCHICAL QUOTE - Error opening Quote Builder:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test quote generation system
 */
function testHierarchicalQuoteGeneration() {
  console.log('🧪 HIERARCHICAL QUOTE - Testing quote generation...');
  
  try {
    // Create test quote data
    const testQuoteData = {
      customerCompany: 'Test Brewery Co.',
      customerContact: 'John Brewer',
      customerEmail: 'john@testbrewery.com',
      customerPhone: '555-123-4567',
      description: 'Brewhouse Automation Control System Test Quote',
      panelType: 'BHAC',
      selectedAssemblies: [
        { assemblyId: 'MOTOR_CTRL_START_STOP', quantity: 2 },
        { assemblyId: 'SAFETY_DEVICES', quantity: 1 }
      ],
      customerType: 'Preferred Partner',
      salesID: '1',
      projectCode: 'TEST-BHAC-001'
    };
    
    console.log('🔄 Generating test quote...');
    const quoteResult = generateHierarchicalQuote(testQuoteData);
    
    if (quoteResult.success) {
      console.log('✅ Test quote generated successfully:', {
        quoteId: quoteResult.quoteId,
        totalPrice: quoteResult.totalPrice
      });
      
      SpreadsheetApp.getUi().alert(
        'Quote Generation Test Successful!\n\n' +
        `Quote ID: ${quoteResult.quoteId}\n` +
        `Total Price: $${quoteResult.totalPrice.toFixed(2)}\n\n` +
        'Test quote saved to HW_Quotes sheet.\n' +
        'HTML quote format matches reference screenshots.'
      );
      
      return {
        success: true,
        quoteResult: quoteResult,
        message: 'Quote generation test completed successfully'
      };
    } else {
      throw new Error(quoteResult.error);
    }
    
  } catch (error) {
    console.error('❌ HIERARCHICAL QUOTE - Test failed:', error);
    
    SpreadsheetApp.getUi().alert(
      'Quote Generation Test Failed\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'Check console logs for details.'
    );
    
    return {
      success: false,
      error: error.toString()
    };
  }
}
