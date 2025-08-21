# Professional Menu System (No Emojis)
# Clean implementation for CompleteMasterCatalogSystem_V2.gs onOpen function

function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    
    // Create the consolidated menu with all functionality
    ui.createMenu('Craft Automation')
      .addItem('Import Master Catalog', 'importFromCsvFile')
      .addItem('Complete Setup (One Click)', 'completeHierarchicalSetup')
      .addSeparator()
      .addItem('Set CSV File ID', 'openSetCsvFileIdDialog')
      .addItem('Clear CSV File ID', 'clearCsvFileId')
      .addSeparator()
      .addItem('Open Component Price List', 'openComponentPriceList')
      .addItem('Open Hybrid Assembler', 'openHybridAssembler')
      .addItem('Network File Explorer', 'openNasExplorer')
      .addSeparator()
      .addItem('Edit Branding', 'openBrandingEditor')
      .addItem('Branding Demo', 'openBrandingDemo')
      .addSeparator()
      .addItem('Import FULL Catalog (1,500+ Parts)', 'importFullCatalogBatched')
      .addItem('Import Sample Catalog (28 Parts)', 'importFullCatalog')
      .addSeparator()
      .addItem('CSV Diagnostic', 'diagnoseCsvFile')
      .addItem('Repair Master Catalog Headers', 'repairMasterCatalogHeaders')
      .addSeparator()
      .addItem('Diagnose System', 'quickDiagnose')
      .addItem('Test Data', 'testCatalogData')
      .addItem('Validate System', 'validateSystem')
      .addSeparator()
      .addItem('View Catalog Stats', 'showCatalogStats')
      .addItem('Create Testing Tracker', 'createSystemTestingTracker')
      .addItem('Test Tracker Function', 'testTrackerFunction')
      .addItem('View Ready for Review', 'showReadyForReview')
      .addItem('Debug Menu', 'debugMenuSystem')
      .addItem('Help', 'showQuickHelp')
      .addToUi();
      
    console.log('Craft Automation Menu Created Successfully');
  } catch (error) {
    console.error('Menu creation error:', error);
  }
}
