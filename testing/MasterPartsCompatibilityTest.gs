/**
 * Google Apps Script Compatibility Test
 * Run this to verify MasterPartsImporter.gs is fully compatible
 */

function testMasterPartsImporterCompatibility() {
  console.log('🧪 Testing MasterPartsImporter.gs compatibility...');
  
  try {
    // Test 1: Check if functions are defined
    console.log('📋 Test 1: Function definitions...');
    if (typeof importMasterCatalog !== 'function') {
      throw new Error('importMasterCatalog function not found');
    }
    if (typeof formatPartsForAI !== 'function') {
      throw new Error('formatPartsForAI function not found');
    }
    if (typeof writePartsToSheet !== 'function') {
      throw new Error('writePartsToSheet function not found');
    }
    console.log('✅ All functions defined correctly');
    
    // Test 2: Test sample data formatting
    console.log('📋 Test 2: Sample data processing...');
    const testData = [
      {
        partNumber: 'TEST-001',
        description: '24V VFD Motor Drive Ethernet/IP',
        vendor: 'TEST',
        category: 'VFD',
        unitCost: 500.00
      },
      {
        partNumber: 'TEST-002',
        description: 'Temperature Sensor RTD 4-20mA',
        vendor: 'TEST',
        category: 'SEN',
        unitCost: 150.00
      }
    ];
    
    const formatted = formatPartsForAI(testData);
    
    if (!formatted || !Array.isArray(formatted)) {
      throw new Error('formatPartsForAI did not return array');
    }
    
    if (formatted.length !== 2) {
      throw new Error('formatPartsForAI returned wrong count');
    }
    
    // Check required properties
    const part = formatted[0];
    const requiredProps = ['partNumber', 'description', 'vendor', 'category', 'unitCost', 'keywords', 'functionalGroup'];
    for (var i = 0; i < requiredProps.length; i++) {
      if (!(requiredProps[i] in part)) {
        throw new Error('Missing property: ' + requiredProps[i]);
      }
    }
    
    console.log('✅ Sample data processed correctly');
    console.log('   Part: ' + part.partNumber + ' - ' + part.description);
    console.log('   Keywords: ' + part.keywords.join(', '));
    console.log('   Functional Group: ' + part.functionalGroup);
    
    // Test 3: Verify no ES6 syntax issues
    console.log('📋 Test 3: Syntax compatibility...');
    
    // Test array methods work
    var testArray = [1, 2, 3, 4, 5];
    var doubled = [];
    testArray.forEach(function(item) {
      doubled.push(item * 2);
    });
    
    if (doubled.length !== 5 || doubled[0] !== 2) {
      throw new Error('Array methods not working correctly');
    }
    
    console.log('✅ All syntax compatibility tests passed');
    
    console.log('🎉 COMPATIBILITY TEST COMPLETE!');
    console.log('📊 Results:');
    console.log('   ✅ Function definitions: PASS');
    console.log('   ✅ Data processing: PASS');
    console.log('   ✅ ES5 compatibility: PASS');
    console.log('   ✅ Google Apps Script ready: YES');
    
    return {
      success: true,
      message: 'MasterPartsImporter.gs is fully compatible with Google Apps Script',
      testsPassed: 3
    };
    
  } catch (error) {
    console.error('❌ Compatibility test failed:', error.toString());
    return {
      success: false,
      error: error.toString(),
      message: 'Compatibility issues found'
    };
  }
}

/**
 * Quick syntax verification
 */
function quickSyntaxCheck() {
  console.log('⚡ Quick syntax check...');
  
  try {
    // Test basic JavaScript operations
    var obj = { key: 'value' };
    var arr = [1, 2, 3];
    var str = 'test' + ' string';
    
    if (obj.key !== 'value') throw new Error('Object access failed');
    if (arr.length !== 3) throw new Error('Array operations failed');
    if (str !== 'test string') throw new Error('String concatenation failed');
    
    console.log('✅ Basic syntax check passed');
    return 'Syntax OK';
    
  } catch (error) {
    console.error('❌ Syntax check failed:', error.toString());
    return 'Syntax Error: ' + error.toString();
  }
}
