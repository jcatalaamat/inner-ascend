#!/bin/bash

# Staging Submit Script
# This script submits staging builds to TestFlight and Google Play Internal Testing

set -e

echo "📤 Starting staging submission..."

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

echo "🍎 Submitting to TestFlight (iOS)..."
eas submit --platform ios --profile staging --latest --non-interactive

echo "📱 Submitting to Google Play Internal Testing (Android)..."
eas submit --platform android --profile staging --latest --non-interactive

echo "✅ Staging submissions completed!"
echo "📥 Check TestFlight and Google Play Console for your builds"
