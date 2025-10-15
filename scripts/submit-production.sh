#!/bin/bash

# Production Submit Script
# This script submits production builds to App Store and/or Google Play for review
# Submits the LATEST build using the production profile
#
# Usage:
#   ./submit-production.sh                    # Interactive, iOS only
#   ./submit-production.sh -y                 # Non-interactive, iOS only
#   ./submit-production.sh --platform ios
#   ./submit-production.sh --platform android
#   ./submit-production.sh --platform all -y

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

echo "📤 Starting production submission..."
echo ""

# Navigate to expo app directory
cd apps/expo

# Get current version from app.config.js
CURRENT_VERSION=$(node -e "const config = require('./app.config.js'); console.log(config.default.expo.version)" 2>/dev/null | tail -1)
echo "📱 Current version: $CURRENT_VERSION"
echo ""

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

if [[ "$PLATFORM" == "all" ]]; then
    echo "⚠️  This will submit the LATEST production builds to App Store and Google Play for review"
elif [[ "$PLATFORM" == "ios" ]]; then
    echo "⚠️  This will submit the LATEST production build to the App Store for review"
else
    echo "⚠️  This will submit the LATEST production build to Google Play for review"
fi
echo "ℹ️  Make sure you have already built version $CURRENT_VERSION"
echo ""

# Ask for confirmation only if not auto-confirmed
if [ "$AUTO_CONFIRM" = false ]; then
    if [[ "$PLATFORM" == "all" ]]; then
        read -p "Submit latest production builds to both stores? (Y/n) " -n 1 -r
    elif [[ "$PLATFORM" == "ios" ]]; then
        read -p "Submit latest production build to App Store? (Y/n) " -n 1 -r
    else
        read -p "Submit latest production build to Google Play? (Y/n) " -n 1 -r
    fi
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "❌ Production submission cancelled"
        exit 1
    fi
    echo ""
fi

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 Submitting to App Store (iOS) using PRODUCTION profile..."
  eas submit --platform ios --profile production --latest --non-interactive
  echo ""
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Submitting to Google Play (Android) using PRODUCTION profile..."
  eas submit --platform android --profile production --latest --non-interactive
  echo ""
fi

echo "✅ Production submission completed!"
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 iOS: Check App Store Connect at https://appstoreconnect.apple.com"
  echo "   ⏱️  Apple review typically takes 1-2 days"
fi
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Android: Check Google Play Console at https://play.google.com/console"
  echo "   ⏱️  Google Play review typically takes a few hours to 1 day"
fi
