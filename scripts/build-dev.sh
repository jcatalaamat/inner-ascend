#!/bin/bash

# Development Build Script
# ⚠️ WARNING: For daily development, use 'yarn ios --device' instead (FREE & instant!)
# This script is only needed for special development builds (e.g., for other devices)

set -e

echo "⚠️  WARNING: You're about to build a development build."
echo "💡 For daily development, use 'yarn ios --device' instead (FREE & instant!)"
echo ""
echo "This script is only useful if you need:"
echo "  - Development build for someone else's device"
echo "  - Development build with specific configuration"
echo ""
read -p "Do you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled. Use 'yarn ios --device' for daily development!"
    exit 1
fi

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

echo "🍎 Building for iOS (locally on your Mac)..."
eas build --platform ios --profile development:device --local --non-interactive

echo ""
echo "✅ Development build completed!"
echo "💰 Cost: $0 (built locally!)"
echo "💡 Remember: Use 'yarn ios --device' for daily development (faster & free!)"
