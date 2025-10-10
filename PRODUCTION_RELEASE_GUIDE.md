# 🚀 Production Release Guide with Fastlane

Complete guide for preparing and releasing Mazunte Connect to the App Store using automated tools.

## Table of Contents
- [Overview](#overview)
- [Fastlane Setup](#fastlane-setup)
- [App Store Metadata](#app-store-metadata)
- [Screenshot Generation](#screenshot-generation)
- [Release Workflow](#release-workflow)
- [Quick Reference](#quick-reference)

---

## Overview

We've set up **Fastlane** to automate App Store metadata and screenshot management. This makes releases faster, more consistent, and easier to maintain across multiple languages.

### What's Automated
✅ **App Store Metadata** (English + Spanish):
- App name, subtitle, description
- Keywords for search optimization
- Promotional text
- Release notes
- Support/privacy/marketing URLs

✅ **Screenshots** (Coming soon):
- Automated screenshot generation
- Multiple device sizes (iPhone 6.5", 6.7", iPad)
- Multiple languages (EN, ES)

✅ **Metadata Upload**:
- Upload all metadata to App Store Connect
- Upload screenshots in all languages
- Manage release notes for each version

---

## Fastlane Setup

### Installation

**1. Install Fastlane:**
```bash
# Using Homebrew (recommended for macOS)
brew install fastlane

# Or using RubyGems
sudo gem install fastlane
```

**2. Verify Installation:**
```bash
cd apps/expo
fastlane --version
```

**3. Initialize Fastlane (first time only):**
```bash
cd apps/expo
fastlane init
```

When prompted:
- Choose option `4` (Manual setup)
- App Identifier: `com.mazunte.connect`
- Apple ID: Your Apple developer account email

### Configuration Files

All Fastlane configuration is in `apps/expo/fastlane/`:

```
apps/expo/fastlane/
├── Fastfile              # Main configuration (lanes/tasks)
├── Snapfile              # Screenshot generation config
└── metadata/             # App Store metadata
    ├── en-US/           # English metadata
    │   ├── name.txt
    │   ├── subtitle.txt
    │   ├── description.txt
    │   ├── keywords.txt
    │   ├── promotional_text.txt
    │   ├── release_notes.txt
    │   ├── support_url.txt
    │   ├── marketing_url.txt
    │   └── privacy_url.txt
    └── es-MX/           # Spanish metadata
        ├── name.txt
        ├── subtitle.txt
        ├── description.txt
        ├── keywords.txt
        ├── promotional_text.txt
        ├── release_notes.txt
        ├── support_url.txt
        ├── marketing_url.txt
        └── privacy_url.txt
```

---

## App Store Metadata

### Current Metadata (Editable)

All metadata is stored in text files that you can edit directly:

#### **English (en-US)**

**Name:** Mazunte Connect
**Subtitle:** Community Events & Places

**Description:** (See `metadata/en-US/description.txt`)
- Comprehensive app description
- Features list
- Use cases
- Privacy info

**Keywords:**
```
mazunte,community,events,yoga,ceremony,wellness,retreat,local,places,discover,activities,mexico,oaxaca,beach,eco,conscious
```

**Promotional Text:**
```
Discover events, explore places, and connect with your Mazunte community.
```

#### **Spanish (es-MX)**

All metadata is fully translated to Spanish in `metadata/es-MX/`.

### Editing Metadata

**To update app description:**
```bash
# Edit English
nano apps/expo/fastlane/metadata/en-US/description.txt

# Edit Spanish
nano apps/expo/fastlane/metadata/es-MX/description.txt
```

**To update keywords:**
```bash
nano apps/expo/fastlane/metadata/en-US/keywords.txt
```

**To update release notes for a new version:**
```bash
# Update what's new in this version
nano apps/expo/fastlane/metadata/en-US/release_notes.txt
nano apps/expo/fastlane/metadata/es-MX/release_notes.txt
```

### Uploading Metadata to App Store Connect

**Upload all metadata (descriptions, keywords, URLs):**
```bash
cd apps/expo
yarn fastlane:upload:metadata
```

This will:
1. Read all metadata files from `fastlane/metadata/`
2. Upload to App Store Connect for all languages
3. Update existing metadata without submitting for review

**Note:** Metadata changes don't require a new app version - you can update anytime!

---

## Screenshot Generation

### Manual Screenshots (Current Method)

Until UI tests are set up, use manual screenshots:

**1. Run app on simulator:**
```bash
cd apps/expo
yarn ios --device "iPhone 14 Pro Max"
```

**2. Navigate to key screens:**
- Home screen with events
- Event detail page
- Places list
- Place detail page
- Map view
- Favorites
- Create event screen

**3. Take screenshots (⌘ + S in Simulator):**
- Screenshots save to your Desktop
- File naming: `Simulator Screen Shot - iPhone 14 Pro Max - [timestamp].png`

**4. Organize screenshots:**
```bash
# Create screenshot folders
mkdir -p apps/expo/fastlane/screenshots/en-US
mkdir -p apps/expo/fastlane/screenshots/es-MX

# Move English screenshots
mv ~/Desktop/Screenshot*.png apps/expo/fastlane/screenshots/en-US/

# Change language in app to Spanish, retake screenshots
# Move Spanish screenshots
mv ~/Desktop/Screenshot*.png apps/expo/fastlane/screenshots/es-MX/
```

**5. Rename screenshots:**

Screenshots should be named descriptively:
```
en-US/
  1_home_screen.png
  2_event_detail.png
  3_places_list.png
  4_place_detail.png
  5_map_view.png
```

### Required Screenshot Sizes

| Device | Size | Format |
|--------|------|--------|
| iPhone 6.7" (14 Pro Max) | 1284 × 2778px | PNG/JPG |
| iPhone 6.5" (13 Pro Max) | 1242 × 2688px | PNG/JPG |
| iPad Pro 12.9" | 2048 × 2732px | PNG/JPG (optional) |

**Tip:** First 3 screenshots appear in App Store search results - make them count!

### Uploading Screenshots

**Upload screenshots to App Store Connect:**
```bash
cd apps/expo
yarn fastlane:upload:screenshots
```

This uploads all screenshots from `fastlane/screenshots/` to App Store Connect.

### Automated Screenshots (Future)

To enable automated screenshot generation:

1. **Set up UI Tests** in Xcode
2. **Configure test scheme** for screenshot points
3. **Run automated screenshots:**
   ```bash
   yarn fastlane:screenshots
   ```

This will automatically:
- Launch app in simulator
- Navigate through screens
- Capture screenshots
- Generate for all device sizes
- Create for all languages

---

## Release Workflow

### Complete Production Release Process

#### **Step 1: Pre-Release Checklist**

```bash
# 1. Run release checklist
# See RELEASE_CHECKLIST.md for complete list

# 2. Test staging build first
cd apps/expo
yarn deploy:staging

# 3. Test staging build on TestFlight
# Invite beta testers, gather feedback

# 4. Check current version
yarn fastlane:version
```

#### **Step 2: Update Version**

```bash
# 1. Bump version in app.config.js
nano apps/expo/app.config.js
# Change: version: '1.0.2' → '1.1.0'

# 2. Update release notes
nano apps/expo/fastlane/metadata/en-US/release_notes.txt
nano apps/expo/fastlane/metadata/es-MX/release_notes.txt

# 3. Commit version bump
git add apps/expo/app.config.js apps/expo/fastlane/metadata/
git commit -m "chore: bump version to 1.1.0"
git push
```

#### **Step 3: Generate/Update Screenshots**

```bash
# Option A: Manual screenshots (current)
# 1. Run app on simulator
yarn ios --device "iPhone 14 Pro Max"

# 2. Take screenshots (⌘ + S)
# 3. Organize in fastlane/screenshots/

# Option B: Automated (when UI tests ready)
yarn fastlane:screenshots
```

#### **Step 4: Upload Metadata & Screenshots**

```bash
cd apps/expo

# Upload everything (screenshots + metadata)
yarn fastlane:prepare:release

# Or upload separately:
yarn fastlane:upload:metadata      # Metadata only
yarn fastlane:upload:screenshots   # Screenshots only
```

#### **Step 5: Build & Submit to App Store**

```bash
# Build production version and submit
yarn deploy:production

# Or do separately:
yarn build:production   # Build only
yarn submit:production  # Submit after build completes
```

**Wait time:**
- Build: ~15-20 minutes
- Submit to App Store: ~5 minutes
- Processing: ~10-15 minutes
- **Total: ~30-40 minutes** until ready for review

#### **Step 6: Submit for Review in App Store Connect**

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Mazunte Connect**
3. Go to **App Store** → **iOS App** → **Version**
4. Click **"+ Version"** (if new version)
5. Add build (select from dropdown)
6. Review all information (filled automatically from Fastlane!)
7. Answer **Export Compliance** questions
8. Add **App Review Information** (contact info, demo account)
9. Choose **release option** (manual vs automatic)
10. Click **"Submit for Review"**

**Review timeline:**
- Waiting for review: 1-2 days
- In review: 1-2 days
- **Total: 2-4 days**

#### **Step 7: Monitor & Release**

```bash
# Monitor crashes/errors in Sentry
# https://sentry.io/organizations/inner-ascend/projects/react-native/

# Monitor analytics in PostHog
# See POSTHOG_DASHBOARDS.md

# When approved:
# - If manual release: Click "Release This Version" in App Store Connect
# - If automatic: App goes live automatically
```

---

## Quick Reference

### Common Commands

```bash
# Fastlane commands (from apps/expo)
yarn fastlane:screenshots          # Generate screenshots
yarn fastlane:upload:screenshots   # Upload screenshots only
yarn fastlane:upload:metadata      # Upload metadata only
yarn fastlane:prepare:release      # Generate + upload everything
yarn fastlane:version              # Show current version
yarn fastlane:clean                # Clean up

# Build & Deploy (from apps/expo)
yarn deploy:staging                # Build + submit staging
yarn deploy:production             # Build + submit production
yarn build:staging                 # Build staging only
yarn build:production              # Build production only
yarn submit:staging                # Submit staging build
yarn submit:production             # Submit production build
```

### File Locations

```bash
# Fastlane configuration
apps/expo/fastlane/Fastfile                   # Main config
apps/expo/fastlane/Snapfile                   # Screenshot config

# Metadata
apps/expo/fastlane/metadata/en-US/            # English
apps/expo/fastlane/metadata/es-MX/            # Spanish

# Screenshots
apps/expo/fastlane/screenshots/en-US/         # English screenshots
apps/expo/fastlane/screenshots/es-MX/         # Spanish screenshots

# Version
apps/expo/app.config.js                       # App version & build number
```

### Metadata Files Reference

| File | Purpose | Max Length |
|------|---------|------------|
| `name.txt` | App name | 30 chars |
| `subtitle.txt` | Short tagline | 30 chars |
| `description.txt` | Full description | 4000 chars |
| `keywords.txt` | Search keywords | 100 chars |
| `promotional_text.txt` | Featured text | 170 chars |
| `release_notes.txt` | What's new | 4000 chars |
| `support_url.txt` | Support page URL | - |
| `privacy_url.txt` | Privacy policy URL | - |
| `marketing_url.txt` | Marketing URL | - |

### Screenshot Naming Convention

```
fastlane/screenshots/
├── en-US/
│   ├── 1_home_screen.png
│   ├── 2_event_detail.png
│   ├── 3_places_list.png
│   ├── 4_place_detail.png
│   └── 5_map_view.png
└── es-MX/
    ├── 1_pantalla_inicio.png
    ├── 2_detalle_evento.png
    ├── 3_lista_lugares.png
    ├── 4_detalle_lugar.png
    └── 5_vista_mapa.png
```

---

## Troubleshooting

### Fastlane Issues

**Problem: "Could not find action, lane or variable"**
```bash
# Reinstall fastlane
brew uninstall fastlane
brew install fastlane
```

**Problem: "Apple ID authentication failed"**
```bash
# Re-authenticate
fastlane fastlane-credentials add --username your@email.com
```

**Problem: "Screenshots wrong size"**
- Check device in simulator matches required sizes
- Resize images to exact dimensions required
- Use PNG format (better quality than JPG)

### Metadata Issues

**Problem: "Description too long"**
- Edit `fastlane/metadata/en-US/description.txt`
- Keep under 4000 characters
- Run `wc -c description.txt` to check length

**Problem: "Keywords rejected"**
- Avoid trademark violations
- Use comma-separated keywords only
- Keep under 100 characters total

**Problem: "Promotional text not appearing"**
- Promotional text is optional
- Only shows to App Store editors
- Update via `promotional_text.txt`

---

## Best Practices

### Metadata

✅ **DO:**
- Keep descriptions clear and benefit-focused
- Use all available character space
- Include relevant keywords naturally
- Update release notes for every version
- Proofread all text before uploading

❌ **DON'T:**
- Stuff keywords unnaturally
- Make false claims about features
- Include pricing info (changes require review)
- Use competitor names

### Screenshots

✅ **DO:**
- Show actual app UI
- Use highest quality images
- Focus on key features (first 3 screenshots)
- Include text overlays explaining features
- Test on actual devices when possible

❌ **DON'T:**
- Use placeholder images
- Include outdated UI
- Show beta/test content
- Use low resolution images

### Releases

✅ **DO:**
- Test staging builds thoroughly first
- Update release notes for every version
- Monitor crash reports after release
- Have a rollback plan
- Release during business hours

❌ **DON'T:**
- Skip testing on real devices
- Release on Fridays (harder to fix issues)
- Submit major updates before holidays
- Ignore user feedback

---

## Resources

### Documentation
- [Fastlane Docs](https://docs.fastlane.tools/)
- [Fastlane deliver](https://docs.fastlane.tools/actions/deliver/)
- [Fastlane snapshot](https://docs.fastlane.tools/actions/snapshot/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Internal Docs
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) - Pre-release checklist
- [APP_STORE_SETUP.md](./.github/APP_STORE_SETUP.md) - First-time setup
- [RELEASE_WORKFLOW.md](./.github/RELEASE_WORKFLOW.md) - Build workflow
- [VERSION_MANAGEMENT.md](./.github/VERSION_MANAGEMENT.md) - Version strategy

### Monitoring
- [Sentry Dashboard](https://sentry.io/organizations/inner-ascend/projects/react-native/)
- [PostHog Analytics](https://app.posthog.com)
- [App Store Connect Analytics](https://appstoreconnect.apple.com/analytics)

---

## Summary

**With Fastlane, you can:**
1. ✅ Manage App Store metadata in version control
2. ✅ Update descriptions without new app versions
3. ✅ Support multiple languages easily
4. ✅ Automate screenshot generation (when UI tests ready)
5. ✅ Upload metadata + screenshots programmatically
6. ✅ Streamline production releases

**Your production release is now:**
1. Update metadata files (if needed)
2. Generate/update screenshots
3. Upload metadata + screenshots: `yarn fastlane:prepare:release`
4. Build + submit: `yarn deploy:production`
5. Submit for review in App Store Connect
6. Monitor crash reports and analytics

**That's it!** 🎉

Good luck with your production releases!
