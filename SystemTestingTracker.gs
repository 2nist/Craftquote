/**
 * System Testing & Development Tracker
 * Creates and manages comprehensive testing AND development planning spreadsheets
 */

/**
 * Creates the complete System Testing & Development Tracker
 */
function createSystemTestingTracker() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create or get the testing sheet
    let testSheet = ss.getSheetByName('System_Testing_Tracker');
    if (testSheet) {
      // Ask user if they want to recreate it
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        'Testing Tracker Exists',
        'A testing tracker already exists. Do you want to recreate it? (This will clear existing data)',
        ui.ButtonSet.YES_NO
      );
      
      if (response === ui.Button.YES) {
        ss.deleteSheet(testSheet);
        testSheet = ss.insertSheet('System_Testing_Tracker');
      } else {
        return 'Testing tracker already exists. No changes made.';
      }
    } else {
      testSheet = ss.insertSheet('System_Testing_Tracker');
    }
    
    // Create the Development Planning sheet
    let devSheet = ss.getSheetByName('Development_Planning');
    if (devSheet) {
      ss.deleteSheet(devSheet);
    }
    devSheet = ss.insertSheet('Development_Planning');
    
    // Create the Code Scaffold Upload sheet
    let codeSheet = ss.getSheetByName('Code_Scaffold_Upload');
    if (codeSheet) {
      ss.deleteSheet(codeSheet);
    }
    codeSheet = ss.insertSheet('Code_Scaffold_Upload');
    
    // Set up all three sheets
    setupTestingTrackerSheet(testSheet);
    setupDevelopmentPlanningSheet(devSheet);
    setupCodeScaffoldSheet(codeSheet);
    
    SpreadsheetApp.getUi().alert(
      'Complete Tracker System Created',
      '✅ Complete system created with 3 sheets:\n\n📋 System_Testing_Tracker - Track testing progress\n🔧 Development_Planning - Plan new features\n💻 Code_Scaffold_Upload - Upload scaffolded code\n\nUse the menu to access different functions!',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
    return 'Complete tracking system created successfully!';
    
  } catch (error) {
    console.error('Error creating tracking system:', error);
    throw new Error(`Failed to create tracking system: ${error.message}`);
  }
}

/**
 * Sets up the testing tracker sheet (existing functionality)
 */
function setupTestingTrackerSheet(sheet) {
  const headers = [
    'ID',
    'Component/Feature',
    'Test Description',
    'Status',
    'Priority',
    'Issue Type',
    'Notes/Details',
    'Expected Behavior',
    'Actual Behavior',
    'Steps to Reproduce',
    'Assigned To',
    'Date Created',
    'Date Updated',
    'Ready for Review'
  ];
  
  // Apply headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a73e8');
  headerRange.setFontColor('white');
  headerRange.setWrap(true);
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 50);   // ID
  sheet.setColumnWidth(2, 150);  // Component
  sheet.setColumnWidth(3, 200);  // Test Description
  sheet.setColumnWidth(4, 100);  // Status
  sheet.setColumnWidth(5, 80);   // Priority
  sheet.setColumnWidth(6, 100);  // Issue Type
  sheet.setColumnWidth(7, 250);  // Notes
  sheet.setColumnWidth(8, 200);  // Expected
  sheet.setColumnWidth(9, 200);  // Actual
  sheet.setColumnWidth(10, 200); // Steps
  sheet.setColumnWidth(11, 100); // Assigned
  sheet.setColumnWidth(12, 100); // Date Created
  sheet.setColumnWidth(13, 100); // Date Updated
  sheet.setColumnWidth(14, 120); // Ready for Review
  
  // Add data validation for specific columns
  addTestingValidationRules(sheet);
  
  // Populate with all system elements to test
  populateSystemTestItems(sheet);
  
  // Apply conditional formatting
  applyTestingConditionalFormatting(sheet);
}

/**
 * Sets up the Development Planning sheet for new features and system changes
 */
function setupDevelopmentPlanningSheet(sheet) {
  // Set up headers
  const headers = [
    'Feature ID', 'Feature Name', 'Category', 'Priority', 'Status', 'Description', 
    'Requirements', 'Dependencies', 'Effort Estimate', 'Implementation Notes', 'Assigned Date', 'Target Date'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Style the header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#2196F3')
           .setFontColor('white')
           .setFontWeight('bold')
           .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 80);   // Feature ID
  sheet.setColumnWidth(2, 200);  // Feature Name
  sheet.setColumnWidth(3, 120);  // Category
  sheet.setColumnWidth(4, 80);   // Priority
  sheet.setColumnWidth(5, 100);  // Status
  sheet.setColumnWidth(6, 300);  // Description
  sheet.setColumnWidth(7, 250);  // Requirements
  sheet.setColumnWidth(8, 200);  // Dependencies
  sheet.setColumnWidth(9, 120);  // Effort Estimate
  sheet.setColumnWidth(10, 250); // Implementation Notes
  sheet.setColumnWidth(11, 120); // Assigned Date
  sheet.setColumnWidth(12, 120); // Target Date
  
  // Add validation rules for development planning
  addDevelopmentValidationRules(sheet);
  
  // Add some example feature categories
  populateExampleFeatures(sheet);
  
  // Apply conditional formatting
  applyDevelopmentConditionalFormatting(sheet);
}

/**
 * Sets up the Code Scaffold Upload sheet for pasting in code from Gemini or other sources
 */
function setupCodeScaffoldSheet(sheet) {
  // Set up headers
  const headers = [
    'Upload ID', 'Feature Name', 'File Name', 'Code Type', 'Source', 'Upload Date', 
    'Code Content', 'Implementation Notes', 'Status', 'Integration Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Style the header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#FF9800')
           .setFontColor('white')
           .setFontWeight('bold')
           .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 80);   // Upload ID
  sheet.setColumnWidth(2, 200);  // Feature Name
  sheet.setColumnWidth(3, 150);  // File Name
  sheet.setColumnWidth(4, 120);  // Code Type
  sheet.setColumnWidth(5, 100);  // Source
  sheet.setColumnWidth(6, 120);  // Upload Date
  sheet.setColumnWidth(7, 500);  // Code Content (wide for pasting)
  sheet.setColumnWidth(8, 250);  // Implementation Notes
  sheet.setColumnWidth(9, 100);  // Status
  sheet.setColumnWidth(10, 250); // Integration Notes
  
  // Add validation rules for code uploads
  addCodeScaffoldValidationRules(sheet);
  
  // Add instructions row
  addCodeScaffoldInstructions(sheet);
  
  // Apply conditional formatting
  applyCodeScaffoldConditionalFormatting(sheet);
}

/**
 * Adds data validation rules to the testing tracker
 */
function addTestingValidationRules(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // No data rows yet
  
  // Status validation (Column D) - Enhanced with testing statuses
  const statusRange = sheet.getRange(2, 4, lastRow - 1, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Not Started', 
      'In Progress', 
      'Tested Pass', 
      'Tested Fail', 
      'Needs Fix', 
      'Ready for Review', 
      'Completed', 
      'Blocked', 
      'Skipped'
    ])
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Priority validation (Column E) - Enhanced priority levels
  const priorityRange = sheet.getRange(2, 5, lastRow - 1, 1);
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Critical - Blocking', 
      'Critical', 
      'High', 
      'Medium', 
      'Low', 
      'Nice to Have'
    ])
    .setAllowInvalid(false)
    .build();
  priorityRange.setDataValidation(priorityRule);
  
  // Issue Type validation (Column F)
  const typeRange = sheet.getRange(2, 6, lastRow - 1, 1);
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Bug', 'Enhancement', 'New Feature', 'Documentation', 'Test', 'Integration Issue'])
    .setAllowInvalid(false)
    .build();
  typeRange.setDataValidation(typeRule);
  
  // Assigned To validation (Column K)
  const assignedRange = sheet.getRange(2, 11, lastRow - 1, 1);
  const assignedRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['User Testing', 'Developer Review', 'Both', 'On Hold'])
    .setAllowInvalid(false)
    .build();
  assignedRange.setDataValidation(assignedRule);
  
  // Ready for Review validation (Column N) - Clear review triggers
  const reviewRange = sheet.getRange(2, 14, lastRow - 1, 1);
  const reviewRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'No', 
      'Bug Found - Review Needed', 
      'Feature Request - Review Needed', 
      'Question - Review Needed', 
      'Critical Issue - Urgent Review', 
      'Tested Pass - Optional Review',
      'Ready for Developer'
    ])
    .setAllowInvalid(false)
    .build();
  reviewRange.setDataValidation(reviewRule);
}

/**
 * Populates the testing tracker with all system elements
 */
function populateSystemTestItems(sheet) {
  const testItems = [
    // Menu System Tests
    ['M001', 'Menu System', 'Verify main menu appears on spreadsheet open', 'Not Started', 'Critical', 'Test', 'Check if ⚡ Craft Automation menu appears', 'Menu should appear in menu bar', '', 'Open spreadsheet and check menu bar', 'User Testing', new Date(), '', 'No'],
    
    // CSV Import Tests
    ['C001', 'CSV Import', 'Test CSV file ID setting dialog', 'Not Started', 'High', 'Test', 'Test the CSV ID dialog functionality', 'Dialog opens and accepts file ID/URL', '', 'Menu → Set CSV File ID', 'User Testing', new Date(), '', 'No'],
    ['C002', 'CSV Import', 'Test main CSV import function', 'Not Started', 'Critical', 'Test', 'Import master catalog from CSV', 'Data imports successfully into Master Catalog sheet', '', 'Set CSV ID → Import Master Catalog', 'User Testing', new Date(), '', 'No'],
    ['C003', 'CSV Import', 'Test CSV diagnostic function', 'Not Started', 'Medium', 'Test', 'Run CSV diagnostics', 'Shows file analysis and potential issues', '', 'Menu → CSV Diagnostic', 'User Testing', new Date(), '', 'No'],
    
    // Branding System Tests
    ['B001', 'Branding System', 'Test branding editor opens', 'Not Started', 'Medium', 'Test', 'Open branding editor dialog', 'Dialog opens with current settings', '', 'Menu → Edit Branding', 'User Testing', new Date(), '', 'No'],
    ['B002', 'Branding System', 'Test branding demo page', 'Not Started', 'Low', 'Test', 'View branding demonstration', 'Demo page shows branded interface', '', 'Menu → Branding Demo', 'User Testing', new Date(), '', 'No'],
    ['B003', 'Branding System', 'Test branding saves and applies', 'Not Started', 'Medium', 'Test', 'Change branding settings and save', 'Settings save and apply to interfaces', '', 'Edit branding → Change colors → Save', 'User Testing', new Date(), '', 'No'],
    
    // Network File Explorer Tests
    ['N001', 'Network File Explorer', 'Test NAS Explorer opens', 'Not Started', 'Medium', 'Test', 'Open Network File Explorer sidebar', 'Sidebar opens with search interface', '', 'Menu → Network File Explorer', 'User Testing', new Date(), '', 'No'],
    ['N002', 'Network File Explorer', 'Test NAS index import', 'Not Started', 'Low', 'Test', 'Import NAS index files', 'Creates Jobs_Database sheet with data', '', 'NAS Explorer → Import Index', 'User Testing', new Date(), '', 'No'],
    
    // Hybrid Assembler Tests
    ['H001', 'Hybrid Assembler', 'Test Hybrid Assembler opens', 'Not Started', 'High', 'Test', 'Open main Hybrid Assembler interface', 'Main interface dialog opens', '', 'Menu → Open Hybrid Assembler', 'User Testing', new Date(), '', 'No'],
    ['H002', 'Hybrid Assembler', 'Test component selection', 'Not Started', 'High', 'Test', 'Select components in assembler', 'Components can be selected and added', '', 'Open assembler → Browse components', 'User Testing', new Date(), '', 'No'],
    
    // System Setup Tests
    ['S001', 'System Setup', 'Test complete one-click setup', 'Not Started', 'Critical', 'Test', 'Run complete hierarchical setup', 'Creates all required sheets and data', '', 'Menu → Complete Setup (One Click)', 'User Testing', new Date(), '', 'No'],
    ['S002', 'System Setup', 'Test debug mode activation', 'Not Started', 'Low', 'Test', 'Activate debug mode for detailed logging', 'Debug mode enables and shows detailed logs', '', 'Menu → Show Debug Info', 'Developer Review', new Date(), '', 'No'],
    
    // Data Management Tests
    ['D001', 'Data Management', 'Test master catalog browsing', 'Not Started', 'High', 'Test', 'Browse master catalog items', 'Can view and search catalog items', '', 'Menu → Browse Master Catalog', 'User Testing', new Date(), '', 'No'],
    ['D002', 'Data Management', 'Test custom data import', 'Not Started', 'Medium', 'Test', 'Import custom product data', 'Custom data integrates properly', '', 'Menu → Import Custom Data', 'User Testing', new Date(), '', 'No'],
    
    // Integration Tests
    ['I001', 'Integration', 'Test sidebar functionality', 'Not Started', 'Medium', 'Test', 'Open and use various sidebars', 'Sidebars open and function correctly', '', 'Test all sidebar menu options', 'User Testing', new Date(), '', 'No'],
    ['I002', 'Integration', 'Test dialog systems', 'Not Started', 'Medium', 'Test', 'Test various dialog boxes', 'All dialogs open and respond correctly', '', 'Test various menu dialogs', 'User Testing', new Date(), '', 'No'],
    
    // Performance Tests
    ['P001', 'Performance', 'Test large dataset handling', 'Not Started', 'Medium', 'Test', 'Import and work with large CSV files', 'System handles large datasets smoothly', '', 'Import large CSV → Test performance', 'Both', new Date(), '', 'No'],
    ['P002', 'Performance', 'Test memory usage', 'Not Started', 'Low', 'Test', 'Monitor memory usage during operations', 'Memory usage stays within acceptable limits', '', 'Use system extensively and monitor', 'Developer Review', new Date(), '', 'No'],
    
    // Error Handling Tests
    ['E001', 'Error Handling', 'Test invalid CSV handling', 'Not Started', 'High', 'Test', 'Test with invalid/corrupted CSV files', 'Graceful error handling with user feedback', '', 'Try importing invalid CSV files', 'User Testing', new Date(), '', 'No'],
    ['E002', 'Error Handling', 'Test network connectivity issues', 'Not Started', 'Medium', 'Test', 'Test system behavior with poor connectivity', 'Appropriate error messages and fallbacks', '', 'Test with limited internet connection', 'User Testing', new Date(), '', 'No'],
    
    // Security Tests
    ['SEC001', 'Security', 'Test data access permissions', 'Not Started', 'High', 'Test', 'Verify proper data access controls', 'Only authorized data is accessible', '', 'Test various access scenarios', 'Developer Review', new Date(), '', 'No'],
    ['SEC002', 'Security', 'Test external API security', 'Not Started', 'Medium', 'Test', 'Verify secure external connections', 'All external connections use proper security', '', 'Review API calls and security', 'Developer Review', new Date(), '', 'No'],
    
    // User Experience Tests
    ['UX001', 'User Experience', 'Test overall workflow', 'Not Started', 'High', 'Test', 'Complete typical user workflows', 'Workflows are intuitive and efficient', '', 'Complete common tasks end-to-end', 'User Testing', new Date(), '', 'No'],
    ['UX002', 'User Experience', 'Test error message clarity', 'Not Started', 'Medium', 'Test', 'Review error messages for clarity', 'Error messages are clear and actionable', '', 'Trigger various errors and review messages', 'User Testing', new Date(), '', 'No'],
    
    // Documentation Tests
    ['DOC001', 'Documentation', 'Test inline help system', 'Not Started', 'Medium', 'Test', 'Test help dialogs and documentation', 'Help is accessible and useful', '', 'Access help from various menu items', 'User Testing', new Date(), '', 'No'],
    ['DOC002', 'Documentation', 'Test system documentation accuracy', 'Not Started', 'Low', 'Test', 'Verify documentation matches actual system', 'Documentation is accurate and up-to-date', '', 'Compare docs with actual functionality', 'Both', new Date(), '', 'No']
  ];
  
  sheet.getRange(2, 1, testItems.length, testItems[0].length).setValues(testItems);
}

/**
 * Applies conditional formatting to highlight priorities and statuses
 */
function applyTestingConditionalFormatting(sheet) {
  // Priority formatting (Column E)
  const priorityRange = sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1);
  
  // Critical-Blocking priority - Dark Red
  const criticalBlockingRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Critical - Blocking')
    .setBackground('#d32f2f')
    .setFontColor('#ffffff')
    .setRanges([priorityRange])
    .build();
  
  // Critical priority - Red background
  const criticalRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Critical')
    .setBackground('#ffebee')
    .setFontColor('#c62828')
    .setRanges([priorityRange])
    .build();
  
  // High priority - Orange background
  const highRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('High')
    .setBackground('#fff3e0')
    .setFontColor('#ef6c00')
    .setRanges([priorityRange])
    .build();
  
  // Status formatting (Column D)
  const statusRange = sheet.getRange(2, 4, sheet.getMaxRows() - 1, 1);
  
  // Tested Pass - Bright Green
  const testedPassRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Tested Pass')
    .setBackground('#4caf50')
    .setFontColor('#ffffff')
    .setRanges([statusRange])
    .build();
  
  // Tested Fail - Bright Red
  const testedFailRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Tested Fail')
    .setBackground('#f44336')
    .setFontColor('#ffffff')
    .setRanges([statusRange])
    .build();
  
  // Needs Fix - Orange
  const needsFixRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Needs Fix')
    .setBackground('#ff9800')
    .setFontColor('#ffffff')
    .setRanges([statusRange])
    .build();
  
  // Ready for Review - Purple
  const readyReviewRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Ready for Review')
    .setBackground('#9c27b0')
    .setFontColor('#ffffff')
    .setRanges([statusRange])
    .build();
  
  // Completed - Green background
  const completedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Completed')
    .setBackground('#e8f5e8')
    .setFontColor('#2e7d32')
    .setRanges([statusRange])
    .build();
  
  // In Progress - Blue background
  const progressRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('In Progress')
    .setBackground('#e3f2fd')
    .setFontColor('#1976d2')
    .setRanges([statusRange])
    .build();
  
  // Ready for Review formatting (Column N)
  const reviewRange = sheet.getRange(2, 14, sheet.getMaxRows() - 1, 1);
  
  // Bug Found - Red background
  const bugFoundRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Bug Found')
    .setBackground('#ffebee')
    .setFontColor('#c62828')
    .setRanges([reviewRange])
    .build();
  
  // Critical Issue - Dark Red background
  const criticalIssueRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Critical Issue')
    .setBackground('#d32f2f')
    .setFontColor('#ffffff')
    .setRanges([reviewRange])
    .build();
  
  // Feature Request - Blue background
  const featureRequestRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Feature Request')
    .setBackground('#e3f2fd')
    .setFontColor('#1976d2')
    .setRanges([reviewRange])
    .build();
  
  // Question - Yellow background
  const questionRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Question')
    .setBackground('#fff9c4')
    .setFontColor('#f57f17')
    .setRanges([reviewRange])
    .build();
  
  // Ready for Developer - Green background
  const developerReadyRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Ready for Developer')
    .setBackground('#e8f5e8')
    .setFontColor('#2e7d32')
    .setRanges([reviewRange])
    .build();

  const rules = [
    criticalBlockingRule, criticalRule, highRule, 
    testedPassRule, testedFailRule, needsFixRule, readyReviewRule, completedRule, progressRule,
    bugFoundRule, criticalIssueRule, featureRequestRule, questionRule, developerReadyRule
  ];
  sheet.setConditionalFormatRules(rules);
}

/**
 * Adds validation rules for development planning
 */
function addDevelopmentValidationRules(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  
  // Category validation
  const categoryRange = sheet.getRange(2, 3, lastRow - 1, 1);
  const categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Core System', 'User Interface', 'Integration', 'Performance', 
      'Security', 'Reporting', 'Testing', 'Documentation', 'Infrastructure'
    ])
    .setAllowInvalid(false)
    .build();
  categoryRange.setDataValidation(categoryRule);
  
  // Priority validation
  const priorityRange = sheet.getRange(2, 4, lastRow - 1, 1);
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Critical', 'High', 'Medium', 'Low'])
    .setAllowInvalid(false)
    .build();
  priorityRange.setDataValidation(priorityRule);
  
  // Status validation
  const statusRange = sheet.getRange(2, 5, lastRow - 1, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Planning', 'Requirements', 'Design', 'Scaffolding', 'Development', 
      'Testing', 'Review', 'Complete', 'On Hold', 'Cancelled'
    ])
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Effort Estimate validation
  const effortRange = sheet.getRange(2, 9, lastRow - 1, 1);
  const effortRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['1-2 hours', '3-4 hours', '1 day', '2-3 days', '1 week', '2+ weeks'])
    .setAllowInvalid(false)
    .build();
  effortRange.setDataValidation(effortRule);
}

/**
 * Adds validation rules for code scaffold uploads
 */
function addCodeScaffoldValidationRules(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) return; // Account for instructions row
  
  // Code Type validation
  const typeRange = sheet.getRange(3, 4, lastRow - 2, 1);
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Google Apps Script', 'HTML', 'CSS', 'JavaScript', 'Configuration', 
      'Documentation', 'SQL', 'JSON', 'Other'
    ])
    .setAllowInvalid(false)
    .build();
  typeRange.setDataValidation(typeRule);
  
  // Source validation
  const sourceRange = sheet.getRange(3, 5, lastRow - 2, 1);
  const sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Gemini', 'GitHub Copilot', 'Manual', 'Template', 'Other'])
    .setAllowInvalid(false)
    .build();
  sourceRange.setDataValidation(sourceRule);
  
  // Status validation
  const statusRange = sheet.getRange(3, 9, lastRow - 2, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Uploaded', 'Reviewed', 'Ready to Implement', 'Implementing', 
      'Testing', 'Complete', 'Needs Revision'
    ])
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);
}

/**
 * Populates example features for development planning
 */
function populateExampleFeatures(sheet) {
  const exampleFeatures = [
    ['F001', 'Advanced Quote Generation Engine', 'Core System', 'Critical', 'Planning', 
     'Implement sophisticated quote generation with pricing rules, customer-specific pricing, and automated calculations', 
     '- Dynamic pricing rules\n- Customer tier management\n- Product configuration\n- Tax calculations', 
     'Master Catalog System', '2+ weeks', 'Major system component requiring careful design', '', ''],
    ['F002', 'Real-time Inventory Integration', 'Integration', 'High', 'Requirements', 
     'Connect with inventory management systems for real-time stock levels and availability', 
     '- API integration\n- Real-time updates\n- Stock level alerts\n- Availability checking', 
     'Quote Generation Engine', '1 week', 'Requires API design and external integrations', '', ''],
    ['F003', 'Customer Portal Dashboard', 'User Interface', 'Medium', 'Design', 
     'Self-service portal for customers to view quotes, place orders, and track status', 
     '- User authentication\n- Quote viewing\n- Order placement\n- Status tracking', 
     'Quote Generation Engine', '2-3 days', 'Frontend-heavy with some backend integration', '', ''],
    ['F004', 'Advanced Reporting Suite', 'Reporting', 'Medium', 'Planning', 
     'Comprehensive reporting for sales, inventory, customer analytics, and system performance', 
     '- Sales reports\n- Inventory analysis\n- Customer insights\n- Performance metrics', 
     'Core System Data', '1 week', 'Data analysis and visualization focus', '', '']
  ];
  
  sheet.getRange(2, 1, exampleFeatures.length, exampleFeatures[0].length).setValues(exampleFeatures);
}

/**
 * Adds instructions to the code scaffold sheet
 */
function addCodeScaffoldInstructions(sheet) {
  const instructions = [
    'INSTRUCTIONS:', 
    'Paste scaffolded code from Gemini/AI here', 
    'Each row = one file/code block', 
    'Use Code Content column for large code blocks', 
    'Mark status as you progress', 
    'Add notes for implementation guidance', 
    '', '', '', ''
  ];
  
  sheet.getRange(2, 1, 1, instructions.length).setValues([instructions]);
  sheet.getRange(2, 1, 1, instructions.length).setBackground('#FFF3E0').setFontStyle('italic');
}

/**
 * Applies conditional formatting for development planning
 */
function applyDevelopmentConditionalFormatting(sheet) {
  // Priority-based formatting
  const priorityRange = sheet.getRange(2, 4, sheet.getMaxRows() - 1, 1);
  
  // Critical - Red
  const criticalRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Critical')
    .setBackground('#FFEBEE')
    .setFontColor('#C62828')
    .setRanges([priorityRange])
    .build();
  
  // High - Orange
  const highRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('High')
    .setBackground('#FFF3E0')
    .setFontColor('#F57C00')
    .setRanges([priorityRange])
    .build();
  
  // Status-based formatting
  const statusRange = sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1);
  
  // Complete - Green
  const completeRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Complete')
    .setBackground('#E8F5E8')
    .setFontColor('#2E7D32')
    .setRanges([statusRange])
    .build();
  
  // Development - Blue
  const devRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Development')
    .setBackground('#E3F2FD')
    .setFontColor('#1976D2')
    .setRanges([statusRange])
    .build();
  
  sheet.setConditionalFormatRules([criticalRule, highRule, completeRule, devRule]);
}

/**
 * Applies conditional formatting for code scaffold uploads
 */
function applyCodeScaffoldConditionalFormatting(sheet) {
  const statusRange = sheet.getRange(3, 9, sheet.getMaxRows() - 2, 1);
  
  // Ready to Implement - Green
  const readyRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Ready to Implement')
    .setBackground('#E8F5E8')
    .setFontColor('#2E7D32')
    .setRanges([statusRange])
    .build();
  
  // Needs Revision - Red
  const revisionRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Needs Revision')
    .setBackground('#FFEBEE')
    .setFontColor('#C62828')
    .setRanges([statusRange])
    .build();
  
  // Implementing - Blue
  const implementingRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Implementing')
    .setBackground('#E3F2FD')
    .setFontColor('#1976D2')
    .setRanges([statusRange])
    .build();
  
  sheet.setConditionalFormatRules([readyRule, revisionRule, implementingRule]);
}

/**
 * Simple test function to verify the system is working
 */
function testTrackerFunction() {
  SpreadsheetApp.getUi().alert('✅ SystemTestingTracker.gs is working correctly!', 'The file is loaded and functions are accessible.', SpreadsheetApp.getUi().ButtonSet.OK);
  return 'Test successful!';
}
