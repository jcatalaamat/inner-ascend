#!/bin/bash

# Staging Build Script (LOCAL - FREE!)
# This script ONLY builds staging versions (does NOT submit)
# Uses --local flag to avoid EAS cloud build costs
# Use deploy-staging.sh if you want to build + submit in one command

set -e

echo "🚀 Starting LOCAL staging build (FREE!)..."
echo "⚠️  This will build on your Mac using Xcode (~10-15 min)"
echo "💡 TIP: Use 'yarn deploy:staging' to build + submit automatically"
echo ""

# Navigate to expo app directory
cd apps/expo

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

# Build locally (FREE!)
echo "🍎 Building for iOS (locally on your Mac)..."
eas build --platform ios --profile staging --local --non-interactive

echo ""
echo "✅ Staging build completed!"
echo "💰 Cost: $0 (built locally!)"
echo ""
echo "📤 Next step: Submit to TestFlight with:"
echo "   yarn submit:staging"
echo ""
echo "💡 Or use 'yarn deploy:staging' to build + submit in one command"
