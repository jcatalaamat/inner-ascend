import { Button, H4, Paragraph, ScrollView, Separator, Switch, Text, YStack, XStack, useToastController } from '@my/ui'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { useNotifications } from 'app/utils/notifications'
import { Bell, BellOff, TestTube } from '@tamagui/lucide-icons'

interface NotificationPreferences {
  enabled: boolean
  event_reminders: boolean
  new_events: boolean
  event_updates: boolean
  weekly_digest: boolean
  reminder_1h_before: boolean
  reminder_1d_before: boolean
  quiet_hours_enabled: boolean
}

export function NotificationSettingsScreen() {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const { user } = useUser()
  const toast = useToastController()
  const { permission, requestPermissions, sendTestNotification, expoPushToken } = useNotifications()

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    event_reminders: true,
    new_events: true,
    event_updates: true,
    weekly_digest: true,
    reminder_1h_before: true,
    reminder_1d_before: true,
    quiet_hours_enabled: true,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load preferences
  useEffect(() => {
    if (!user) return

    const loadPreferences = async () => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error loading notification preferences:', error)
        toast.show(t('notifications.load_error'), { duration: 3000 })
      } else if (data) {
        setPreferences({
          enabled: data.enabled ?? true,
          event_reminders: data.event_reminders ?? true,
          new_events: data.new_events ?? true,
          event_updates: data.event_updates ?? true,
          weekly_digest: data.weekly_digest ?? true,
          reminder_1h_before: data.reminder_1h_before ?? true,
          reminder_1d_before: data.reminder_1d_before ?? true,
          quiet_hours_enabled: data.quiet_hours_enabled ?? true,
        })
      }

      setIsLoading(false)
    }

    loadPreferences()
  }, [user?.id])

  // Save preferences
  const savePreferences = async () => {
    if (!user) return

    setIsSaving(true)

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
      })

    if (error) {
      console.error('Error saving notification preferences:', error)
      toast.show(t('notifications.save_error'), { duration: 3000 })
    } else {
      toast.show(t('notifications.saved'), { duration: 2000 })
    }

    setIsSaving(false)
  }

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleTestNotification = async () => {
    await sendTestNotification()
    toast.show(t('notifications.test_sent'), { duration: 2000 })
  }

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions()
    if (granted) {
      toast.show(t('notifications.permission_granted'), { duration: 2000 })
    } else {
      toast.show(t('notifications.permission_denied'), { duration: 3000 })
    }
  }

  if (isLoading) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Text>{t('common.loading')}</Text>
      </YStack>
    )
  }

  return (
    <ScrollView>
      <YStack p="$4" gap="$4">
          <YStack gap="$2">
            <H4>{t('notifications.title')}</H4>
            <Paragraph theme="alt2">{t('notifications.description')}</Paragraph>
          </YStack>

          {/* Permission Status */}
          {permission.status !== 'granted' && (
            <YStack
              p="$4"
              bg="$yellow2"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$yellow6"
              gap="$3"
            >
              <XStack ai="center" gap="$2">
                <BellOff size={20} color="$yellow11" />
                <Text fontWeight="600" color="$yellow11">
                  {t('notifications.permission_required')}
                </Text>
              </XStack>
              <Button onPress={handleRequestPermissions} size="$3" theme="yellow">
                {t('notifications.enable_notifications')}
              </Button>
            </YStack>
          )}

          {/* Push Token Status (Debug) */}
          {expoPushToken && (
            <YStack p="$3" bg="$gray2" borderRadius="$4" gap="$2">
              <Text fontSize="$2" fontWeight="600">
                Push Token Registered ✅
              </Text>
              <Text fontSize="$1" theme="alt2" numberOfLines={1} ellipsizeMode="middle">
                {expoPushToken}
              </Text>
            </YStack>
          )}

          <Separator />

          {/* Master Toggle */}
          <XStack ai="center" jc="space-between">
            <YStack f={1}>
              <Text fontWeight="600">{t('notifications.all_notifications')}</Text>
              <Text fontSize="$2" theme="alt2">
                {t('notifications.all_notifications_desc')}
              </Text>
            </YStack>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={(checked) => updatePreference('enabled', checked)}
              size="$4"
              backgroundColor={preferences.enabled ? '$green8' : '$gray6'}
            >
              <Switch.Thumb animation="quick" backgroundColor="$white1" />
            </Switch>
          </XStack>

          {preferences.enabled && (
            <>
              <Separator />

              {/* Event Reminders */}
              <YStack gap="$3">
                <Text fontWeight="600" fontSize="$5">
                  {t('notifications.event_reminders')}
                </Text>

                <XStack ai="center" jc="space-between">
                  <YStack f={1}>
                    <Text>{t('notifications.reminder_1h')}</Text>
                  </YStack>
                  <Switch
                    checked={preferences.reminder_1h_before}
                    onCheckedChange={(checked) => updatePreference('reminder_1h_before', checked)}
                    size="$4"
                    backgroundColor={preferences.reminder_1h_before ? '$green8' : '$gray6'}
                  >
                    <Switch.Thumb animation="quick" backgroundColor="$white1" />
                  </Switch>
                </XStack>

                <XStack ai="center" jc="space-between">
                  <YStack f={1}>
                    <Text>{t('notifications.reminder_1d')}</Text>
                  </YStack>
                  <Switch
                    checked={preferences.reminder_1d_before}
                    onCheckedChange={(checked) => updatePreference('reminder_1d_before', checked)}
                    size="$4"
                    backgroundColor={preferences.reminder_1d_before ? '$green8' : '$gray6'}
                  >
                    <Switch.Thumb animation="quick" backgroundColor="$white1" />
                  </Switch>
                </XStack>
              </YStack>

              <Separator />

              {/* Discovery Notifications */}
              <YStack gap="$3">
                <Text fontWeight="600" fontSize="$5">
                  {t('notifications.discovery')}
                </Text>

                <XStack ai="center" jc="space-between">
                  <YStack f={1}>
                    <Text>{t('notifications.new_events')}</Text>
                    <Text fontSize="$2" theme="alt2">
                      {t('notifications.new_events_desc')}
                    </Text>
                  </YStack>
                  <Switch
                    checked={preferences.new_events}
                    onCheckedChange={(checked) => updatePreference('new_events', checked)}
                    size="$4"
                    backgroundColor={preferences.new_events ? '$green8' : '$gray6'}
                  >
                    <Switch.Thumb animation="quick" backgroundColor="$white1" />
                  </Switch>
                </XStack>

                <XStack ai="center" jc="space-between">
                  <YStack f={1}>
                    <Text>{t('notifications.weekly_digest')}</Text>
                    <Text fontSize="$2" theme="alt2">
                      {t('notifications.weekly_digest_desc')}
                    </Text>
                  </YStack>
                  <Switch
                    checked={preferences.weekly_digest}
                    onCheckedChange={(checked) => updatePreference('weekly_digest', checked)}
                    size="$4"
                    backgroundColor={preferences.weekly_digest ? '$green8' : '$gray6'}
                  >
                    <Switch.Thumb animation="quick" backgroundColor="$white1" />
                  </Switch>
                </XStack>
              </YStack>

              <Separator />

              {/* Updates */}
              <XStack ai="center" jc="space-between">
                <YStack f={1}>
                  <Text fontWeight="600">{t('notifications.event_updates')}</Text>
                  <Text fontSize="$2" theme="alt2">
                    {t('notifications.event_updates_desc')}
                  </Text>
                </YStack>
                <Switch
                  checked={preferences.event_updates}
                  onCheckedChange={(checked) => updatePreference('event_updates', checked)}
                  size="$4"
                  backgroundColor={preferences.event_updates ? '$green8' : '$gray6'}
                >
                  <Switch.Thumb animation="quick" backgroundColor="$white1" />
                </Switch>
              </XStack>

              <Separator />

              {/* Quiet Hours */}
              <XStack ai="center" jc="space-between">
                <YStack f={1}>
                  <Text fontWeight="600">{t('notifications.quiet_hours')}</Text>
                  <Text fontSize="$2" theme="alt2">
                    {t('notifications.quiet_hours_desc')}
                  </Text>
                </YStack>
                <Switch
                  checked={preferences.quiet_hours_enabled}
                  onCheckedChange={(checked) => updatePreference('quiet_hours_enabled', checked)}
                  size="$4"
                  backgroundColor={preferences.quiet_hours_enabled ? '$green8' : '$gray6'}
                >
                  <Switch.Thumb animation="quick" backgroundColor="$white1" />
                </Switch>
              </XStack>
            </>
          )}

          <Separator />

          {/* Save Button */}
          <Button
            onPress={savePreferences}
            disabled={isSaving}
            theme="blue"
            size="$4"
            icon={<Bell />}
          >
            {isSaving ? t('common.saving') : t('common.save')}
          </Button>

          {/* Test Notification */}
          {permission.status === 'granted' && (
            <Button
              onPress={handleTestNotification}
              variant="outlined"
              size="$4"
              icon={<TestTube />}
            >
              {t('notifications.send_test')}
            </Button>
          )}
        </YStack>
      </ScrollView>
  )
}
