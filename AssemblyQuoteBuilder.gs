/**
 * Enhanced Assembly-Based Quote Builder
 * Focuses on Assemblies as primary building blocks with component drill-down
 */

/**
 * Get all available assemblies from Master Catalog
 * Groups components by assembly type
 */
function getAvailableAssemblies() {
  try {
    console.log('🔧 Loading available assemblies from Master Catalog...');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const masterSheet = ss.getSheetByName('Master Catalog');
    
    if (!masterSheet) {
      throw new Error('Master Catalog sheet not found');
    }

    const data = masterSheet.getDataRange().getValues();
    const headers = data[1]; // Row 2 has headers
    
    // Find column indexes
    const columnMap = {
      part: headers.indexOf('PART'),
      description: headers.indexOf('DESCRIPTION'),
      partNumber: headers.indexOf('PART#'),
      cost: headers.indexOf('COST'),
      assembly: headers.indexOf('ASSEMBLY'),
      vendor: headers.indexOf('VNDR'),
      phase: headers.indexOf('PHASE'),
      voltage: headers.indexOf('VOLT'),
      amps: headers.indexOf('AMPS')
    };

    // Group components by assembly
    const assemblies = {};
    
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      const assemblyName = row[columnMap.assembly];
      
      if (assemblyName && assemblyName.trim() !== '') {
        if (!assemblies[assemblyName]) {
          assemblies[assemblyName] = {
            id: generateAssemblyId(assemblyName),
            name: assemblyName,
            components: [],
            totalCost: 0,
            componentCount: 0,
            category: determineAssemblyCategory(assemblyName),
            description: generateAssemblyDescription(assemblyName)
          };
        }
        
        // Add component to assembly
        const component = {
          id: row[columnMap.part],
          name: row[columnMap.description] || row[columnMap.part],
          partNumber: row[columnMap.partNumber],
          cost: parseFloat(row[columnMap.cost]) || 0,
          vendor: row[columnMap.vendor],
          specifications: {
            voltage: row[columnMap.voltage],
            phase: row[columnMap.phase],
            amps: row[columnMap.amps]
          }
        };
        
        assemblies[assemblyName].components.push(component);
        assemblies[assemblyName].totalCost += component.cost;
        assemblies[assemblyName].componentCount++;
      }
    }

    // Convert to array and add popular pre-built assemblies
    const assemblyArray = Object.values(assemblies);
    
    // Add standard automation assemblies
    assemblyArray.push(...getStandardAutomationAssemblies());
    
    console.log(`✅ Found ${assemblyArray.length} assemblies with components`);
    
    return {
      success: true,
      assemblies: assemblyArray,
      totalCount: assemblyArray.length
    };
    
  } catch (error) {
    console.error('❌ Error loading assemblies:', error);
    return {
      success: false,
      error: error.message,
      assemblies: getStandardAutomationAssemblies() // Fallback to standard assemblies
    };
  }
}

/**
 * Get standard automation assemblies that are commonly used
 */
function getStandardAutomationAssemblies() {
  return [
    {
      id: 'MOTOR_CONTROL_BASIC',
      name: 'Basic Motor Control Assembly',
      category: 'Motor Control',
      description: 'Complete motor control solution with contactors, overloads, and disconnect',
      componentCount: 8,
      totalCost: 450,
      components: [
        { id: 'CONT_25A', name: '25A 3-Pole Contactor', cost: 85, partNumber: 'SQD-8910DPA23V09' },
        { id: 'OL_16-25A', name: 'Overload Relay 16-25A', cost: 95, partNumber: 'SQD-LRD325' },
        { id: 'DISC_30A', name: '30A Disconnect Switch', cost: 120, partNumber: 'SQD-H321N' },
        { id: 'FUSE_25A', name: '25A Fuses (3)', cost: 45, partNumber: 'FERR-A25X3' },
        { id: 'AUX_CONT', name: 'Auxiliary Contact Block', cost: 25, partNumber: 'SQD-LADN02' },
        { id: 'PILOT_GRN', name: 'Green Pilot Light', cost: 18, partNumber: 'SQD-XB4BVB3' },
        { id: 'PILOT_RED', name: 'Red Pilot Light', cost: 18, partNumber: 'SQD-XB4BVR4' },
        { id: 'PUSH_START', name: 'Start Pushbutton', cost: 22, partNumber: 'SQD-XB4BA31' },
        { id: 'PUSH_STOP', name: 'Stop Pushbutton', cost: 22, partNumber: 'SQD-XB4BA42' }
      ]
    },
    {
      id: 'VFD_CONTROL_PKG',
      name: 'VFD Control Package',
      category: 'Variable Speed Control',
      description: 'Variable Frequency Drive with bypass and control components',
      componentCount: 12,
      totalCost: 1250,
      components: [
        { id: 'VFD_5HP', name: '5HP Variable Frequency Drive', cost: 485, partNumber: 'ABB-ACS355-03E-08A8-4' },
        { id: 'BYPASS_CONT', name: 'Bypass Contactor', cost: 125, partNumber: 'SQD-8910DPA43V02' },
        { id: 'LINE_REACT', name: 'Line Reactor', cost: 95, partNumber: 'ABB-REACT-5HP' },
        { id: 'DISC_60A', name: '60A Disconnect', cost: 185, partNumber: 'SQD-H362N' }
      ]
    },
    {
      id: 'SAFETY_CIRCUIT',
      name: 'Safety Circuit Assembly',
      category: 'Safety Systems',
      description: 'Complete safety circuit with E-stops, light curtains, and safety relay',
      componentCount: 6,
      totalCost: 680,
      components: [
        { id: 'SAFETY_RELAY', name: 'Safety Relay Module', cost: 245, partNumber: 'PILZ-PNOZ-s3' },
        { id: 'ESTOP_40MM', name: '40mm E-Stop Button', cost: 35, partNumber: 'SQD-XB4BS542' },
        { id: 'LIGHT_CURTAIN', name: 'Safety Light Curtain', cost: 285, partNumber: 'BANNER-EZ-SCREEN' },
        { id: 'SAFETY_GATE', name: 'Safety Gate Switch', cost: 85, partNumber: 'PILZ-PSEN-1.1' }
      ]
    },
    {
      id: 'HMI_PACKAGE',
      name: 'HMI Control Package',
      category: 'Human Machine Interface',
      description: 'Touchscreen HMI with PLC and communication modules',
      componentCount: 4,
      totalCost: 1850,
      components: [
        { id: 'HMI_10IN', name: '10" Color Touchscreen HMI', cost: 685, partNumber: 'SQD-HMIDT551' },
        { id: 'PLC_COMPACT', name: 'Compact PLC 16I/16O', cost: 525, partNumber: 'SQD-TM221C40R' },
        { id: 'COMM_ETH', name: 'Ethernet Communication Module', cost: 185, partNumber: 'SQD-TM4ES4' },
        { id: 'POWER_24V', name: '24V Power Supply', cost: 95, partNumber: 'SQD-ABL8MEM24012' }
      ]
    },
    {
      id: 'TEMP_CONTROL',
      name: 'Temperature Control Assembly',
      category: 'Process Control',
      description: 'Complete temperature control with sensors, controllers, and heater contactors',
      componentCount: 7,
      totalCost: 485,
      components: [
        { id: 'TEMP_CTRL', name: 'PID Temperature Controller', cost: 125, partNumber: 'OMRON-E5CC-RX2ASM-800' },
        { id: 'RTD_SENSOR', name: 'RTD Temperature Sensor', cost: 85, partNumber: 'OMEGA-RTD-2-F3105' },
        { id: 'SSR_40A', name: '40A Solid State Relay', cost: 95, partNumber: 'CRYDOM-D2440-10' },
        { id: 'HEAT_SINK', name: 'SSR Heat Sink', cost: 35, partNumber: 'CRYDOM-HS103DR' }
      ]
    }
  ];
}

/**
 * Get detailed component breakdown for a specific assembly
 */
function getAssemblyDetails(assemblyId) {
  try {
    console.log(`🔍 Getting details for assembly: ${assemblyId}`);
    
    // First check if it's a standard assembly
    const standardAssemblies = getStandardAutomationAssemblies();
    const standardAssembly = standardAssemblies.find(a => a.id === assemblyId);
    
    if (standardAssembly) {
      return {
        success: true,
        assembly: standardAssembly,
        expandedView: true
      };
    }
    
    // Otherwise look in Master Catalog assemblies
    const allAssemblies = getAvailableAssemblies();
    if (allAssemblies.success) {
      const assembly = allAssemblies.assemblies.find(a => a.id === assemblyId);
      if (assembly) {
        return {
          success: true,
          assembly: assembly,
          expandedView: true
        };
      }
    }
    
    throw new Error(`Assembly ${assemblyId} not found`);
    
  } catch (error) {
    console.error('❌ Error getting assembly details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Search assemblies by category, name, or component
 */
function searchAssemblies(searchTerm) {
  try {
    const allAssemblies = getAvailableAssemblies();
    if (!allAssemblies.success) {
      throw new Error('Failed to load assemblies');
    }
    
    const searchLower = searchTerm.toLowerCase();
    const results = allAssemblies.assemblies.filter(assembly => {
      return assembly.name.toLowerCase().includes(searchLower) ||
             assembly.category.toLowerCase().includes(searchLower) ||
             assembly.description.toLowerCase().includes(searchLower) ||
             assembly.components.some(comp => 
               comp.name.toLowerCase().includes(searchLower) ||
               comp.partNumber.toLowerCase().includes(searchLower)
             );
    });
    
    return {
      success: true,
      results: results,
      searchTerm: searchTerm,
      resultCount: results.length
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Helper functions
 */
function generateAssemblyId(assemblyName) {
  return assemblyName.toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .substring(0, 20);
}

function determineAssemblyCategory(assemblyName) {
  const name = assemblyName.toLowerCase();
  
  if (name.includes('motor') || name.includes('drive')) return 'Motor Control';
  if (name.includes('safety') || name.includes('estop')) return 'Safety Systems';
  if (name.includes('hmi') || name.includes('display')) return 'Human Machine Interface';
  if (name.includes('temp') || name.includes('heat')) return 'Process Control';
  if (name.includes('power') || name.includes('supply')) return 'Power Distribution';
  if (name.includes('network') || name.includes('comm')) return 'Communication';
  
  return 'General Assembly';
}

function generateAssemblyDescription(assemblyName) {
  const category = determineAssemblyCategory(assemblyName);
  return `${assemblyName} - Complete ${category.toLowerCase()} solution with all required components`;
}

/**
 * API functions for the frontend
 */
function getAssembliesForQuoteBuilder() {
  return getAvailableAssemblies();
}

function expandAssemblyForQuoteBuilder(assemblyId) {
  return getAssemblyDetails(assemblyId);
}

function searchAssembliesForQuoteBuilder(searchTerm) {
  return searchAssemblies(searchTerm);
}
