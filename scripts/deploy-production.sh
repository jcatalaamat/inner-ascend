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

# Get current version from app.config.js
CURRENT_VERSION=$(node -e "const config = require('./app.config.js'); console.log(config.default.expo.version)" 2>/dev/null | tail -1)
echo "📱 Current version: $CURRENT_VERSION"
echo ""
echo "ℹ️  Note: Build number will be auto-incremented by EAS"
echo "⚠️  Make sure you've bumped the version if this is a new release!"
echo ""

# Ask for confirmation
read -p "Deploy version $CURRENT_VERSION to production? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Production deploy cancelled"
    exit 1
fi
echo ""

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

# Set environment variables for local builds
export LANG=en_US.UTF-8  # Fix fastlane locale warning
export LC_ALL=en_US.UTF-8

# Sentry auth token should be set in your ~/.zshrc
# If not set, the build will fail with auth error
# Get token from: https://sentry.io/settings/account/api/auth-tokens/
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

# Step 1: Build locally (FREE!) using PRODUCTION profile
echo "🍎 Step 1/2: Building for iOS production (locally on your Mac)..."
IPA_PATH="./build-$(date +%s).ipa"
eas build --platform ios --profile production --local --non-interactive --output "$IPA_PATH"

echo ""
echo "✅ Build completed: $IPA_PATH"
echo ""

# Step 2: Submit to App Store using PRODUCTION profile
echo "📤 Step 2/2: Submitting to App Store for review..."
eas submit --platform ios --profile production --path "$IPA_PATH" --non-interactive

echo ""
echo "✅ Submitted to App Store!"
echo ""
echo "🎉 Production deploy completed!"
echo "💰 Cost: $0 (built locally!)"
echo "⏱️  Apple review typically takes 1-2 days"
echo "📧 You'll receive email updates about the review status"
echo "🔗 Monitor: https://appstoreconnect.apple.com"
