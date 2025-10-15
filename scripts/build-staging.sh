#!/bin/bash

# Staging Build Script (LOCAL - FREE!)
# This script ONLY builds staging versions (does NOT submit)
# Uses --local flag to avoid EAS cloud build costs
# Use deploy-staging.sh if you want to build + submit in one command
#
# Usage:
#   ./build-staging.sh              # Build iOS only (default)
#   ./build-staging.sh --platform ios
#   ./build-staging.sh --platform android
#   ./build-staging.sh --platform all

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

echo "🚀 Starting LOCAL staging build (FREE!)..."
if [[ "$PLATFORM" == "all" ]]; then
    echo "⚠️  This will build for iOS and Android (~20-30 min total)"
elif [[ "$PLATFORM" == "ios" ]]; then
    echo "⚠️  This will build for iOS using Xcode (~10-15 min)"
else
    echo "⚠️  This will build for Android (~10-15 min)"
fi
echo "💡 TIP: Use 'yarn deploy:staging' to build + submit automatically"
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

# Build based on platform selection
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 Building for iOS (locally on your Mac)..."
  IOS_IPA_PATH="./build-ios-$(date +%s).ipa"
  eas build --platform ios --profile staging --local --non-interactive --output "$IOS_IPA_PATH"

  echo ""
  echo "✅ iOS staging build completed!"
  echo "📦 Build saved to: $IOS_IPA_PATH"
  echo ""
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Building for Android (APK for faster testing)..."
  ANDROID_APK_PATH="./build-android-$(date +%s).apk"
  eas build --platform android --profile staging --local --non-interactive --output "$ANDROID_APK_PATH"

  echo ""
  echo "✅ Android staging build completed!"
  echo "📦 Build saved to: $ANDROID_APK_PATH"
  echo ""
fi

echo "💰 Cost: $0 (built locally!)"
echo ""
echo "📤 Next steps:"
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "   iOS → TestFlight: cd apps/expo && eas submit --platform ios --profile staging --path $IOS_IPA_PATH"
fi
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "   Android → Internal Testing: cd apps/expo && eas submit --platform android --profile staging --path $ANDROID_APK_PATH"
fi
echo ""
echo "💡 Or use 'yarn deploy:staging' to build + submit in one command"
