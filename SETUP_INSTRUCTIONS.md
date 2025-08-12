# Setting Up Hybrid Component Assembler in Google Sheets

## Step-by-Step Instructions:

### 1. Open Your Master Catalog Google Sheet
- Go to your Master Catalog sheet in Google Sheets
- This is where your real component data is stored

### 2. Open Apps Script Editor
- Click **Extensions** → **Apps Script**
- This opens the Google Apps Script editor

### 3. Create the HTML File
- In Apps Script editor, click **File** → **New** → **HTML file**
- Name it: `HybridComponentAssembler`
- Copy the entire content from your HybridComponentAssembler.html file
- Paste it into this new HTML file

### 4. Add the Backend Script
- The HybridAssemblerBackend.gs file should already be in your project
- If not, create a new Script file and paste the backend code

### 5. Create a Menu Function
Add this to your Apps Script project:

```javascript
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 Component Assembler')
    .addItem('Open Hybrid Quote Builder', 'openHybridAssembler')
    .addToUi();
}

function openHybridAssembler() {
  const html = HtmlService.createTemplateFromFile('HybridComponentAssembler')
    .evaluate()
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Hybrid Component Assembler - Live Master Catalog Data');
    
  SpreadsheetApp.getUi().showModalDialog(html, 'Component Assembler');
}
```

### 6. Deploy and Test
- Save your project
- Refresh your Google Sheet
- You should see a "🔧 Component Assembler" menu
- Click it → "Open Hybrid Quote Builder"
- This will load with REAL data from your Master Catalog!

## Benefits of Google Sheets Integration:
✅ Real-time access to Master Catalog data
✅ Actual prices from your spreadsheet  
✅ Live component information
✅ Manual links from Column P
✅ Quote generation directly to sheets
