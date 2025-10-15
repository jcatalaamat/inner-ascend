#!/bin/bash

# Staging Submit Script
# This script submits staging builds to TestFlight and/or Google Play Internal Testing
#
# Usage:
#   ./submit-staging.sh              # Submit iOS only (default)
#   ./submit-staging.sh --platform ios
#   ./submit-staging.sh --platform android
#   ./submit-staging.sh --platform all

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

echo "📤 Starting staging submission..."

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

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 Submitting to TestFlight (iOS)..."
  eas submit --platform ios --profile staging --latest --non-interactive
  echo ""
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "📱 Submitting to Google Play Internal Testing (Android)..."
  eas submit --platform android --profile staging --latest --non-interactive
  echo ""
fi

echo "✅ Staging submissions completed!"
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
  echo "🍎 iOS: Check TestFlight at https://appstoreconnect.apple.com"
fi
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
  echo "🤖 Android: Check Google Play Console at https://play.google.com/console"
fi
