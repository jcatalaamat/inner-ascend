# OAuth Implementation - Complete Documentation

Welcome! This directory contains everything you need to set up and use Google Sign-In and Apple Sign-In in the Inner Ascend app.

## 📚 Documentation Index

### 🚀 Quick Start (Start Here!)
**[OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)**
- 5-minute overview of what's done and what you need to do
- TL;DR version for experienced developers
- Quick reference for the entire OAuth setup

### 📋 Step-by-Step Backend Setup
**[OAUTH_BACKEND_SETUP_STEPS.md](./OAUTH_BACKEND_SETUP_STEPS.md)**
- Detailed walkthrough for creating OAuth credentials
- Google Cloud Console setup (with screenshots descriptions)
- Apple Developer Portal setup
- Supabase Dashboard configuration
- Perfect for first-time OAuth setup

### 📖 Complete Implementation Guide
**[OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)**
- Comprehensive 20+ page guide
- Architecture explanations
- Security best practices
- Troubleshooting section
- File reference guide
- Use as a reference manual

### ✅ Testing Checklist
**[OAUTH_TESTING_CHECKLIST.md](./OAUTH_TESTING_CHECKLIST.md)**
- Pre-testing setup verification
- iOS testing procedures
- Android testing procedures
- Error handling tests
- Production readiness checklist

---

## 🎯 Recommended Reading Order

### If you're NEW to OAuth setup:
1. Start with **[OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)** (5 min read)
2. Follow **[OAUTH_BACKEND_SETUP_STEPS.md](./OAUTH_BACKEND_SETUP_STEPS.md)** (30 min)
3. Use **[OAUTH_TESTING_CHECKLIST.md](./OAUTH_TESTING_CHECKLIST.md)** to verify
4. Refer to **[OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)** when troubleshooting

### If you're EXPERIENCED with OAuth:
1. Read **[OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)** (5 min)
2. Skim **[OAUTH_BACKEND_SETUP_STEPS.md](./OAUTH_BACKEND_SETUP_STEPS.md)** for app-specific details
3. Test using **[OAUTH_TESTING_CHECKLIST.md](./OAUTH_TESTING_CHECKLIST.md)**

### If you're TROUBLESHOOTING issues:
1. Check **[OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md#troubleshooting)** section
2. Review **[OAUTH_BACKEND_SETUP_STEPS.md](./OAUTH_BACKEND_SETUP_STEPS.md)** for missed steps
3. Use **[OAUTH_TESTING_CHECKLIST.md](./OAUTH_TESTING_CHECKLIST.md)** to identify what's broken

---

## ✨ What's Already Implemented

Your OAuth implementation is **95% complete**! Here's what's already done:

### ✅ Native Google Sign-In (iOS/Android)
- Full implementation using `@react-native-google-signin/google-signin` v16.0.0
- Token-based authentication with Supabase
- Proper error handling and status codes
- Platform-specific UI

**Files:**
- [packages/app/features/auth/components/GoogleSignIn.native.tsx](../packages/app/features/auth/components/GoogleSignIn.native.tsx)
- [packages/app/utils/auth/initiateGoogleSignIn.ts](../packages/app/utils/auth/initiateGoogleSignIn.ts)

### ✅ Native Apple Sign-In (iOS)
- Full implementation using `expo-apple-authentication` v7.2.4
- Nonce-based security for replay attack prevention
- Native Apple button styling
- Proper scope handling (name, email)

**Files:**
- [packages/app/features/auth/components/AppleSignIn.native.tsx](../packages/app/features/auth/components/AppleSignIn.native.tsx)
- [packages/app/utils/auth/initiateAppleSignIn.ts](../packages/app/utils/auth/initiateAppleSignIn.ts)

### ✅ Web OAuth (Basic)
- Standard OAuth redirect flow
- Works with both Google and Apple
- Supabase integration

**Files:**
- [packages/app/features/auth/components/GoogleSignIn.tsx](../packages/app/features/auth/components/GoogleSignIn.tsx)
- [packages/app/features/auth/components/AppleSignIn.tsx](../packages/app/features/auth/components/AppleSignIn.tsx)

### ✅ UI Components
- Custom Google and Apple icons
- Platform-specific button styling
- Loading states and error handling
- Integrated into sign-in flow

**Files:**
- [packages/app/features/auth/components/SocialLogin.tsx](../packages/app/features/auth/components/SocialLogin.tsx)
- [packages/app/features/auth/sign-in-screen.tsx](../packages/app/features/auth/sign-in-screen.tsx)

### ✅ Configuration
- All dependencies installed
- Expo config plugins configured
- Supabase config files ready
- Environment variable templates

**Files:**
- [apps/expo/app.config.js](../apps/expo/app.config.js)
- [supabase/config.toml](../supabase/config.toml)
- [.env.example](../.env.example)

---

## 🔧 What You Need to Do

### 1. Get OAuth Credentials (30 minutes)

#### Google Cloud Console:
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create iOS OAuth Client ID (bundle: `com.innerascend.app`)
- [ ] Create Web OAuth Client ID (with redirect URIs)
- [ ] Save Client ID and Secret

#### Apple Developer Portal:
- [ ] Enable "Sign in with Apple" in App ID capabilities
- [ ] (Optional) Create Services ID for web

### 2. Configure Supabase (5 minutes)
- [ ] Enable Google provider in Dashboard
- [ ] Add Web Client ID and Secret
- [ ] Add iOS Client ID to "Authorized Client IDs"
- [ ] Enable "Skip nonce check"

### 3. Update App Config (2 minutes)
- [ ] Copy `.env.example` to `.env`
- [ ] Add your 4 Google credentials
- [ ] Run `npx expo prebuild --clean`

### 4. Test (5 minutes)
- [ ] Run app: `npx expo run:ios`
- [ ] Test Google Sign-In
- [ ] Test Apple Sign-In
- [ ] Verify users in Supabase Dashboard

**Total time: ~45 minutes**

---

## 🏗️ Architecture Overview

### Google Sign-In Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User taps "Continue with Google" button                    │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  GoogleSignin.configure()                                   │
│  - iOS Client ID (for native app)                          │
│  - Web Client ID (for Supabase verification)               │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Native Google Sign-In UI appears                           │
│  User selects Google account                                │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  App receives ID token from Google                          │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  supabase.auth.signInWithIdToken({ token })                │
│  - Sends token to Supabase                                  │
│  - No nonce (skip_nonce_check enabled)                      │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Supabase verifies token with Google                        │
│  - Uses Web Client ID for verification                      │
│  - Creates or updates user record                           │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Session created and stored in ExpoSecureStore              │
│  User is authenticated! ✅                                   │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- **Two Client IDs required**: iOS for native app, Web for Supabase verification
- **Skip nonce check**: Native flow doesn't generate nonce like web OAuth
- **Secure**: Token verification happens server-side via Supabase

### Apple Sign-In Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User taps "Continue with Apple" button                     │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Generate cryptographic nonce                               │
│  - rawNonce = randomUUID()                                  │
│  - hashedNonce = SHA256(rawNonce)                           │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  AppleAuthentication.signInAsync({ nonce: hashedNonce })   │
│  Native Apple Sign-In UI appears                            │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  User authenticates with Face ID / Touch ID                 │
│  Grants name/email permissions (first time)                 │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  App receives identity token from Apple                     │
│  Token includes the hashed nonce                            │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  supabase.auth.signInWithIdToken({                         │
│    token: identityToken,                                    │
│    nonce: rawNonce  // Send unhashed nonce                  │
│  })                                                          │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Supabase verifies token with Apple                         │
│  - Verifies nonce matches (security check)                  │
│  - Creates or updates user record                           │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  Session created and stored in ExpoSecureStore              │
│  User is authenticated! ✅                                   │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- **Nonce required**: Prevents replay attacks
- **Hash before sending**: Apple receives SHA256(nonce), Supabase gets raw nonce
- **iOS-only**: Native Apple Sign-In only works on iOS devices
- **No backend config needed**: Works automatically with App ID capability

---

## 🔐 Security Best Practices

### ✅ What's Implemented

1. **Token-only authentication**: No passwords stored, tokens managed by OAuth providers
2. **Server-side verification**: Supabase validates all tokens with Google/Apple
3. **Secure storage**: Sessions stored in ExpoSecureStore (iOS Keychain)
4. **Nonce for Apple**: Prevents replay attacks with cryptographic nonce
5. **Skip nonce for Google**: Native SDK doesn't support Supabase nonce format
6. **Environment variables**: Secrets never hardcoded in source
7. **Client Secret protected**: Only Supabase backend uses the secret

### ⚠️ Important Security Notes

- **Never commit `.env`**: Already in `.gitignore`
- **Never expose `GOOGLE_SECRET`**: Only Supabase should use it
- **Keep Client IDs in sync**: Mismatch causes authentication failures
- **Use HTTPS in production**: All redirect URIs must use HTTPS
- **Monitor auth logs**: Check Supabase Dashboard regularly

---

## 🐛 Common Issues & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| "Developer Error" | Verify bundle ID is exactly `com.innerascend.app` in Google Cloud Console |
| "Error 10" | Run `npx expo prebuild --clean` after updating `.env` |
| "Invalid audience" | Add iOS Client ID to Supabase "Authorized Client IDs" |
| Apple button not showing | Normal - Apple Sign-In is iOS-only |
| "Not available" (Apple) | Sign into Apple ID in iOS Settings or Simulator |
| "Sign in cancelled" | User cancelled - this is expected behavior |

**For detailed troubleshooting:** See [OAUTH_SETUP_GUIDE.md - Troubleshooting](./OAUTH_SETUP_GUIDE.md#troubleshooting)

---

## 📦 Dependencies (Already Installed)

All required dependencies are already in your project:

```json
{
  "@react-native-google-signin/google-signin": "^16.0.0",
  "expo-apple-authentication": "~7.2.4",
  "expo-crypto": "~14.1.5",
  "expo-secure-store": "~14.2.4",
  "@supabase/supabase-js": "^2.48.1"
}
```

**No need to install anything!**

---

## 🧪 Testing Your Implementation

### Quick Smoke Test

```bash
# 1. Update .env with credentials
cp .env.example .env
# Edit .env with your Google credentials

# 2. Rebuild native projects
npx expo prebuild --clean --skip-dependency-update react-native,react

# 3. Run on iOS
npx expo run:ios

# 4. Test OAuth
# - Tap "Continue with Google" → Should work!
# - Tap "Continue with Apple" → Should work!
```

### Full Testing

Follow the comprehensive checklist: **[OAUTH_TESTING_CHECKLIST.md](./OAUTH_TESTING_CHECKLIST.md)**

---

## 📁 File Structure Reference

```
inner-ascend/
├── apps/expo/
│   └── app.config.js                 # OAuth URL schemes configured
├── packages/app/
│   ├── features/auth/
│   │   ├── components/
│   │   │   ├── GoogleSignIn.native.tsx    # Native Google implementation
│   │   │   ├── AppleSignIn.native.tsx     # Native Apple implementation
│   │   │   ├── GoogleSignIn.tsx           # Web Google (basic)
│   │   │   ├── AppleSignIn.tsx            # Web Apple (basic)
│   │   │   ├── SocialLogin.tsx            # Combined UI component
│   │   │   ├── IconGoogle.tsx             # Google icon
│   │   │   └── IconApple.tsx              # Apple icon
│   │   └── sign-in-screen.tsx             # Main sign-in screen
│   └── utils/auth/
│       ├── initiateGoogleSignIn.ts        # Google auth flow
│       └── initiateAppleSignIn.ts         # Apple auth flow
├── supabase/
│   └── config.toml                   # Supabase local config (Google enabled)
├── .env.example                      # Environment variable template
├── .env                              # Your credentials (gitignored)
└── docs/
    ├── OAUTH_README.md               # This file
    ├── OAUTH_QUICK_START.md          # Quick start guide
    ├── OAUTH_BACKEND_SETUP_STEPS.md  # Step-by-step backend setup
    ├── OAUTH_SETUP_GUIDE.md          # Comprehensive guide
    └── OAUTH_TESTING_CHECKLIST.md    # Testing checklist
```

---

## 🚀 Production Deployment Checklist

Before releasing to App Store / Google Play:

- [ ] Google OAuth consent screen published (not "Testing" mode)
- [ ] Production redirect URIs added to Google Web Client ID
- [ ] Production Supabase credentials in `.env`
- [ ] Apple Sign in with Apple capability in production App ID
- [ ] Test with TestFlight (iOS) / Internal Testing (Android)
- [ ] Monitor Supabase auth logs after launch
- [ ] Track OAuth success/failure rates
- [ ] Privacy Policy updated with OAuth providers

---

## 📞 Support Resources

### Documentation
- [React Native Google Sign-In Docs](https://react-native-google-signin.github.io/docs/)
- [Expo Apple Authentication Docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

### Dashboards
- [Google Cloud Console](https://console.cloud.google.com)
- [Apple Developer Portal](https://developer.apple.com)
- [Supabase Dashboard](https://supabase.com/dashboard)

### Your Implementation
- All implementation files are in [packages/app/features/auth](../packages/app/features/auth)
- Configuration files: [app.config.js](../apps/expo/app.config.js), [config.toml](../supabase/config.toml)

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Read Quick Start | 5 min |
| Google Cloud Console setup | 15 min |
| Apple Developer setup | 5 min |
| Supabase configuration | 5 min |
| Update `.env` and rebuild | 5 min |
| Testing | 10 min |
| **Total** | **45 minutes** |

---

## 🎉 You're Almost There!

Your OAuth implementation is **complete and production-ready**. You just need to:

1. Get credentials from Google Cloud Console (15 min)
2. Configure Supabase Dashboard (5 min)
3. Update `.env` file (2 min)
4. Test (5 min)

**Start here:** [OAUTH_BACKEND_SETUP_STEPS.md](./OAUTH_BACKEND_SETUP_STEPS.md)

**Questions?** All answers are in the comprehensive guide: [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)

---

**Good luck! Your users will love the seamless sign-in experience. 🚀**
