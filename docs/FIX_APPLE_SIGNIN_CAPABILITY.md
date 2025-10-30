# Fix: Enable Sign in with Apple Capability

## Problem
Your EAS build is failing with:
```
Provisioning profile doesn't support the Sign in with Apple capability
Provisioning profile doesn't include the com.apple.developer.applesignin entitlement
```

## Solution

### Step 1: Enable in Apple Developer Portal

1. **Go to Apple Developer Portal**
   - Visit https://developer.apple.com/account
   - Sign in with your Apple ID (Team ID: `3R96Y2JNG8`)

2. **Navigate to your App ID**
   - Go to "Certificates, Identifiers & Profiles"
   - Click "Identifiers"
   - Find your bundle ID: `com.innerascend.app`

3. **Enable Sign in with Apple**
   - Click on your App ID (`com.innerascend.app`)
   - Scroll to "Capabilities" section
   - Check the box for **"Sign in with Apple"**
   - Click "Save"

4. **Regenerate Provisioning Profiles**
   - Go to "Profiles" section
   - Find your profile: `*[expo] com.innerascend.app AppStore`
   - Delete the old profile
   - EAS will automatically create a new one with the capability enabled

### Step 2: Update EAS Credentials

After enabling the capability in Apple Developer Portal:

```bash
# Clear EAS credentials cache
eas credentials

# Choose: iOS → App Store & Ad Hoc → Remove Provisioning Profile

# Then rebuild
eas build --platform ios --profile staging
```

### Step 3: Verify app.config.js Has the Entitlement

Your `app.config.js` already includes:

```javascript
ios: {
  usesAppleSignIn: true,
  entitlements: {
    'com.apple.developer.applesignin': ['Default']
  }
}
```

✅ This is correct - no changes needed here.

## Alternative: Disable Apple Sign In Temporarily

If you want to build **without** Apple Sign In for now:

1. **Remove from app.config.js:**
```javascript
// Comment out or remove:
// usesAppleSignIn: true,
// 'com.apple.developer.applesignin': ['Default']
```

2. **Remove from expo plugins:**
```javascript
// Comment out:
// 'expo-apple-authentication'
```

3. **Rebuild:**
```bash
eas build --platform ios --profile staging
```

**Note**: This will disable Apple Sign In on iOS. Google Sign In will still work.

## Recommended Path

✅ **Enable the capability in Apple Developer Portal** - This is the proper long-term solution.

Your code is ready for Apple Sign In. You just need to enable it in your Apple Developer account!

---

## Quick Checklist

- [ ] Log into https://developer.apple.com/account
- [ ] Go to Identifiers → `com.innerascend.app`
- [ ] Enable "Sign in with Apple" capability
- [ ] Click Save
- [ ] Run: `eas credentials` and remove old provisioning profile
- [ ] Run: `eas build --platform ios --profile staging`

That's it! The build should succeed once the capability is enabled.
