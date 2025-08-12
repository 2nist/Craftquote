/**
 * SIMPLE TEST FUNCTION - Verify Google Apps Script Integration
 */

function testBasicFunction() {
  console.log('🎯 TEST - Basic function called successfully!');
  SpreadsheetApp.getUi().alert('🎯 Google Apps Script is working!\n\nIf you see this message, the integration is functional.');
  return 'Test successful';
}

function testMenuCreation() {
  console.log('🎯 TEST MENU - Creating test menu...');
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🧪 TEST MENU')
      .addItem('Test Basic Function', 'testBasicFunction')
      .addItem('Test HTML Dialog', 'testSimpleDialog')
      .addToUi();
    console.log('🎯 TEST MENU - Menu created successfully!');
  } catch (error) {
    console.error('🚨 TEST MENU ERROR:', error);
  }
}

function testSimpleDialog() {
  console.log('🎯 TEST DIALOG - Creating simple HTML dialog...');
  try {
    const html = HtmlService.createHtmlOutput(`
      <h2>🎯 HTML Dialog Test</h2>
      <p>If you can see this, HTML dialogs are working!</p>
      <p>Current time: ${new Date().toISOString()}</p>
    `).setWidth(400).setHeight(300);
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Test Dialog');
    console.log('🎯 TEST DIALOG - Dialog shown successfully!');
  } catch (error) {
    console.error('🚨 TEST DIALOG ERROR:', error);
  }
}
