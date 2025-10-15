#!/bin/bash

# Production Deploy Script (LOCAL - FREE!)
# This script builds AND submits production versions to App Store and/or Google Play
# Uses --local flag to avoid EAS cloud build costs
#
# Usage:
#   ./deploy-production.sh                    # Interactive, iOS only
#   ./deploy-production.sh -y                 # Non-interactive, iOS only
#   ./deploy-production.sh --platform ios
#   ./deploy-production.sh --platform android
#   ./deploy-production.sh --platform all -y

set -e

# Parse arguments
AUTO_CONFIRM=false
PLATFORM="ios"  # Default to iOS for backwards compatibility

while [[ $# -gt 0 ]]; do
  case $1 in
    -y|--yes)
      AUTO_CONFIRM=true
      shift
      ;;
    --platform)
      PLATFORM="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate platform
if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" && "$PLATFORM" != "all" ]]; then
    echo "❌ Invalid platform: $PLATFORM"
    echo "Valid options: ios, android, all"
    exit 1
fi

echo "🚀 Starting LOCAL production deploy (FREE!)..."
echo "⚠️  This will:"
if [[ "$PLATFORM" == "all" ]]; then
    echo "   1. Build for iOS on your Mac (~10-15 min)"
    echo "   2. Submit iOS to App Store (~2-5 min)"
    echo "   3. Build for Android (~10-15 min)"
    echo "   4. Submit Android to Google Play (~2-5 min)"
elif [[ "$PLATFORM" == "ios" ]]; then
    echo "   1. Build on your Mac using Xcode (~10-15 min)"
    echo "   2. Submit to App Store automatically (~2-5 min)"
else
    echo "   1. Build for Android (~10-15 min)"
    echo "   2. Submit to Google Play (~2-5 min)"
fi
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
    read -p "Deploy version $CURRENT_VERSION to production? (Y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "❌ Production deploy cancelled"
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

# Deploy based on platform selection
STEP_TOTAL=2
if [[ "$PLATFORM" == "all" ]]; then
  STEP_TOTAL=4
fi
STEP_CURRENT=0

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "🍎 Step $STEP_CURRENT/$STEP_TOTAL: Building for iOS production (locally on your Mac)..."
  IOS_IPA_PATH="./build-ios-$(date +%s).ipa"
  eas build --platform ios --profile production --local --non-interactive --output "$IOS_IPA_PATH"

  echo ""
  echo "✅ iOS build completed: $IOS_IPA_PATH"
  echo ""

  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "📤 Step $STEP_CURRENT/$STEP_TOTAL: Submitting iOS to App Store for review..."
  eas submit --platform ios --profile production --path "$IOS_IPA_PATH" --non-interactive

  echo ""
  echo "✅ iOS submitted to App Store!"
  echo ""
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "🤖 Step $STEP_CURRENT/$STEP_TOTAL: Building for Android (AAB for Play Store)..."
  ANDROID_AAB_PATH="./build-android-$(date +%s).aab"
  eas build --platform android --profile production --local --non-interactive --output "$ANDROID_AAB_PATH"

  echo ""
  echo "✅ Android build completed: $ANDROID_AAB_PATH"
  echo ""

  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "📤 Step $STEP_CURRENT/$STEP_TOTAL: Submitting Android to Google Play..."
  eas submit --platform android --profile production --path "$ANDROID_AAB_PATH" --non-interactive

  echo ""
  echo "✅ Android submitted to Google Play!"
  echo ""
fi

echo "🎉 Production deploy completed!"
echo "💰 Cost: $0 (built locally!)"
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 iOS: Review typically takes 1-2 days"
  echo "   Monitor: https://appstoreconnect.apple.com"
fi
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Android: Review typically takes a few hours to 1 day"
  echo "   Monitor: https://play.google.com/console"
fi
echo "📧 You'll receive email updates about the review status"
