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

    # Super cool ASCII art header
    gum style \
        --foreground 212 --bold \
        --border thick \
        --border-foreground 212 \
        --align center \
        --width 60 \
        --margin "0" --padding "1" \
        "🌴🌊 MAZUNTE CONNECT 🌊🌴" \
        "RELEASE WIZARD" \
        "════════════════════════"

    CURRENT_VERSION=$(get_current_version)

    echo ""
    gum style \
        --foreground 86 --bold \
        --border rounded \
        --border-foreground 86 \
        --align center \
        --width 30 \
        --margin "0 15" \
        --padding "0 2" \
        "📱 v${CURRENT_VERSION}"

    echo ""
    gum style --foreground 51 --italic --align center "✨ Choose your adventure ✨"
    echo ""

    CHOICE=$(gum choose \
        --height 8 \
        --cursor "→ " \
        --cursor.foreground 212 \
        --selected.foreground 212 \
        --selected.bold \
        --header.foreground 240 \
        --header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" \
        "🚀 Deploy Release        Ship it to TestFlight/App Store" \
        "🔢 Bump Version          Increment version number" \
        "🛠️  Utilities             Screenshots, metadata & tools" \
        "❌ Exit                  Peace out! ✌️")

    case "$CHOICE" in
        *"Deploy Release"*) deploy_flow ;;
        *"Bump Version"*) bump_version_flow ;;
        *"Utilities"*) utilities_menu ;;
        *"Exit"*) exit 0 ;;
    esac
}

# Deploy flow
deploy_flow() {
    clear
    gum style \
        --border thick \
        --margin "1" --padding "1 2" \
        --border-foreground 86 \
        --foreground 86 --bold \
        --align center \
        --width 50 \
        "🚀  D E P L O Y   R E L E A S E  🚀"

    CURRENT_VERSION=$(get_current_version)
    echo ""
    gum style \
        --foreground 212 --bold \
        --border rounded \
        --border-foreground 212 \
        --align center \
        --width 40 \
        --margin "0 5" \
        --padding "0 2" \
        "Version: ${CURRENT_VERSION}"
    echo ""
    gum style --foreground 51 --italic --align center "Where do you want to deploy?"
    echo ""

    # Choose deployment target
    DEPLOY_TARGET=$(gum choose \
        --height 8 \
        --cursor "🎯 " \
        --cursor.foreground 86 \
        --selected.foreground 86 \
        --selected.bold \
        --header.foreground 240 \
        --header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" \
        "🧪 Staging only          Test on TestFlight first" \
        "🚀 Production only       Straight to App Store" \
        "🔄 Both                  Staging → Production (auto)" \
        "⬅️  Cancel               Never mind, go back")

    case "$DEPLOY_TARGET" in
        *"Staging only"*)
            gum style --foreground 212 "Deploying to staging..."
            echo ""
            ./scripts/deploy-staging.sh

            gum style --foreground 212 "✓ Staging deployment complete!"
            gum style --foreground 86 "Test on TestFlight, then run Deploy Release → Production when ready"
            echo ""
            ;;

        *"Production only"*)
            if ! gum confirm "Have you tested this version on staging?"; then
                gum style --foreground 202 "Please test on staging first!"
                echo ""
                gum input --placeholder "Press Enter to return to main menu..."
                show_main_menu
                return
            fi

            gum style --foreground 212 "Deploying to production..."
            echo ""
            ./scripts/deploy-production.sh

            gum style --foreground 212 "✓ Production deployment complete!"
            gum style --foreground 86 "Your app is now in Apple's review queue"
            echo ""

            if gum confirm "Upload metadata/screenshots to App Store?"; then
                metadata_upload_menu
                return
            fi
            ;;

        *"Both"*)
            gum style --foreground 86 "This will build and deploy to both staging and production"
            gum style --foreground 86 "Staging first, then production (sequential, ~20-30 min total)"
            echo ""

            if ! gum confirm "Start both deployments?"; then
                show_main_menu
                return
            fi

            gum style --foreground 212 "Step 1/2: Deploying to staging..."
            echo ""
            ./scripts/deploy-staging.sh

            gum style --foreground 212 "✓ Staging deployment complete!"
            echo ""

            gum style --foreground 212 "Step 2/2: Deploying to production..."
            echo ""
            ./scripts/deploy-production.sh

            gum style --foreground 212 "✓ Both deployments complete!"
            gum style --foreground 86 "Staging: TestFlight (test before approving production)"
            gum style --foreground 86 "Production: App Store review queue"
            echo ""

            if gum confirm "Upload metadata/screenshots to App Store?"; then
                metadata_upload_menu
                return
            fi
            ;;

        *)
            show_main_menu
            return
            ;;
    esac

    gum style --foreground 86 "Done! Monitor at: https://appstoreconnect.apple.com"
    echo ""
    gum input --placeholder "Press Enter to return to main menu..."
    show_main_menu
}

# Bump version flow
bump_version_flow() {
    clear
    gum style \
        --border thick \
        --margin "1" --padding "1 2" \
        --border-foreground 212 \
        --foreground 212 --bold \
        --align center \
        --width 50 \
        "🔢  B U M P   V E R S I O N  🔢"

    CURRENT_VERSION=$(get_current_version)
    echo ""
    gum style \
        --foreground 86 --bold \
        --border rounded \
        --border-foreground 86 \
        --align center \
        --width 40 \
        --margin "0 5" \
        --padding "0 2" \
        "Current: v${CURRENT_VERSION}"
    echo ""
    gum style --foreground 51 --italic --align center "What kind of release is this?"
    echo ""

    NEXT_PATCH=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."$3+1}')
    NEXT_MINOR=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2+1".0"}')
    NEXT_MAJOR=$(echo $CURRENT_VERSION | awk -F. '{print $1+1".0.0"}')

    BUMP_TYPE=$(gum choose \
        --height 8 \
        --cursor "⬆️  " \
        --cursor.foreground 212 \
        --selected.foreground 212 \
        --selected.bold \
        --header.foreground 240 \
        --header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" \
        "🐛 Patch               ${CURRENT_VERSION} → ${NEXT_PATCH} (bug fixes)" \
        "✨ Minor               ${CURRENT_VERSION} → ${NEXT_MINOR} (new features)" \
        "💥 Major               ${CURRENT_VERSION} → ${NEXT_MAJOR} (breaking changes)" \
        "⬅️  Cancel             Never mind")

    case "$BUMP_TYPE" in
        *"Patch"*)
            gum spin --spinner moon --title "🚀 Bumping patch version..." --title.foreground 212 -- ./scripts/bump-version.sh patch
            NEW_VERSION=$(get_current_version)
            echo ""
            gum style \
                --foreground 86 --bold \
                --border rounded \
                --border-foreground 86 \
                --align center \
                --width 40 \
                --margin "1 5" \
                --padding "1 2" \
                "✨ SUCCESS! ✨" \
                "New version: v${NEW_VERSION}" \
                "Committed & pushed to GitHub!"
            ;;
        *"Minor"*)
            gum spin --spinner moon --title "🚀 Bumping minor version..." --title.foreground 212 -- ./scripts/bump-version.sh minor
            NEW_VERSION=$(get_current_version)
            echo ""
            gum style \
                --foreground 86 --bold \
                --border rounded \
                --border-foreground 86 \
                --align center \
                --width 40 \
                --margin "1 5" \
                --padding "1 2" \
                "✨ SUCCESS! ✨" \
                "New version: v${NEW_VERSION}" \
                "Committed & pushed to GitHub!"
            ;;
        *"Major"*)
            gum spin --spinner moon --title "🚀 Bumping major version..." --title.foreground 212 -- ./scripts/bump-version.sh major
            NEW_VERSION=$(get_current_version)
            echo ""
            gum style \
                --foreground 86 --bold \
                --border rounded \
                --border-foreground 86 \
                --align center \
                --width 40 \
                --margin "1 5" \
                --padding "1 2" \
                "✨ SUCCESS! ✨" \
                "New version: v${NEW_VERSION}" \
                "Committed & pushed to GitHub!"
            ;;
        *)
            show_main_menu
            return
            ;;
    esac

    echo ""
    gum style --foreground 51 --italic --align center "Press Enter to continue..."
    gum input --placeholder ""
    show_main_menu
}

# Utilities menu
utilities_menu() {
    clear
    gum style \
        --border thick \
        --margin "1" --padding "1 2" \
        --border-foreground 86 \
        --foreground 86 --bold \
        --align center \
        --width 50 \
        "🛠️   U T I L I T I E S   🛠️"

    echo ""
    gum style --foreground 51 --italic --align center "Helper tools and resources"
    echo ""

    CHOICE=$(gum choose \
        --height 8 \
        --cursor "🔧 " \
        --cursor.foreground 86 \
        --selected.foreground 86 \
        --selected.bold \
        --header.foreground 240 \
        --header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" \
        "📸 Upload Screenshots    Add to App Store" \
        "📝 Upload Metadata       Descriptions & keywords" \
        "📋 Release Checklist     Pre-flight checks" \
        "⬅️  Back                 Return to main menu")

    case "$CHOICE" in
        *"Screenshots"*) upload_screenshots ;;
        *"Metadata"*) upload_metadata ;;
        *"Checklist"*) show_checklist ;;
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
