#!/bin/bash

# Staging Deploy Script (LOCAL - FREE!)
# This script builds AND submits staging versions to TestFlight and/or Google Play
# Uses --local flag to avoid EAS cloud build costs
#
# Usage:
#   ./deploy-staging.sh              # Deploy iOS only (default)
#   ./deploy-staging.sh --platform ios
#   ./deploy-staging.sh --platform android
#   ./deploy-staging.sh --platform all

set -e

# Parse arguments
PLATFORM="ios"  # Default to iOS for backwards compatibility
while [[ $# -gt 0 ]]; do
  case $1 in
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

echo "🚀 Starting LOCAL staging deploy (FREE!)..."
echo "⚠️  This will:"
if [[ "$PLATFORM" == "all" ]]; then
    echo "   1. Build for iOS on your Mac (~10-15 min)"
    echo "   2. Submit iOS to TestFlight (~2-5 min)"
    echo "   3. Build for Android (~10-15 min)"
    echo "   4. Submit Android to Google Play Internal Testing (~2-5 min)"
elif [[ "$PLATFORM" == "ios" ]]; then
    echo "   1. Build on your Mac using Xcode (~10-15 min)"
    echo "   2. Submit to TestFlight automatically (~2-5 min)"
else
    echo "   1. Build for Android (~10-15 min)"
    echo "   2. Submit to Google Play Internal Testing (~2-5 min)"
fi
echo ""
echo "ℹ️  Note: This uses the current version but auto-increments the build number"
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
  echo "🍎 Step $STEP_CURRENT/$STEP_TOTAL: Building for iOS (locally on your Mac)..."
  IOS_IPA_PATH="./build-ios-$(date +%s).ipa"
  eas build --platform ios --profile staging --local --non-interactive --output "$IOS_IPA_PATH"

  echo ""
  echo "✅ iOS build completed: $IOS_IPA_PATH"
  echo ""

  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "📤 Step $STEP_CURRENT/$STEP_TOTAL: Submitting iOS to TestFlight..."
  eas submit --platform ios --profile staging --path "$IOS_IPA_PATH" --non-interactive

  echo ""
  echo "✅ iOS submitted to TestFlight!"
  echo ""
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "🤖 Step $STEP_CURRENT/$STEP_TOTAL: Building for Android (APK for testing)..."
  ANDROID_APK_PATH="./build-android-$(date +%s).apk"
  eas build --platform android --profile staging --local --non-interactive --output "$ANDROID_APK_PATH"

  echo ""
  echo "✅ Android build completed: $ANDROID_APK_PATH"
  echo ""

  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo "📤 Step $STEP_CURRENT/$STEP_TOTAL: Submitting Android to Google Play Internal Testing..."
  eas submit --platform android --profile staging --path "$ANDROID_APK_PATH" --non-interactive

  echo ""
  echo "✅ Android submitted to Google Play Internal Testing!"
  echo ""
fi

echo "🎉 Staging deploy completed!"
echo "💰 Cost: $0 (built locally!)"
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 iOS: Beta testers will receive the update in ~5-10 minutes"
  echo "   Check status: https://appstoreconnect.apple.com"
fi
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Android: Internal testers can access the build now"
  echo "   Check status: https://play.google.com/console"
fi
