# App Store Connect Setup Guide

Complete guide for submitting Mazunte Connect to the App Store for the first time.

## Table of Contents
- [Understanding Builds: Staging vs Production](#understanding-builds-staging-vs-production)
- [Understanding Build Numbers](#understanding-build-numbers)
- [First-Time Submission Checklist](#first-time-submission-checklist)
- [Step-by-Step Setup](#step-by-step-setup)
- [Generating Screenshots](#generating-screenshots)
- [Common Issues](#common-issues)
- [Quick Reference](#quick-reference)

---

## Understanding Builds: Staging vs Production

### Why Does My Staging Build Appear in Production?

**This is normal!** Here's what's happening:

When you run `yarn deploy:staging`, it:
1. ✅ Builds with `staging` profile
2. ✅ Submits to **App Store Connect** (not just TestFlight)
3. ✅ Uses `distribution: "store"` (App Store distribution)

**Key Point:** Staging and production builds **both** go to App Store Connect. The difference is:

| Profile | Purpose | Where It Appears |
|---------|---------|------------------|
| `staging` | Beta testing | TestFlight + App Store Connect (for approval) |
| `production` | Public release | App Store Connect (for public) |

**Your staging build CAN be used for production submission** - it's the same type of build! The profile name is just for **your internal organization**.

### Should I Use Staging or Production for First Release?

**Option 1: Use your staging build (Quick)**
- ✅ Already uploaded
- ✅ Already tested in TestFlight
- ✅ Same quality as production build
- ✅ **Recommended for first release**

**Option 2: Build a production version (Proper)**
- Better for version management
- Clearer separation of staging vs production
- Run: `yarn deploy:production`

**My recommendation:** Use your staging build for now, then use production profile for future releases.

---

## Understanding Build Numbers

### How Build Numbers Work with Local Builds

**Important:** Your `app.config.js` might say `buildNumber: '7'`, but EAS uses a different (higher) number when building. **This is normal and expected!**

#### How `autoIncrement` Works:

Your [eas.json](../apps/expo/eas.json) has `autoIncrement: true` for staging and production profiles:

```json
"staging": {
  "autoIncrement": true  // ← EAS automatically increments buildNumber
}
```

**What EAS does when you build:**
1. Checks App Store Connect for the **highest build number ever used**
2. Uses `max(App Store Connect builds) + 1`
3. Your local `buildNumber` in `app.config.js` becomes a **reference point only**

**Example:**
- Your `app.config.js`: `buildNumber: '7'`
- App Store Connect has builds: 30, 31, 32, 33
- EAS builds with: **`buildNumber: 34`** ✅

**Key takeaway:** You **never need to manually update buildNumber**! EAS handles it automatically.

### "Already Submitted This Build" Error

If you see this error:
```
✖ You've already submitted this build of the app.
```

**This means:**
- You tried to submit a build number that's already in App Store Connect
- This is a **one-time issue** - won't happen again
- Just run `yarn deploy:staging` again - EAS will use the next build number

**Why it happened:**
- Build was submitted twice (maybe a retry or previous attempt)
- EAS increments on **build**, but if build fails and you retry, it might reuse the same number

**Solution:**
- Simply build again: `yarn deploy:staging`
- EAS will automatically use build number `34` (or next available)
- No manual changes needed!

### Checking Current Build Number

**In App Store Connect:**
1. Go to **TestFlight** → **iOS Builds**
2. See all builds with their numbers: `1.0.2 (33)`, `1.0.2 (34)`, etc.
3. The number in parentheses is the build number

**In your local builds:**
- Build logs show: `Build number: 34`
- IPA filename: `build-1759730148941.ipa` (timestamp, not build number)

### Do I Need to Update app.config.js?

**No!** Your `buildNumber` in `app.config.js` can stay at `'7'` forever.

**Why?**
- With `autoIncrement: true`, EAS ignores your local buildNumber
- EAS tracks the real build numbers via App Store Connect
- Your local value is just a reference/starting point

**When you might want to update it:**
- For version control clarity (optional)
- To keep config in sync with reality (optional)
- **But it's not required!**

---

## First-Time Submission Checklist

Before you can submit, you need:

### ✅ **1. App Build**
- Build uploaded via `yarn deploy:staging` or `yarn deploy:production`
- Build processed in App Store Connect (~5-10 min after upload)
- Build appears in "Add Build" dropdown

### ✅ **2. App Information** (in App Store Connect)
- [ ] App name: `Mazunte Connect`
- [ ] Primary language: English (U.K.) or English (U.S.)
- [ ] Bundle ID: `com.mazunte.connect` (already set)
- [ ] SKU: Any unique identifier (e.g., `mazunte-connect-001`)

### ✅ **3. Screenshots** (Required!)
- [ ] At least 1 iPhone screenshot (6.5" display)
  - Size: 1242 × 2688px or 1284 × 2778px
  - Can upload up to 10 screenshots
- [ ] Optional: iPad screenshots
- [ ] Optional: Apple Watch screenshots

### ✅ **4. App Description**
- [ ] Promotional text (170 characters) - Optional
- [ ] Description (4,000 characters) - **Required**
- [ ] Keywords (100 characters) - **Required**
- [ ] Support URL - **Required**
- [ ] Marketing URL - Optional

### ✅ **5. Version Information**
- [ ] Version: `1.0.2` (or whatever is in your `app.config.js`)
- [ ] Copyright: `© 2025 [Your Name or Company]`

### ✅ **6. App Review Information**
- [ ] Contact information (first name, last name, phone, email)
- [ ] Notes for reviewer (optional but helpful)
- [ ] Demo account credentials (if your app requires login)

### ✅ **7. Content Rights & Age Rating**
- [ ] Complete age rating questionnaire
- [ ] Content rights declaration

---

## Step-by-Step Setup

### **Step 1: Upload Your Build**

If you haven't already:

```bash
# For staging (quick)
yarn deploy:staging

# Or for production (proper)
yarn deploy:production
```

Wait ~15-25 minutes for:
1. Build to complete
2. Upload to App Store Connect
3. Processing to finish

### **Step 2: Wait for Build to Process**

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Mazunte Connect**
3. Go to **TestFlight** → **iOS Builds**
4. Wait until status shows **"Ready to Submit"** (not "Processing")

This usually takes **5-10 minutes** after upload completes.

### **Step 3: Add Build to Version**

1. Go to **App Store** → **iOS App** → **1.0 Prepare for Submission**
2. Scroll to **Build** section
3. Click **"+ Add Build"**
4. Select your build from dropdown:
   - Example: `1.0.2 (34)` - version (build number)
5. Click **"Done"**

**If no build appears:**
- Build is still processing (wait 5-10 more minutes)
- Build failed processing (check TestFlight for errors)
- Export compliance not answered (see below)

### **Step 4: Export Compliance** (Important!)

After adding the build, you'll see an **"Export Compliance"** warning.

**Answer these questions:**

1. **"Is your app designed to use cryptography or does it contain or incorporate cryptography?"**
   - Answer: **Yes** (your app uses HTTPS)

2. **"Does your app qualify for any of the exemptions?"**
   - Answer: **Yes**
   - Select: **"App uses encryption for standard connectivity like HTTPS"**

This is required for all apps using HTTPS (which is basically every app).

### **Step 5: Generate Screenshots**

You need at least one iPhone screenshot. See [Generating Screenshots](#generating-screenshots) section below.

### **Step 6: Fill in Required Metadata**

In App Store Connect, fill in:

#### **Promotional Text** (Optional)
```
Connect with your community in Mazunte. Share events, discover places, and stay in touch.
```

#### **Description** (Required - Example)
```
Mazunte Connect brings your community together.

FEATURES:
• Share and discover local events
• Find nearby places and services
• Connect with community members
• Stay updated with local news
• Private messaging and groups

Perfect for residents and visitors of Mazunte who want to stay connected with their community.

SAFETY & PRIVACY:
Your data is secure and never sold to third parties. See our privacy policy for details.

SUPPORT:
Questions or feedback? Contact us at support@mazunte.com
```

#### **Keywords** (Required - Example)
```
community,social,events,local,mazunte,connect,network,messaging,groups,discover
```

#### **Support URL** (Required)
```
https://mazunte.com/support
```
(Or use your website/email if you don't have a support page yet)

#### **Marketing URL** (Optional)
```
https://mazunte.com
```

### **Step 7: App Review Information**

Fill in contact information:
- First name
- Last name
- Phone number
- Email address

**Notes for Reviewer** (Helpful!):
```
Thank you for reviewing Mazunte Connect!

DEMO ACCOUNT:
Email: demo@mazunte.com
Password: Demo123!

TESTING NOTES:
- Sign in with the demo account above
- Google Sign-In is enabled but optional
- Main features: Browse events, view places, send messages
- Location permissions are optional

Please let us know if you have any questions!
```

### **Step 8: Release Options**

Choose when to release:
- **Automatically release this version**: App goes live immediately after approval
- **Manually release this version**: You control when to publish (recommended for first release)

**Recommendation:** Choose **"Manually release"** for your first submission so you can:
- Review the approval decision
- Prepare marketing materials
- Choose the perfect release timing

### **Step 9: Submit for Review**

1. Click **"Add for Review"** (top right)
2. Review all information
3. Click **"Submit for Review"**

**What happens next:**
1. **"Waiting for Review"** - App is in queue (~1-2 days)
2. **"In Review"** - Apple is reviewing (~1-2 days)
3. **"Approved"** or **"Rejected"** - You'll get an email

---

## Generating Screenshots

### **Option 1: Use Simulator (Recommended)**

1. Open your app in simulator:
   ```bash
   yarn ios --device  # Or use Simulator
   ```

2. Navigate to your best screens (home, events, profile, etc.)

3. Take screenshots:
   - **macOS:** `Cmd + S` (saves to Desktop)
   - **Simulator menu:** Device → Screenshot

4. Use correct device:
   - iPhone 14 Pro Max (6.7" display)
   - iPhone 14 Plus (6.7" display)
   - iPhone 13 Pro Max (6.5" display)

### **Option 2: Use Real Device**

1. Run app on your iPhone:
   ```bash
   yarn ios --device
   ```

2. Take screenshots:
   - **iPhone:** Press `Side Button + Volume Up`

3. AirDrop to your Mac

4. Resize if needed (must be exact dimensions)

### **Screenshot Requirements**

**iPhone 6.5" Display** (Most common):
- Size: **1242 × 2688px** (Portrait) or **2688 × 1242px** (Landscape)
- Or: **1284 × 2778px** (iPhone 14 Pro Max)
- Format: PNG or JPG
- Max file size: 500 KB per screenshot

**What to show:**
- Best features of your app
- Clear, high-quality images
- Avoid text-heavy screenshots
- Show the app in action

**Pro tip:** First 3 screenshots are most important - they appear on install sheets!

### **Option 3: Use Screenshot Tools**

Tools like **Fastlane Snapshot** can automate this:
```bash
# Not set up yet, but can be added later
fastlane snapshot
```

---

## Common Issues

### **Issue: No Build in "Add Build" Dropdown**

**Causes:**
1. Build still processing (wait 10 more minutes)
2. Build failed processing
3. Export compliance not answered
4. Build uploaded to wrong account

**Solutions:**
- Check **TestFlight** → **iOS Builds** for build status
- Wait for status: **"Ready to Submit"**
- Answer export compliance questions
- Verify you're in correct App Store Connect account

---

### **Issue: "Missing Compliance" Warning**

**Solution:** Answer export compliance questions (see Step 4 above)

This is required for ALL apps, even if you're just using HTTPS.

---

### **Issue: Screenshot Wrong Size**

**Solution:** Use exact dimensions:
- iPhone 6.5": **1242 × 2688px** or **1284 × 2778px**

Use image editing tool to resize:
```bash
# macOS Preview:
# Tools → Adjust Size → Enter exact dimensions
```

---

### **Issue: "App Uses Non-Exempt Encryption"**

**Solution:**
1. Your app.config.js should have:
   ```javascript
   ios: {
     infoPlist: {
       ITSAppUsesNonExemptEncryption: false
     }
   }
   ```

2. This is already set in your config! ✅

---

### **Issue: Rejected for Lack of Content**

**Solution:**
- Make sure your app has demo content
- Provide test account with access to content
- Explain what reviewers should test in "Notes for Reviewer"

---

## Quick Reference

### **Screenshot Sizes**

| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPhone 6.5" | 1242 × 2688px | 2688 × 1242px |
| iPhone 6.7" | 1284 × 2778px | 2778 × 1284px |
| iPad Pro 12.9" | 2048 × 2732px | 2732 × 2048px |

### **Required Fields Checklist**

- [ ] At least 1 screenshot (iPhone 6.5" or 6.7")
- [ ] Description (max 4,000 characters)
- [ ] Keywords (max 100 characters, comma-separated)
- [ ] Support URL
- [ ] Version number
- [ ] Copyright
- [ ] Build added
- [ ] Export compliance answered
- [ ] Contact information filled
- [ ] Age rating completed

### **Build Status Meanings**

| Status | Meaning |
|--------|---------|
| **Processing** | EAS is building your app |
| **Waiting for Upload** | Build completed, uploading to Apple |
| **Processing** (Apple) | Apple is processing your build |
| **Ready to Submit** | Build ready to add to version |
| **Invalid Binary** | Build failed Apple's validation |

### **Review Timeline**

| Stage | Typical Duration |
|-------|-----------------|
| Build upload | 20-30 minutes |
| Apple processing | 5-10 minutes |
| Waiting for Review | 1-2 days |
| In Review | 1-2 days |
| **Total** | **2-4 days** |

### **After Approval**

**If you chose "Manual Release":**
1. You'll get approval email
2. Go to App Store Connect
3. Click **"Release This Version"**
4. App goes live in ~24 hours

**If you chose "Automatic Release":**
- App goes live automatically after approval
- Usually within 1-2 hours

---

## Version Management for Future Releases

### **For Staging (Beta Testing)**

```bash
# Don't change version - just build and submit
yarn deploy:staging
```

Staging builds use same version number with incremented build numbers:
- `1.0.2 (34)`
- `1.0.2 (35)`
- `1.0.2 (36)`

### **For Production (Public Release)**

```bash
# 1. Bump version in app.config.js
nano apps/expo/app.config.js
# Change: version: '1.0.2' → '1.1.0'

# 2. Commit version bump
git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.1.0"
git push

# 3. Build and submit
yarn deploy:production
```

See [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md) for complete version strategy.

---

## Useful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Screenshot Specifications](https://help.apple.com/app-store-connect/#/devd274dd925)
- [Export Compliance Documentation](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations)
- [Sentry Dashboard](https://sentry.io/organizations/inner-ascend/projects/react-native/)

---

## Related Documentation

- [RELEASE_WORKFLOW.md](./RELEASE_WORKFLOW.md) - Complete build and release guide
- [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md) - Version bumping strategy
- [SENTRY_SETUP.md](../apps/expo/SENTRY_SETUP.md) - Sentry configuration

---

## Support

**Questions?** Check the related documentation above or ask in the team chat.

**First submission?** Don't worry - Apple's review team is helpful. If rejected, they'll explain why and you can resubmit quickly.

Good luck with your first App Store submission! 🚀
