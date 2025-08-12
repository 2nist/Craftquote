/**
 * CraftQuote Branding Configuration System
 * Centralized branding and theming for the entire application
 */

/**
 * Get current branding configuration
 */
function getBrandingConfig() {
  return {
    // Application Identity
    app: {
      name: "CraftQuote",
      tagline: "Professional Automation Quote Builder",
      version: "2.0",
      company: "Craft Automation Systems"
    },
    
    // Color Scheme
    colors: {
      primary: "#4a90e2",        // Main blue
      primaryDark: "#357abd",    // Darker blue for hover states
      secondary: "#60a5fa",      // Light blue for accents
      accent: "#10b981",         // Green for success states
      warning: "#f59e0b",        // Orange for warnings
      danger: "#ef4444",         // Red for errors
      
      // Background colors
      backgroundDark: "#1a1a1a", // Main dark background
      backgroundMedium: "#2d2d2d", // Medium background
      backgroundLight: "#3d3d3d", // Light background elements
      
      // Text colors
      textPrimary: "#ffffff",    // Primary white text
      textSecondary: "#d1d5db",  // Secondary gray text
      textMuted: "#9ca3af",      // Muted gray text
      
      // UI element colors
      border: "#374151",         // Border color
      success: "#22c55e",        // Success green
      info: "#3b82f6",          // Info blue
      
      // Gradient backgrounds
      gradientPrimary: "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
      gradientAccent: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
    },
    
    // Typography
    fonts: {
      primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      secondary: "'Arial', sans-serif",
      mono: "'Courier New', monospace"
    },
    
    // Icons and Emojis
    icons: {
      // Main application icons
      app: "🔧",
      quote: "📋",
      component: "⚙️",
      template: "📋",
      assembly: "🏗️",
      
      // Action icons
      add: "➕",
      remove: "❌",
      edit: "✏️",
      save: "💾",
      delete: "🗑️",
      refresh: "🔄",
      generate: "✨",
      
      // Status icons
      success: "✅",
      warning: "⚠️",
      error: "❌",
      info: "ℹ️",
      loading: "⏳",
      
      // Category icons
      brewhouse: "🍺",
      distillery: "🥃",
      cip: "🧽",
      grain: "🌾",
      automation: "🤖",
      electrical: "⚡",
      mechanical: "🔩",
      
      // Navigation icons
      home: "🏠",
      settings: "⚙️",
      help: "❓",
      search: "🔍",
      filter: "🔽",
      menu: "☰"
    },
    
    // UI Element Styles
    ui: {
      borderRadius: "8px",
      borderRadiusSmall: "4px",
      borderRadiusLarge: "12px",
      
      // Shadows
      shadowSmall: "0 1px 3px rgba(0, 0, 0, 0.1)",
      shadowMedium: "0 4px 6px rgba(0, 0, 0, 0.1)",
      shadowLarge: "0 10px 25px rgba(0, 0, 0, 0.15)",
      
      // Transitions
      transition: "all 0.3s ease",
      transitionFast: "all 0.15s ease",
      transitionSlow: "all 0.5s ease"
    },
    
    // Product Categories
    productCategories: {
      BHAC: {
        name: "Brewery Automated Control",
        icon: "🍺",
        color: "#f59e0b",
        description: "Automated brewery control systems"
      },
      DTAC: {
        name: "Distillery Temperature Control", 
        icon: "🥃",
        color: "#8b5cf6",
        description: "Precision distillery temperature control"
      },
      CPAC: {
        name: "CIP Automated Control",
        icon: "🧽", 
        color: "#06b6d4",
        description: "Clean-in-place automation systems"
      },
      GHAC: {
        name: "Grain Handling Control",
        icon: "🌾",
        color: "#84cc16",
        description: "Automated grain handling systems"
      },
      AGAC: {
        name: "Advanced Grain Control",
        icon: "🌾",
        color: "#22c55e",
        description: "Advanced grain automation control"
      }
    },
    
    // Messages and Labels
    messages: {
      loading: "Loading your components...",
      noData: "No components found",
      error: "Something went wrong",
      success: "Operation completed successfully",
      
      // Specific UI messages
      templateLauncher: "Quick Start with Smart Templates",
      templateDescription: "Load a proven template, then customize with full freedom",
      quoteConfiguration: "Quote Configuration",
      componentLibrary: "Component Library",
      smartSuggestions: "Smart Suggestions"
    },
    
    // Company Codes for Quote Generation
    companyCodes: {
      "BL": "Blichmann",
      "MH": "Malt Handling", 
      "SB": "Silverback",
      "SD": "Still Dragon",
      "RM": "RMS",
      "CF": "Copperfiddle",
      "CM": "Chapman",
      "SS": "Stout Tanks",
      "AB": "ABM Equipment",
      "TC": "Tiantai",
      "SP": "Spike",
      "WE": "Williams Warn",
      "BR": "Braulounge",
      "MP": "Murphy & Son",
      "HG": "Hangzhou Huihe",
      "NB": "Northern Brewer",
      "PL": "Premier Stainless",
      "GW": "G&D Chillers", 
      "AC": "Alpha Brewing",
      "MI": "MISC/Other"
    },
    
    // Category mappings for quote generation
    categories: {
      "01": "New Build",
      "02": "Mod/Upgrade/Change Order", 
      "03": "Part Order/ Equipment",
      "04": "Install / Commissioning",
      "05": "Panel Build",
      "06": "Warranty",
      "07": "R&D",
      "08": "Programming ONLY",
      "09": "System Integration",
      "10": "Engineering and Programming",
      "11": "Evaluation",
      "12": "Tech Support"
    }
  };
}

/**
 * Apply branding to HTML template
 */
function applyBrandingToHTML(htmlContent) {
  const branding = getBrandingConfig();
  
  // Replace branding placeholders in HTML
  let brandedHTML = htmlContent;
  
  // Replace app name and tagline
  brandedHTML = brandedHTML.replace(/\{\{APP_NAME\}\}/g, branding.app.name);
  brandedHTML = brandedHTML.replace(/\{\{APP_TAGLINE\}\}/g, branding.app.tagline);
  brandedHTML = brandedHTML.replace(/\{\{APP_VERSION\}\}/g, branding.app.version);
  
  // Replace icons
  Object.keys(branding.icons).forEach(key => {
    const placeholder = new RegExp(`\\{\\{ICON_${key.toUpperCase()}\\}\\}`, 'g');
    brandedHTML = brandedHTML.replace(placeholder, branding.icons[key]);
  });
  
  // Replace colors in CSS
  Object.keys(branding.colors).forEach(key => {
    const placeholder = new RegExp(`\\{\\{COLOR_${key.toUpperCase()}\\}\\}`, 'g');
    brandedHTML = brandedHTML.replace(placeholder, branding.colors[key]);
  });
  
  return brandedHTML;
}

/**
 * Generate CSS variables from branding config
 */
function generateCSSVariables() {
  const branding = getBrandingConfig();
  let css = ':root {\n';
  
  // Add color variables
  Object.keys(branding.colors).forEach(key => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    css += `  --color-${cssVar}: ${branding.colors[key]};\n`;
  });
  
  // Add UI variables
  Object.keys(branding.ui).forEach(key => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    css += `  --ui-${cssVar}: ${branding.ui[key]};\n`;
  });
  
  // Add font variables
  Object.keys(branding.fonts).forEach(key => {
    css += `  --font-${key}: ${branding.fonts[key]};\n`;
  });
  
  css += '}\n';
  return css;
}

/**
 * Save custom branding configuration
 */
function saveBrandingConfig(newConfig) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let brandingSheet = ss.getSheetByName('BrandingConfig');
    
    if (!brandingSheet) {
      brandingSheet = ss.insertSheet('BrandingConfig');
      brandingSheet.getRange(1, 1, 1, 3).setValues([
        ['ConfigKey', 'ConfigValue', 'LastUpdated']
      ]);
    }
    
    // Clear existing config
    if (brandingSheet.getLastRow() > 1) {
      brandingSheet.getRange(2, 1, brandingSheet.getLastRow() - 1, 3).clear();
    }
    
    // Save new config
    const configEntries = [];
    function addConfigEntries(obj, prefix = '') {
      Object.keys(obj).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          addConfigEntries(obj[key], fullKey);
        } else {
          configEntries.push([fullKey, obj[key], new Date()]);
        }
      });
    }
    
    addConfigEntries(newConfig);
    
    if (configEntries.length > 0) {
      brandingSheet.getRange(2, 1, configEntries.length, 3).setValues(configEntries);
    }
    
    return { success: true, message: 'Branding configuration saved successfully' };
    
  } catch (error) {
    console.error('Error saving branding config:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load custom branding configuration from sheet
 */
function loadCustomBrandingConfig() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const brandingSheet = ss.getSheetByName('BrandingConfig');
    
    if (!brandingSheet || brandingSheet.getLastRow() <= 1) {
      return getBrandingConfig(); // Return default config
    }
    
    const data = brandingSheet.getRange(2, 1, brandingSheet.getLastRow() - 1, 2).getValues();
    const customConfig = {};
    
    data.forEach(row => {
      const [key, value] = row;
      if (key && value !== '') {
        setNestedValue(customConfig, key, value);
      }
    });
    
    // Merge with default config
    const defaultConfig = getBrandingConfig();
    return mergeDeep(defaultConfig, customConfig);
    
  } catch (error) {
    console.error('Error loading custom branding config:', error);
    return getBrandingConfig(); // Return default config on error
  }
}

/**
 * Helper function to set nested object values
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

/**
 * Helper function to deep merge objects
 */
function mergeDeep(target, source) {
  const result = Object.assign({}, target);
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });
  
  return result;
}

/**
 * Generate branding preview HTML
 */
function generateBrandingPreview() {
  const branding = getBrandingConfig();
  
  return `
    <div class="branding-preview">
      <h2>${branding.icons.app} ${branding.app.name}</h2>
      <p>${branding.app.tagline}</p>
      
      <div class="color-palette">
        <div class="color-swatch" style="background: ${branding.colors.primary}">Primary</div>
        <div class="color-swatch" style="background: ${branding.colors.secondary}">Secondary</div>
        <div class="color-swatch" style="background: ${branding.colors.accent}">Accent</div>
        <div class="color-swatch" style="background: ${branding.colors.success}">Success</div>
      </div>
      
      <div class="product-icons">
        ${Object.keys(branding.productCategories).map(key => 
          `<span>${branding.productCategories[key].icon} ${branding.productCategories[key].name}</span>`
        ).join('')}
      </div>
    </div>
  `;
}
