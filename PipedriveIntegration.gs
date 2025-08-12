/**
 * Pipedrive Integration for CraftQuote
 * Automates quote creation, deal tracking, and branding synchronization
 */

// Pipedrive Configuration
const PIPEDRIVE_CONFIG = {
  apiToken: '', // Will be set from script properties
  companyDomain: '', // Will be set from script properties
  endpoints: {
    deals: '/api/v1/deals',
    persons: '/api/v1/persons',
    organizations: '/api/v1/organizations',
    products: '/api/v1/products',
    dealFields: '/api/v1/dealFields',
    activities: '/api/v1/activities'
  }
};

/**
 * Initialize Pipedrive integration
 */
function initializePipedriveIntegration() {
  try {
    const properties = PropertiesService.getScriptProperties();
    PIPEDRIVE_CONFIG.apiToken = properties.getProperty('PIPEDRIVE_API_TOKEN');
    PIPEDRIVE_CONFIG.companyDomain = properties.getProperty('PIPEDRIVE_COMPANY_DOMAIN');
    
    if (!PIPEDRIVE_CONFIG.apiToken || !PIPEDRIVE_CONFIG.companyDomain) {
      throw new Error('Pipedrive credentials not configured. Run setupPipedriveCredentials() first.');
    }
    
    // Create custom fields for CraftQuote integration
    setupCraftQuoteCustomFields();
    
    Logger.log('✅ Pipedrive integration initialized');
    return true;
    
  } catch (error) {
    Logger.log('❌ Error initializing Pipedrive integration: ' + error.toString());
    return false;
  }
}

/**
 * Setup custom fields in Pipedrive for CraftQuote
 */
function setupCraftQuoteCustomFields() {
  const customFields = [
    {
      name: 'CraftQuote Number',
      key: 'craftquote_number',
      field_type: 'varchar',
      options: []
    },
    {
      name: 'Quote Status',
      key: 'quote_status',
      field_type: 'enum',
      options: [
        { label: 'Draft' },
        { label: 'Pending Review' },
        { label: 'Sent to Customer' },
        { label: 'Approved' },
        { label: 'Rejected' },
        { label: 'Converted to Order' }
      ]
    },
    {
      name: 'Product Category',
      key: 'product_category',
      field_type: 'enum',
      options: [
        { label: 'BHAC - Brewery Automated Control' },
        { label: 'DTAC - Distillery Temperature Control' },
        { label: 'CPAC - CIP Automated Control' },
        { label: 'GHAC - Grain Handling Control' },
        { label: 'AGAC - Advanced Grain Control' }
      ]
    },
    {
      name: 'Quote Total Value',
      key: 'quote_total_value',
      field_type: 'monetary',
      options: []
    },
    {
      name: 'Components Count',
      key: 'components_count',
      field_type: 'int',
      options: []
    },
    {
      name: 'Quote Configuration',
      key: 'quote_config',
      field_type: 'text',
      options: []
    },
    {
      name: 'Branding Theme',
      key: 'branding_theme',
      field_type: 'varchar',
      options: []
    }
  ];
  
  customFields.forEach(field => {
    createPipedriveCustomField(field);
  });
}

/**
 * Create a custom field in Pipedrive
 */
function createPipedriveCustomField(fieldConfig) {
  try {
    const url = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.dealFields}?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    const payload = {
      name: fieldConfig.name,
      key: fieldConfig.key,
      field_type: fieldConfig.field_type,
      add_visible_flag: true
    };
    
    // Add options for enum fields
    if (fieldConfig.options && fieldConfig.options.length > 0) {
      payload.options = fieldConfig.options;
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 201 && responseData.success) {
      Logger.log(`✅ Custom field "${fieldConfig.name}" created successfully`);
      return responseData.data;
    } else if (responseData.error && responseData.error.includes('already exists')) {
      Logger.log(`ℹ️ Custom field "${fieldConfig.name}" already exists`);
      return null;
    } else {
      throw new Error(`Failed to create field: ${responseData.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    Logger.log(`❌ Error creating custom field "${fieldConfig.name}": ` + error.toString());
    return null;
  }
}

/**
 * Create a new deal in Pipedrive from CraftQuote data
 */
function createPipedriveDealFromQuote(quoteData) {
  try {
    if (!initializePipedriveIntegration()) {
      throw new Error('Pipedrive integration not properly configured');
    }
    
    const url = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.deals}?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    // Prepare deal data
    const dealPayload = {
      title: `${quoteData.quoteNumber} - ${quoteData.customerName || 'New Quote'}`,
      value: quoteData.totalValue || 0,
      currency: 'USD',
      status: 'open',
      stage_id: 1, // You'll need to set the appropriate stage ID
      // Custom fields
      'craftquote_number': quoteData.quoteNumber,
      'quote_status': 'Draft',
      'product_category': quoteData.productCategory,
      'quote_total_value': quoteData.totalValue,
      'components_count': quoteData.components ? quoteData.components.length : 0,
      'quote_config': JSON.stringify(quoteData.configuration),
      'branding_theme': quoteData.brandingTheme || 'Default'
    };
    
    // Add person/organization if provided
    if (quoteData.customerEmail) {
      const person = findOrCreatePerson(quoteData.customerName, quoteData.customerEmail);
      if (person) {
        dealPayload.person_id = person.id;
      }
    }
    
    if (quoteData.companyName) {
      const organization = findOrCreateOrganization(quoteData.companyName);
      if (organization) {
        dealPayload.org_id = organization.id;
      }
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(dealPayload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 201 && responseData.success) {
      Logger.log('✅ Deal created in Pipedrive:', responseData.data.id);
      
      // Create follow-up activity
      createFollowUpActivity(responseData.data.id, quoteData.quoteNumber);
      
      return {
        success: true,
        dealId: responseData.data.id,
        dealUrl: `https://${PIPEDRIVE_CONFIG.companyDomain}/deal/${responseData.data.id}`
      };
    } else {
      throw new Error(`Failed to create deal: ${responseData.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    Logger.log('❌ Error creating Pipedrive deal: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Update deal status in Pipedrive
 */
function updatePipedriveDealStatus(dealId, status, notes) {
  try {
    const url = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.deals}/${dealId}?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    const updatePayload = {
      'quote_status': status
    };
    
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(updatePayload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 200 && responseData.success) {
      Logger.log(`✅ Deal ${dealId} status updated to: ${status}`);
      
      // Add note if provided
      if (notes) {
        addNoteToDeal(dealId, notes);
      }
      
      return { success: true };
    } else {
      throw new Error(`Failed to update deal: ${responseData.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    Logger.log('❌ Error updating Pipedrive deal: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Find or create a person in Pipedrive
 */
function findOrCreatePerson(name, email) {
  try {
    // First, try to find existing person by email
    const searchUrl = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.persons}/search?term=${encodeURIComponent(email)}&api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    let response = UrlFetchApp.fetch(searchUrl);
    let responseData = JSON.parse(response.getContentText());
    
    if (responseData.success && responseData.data && responseData.data.items.length > 0) {
      Logger.log(`✅ Found existing person: ${name}`);
      return responseData.data.items[0].item;
    }
    
    // Person not found, create new one
    const createUrl = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.persons}?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    const personPayload = {
      name: name,
      email: [{ value: email, primary: true }]
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(personPayload)
    };
    
    response = UrlFetchApp.fetch(createUrl, options);
    responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 201 && responseData.success) {
      Logger.log(`✅ Created new person: ${name}`);
      return responseData.data;
    }
    
    return null;
    
  } catch (error) {
    Logger.log('❌ Error handling person in Pipedrive: ' + error.toString());
    return null;
  }
}

/**
 * Find or create an organization in Pipedrive
 */
function findOrCreateOrganization(companyName) {
  try {
    // Search for existing organization
    const searchUrl = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.organizations}/search?term=${encodeURIComponent(companyName)}&api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    let response = UrlFetchApp.fetch(searchUrl);
    let responseData = JSON.parse(response.getContentText());
    
    if (responseData.success && responseData.data && responseData.data.items.length > 0) {
      Logger.log(`✅ Found existing organization: ${companyName}`);
      return responseData.data.items[0].item;
    }
    
    // Organization not found, create new one
    const createUrl = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.organizations}?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    const orgPayload = {
      name: companyName
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(orgPayload)
    };
    
    response = UrlFetchApp.fetch(createUrl, options);
    responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 201 && responseData.success) {
      Logger.log(`✅ Created new organization: ${companyName}`);
      return responseData.data;
    }
    
    return null;
    
  } catch (error) {
    Logger.log('❌ Error handling organization in Pipedrive: ' + error.toString());
    return null;
  }
}

/**
 * Create a follow-up activity
 */
function createFollowUpActivity(dealId, quoteNumber) {
  try {
    const url = `https://${PIPEDRIVE_CONFIG.companyDomain}${PIPEDRIVE_CONFIG.endpoints.activities}?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    const activityPayload = {
      subject: `Follow up on quote ${quoteNumber}`,
      type: 'call',
      deal_id: dealId,
      due_date: getFormattedDate(3), // 3 days from now
      note: `Follow up on CraftQuote ${quoteNumber}. Check if customer has any questions or needs modifications.`
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(activityPayload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() === 201) {
      Logger.log(`✅ Follow-up activity created for deal ${dealId}`);
    }
    
  } catch (error) {
    Logger.log('❌ Error creating follow-up activity: ' + error.toString());
  }
}

/**
 * Add a note to a deal
 */
function addNoteToDeal(dealId, noteContent) {
  try {
    const url = `https://${PIPEDRIVE_CONFIG.companyDomain}/api/v1/notes?api_token=${PIPEDRIVE_CONFIG.apiToken}`;
    
    const notePayload = {
      content: noteContent,
      deal_id: dealId
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(notePayload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() === 201) {
      Logger.log(`✅ Note added to deal ${dealId}`);
    }
    
  } catch (error) {
    Logger.log('❌ Error adding note to deal: ' + error.toString());
  }
}

/**
 * Setup Pipedrive credentials
 */
function setupPipedriveCredentials() {
  const properties = PropertiesService.getScriptProperties();
  
  // You need to set these with your actual Pipedrive credentials
  properties.setProperties({
    'PIPEDRIVE_API_TOKEN': 'YOUR_PIPEDRIVE_API_TOKEN_HERE',
    'PIPEDRIVE_COMPANY_DOMAIN': 'YOUR_COMPANY.pipedrive.com'
  });
  
  Logger.log('✅ Pipedrive credentials configured. Please update with actual values.');
}

/**
 * Utility function to get formatted date
 */
function getFormattedDate(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/**
 * Test Pipedrive integration
 */
function testPipedriveIntegration() {
  try {
    Logger.log('🧪 Testing Pipedrive integration...');
    
    // Test quote data
    const testQuoteData = {
      quoteNumber: 'CQ240811BHAC001CA-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@brewery.com',
      companyName: 'Test Brewery Inc',
      productCategory: 'BHAC - Brewery Automated Control',
      totalValue: 25000,
      components: ['PLC System', 'Temperature Sensors', 'Control Panel'],
      configuration: { template: 'BHAC_Standard' },
      brandingTheme: 'Default'
    };
    
    // Test deal creation
    const result = createPipedriveDealFromQuote(testQuoteData);
    
    if (result.success) {
      Logger.log('✅ Test deal created successfully:', result.dealId);
      Logger.log('Deal URL:', result.dealUrl);
      
      // Test status update
      updatePipedriveDealStatus(result.dealId, 'Pending Review', 'Quote created via CraftQuote automation');
      
      Logger.log('🎉 Pipedrive integration test completed successfully!');
    } else {
      Logger.log('❌ Test failed:', result.error);
    }
    
  } catch (error) {
    Logger.log('❌ Pipedrive integration test failed: ' + error.toString());
  }
}
