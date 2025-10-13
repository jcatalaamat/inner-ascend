import { Button } from '@my/ui'
import { Check } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { RsvpSheet } from './RsvpSheet'
import type { AttendeeStatus } from 'app/utils/attendee-types'
import { usePostHog } from 'posthog-react-native'
import { useTranslation } from 'react-i18next'
import { getAttendeeStatusIcon, getAttendeeStatusColor } from 'app/utils/attendee-types'

interface RsvpButtonProps {
  eventId: string
  currentStatus?: AttendeeStatus | null
  variant?: 'outlined' | 'ghost' | 'primary'
  size?: '$2' | '$3' | '$4' | '$5'
  fullWidth?: boolean
  showIcon?: boolean
  onRsvpChange?: () => void
}

export function RsvpButton({
  eventId,
  currentStatus,
  variant = 'primary',
  size = '$4',
  fullWidth = false,
  showIcon = true,
  onRsvpChange,
}: RsvpButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const posthog = usePostHog()
  const { t } = useTranslation()

  const handleOpenSheet = () => {
    posthog?.capture('rsvp_button_clicked', {
      event_id: eventId,
      has_existing_rsvp: !!currentStatus,
      current_status: currentStatus,
    })
    setSheetOpen(true)
  }

  // Determine button text based on current status
  const getButtonText = () => {
    if (!currentStatus) {
      return t('rsvp.button')
    }
    // Show status in button text when user has RSVP'd
    switch (currentStatus) {
      case 'going':
        return `✓ ${t('rsvp.status.going')}`
      case 'interested':
        return `★ ${t('rsvp.status.interested')}`
      case 'maybe':
        return `? ${t('rsvp.status.maybe')}`
      default:
        return t('rsvp.change_rsvp')
    }
  }

  // Determine button theme based on status
  const getButtonTheme = () => {
    if (!currentStatus) return 'green'

    switch (currentStatus) {
      case 'going':
        return 'green'
      case 'interested':
        return 'blue'
      case 'maybe':
        return 'yellow'
      default:
        return 'green'
    }
  }

  // Determine button variant based on status
  const getButtonVariant = () => {
    // If no RSVP yet, show solid primary button (call to action)
    if (!currentStatus) return variant

    // If user has RSVP'd, show outlined button (less prominent, shows current state)
    return 'outlined'
  }

  return (
    <>
      <Button
        variant={getButtonVariant()}
        size={size}
        icon={showIcon && !currentStatus ? <Check size={16} /> : undefined}
        onPress={handleOpenSheet}
        theme={getButtonTheme()}
        width={fullWidth ? '100%' : undefined}
        chromeless={variant === 'ghost'}
      >
        {getButtonText()}
      </Button>

      <RsvpSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        eventId={eventId}
        currentStatus={currentStatus}
        onRsvpChange={onRsvpChange}
      />
    </>
  )
}
