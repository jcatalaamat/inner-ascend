import { NativeAd, TestIds } from 'react-native-google-mobile-ads'

// Google's official test native ad unit ID
// Source: https://developers.google.com/admob/ios/test-ads
const TEST_NATIVE_AD_UNIT_ID = 'ca-app-pub-3940256099942544/3986624511'

export type AdItem = {
  type: 'ad'
  nativeAd: NativeAd
}

export type DataWithAds<T> = (T | AdItem)[]

/**
 * Injects native ads into an array of data items
 * @param data - Array of items to inject ads into
 * @param adUnitId - AdMob native ad unit ID
 * @param interval - Inject ad every N items (default: 5)
 * @returns Array with ads injected at intervals
 */
export async function injectNativeAds<T>(
  data: T[],
  adUnitId: string,
  interval: number = 5
): Promise<DataWithAds<T>> {
  if (data.length === 0) return data

  const result: DataWithAds<T> = []
  const adsToLoad: Promise<NativeAd>[] = []

  // Calculate how many ads we need
  const numAds = Math.floor(data.length / interval)

  // Load all ads in parallel
  for (let i = 0; i < numAds; i++) {
    adsToLoad.push(
      NativeAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      })
    )
  }

  try {
    const loadedAds = await Promise.all(adsToLoad)

    // Inject ads at intervals
    let adIndex = 0
    data.forEach((item, index) => {
      result.push(item)

      // Insert ad after every `interval` items
      if ((index + 1) % interval === 0 && adIndex < loadedAds.length) {
        result.push({
          type: 'ad',
          nativeAd: loadedAds[adIndex],
        })
        adIndex++
      }
    })

    return result
  } catch (error) {
    console.warn('Failed to load native ads:', error)
    // Return original data without ads if loading fails
    return data
  }
}

/**
 * Type guard to check if an item is an ad
 */
export function isAdItem<T>(item: T | AdItem): item is AdItem {
  return (item as AdItem).type === 'ad'
}

/**
 * Get the appropriate ad unit ID based on environment
 */
export function getAdUnitId(prodId?: string): string {
  const isDev = process.env.EXPO_PUBLIC_URL?.includes('localhost') ||
                process.env.APP_ENV === 'development'

  // TEMPORARY: Force test ads until production ad units are approved by AdMob
  // New ad units can take 24-48 hours to start serving ads
  // TODO: Set to false after your ad units show "Ready" status in AdMob console
  const forceTestAds = true

  const adUnitId = forceTestAds ? TEST_NATIVE_AD_UNIT_ID : (prodId || TEST_NATIVE_AD_UNIT_ID)

  console.log('🆔 Ad Unit ID Selection:', {
    isDev,
    prodId,
    testId: TEST_NATIVE_AD_UNIT_ID,
    selected: adUnitId,
    forceTestAds
  })

  return adUnitId
}
