#!/bin/bash

# 🚀 SEMI-AUTOMATED FRESH BUILD DEPLOYMENT
# Deploys the hierarchical workflow system to Google Apps Script
# August 13, 2025

echo "🚀 CraftQuote Fresh Build Deployment"
echo "===================================="
echo ""

# Check if clasp is installed
if ! command -v clasp &> /dev/null; then
    echo "❌ Google Apps Script CLI (clasp) not found."
    echo "Install it with: npm install -g @google/clasp"
    echo "Then run: clasp login"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "✅ AUTOMATED_FRESH_BUILD.gs created"
echo "✅ Hierarchical workflow files ready"
echo "✅ Git repository up to date"
echo ""

# Confirm deployment
read -p "Deploy to Google Apps Script? (y/n): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Deployment cancelled."
    exit 0
fi

echo ""
echo "🚀 Starting deployment..."

# Check if clasp.json exists
if [[ ! -f "clasp.json" ]]; then
    echo "❌ clasp.json not found. Run 'clasp create' first."
    exit 1
fi

echo "📤 Pushing essential files to Google Apps Script..."

# Push the automated fresh build first
if clasp push --force; then
    echo "✅ Files deployed successfully!"
    echo ""
    echo "🎯 NEXT STEPS:"
    echo "1. Open your Google Sheet"
    echo "2. Go to Extensions → Apps Script"
    echo "3. Find and run: runAutomatedFreshBuild()"
    echo "4. Follow the automated setup process"
    echo ""
    echo "⚡ The system will automatically:"
    echo "   • Create hierarchical database structure"
    echo "   • Import your Master Catalog data"
    echo "   • Set up professional menu system"
    echo "   • Validate everything is working"
    echo ""
    echo "🎉 Fresh build deployment complete!"
else
    echo "❌ Deployment failed. Check your clasp configuration."
    exit 1
fi
