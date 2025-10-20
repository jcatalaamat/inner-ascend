import React, { createContext, useContext } from 'react'
import type { PushNotificationPermission } from './types'

// Web version - Push notifications are not supported on web
// This provides a minimal implementation that satisfies the API

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
  // Web doesn't support push notifications - provide stub implementation
  const notifications: NotificationsContextValue = {
    expoPushToken: null,
    permission: 'undetermined' as PushNotificationPermission,
    error: null,
    isRegistering: false,
    requestPermissions: async () => false,
    sendTestNotification: async () => {},
  }

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
