#!/bin/bash

# Inner Ascend Commit Wizard
# Interactive git commit helper

set -e

# Check if gum is installed
if ! command -v gum &> /dev/null; then
    echo "❌ This wizard requires 'gum' for a better experience."
    echo "📦 Install it with: brew install gum"
    exit 1
fi

clear

# Header
gum style \
    --foreground 212 --bold \
    --border thick \
    --border-foreground 212 \
    --align center \
    --width 50 \
    --margin "0" --padding "1" \
    "🌙 GIT COMMIT WIZARD 🌙" \
    "════════════════════"

echo ""

# Show git status
gum style --foreground 86 --bold "📊 Current Changes:"
echo ""
git status --short || echo "No changes"
echo ""

# Check if there are changes
if [[ -z $(git status --short) ]]; then
    gum style --foreground 202 "No changes to commit!"
    exit 0
fi

# Ask if user wants to see diff
if gum confirm "View detailed diff?"; then
    echo ""
    git diff --color | head -50
    echo ""
fi

# Select commit type
gum style --foreground 51 --italic "What type of commit is this?"
echo ""

COMMIT_TYPE=$(gum choose \
    --height 10 \
    --cursor "→ " \
    --cursor.foreground 212 \
    --selected.foreground 212 \
    --selected.bold \
    --header.foreground 240 \
    --header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" \
    "✨ feat      New feature" \
    "🐛 fix       Bug fix" \
    "📝 docs      Documentation" \
    "💄 style     Formatting, styling" \
    "♻️  refactor Code refactoring" \
    "⚡️ perf      Performance improvement" \
    "🧪 test      Adding tests" \
    "🔧 chore     Maintenance, config" \
    "🚀 deploy    Deployment changes")

# Extract type prefix
TYPE=$(echo "$COMMIT_TYPE" | awk '{print $2}')

echo ""
gum style --foreground 86 --bold "📝 Commit Message"
MESSAGE=$(gum input \
    --placeholder "Brief description of changes..." \
    --prompt "→ " \
    --prompt.foreground 212 \
    --width 60)

if [[ -z "$MESSAGE" ]]; then
    gum style --foreground 202 "❌ Commit message cannot be empty!"
    exit 1
fi

# Optional detailed description
echo ""
if gum confirm "Add detailed description?"; then
    DESCRIPTION=$(gum write \
        --placeholder "Detailed description (optional)..." \
        --height 5 \
        --width 60)
fi

# Build commit message
FULL_MESSAGE="${TYPE}: ${MESSAGE}"
if [[ -n "$DESCRIPTION" ]]; then
    FULL_MESSAGE="${FULL_MESSAGE}

${DESCRIPTION}"
fi

# Show preview
echo ""
gum style \
    --border rounded \
    --border-foreground 86 \
    --padding "1" \
    --margin "0 5" \
    --foreground 86 \
    "📋 Commit Preview:" \
    "" \
    "${FULL_MESSAGE}"

echo ""

# Confirm commit
if ! gum confirm "Commit these changes?"; then
    gum style --foreground 202 "❌ Commit cancelled"
    exit 0
fi

# Stage all changes
git add .

# Commit
git commit -m "${FULL_MESSAGE}"

gum style --foreground 86 "✓ Committed successfully!"
echo ""

# Ask to push
if gum confirm "Push to remote?"; then
    gum spin \
        --spinner moon \
        --title "🚀 Pushing to GitHub..." \
        --title.foreground 212 \
        -- git push

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
        "Committed & pushed to GitHub!" \
        "🌙 Cosmic vibes delivered ✨"
else
    gum style --foreground 51 "✓ Committed locally (not pushed)"
fi

echo ""
