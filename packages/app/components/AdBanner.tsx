import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import { YStack } from '@my/ui'

// Ad unit IDs from environment or test IDs
const AD_UNIT_IDS = {
  ios: {
    events_list: __DEV__
      ? TestIds.BANNER // Google's test banner ID
      : process.env.EXPO_PUBLIC_ADMOB_IOS_EVENTS_BANNER || TestIds.BANNER,
    places_list: __DEV__
      ? TestIds.BANNER
      : process.env.EXPO_PUBLIC_ADMOB_IOS_PLACES_BANNER || TestIds.BANNER,
    favorites: __DEV__
      ? TestIds.BANNER
      : process.env.EXPO_PUBLIC_ADMOB_IOS_FAVORITES_BANNER || TestIds.BANNER,
  },
  android: {
    events_list: __DEV__
      ? TestIds.BANNER // Google's test banner ID
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_EVENTS_BANNER || TestIds.BANNER,
    places_list: __DEV__
      ? TestIds.BANNER
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_PLACES_BANNER || TestIds.BANNER,
    favorites: __DEV__
      ? TestIds.BANNER
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_FAVORITES_BANNER || TestIds.BANNER,
  },
}

export type AdPlacement = 'events_list' | 'places_list' | 'favorites'

interface AdBannerProps {
  placement: AdPlacement
}

export function AdBanner({ placement }: AdBannerProps) {
  const showAds = useFeatureFlag('enable-banner-ads')
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

  // Don't render if feature flag is disabled or if there was an error
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
      <BannerAd
        unitId={adUnitId!}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={(error) => {
          console.warn('Ad failed to load:', error)
          setError(true)
          posthog?.capture('ad_banner_failed', {
            placement,
            error: error.message,
            platform: Platform.OS,
          })
        }}
        onAdLoaded={() => {
          posthog?.capture('ad_banner_loaded', {
            placement,
            platform: Platform.OS,
          })
        }}
      />
    </YStack>
  )
}
