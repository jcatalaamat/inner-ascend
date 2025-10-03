#!/bin/bash

# Production Submit Script
# This script submits production builds to App Store and Google Play Store

set -e

echo "📤 Starting production submission..."

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

echo "🍎 Submitting to App Store (iOS)..."
eas submit --platform ios --profile production --latest --non-interactive

echo "📱 Submitting to Google Play Store (Android)..."
eas submit --platform android --profile production --latest --non-interactive

echo "✅ Production submissions completed!"
echo "📥 Check App Store Connect and Google Play Console for your builds"
