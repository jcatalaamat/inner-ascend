#!/bin/bash

# Staging Build Script (LOCAL - FREE!)
# This script builds staging versions for beta testing on YOUR Mac
# Uses --local flag to avoid EAS cloud build costs

set -e

echo "🚀 Starting LOCAL staging build (FREE!)..."
echo "⚠️  This will build on your Mac using Xcode"
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

# iOS only (local Android builds require more setup)
echo "🍎 Building for iOS (locally on your Mac)..."
eas build --platform ios --profile staging --local --non-interactive

echo ""
echo "✅ Staging build completed!"
echo "💰 Cost: $0 (built locally!)"
echo "📤 Next step: Submit to TestFlight with: yarn submit:staging"
