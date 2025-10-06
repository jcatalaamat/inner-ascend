#!/bin/bash

# Production Deploy Script (LOCAL - FREE!)
# This script builds AND submits production versions to App Store
# Uses --local flag to avoid EAS cloud build costs

set -e

echo "🚀 Starting LOCAL production deploy (FREE!)..."
echo "⚠️  This will:"
echo "   1. Build on your Mac using Xcode (~10-15 min)"
echo "   2. Submit to App Store automatically (~2-5 min)"
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
eas build --platform ios --profile production --local --non-interactive

echo ""
echo "✅ Build completed!"
echo ""

# Step 2: Submit to App Store
echo "📤 Step 2/2: Submitting to App Store..."
eas submit --platform ios --profile production --latest --non-interactive

echo ""
echo "🎉 Production deploy completed!"
echo "💰 Cost: $0 (built locally!)"
echo "⏱️  Apple review typically takes 1-2 days"
echo "📧 You'll receive email updates about the review status"
echo "🔗 Monitor: https://appstoreconnect.apple.com"
