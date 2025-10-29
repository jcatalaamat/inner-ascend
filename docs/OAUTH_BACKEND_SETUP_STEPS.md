# OAuth Backend Setup - Step by Step Guide

This is your actionable checklist for setting up Google and Apple Sign-In credentials.

---

## Part 1: Google Cloud Console Setup

### Step 1: Create/Select Google Cloud Project

1. Visit: https://console.cloud.google.com
2. Click the project dropdown (top left)
3. Click **"NEW PROJECT"**
   - **Project name**: "Inner Ascend" (or your preference)
   - **Organization**: (Leave default)
   - Click **"CREATE"**
4. Wait for project to be created (~10 seconds)
5. Ensure new project is selected in dropdown

### Step 2: Enable Google+ API

1. In Google Cloud Console, open the menu (≡)
2. Navigate to: **APIs & Services → Library**
3. Search for: **"Google+ API"**
4. Click the **Google+ API** result
5. Click **"ENABLE"** button
6. Wait for API to enable

### Step 3: Configure OAuth Consent Screen

1. Navigate to: **APIs & Services → OAuth consent screen**
2. Select **"External"** user type
3. Click **"CREATE"**

**Page 1: App Information**
- **App name**: `Inner Ascend`
- **User support email**: Select your email from dropdown
- **App logo**: (Optional - skip for now)
- **App domain** section: (Skip all - leave blank)
- **Developer contact information**: Enter your email
- Click **"SAVE AND CONTINUE"**

**Page 2: Scopes**
- Click **"ADD OR REMOVE SCOPES"**
- Select these scopes (scroll through the list):
  - ✓ `.../auth/userinfo.email`
  - ✓ `.../auth/userinfo.profile`
  - ✓ `openid`
- Click **"UPDATE"**
- Click **"SAVE AND CONTINUE"**

**Page 3: Test Users** (Optional for now)
- Click **"ADD USERS"**
- Add your personal Gmail address
- Click **"ADD"**
- Click **"SAVE AND CONTINUE"**

**Page 4: Summary**
- Review your settings
- Click **"BACK TO DASHBOARD"**

### Step 4: Create iOS OAuth Client ID

1. Navigate to: **APIs & Services → Credentials**
2. Click **"+ CREATE CREDENTIALS"** (top of page)
3. Select **"OAuth client ID"**
4. **Application type**: Select **"iOS"**
5. **Name**: `Inner Ascend iOS`
6. **Bundle ID**: `com.innerascend.app`
   - ⚠️ **CRITICAL**: Must exactly match your app's bundle ID
   - No typos! Case-sensitive!
7. Click **"CREATE"**

**Save the iOS Client ID:**
- A popup appears with your **OAuth client created**
- **Copy the entire Client ID**
  - Format: `123456789-abcdefghijk.apps.googleusercontent.com`
  - Save this in a text file as: `GOOGLE_IOS_CLIENT_ID`
- Also create the **iOS URL Scheme** by reversing it:
  - Take: `123456789-abcdefghijk.apps.googleusercontent.com`
  - Becomes: `com.googleusercontent.apps.123456789-abcdefghijk`
  - Save this as: `GOOGLE_IOS_SCHEME`
- Click **"OK"**

### Step 5: Create Web OAuth Client ID

1. Still in **APIs & Services → Credentials**
2. Click **"+ CREATE CREDENTIALS"** again
3. Select **"OAuth client ID"**
4. **Application type**: Select **"Web application"**
5. **Name**: `Inner Ascend Web (for Supabase)`

**Authorized redirect URIs:**
6. Click **"+ ADD URI"** under **Authorized redirect URIs**
7. Add these two URIs:
   ```
   http://localhost:54321/auth/v1/callback
   ```
   Click **"+ ADD URI"** again
   ```
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   ```

   **To find YOUR_SUPABASE_PROJECT_REF:**
   - Open Supabase Dashboard: https://supabase.com/dashboard
   - Select your Inner Ascend project
   - Look at the URL or Settings → General → Reference ID
   - Example: `ddbuvzotcasyanocqcsh`
   - Full URL: `https://ddbuvzotcasyanocqcsh.supabase.co/auth/v1/callback`

8. **Authorized JavaScript origins**: Leave empty
9. Click **"CREATE"**

**Save the Web credentials:**
- A popup appears with your credentials
- **Client ID**: Copy the full ID
  - Format: `987654321-xyzabcdefg.apps.googleusercontent.com`
  - Save as: `GOOGLE_WEB_CLIENT_ID`
- **Client secret**: Copy the secret
  - Format: `GOCSPX-AbCdEf123456_SecretString`
  - Save as: `GOOGLE_SECRET`
  - ⚠️ **IMPORTANT**: Keep this secret! Never commit to git!
- Click **"OK"**

**✅ You now have all 4 Google credentials!**

---

## Part 2: Apple Developer Setup

### Requirements

- [ ] Apple Developer Account (https://developer.apple.com)
- [ ] $99/year membership (required for Sign in with Apple)
- [ ] Access to Certificates, Identifiers & Profiles

### Step 1: Configure App ID with Sign in with Apple

1. Visit: https://developer.apple.com/account
2. Navigate to: **Certificates, Identifiers & Profiles**
3. Click **"Identifiers"** in the sidebar
4. Find your app's App ID:
   - Look for: `com.innerascend.app`
   - If it doesn't exist, create it:
     - Click **"+"** button
     - Select **"App IDs"** → Continue
     - Select **"App"** → Continue
     - Description: `Inner Ascend`
     - Bundle ID: `com.innerascend.app`
     - Continue to Capabilities section (see below)

5. Click on your App ID to edit it
6. Scroll to **Capabilities**
7. Find **"Sign in with Apple"** in the list
8. Check the box: ☑️ **Sign in with Apple**
9. Click **"Save"** (top right)
10. Click **"Confirm"** in the popup

**✅ Apple Sign-In is now enabled for your app!**

### Step 2: Verify Xcode Configuration (Automatic)

Your `app.config.js` is already configured:
```javascript
ios: {
  usesAppleSignIn: true,
  entitlements: {
    'com.apple.developer.applesignin': ['Default'],
  },
}
```

When you run `npx expo prebuild`, this entitlement is automatically added to your iOS project.

**No additional Apple backend setup needed for native iOS!**

### Optional: Web Apple Sign-In Setup

If you want Apple Sign-In on web (not required for native app):

1. Create a Services ID in Apple Developer Portal
2. Configure Sign in with Apple for the Services ID
3. Add domain and redirect URLs
4. Configure in Supabase Dashboard

**Recommendation**: Skip web Apple Sign-In for now. Native iOS works automatically!

---

## Part 3: Supabase Dashboard Configuration

### Step 1: Navigate to Google Provider Settings

1. Visit: https://supabase.com/dashboard
2. Select your **Inner Ascend** project
3. Click **"Authentication"** in left sidebar (🔐 icon)
4. Click **"Providers"** tab
5. Scroll down to find **"Google"** in the provider list
6. Click on **"Google"** to expand it

### Step 2: Enable and Configure Google Provider

1. Toggle the switch: **Enable Sign in with Google** → ON (should turn green)

2. Fill in **Client ID (for OAuth)**:
   - Paste your `GOOGLE_WEB_CLIENT_ID`
   - Example: `987654321-xyzabcdefg.apps.googleusercontent.com`

3. Fill in **Client Secret (for OAuth)**:
   - Paste your `GOOGLE_SECRET`
   - Example: `GOCSPX-AbCdEf123456_SecretString`

4. **Skip nonce check**: ☑️ **Enable this checkbox**
   - This is CRITICAL for native Google Sign-In to work!
   - Without this, native iOS sign-in will fail

5. **Authorized Client IDs**: (This is important!)
   - Click the field or **"+ Add"** button
   - Paste your `GOOGLE_IOS_CLIENT_ID`
   - Example: `123456789-abcdefghijk.apps.googleusercontent.com`
   - Press Enter to add it to the list

6. Click **"Save"** at the bottom

### Step 3: Verify Redirect URLs (Authentication Settings)

1. Stay in **Authentication** section
2. Click **"URL Configuration"** tab (or look for it in settings)
3. Verify these settings:

   **Site URL**:
   - Development: `http://localhost:3000`
   - (Update to production URL later)

   **Redirect URLs** (should include):
   - `http://localhost:3000/**`
   - `innerascend://**`
   - `com.innerascend.app://**`
   - Your production URL when ready

4. If any are missing, add them and click **"Save"**

### Step 4: Optional - Enable Apple Provider for Web

If you set up Apple Services ID (optional):

1. Find **"Apple"** in the Providers list
2. Toggle to enable
3. Add Services ID and key information
4. See Supabase docs: https://supabase.com/docs/guides/auth/social-login/auth-apple

**For native iOS, this step is NOT required!**

**✅ Supabase is now configured!**

---

## Part 4: Update Your App Configuration

### Step 1: Create/Update `.env` File

1. Open your project in Terminal/VS Code
2. Navigate to project root: `/Users/astralamat/Documents/Code/inner-ascend`
3. Copy the example file:
   ```bash
   cp .env.example .env
   ```

4. Open `.env` in a text editor
5. Find the Google OAuth section (lines 16-52)
6. Replace the placeholder values with your actual credentials:

```bash
# Replace these with your actual values from Google Cloud Console:
GOOGLE_IOS_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_IOS_SCHEME=com.googleusercontent.apps.123456789-abcdefghijk
GOOGLE_WEB_CLIENT_ID=987654321-xyzabcdefg.apps.googleusercontent.com
GOOGLE_SECRET=GOCSPX-AbCdEf123456_SecretString
```

7. **Double-check**:
   - [ ] iOS Client ID ends with `.apps.googleusercontent.com`
   - [ ] iOS Scheme starts with `com.googleusercontent.apps.`
   - [ ] Web Client ID ends with `.apps.googleusercontent.com`
   - [ ] Secret starts with `GOCSPX-`
   - [ ] No quotes around values
   - [ ] No spaces before/after `=`

8. Save the file

### Step 2: Verify `.env` is in `.gitignore`

1. Open `.gitignore` file
2. Ensure it contains: `.env`
3. This prevents committing secrets to git!

### Step 3: Rebuild Native Projects

Run these commands to apply your new configuration:

```bash
# Clean rebuild with new environment variables
npx expo prebuild --clean --skip-dependency-update react-native,react

# If on Mac with iOS development:
cd apps/expo/ios
pod install
cd ../../..
```

**Why rebuild?**
- The `.env` values are embedded into native projects during prebuild
- URL schemes are added to iOS Info.plist
- Google Sign-In plugin is configured

**✅ App is now configured with your OAuth credentials!**

---

## Part 5: Testing

### Quick Test (iOS Simulator)

1. Start the development server:
   ```bash
   npx expo run:ios
   ```

2. When app opens:
   - Navigate to the Sign-In screen
   - You should see **"Continue with Google"** button
   - You should see **"Continue with Apple"** button (iOS only)

3. Test Google Sign-In:
   - Tap **"Continue with Google"**
   - Native Google sign-in sheet should appear
   - Select a Google account
   - Grant permissions (first time)
   - Should sign in successfully! ✅

4. Test Apple Sign-In:
   - Ensure simulator is signed into Apple ID:
     - Settings app → Sign in to your iPhone
   - Tap **"Continue with Apple"**
   - Native Apple sign-in sheet appears
   - Authenticate with Face ID/password
   - Should sign in successfully! ✅

### Verify in Supabase Dashboard

1. Go to: **Authentication → Users**
2. You should see your test users listed
3. Check the **Provider** column shows "google" or "apple"

**✅ OAuth is working!**

### Troubleshooting

**"Developer Error" or "Error 10"**
→ Bundle ID mismatch or URL scheme issue
→ Solution: Verify bundle ID is exactly `com.innerascend.app` in Google Cloud Console
→ Re-run `npx expo prebuild --clean`

**"Invalid audience"**
→ iOS Client ID not whitelisted
→ Solution: Add iOS Client ID to Supabase "Authorized Client IDs"

**Apple button not appearing**
→ Normal! Apple Sign-In is iOS-only
→ Check: `Platform.OS === 'ios'`

**More troubleshooting**: See [docs/OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md#troubleshooting)

---

## Summary of Credentials Created

By the end of this guide, you should have:

**From Google Cloud Console:**
- ✅ Google+ API enabled
- ✅ OAuth consent screen configured
- ✅ iOS Client ID created
- ✅ Web Client ID created
- ✅ Client Secret obtained

**From Apple Developer:**
- ✅ App ID with Sign in with Apple capability

**In Supabase Dashboard:**
- ✅ Google provider enabled
- ✅ Web credentials configured
- ✅ iOS Client ID whitelisted
- ✅ Skip nonce check enabled

**In Your App:**
- ✅ `.env` file with 4 Google credentials
- ✅ Native projects rebuilt
- ✅ Ready to test!

---

## Checklist: Am I Ready to Test?

Before testing, verify:

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] iOS OAuth Client ID created (bundle ID: `com.innerascend.app`)
- [ ] Web OAuth Client ID created with redirect URIs
- [ ] Supabase Google provider enabled
- [ ] Web credentials added to Supabase
- [ ] iOS Client ID in Supabase "Authorized Client IDs"
- [ ] "Skip nonce check" enabled in Supabase
- [ ] `.env` file updated with all 4 credentials
- [ ] `npx expo prebuild --clean` executed
- [ ] Apple Sign in with Apple capability enabled in App ID

**If all checked: You're ready to test! 🚀**

---

## Next Steps

1. **Test thoroughly**: [docs/OAUTH_TESTING_CHECKLIST.md](./OAUTH_TESTING_CHECKLIST.md)
2. **Production setup**: Update redirect URIs for production domains
3. **Publish OAuth consent**: Change from "Testing" to "Published" in Google Cloud
4. **Monitor**: Check Supabase auth logs for issues

---

## Time Estimate

- Google Cloud setup: 15 minutes
- Apple Developer setup: 5 minutes
- Supabase configuration: 5 minutes
- App configuration: 2 minutes
- Rebuild and test: 5 minutes
- **Total: ~30 minutes**

---

## Support Links

- Google Cloud Console: https://console.cloud.google.com
- Apple Developer Portal: https://developer.apple.com
- Supabase Dashboard: https://supabase.com/dashboard
- React Native Google Sign-In Docs: https://react-native-google-signin.github.io/docs/

---

**You've got this! Follow the steps and you'll have working OAuth in 30 minutes. 🎉**
