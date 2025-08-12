# 🚀 CraftQuote Automation Setup Guide

## Overview
This guide will help you set up complete automation between CraftQuote, Google Sheets, Google Apps Script, and Pipedrive.

## 🏗️ Architecture Overview

```
CraftQuote Web Interface
    ↓
Google Apps Script (Backend)
    ↓
Google Sheets (Data Storage)
    ↓
Pipedrive API (CRM Integration)
    ↓
Notifications (Email/Slack)
```

## 📋 Prerequisites

1. **Google Account** with access to:
   - Google Sheets
   - Google Apps Script
   - Gmail (for notifications)

2. **Pipedrive Account** with:
   - API access enabled
   - Admin permissions to create custom fields

3. **Optional Integrations:**
   - Slack workspace (for notifications)
   - Custom domain (for webhook endpoints)

## ⚙️ Step-by-Step Setup

### Step 1: Google Apps Script Project Setup

1. **Create New Apps Script Project:**
   ```
   1. Go to script.google.com
   2. Click "New Project"
   3. Name it "CraftQuote Automation"
   ```

2. **Upload Script Files:**
   - Copy all `.gs` files from this project into the Apps Script editor
   - Save the project

3. **Enable Required APIs:**
   ```
   1. Click on "Services" (+ icon)
   2. Add: Sheets API, Gmail API, Drive API
   3. Save
   ```

### Step 2: Google Sheets Configuration

1. **Create Configuration Sheets:**
   ```javascript
   // Run this function in Apps Script
   function setupAllSheets() {
     initializeBrandingSheet();
     // This will create the branding configuration sheet
   }
   ```

2. **Set Sheet IDs in Script Properties:**
   ```javascript
   function configureSheetIds() {
     const properties = PropertiesService.getScriptProperties();
     properties.setProperties({
       'BRANDING_SHEET_ID': 'YOUR_BRANDING_SHEET_ID',
       'QUOTES_SHEET_ID': 'YOUR_QUOTES_SHEET_ID',
       'AUDIT_SHEET_ID': 'YOUR_AUDIT_SHEET_ID'
     });
   }
   ```

### Step 3: Pipedrive Integration Setup

1. **Get Pipedrive API Token:**
   ```
   1. In Pipedrive: Settings → Personal → API
   2. Copy your API token
   3. Note your company domain (e.g., yourcompany.pipedrive.com)
   ```

2. **Configure Pipedrive Credentials:**
   ```javascript
   function setupPipedriveCredentials() {
     const properties = PropertiesService.getScriptProperties();
     properties.setProperties({
       'PIPEDRIVE_API_TOKEN': 'YOUR_API_TOKEN_HERE',
       'PIPEDRIVE_COMPANY_DOMAIN': 'yourcompany.pipedrive.com'
     });
   }
   ```

3. **Initialize Pipedrive Custom Fields:**
   ```javascript
   // Run this function to create custom fields in Pipedrive
   initializePipedriveIntegration();
   ```

### Step 4: Web Interface Deployment

1. **Deploy as Web App:**
   ```
   1. In Apps Script: Deploy → New Deployment
   2. Type: Web App
   3. Execute as: Me
   4. Who has access: Anyone with the link
   5. Deploy and copy the URL
   ```

2. **Update HTML Files:**
   - Upload `HybridComponentAssembler.html`
   - Upload `BrandingEditor.html`
   - Configure the web app URLs

### Step 5: Automation Triggers

1. **Set Up Triggers:**
   ```javascript
   function setupAutomationTriggers() {
     // Creates hourly trigger for processing
     setupAutomationTriggers();
   }
   ```

2. **Configure Notifications:**
   ```javascript
   function configureNotifications() {
     const properties = PropertiesService.getScriptProperties();
     properties.setProperties({
       'SLACK_WEBHOOK_URL': 'https://hooks.slack.com/YOUR_WEBHOOK',
       'NOTIFICATION_EMAIL': 'admin@yourcompany.com'
     });
   }
   ```

## 🔧 Configuration Files

### Script Properties Configuration
```javascript
{
  // Pipedrive Integration
  'PIPEDRIVE_API_TOKEN': 'your_pipedrive_token',
  'PIPEDRIVE_COMPANY_DOMAIN': 'yourcompany.pipedrive.com',
  
  // Google Sheets
  'BRANDING_SHEET_ID': 'sheet_id_for_branding_config',
  'QUOTES_SHEET_ID': 'sheet_id_for_quotes_database',
  'AUDIT_SHEET_ID': 'sheet_id_for_audit_trail',
  
  // Notifications
  'SLACK_WEBHOOK_URL': 'slack_webhook_url',
  'NOTIFICATION_EMAIL': 'notifications@yourcompany.com'
}
```

### Google Sheets Structure

#### Branding Configuration Sheet
| Section | Key | Value | Description | Last Modified | Modified By |
|---------|-----|-------|-------------|---------------|-------------|
| App | name | CraftQuote | Application name | 2024-08-11 | user@email.com |
| Colors | primary | #4a90e2 | Primary color | 2024-08-11 | user@email.com |

#### Quotes Database Sheet
| Quote Number | Date | Customer | Email | Company | Category | Value | Status |
|-------------|------|----------|-------|---------|----------|--------|--------|
| CQ240811... | 2024-08-11 | John Doe | john@... | Brewery Inc | BHAC | $25,000 | Draft |

## 🎯 Usage Workflows

### Workflow 1: Create New Quote
```javascript
// From the web interface, this automatically:
1. Generates quote number
2. Saves to Google Sheets
3. Creates Pipedrive deal
4. Sends notifications
5. Logs to audit trail
```

### Workflow 2: Update Branding
```javascript
// From branding editor:
1. Update configuration in sheets
2. Sync to all active quotes
3. Update Pipedrive custom fields
4. Notify team of changes
```

### Workflow 3: Quote Status Updates
```javascript
// Automated pipeline:
1. Monitor quote changes
2. Update Pipedrive deal stages
3. Trigger follow-up activities
4. Send status notifications
```

## 🧪 Testing Your Setup

### Test 1: Basic Configuration
```javascript
function testBasicSetup() {
  testBrandingIntegration();
  // Should complete without errors
}
```

### Test 2: Pipedrive Integration
```javascript
function testPipedriveSetup() {
  testPipedriveIntegration();
  // Should create a test deal
}
```

### Test 3: Complete Workflow
```javascript
function testFullWorkflow() {
  testCompleteWorkflow();
  // Should process end-to-end
}
```

## 🔒 Security Best Practices

1. **API Token Security:**
   - Store tokens in Script Properties (encrypted)
   - Never hardcode tokens in scripts
   - Rotate tokens regularly

2. **Access Control:**
   - Limit web app access appropriately
   - Use OAuth for sensitive operations
   - Monitor audit logs regularly

3. **Data Protection:**
   - Enable Google Sheets encryption
   - Use HTTPS for all communications
   - Implement proper error handling

## 🚀 Advanced Automations

### 1. Automatic Quote Generation from Pipedrive Deals
```javascript
function createQuoteFromPipedriveDeal(dealId) {
  // Pulls deal data from Pipedrive
  // Generates quote automatically
  // Updates deal with quote information
}
```

### 2. Smart Component Recommendations
```javascript
function generateSmartRecommendations(quoteData) {
  // Analyzes past quotes
  // Suggests relevant components
  // Calculates optimal pricing
}
```

### 3. Automated Follow-up Sequences
```javascript
function setupFollowupSequence(quoteNumber) {
  // Creates timed follow-up activities
  // Sends automated reminders
  // Tracks customer engagement
}
```

## 📊 Monitoring & Analytics

### Dashboard Queries
```javascript
// Get quote conversion rates
function getQuoteAnalytics() {
  // Returns conversion metrics
  // Pipeline analysis
  // Performance statistics
}
```

### Error Monitoring
```javascript
// Automated error reporting
function monitorSystemHealth() {
  // Checks all integrations
  // Reports failures
  // Suggests fixes
}
```

## 🆘 Troubleshooting

### Common Issues:

1. **"API Token Invalid"**
   - Verify token in Script Properties
   - Check Pipedrive API access
   - Regenerate token if needed

2. **"Sheet Not Found"**
   - Run initialization functions
   - Check sheet IDs in properties
   - Verify sharing permissions

3. **"Trigger Failed"**
   - Check Apps Script quotas
   - Review error logs
   - Re-create triggers if needed

### Debug Functions:
```javascript
// Check all configurations
function debugSystemStatus() {
  // Reports on all integrations
  // Lists any issues found
  // Provides fix suggestions
}
```

## 🎯 Next Steps

After setup is complete:

1. **Train your team** on the new workflow
2. **Import existing data** from your current system
3. **Set up monitoring** and alerts
4. **Customize branding** for your company
5. **Test thoroughly** before going live

## 📞 Support

For technical support:
1. Check the error logs in Apps Script
2. Review the audit trail in Google Sheets  
3. Consult the Pipedrive API documentation
4. Contact your system administrator

---

*This automation system will transform your quote-to-deal process, saving time and reducing errors while maintaining full visibility into your sales pipeline.*
