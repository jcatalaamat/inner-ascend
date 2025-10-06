import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { AdMobBanner } from 'expo-ads-admob'
import { YStack } from '@my/ui'

// Test ad unit IDs from Google AdMob
// Replace these with your real Ad Unit IDs after AdMob account approval
const AD_UNIT_IDS = {
  ios: {
    events_list: __DEV__
      ? 'ca-app-pub-3940256099942544/2934735716' // Test banner ID
      : process.env.EXPO_PUBLIC_ADMOB_IOS_EVENTS_BANNER || 'ca-app-pub-3940256099942544/2934735716',
    places_list: __DEV__
      ? 'ca-app-pub-3940256099942544/2934735716'
      : process.env.EXPO_PUBLIC_ADMOB_IOS_PLACES_BANNER || 'ca-app-pub-3940256099942544/2934735716',
    favorites: __DEV__
      ? 'ca-app-pub-3940256099942544/2934735716'
      : process.env.EXPO_PUBLIC_ADMOB_IOS_FAVORITES_BANNER || 'ca-app-pub-3940256099942544/2934735716',
  },
  android: {
    events_list: __DEV__
      ? 'ca-app-pub-3940256099942544/6300978111' // Test banner ID
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_EVENTS_BANNER || 'ca-app-pub-3940256099942544/6300978111',
    places_list: __DEV__
      ? 'ca-app-pub-3940256099942544/6300978111'
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_PLACES_BANNER || 'ca-app-pub-3940256099942544/6300978111',
    favorites: __DEV__
      ? 'ca-app-pub-3940256099942544/6300978111'
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_FAVORITES_BANNER || 'ca-app-pub-3940256099942544/6300978111',
  },
}

export type AdPlacement = 'events_list' | 'places_list' | 'favorites'

interface AdBannerProps {
  placement: AdPlacement
}

export function AdBanner({ placement }: AdBannerProps) {
  const showAds = useFeatureFlag('enable-ads')
  const posthog = usePostHog()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (showAds) {
      posthog?.capture('ad_banner_shown', {
        placement,
        platform: Platform.OS,
      })
    }
  }, [showAds, placement, posthog])

  // Don't render if feature flag is disabled
  if (!showAds || error) {
    return null
  }

  const adUnitId = Platform.select({
    ios: AD_UNIT_IDS.ios[placement],
    android: AD_UNIT_IDS.android[placement],
    default: AD_UNIT_IDS.ios[placement],
  })

  return (
    <YStack py="$2" ai="center" bg="$background">
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={adUnitId}
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => {
          console.warn('Ad failed to load:', error)
          setError(true)
          posthog?.capture('ad_banner_failed', {
            placement,
            error: error,
            platform: Platform.OS,
          })
        }}
        onAdViewDidReceiveAd={() => {
          posthog?.capture('ad_banner_loaded', {
            placement,
            platform: Platform.OS,
          })
        }}
      />
    </YStack>
  )
}
