#!/bin/bash

# Production Build Script (LOCAL - FREE!)
# This script ONLY builds production versions (does NOT submit)
# Uses --local flag to avoid EAS cloud build costs
# Use deploy-production.sh if you want to build + submit in one command
#
# Usage:
#   ./build-production.sh                    # Interactive, iOS only
#   ./build-production.sh -y                 # Non-interactive, iOS only
#   ./build-production.sh --platform ios
#   ./build-production.sh --platform android
#   ./build-production.sh --platform all -y

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

echo "🚀 Starting LOCAL production build (FREE!)..."
if [[ "$PLATFORM" == "all" ]]; then
    echo "⚠️  This will build for iOS and Android (~20-30 min total)"
elif [[ "$PLATFORM" == "ios" ]]; then
    echo "⚠️  This will build for iOS using Xcode (~10-15 min)"
else
    echo "⚠️  This will build for Android (~10-15 min)"
fi
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

# Build based on platform selection
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 Building for iOS production (locally on your Mac)..."
  IOS_IPA_PATH="./build-ios-$(date +%s).ipa"
  eas build --platform ios --profile production --local --non-interactive --output "$IOS_IPA_PATH"

  echo ""
  echo "✅ iOS production build completed!"
  echo "📦 Build saved to: $IOS_IPA_PATH"
  echo ""
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Building for Android (AAB for Play Store)..."
  ANDROID_AAB_PATH="./build-android-$(date +%s).aab"
  eas build --platform android --profile production --local --non-interactive --output "$ANDROID_AAB_PATH"

  echo ""
  echo "✅ Android production build completed!"
  echo "📦 Build saved to: $ANDROID_AAB_PATH"
  echo ""
fi

echo "💰 Cost: $0 (built locally!)"
echo ""
echo "📤 Next steps:"
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "   iOS → App Store: cd apps/expo && eas submit --platform ios --profile production --path $IOS_IPA_PATH"
fi
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "   Android → Play Store: cd apps/expo && eas submit --platform android --profile production --path $ANDROID_AAB_PATH"
fi
echo ""
echo "💡 Or use 'yarn deploy:production' to build + submit in one command"
