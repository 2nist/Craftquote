/**
 * System Validation Test Suite
 * Tests the complete MasterPartsImporter integration
 */

function runSystemValidation() {
  console.log('🔍 Starting System Validation Test...');
  
  try {
    // Test 1: Verify MasterCatalogData is accessible
    console.log('📊 Test 1: Checking MasterCatalogData...');
    if (typeof MASTER_CATALOG_DATA === 'undefined') {
      throw new Error('MASTER_CATALOG_DATA is not defined');
    }
    console.log(`✅ Found ${MASTER_CATALOG_DATA.length} parts in master catalog`);
    
    // Test 2: Verify MasterPartsImporter functions are available
    console.log('🔧 Test 2: Checking MasterPartsImporter functions...');
    if (typeof formatPartsForAI !== 'function') {
      throw new Error('formatPartsForAI function not found');
    }
    if (typeof writePartsToSheet !== 'function') {
      throw new Error('writePartsToSheet function not found');
    }
    console.log('✅ All MasterPartsImporter functions available');
    
    // Test 3: Test formatPartsForAI function
    console.log('🤖 Test 3: Testing formatPartsForAI function...');
    const sampleParts = MASTER_CATALOG_DATA.slice(0, 2); // Test with first 2 parts
    const formattedParts = formatPartsForAI(sampleParts);
    
    if (!Array.isArray(formattedParts)) {
      throw new Error('formatPartsForAI did not return an array');
    }
    if (formattedParts.length === 0) {
      throw new Error('formatPartsForAI returned empty array');
    }
    
    // Verify required fields exist
    const requiredFields = ['partNumber', 'description', 'vendor', 'category', 'unitCost', 'keywords'];
    const firstPart = formattedParts[0];
    for (const field of requiredFields) {
      if (!(field in firstPart)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    console.log('✅ formatPartsForAI function working correctly');
    console.log(`   Sample part: ${firstPart.partNumber} - ${firstPart.description}`);
    console.log(`   Keywords: ${firstPart.keywords.join(', ')}`);
    
    // Test 4: Verify AIBomPatternAnalyzer integration
    console.log('🧠 Test 4: Testing AI BOM Pattern Analyzer integration...');
    if (typeof AIBomPatternAnalyzer !== 'undefined' && typeof AIBomPatternAnalyzer.analyzeBomPatterns === 'function') {
      const analysisResult = AIBomPatternAnalyzer.analyzeBomPatterns(formattedParts);
      console.log('✅ AI BOM Pattern Analyzer integration working');
      console.log(`   Analysis result type: ${typeof analysisResult}`);
    } else {
      console.log('⚠️  AI BOM Pattern Analyzer not available (this is expected if not loaded)');
    }
    
    // Test 5: System Integration Summary
    console.log('📈 Test 5: System Integration Summary...');
    const totalParts = MASTER_CATALOG_DATA.length;
    const categories = [...new Set(MASTER_CATALOG_DATA.map(function(part) { return part.category; }))];
    const vendors = [...new Set(MASTER_CATALOG_DATA.map(function(part) { return part.vendor; }))];
    
    console.log(`✅ System Ready:
      📦 Total Parts: ${totalParts}
      🏷️  Categories: ${categories.length} (${categories.join(', ')})
      🏢 Vendors: ${vendors.length} (${vendors.join(', ')})
      🔄 Format Function: Working
      📋 Sheet Integration: Available
      🤖 AI Analysis: Ready`);
    
    console.log('🎉 All System Validation Tests PASSED!');
    return {
      success: true,
      totalParts: totalParts,
      categories: categories,
      vendors: vendors,
      message: 'System validation completed successfully'
    };
    
  } catch (error) {
    console.error('❌ System Validation FAILED:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'System validation failed - check logs for details'
    };
  }
}

/**
 * Quick test of specific functions
 */
function quickFunctionTest() {
  console.log('⚡ Running Quick Function Test...');
  
  try {
    // Test sample data processing
    const testData = [
      {
        partNumber: 'TEST-001',
        description: '24V DC Motor Drive VFD Variable Frequency',
        vendor: 'TST',
        category: 'VFD',
        unitCost: 450.00
      }
    ];
    
    const result = formatPartsForAI(testData);
    console.log('✅ Quick test passed');
    console.log(`   Generated keywords: ${result[0].keywords.join(', ')}`);
    return result;
    
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
    return null;
  }
}
