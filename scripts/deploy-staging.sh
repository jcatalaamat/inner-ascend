#!/bin/bash

# Staging Deploy Script (LOCAL - FREE!)
# This script builds AND submits staging versions to TestFlight
# Uses --local flag to avoid EAS cloud build costs

set -e

echo "🚀 Starting LOCAL staging deploy (FREE!)..."
echo "⚠️  This will:"
echo "   0. Bump app version (patch)"
echo "   1. Build on your Mac using Xcode (~10-15 min)"
echo "   2. Submit to TestFlight automatically (~2-5 min)"
echo ""

# Step 0: Bump version
echo "📦 Step 0/3: Bumping version..."
./scripts/bump-version.sh patch

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

# Step 1: Build locally (FREE!)
echo "🍎 Step 1/3: Building for iOS (locally on your Mac)..."
IPA_PATH="./build-$(date +%s).ipa"
eas build --platform ios --profile staging --local --non-interactive --output "$IPA_PATH"

echo ""
echo "✅ Build completed: $IPA_PATH"
echo ""

# Step 2: Submit to TestFlight
echo "📤 Step 2/3: Submitting to TestFlight..."
eas submit --platform ios --profile staging --path "$IPA_PATH" --non-interactive

echo ""
echo "✅ Submitted to TestFlight!"
echo ""

# Step 3: Commit version bump
echo "📝 Step 3/3: Committing version bump..."
cd ../..
git add apps/expo/app.config.js
git commit -m "chore: bump version for staging release" || echo "⚠️  No version changes to commit"

echo ""
echo "🎉 Staging deploy completed!"
echo "💰 Cost: $0 (built locally!)"
echo "📱 Beta testers will receive the update in ~5-10 minutes"
echo "🔗 Check status: https://appstoreconnect.apple.com"
