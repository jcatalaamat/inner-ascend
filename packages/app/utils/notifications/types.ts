import type { Database } from '@my/supabase/types'

export type NotificationType =
  | 'event_reminder'
  | 'new_event'
  | 'event_update'
  | 'weekly_digest'
  | 'rsvp_confirmation'
  | 'event_cancelled'

export type PushToken = Database['public']['Tables']['push_tokens']['Row']
export type NotificationPreferences = Database['public']['Tables']['notification_preferences']['Row']

export interface NotificationData {
  type: NotificationType
  eventId?: string
  placeId?: string
  title: string
  body: string
  [key: string]: any
}

export interface PushNotificationPermission {
  status: 'granted' | 'denied' | 'undetermined'
  canAskAgain: boolean
}

export interface RegisterTokenParams {
  token: string
  platform: 'ios' | 'android' | 'web'
  deviceName?: string
  appVersion?: string
}
