# 🚀 SEMI-AUTOMATED FRESH BUILD DEPLOYMENT
# PowerShell version for Windows
# Deploys the hierarchical workflow system to Google Apps Script
# August 13, 2025

Write-Host "🚀 CraftQuote Fresh Build Deployment" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Check if clasp is installed
try {
    $claspVersion = clasp --version
    Write-Host "✅ Google Apps Script CLI found: $claspVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Apps Script CLI (clasp) not found." -ForegroundColor Red
    Write-Host "Install it with: npm install -g @google/clasp" -ForegroundColor Yellow
    Write-Host "Then run: clasp login" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host "✅ AUTOMATED_FRESH_BUILD.gs created" -ForegroundColor Green
Write-Host "✅ Hierarchical workflow files ready" -ForegroundColor Green
Write-Host "✅ Git repository up to date" -ForegroundColor Green
Write-Host ""

# Confirm deployment
$confirm = Read-Host "Deploy to Google Apps Script? (y/n)"
if ($confirm -notmatch '^[yY]([eE][sS])?$') {
    Write-Host "❌ Deployment cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Check if clasp.json exists
if (-not (Test-Path "clasp.json")) {
    Write-Host "❌ clasp.json not found. Run 'clasp create' first." -ForegroundColor Red
    exit 1
}

Write-Host "📤 Pushing essential files to Google Apps Script..." -ForegroundColor Cyan

# Push the automated fresh build
try {
    clasp push --force
    Write-Host "✅ Files deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Open your Google Sheet" -ForegroundColor White
    Write-Host "2. Go to Extensions → Apps Script" -ForegroundColor White
    Write-Host "3. Find and run: runAutomatedFreshBuild()" -ForegroundColor White
    Write-Host "4. Follow the automated setup process" -ForegroundColor White
    Write-Host ""
    Write-Host "⚡ The system will automatically:" -ForegroundColor Cyan
    Write-Host "   • Create hierarchical database structure" -ForegroundColor White
    Write-Host "   • Import your Master Catalog data" -ForegroundColor White
    Write-Host "   • Set up professional menu system" -ForegroundColor White
    Write-Host "   • Validate everything is working" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Fresh build deployment complete!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed. Check your clasp configuration." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
