#!/bin/bash

# Production Build Script (LOCAL - FREE!)
# This script ONLY builds production versions (does NOT submit)
# Uses --local flag to avoid EAS cloud build costs
# Use deploy-production.sh if you want to build + submit in one command
#
# Usage:
#   ./build-production.sh          # Interactive (asks for confirmation)
#   ./build-production.sh -y       # Non-interactive (auto-confirm)

set -e

# Parse arguments
AUTO_CONFIRM=false
if [[ "$1" == "-y" ]] || [[ "$1" == "--yes" ]]; then
    AUTO_CONFIRM=true
fi

echo "🚀 Starting LOCAL production build (FREE!)..."
echo "⚠️  This will build on your Mac using Xcode (~10-15 min)"
echo "💡 TIP: Use 'yarn deploy:production' to build + submit automatically"
echo ""

# Navigate to expo app directory
cd apps/expo

# Get current version from app.config.js
CURRENT_VERSION=$(node -e "const config = require('./app.config.js'); console.log(config.default.expo.version)" 2>/dev/null | tail -1)
echo "📱 Current version: $CURRENT_VERSION"
echo ""
echo "ℹ️  Note: Build number will be auto-incremented by EAS"
echo "⚠️  Make sure you've bumped the version if this is a new release!"
echo ""

# Ask for confirmation only if not auto-confirmed
if [ "$AUTO_CONFIRM" = false ]; then
    read -p "Build version $CURRENT_VERSION for production? (Y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "❌ Production build cancelled"
        exit 1
    fi
    echo ""
fi

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

# Set environment variables for local builds
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Check for Sentry token
if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "⚠️  WARNING: SENTRY_AUTH_TOKEN not found!"
  echo "📝 Add to ~/.zshrc: export SENTRY_AUTH_TOKEN=\"your-token\""
  echo "🔗 Get token: https://sentry.io/settings/account/api/auth-tokens/"
  echo ""
  read -p "Continue anyway? Build will fail if Sentry upload is required. (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Build locally (FREE!) using PRODUCTION profile
echo "🍎 Building for iOS production (locally on your Mac)..."
IPA_PATH="./build-$(date +%s).ipa"
eas build --platform ios --profile production --local --non-interactive --output "$IPA_PATH"

echo ""
echo "✅ Production build completed!"
echo "📦 Build saved to: $IPA_PATH"
echo "💰 Cost: $0 (built locally!)"
echo ""
echo "📤 Next step: Submit to App Store with:"
echo "   cd apps/expo && eas submit --platform ios --profile production --path $IPA_PATH"
echo ""
echo "💡 Or use 'yarn deploy:production' to build + submit in one command"
