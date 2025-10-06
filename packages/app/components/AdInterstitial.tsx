import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { AdMobInterstitial } from 'expo-ads-admob'
import { canShowInterstitial, recordInterstitialShown } from 'app/utils/ad-frequency'

// Test ad unit IDs from Google AdMob
// Replace these with your real Ad Unit IDs after AdMob account approval
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: __DEV__
    ? 'ca-app-pub-3940256099942544/4411468910' // Test interstitial ID
    : process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL || 'ca-app-pub-3940256099942544/4411468910',
  android: __DEV__
    ? 'ca-app-pub-3940256099942544/1033173712' // Test interstitial ID
    : process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL || 'ca-app-pub-3940256099942544/1033173712',
  default: 'ca-app-pub-3940256099942544/4411468910',
})

/**
 * Hook to manage interstitial ads with frequency capping
 * Call showInterstitial() when you want to potentially show an ad
 * Automatically handles frequency limits and feature flags
 */
export function useAdInterstitial() {
  const showAds = useFeatureFlag('enable-ads')
  const posthog = usePostHog()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!showAds) {
      return
    }

    // Set up interstitial ad listeners
    const setupInterstitial = async () => {
      try {
        await AdMobInterstitial.setAdUnitID(INTERSTITIAL_AD_UNIT_ID!)

        // Request ad
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true })
        setIsReady(true)

        posthog?.capture('ad_interstitial_loaded', {
          platform: Platform.OS,
        })
      } catch (error) {
        console.warn('Failed to load interstitial ad:', error)
        posthog?.capture('ad_interstitial_load_failed', {
          error: String(error),
          platform: Platform.OS,
        })
      }
    }

    setupInterstitial()

    // Clean up
    return () => {
      // Note: expo-ads-admob doesn't provide a way to unload ads
    }
  }, [showAds, posthog])

  /**
   * Show the interstitial ad if:
   * 1. Feature flag is enabled
   * 2. Ad is loaded and ready
   * 3. Frequency cap allows it (3 minutes since last ad)
   */
  const showInterstitial = async () => {
    if (!showAds) {
      console.log('Ads disabled via feature flag')
      return false
    }

    if (!isReady) {
      console.log('Ad not ready yet')
      return false
    }

    const canShow = await canShowInterstitial()
    if (!canShow) {
      console.log('Too soon to show another ad (frequency cap)')
      posthog?.capture('ad_interstitial_frequency_capped', {
        platform: Platform.OS,
      })
      return false
    }

    try {
      await AdMobInterstitial.showAdAsync()
      await recordInterstitialShown()

      posthog?.capture('ad_interstitial_shown', {
        platform: Platform.OS,
      })

      // Load next ad for next time
      setIsReady(false)
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true })
      setIsReady(true)

      return true
    } catch (error) {
      console.warn('Failed to show interstitial ad:', error)
      posthog?.capture('ad_interstitial_show_failed', {
        error: String(error),
        platform: Platform.OS,
      })

      // Try to load a new ad
      setIsReady(false)
      try {
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true })
        setIsReady(true)
      } catch (loadError) {
        console.warn('Failed to reload interstitial ad:', loadError)
      }

      return false
    }
  }

  return {
    showInterstitial,
    isReady,
    isEnabled: showAds,
  }
}
