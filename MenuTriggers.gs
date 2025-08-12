/**
 * Installable trigger based menu for standalone Apps Script projects
 * This creates the menu when the target Spreadsheet is opened.
 */

/**
 * 1) Run this once to install the onOpen trigger for your spreadsheet.
 * Prereq: MAIN_SPREADSHEET_ID must be set (deployCraftQuoteSystem() does this)
 */
function installCraftQuoteMenuTrigger() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('MAIN_SPREADSHEET_ID');

  if (!spreadsheetId) {
    // Try to find the spreadsheet by common name as a fallback
    const NAME = 'CraftQuote System Database';
    const files = DriveApp.getFilesByName(NAME);
    if (files.hasNext()) spreadsheetId = files.next().getId();
  }

  if (!spreadsheetId) {
    throw new Error('MAIN_SPREADSHEET_ID not set. Run deployCraftQuoteSystem() first, or set it manually in Script Properties.');
  }

  // Remove existing onOpen triggers for spreadsheet to avoid duplicates
  ScriptApp.getProjectTriggers()
    .filter(t => t.getEventType() === ScriptApp.EventType.ON_OPEN)
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('addCraftQuoteMenu')
    .forSpreadsheet(spreadsheetId)
    .onOpen()
    .create();

  return `✅ Trigger installed. Open the spreadsheet and refresh: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
}

/**
 * 2) This runs automatically when that spreadsheet is opened.
 * Safe to run from trigger context and creates the UI menu.
 */
function addCraftQuoteMenu(e) {
  // Use the sheet that fired the trigger if available
  const ss = e && e.source ? e.source : SpreadsheetApp.getActiveSpreadsheet();
  const ui = ss.getUi();

  ui.createMenu('🔧 CraftQuote')
    .addItem('📝 Component Assembler', 'openComponentAssembler')
    .addItem('🎨 Branding Editor', 'openBrandingEditor')
    .addItem('🎛️ Assembly Editor', 'openAssemblyEditor')
    .addSeparator()
    .addItem('🧪 Test System', 'testBackendConnection')
    .addToUi();
}

/**
 * Optional helper: manually set or fix the spreadsheet ID if needed.
 */
function setMainSpreadsheetId(spreadsheetId) {
  if (!/^([a-zA-Z0-9-_]{10,})$/.test(spreadsheetId)) {
    throw new Error('Invalid spreadsheet ID');
  }
  PropertiesService.getScriptProperties().setProperty('MAIN_SPREADSHEET_ID', spreadsheetId);
  return 'MAIN_SPREADSHEET_ID saved.';
}
