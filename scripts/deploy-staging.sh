#!/bin/bash

# Staging Deploy Script (LOCAL - FREE!)
# This script builds AND submits staging versions to TestFlight
# Uses --local flag to avoid EAS cloud build costs

set -e

echo "🚀 Starting LOCAL staging deploy (FREE!)..."
echo "⚠️  This will:"
echo "   1. Build on your Mac using Xcode (~10-15 min)"
echo "   2. Submit to TestFlight automatically (~2-5 min)"
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

# Step 1: Build locally (FREE!)
echo "🍎 Step 1/2: Building for iOS (locally on your Mac)..."
eas build --platform ios --profile staging --local --non-interactive

echo ""
echo "✅ Build completed!"
echo ""

# Step 2: Submit to TestFlight
echo "📤 Step 2/2: Submitting to TestFlight..."
eas submit --platform ios --profile staging --latest --non-interactive

echo ""
echo "🎉 Staging deploy completed!"
echo "💰 Cost: $0 (built locally!)"
echo "📱 Beta testers will receive the update in ~5-10 minutes"
echo "🔗 Check status: https://appstoreconnect.apple.com"
