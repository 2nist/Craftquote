/**
 * QUICK ASSEMBLY RECALL SYSTEM
 * Instant access to proven assemblies by panel type
 * Built from reverse-engineered BOM database
 */

function quickRecallDTAC() {
  recallAssembliesByType('DTAC', '🥃 Distillery Temperature Assemblies');
}

function quickRecallGHAC() {
  recallAssembliesByType('GHAC', '🌾 Grain Handling Assemblies');
}

function quickRecallBHAC() {
  recallAssembliesByType('BHAC', '🍺 Brewery Automation Assemblies');
}

function quickRecallCPAC() {
  recallAssembliesByType('CPAC', '🧽 CIP Automation Assemblies');
}

function quickRecallAGAC() {
  recallAssembliesByType('AGAC', '🌾 Advanced Grain Control Assemblies');
}

function recallAssembliesByType(panelType, displayName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const panelSheet = ss.getSheetByName(`${panelType}_Assemblies`);
    
    if (!panelSheet) {
      SpreadsheetApp.getUi().alert(
        `❌ ${displayName} NOT FOUND\n\n` +
        '🔧 Run "Build Assembly Database" first\n' +
        'to extract assemblies from your BOMs\n' +
        `and create ${panelType} assembly database.`
      );
      return;
    }
    
    const data = panelSheet.getDataRange().getValues();
    if (data.length <= 3) {
      SpreadsheetApp.getUi().alert(
        `📋 ${displayName}\n\n` +
        '🔍 No assemblies found yet.\n\n' +
        '💡 This means:\n' +
        `• No ${panelType} assemblies in your BOMs\n` +
        '• Assembly database needs rebuilding\n' +
        '• Manual assembly entry required\n\n' +
        '🚀 Try running "Build Assembly Database" again.'
      );
      return;
    }
    
    // Count assemblies
    const assemblyCount = data.length - 3;
    
    // Get top assemblies
    let assemblyList = '';
    for (let i = 3; i < Math.min(data.length, 8); i++) {
      const row = data[i];
      const name = row[0] || 'Unnamed';
      const confidence = row[3] || 'Unknown';
      const cost = row[4] || 'TBD';
      assemblyList += `• ${name} (${confidence}% confidence, $${cost})\n`;
    }
    
    if (assemblyCount > 5) {
      assemblyList += `... and ${assemblyCount - 5} more assemblies\n`;
    }
    
    SpreadsheetApp.getUi().alert(
      `📊 ${displayName}\n\n` +
      `🎯 FOUND ${assemblyCount} PROVEN ASSEMBLIES:\n\n` +
      assemblyList + '\n' +
      `🔍 VIEW ALL: Check "${panelType}_Assemblies" sheet\n` +
      '📋 COPY TO QUOTE: Select assembly → Copy to HW_Assemblies\n' +
      '🤖 AI ENHANCED: Confidence ratings from BOM analysis\n\n' +
      '💡 These assemblies are proven from your existing BOMs!'
    );
    
    // Auto-navigate to the sheet
    panelSheet.activate();
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Assembly Recall error: ${error.toString()}`);
  }
}

/**
 * Copy selected assembly to active quote
 */
function copyAssemblyToQuote() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = ss.getActiveSheet();
    const selection = activeSheet.getActiveRange();
    
    // Check if we're in a panel assembly sheet
    const sheetName = activeSheet.getName();
    if (!sheetName.includes('_Assemblies') || sheetName === 'HW_Assemblies') {
      SpreadsheetApp.getUi().alert(
        '❌ WRONG SHEET SELECTED\n\n' +
        '📋 To copy assemblies:\n' +
        '1. Go to a panel assembly sheet\n' +
        '   (DTAC_Assemblies, GHAC_Assemblies, etc.)\n' +
        '2. Select the assembly row\n' +
        '3. Run this function again\n\n' +
        '💡 Current sheet: ' + sheetName
      );
      return;
    }
    
    const selectedRow = selection.getRow();
    if (selectedRow <= 3) {
      SpreadsheetApp.getUi().alert(
        '📋 SELECT AN ASSEMBLY ROW\n\n' +
        '⚠️ Headers selected, not assembly data\n\n' +
        '🎯 Click on an assembly row (row 4+)\n' +
        'then run Copy Assembly to Quote again.'
      );
      return;
    }
    
    // Get assembly data
    const assemblyData = activeSheet.getRange(selectedRow, 1, 1, 10).getValues()[0];
    const assemblyName = assemblyData[0];
    const components = assemblyData[1];
    const totalCost = assemblyData[4];
    
    // Get or create HW_Assemblies sheet
    let hwAssemblies = ss.getSheetByName('HW_Assemblies');
    if (!hwAssemblies) {
      SpreadsheetApp.getUi().alert(
        '❌ HW_ASSEMBLIES SHEET NOT FOUND\n\n' +
        '🔧 Run "Setup Hierarchical Workflow" first\n' +
        'to create the HW_Assemblies database.'
      );
      return;
    }
    
    // Add to HW_Assemblies
    const nextRow = hwAssemblies.getLastRow() + 1;
    hwAssemblies.getRange(nextRow, 1, 1, 6).setValues([[
      assemblyName,
      components,
      totalCost,
      new Date(),
      'Imported from ' + sheetName,
      'Ready'
    ]]);
    
    SpreadsheetApp.getUi().alert(
      '✅ ASSEMBLY COPIED TO QUOTE!\n\n' +
      `📋 Assembly: ${assemblyName}\n` +
      `💰 Cost: $${totalCost}\n` +
      `📊 Source: ${sheetName}\n\n` +
      '🎯 NEXT STEPS:\n' +
      '• Check HW_Assemblies sheet\n' +
      '• Modify quantities if needed\n' +
      '• Generate quote with proven assembly\n\n' +
      '🚀 Your established assembly is ready!'
    );
    
    // Navigate to HW_Assemblies
    hwAssemblies.activate();
    hwAssemblies.getRange(nextRow, 1).activate();
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Copy Assembly error: ${error.toString()}`);
  }
}

/**
 * Show assembly usage statistics
 */
function showAssemblyStats() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const panelTypes = ['DTAC', 'GHAC', 'BHAC', 'CPAC', 'AGAC'];
    const panelIcons = ['🥃', '🌾', '🍺', '🧽', '🌾'];
    
    let stats = '📊 ASSEMBLY DATABASE STATISTICS\n\n';
    let totalAssemblies = 0;
    
    panelTypes.forEach((type, index) => {
      const sheet = ss.getSheetByName(`${type}_Assemblies`);
      if (sheet && sheet.getLastRow() > 3) {
        const count = sheet.getLastRow() - 3;
        totalAssemblies += count;
        stats += `${panelIcons[index]} ${type}: ${count} assemblies\n`;
      } else {
        stats += `${panelIcons[index]} ${type}: No assemblies\n`;
      }
    });
    
    stats += `\n🎯 TOTAL: ${totalAssemblies} proven assemblies\n\n`;
    
    // Check master database
    const masterDB = ss.getSheetByName('Assembly_Database');
    if (masterDB && masterDB.getLastRow() > 1) {
      const masterCount = masterDB.getLastRow() - 1;
      stats += `🗄️ Master Database: ${masterCount} entries\n`;
    }
    
    // Check parts catalog
    const partsDB = ss.getSheetByName('HW_Parts');
    if (partsDB && partsDB.getLastRow() > 1) {
      const partsCount = partsDB.getLastRow() - 1;
      stats += `🔧 Parts Catalog: ${partsCount} components\n`;
    }
    
    stats += '\n💡 TIP: Use Quick Recall functions to\n';
    stats += 'instantly access proven assemblies!';
    
    SpreadsheetApp.getUi().alert(stats);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Assembly Stats error: ${error.toString()}`);
  }
}
