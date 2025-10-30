# Over-The-Air (OTA) Updates Guide

This project is configured for instant JavaScript updates via EAS Update, allowing you to push changes without App Store review.

## Quick Start

```bash
cd apps/expo

# Push to production iOS
yarn eas:update:production:ios

# Push to staging for testing
yarn eas:update:staging:ios
```

Updates reach users on next app restart (usually within minutes).

## What Can Be Updated OTA ✅

You can push these changes **instantly without App Store review**:

- JavaScript code changes
- React component updates
- UI/UX changes (styles, layouts, colors)
- Bug fixes in JS code
- Business logic modifications
- Content updates (text, images)
- Navigation changes
- React Query hooks
- Configuration changes in JS
- Minor JS-only dependency updates

## What Requires New Build ❌

These changes need **full App Store submission**:

- Native module changes or additions
- New permissions or entitlements
- New expo plugins
- Bundle identifier changes
- Version/build number changes
- Native dependency updates
- expo-updates package changes
- React Native version upgrades
- Changes to app.json affecting native code

## Available Commands

### Production Updates
```bash
# iOS only
yarn eas:update:production:ios

# Both platforms
eas update --channel production --platform all --message "Your update description"
```

### Staging Updates
```bash
# iOS staging
yarn eas:update:staging:ios

# Android staging
yarn eas:update:staging:android

# Both platforms
eas update --channel staging --platform all --message "Testing new feature"
```

### Monitor Updates
```bash
# List recent updates
eas update:list

# View specific update
eas update:view [update-id]
```

## How Updates Work

1. **Runtime Version**: Currently using `appVersion` policy
   - Updates only reach users on the **same app version**
   - Users on v1.0.1 won't receive OTA updates after you bump to v1.0.2
   - They need to download new version from App Store

2. **Update Delivery**:
   - Updates download in background when app opens
   - Applied on next cold start/app restart
   - `fallbackToCacheTimeout: 0` means app uses cached bundle immediately

3. **Channels**:
   - **staging** - For development and preview builds
   - **production** - For App Store releases

## Current Configuration

**Files:**
- [apps/expo/app.config.js](../apps/expo/app.config.js) - Update URL and runtime version
- [eas.json](../eas.json) - Build profiles and channels
- [apps/expo/package.json](../apps/expo/package.json) - Update scripts

**EAS Project**: `0ba86799-99f0-4ef5-9841-46061cfd6e80`

**Update URL**: `https://u.expo.dev/0ba86799-99f0-4ef5-9841-46061cfd6e80`

## Best Practices

### When to Use OTA Updates
- Quick bug fixes that can't wait for App Store review
- UI/UX improvements between releases
- Content updates and text changes
- A/B testing with feature flags
- Critical patches for production issues

### When to Use Full Build
- Adding new native functionality
- Updating native dependencies
- Changing app permissions
- Major version releases
- When bumping version numbers

### Workflow Recommendation
1. Make JavaScript changes
2. Test locally with development build
3. Push to staging channel for final testing
4. Push to production channel for users
5. Monitor adoption via `eas update:list`

## Size Considerations

- Keep OTA updates under 5MB for optimal download speed
- Large asset additions may slow update delivery
- Consider bundling major asset changes with full App Store releases

## Rollback

If an update causes issues:

```bash
# Republish a previous working update
eas update:republish --group [update-group-id]
```

You can find update group IDs with `eas update:list`.

## Testing Updates

1. Build a staging version: `eas build --profile staging --platform ios`
2. Install on test device via TestFlight or direct download
3. Push update: `yarn eas:update:staging:ios`
4. Restart app to receive update
5. Verify changes work correctly
6. Push to production when ready

## Troubleshooting

**Update not appearing:**
- Verify runtime version matches (check with `eas update:list`)
- Restart app completely (force close and reopen)
- Check that device is on the correct channel

**"No updates available":**
- Ensure build profile uses correct channel
- Verify EAS project ID matches
- Check update was published successfully

**Users on old version:**
- They're likely on a different runtime version
- Need to download new App Store version first
- Consider switching to `sdkVersion` runtime policy

## Learn More

- [Expo Updates Documentation](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)
