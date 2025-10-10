import { useEffect, useState, useRef } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'
import type { PushNotificationPermission, RegisterTokenParams } from './types'

/**
 * Hook to manage push notification permissions and token registration
 * Automatically registers/updates push token when user is authenticated
 */
export function usePushNotifications() {
  const supabase = useSupabase()
  const { user } = useUser()
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<PushNotificationPermission>({
    status: 'undetermined',
    canAskAgain: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  /**
   * Request notification permissions from the user
   */
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status, canAskAgain } = await Notifications.getPermissionsAsync()

      if (status !== 'granted') {
        const { status: newStatus, canAskAgain: newCanAskAgain } =
          await Notifications.requestPermissionsAsync()

        setPermission({
          status: newStatus as 'granted' | 'denied' | 'undetermined',
          canAskAgain: newCanAskAgain,
        })

        if (newStatus !== 'granted') {
          setError('Push notification permission denied')
          return false
        }
      } else {
        setPermission({ status, canAskAgain })
      }

      return true
    } catch (err) {
      console.error('Error requesting permissions:', err)
      setError('Failed to request permissions')
      return false
    }
  }

  /**
   * Get Expo push token
   */
  const getExpoPushToken = async (): Promise<string | null> => {
    try {
      // Only works on physical devices
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices')
        return null
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId
      if (!projectId) {
        throw new Error('Project ID not found in app.json')
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      })

      return tokenData.data
    } catch (err) {
      console.error('Error getting push token:', err)
      setError('Failed to get push token')
      return null
    }
  }

  /**
   * Register push token with Supabase
   */
  const registerPushToken = async (params: RegisterTokenParams): Promise<boolean> => {
    if (!user) {
      console.warn('Cannot register push token: user not authenticated')
      return false
    }

    setIsRegistering(true)
    setError(null)

    try {
      const { error: upsertError } = await supabase.from('push_tokens').upsert(
        {
          user_id: user.id,
          token: params.token,
          platform: params.platform,
          device_name: params.deviceName || null,
          app_version: params.appVersion || null,
          is_active: true,
          last_used_at: new Date().toISOString(),
        },
        {
          onConflict: 'token', // Update if token already exists
        }
      )

      if (upsertError) {
        throw upsertError
      }

      console.log('✅ Push token registered successfully')
      return true
    } catch (err) {
      console.error('Error registering push token:', err)
      setError('Failed to register push token')
      return false
    } finally {
      setIsRegistering(false)
    }
  }

  /**
   * Unregister push token (e.g., on logout)
   */
  const unregisterPushToken = async (token: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('push_tokens')
        .update({ is_active: false })
        .eq('token', token)

      if (error) throw error

      console.log('✅ Push token unregistered')
      return true
    } catch (err) {
      console.error('Error unregistering push token:', err)
      return false
    }
  }

  /**
   * Initialize push notifications
   * Requests permissions, gets token, and registers with Supabase
   */
  const initialize = async () => {
    try {
      // Skip on simulator/emulator
      if (!Device.isDevice) {
        console.warn('Skipping push notifications on simulator')
        return
      }

      // Request permissions
      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        return
      }

      // Get Expo push token
      const token = await getExpoPushToken()
      if (!token) {
        return
      }

      setExpoPushToken(token)

      // Register token with Supabase if user is authenticated
      if (user) {
        await registerPushToken({
          token,
          platform: Platform.OS as 'ios' | 'android',
          deviceName: Device.deviceName || undefined,
          appVersion: Constants.expoConfig?.version || undefined,
        })
      }
    } catch (err) {
      console.error('Error initializing push notifications:', err)
      setError('Failed to initialize push notifications')
    }
  }

  /**
   * Auto-initialize on mount and when user changes
   */
  useEffect(() => {
    initialize()
  }, [user?.id])

  /**
   * Set up notification listeners
   */
  useEffect(() => {
    // Notification received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📬 Notification received:', notification)
    })

    // User tapped on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response)

      // Handle navigation based on notification data
      const data = response.notification.request.content.data
      if (data?.eventId) {
        // TODO: Navigate to event detail screen
        console.log('Navigate to event:', data.eventId)
      }
    })

    // Cleanup
    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])

  /**
   * Send a test notification (for testing purposes)
   */
  const sendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification 🔔',
          body: 'Push notifications are working!',
          data: { test: true },
        },
        trigger: { seconds: 1 },
      })
    } catch (err) {
      console.error('Error sending test notification:', err)
    }
  }

  return {
    expoPushToken,
    permission,
    error,
    isRegistering,
    requestPermissions,
    registerPushToken,
    unregisterPushToken,
    sendTestNotification,
    initialize,
  }
}
