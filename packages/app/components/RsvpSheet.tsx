import {
  Button,
  H4,
  Label,
  Paragraph,
  ScrollView,
  Sheet,
  RadioGroup,
  YStack,
  XStack,
  useToastController,
} from '@my/ui'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { usePostHog } from 'posthog-react-native'
import type { AttendeeStatus } from 'app/utils/attendee-types'
import { getAttendeeStatusIcon } from 'app/utils/attendee-types'
import { Check } from '@tamagui/lucide-icons'

interface RsvpSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  currentStatus?: AttendeeStatus | null
  onRsvpChange?: () => void
}

const RSVP_STATUSES: { value: AttendeeStatus; labelKey: string; descriptionKey: string; theme: string }[] = [
  { value: 'going', labelKey: 'rsvp.status.going', descriptionKey: 'rsvp.status_descriptions.going', theme: 'green' },
  { value: 'interested', labelKey: 'rsvp.status.interested', descriptionKey: 'rsvp.status_descriptions.interested', theme: 'blue' },
  { value: 'watching', labelKey: 'rsvp.status.watching', descriptionKey: 'rsvp.status_descriptions.watching', theme: 'orange' },
  { value: 'cant_go', labelKey: 'rsvp.status.cant_go', descriptionKey: 'rsvp.status_descriptions.cant_go', theme: 'red' },
]

export function RsvpSheet({ open, onOpenChange, eventId, currentStatus, onRsvpChange }: RsvpSheetProps) {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const { user } = useUser()
  const toast = useToastController()
  const posthog = usePostHog()

  const [status, setStatus] = useState<AttendeeStatus>(currentStatus || 'going')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update local state when current status changes
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus)
    }
  }, [currentStatus])

  const handleSubmit = async () => {
    if (!user) {
      toast.show(t('rsvp.error_not_logged_in'), { duration: 3000 })
      return
    }

    setIsSubmitting(true)

    try {
      // Upsert RSVP (insert or update if exists)
      const { error } = await supabase
        .from('event_attendees')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        }, {
          onConflict: 'event_id,user_id'
        })

      if (error) {
        throw error
      }

      // Track successful RSVP
      posthog?.capture('rsvp_submitted', {
        event_id: eventId,
        status,
        is_update: !!currentStatus,
      })

      toast.show(t('rsvp.success'), { duration: 3000 })

      // Notify parent to refresh
      onRsvpChange?.()

      // Close sheet
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      toast.show(t('rsvp.error'), { duration: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async () => {
    if (!user) {
      toast.show(t('rsvp.error_not_logged_in'), { duration: 3000 })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      // Track RSVP removal
      posthog?.capture('rsvp_removed', {
        event_id: eventId,
        previous_status: currentStatus,
      })

      toast.show(t('rsvp.removed'), { duration: 3000 })

      // Notify parent to refresh
      onRsvpChange?.()

      // Close sheet
      onOpenChange(false)
    } catch (error) {
      console.error('Error removing RSVP:', error)
      toast.show(t('rsvp.error'), { duration: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[75]}
      dismissOnSnapToBottom
      zIndex={100000}
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$0">
        <Sheet.Handle />
        <ScrollView>
          <YStack padding="$4" gap="$4">
            {/* Header */}
            <YStack gap="$2">
              <XStack ai="center" gap="$2">
                <Check size={24} color="$green10" />
                <H4>{t('rsvp.title')}</H4>
              </XStack>
              <Paragraph theme="alt2" size="$3">
                {t('rsvp.description')}
              </Paragraph>
            </YStack>

            {/* Status selection */}
            <YStack gap="$3">
              <RadioGroup value={status} onValueChange={(val) => setStatus(val as AttendeeStatus)}>
                {RSVP_STATUSES.map((s) => (
                  <XStack
                    key={s.value}
                    ai="center"
                    gap="$3"
                    py="$3"
                    px="$3"
                    borderRadius="$3"
                    bg={status === s.value ? `$${s.theme}2` : 'transparent'}
                    borderWidth={status === s.value ? 1 : 0}
                    borderColor={status === s.value ? `$${s.theme}6` : 'transparent'}
                    cursor="pointer"
                    onPress={() => setStatus(s.value)}
                  >
                    <RadioGroup.Item value={s.value} id={s.value} size="$4">
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <YStack f={1} gap="$1">
                      <XStack ai="center" gap="$2">
                        <Label htmlFor={s.value} fontWeight="600" fontSize="$4">
                          {getAttendeeStatusIcon(s.value)} {t(s.labelKey)}
                        </Label>
                      </XStack>
                      <Paragraph size="$2" theme="alt2">
                        {t(s.descriptionKey)}
                      </Paragraph>
                    </YStack>
                  </XStack>
                ))}
              </RadioGroup>
            </YStack>

            {/* Action buttons */}
            <YStack gap="$3">
              {/* Submit button */}
              <Button
                onPress={handleSubmit}
                disabled={isSubmitting || !user}
                theme="green"
                size="$5"
                icon={<Check />}
              >
                {isSubmitting ? t('common.loading') : t('rsvp.submit')}
              </Button>

              {/* Cancel RSVP button (only show if user has existing RSVP) */}
              {currentStatus && (
                <Button
                  onPress={handleRemove}
                  disabled={isSubmitting}
                  variant="outlined"
                  size="$4"
                  theme="red"
                >
                  {t('rsvp.cancel_rsvp')}
                </Button>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
