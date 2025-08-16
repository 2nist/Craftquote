/**
 * Branding.gs
 * Manages all branding and styling configurations for the Hybrid Assembler UI.
 * Enhanced version with improved structure and functionality.
 */

const BRANDING_SHEET_NAME = "Branding";
const DEFAULT_BRANDING = {
  app: {
    name: "Hybrid Assembler",
    tagline: "Professional Automation Quote Builder",
  },
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    accent: "#28a745",
    background: "#f8f9fa",
  },
  icons: {
    app: "🔧",
    quote: "📋",
    component: "⚙️",
    template: "📄",
    info: "💡",
  },
  buttons: {
    primaryBg: "#007bff",
    primaryColor: "#ffffff",
    secondaryBg: "#6c757d",
    secondaryColor: "#ffffff",
    borderRadius: "4px",
    padding: "10px 20px",
  },
  logo: {
    url: "", // URL of a hosted logo image
    height: "50px",
  },
};

/**
 * Displays the Branding Editor user interface.
 * This function is called from the custom menu.
 */
function openBrandingEditor() {
  const html = HtmlService.createHtmlOutputFromFile('BrandingEditor')
    .setWidth(400)
    .setHeight(600)
    .setTitle('Branding Editor');
  SpreadsheetApp.getUi().showModalDialog(html, 'Edit Branding');
}

/**
 * Initializes the Branding sheet with default values if it doesn't exist.
 * This is called once during initial system setup.
 */
function initializeBrandingSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BRANDING_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(BRANDING_SHEET_NAME);
    const headers = ["Setting", "Value", "Notes"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.getRange(1, 1, 1, headers.length).setBackground("#1a73e8").setFontColor("white");
    sheet.setFrozenRows(1);

    // Populate with default settings
    const defaultData = [
      ["appName", DEFAULT_BRANDING.app.name, "Name of the application"],
      ["appTagline", DEFAULT_BRANDING.app.tagline, "Short tagline for the app"],
      ["primaryColor", DEFAULT_BRANDING.colors.primary, "Main color for buttons, titles"],
      ["secondaryColor", DEFAULT_BRANDING.colors.secondary, "Color for secondary elements"],
      ["accentColor", DEFAULT_BRANDING.colors.accent, "Accent color for highlights"],
      ["backgroundColor", DEFAULT_BRANDING.colors.background, "Background color"],
      ["logoUrl", DEFAULT_BRANDING.logo.url, "URL of the company logo"],
      ["logoHeight", DEFAULT_BRANDING.logo.height, "Height of the logo"],
      ["buttonRadius", DEFAULT_BRANDING.buttons.borderRadius, "Rounding for all buttons"],
      ["buttonPadding", DEFAULT_BRANDING.buttons.padding, "Button padding"],
      ["appIcon", DEFAULT_BRANDING.icons.app, "Main app icon emoji or character"],
      ["quoteIcon", DEFAULT_BRANDING.icons.quote, "Quote icon"],
      ["componentIcon", DEFAULT_BRANDING.icons.component, "Component icon"],
      ["templateIcon", DEFAULT_BRANDING.icons.template, "Template icon"],
      ["infoIcon", DEFAULT_BRANDING.icons.info, "Info icon"],
    ];
    sheet.getRange(2, 1, defaultData.length, headers.length).setValues(defaultData);
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('✅ Branding sheet initialized with default settings');
  }
  return sheet;
}

/**
 * Retrieves all branding settings from the Branding sheet.
 * @returns {object} A configuration object with branding settings.
 */
function getBrandingConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(BRANDING_SHEET_NAME);

  if (!sheet) {
    // If the sheet doesn't exist, initialize it and return defaults
    initializeBrandingSheet();
    return DEFAULT_BRANDING;
  }

  const data = sheet.getDataRange().getValues();
  const config = { ...DEFAULT_BRANDING }; // Start with defaults
  
  if (data.length > 1) {
    data.slice(1).forEach((row) => {
      const [setting, value] = row;
      if (setting && value !== null && value !== undefined) {
        // Map settings from the sheet to the config object
        switch (setting) {
          case "appName":
            config.app.name = value;
            break;
          case "appTagline":
            config.app.tagline = value;
            break;
          case "primaryColor":
            config.colors.primary = value;
            break;
          case "secondaryColor":
            config.colors.secondary = value;
            break;
          case "accentColor":
            config.colors.accent = value;
            break;
          case "backgroundColor":
            config.colors.background = value;
            break;
          case "logoUrl":
            config.logo.url = value;
            break;
          case "logoHeight":
            config.logo.height = value;
            break;
          case "buttonRadius":
            config.buttons.borderRadius = value;
            break;
          case "buttonPadding":
            config.buttons.padding = value;
            break;
          case "appIcon":
            config.icons.app = value;
            break;
          case "quoteIcon":
            config.icons.quote = value;
            break;
          case "componentIcon":
            config.icons.component = value;
            break;
          case "templateIcon":
            config.icons.template = value;
            break;
          case "infoIcon":
            config.icons.info = value;
            break;
        }
      }
    });
  }

  return config;
}

/**
 * Saves branding settings from the UI to the Branding sheet.
 * @param {object} newSettings The new branding settings from the UI.
 */
function saveBrandingConfig(newSettings) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BRANDING_SHEET_NAME);
  
  if (!sheet) {
    sheet = initializeBrandingSheet();
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const settingsMap = new Map(data.slice(1).map((row) => [row[0], row]));
  
  Object.entries(newSettings).forEach(([key, value]) => {
    if (settingsMap.has(key)) {
      settingsMap.get(key)[1] = value;
    } else {
      // Add new settings if they don't exist
      settingsMap.set(key, [key, value, 'User-defined setting']);
    }
  });

  const newData = [headers, ...Array.from(settingsMap.values())];
  sheet.clear();
  sheet.getRange(1, 1, newData.length, headers.length).setValues(newData);
  
  // Reapply formatting
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.getRange(1, 1, 1, headers.length).setBackground("#1a73e8").setFontColor("white");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  
  console.log('✅ Branding settings saved successfully');
  return "Branding settings saved successfully!";
}

/**
 * Resets branding to default values.
 */
function resetBrandingToDefaults() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(BRANDING_SHEET_NAME);
  
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  
  initializeBrandingSheet();
  return "Branding reset to default values!";
}

/**
 * Gets a preview of how the branding will look (for testing).
 */
function previewBranding() {
  const config = getBrandingConfig();
  let preview = `🎨 BRANDING PREVIEW\n\n`;
  preview += `App: ${config.icons.app} ${config.app.name}\n`;
  preview += `Tagline: ${config.app.tagline}\n`;
  preview += `Primary Color: ${config.colors.primary}\n`;
  preview += `Secondary Color: ${config.colors.secondary}\n`;
  preview += `Accent Color: ${config.colors.accent}\n`;
  preview += `Logo URL: ${config.logo.url || 'None set'}\n`;
  preview += `Button Style: ${config.buttons.borderRadius} corners, ${config.buttons.padding} padding\n`;
  
  SpreadsheetApp.getUi().alert('Branding Preview', preview, SpreadsheetApp.getUi().ButtonSet.OK);
  return config;
}

/**
 * Legacy compatibility function - maps to new getBrandingConfig
 */
function showBrandingEditor() {
  openBrandingEditor();
}

/**
 * Creates and initializes the 'Branding' sheet with default values.
 * Legacy compatibility function for existing system.
 */
function setupBrandingSheet(ss) {
  return initializeBrandingSheet();
}

/**
 * Provides the default branding configuration.
 * Legacy compatibility function for existing system.
 */
function getDefaultBrandingData() {
  return {
    // Application Identity
    appName: DEFAULT_BRANDING.app.name,
    appTagline: DEFAULT_BRANDING.app.tagline,
    appIcon: DEFAULT_BRANDING.icons.app,
    companyName: "Craft Automation Systems",
    // Color Scheme
    primaryColor: DEFAULT_BRANDING.colors.primary,
    secondaryColor: DEFAULT_BRANDING.colors.secondary,
    accentColor: DEFAULT_BRANDING.colors.accent,
    successColor: "#22c55e",
    warningColor: "#f59e0b",
    dangerColor: "#ef4444",
    backgroundColor: DEFAULT_BRANDING.colors.background,
    // Product Category Icons
    bhacIcon: "🍺",
    dtacIcon: "🥃",
    cpacIcon: "🧽",
    ghacIcon: "🌾",
    agacIcon: "⚙️",
    // Action Icons
    addIcon: "➕",
    removeIcon: "❌",
    editIcon: "✏️",
    saveIcon: "💾",
    generateIcon: "✨",
    quoteIcon: DEFAULT_BRANDING.icons.quote,
    componentIcon: DEFAULT_BRANDING.icons.component,
    templateIcon: DEFAULT_BRANDING.icons.template,
    infoIcon: DEFAULT_BRANDING.icons.info,
    // Logo settings
    logoUrl: DEFAULT_BRANDING.logo.url,
    logoHeight: DEFAULT_BRANDING.logo.height,
    // Button settings
    buttonRadius: DEFAULT_BRANDING.buttons.borderRadius,
    buttonPadding: DEFAULT_BRANDING.buttons.padding
  };
}
