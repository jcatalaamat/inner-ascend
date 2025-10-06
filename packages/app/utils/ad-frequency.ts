import AsyncStorage from '@react-native-async-storage/async-storage'

const LAST_INTERSTITIAL_KEY = '@last_interstitial_timestamp'
const MIN_INTERSTITIAL_INTERVAL = 3 * 60 * 1000 // 3 minutes in milliseconds

/**
 * Check if enough time has passed since the last interstitial ad was shown
 * @returns Promise<boolean> - true if ad can be shown, false otherwise
 */
export async function canShowInterstitial(): Promise<boolean> {
  try {
    const lastTimestamp = await AsyncStorage.getItem(LAST_INTERSTITIAL_KEY)

    if (!lastTimestamp) {
      return true // Never shown an ad before
    }

    const timeSinceLastAd = Date.now() - parseInt(lastTimestamp, 10)
    return timeSinceLastAd >= MIN_INTERSTITIAL_INTERVAL
  } catch (error) {
    console.warn('Error checking interstitial frequency:', error)
    return false // Fail safe - don't show ad if we can't check
  }
}

/**
 * Record that an interstitial ad was just shown
 */
export async function recordInterstitialShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_INTERSTITIAL_KEY, Date.now().toString())
  } catch (error) {
    console.warn('Error recording interstitial timestamp:', error)
  }
}

/**
 * Get the time remaining (in seconds) until the next interstitial can be shown
 * @returns Promise<number> - seconds remaining, or 0 if ad can be shown now
 */
export async function getTimeUntilNextInterstitial(): Promise<number> {
  try {
    const lastTimestamp = await AsyncStorage.getItem(LAST_INTERSTITIAL_KEY)

    if (!lastTimestamp) {
      return 0
    }

    const timeSinceLastAd = Date.now() - parseInt(lastTimestamp, 10)
    const timeRemaining = MIN_INTERSTITIAL_INTERVAL - timeSinceLastAd

    return timeRemaining > 0 ? Math.ceil(timeRemaining / 1000) : 0
  } catch (error) {
    console.warn('Error checking time until next interstitial:', error)
    return MIN_INTERSTITIAL_INTERVAL / 1000 // Default to full wait time on error
  }
}
