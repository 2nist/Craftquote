/**
 * MASTER CATALOG DATA ENTRY HELPER
 * Paste your CSV data here for import into the AI system
 */

/**
 * INSTRUCTIONS FOR USING YOUR MASTER CATALOG:
 * 
 * 1. Copy your CSV data from the Master Catalog file
 * 2. Paste it into the MASTER_CATALOG_DATA array below
 * 3. Run importMasterCatalog() from the menu
 * 4. Your parts will be formatted and ready for AI analysis
 * 
 * The system will preserve:
 * - Part Numbers (exactly as you have them)
 * - Descriptions (cleaned up for consistency) 
 * - Vendors (normalized for better matching)
 * 
 * Plus it will add AI enhancements:
 * - Smart categorization
 * - Keyword extraction
 * - Assembly groupings
 * - Pattern matching preparation
 */

// PASTE YOUR MASTER CATALOG DATA HERE
const MASTER_CATALOG_DATA = [
  // Example format - replace with your actual data
  {
    partNumber: "AB-1756-L83E",
    description: "CompactLogix 5380 Ethernet/IP Controller, 3MB Memory, 31 Local I/O",
    vendor: "Allen-Bradley",
    unitCost: 2850.00
  },
  {
    partNumber: "AB-2711P-T15C4D8", 
    description: "PanelView Plus 7 Performance 15\" Color Touch Screen HMI Terminal",
    vendor: "Allen-Bradley",
    unitCost: 3420.00
  },
  {
    partNumber: "SMC-LER-25DA-S",
    description: "Temperature Sensor RTD Pt100 1/4\" NPT 4-20mA Output",
    vendor: "SMC",
    unitCost: 285.00
  },
  
  // ADD YOUR COMPLETE CATALOG HERE
  // You can copy/paste from Excel or CSV format
  // The system will automatically format everything for AI analysis
];

/**
 * Quick function to load your catalog data
 */
function loadYourMasterCatalog() {
  return MASTER_CATALOG_DATA;
}

/**
 * Utility to help convert CSV to JavaScript format
 * If you need help converting your CSV data
 */
function convertCSVToFormat() {
  SpreadsheetApp.getUi().alert(
    '📋 CSV CONVERSION HELP\n\n' +
    'To convert your CSV data:\n\n' +
    '1. Open your Master Catalog CSV\n' +
    '2. Copy the columns: Part#, Description, Vendor, Cost\n' +
    '3. Use an online CSV-to-JSON converter\n' +
    '4. Paste the result into MASTER_CATALOG_DATA\n\n' +
    'Or contact support for conversion assistance.\n\n' +
    '🤖 The AI system will handle all the formatting\n' +
    'and categorization automatically!'
  );
}

/**
 * Sample data generator for testing
 * This creates realistic sample data based on your industry
 */
function generateSampleCatalogData() {
  return [
    // Control System Components
    {
      partNumber: "AB-1756-L83E",
      description: "CompactLogix 5380 Ethernet/IP Controller, 3MB Memory",
      vendor: "Allen-Bradley",
      unitCost: 2850.00
    },
    {
      partNumber: "AB-2711P-T15C4D8",
      description: "PanelView Plus 7 Performance 15\" Color Touch HMI Terminal",
      vendor: "Allen-Bradley", 
      unitCost: 3420.00
    },
    {
      partNumber: "AB-1756-IB16",
      description: "ControlLogix 16-Point Digital Input Module 24VDC",
      vendor: "Allen-Bradley",
      unitCost: 485.00
    },
    {
      partNumber: "AB-1756-OB16E",
      description: "ControlLogix 16-Point Digital Output Module 24VDC",
      vendor: "Allen-Bradley",
      unitCost: 675.00
    },
    
    // Field Devices
    {
      partNumber: "SMC-LER-25DA-S",
      description: "Temperature Sensor RTD Pt100 1/4\" NPT 4-20mA Output",
      vendor: "SMC",
      unitCost: 285.00
    },
    {
      partNumber: "WIKA-S-20",
      description: "Pressure Transmitter 0-100 PSI 4-20mA 316SS",
      vendor: "WIKA",
      unitCost: 445.00
    },
    {
      partNumber: "E+H-FMU90-R11CA111AA3A",
      description: "Ultrasonic Level Transmitter 4-20mA Hart",
      vendor: "Endress+Hauser",
      unitCost: 1250.00
    },
    
    // Valves and Actuators
    {
      partNumber: "BSV-316-2-150-EP",
      description: "Ball Valve 2\" 316SS 150# Flanged Ends Electric Actuator",
      vendor: "BuTech",
      unitCost: 1680.00
    },
    {
      partNumber: "FV-316-1.5-TC-P",
      description: "Control Valve 1.5\" 316SS Tri-Clamp Pneumatic",
      vendor: "Flowserve",
      unitCost: 985.00
    },
    
    // VFDs and Motor Control
    {
      partNumber: "AB-25B-D013N104",
      description: "PowerFlex 525 VFD 5HP 480V 3-Phase IP20",
      vendor: "Allen-Bradley",
      unitCost: 875.00
    },
    {
      partNumber: "SE-ATS48D17Q",
      description: "Soft Starter 17A 7.5HP 480V 3-Phase",
      vendor: "Schneider Electric",
      unitCost: 425.00
    },
    
    // Power Distribution
    {
      partNumber: "SQ-QO320",
      description: "Circuit Breaker 3-Pole 20A 240V QO Series",
      vendor: "Square D",
      unitCost: 95.00
    },
    {
      partNumber: "AB-1606-XLS960E-3",
      description: "Power Supply 24VDC 20A DIN Rail Mount",
      vendor: "Allen-Bradley",
      unitCost: 385.00
    },
    
    // Enclosures
    {
      partNumber: "HMN-SC242010CHSS",
      description: "Enclosure 24\"x20\"x10\" SS316 Hinged Cover IP65",
      vendor: "Hammond",
      unitCost: 1250.00
    },
    
    // Wiring and Connectivity  
    {
      partNumber: "BELDEN-9841-100",
      description: "Instrumentation Cable 18AWG 2-Conductor Shielded 100ft",
      vendor: "Belden",
      unitCost: 285.00
    },
    {
      partNumber: "PH-1734-AENT",
      description: "EtherNet/IP Adapter Point I/O Series",
      vendor: "Allen-Bradley",
      unitCost: 385.00
    },
    
    // Process Specific - Brewing/Distillery
    {
      partNumber: "JULABO-CF31",
      description: "Recirculating Chiller -30°C to +200°C 1.5kW Cooling",
      vendor: "JULABO",
      unitCost: 4250.00
    },
    {
      partNumber: "TC-PROBE-12-RTD",
      description: "Temperature Probe RTD Pt100 12\" Insertion 316SS",
      vendor: "ThermoCouple",
      unitCost: 165.00
    }
  ];
}
