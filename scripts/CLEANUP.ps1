# Moves legacy and experimental files into ../olddev and keeps only the curated V2 set in Production_System
param(
  [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSCommandPath
$oldDev = Join-Path (Split-Path $root) 'olddev'
if (-not (Test-Path $oldDev)) { New-Item -ItemType Directory -Path $oldDev | Out-Null }

# Curated keep-list
$keep = @(
  'appsscript.json',
  '.clasp.json',
  '.claspignore',
  'CompleteMasterCatalogSystem_V2.gs',
  'CsvCatalogImporter.gs',
  'CsvDiagnostic.gs',
  'Config.gs',
  'HybridAssemblerBackend.gs',
  'HybridComponentAssembler.html',
  'AssemblyEditor.html'
)

# Move everything else up one level to olddev preserving folder structure
Get-ChildItem -Path $root -File -Recurse | ForEach-Object {
  $rel = Resolve-Path -LiteralPath $_.FullName -Relative -RelativeBasePath $root
  if ($keep -notcontains $rel) {
    $target = Join-Path $oldDev $rel
    New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
    if ($WhatIf) {
      Write-Host "Would move: $rel -> $target"
    } else {
      Move-Item -LiteralPath $_.FullName -Destination $target -Force
    }
  }
}

Write-Host 'Cleanup complete. Kept curated V2 set and moved others to /olddev.'
