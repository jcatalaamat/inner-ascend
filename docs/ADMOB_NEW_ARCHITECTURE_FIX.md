# AdMob Build Fix - New Architecture Compatibility

## Problem

When using `react-native-google-mobile-ads` v15.8.0 with Expo SDK 53, builds were failing with:

```
'RNGoogleMobileAdsSpec/RNGoogleMobileAdsSpec.h' file not found
```

This occurred because:
1. Expo SDK 53 enables the **New Architecture** by default
2. When `RCT_NEW_ARCH_ENABLED` is defined, `react-native-google-mobile-ads` tries to import New Architecture codegen specs
3. These codegen specs don't exist because the library hasn't generated them yet
4. Build fails with missing header file errors

## Solution

**Disable the New Architecture** using `expo-build-properties` plugin in `app.config.js`:

```javascript
// apps/expo/app.config.js
export default {
  expo: {
    plugins: [
      // ... other plugins
      [
        'expo-build-properties',
        {
          ios: {
            newArchEnabled: false
          },
          android: {
            newArchEnabled: false
          }
        }
      ],
      // ... other plugins
    ]
  }
}
```

## How It Works

### For EAS Builds (Cloud)

1. EAS reads `app.config.js` during the build process
2. `expo-build-properties` plugin generates `ios/Podfile.properties.json` with:
   ```json
   {
     "newArchEnabled": "false"
   }
   ```
3. The Podfile reads this and sets: `ENV['RCT_NEW_ARCH_ENABLED'] = '0'`
4. `RCT_NEW_ARCH_ENABLED` is NOT defined during compilation
5. `react-native-google-mobile-ads` uses the old architecture code path
6. Build succeeds ✅

### For Local Builds

Since the `ios/` directory is gitignored, you must regenerate it locally after pulling changes:

```bash
cd apps/expo
yarn expo:prebuild:clean
```

This script:
- Sets `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` to avoid CocoaPods encoding errors
- Runs `npx expo prebuild --platform ios --clean --skip-dependency-update react-native,react`
- Applies the `newArchEnabled: false` configuration from app.config.js
- Generates `ios/Podfile.properties.json` with the correct settings
- Runs `pod install` to install dependencies

Then build normally:
```bash
yarn ios --device
```

## What Happens If You Delete the ios/ Folder?

**If you delete the `ios/` folder, you WILL have the same issue UNLESS you regenerate it properly.**

### ❌ WRONG - Will Fail:
```bash
rm -rf ios
npx expo prebuild --platform ios  # Missing UTF-8 encoding, will get CocoaPods error
```

### ✅ CORRECT - Will Work:
```bash
rm -rf ios
yarn expo:prebuild:clean  # Uses the script with proper encoding
```

**Why?** The `yarn expo:prebuild:clean` script:
1. Sets the correct UTF-8 encoding environment variables
2. Runs prebuild which reads `app.config.js` and applies `newArchEnabled: false`
3. Generates `ios/Podfile.properties.json` with the correct configuration

## Verification

After running `yarn expo:prebuild:clean`, verify the configuration:

```bash
# Check that newArchEnabled is false
cat apps/expo/ios/Podfile.properties.json
# Should show: "newArchEnabled": "false"

# Check that Podfile reads it correctly
grep RCT_NEW_ARCH_ENABLED apps/expo/ios/Podfile
# Should show: ENV['RCT_NEW_ARCH_ENABLED'] = '0' if podfile_properties['newArchEnabled'] == 'false'
```

## Important Notes

1. **The `ios/` directory is gitignored** - It must be regenerated on every machine/environment
2. **Always use `yarn expo:prebuild:clean`** - Don't run `npx expo prebuild` directly (wrong encoding)
3. **EAS builds work automatically** - No manual steps needed for cloud builds
4. **The fix is in `app.config.js`** - The source of truth for the configuration

## Why Not Use New Architecture?

As of January 2025:
- `react-native-google-mobile-ads` v15.8.0 supports New Architecture but requires codegen setup
- The library's podspec has conditional logic that looks for codegen specs when `RCT_NEW_ARCH_ENABLED` is set
- Expo's automatic codegen generation doesn't include third-party library specs
- Disabling New Architecture is the simplest solution until proper codegen support is added

## Related Files

- **Source of truth**: `apps/expo/app.config.js` (line 91-101)
- **Generated config**: `apps/expo/ios/Podfile.properties.json` (not in git)
- **Podfile logic**: `apps/expo/ios/Podfile` (line 7, not in git)
- **Build script**: `apps/expo/package.json` (`expo:prebuild:clean` script)

## Testing

To test that the fix works:

```bash
# Clean slate
cd apps/expo
rm -rf ios

# Regenerate with correct config
yarn expo:prebuild:clean

# Verify configuration
cat ios/Podfile.properties.json | grep newArchEnabled
# Expected: "newArchEnabled": "false"

# Build
yarn ios --device
# Should compile successfully without RNGoogleMobileAdsSpec errors
```

## Future Migration

When `react-native-google-mobile-ads` fully supports New Architecture with Expo:

1. Remove or modify the `expo-build-properties` configuration
2. Enable New Architecture: `newArchEnabled: true`
3. Ensure codegen is properly configured
4. Test thoroughly on both platforms
