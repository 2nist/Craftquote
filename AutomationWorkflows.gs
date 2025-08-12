/**
 * CraftQuote Automation Workflows
 * Orchestrates the entire quote-to-deal pipeline
 */

/**
 * Main automation workflow - processes a complete quote
 */
function processCompleteQuoteWorkflow(quoteData) {
  try {
    Logger.log('🚀 Starting complete quote workflow for:', quoteData.quoteNumber);
    
    const workflowResult = {
      quoteNumber: quoteData.quoteNumber,
      steps: [],
      success: true,
      errors: []
    };
    
    // Step 1: Generate and save quote
    try {
      const quoteResult = generateAndSaveQuote(quoteData);
      workflowResult.steps.push({
        step: 'Generate Quote',
        status: 'success',
        data: quoteResult
      });
      Logger.log('✅ Step 1 completed: Quote generated');
    } catch (error) {
      workflowResult.errors.push('Quote generation failed: ' + error.toString());
      workflowResult.steps.push({
        step: 'Generate Quote',
        status: 'error',
        error: error.toString()
      });
    }
    
    // Step 2: Update branding configuration
    try {
      const brandingResult = applyBrandingToQuote(quoteData);
      workflowResult.steps.push({
        step: 'Apply Branding',
        status: 'success',
        data: brandingResult
      });
      Logger.log('✅ Step 2 completed: Branding applied');
    } catch (error) {
      workflowResult.errors.push('Branding application failed: ' + error.toString());
      workflowResult.steps.push({
        step: 'Apply Branding',
        status: 'error',
        error: error.toString()
      });
    }
    
    // Step 3: Create Pipedrive deal
    try {
      const pipedriveResult = createPipedriveDealFromQuote(quoteData);
      workflowResult.steps.push({
        step: 'Create Pipedrive Deal',
        status: pipedriveResult.success ? 'success' : 'error',
        data: pipedriveResult
      });
      
      if (pipedriveResult.success) {
        workflowResult.dealId = pipedriveResult.dealId;
        workflowResult.dealUrl = pipedriveResult.dealUrl;
        Logger.log('✅ Step 3 completed: Pipedrive deal created');
      } else {
        workflowResult.errors.push('Pipedrive deal creation failed: ' + pipedriveResult.error);
      }
    } catch (error) {
      workflowResult.errors.push('Pipedrive integration failed: ' + error.toString());
      workflowResult.steps.push({
        step: 'Create Pipedrive Deal',
        status: 'error',
        error: error.toString()
      });
    }
    
    // Step 4: Send notifications
    try {
      const notificationResult = sendWorkflowNotifications(workflowResult);
      workflowResult.steps.push({
        step: 'Send Notifications',
        status: 'success',
        data: notificationResult
      });
      Logger.log('✅ Step 4 completed: Notifications sent');
    } catch (error) {
      workflowResult.errors.push('Notification sending failed: ' + error.toString());
      workflowResult.steps.push({
        step: 'Send Notifications',
        status: 'error',
        error: error.toString()
      });
    }
    
    // Step 5: Log to audit trail
    try {
      logWorkflowToAuditTrail(workflowResult);
      workflowResult.steps.push({
        step: 'Audit Logging',
        status: 'success'
      });
      Logger.log('✅ Step 5 completed: Audit trail updated');
    } catch (error) {
      workflowResult.errors.push('Audit logging failed: ' + error.toString());
    }
    
    // Determine overall success
    workflowResult.success = workflowResult.errors.length === 0;
    
    Logger.log(workflowResult.success ? 
      '🎉 Complete quote workflow finished successfully!' : 
      '⚠️ Quote workflow completed with errors'
    );
    
    return workflowResult;
    
  } catch (error) {
    Logger.log('❌ Critical error in quote workflow: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      quoteNumber: quoteData.quoteNumber
    };
  }
}

/**
 * Generate and save quote to Google Sheets
 */
function generateAndSaveQuote(quoteData) {
  // Open or create the quotes spreadsheet
  let spreadsheet;
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('QUOTES_SHEET_ID');
  
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    // Create new spreadsheet if it doesn't exist
    spreadsheet = SpreadsheetApp.create('CraftQuote Database');
    PropertiesService.getScriptProperties().setProperty('QUOTES_SHEET_ID', spreadsheet.getId());
  }
  
  let quotesSheet = spreadsheet.getSheetByName('Quotes');
  
  if (!quotesSheet) {
    quotesSheet = spreadsheet.insertSheet('Quotes');
    
    // Set up headers
    const headers = [
      'Quote Number', 'Date Created', 'Customer Name', 'Customer Email', 
      'Company Name', 'Product Category', 'Total Value', 'Status',
      'Components', 'Configuration', 'Branding Theme', 'Pipedrive Deal ID',
      'Created By', 'Last Modified'
    ];
    
    quotesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    quotesSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#4a90e2')
      .setFontColor('white')
      .setFontWeight('bold');
  }
  
  // Add the quote data
  const quoteRow = [
    quoteData.quoteNumber,
    new Date(),
    quoteData.customerName || '',
    quoteData.customerEmail || '',
    quoteData.companyName || '',
    quoteData.productCategory || '',
    quoteData.totalValue || 0,
    'Draft',
    JSON.stringify(quoteData.components || []),
    JSON.stringify(quoteData.configuration || {}),
    quoteData.brandingTheme || 'Default',
    '', // Pipedrive Deal ID (will be updated later)
    Session.getActiveUser().getEmail(),
    new Date()
  ];
  
  quotesSheet.appendRow(quoteRow);
  
  Logger.log('📊 Quote saved to spreadsheet:', quoteData.quoteNumber);
  
  return {
    spreadsheetId: spreadsheet.getId(),
    sheetUrl: spreadsheet.getUrl(),
    rowNumber: quotesSheet.getLastRow()
  };
}

/**
 * Apply branding configuration to quote
 */
function applyBrandingToQuote(quoteData) {
  try {
    // Load current branding configuration
    const brandingConfig = loadBrandingFromSheet();
    
    // Apply branding to quote data
    quoteData.brandingTheme = brandingConfig.app?.name || 'CraftQuote';
    quoteData.brandingConfig = brandingConfig;
    
    // Update quote with branded elements
    if (quoteData.productCategory && brandingConfig.productCategories) {
      const categoryKey = quoteData.productCategory.split(' - ')[0]; // Extract category code
      const categoryConfig = brandingConfig.productCategories[categoryKey];
      
      if (categoryConfig) {
        quoteData.categoryIcon = categoryConfig.icon;
        quoteData.categoryColor = categoryConfig.color;
        quoteData.categoryName = categoryConfig.name;
      }
    }
    
    Logger.log('🎨 Branding applied to quote:', quoteData.quoteNumber);
    
    return {
      theme: quoteData.brandingTheme,
      categoryIcon: quoteData.categoryIcon,
      primaryColor: brandingConfig.colors?.primary
    };
    
  } catch (error) {
    Logger.log('⚠️ Branding application failed, using defaults: ' + error.toString());
    return { theme: 'Default' };
  }
}

/**
 * Send workflow notifications
 */
function sendWorkflowNotifications(workflowResult) {
  const notifications = [];
  
  try {
    // Email notification to quote creator
    const emailBody = generateWorkflowEmailBody(workflowResult);
    
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `CraftQuote Workflow: ${workflowResult.quoteNumber} - ${workflowResult.success ? 'Success' : 'Partial Success'}`,
      htmlBody: emailBody
    });
    
    notifications.push({
      type: 'email',
      recipient: Session.getActiveUser().getEmail(),
      status: 'sent'
    });
    
    Logger.log('📧 Workflow notifications sent');
    
  } catch (error) {
    Logger.log('❌ Error sending notifications: ' + error.toString());
    throw error;
  }
  
  return { notifications: notifications };
}

/**
 * Generate HTML email body for workflow results
 */
function generateWorkflowEmailBody(workflowResult) {
  const statusIcon = workflowResult.success ? '✅' : '⚠️';
  const statusColor = workflowResult.success ? '#22c55e' : '#f59e0b';
  
  let stepsHtml = workflowResult.steps.map(step => {
    const stepIcon = step.status === 'success' ? '✅' : '❌';
    const stepColor = step.status === 'success' ? '#22c55e' : '#ef4444';
    
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: ${stepColor};">${stepIcon}</span> ${step.step}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: ${stepColor}; font-weight: bold;">
          ${step.status.toUpperCase()}
        </td>
      </tr>
    `;
  }).join('');
  
  const errorsHtml = workflowResult.errors.length > 0 ? `
    <h3 style="color: #ef4444;">Errors Encountered:</h3>
    <ul>
      ${workflowResult.errors.map(error => `<li style="color: #dc2626;">${error}</li>`).join('')}
    </ul>
  ` : '';
  
  const dealLinkHtml = workflowResult.dealUrl ? `
    <p><strong>Pipedrive Deal:</strong> <a href="${workflowResult.dealUrl}" target="_blank">View Deal</a></p>
  ` : '';
  
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColor};">${statusIcon} CraftQuote Workflow Report</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Quote Details</h3>
        <p><strong>Quote Number:</strong> ${workflowResult.quoteNumber}</p>
        <p><strong>Overall Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${workflowResult.success ? 'SUCCESS' : 'PARTIAL SUCCESS'}</span></p>
        ${dealLinkHtml}
      </div>
      
      <h3>Workflow Steps</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Step</th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${stepsHtml}
        </tbody>
      </table>
      
      ${errorsHtml}
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        This email was generated automatically by the CraftQuote system.
        <br>Timestamp: ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `;
}

/**
 * Log workflow to audit trail
 */
function logWorkflowToAuditTrail(workflowResult) {
  try {
    const auditSpreadsheetId = PropertiesService.getScriptProperties().getProperty('AUDIT_SHEET_ID');
    let auditSpreadsheet;
    
    if (auditSpreadsheetId) {
      auditSpreadsheet = SpreadsheetApp.openById(auditSpreadsheetId);
    } else {
      auditSpreadsheet = SpreadsheetApp.create('CraftQuote Audit Trail');
      PropertiesService.getScriptProperties().setProperty('AUDIT_SHEET_ID', auditSpreadsheet.getId());
    }
    
    let auditSheet = auditSpreadsheet.getSheetByName('Workflow_Audit');
    
    if (!auditSheet) {
      auditSheet = auditSpreadsheet.insertSheet('Workflow_Audit');
      
      const headers = [
        'Timestamp', 'Quote Number', 'User', 'Overall Status', 'Steps', 'Errors', 'Deal ID', 'Processing Time'
      ];
      
      auditSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      auditSheet.getRange(1, 1, 1, headers.length)
        .setBackground('#1a1a1a')
        .setFontColor('white')
        .setFontWeight('bold');
    }
    
    const auditRow = [
      new Date(),
      workflowResult.quoteNumber,
      Session.getActiveUser().getEmail(),
      workflowResult.success ? 'SUCCESS' : 'PARTIAL_SUCCESS',
      JSON.stringify(workflowResult.steps),
      JSON.stringify(workflowResult.errors),
      workflowResult.dealId || '',
      new Date().getTime() // Processing time placeholder
    ];
    
    auditSheet.appendRow(auditRow);
    
    Logger.log('📋 Workflow logged to audit trail');
    
  } catch (error) {
    Logger.log('⚠️ Error logging to audit trail: ' + error.toString());
    // Don't throw error as this is non-critical
  }
}

/**
 * Scheduled function to process pending quotes
 */
function processPendingQuotes() {
  try {
    Logger.log('🔄 Processing pending quotes...');
    
    // This would typically pull from a queue or pending sheet
    // For now, this is a placeholder for scheduled processing
    
    Logger.log('✅ Pending quotes processing completed');
    
  } catch (error) {
    Logger.log('❌ Error processing pending quotes: ' + error.toString());
  }
}

/**
 * Setup automation triggers
 */
function setupAutomationTriggers() {
  try {
    // Delete existing triggers first
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
    
    // Create new triggers
    ScriptApp.newTrigger('processPendingQuotes')
      .timeBased()
      .everyHours(1)
      .create();
    
    Logger.log('✅ Automation triggers set up successfully');
    
  } catch (error) {
    Logger.log('❌ Error setting up triggers: ' + error.toString());
  }
}

/**
 * Test the complete workflow
 */
function testCompleteWorkflow() {
  const testQuoteData = {
    quoteNumber: 'CQ240811BHAC001CA-TEST',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    companyName: 'Test Company Inc',
    productCategory: 'BHAC - Brewery Automated Control',
    totalValue: 15000,
    components: ['Test Component 1', 'Test Component 2'],
    configuration: { template: 'test_template' },
    brandingTheme: 'Default'
  };
  
  const result = processCompleteQuoteWorkflow(testQuoteData);
  Logger.log('🧪 Test workflow result:', JSON.stringify(result, null, 2));
  
  return result;
}
