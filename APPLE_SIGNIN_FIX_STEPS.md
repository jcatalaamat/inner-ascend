# Fix Apple Sign In Provisioning Profile Issue

## The Problem
EAS keeps using an OLD provisioning profile that doesn't have "Sign in with Apple" capability, even though you enabled it in Apple Developer Portal.

## The Solution: Clear Cached Credentials

### Step 1: Remove Old Credentials from EAS

```bash
eas credentials
```

**In the interactive menu:**
1. Select platform: `iOS`
2. Select profile: `staging` (or the one you're building with)
3. Choose: `App Store and Ad Hoc provisioning profile`
4. Choose: `Remove provisioning profile`
5. Confirm: `Yes`

### Step 2: Verify Apple Developer Portal

Before rebuilding, double-check:

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click on your App ID: `com.innerascend.app`
3. Scroll to **Capabilities**
4. Make sure **"Sign in with Apple"** is checked ✅
5. Click **Save**

### Step 3: Rebuild with Fresh Credentials

```bash
# Clear build cache and rebuild
eas build --platform ios --profile staging --clear-cache
```

EAS will now:
- Detect the "Sign in with Apple" entitlement in your app.config.js
- See that you have no cached provisioning profile
- Create a NEW provisioning profile from Apple with the correct capabilities
- Build successfully ✅

---

## Alternative: Build Without Apple Sign In (Temporary)

If you want to get a build working NOW and add Apple Sign In later:

### 1. Edit `apps/expo/app.config.js`

Comment out these lines:

```javascript
ios: {
  // ... other config
  // usesAppleSignIn: true,  // ← COMMENT THIS OUT
  entitlements: {
    // 'com.apple.developer.applesignin': ['Default'],  // ← COMMENT THIS OUT
  },
}
```

### 2. Comment out the plugin

```javascript
plugins: [
  // ... other plugins
  // 'expo-apple-authentication',  // ← COMMENT THIS OUT
]
```

### 3. Rebuild

```bash
eas build --platform ios --profile staging
```

This will build successfully with only Google Sign In enabled. You can add Apple Sign In back later when ready.

---

## Why This Happens

1. Your `app.config.js` declares: "I use Apple Sign In"
2. EAS creates a provisioning profile with that capability
3. But Apple's servers say: "Not approved for this app"
4. Build fails ❌

**The fix:** Make sure Apple Developer Portal has the capability enabled, THEN delete EAS's cached profile so it creates a fresh one.

---

## Quick Reference

```bash
# Remove cached credentials
eas credentials
# → iOS → staging → Provisioning Profile → Remove

# Rebuild
eas build --platform ios --profile staging --clear-cache
```

That's it!
