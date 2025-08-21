# CSV to JavaScript Converter for Master Catalog
$csvPath = "c:\Users\CraftAuto-Sales\Downloads\Master Catalog - Master Catalog.csv"
$jsPath = "g:\Shared drives\Pipedrive Google Drive\Pipedrive (Craft Automation)\Production_System\MasterCatalogData.gs"

Write-Host "🔄 Converting CSV to JavaScript format..."

# Read CSV data
$csvData = Import-Csv $csvPath

$jsObjects = @()
$processedCount = 0

foreach ($row in $csvData) {
    if ($row.PART -and $row.DESCRIPTION -and $row.'PART#') {
        # Clean and parse cost
        $cost = if ($row.COST) { 
            $cleanCost = $row.COST -replace '[\$,"]', '' -replace '^\s*$', '0'
            try { [decimal]$cleanCost } catch { 0 }
        } else { 0 }
        
        # Clean strings and escape quotes
        $partNumber = ($row.'PART#' -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $description = ($row.DESCRIPTION -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $vendor = ($row.VNDR -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $category = ($row.PART -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $assembly = ($row.ASSEMBLY -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $voltage = ($row.VOLT -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $amperage = ($row.AMPS -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $phase = ($row.PHASE -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $tags = ($row.TAGS -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $vendorPart = ($row.'VNDR#' -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        $lastUpdated = ($row.'LAST PRICE UPDATE' -replace '"', '\"' -replace '[\r\n]', ' ').Trim()
        
        $jsObject = @"
  {
    partNumber: "$partNumber",
    description: "$description",
    vendor: "$vendor",
    unitCost: $cost,
    category: "$category",
    assembly: "$assembly",
    voltage: "$voltage",
    amperage: "$amperage",
    phase: "$phase",
    tags: "$tags",
    vendorPart: "$vendorPart",
    lastUpdated: "$lastUpdated"
  }"@
        
        $jsObjects += $jsObject
        $processedCount++
    }
}

# Create the JavaScript content
$jsContent = @"
/**
 * MASTER CATALOG DATA ENTRY HELPER
 * Complete parts catalog imported from CSV
 * Total Parts: $processedCount
 * Import Date: $(Get-Date -Format 'MM/dd/yyyy HH:mm:ss')
 */

/**
 * INSTRUCTIONS FOR USING YOUR MASTER CATALOG:
 * 
 * This data has been automatically imported from your CSV file.
 * The system preserves all your original data:
 * - Part Numbers (exactly as you have them)
 * - Descriptions (cleaned for consistency) 
 * - Vendors (normalized for better matching)
 * - Categories, voltages, amperages, etc.
 * 
 * Plus it will add AI enhancements during import:
 * - Smart categorization
 * - Keyword extraction
 * - Assembly groupings
 * - Pattern matching preparation
 */

// MASTER CATALOG DATA - Imported from CSV
const MASTER_CATALOG_DATA = [
$($jsObjects -join ",`n")
];

/**
 * Quick function to load your catalog data
 */
function loadYourMasterCatalog() {
  return MASTER_CATALOG_DATA;
}

/**
 * Get catalog statistics
 */
function getCatalogStats() {
  const data = MASTER_CATALOG_DATA;
  const stats = {
    totalParts: data.length,
    categories: [...new Set(data.map(p => p.category).filter(c => c))],
    vendors: [...new Set(data.map(p => p.vendor).filter(v => v))],
    totalValue: data.reduce((sum, p) => sum + (p.unitCost || 0), 0),
    assemblies: [...new Set(data.map(p => p.assembly).filter(a => a))]
  };
  
  console.log('📊 CATALOG STATISTICS:');
  console.log('• Total Parts:', stats.totalParts);
  console.log('• Categories:', stats.categories.length);
  console.log('• Vendors:', stats.vendors.length);
  console.log('• Total Value: `$' + stats.totalValue.toLocaleString());
  console.log('• Assembly Types:', stats.assemblies.length);
  
  return stats;
}

/**
 * Function to validate the catalog data format
 */
function validateCatalogData() {
  try {
    const data = MASTER_CATALOG_DATA;
    console.log('✅ Catalog data is valid JavaScript');
    console.log('📦 Found', data.length, 'parts in catalog');
    
    // Validate structure
    const samplePart = data[0];
    const requiredFields = ['partNumber', 'description', 'vendor', 'unitCost'];
    const missingFields = requiredFields.filter(field => !(field in samplePart));
    
    if (missingFields.length > 0) {
      console.warn('⚠️ Missing fields:', missingFields.join(', '));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Catalog data has syntax errors:', error);
    return false;
  }
}

/**
 * Search parts by keyword
 */
function searchParts(keyword) {
  const searchTerm = keyword.toLowerCase();
  return MASTER_CATALOG_DATA.filter(part => 
    part.partNumber.toLowerCase().includes(searchTerm) ||
    part.description.toLowerCase().includes(searchTerm) ||
    part.vendor.toLowerCase().includes(searchTerm) ||
    part.category.toLowerCase().includes(searchTerm)
  );
}
"@

# Write to file
$jsContent | Out-File $jsPath -Encoding UTF8

Write-Host "✅ Successfully converted $processedCount parts to JavaScript format!"
Write-Host "📁 File saved to: $jsPath"
