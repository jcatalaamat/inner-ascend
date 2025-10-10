# 🚀 Quick Start: Screenshots to App Store

**Goal:** Go from "Fastlane setup" to "Screenshots uploaded" in 30 minutes.

## Current Status

✅ Fastlane installed (v2.228.0)
✅ Main website: https://mazunteconnect.com
⚠️ Need: /privacy page (returns 404)
⚠️ Need: /support page (returns 404)
⏳ Screenshots: Not captured yet

---

## 15-Minute Screenshot Process

### Step 1: Prepare (1 minute)

```bash
cd apps/expo

# Create screenshot folders
./prepare-screenshots.sh
```

### Step 2: Capture English Screenshots (5 minutes)

```bash
# Run app on simulator
yarn ios --simulator "iPhone 14 Pro Max"
```

**In the app:**
1. Change language to **English** (Settings → Language)
2. Navigate to these screens and press `⌘ + S` for each:
   - **Home screen** (with events showing)
   - **Event detail** (tap any event)
   - **Places tab** (bottom nav)
   - **Map tab** (bottom nav)
   - **Create button** (tap + button)

Screenshots save to your Desktop automatically.

### Step 3: Capture Spanish Screenshots (5 minutes)

**In the app:**
1. Change language to **Español** (Ajustes → Idioma)
2. Take the **exact same screenshots** as English:
   - **Pantalla inicio** (⌘ + S)
   - **Detalle evento** (⌘ + S)
   - **Lugares** (⌘ + S)
   - **Mapa** (⌘ + S)
   - **Crear** (⌘ + S)

### Step 4: Organize Screenshots (3 minutes)

```bash
# Go to Desktop (where screenshots are)
cd ~/Desktop

# List screenshots
ls -lt "Simulator Screen Shot"*.png | head -10

# Move and rename to project (example for first screenshot)
mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.20.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/1_home_screen.png
```

**Repeat for each screenshot:**
- `1_home_screen.png`
- `2_event_detail.png`
- `3_places_list.png`
- `4_map_view.png`
- `5_create_event.png`

**Then Spanish (same pattern):**
- `es-MX/1_pantalla_inicio.png`
- `es-MX/2_detalle_evento.png`
- `es-MX/3_lista_lugares.png`
- `es-MX/4_vista_mapa.png`
- `es-MX/5_crear_evento.png`

### Step 5: Verify (1 minute)

```bash
cd apps/expo

# Check screenshot counts
ls -1 fastlane/screenshots/en-US/ | wc -l   # Should be 5+
ls -1 fastlane/screenshots/es-MX/ | wc -l   # Should be 5+

# Check file sizes (should be ~500KB - 2MB each)
ls -lh fastlane/screenshots/en-US/
```

---

## Upload to App Store Connect

### Option 1: Fastlane Upload (Recommended)

```bash
cd apps/expo

# Upload screenshots
yarn fastlane:upload:screenshots
```

**If you get authentication error:**
```bash
# Configure Apple ID credentials
cd fastlane
fastlane fastlane-credentials add --username your@apple-id.com

# Try again
cd ..
yarn fastlane:upload:screenshots
```

### Option 2: Manual Upload (If Fastlane Fails)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Mazunte Connect**
3. **App Store** → **iOS App** → **Prepare for Submission**
4. Scroll to **App Previews and Screenshots**
5. Drag screenshots from `fastlane/screenshots/en-US/`
6. Change language dropdown to **Spanish (Mexico)**
7. Drag screenshots from `fastlane/screenshots/es-MX/`

---

## Common Issues & Solutions

### Screenshots are wrong size

**Check simulator:**
```bash
xcrun simctl list devices | grep "iPhone 14 Pro Max"
```

Should show iPhone 14 Pro Max is available. If not:
```bash
# Install simulators via Xcode
open -a Xcode
# Go to Xcode → Preferences → Components → Download iOS simulators
```

### Can't find screenshots on Desktop

**Check screenshot location:**
```bash
# Default location
ls -lt ~/Desktop/Simulator\ Screen\ Shot*.png

# If not there, check alternate location
ls -lt ~/Pictures/Simulator\ Screen\ Shot*.png
```

### Fastlane authentication fails

**Re-authenticate:**
```bash
cd apps/expo/fastlane
fastlane fastlane-credentials add --username your-apple-id@email.com

# Enter password when prompted
# If you have 2FA, use app-specific password from appleid.apple.com
```

---

## Before Final Submission

You still need:

### 1. Create Missing Web Pages

⚠️ **Privacy Page:** `https://mazunteconnect.com/privacy` (currently 404)
⚠️ **Support Page:** `https://mazunteconnect.com/support` (currently 404)

**Use your existing content:**
- Privacy policy text is in your app: `packages/app/i18n/locales/en.json`
- Support can just have: "Contact: hello@mazunteconnect.com"

**Quick fix:** Add 2 HTML files to your website hosting:
- `privacy.html` or `/privacy/index.html`
- `support.html` or `/support/index.html`

### 2. Upload Metadata

```bash
cd apps/expo
yarn fastlane:upload:metadata
```

This uploads your app description, keywords, etc.

### 3. Build & Submit

```bash
cd apps/expo
yarn deploy:production
```

This builds the app and submits to App Store Connect.

### 4. Final Steps in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select build (wait ~10-15 min for processing)
3. Answer export compliance questions
4. Add app review contact info
5. **Click "Submit for Review"**

---

## Estimated Timeline

| Task | Time |
|------|------|
| Create screenshot folders | 1 min |
| Capture English screenshots | 5 min |
| Capture Spanish screenshots | 5 min |
| Organize & rename files | 5 min |
| Upload via Fastlane | 2 min |
| **Total** | **~20 minutes** |

---

## Complete Checklist

```bash
# ✅ Screenshots
cd apps/expo
./prepare-screenshots.sh                  # Setup
yarn ios --simulator "iPhone 14 Pro Max" # Run app
# Take screenshots (⌘ + S) x10
# Organize files
yarn fastlane:upload:screenshots          # Upload

# ⏳ Web Pages (before submission)
# Create /privacy and /support pages

# ✅ Metadata
yarn fastlane:upload:metadata

# ✅ Build
yarn deploy:production

# ⏳ Manual Steps
# - Go to App Store Connect
# - Add build
# - Answer compliance questions
# - Submit for review
```

---

## Need More Help?

- **Detailed screenshot guide:** [SCREENSHOT_GUIDE.md](SCREENSHOT_GUIDE.md)
- **Full production guide:** [PRODUCTION_RELEASE_GUIDE.md](PRODUCTION_RELEASE_GUIDE.md)
- **Website requirements:** [WEBSITE_REQUIREMENTS.md](WEBSITE_REQUIREMENTS.md)
- **Fastlane reference:** [apps/expo/fastlane/README.md](apps/expo/fastlane/README.md)

---

## Ready? Let's Go! 🚀

```bash
cd apps/expo
./prepare-screenshots.sh
```

Good luck with your App Store submission!
