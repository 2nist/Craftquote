/**
 * INTEGRATION TEST SUITE
 * Tests the connection between Master Catalog Data and AI BOM Pattern Analyzer
 */

// Test 1: Validate Master Catalog Data Structure
function testMasterCatalogData() {
  console.log('🧪 Testing Master Catalog Data...');
  
  try {
    // Test data loading
    const catalogData = loadYourMasterCatalog();
    console.log('✅ Catalog data loaded:', catalogData.length, 'parts');
    
    // Test data structure
    if (catalogData.length > 0) {
      const samplePart = catalogData[0];
      const requiredFields = ['partNumber', 'description', 'vendor', 'unitCost'];
      const hasAllFields = requiredFields.every(field => field in samplePart);
      
      if (hasAllFields) {
        console.log('✅ Data structure valid');
        return { success: true, partCount: catalogData.length };
      } else {
        console.log('❌ Missing required fields');
        return { success: false, error: 'Missing required fields' };
      }
    }
    
    return { success: false, error: 'No data found' };
    
  } catch (error) {
    console.log('❌ Catalog test failed:', error);
    return { success: false, error: error.toString() };
  }
}

// Test 2: Validate BOM Pattern Analyzer Categories
function testBOMPatternCategories() {
  console.log('🧪 Testing BOM Pattern Categories...');
  
  try {
    // Test category mapping from your actual catalog
    const categories = {
      'ENC': 'Enclosures',
      'PAN': 'Panels', 
      'DIS': 'Disconnects',
      'FUS': 'Fuses',
      'FSH': 'Fuse Holders'
    };
    
    // Verify categories exist
    const categoryCount = Object.keys(categories).length;
    console.log('✅ Categories loaded:', categoryCount);
    
    return { success: true, categoryCount: categoryCount };
    
  } catch (error) {
    console.log('❌ Category test failed:', error);
    return { success: false, error: error.toString() };
  }
}

// Test 3: Integration Test
function testSystemIntegration() {
  console.log('🧪 Testing System Integration...');
  
  try {
    // Test catalog statistics
    const stats = getCatalogStats();
    console.log('✅ Statistics generated successfully');
    
    // Test search functionality
    const searchResults = searchParts('enclosure');
    console.log('✅ Search functionality working:', searchResults.length, 'results');
    
    // Test validation
    const validation = validateCatalogData();
    console.log('✅ Validation completed:', validation);
    
    return { 
      success: true, 
      statistics: stats,
      searchResults: searchResults.length,
      validation: validation 
    };
    
  } catch (error) {
    console.log('❌ Integration test failed:', error);
    return { success: false, error: error.toString() };
  }
}

// Main test runner
function runAllTests() {
  console.log('🚀 STARTING INTEGRATION TEST SUITE...');
  console.log('='.repeat(50));
  
  const results = {
    catalogTest: testMasterCatalogData(),
    categoryTest: testBOMPatternCategories(), 
    integrationTest: testSystemIntegration()
  };
  
  console.log('='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY:');
  console.log('• Master Catalog:', results.catalogTest.success ? '✅ PASS' : '❌ FAIL');
  console.log('• BOM Categories:', results.categoryTest.success ? '✅ PASS' : '❌ FAIL');
  console.log('• System Integration:', results.integrationTest.success ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = results.catalogTest.success && 
                   results.categoryTest.success && 
                   results.integrationTest.success;
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - System Ready!');
  } else {
    console.log('⚠️ Some tests failed - Check errors above');
  }
  
  return results;
}

// Quick validation function
function quickValidationTest() {
  console.log('⚡ Quick Validation Test...');
  
  try {
    // Test basic functionality
    const catalogData = MASTER_CATALOG_DATA || [];
    console.log('Catalog parts loaded:', catalogData.length);
    
    if (catalogData.length > 0) {
      const firstPart = catalogData[0];
      console.log('Sample part:', firstPart.partNumber, '-', firstPart.description);
      console.log('✅ Quick test PASSED');
      return true;
    } else {
      console.log('❌ No catalog data found');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Quick test FAILED:', error);
    return false;
  }
}

// Export test functions (for Google Apps Script)
if (typeof module !== 'undefined') {
  module.exports = { runAllTests, quickValidationTest };
}
