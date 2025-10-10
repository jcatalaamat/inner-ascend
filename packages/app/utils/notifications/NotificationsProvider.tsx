import React, { createContext, useContext, useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { usePushNotifications } from './usePushNotifications'
import type { PushNotificationPermission } from './types'

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

interface NotificationsContextValue {
  expoPushToken: string | null
  permission: PushNotificationPermission
  error: string | null
  isRegistering: boolean
  requestPermissions: () => Promise<boolean>
  sendTestNotification: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const notifications = usePushNotifications()

  useEffect(() => {
    // Handle notification taps - navigate to appropriate screen
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data

      // Navigate based on notification type
      if (data?.eventId) {
        router.push(`/events/${data.eventId}`)
      } else if (data?.placeId) {
        router.push(`/places/${data.placeId}`)
      } else if (data?.screen) {
        router.push(data.screen as any)
      }
    })

    return () => subscription.remove()
  }, [])

  return (
    <NotificationsContext.Provider value={notifications}>{children}</NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}
