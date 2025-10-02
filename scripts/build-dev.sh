#!/bin/bash

# Development Build Script
# This script builds development versions for testing

set -e

echo "🚀 Starting development build..."

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

echo "📱 Building for Android..."
eas build --platform android --profile development --non-interactive

echo "🍎 Building for iOS..."
eas build --platform ios --profile development --non-interactive

echo "✅ Development builds completed!"
echo "📥 Check your email or visit https://expo.dev to download the builds"
