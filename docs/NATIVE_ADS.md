# Native Ads Implementation

This document explains how native ads work in Mazunte Connect and how to enable them for production.

## Overview

Native ads are integrated into the Events and Places lists, appearing every 5 items styled to match the existing event/place cards. They blend seamlessly with your content while being clearly marked with an "Ad" badge.

### Ad Placement by Screen

| Screen | Banner Ad (Bottom) | Native Ads (In-Feed) | Notes |
|--------|-------------------|---------------------|-------|
| **Events List** | ❌ No | ✅ Every 5 items | Native ads replaced banner for better UX |
| **Places List** | ❌ No | ✅ Every 5 items | Native ads replaced banner for better UX |
| **Favorites** | ✅ Yes | ❌ No | Banner only (no native implementation) |
| **Event Detail** | ❌ No | ❌ No | Clean experience for reading details |
| **Place Detail** | ❌ No | ❌ No | Clean experience for reading details |

**Design Decision:** Events and Places lists show native ads only (no bottom banner) to prevent ad fatigue and provide a cleaner user experience. This approach prioritizes engagement over maximum ad impressions.

## Current Status

✅ **Implementation Complete**
- Native ads working with test ads
- Styled to match EventCard and PlaceCard components
- "Ad" badge in both English and Spanish
- Feature flag controlled via PostHog
- AdMob validator compliant

⏳ **Waiting for Production Ad Units**
- Production ad units created but not yet serving
- Using test ads temporarily (`forceTestAds = true`)
- Need 24-48 hours for AdMob approval

## Ad Unit IDs (Configured)

### iOS
- Events List: `ca-app-pub-6902851718419723/3511646509`
- Places List: `ca-app-pub-6902851718419723/6673012374`

### Android
- Events List: `ca-app-pub-6902851718419723/9303755587`
- Places List: `ca-app-pub-6902851718419723/7690580577`

## Enabling Production Ads

Once your ad units show "Ready" status in the AdMob console (typically 24-48 hours after creation):

### Step 1: Update the Code

Edit `packages/app/utils/inject-native-ads.ts`:

```typescript
// Change this line:
const forceTestAds = true

// To:
const forceTestAds = false
```

### Step 2: Commit and Deploy

```bash
git add packages/app/utils/inject-native-ads.ts
git commit -m "feat: enable production native ads"
git push
yarn deploy:staging  # Test on staging first
yarn deploy:production  # Deploy to production when ready
```

### Step 3: Enable Feature Flag

In your PostHog dashboard:
1. Go to Feature Flags
2. Find `show-native-ads`
3. Enable it for your desired rollout percentage
   - Start with 10-20% to test
   - Monitor performance and revenue
   - Gradually increase to 100%

## How It Works

### Architecture

```
Events/Places Screen
  ↓ (filters & sorts data)
filteredEvents/filteredPlaces
  ↓ (useEffect with stable key)
injectNativeAds() utility
  ↓ (loads ads from AdMob)
eventsWithAds/placesWithAds
  ↓ (FlatList renders)
EventCard | NativeAdEventCard
PlaceCard | NativeAdPlaceCard
```

### Key Files

- **Native Ad Components:**
  - `packages/app/components/NativeAdEventCard.tsx` - Ad styled like event card
  - `packages/app/components/NativeAdPlaceCard.tsx` - Ad styled like place card

- **Utility Functions:**
  - `packages/app/utils/inject-native-ads.ts` - Loads and injects ads into data

- **Screen Integration:**
  - `packages/app/features/events/screen.tsx` - Events list with native ads
  - `packages/app/features/places/screen.tsx` - Places list with native ads

### Ad Injection Logic

```typescript
// Every 5 items: [item, item, item, item, item, AD, item, ...]
const interval = 5
const numAds = Math.floor(data.length / interval)

// Example with 26 items:
// Positions: 5, 10, 15, 20, 25 (5 ads total)
```

### Performance Optimization

To prevent infinite loops, we use a stable dependency key:

```typescript
const filteredEventsKey = useMemo(
  () => filteredEvents.map(e => e.id).join(','),
  [filteredEvents]
)

useEffect(() => {
  // Only runs when actual data changes, not array reference
}, [filteredEventsKey, showNativeAds])
```

## Monitoring

### Check Ad Performance

1. **AdMob Console**
   - Monitor impressions, clicks, and revenue
   - Check fill rate (should be >90%)
   - Review eCPM (earnings per thousand impressions)

2. **PostHog Analytics**
   - Native ads are tracked via the feature flag
   - Monitor user engagement with ads vs non-ads

3. **App Logs**
   - Look for: `🎯 Native Ads - Events/Places`
   - Check: `✅ Native ads loaded, result length`
   - Watch for: `❌ Failed to inject native ads`

### Expected Behavior

**When Working:**
```
LOG  🎯 Native Ads - Events: {"showNativeAds": true, "eventsCount": 26, ...}
LOG  🆔 Ad Unit ID Selection: {"selected": "ca-app-pub-...", "forceTestAds": false}
LOG  📱 Loading native ads: {"finalAdUnitId": "ca-app-pub-...", "type": "string"}
LOG  ✅ Native ads loaded, result length: 31  // 26 events + 5 ads
```

**When Disabled:**
```
LOG  🎯 Native Ads - Events: {"showNativeAds": false, ...}
LOG  ❌ Native ads disabled by feature flag
```

## Troubleshooting

### "No ad to show" Error

**Cause:** New ad units not yet approved by AdMob

**Solution:** Wait 24-48 hours or keep `forceTestAds = true` to use test ads

### Ads Not Appearing

**Checklist:**
1. Is `show-native-ads` feature flag enabled in PostHog?
2. Are you on the Events or Places screen?
3. Do you have at least 5 items in the list?
4. Check logs for errors
5. Verify ad unit IDs in `.env` file

### App Crashing

**Common causes:**
- `NativeMediaView` wrapped in `NativeAsset` (fixed)
- Missing translation keys (fixed)
- Invalid ad unit ID format

**Solution:** Check the error message and compare with working code in this repo

## Revenue Optimization

### Best Practices

1. **Fill Rate**
   - Aim for >95% fill rate
   - Enable mediation in AdMob if needed
   - Consider backup ad networks

2. **User Experience**
   - Don't show ads more frequently than every 5 items
   - Ensure ads match the app's visual style
   - Always show "Ad" badge clearly

3. **A/B Testing**
   - Test different ad frequencies (every 5 vs 7 vs 10 items)
   - Test ad placements (after item 5 vs random positions)
   - Monitor user retention with/without ads

4. **Monetization Strategy**
   - Native ads for in-feed experience
   - Banner ads for persistent bottom placement
   - Consider interstitials for key moments (post-action)

## Related Documentation

- [AdMob Setup Guide](./ADMOB_SETUP.md)
- [Feature Flags Guide](./FEATURE_FLAGS.md)
- [Deployment Guide](../README.md#deployment)

## Support

If you encounter issues:
1. Check logs for error messages
2. Review this documentation
3. Contact: hello@mazunteconnect.com
