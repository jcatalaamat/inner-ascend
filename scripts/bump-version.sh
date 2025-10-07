#!/bin/bash

# Bump Version Script
# Increments app version before building
# Usage: ./scripts/bump-version.sh [patch|minor|major]

set -e

cd apps/expo

# Default to patch if no argument provided
VERSION_TYPE=${1:-patch}

echo "📦 Bumping version ($VERSION_TYPE)..."

# Get current version from app.config.js (suppress dotenv output)
CURRENT_VERSION=$(node -e "const config = require('./app.config.js'); console.log(config.default.expo.version)" 2>/dev/null | tail -1)
echo "Current version: $CURRENT_VERSION"

# Parse version components
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Increment based on type
case "$VERSION_TYPE" in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
  *)
    echo "❌ Invalid version type: $VERSION_TYPE"
    echo "   Usage: ./scripts/bump-version.sh [patch|minor|major]"
    exit 1
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update app.config.js
sed -i.bak "s/version: '[0-9.]*'/version: '$NEW_VERSION'/" app.config.js
rm app.config.js.bak

echo "✅ Version bumped to $NEW_VERSION"
