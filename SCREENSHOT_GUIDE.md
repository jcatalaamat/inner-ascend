# 📸 App Store Screenshot Guide

Complete guide for capturing, organizing, and uploading screenshots for Mazunte Connect.

## Required Screenshots

Apple requires **at least 1 screenshot** for iPhone 6.5" or 6.7" display. You can upload up to 10 screenshots per device size.

### Recommended Screens to Capture

**Essential (5 screenshots minimum):**
1. **Home Screen** - Shows upcoming events, beautiful UI
2. **Event Detail** - Full event with image, details, contact info
3. **Places List** - Browse places with categories
4. **Map View** - Interactive map with events/places
5. **Create Event** - Show how easy it is to create events

**Optional (to reach 10):**
6. **Place Detail** - Showcase a retreat or restaurant
7. **Favorites** - Show saved events/places
8. **Search** - Demonstrate search functionality
9. **Event List Filtered** - Category filter in action
10. **Dark Mode** - Show dark mode support

---

## Step 1: Run App on Simulator

### Choose the Right Simulator

Apple accepts these sizes:
- **iPhone 14 Pro Max** (6.7" - 1284 × 2778px) ⭐ RECOMMENDED
- **iPhone 14 Plus** (6.7" - 1284 × 2778px)
- **iPhone 13 Pro Max** (6.5" - 1242 × 2688px)

### Launch Simulator

```bash
# From project root
cd apps/expo

# Run on iPhone 14 Pro Max (RECOMMENDED)
yarn ios --simulator "iPhone 14 Pro Max"

# Wait for app to load
```

**Tip:** Use the largest device (14 Pro Max) - Apple will auto-scale for smaller devices.

---

## Step 2: Capture Screenshots

### Take Screenshots in English

1. **Set language to English:**
   - In your app, go to Settings → Language → English

2. **Navigate to each screen and take screenshot:**
   - Press `⌘ + S` in Simulator
   - Screenshots save to your Desktop
   - Take 5-10 screenshots of key screens

3. **Filename format:**
   Screenshots will be saved as:
   ```
   Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.23.45.png
   ```

### Take Screenshots in Spanish

1. **Change language:**
   - In your app, go to Settings → Language → Español

2. **Take same screenshots:**
   - Press `⌘ + S` for each screen
   - Capture the exact same screens as English version

---

## Step 3: Organize Screenshots

### Create Screenshot Folders

```bash
# From project root
cd apps/expo/fastlane

# Create folders for screenshots
mkdir -p screenshots/en-US
mkdir -p screenshots/es-MX
```

### Move and Rename Screenshots

```bash
# Move English screenshots from Desktop
cd ~/Desktop

# Rename and move (example for 5 screenshots)
mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.20.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/1_home_screen.png

mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.21.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/2_event_detail.png

mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.22.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/3_places_list.png

mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.23.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/4_map_view.png

mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.24.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/5_create_event.png
```

**Repeat for Spanish screenshots:**
```bash
# Spanish screenshots (same pattern)
mv "Simulator Screen Shot - iPhone 14 Pro Max - 2025-01-15 at 14.30.00.png" \
   ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/es-MX/1_pantalla_inicio.png

# ... continue for all Spanish screenshots
```

### Screenshot Naming Convention

**English (en-US):**
```
1_home_screen.png
2_event_detail.png
3_places_list.png
4_map_view.png
5_create_event.png
6_place_detail.png (optional)
7_favorites.png (optional)
8_search.png (optional)
9_filtered_events.png (optional)
10_dark_mode.png (optional)
```

**Spanish (es-MX):**
```
1_pantalla_inicio.png
2_detalle_evento.png
3_lista_lugares.png
4_vista_mapa.png
5_crear_evento.png
6_detalle_lugar.png (optional)
7_favoritos.png (optional)
8_buscar.png (optional)
9_eventos_filtrados.png (optional)
10_modo_oscuro.png (optional)
```

**Numbering matters!** The first 3 screenshots appear in App Store search results.

---

## Step 4: Verify Screenshots

```bash
# Check English screenshots
ls -lh apps/expo/fastlane/screenshots/en-US/

# Check Spanish screenshots
ls -lh apps/expo/fastlane/screenshots/es-MX/

# Verify file sizes (should be ~500KB - 2MB each)
# Verify dimensions: 1284 × 2778px
```

### Check Screenshot Dimensions

```bash
# Install ImageMagick (if not installed)
brew install imagemagick

# Check dimensions of a screenshot
identify ~/Documents/Code/mazunte-connect-supabase/apps/expo/fastlane/screenshots/en-US/1_home_screen.png

# Should output: 1_home_screen.png PNG 1284x2778 ...
```

---

## Step 5: Upload to App Store Connect

### Option 1: Upload via Fastlane (Recommended)

```bash
cd apps/expo

# Upload screenshots only
yarn fastlane:upload:screenshots

# Or upload screenshots + metadata together
yarn fastlane:upload:metadata
```

**What happens:**
- Fastlane reads all screenshots from `fastlane/screenshots/`
- Uploads to App Store Connect
- Associates with correct languages (en-US, es-MX)
- You'll see progress in terminal

### Option 2: Manual Upload (Fallback)

If Fastlane upload fails:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Mazunte Connect**
3. Go to **App Store** → **iOS App** → **1.0 Prepare for Submission**
4. Scroll to **App Previews and Screenshots**
5. Click **+** to add screenshots
6. Drag and drop screenshots from `fastlane/screenshots/en-US/`
7. Repeat for Spanish (change language dropdown)

---

## Quick Commands Reference

```bash
# 1. Create screenshot folders
cd apps/expo/fastlane
mkdir -p screenshots/en-US screenshots/es-MX

# 2. Run app on simulator
cd apps/expo
yarn ios --simulator "iPhone 14 Pro Max"

# 3. Take screenshots (in simulator)
# Press ⌘ + S for each screen

# 4. Move screenshots from Desktop
# (Use mv commands from Step 3)

# 5. Upload to App Store Connect
cd apps/expo
yarn fastlane:upload:screenshots
```

---

## Screenshot Helper Script

Save this to organize screenshots quickly:

```bash
#!/bin/bash
# organize-screenshots.sh

# Create folders
mkdir -p apps/expo/fastlane/screenshots/en-US
mkdir -p apps/expo/fastlane/screenshots/es-MX

echo "Screenshot folders created!"
echo ""
echo "Next steps:"
echo "1. Run: yarn ios --simulator \"iPhone 14 Pro Max\""
echo "2. Change to English in app"
echo "3. Take 5-10 screenshots (⌘ + S)"
echo "4. Change to Spanish in app"
echo "5. Take same screenshots"
echo "6. Move screenshots from Desktop to:"
echo "   apps/expo/fastlane/screenshots/en-US/"
echo "   apps/expo/fastlane/screenshots/es-MX/"
echo "7. Run: yarn fastlane:upload:screenshots"
```

Make it executable:
```bash
chmod +x organize-screenshots.sh
```

---

## Troubleshooting

### Simulator screenshots are wrong size

**Problem:** Screenshots are 828 × 1792px instead of 1284 × 2778px

**Solution:**
- Check simulator device: `xcrun simctl list devices | grep iPhone`
- Use iPhone 14 Pro Max or 13 Pro Max
- Restart simulator if needed

### Screenshots appear blurry

**Problem:** Low resolution or scaling issues

**Solution:**
- Ensure simulator is at 100% scale (Window → Physical Size)
- Use PNG format (not JPG)
- Don't resize screenshots - use original dimensions

### Fastlane upload fails

**Problem:** Authentication error or timeout

**Solution:**
```bash
# Re-authenticate with Apple ID
cd apps/expo/fastlane
fastlane fastlane-credentials add --username your@apple-id.com

# Try upload again
cd apps/expo
yarn fastlane:upload:screenshots
```

### Missing screenshots in App Store Connect

**Problem:** Uploaded but not appearing

**Solution:**
- Check filename format (no special characters)
- Verify file size < 500KB per screenshot
- Check dimensions exactly match requirements
- Wait 5-10 minutes for processing

---

## Best Practices

### Content Guidelines

✅ **DO:**
- Show actual app content (real events/places)
- Use high-quality images
- Show key features clearly
- Include both light and dark mode (if relevant)
- Show text that's easy to read

❌ **DON'T:**
- Use placeholder content ("Lorem ipsum")
- Show personal information
- Include competitor apps
- Use outdated UI
- Show errors or bugs

### Screenshot Order

**First 3 are most important** (shown in search):
1. Home screen (shows events)
2. Event detail (shows usefulness)
3. Map view (shows innovation)

Then:
4. Create event (shows engagement)
5. Places (shows variety)

### Language Consistency

- Take **exact same screens** for both languages
- Keep screenshot order identical
- Verify translations are correct

---

## After Screenshots Are Ready

### Checklist Before Submission

- [ ] At least 5 screenshots captured for iPhone 6.7"
- [ ] Screenshots organized in `en-US/` and `es-MX/` folders
- [ ] Dimensions verified: 1284 × 2778px
- [ ] File sizes reasonable (< 2MB each)
- [ ] Screenshots uploaded to App Store Connect
- [ ] Both English and Spanish versions uploaded
- [ ] First 3 screenshots showcase best features

### Next Steps

1. ✅ Screenshots complete
2. ⏳ Create `/privacy` and `/support` pages on website
3. ⏳ Upload metadata: `yarn fastlane:upload:metadata`
4. ⏳ Build production: `yarn deploy:production`
5. ⏳ Submit for review in App Store Connect

---

## Quick Start Checklist

```bash
# ✅ Step 1: Setup folders
cd apps/expo/fastlane
mkdir -p screenshots/en-US screenshots/es-MX

# ✅ Step 2: Run app
cd apps/expo
yarn ios --simulator "iPhone 14 Pro Max"

# ✅ Step 3: Take screenshots
# - Set language to English
# - Press ⌘ + S on 5-10 screens
# - Set language to Spanish
# - Press ⌘ + S on same screens

# ✅ Step 4: Organize
# Move screenshots from Desktop to:
# - apps/expo/fastlane/screenshots/en-US/
# - apps/expo/fastlane/screenshots/es-MX/
# Rename to: 1_home_screen.png, 2_event_detail.png, etc.

# ✅ Step 5: Upload
cd apps/expo
yarn fastlane:upload:screenshots

# ✅ Done!
```

---

## Need Help?

- **Fastlane errors:** Check [apps/expo/fastlane/README.md](apps/expo/fastlane/README.md)
- **Screenshot specs:** [Apple's guidelines](https://help.apple.com/app-store-connect/#/devd274dd925)
- **Full release guide:** [PRODUCTION_RELEASE_GUIDE.md](../PRODUCTION_RELEASE_GUIDE.md)

Good luck with your screenshots! 📸
