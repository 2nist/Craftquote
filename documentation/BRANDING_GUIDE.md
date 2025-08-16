# 🎨 Branding System Documentation

The Hybrid Assembler Branding System allows you to completely customize the look and feel of your application. This system consists of three main components:

## 📁 System Files

### 1. **Branding.gs** (Backend)
- Manages branding configuration data
- Reads/writes to a dedicated "Branding" sheet
- Provides functions for getting and saving branding settings
- Initializes default branding values

### 2. **BrandingEditor.html** (Editor Interface)
- Simple form-based UI for editing branding settings
- Real-time preview (future enhancement)
- Categories: Identity, Colors, Logo, Buttons, Icons

### 3. **BrandingDemo.html** (Integration Example)
- Shows how to apply branding in your UI components
- Demonstrates CSS variable usage
- Example of loading and applying branding dynamically

## 🎨 Available Branding Options

### Application Identity
- **App Name**: Main application title
- **App Tagline**: Subtitle/description
- **App Icon**: Emoji or character for the app

### Color Scheme
- **Primary Color**: Main brand color for buttons, headers
- **Secondary Color**: Supporting color for secondary elements
- **Accent Color**: Highlight color for important elements
- **Background Color**: Main background color

### Logo Settings
- **Logo URL**: Link to hosted logo image
- **Logo Height**: Size of the logo (e.g., "50px")

### Button Styling
- **Border Radius**: Corner rounding (e.g., "4px", "50%")
- **Padding**: Internal spacing (e.g., "10px 20px")

### Icons
- **Quote Icon**: For quote-related features
- **Component Icon**: For component management
- **Template Icon**: For template features
- **Info Icon**: For help/information

## 🚀 How to Use

### 1. Access the Branding Editor
- Open your Google Sheets application
- Go to **⚡ Craft Automation** menu
- Click **🎨 Edit Branding**

### 2. Customize Your Brand
- Update application name and tagline
- Choose your brand colors using color pickers
- Set logo URL if you have a hosted logo
- Customize button styling
- Choose appropriate icons

### 3. Apply Branding to Your UI

#### Step 1: Load Branding Configuration
```javascript
document.addEventListener('DOMContentLoaded', function() {
  google.script.run
    .withSuccessHandler(applyBranding)
    .getBrandingConfig();
});
```

#### Step 2: Apply to CSS Variables
```javascript
function applyBranding(config) {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', config.colors.primary);
  root.style.setProperty('--secondary-color', config.colors.secondary);
  root.style.setProperty('--accent-color', config.colors.accent);
  root.style.setProperty('--background-color', config.colors.background);
  root.style.setProperty('--button-radius', config.buttons.borderRadius);
  root.style.setProperty('--button-padding', config.buttons.padding);
}
```

#### Step 3: Update Content
```javascript
// Update text content
document.getElementById('appName').textContent = config.app.name;
document.getElementById('appTagline').textContent = config.app.tagline;

// Update icons
document.getElementById('appIcon').textContent = config.icons.app;
document.getElementById('quoteIcon').textContent = config.icons.quote;
```

### 4. CSS Structure
Use CSS variables in your styles:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --accent-color: #28a745;
  --background-color: #f8f9fa;
  --button-radius: 4px;
  --button-padding: 10px 20px;
}

.btn-primary {
  background-color: var(--primary-color);
  border-radius: var(--button-radius);
  padding: var(--button-padding);
}
```

## 🔧 Integration with Existing System

The branding system is fully integrated with your existing Craft Automation system:

1. **Menu Integration**: Branding editor is accessible from the main menu
2. **Sheet Integration**: Settings are stored in a "Branding" sheet
3. **Backward Compatibility**: Maintains compatibility with existing CraftQuote branding
4. **Legacy Support**: Includes mapping for existing branding functions

## 📊 Data Storage

Branding settings are stored in a dedicated "Branding" sheet with the following structure:

| Setting | Value | Notes |
|---------|-------|-------|
| appName | Hybrid Assembler | Name of the application |
| appTagline | Professional Automation Quote Builder | Short tagline |
| primaryColor | #007bff | Main color for buttons, titles |
| ... | ... | ... |

## 🎯 Best Practices

1. **Consistent Colors**: Use your brand colors consistently across all UI elements
2. **Accessible Contrast**: Ensure good contrast between text and background colors
3. **Logo Optimization**: Use optimized, web-friendly logo formats
4. **Icon Consistency**: Use consistent icon styles (emoji vs. font icons)
5. **Testing**: Use the Branding Demo to test your changes before applying to production

## 🔄 Functions Reference

### Backend Functions
- `getBrandingConfig()`: Returns current branding configuration
- `saveBrandingConfig(settings)`: Saves new branding settings
- `initializeBrandingSheet()`: Creates branding sheet with defaults
- `openBrandingEditor()`: Opens the branding editor dialog
- `resetBrandingToDefaults()`: Resets all branding to default values

### Menu Functions
- `openBrandingDemo()`: Opens the branding demonstration page
- `previewBranding()`: Shows a text preview of current branding

## 🐛 Troubleshooting

**Q: Branding changes don't appear**
A: Refresh your Google Sheets page and reopen the UI component

**Q: Colors look wrong**
A: Ensure you're using valid hex color codes (e.g., #007bff)

**Q: Logo doesn't show**
A: Verify the logo URL is publicly accessible and the image loads

**Q: Branding sheet missing**
A: Run the Complete Setup from the main menu to initialize all sheets

## 🚀 Future Enhancements

- Real-time preview in the editor
- Export/import branding configurations
- Multiple brand themes
- Advanced typography settings
- Dark mode support

---

*This branding system gives you complete control over your application's appearance while maintaining the powerful functionality of the Hybrid Assembler system.*
