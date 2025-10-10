#!/bin/bash

# Mazunte Connect Release Wizard
# Interactive CLI guide for deploying your app

set -e

# Check if gum is installed
if ! command -v gum &> /dev/null; then
    echo "❌ This wizard requires 'gum' for a better experience."
    echo "📦 Install it with: brew install gum"
    exit 1
fi

# Get current version
get_current_version() {
    grep -m 1 "version:" apps/expo/app.config.js | sed "s/.*version: '\(.*\)',/\1/"
}

# Main menu
show_main_menu() {
    clear
    gum style --border normal --margin "1" --padding "1 2" --border-foreground 212 "Mazunte Connect Release Wizard"

    CURRENT_VERSION=$(get_current_version)

    gum style --foreground 212 "📱 Current version: ${CURRENT_VERSION}"
    echo ""

    CHOICE=$(gum choose --height 6 \
        "🚀 Deploy Release" \
        "🔢 Bump Version" \
        "🛠️  Utilities" \
        "❌ Exit")

    case "$CHOICE" in
        "🚀 Deploy Release") deploy_flow ;;
        "🔢 Bump Version") bump_version_flow ;;
        "🛠️  Utilities") utilities_menu ;;
        "❌ Exit") exit 0 ;;
    esac
}

# Deploy flow
deploy_flow() {
    clear
    gum style --border double --margin "1" --padding "1 2" --border-foreground 212 "Deploy Release"

    CURRENT_VERSION=$(get_current_version)
    gum style --foreground 212 "Deploying version: ${CURRENT_VERSION}"
    echo ""
    gum style --foreground 86 "This will deploy the current version to staging and/or production"
    echo ""

    # Ask about staging
    if gum confirm "Deploy to staging first for testing?"; then
        # Deploy to staging
        gum style --foreground 212 "Deploying to staging..."
        echo ""
        ./scripts/deploy-staging.sh

        gum style --foreground 212 "✓ Staging deployment complete!"
        echo ""
        gum style --foreground 86 "Test the app on TestFlight before continuing"
        echo ""

        # Ask if tests passed
        if ! gum confirm "Have you tested on staging and everything works?"; then
            gum style --foreground 202 "Deployment stopped. Fix issues and try again."
            echo ""
            gum input --placeholder "Press Enter to return to main menu..."
            show_main_menu
            return
        fi

        echo ""
        gum style --foreground 212 "Proceeding to production..."
        echo ""
    fi

    # Deploy to production
    if gum confirm "Deploy to production?"; then
        gum style --foreground 212 "Deploying to production..."
        echo ""
        ./scripts/deploy-production.sh

        gum style --foreground 212 "✓ Production deployment complete!"
        gum style --foreground 86 "Your app is now in Apple's review queue"
        echo ""

        # Ask about metadata
        if gum confirm "Upload metadata/screenshots to App Store?"; then
            metadata_upload_menu
        else
            gum style --foreground 86 "Done! Monitor at: https://appstoreconnect.apple.com"
            echo ""
            gum input --placeholder "Press Enter to return to main menu..."
            show_main_menu
        fi
    else
        gum style --foreground 86 "Deployment cancelled"
        echo ""
        gum input --placeholder "Press Enter to return to main menu..."
        show_main_menu
    fi
}

# Bump version flow
bump_version_flow() {
    clear
    gum style --border normal --margin "1" --padding "1 2" --border-foreground 212 "Bump Version"

    CURRENT_VERSION=$(get_current_version)
    gum style --foreground 212 "Current version: ${CURRENT_VERSION}"
    echo ""

    BUMP_TYPE=$(gum choose --height 5 \
        "Patch (bug fixes) ${CURRENT_VERSION} → $(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."$3+1}')" \
        "Minor (new features) ${CURRENT_VERSION} → $(echo $CURRENT_VERSION | awk -F. '{print $1"."$2+1".0"}')" \
        "Major (breaking changes) ${CURRENT_VERSION} → $(echo $CURRENT_VERSION | awk -F. '{print $1+1".0.0"}')" \
        "Cancel")

    case "$BUMP_TYPE" in
        "Patch"*)
            gum spin --spinner dot --title "Bumping patch version..." -- ./scripts/bump-version.sh patch
            NEW_VERSION=$(get_current_version)
            gum style --foreground 212 "✓ Version bumped to ${NEW_VERSION}"
            ;;
        "Minor"*)
            gum spin --spinner dot --title "Bumping minor version..." -- ./scripts/bump-version.sh minor
            NEW_VERSION=$(get_current_version)
            gum style --foreground 212 "✓ Version bumped to ${NEW_VERSION}"
            ;;
        "Major"*)
            gum spin --spinner dot --title "Bumping major version..." -- ./scripts/bump-version.sh major
            NEW_VERSION=$(get_current_version)
            gum style --foreground 212 "✓ Version bumped to ${NEW_VERSION}"
            ;;
        *)
            show_main_menu
            return
            ;;
    esac

    echo ""
    gum input --placeholder "Press Enter to return to main menu..."
    show_main_menu
}

# Utilities menu
utilities_menu() {
    clear
    gum style --border normal --margin "1" --padding "1 2" --border-foreground 212 "Utilities"

    CHOICE=$(gum choose --height 5 \
        "📸 Upload Screenshots" \
        "📝 Upload Metadata" \
        "📋 View Release Checklist" \
        "← Back to Main Menu")

    case "$CHOICE" in
        "📸 Upload Screenshots") upload_screenshots ;;
        "📝 Upload Metadata") upload_metadata ;;
        "📋 View Release Checklist") show_checklist ;;
        *) show_main_menu ;;
    esac
}

# Upload screenshots
upload_screenshots() {
    clear
    gum style --border normal --margin "1" --padding "1 2" --border-foreground 212 "Upload Screenshots"

    gum style --foreground 86 "This will upload screenshots to App Store Connect"
    echo ""

    if gum confirm "Continue?"; then
        gum spin --spinner dot --title "Uploading screenshots..." -- sh -c "cd apps/expo && yarn fastlane:upload:screenshots"
        gum style --foreground 212 "✓ Screenshots uploaded!"
        echo ""
    fi

    gum input --placeholder "Press Enter to return..."
    utilities_menu
}

# Upload metadata
upload_metadata() {
    clear
    gum style --border normal --margin "1" --padding "1 2" --border-foreground 212 "Upload Metadata"

    gum style --foreground 86 "Note: Metadata requires a build to be submitted first"
    echo ""

    if ! gum confirm "Have you already submitted a build?"; then
        gum style --foreground 202 "Please submit a build first, then upload metadata"
        echo ""
        gum input --placeholder "Press Enter to return..."
        utilities_menu
        return
    fi

    gum spin --spinner dot --title "Uploading metadata..." -- sh -c "cd apps/expo && yarn fastlane:upload:metadata"
    gum style --foreground 212 "✓ Metadata uploaded!"
    echo ""
    gum input --placeholder "Press Enter to return..."
    utilities_menu
}

# Metadata upload menu (called after production deploy)
metadata_upload_menu() {
    clear
    gum style --border normal --margin "1" --padding "1 2" --border-foreground 212 "Upload Metadata & Screenshots"

    UPLOAD_TYPE=$(gum choose --height 5 \
        "📸 Screenshots only" \
        "📝 Metadata only" \
        "📦 Both" \
        "Skip")

    case "$UPLOAD_TYPE" in
        "📸 Screenshots only")
            gum spin --spinner dot --title "Uploading screenshots..." -- sh -c "cd apps/expo && yarn fastlane:upload:screenshots"
            gum style --foreground 212 "✓ Screenshots uploaded!"
            ;;
        "📝 Metadata only")
            gum style --foreground 86 "Note: Build must be processing or ready"
            echo ""
            gum spin --spinner dot --title "Uploading metadata..." -- sh -c "cd apps/expo && yarn fastlane:upload:metadata"
            gum style --foreground 212 "✓ Metadata uploaded!"
            ;;
        "📦 Both")
            gum spin --spinner dot --title "Uploading screenshots..." -- sh -c "cd apps/expo && yarn fastlane:upload:screenshots"
            echo ""
            gum spin --spinner dot --title "Uploading metadata..." -- sh -c "cd apps/expo && yarn fastlane:upload:metadata"
            gum style --foreground 212 "✓ All uploads complete!"
            ;;
        *)
            gum style --foreground 86 "Skipped metadata upload"
            ;;
    esac

    echo ""
    gum style --foreground 86 "Done! Monitor at: https://appstoreconnect.apple.com"
    echo ""
    gum input --placeholder "Press Enter to return to main menu..."
    show_main_menu
}

# Show checklist
show_checklist() {
    clear
    gum style --border double --margin "1" --padding "1 2" --border-foreground 212 "Production Release Checklist"

    cat << 'EOF'

📋 Pre-Release
  ☐ All features tested locally
  ☐ No console errors or warnings
  ☐ App works on real device
  ☐ All new features have proper error handling

🔢 Version Management
  ☐ Version bumped appropriately (patch/minor/major)
  ☐ CHANGELOG.md updated with changes

🧪 Testing
  ☐ Deployed to staging/TestFlight
  ☐ Tested by beta testers
  ☐ All critical user flows verified
  ☐ No crashes or critical bugs

📱 App Store Assets
  ☐ Screenshots updated (if UI changed)
  ☐ App description updated
  ☐ Keywords optimized
  ☐ Release notes written

🔐 Security & Privacy
  ☐ No secrets or API keys in code
  ☐ Privacy policy up to date
  ☐ Support page accessible

🚀 Deployment
  ☐ Build successfully on production profile
  ☐ Submitted to App Store
  ☐ Metadata uploaded
  ☐ App review information filled out

📊 Post-Release
  ☐ Monitor Sentry for errors
  ☐ Monitor App Store reviews
  ☐ Check analytics for issues
  ☐ Respond to user feedback

EOF

    echo ""
    gum input --placeholder "Press Enter to return..."
    utilities_menu
}

# Start the wizard
show_main_menu
