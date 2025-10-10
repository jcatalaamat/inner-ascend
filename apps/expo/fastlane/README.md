# Fastlane Configuration for Mazunte Connect

This directory contains Fastlane configuration for automating App Store metadata, screenshots, and releases.

## 📁 Directory Structure

```
fastlane/
├── Fastfile              # Main configuration file (lanes/tasks)
├── Snapfile              # Screenshot generation configuration
├── README.md             # This file
├── metadata/             # App Store metadata (editable text files)
│   ├── en-US/           # English metadata
│   │   ├── name.txt
│   │   ├── subtitle.txt
│   │   ├── description.txt
│   │   ├── keywords.txt
│   │   ├── promotional_text.txt
│   │   ├── release_notes.txt
│   │   ├── support_url.txt
│   │   ├── marketing_url.txt
│   │   └── privacy_url.txt
│   └── es-MX/           # Spanish (Mexico) metadata
│       └── (same files as en-US)
└── screenshots/          # App Store screenshots (generated)
    ├── en-US/
    └── es-MX/
```

## 🚀 Quick Start

### Installation

```bash
# Install Fastlane
brew install fastlane

# Or with RubyGems
sudo gem install fastlane
```

### Common Commands

From `apps/expo` directory:

```bash
# Generate screenshots (when UI tests ready)
yarn fastlane:screenshots

# Upload screenshots to App Store Connect
yarn fastlane:upload:screenshots

# Upload metadata (description, keywords, etc.)
yarn fastlane:upload:metadata

# Prepare complete release (screenshots + metadata)
yarn fastlane:prepare:release

# Show current app version
yarn fastlane:version

# Clean up simulator data
yarn fastlane:clean
```

## 📝 Editing Metadata

All App Store metadata is stored as editable text files in `metadata/`:

### Update App Description

```bash
# English
nano metadata/en-US/description.txt

# Spanish
nano metadata/es-MX/description.txt
```

### Update Keywords

```bash
nano metadata/en-US/keywords.txt
```

### Update Release Notes

```bash
# Update for each new version
nano metadata/en-US/release_notes.txt
nano metadata/es-MX/release_notes.txt
```

### Update URLs

```bash
nano metadata/en-US/support_url.txt     # Support page
nano metadata/en-US/privacy_url.txt     # Privacy policy
nano metadata/en-US/marketing_url.txt   # Marketing website
```

## 📸 Screenshots

### Manual Screenshot Process (Current)

1. **Run app on simulator:**
   ```bash
   cd apps/expo
   yarn ios --device "iPhone 14 Pro Max"
   ```

2. **Take screenshots:**
   - Navigate to key screens
   - Press `⌘ + S` in Simulator
   - Screenshots save to Desktop

3. **Organize screenshots:**
   ```bash
   mkdir -p fastlane/screenshots/en-US
   mkdir -p fastlane/screenshots/es-MX

   # Move and rename screenshots
   mv ~/Desktop/Screenshot*.png fastlane/screenshots/en-US/
   ```

4. **Name screenshots descriptively:**
   ```
   1_home_screen.png
   2_event_detail.png
   3_places_list.png
   4_place_detail.png
   5_map_view.png
   ```

5. **Upload to App Store Connect:**
   ```bash
   yarn fastlane:upload:screenshots
   ```

### Required Screenshot Sizes

| Device | Size (Portrait) |
|--------|-----------------|
| iPhone 6.7" (14 Pro Max) | 1284 × 2778px |
| iPhone 6.5" (13 Pro Max) | 1242 × 2688px |
| iPad Pro 12.9" | 2048 × 2732px (optional) |

## 🎯 Available Lanes

### iOS Lanes

**screenshots** - Generate screenshots for all devices and languages
```bash
fastlane ios screenshots
```

**upload_metadata** - Upload metadata and screenshots to App Store Connect
```bash
fastlane ios upload_metadata
```

**upload_screenshots** - Upload only screenshots
```bash
fastlane ios upload_screenshots
```

**prepare_release** - Complete release preparation (screenshots + metadata)
```bash
fastlane ios prepare_release
```

**version** - Display current version and build number
```bash
fastlane ios version
```

**clean** - Clean up simulator data and screenshots
```bash
fastlane ios clean
```

### Utility Lanes

**download_screenshots** - Download existing screenshots from App Store Connect
```bash
fastlane ios download_screenshots
```

**download_metadata** - Download existing metadata
```bash
fastlane ios download_metadata
```

## 🔧 Configuration Files

### Fastfile

Main configuration file defining all lanes (tasks). Edit to add new lanes or modify existing ones.

**Location:** `fastlane/Fastfile`

### Snapfile

Configuration for automated screenshot generation.

**Location:** `fastlane/Snapfile`

**Current settings:**
- Devices: iPhone 14 Pro Max, iPhone 14 Plus, iPad Pro 12.9"
- Languages: en-US, es-MX
- Output: `./fastlane/screenshots`

## 📋 Metadata File Reference

| File | Purpose | Max Length | Required |
|------|---------|------------|----------|
| `name.txt` | App name | 30 chars | ✅ Yes |
| `subtitle.txt` | Short tagline | 30 chars | No |
| `description.txt` | Full description | 4000 chars | ✅ Yes |
| `keywords.txt` | Search keywords | 100 chars | ✅ Yes |
| `promotional_text.txt` | Featured text | 170 chars | No |
| `release_notes.txt` | What's new | 4000 chars | ✅ Yes |
| `support_url.txt` | Support page URL | - | ✅ Yes |
| `privacy_url.txt` | Privacy policy URL | - | ✅ Yes |
| `marketing_url.txt` | Marketing website | - | No |

## 🌍 Supported Languages

Currently configured for:
- **en-US** - English (United States)
- **es-MX** - Spanish (Mexico)

To add more languages:
1. Create new directory in `metadata/` (e.g., `metadata/fr-FR`)
2. Copy all text files from `en-US`
3. Translate all files
4. Add language to `Snapfile` languages array

## 🚨 Troubleshooting

### Fastlane not found
```bash
# Install/reinstall Fastlane
brew install fastlane
```

### Authentication failed
```bash
# Re-authenticate with Apple
fastlane fastlane-credentials add --username your@email.com
```

### Metadata upload fails
- Check file lengths (description < 4000 chars, keywords < 100 chars)
- Ensure all required files exist
- Verify Apple ID has correct permissions in App Store Connect

### Screenshots wrong size
- Use exact dimensions from table above
- Take screenshots from correct simulator devices
- Convert to PNG format if using JPG

## 📚 Documentation

- **Main Guide:** See `../../PRODUCTION_RELEASE_GUIDE.md`
- **Fastlane Docs:** https://docs.fastlane.tools/
- **Deliver Docs:** https://docs.fastlane.tools/actions/deliver/
- **Snapshot Docs:** https://docs.fastlane.tools/actions/snapshot/

## 💡 Tips

1. **Update metadata anytime** - Doesn't require new app version
2. **First 3 screenshots matter** - They appear in search results
3. **Keep descriptions benefit-focused** - Tell users what they gain
4. **Test screenshots on real devices** - Ensure quality
5. **Commit metadata to git** - Track changes over time

## 🎯 Workflow Summary

**For each release:**

1. Update release notes:
   ```bash
   nano metadata/en-US/release_notes.txt
   nano metadata/es-MX/release_notes.txt
   ```

2. Update screenshots (if UI changed):
   - Take new screenshots
   - Organize in `screenshots/` folders
   - Upload: `yarn fastlane:upload:screenshots`

3. Upload everything:
   ```bash
   yarn fastlane:upload:metadata
   ```

4. Build and submit:
   ```bash
   yarn deploy:production
   ```

**That's it!** 🎉
