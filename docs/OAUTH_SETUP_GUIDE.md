# OAuth Setup Guide for Inner Ascend

This guide walks you through setting up Google Sign-In and Apple Sign-In for the Inner Ascend app.

## Table of Contents

1. [Overview](#overview)
2. [Google Sign-In Setup](#google-sign-in-setup)
3. [Apple Sign-In Setup](#apple-sign-in-setup)
4. [Supabase Configuration](#supabase-configuration)
5. [Local Development Setup](#local-development-setup)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### What's Already Implemented

✅ **Native Google Sign-In** (iOS/Android)
- Full implementation using `@react-native-google-signin/google-signin`
- Token-based authentication with Supabase
- Proper error handling

✅ **Native Apple Sign-In** (iOS)
- Full implementation using `expo-apple-authentication`
- Nonce-based security
- Native Apple button styling

✅ **Web OAuth** (Basic)
- Standard OAuth redirect flow for both providers

### What You Need to Do

1. Create OAuth credentials in Google Cloud Console
2. Enable Apple Sign-In in Apple Developer Account
3. Configure Supabase Dashboard
4. Add credentials to `.env` file
5. Test on devices/simulators

---

## Google Sign-In Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
   - Project name: "Inner Ascend" (or your choice)
3. Enable **Google+ API** (required for sign-in)
   - Navigation Menu → APIs & Services → Library
   - Search for "Google+ API"
   - Click "Enable"

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace organization)
3. Fill in the required fields:
   - **App name**: Inner Ascend
   - **User support email**: Your email
   - **App logo**: (Optional) Upload your app icon
   - **App domain**: (Leave blank for now, add later when you have a domain)
   - **Developer contact information**: Your email
4. Click **Save and Continue**
5. **Scopes**: Click **Add or Remove Scopes**
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
   - Add: `openid`
   - Click **Update** then **Save and Continue**
6. **Test users**: (Optional for testing phase)
   - Add your Google account email
   - Click **Save and Continue**
7. Click **Back to Dashboard**

### Step 3: Create iOS OAuth Client ID

1. Go to **APIs & Services → Credentials**
2. Click **+ CREATE CREDENTIALS → OAuth client ID**
3. Choose **iOS** as the application type
4. Fill in the details:
   - **Name**: Inner Ascend iOS
   - **Bundle ID**: `com.innerascend.app`
     - ⚠️ **IMPORTANT**: This must exactly match your app's bundle ID
5. Click **Create**
6. A dialog appears with your **Client ID**
   - Format: `XXXXXXXXX-YYYYYYYY.apps.googleusercontent.com`
   - **Copy this** - you'll need it for `GOOGLE_IOS_CLIENT_ID`
   - The reversed format is for `GOOGLE_IOS_SCHEME`: `com.googleusercontent.apps.XXXXXXXXX-YYYYYYYY`

### Step 4: Create Web OAuth Client ID

1. Still in **APIs & Services → Credentials**
2. Click **+ CREATE CREDENTIALS → OAuth client ID** again
3. Choose **Web application** as the application type
4. Fill in the details:
   - **Name**: Inner Ascend Web (for Supabase)
   - **Authorized JavaScript origins**: (Leave empty for now)
   - **Authorized redirect URIs**: Add these URLs:
     ```
     http://localhost:54321/auth/v1/callback
     https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
     - You can find this in your Supabase Dashboard URL
     - Example: `https://ddbuvzotcasyanocqcsh.supabase.co/auth/v1/callback`
5. Click **Create**
6. A dialog appears with:
   - **Client ID**: Copy this for `GOOGLE_WEB_CLIENT_ID`
   - **Client Secret**: Copy this for `GOOGLE_SECRET`
   - ⚠️ **IMPORTANT**: Keep the Client Secret secure! Never commit it to version control.

### Step 5: Update Your `.env` File

Copy `.env.example` to `.env` if you haven't already:

```bash
cp .env.example .env
```

Then update these values in `.env`:

```bash
# Example values (replace with your actual credentials)
GOOGLE_IOS_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
GOOGLE_IOS_SCHEME=com.googleusercontent.apps.123456789-abc123xyz
GOOGLE_WEB_CLIENT_ID=987654321-xyz789abc.apps.googleusercontent.com
GOOGLE_SECRET=GOCSPX-Abc123XyZ789-SecretString
```

**Where to find each value:**
- `GOOGLE_IOS_CLIENT_ID`: From iOS client credential (Step 3)
- `GOOGLE_IOS_SCHEME`: Reverse of iOS Client ID (replace `.apps.googleusercontent.com` at start with `com.googleusercontent.apps.`)
- `GOOGLE_WEB_CLIENT_ID`: From Web client credential (Step 4)
- `GOOGLE_SECRET`: From Web client credential secret (Step 4)

---

## Apple Sign-In Setup

### Step 1: Apple Developer Account

1. You need an **Apple Developer Account** ($99/year)
2. Go to [Apple Developer Portal](https://developer.apple.com)

### Step 2: Configure App ID

1. Go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** in the sidebar
3. Find your app's App ID or create a new one:
   - **App ID**: `com.innerascend.app`
4. Edit the App ID:
   - Scroll to **Capabilities**
   - Enable **Sign in with Apple**
   - Click **Save**

### Step 3: Configure in Expo

Good news! Your `app.config.js` is already configured:

```javascript
ios: {
  usesAppleSignIn: true,
  entitlements: {
    'com.apple.developer.applesignin': ['Default'],
  },
}
```

This is automatically included in your iOS build.

### Step 4: Testing Apple Sign-In

**Important Notes:**
- Apple Sign-In **only works on physical iOS devices** or simulators signed in with an Apple ID
- You need to be enrolled in the Apple Developer Program
- The app must be signed with a provisioning profile that includes the Sign in with Apple capability

---

## Supabase Configuration

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **Inner Ascend** project
3. Navigate to **Authentication** → **Providers** in the left sidebar

### Step 2: Configure Google Provider

1. Find **Google** in the list of providers
2. Click to expand it
3. Toggle **Enable Sign in with Google** to ON
4. Fill in the credentials:
   - **Client ID (for OAuth)**: Paste your `GOOGLE_WEB_CLIENT_ID`
   - **Client Secret (for OAuth)**: Paste your `GOOGLE_SECRET`
5. **Skip nonce check**: ✅ Enable this (required for native Google Sign-In)
   - This allows the native flow to work without generating a nonce
6. **Authorized Client IDs**: Add your `GOOGLE_IOS_CLIENT_ID`
   - This whitelists your iOS app to exchange tokens
7. Click **Save**

### Step 3: Configure Apple Provider (Optional - for Web)

If you want Apple Sign-In on web:

1. Find **Apple** in the list of providers
2. Toggle **Enable Sign in with Apple** to ON
3. You'll need to create a **Services ID** in Apple Developer Portal
4. Follow Supabase's guide: [Apple OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-apple)

**Note**: Native iOS Apple Sign-In works automatically without Supabase configuration!

### Step 4: Verify Redirect URLs

1. Still in **Authentication** → **URL Configuration**
2. Ensure these redirect URLs are allowed:
   - Site URL: `http://localhost:3000` (for local development)
   - Redirect URLs:
     - `http://localhost:3000` (web dev)
     - `innerascend://` (deep link for mobile)
     - `com.innerascend.app://` (alternative deep link)

---

## Local Development Setup

### Step 1: Install Dependencies (Already Done!)

Your project already has all required dependencies:
- `@react-native-google-signin/google-signin` v16.0.0
- `expo-apple-authentication` v7.2.4
- `expo-crypto` v14.1.5

### Step 2: Update Native Projects

After updating `.env` with your credentials, rebuild the native projects:

```bash
# Clean prebuild
npx expo prebuild --clean --skip-dependency-update react-native,react

# Or use your project's script if available
yarn expo:prebuild:clean
```

This regenerates the iOS and Android projects with your new OAuth configuration.

### Step 3: Install iOS Pods (iOS Only)

```bash
cd apps/expo/ios
pod install
cd ../../..
```

### Step 4: Start Development Server

```bash
# Start Expo dev server
npx expo start

# Or run directly on iOS
npx expo run:ios
```

### Step 5: Start Local Supabase (for local testing)

```bash
npx supabase start
```

Make sure your `.env` has the local Supabase URL and keys.

---

## Testing

### Testing Checklist

#### iOS Google Sign-In

1. **Start the app on iOS simulator or device**
   ```bash
   npx expo run:ios
   ```

2. **Navigate to Sign-In screen**

3. **Tap "Continue with Google" button**

4. **Expected flow:**
   - Google Sign-In sheet appears (native iOS UI)
   - Select/sign in with Google account
   - Consent screen (first time only)
   - App should log you in
   - You should be redirected to the main app

5. **Verify in Supabase Dashboard:**
   - Go to **Authentication** → **Users**
   - Your Google account should appear
   - Provider should show "google"

#### iOS Apple Sign-In

1. **Requirements:**
   - Physical iOS device OR simulator signed into Apple ID
   - Provisioning profile with Sign in with Apple capability

2. **Navigate to Sign-In screen**

3. **Tap "Continue with Apple" button**

4. **Expected flow:**
   - Apple Sign-In sheet appears (native iOS UI)
   - Face ID/Touch ID authentication
   - Name/email sharing options (first time only)
   - App should log you in

5. **Verify in Supabase Dashboard:**
   - User appears with provider "apple"

#### Android Google Sign-In (when testing Android)

1. **Additional setup required:**
   - Generate SHA-1 certificate fingerprint
   - Add Android OAuth client in Google Cloud Console
   - See: [React Native Google Sign-In Android Setup](https://react-native-google-signin.github.io/docs/setting-up/android)

2. **Test flow similar to iOS**

### Common Test Scenarios

1. **First-time sign-in**: New account created in Supabase
2. **Returning user**: Existing session restored
3. **Sign out and sign in again**: New session created
4. **Cancel sign-in**: App handles gracefully without crash
5. **Network error**: Error message displayed to user
6. **Invalid credentials**: Error handled (shouldn't happen with OAuth)

---

## Troubleshooting

### Google Sign-In Issues

#### Error: "Developer Error" or "Error 10"

**Cause**: Bundle ID mismatch between Google Cloud Console and your app

**Solution**:
1. Verify your app's bundle ID matches exactly: `com.innerascend.app`
2. Check in `app.config.js`: `ios.bundleIdentifier`
3. Delete and recreate iOS OAuth client in Google Cloud Console
4. Run `npx expo prebuild --clean`

#### Error: "Sign in cancelled by user"

**Cause**: User cancelled the sign-in flow (this is normal)

**Solution**: This is expected behavior, not an error. Handle gracefully in UI.

#### Error: "DEVELOPER_ERROR" with hash

**Cause**: iOS URL scheme not configured properly

**Solution**:
1. Verify `GOOGLE_IOS_SCHEME` in `.env` is correct
2. Check `app.config.js` has the URL scheme in `ios.infoPlist.CFBundleURLTypes`
3. Run `npx expo prebuild --clean`

#### Error: "Invalid audience" or "Token verification failed"

**Cause**: Web Client ID not whitelisted in Supabase

**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Add your `GOOGLE_IOS_CLIENT_ID` to **Authorized Client IDs**
3. Ensure **Skip nonce check** is enabled

### Apple Sign-In Issues

#### Button not appearing

**Cause**: Not on iOS device/simulator

**Solution**: Apple Sign-In is iOS-only. The code checks `Platform.OS === 'ios'`

#### Error: "Not available"

**Cause**: Simulator not signed into Apple ID

**Solution**:
1. Open iOS Simulator
2. Settings → Sign in to your iPhone
3. Sign in with your Apple ID

#### Error: "Sign in failed"

**Cause**: Provisioning profile missing Sign in with Apple capability

**Solution**:
1. Ensure App ID has Sign in with Apple enabled in Apple Developer Portal
2. Regenerate provisioning profile
3. Re-sign the app

### Supabase Issues

#### Error: "Invalid login credentials"

**Cause**: OAuth provider not enabled in Supabase

**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Verify Google is enabled
3. Verify credentials are entered correctly

#### Error: "Redirect URL not whitelisted"

**Cause**: Your app's redirect URL isn't in Supabase's allowed list

**Solution**:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your app's deep link: `innerascend://`
3. Add: `com.innerascend.app://`

#### Local Supabase not working

**Cause**: Environment variables pointing to wrong Supabase instance

**Solution**:
1. Check `.env` has correct URLs:
   - Local: `http://localhost:54321`
   - Production: `https://YOUR_REF.supabase.co`
2. Ensure `npx supabase start` is running
3. Check `supabase/config.toml` has `enabled = true` for Google

---

## Architecture Overview

### Native Google Sign-In Flow

```
1. User taps "Continue with Google"
   ↓
2. GoogleSignin.configure() with iOS/Web Client IDs
   ↓
3. GoogleSignin.signIn() - Shows native Google picker
   ↓
4. User authenticates with Google
   ↓
5. App receives ID token from Google
   ↓
6. App sends token to Supabase via signInWithIdToken()
   ↓
7. Supabase verifies token with Google (using Web Client ID)
   ↓
8. Supabase creates/updates user and returns session
   ↓
9. App stores session in ExpoSecureStore
   ↓
10. User is logged in!
```

**Why skip_nonce_check is needed:**
- Native sign-in generates ID token directly from Google
- No nonce is included in this flow (unlike web OAuth flow)
- Supabase must skip nonce verification for native tokens
- Still secure because Google validates the token

### Native Apple Sign-In Flow

```
1. User taps "Continue with Apple"
   ↓
2. Generate random nonce (UUID)
   ↓
3. Hash nonce with SHA256
   ↓
4. AppleAuthentication.signInAsync() with hashed nonce
   ↓
5. User authenticates with Face ID/Touch ID
   ↓
6. App receives identity token and original nonce
   ↓
7. App sends both to Supabase via signInWithIdToken()
   ↓
8. Supabase verifies token with Apple (validates nonce matches)
   ↓
9. Supabase creates/updates user and returns session
   ↓
10. User is logged in!
```

**Why nonce is required for Apple:**
- Apple's security model requires nonce for replay attack prevention
- Must hash before sending to Apple, send raw with token to Supabase
- Supabase validates that token's nonce matches what was used

---

## File Reference

### Implementation Files

- **Native Google Sign-In**: [packages/app/features/auth/components/GoogleSignIn.native.tsx](../packages/app/features/auth/components/GoogleSignIn.native.tsx)
- **Native Apple Sign-In**: [packages/app/features/auth/components/AppleSignIn.native.tsx](../packages/app/features/auth/components/AppleSignIn.native.tsx)
- **Web Google Sign-In**: [packages/app/features/auth/components/GoogleSignIn.tsx](../packages/app/features/auth/components/GoogleSignIn.tsx)
- **Web Apple Sign-In**: [packages/app/features/auth/components/AppleSignIn.tsx](../packages/app/features/auth/components/AppleSignIn.tsx)
- **Social Login Component**: [packages/app/features/auth/components/SocialLogin.tsx](../packages/app/features/auth/components/SocialLogin.tsx)
- **Sign-In Screen**: [packages/app/features/auth/sign-in-screen.tsx](../packages/app/features/auth/sign-in-screen.tsx)

### Configuration Files

- **App Config**: [apps/expo/app.config.js](../apps/expo/app.config.js)
- **Supabase Config**: [supabase/config.toml](../supabase/config.toml)
- **Environment Variables**: [.env.example](../.env.example)

### Utility Functions

- **Google Sign-In Initiator**: [packages/app/utils/auth/initiateGoogleSignIn.ts](../packages/app/utils/auth/initiateGoogleSignIn.ts)
- **Apple Sign-In Initiator**: [packages/app/utils/auth/initiateAppleSignIn.ts](../packages/app/utils/auth/initiateAppleSignIn.ts)

---

## Security Best Practices

### Do's ✅

- **Store secrets in `.env`** and never commit them
- **Use HTTPS** for all production redirect URLs
- **Validate tokens server-side** (Supabase does this automatically)
- **Enable skip_nonce_check** for native Google Sign-In
- **Use nonce** for Apple Sign-In (implemented)
- **Keep Client Secret secure** - only Supabase backend should use it

### Don'ts ❌

- **Never expose `GOOGLE_SECRET`** in client-side code
- **Don't disable OAuth** in production without user notification
- **Don't skip token validation** (always use Supabase's `signInWithIdToken`)
- **Don't hardcode credentials** in source code
- **Don't commit `.env`** to version control (already in `.gitignore`)

---

## Next Steps After Setup

1. **Test on all platforms**: iOS simulator, iOS device, Android
2. **Production setup**:
   - Update redirect URLs with production domains
   - Publish OAuth consent screen (Google Cloud Console)
   - Submit app for App Store review with Sign in with Apple
3. **Monitor**: Check Supabase Dashboard for OAuth sign-ins
4. **Analytics**: Track OAuth success/failure rates
5. **User experience**:
   - Add loading indicators during sign-in
   - Show friendly error messages
   - Add sign-out functionality

---

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Native Google Sign-In Docs](https://react-native-google-signin.github.io/docs/)
- [Expo Apple Authentication Docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Google Cloud Console](https://console.cloud.google.com)
- [Apple Developer Portal](https://developer.apple.com)

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the error message carefully
2. Verify all credentials match between Google Cloud Console, Apple Developer Portal, and Supabase
3. Ensure `.env` is loaded correctly
4. Check Supabase logs in Dashboard → Logs → Auth Logs
5. Run `npx expo prebuild --clean` after config changes
6. Restart the development server

**The implementation is complete - you just need to add credentials!**
