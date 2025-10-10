#!/bin/bash

# Production Submit Script
# This script submits production builds to App Store for review
# Submits the LATEST build using the production profile
#
# Usage:
#   ./submit-production.sh          # Interactive (asks for confirmation)
#   ./submit-production.sh -y       # Non-interactive (auto-confirm)

set -e

# Parse arguments
AUTO_CONFIRM=false
if [[ "$1" == "-y" ]] || [[ "$1" == "--yes" ]]; then
    AUTO_CONFIRM=true
fi

echo "📤 Starting production submission..."
echo ""

# Navigate to expo app directory
cd apps/expo

# Get current version from app.config.js
CURRENT_VERSION=$(node -e "const config = require('./app.config.js'); console.log(config.default.expo.version)" 2>/dev/null | tail -1)
echo "📱 Current version: $CURRENT_VERSION"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Please install it with: npm install -g eas-cli"
    exit 1
fi

# Check if user is logged in
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS. Please run: eas login"
    exit 1
fi

echo "⚠️  This will submit the LATEST production build to the App Store for review"
echo "ℹ️  Make sure you have already built version $CURRENT_VERSION"
echo ""

# Ask for confirmation only if not auto-confirmed
if [ "$AUTO_CONFIRM" = false ]; then
    read -p "Submit latest production build to App Store? (Y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "❌ Production submission cancelled"
        exit 1
    fi
    echo ""
fi

echo "🍎 Submitting to App Store (iOS) using PRODUCTION profile..."
eas submit --platform ios --profile production --latest --non-interactive

echo ""
echo "✅ Production submission completed!"
echo "🔗 Check App Store Connect: https://appstoreconnect.apple.com"
echo "⏱️  Apple review typically takes 1-2 days"
