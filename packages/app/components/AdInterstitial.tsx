import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import { useEffect, useState, useRef } from 'react'
import { Platform } from 'react-native'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads'
import { canShowInterstitial, recordInterstitialShown } from 'app/utils/ad-frequency'

// Ad unit IDs from environment or test IDs
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: __DEV__
    ? TestIds.INTERSTITIAL // Google's test interstitial ID
    : process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL || TestIds.INTERSTITIAL,
  android: __DEV__
    ? TestIds.INTERSTITIAL // Google's test interstitial ID
    : process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL || TestIds.INTERSTITIAL,
  default: TestIds.INTERSTITIAL,
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
  const interstitialRef = useRef<InterstitialAd | null>(null)

  useEffect(() => {
    if (!showAds) {
      return
    }

    // Create and load interstitial ad
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID!, {
      requestNonPersonalizedAdsOnly: false,
    })

    // Set up event listeners
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsReady(true)
      posthog?.capture('ad_interstitial_loaded', {
        platform: Platform.OS,
      })
    })

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('Interstitial ad error:', error)
      setIsReady(false)
      posthog?.capture('ad_interstitial_load_failed', {
        error: String(error),
        platform: Platform.OS,
      })
    })

    // Load the ad
    interstitial.load()
    interstitialRef.current = interstitial

    // Clean up
    return () => {
      unsubscribeLoaded()
      unsubscribeError()
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

    if (!isReady || !interstitialRef.current) {
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
      // Show the ad
      await interstitialRef.current.show()
      await recordInterstitialShown()

      posthog?.capture('ad_interstitial_shown', {
        platform: Platform.OS,
      })

      // Load next ad for next time
      setIsReady(false)
      const nextInterstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID!, {
        requestNonPersonalizedAdsOnly: false,
      })

      nextInterstitial.addAdEventListener(AdEventType.LOADED, () => {
        setIsReady(true)
      })

      nextInterstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('Failed to load next interstitial ad:', error)
        setIsReady(false)
      })

      nextInterstitial.load()
      interstitialRef.current = nextInterstitial

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
        const retryInterstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID!, {
          requestNonPersonalizedAdsOnly: false,
        })

        retryInterstitial.addAdEventListener(AdEventType.LOADED, () => {
          setIsReady(true)
        })

        retryInterstitial.load()
        interstitialRef.current = retryInterstitial
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
