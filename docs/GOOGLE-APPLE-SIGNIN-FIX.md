# Google & Apple Sign-In Configuration Fix

## Issues Found

### 1. Google Sign-In Connecting to Wrong Project
**Problem**: Google Sign-In for iOS was trying to connect to the old "Mazunte Connect" project instead of "Inner Ascend".

**Root Cause**: The `apps/expo/eas.json` file contained outdated Google OAuth credentials from the previous Mazunte Connect project across all 6 build profiles.

**Fix**: Updated all Google OAuth credentials in `apps/expo/eas.json` to use the correct Inner Ascend credentials:
- `GOOGLE_IOS_SCHEME`: `com.googleusercontent.apps.1065698463479-vkv369urpqtpdcuhlokiavvf1medcptv`
- `GOOGLE_IOS_CLIENT_ID`: `1065698463479-vkv369urpqtpdcuhlokiavvf1medcptv.apps.googleusercontent.com`
- `GOOGLE_WEB_CLIENT_ID`: `1065698463479-soqfhb6vi0487v0a0g2bn8uc86qo4ut3.apps.googleusercontent.com`

**Why Two Client IDs**:
- **iOS Client ID**: Used by the Google Sign-In SDK on the device for native authentication
- **Web Client ID**: Used by Supabase backend to verify the ID token from Google

### 2. Apple Sign-In Not Working in TestFlight/Production
**Problem**: Apple Sign-In worked fine in local development (`yarn ios --device`) but failed in TestFlight and production builds.

**Root Cause**: The provisioning profile was created before the Apple Sign-In capability was added to the app. When using local credentials (`credentialsSource: "local"`), the provisioning profile needs to include all required capabilities.

**Fix**:
1. Added `credentialsSource: "local"` to the staging iOS configuration in root `eas.json` to ensure we're using local provisioning profiles
2. Added `EXPO_NO_CAPABILITY_SYNC: "1"` to prevent EAS from trying to modify capabilities in the Apple Developer Portal

### 3. EAS Capability Sync Errors
**Problem**: Running `eas credentials` or building with EAS would fail with error:
```
Failed to patch capabilities: [ { capabilityType: 'APPLE_ID_AUTH', option: 'OFF' } ]
✖ Failed to sync capabilities com.innerascend.app
```

**Root Cause**: EAS was attempting to automatically sync capabilities between the local Xcode project and Apple Developer Portal, and it was trying to disable Apple Sign-In (which we need enabled).

**Fix**: Added `EXPO_NO_CAPABILITY_SYNC=1` environment variable to all build scripts to prevent EAS from modifying capabilities:
- `scripts/build-staging.sh`
- `scripts/build-production.sh`
- `scripts/deploy-staging.sh`
- `scripts/deploy-production.sh`

Also added to `eas.json` for both staging and production profiles (though this only applies during builds, not to `eas credentials` command).

## Configuration Summary

### Google OAuth Setup
- **iOS Client ID**: Used by `@react-native-google-signin/google-signin` package on the device
- **Web Client ID**: Used by Supabase to verify the authentication token
- Both must be from the same Google Cloud Project
- Configured in `.env`, root `eas.json`, and `apps/expo/eas.json`

### Apple Sign-In Setup
- Uses native `expo-apple-authentication` package
- Requires `usesAppleSignIn: true` in `app.config.js`
- Requires Apple Sign-In entitlement in both:
  - `apps/expo/ios/InnerAscend/InnerAscend.entitlements`
  - `app.config.js` iOS entitlements section
- Provisioning profile must include the Apple Sign-In capability
- Must be enabled in Supabase Auth providers

### Local vs EAS Credentials
We're using **local credentials** for iOS builds:
- Provisioning profiles and certificates managed locally
- Stored in `apps/expo/ios/` directory
- Specified with `credentialsSource: "local"` in `eas.json`
- Requires `EXPO_NO_CAPABILITY_SYNC=1` to prevent EAS from modifying capabilities

## Files Modified

### Configuration Files
- `eas.json` (root)
  - Added `credentialsSource: "local"` to staging iOS config
  - Added `EXPO_NO_CAPABILITY_SYNC: "1"` to staging and production env sections

- `apps/expo/eas.json`
  - Updated Google OAuth credentials in all 6 build profiles

### Build Scripts
- `scripts/build-staging.sh` - Added `EXPO_NO_CAPABILITY_SYNC=1` export
- `scripts/build-production.sh` - Added `EXPO_NO_CAPABILITY_SYNC=1` export
- `scripts/deploy-staging.sh` - Already had `EXPO_NO_CAPABILITY_SYNC=1`
- `scripts/deploy-production.sh` - Already had `EXPO_NO_CAPABILITY_SYNC=1`

## Testing & Verification

### Local Development
```bash
yarn ios --device
```
Both Google and Apple Sign-In should work on a physical device.

### Staging Build
```bash
yarn build:staging
# Then test in TestFlight
```

### Production Build
```bash
yarn build:production
# Then test in TestFlight before releasing
```

## Common Issues

### "No identity token received from Apple"
- Check that Apple Sign-In is enabled in Supabase dashboard
- Verify entitlements are properly configured
- Ensure provisioning profile includes Apple Sign-In capability

### "Google Sign-In failed"
- Verify both iOS Client ID and Web Client ID are correct
- Check that credentials match between `.env`, `eas.json`, and `apps/expo/eas.json`
- Ensure Google OAuth consent screen is configured

### "Failed to patch capabilities"
- Make sure `EXPO_NO_CAPABILITY_SYNC=1` is set in your build script
- Avoid running `eas credentials` unless necessary
- Use local credential management instead of EAS-managed

## References

- [Expo Apple Authentication Docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [React Native Google Sign-In Setup](https://react-native-google-signin.github.io/docs/setting-up/expo)
- [Supabase Auth with OAuth](https://supabase.com/docs/guides/auth/social-login)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
