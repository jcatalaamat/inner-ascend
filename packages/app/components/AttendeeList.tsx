import { XStack, YStack, Text, Paragraph, Avatar, H5 } from '@my/ui'
import { useTranslation } from 'react-i18next'
import { Users } from '@tamagui/lucide-icons'
import type { AttendeeWithProfile } from 'app/utils/attendee-types'

interface AttendeeListProps {
  attendees: AttendeeWithProfile[]
  maxDisplay?: number
  showCount?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function AttendeeList({
  attendees,
  maxDisplay = 5,
  showCount = true,
  size = 'medium'
}: AttendeeListProps) {
  const { t } = useTranslation()

  if (attendees.length === 0) {
    return null
  }

  const displayedAttendees = attendees.slice(0, maxDisplay)
  const remainingCount = Math.max(0, attendees.length - maxDisplay)

  const getAvatarSize = () => {
    switch (size) {
      case 'small': return 24
      case 'medium': return 32
      case 'large': return 40
      default: return 32
    }
  }

  const avatarSize = getAvatarSize()

  return (
    <XStack ai="center" gap="$2">
      {/* Attendee count with icon */}
      {showCount && (
        <XStack ai="center" gap="$1.5">
          <Users size={16} color="$color11" />
          <Text fontSize="$3" color="$color11" fontWeight="600">
            {t('rsvp.people_going', { count: attendees.length })}
          </Text>
        </XStack>
      )}

      {/* Avatar stack */}
      <XStack ai="center" gap={-8}>
        {displayedAttendees.map((attendee, index) => (
          <Avatar
            key={attendee.id}
            size={avatarSize}
            circular
            borderWidth={2}
            borderColor="$background"
            style={{ zIndex: displayedAttendees.length - index }}
          >
            <Avatar.Image
              src={attendee.profile?.avatar_url || undefined}
            />
            <Avatar.Fallback backgroundColor="$blue9">
              <Text fontSize="$2" color="white">
                {(attendee.profile?.name?.[0] || '?').toUpperCase()}
              </Text>
            </Avatar.Fallback>
          </Avatar>
        ))}

        {/* Show remaining count */}
        {remainingCount > 0 && (
          <XStack
            width={avatarSize}
            height={avatarSize}
            ai="center"
            jc="center"
            borderRadius={avatarSize / 2}
            bg="$gray9"
            borderWidth={2}
            borderColor="$background"
            style={{ zIndex: 0 }}
          >
            <Text fontSize="$1" color="white" fontWeight="700">
              +{remainingCount}
            </Text>
          </XStack>
        )}
      </XStack>
    </XStack>
  )
}

interface AttendeesSectionProps {
  attendees: AttendeeWithProfile[]
  goingCount: number
  currentUserStatus?: string | null
}

/**
 * Full attendees section for event detail screens
 */
export function AttendeesSection({ attendees, goingCount, currentUserStatus }: AttendeesSectionProps) {
  const { t } = useTranslation()

  if (goingCount === 0 && !currentUserStatus) {
    return (
      <YStack gap="$2" p="$3" bg="$gray2" borderRadius="$3">
        <Paragraph size="$3" color="$color10" textAlign="center">
          {t('rsvp.no_attendees')}
        </Paragraph>
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      <H5>{t('rsvp.attendees_section_title')}</H5>

      {/* Current user badge if attending */}
      {currentUserStatus === 'going' && (
        <XStack
          px="$3"
          py="$2"
          bg="$green2"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$green6"
          ai="center"
          gap="$2"
        >
          <Text fontSize="$3" color="$green11">
            ✓ {t('rsvp.going_badge')}
          </Text>
        </XStack>
      )}

      {/* Attendee list */}
      {goingCount > 0 && (
        <YStack gap="$2">
          <AttendeeList
            attendees={attendees}
            maxDisplay={8}
            size="large"
          />

          {/* Additional count message */}
          {goingCount === 1 && currentUserStatus === 'going' && (
            <Paragraph size="$2" color="$color10">
              {t('rsvp.just_you')}
            </Paragraph>
          )}
          {goingCount > 1 && currentUserStatus === 'going' && (
            <Paragraph size="$2" color="$color10">
              {t('rsvp.you_and_others', { count: goingCount - 1 })}
            </Paragraph>
          )}
        </YStack>
      )}
    </YStack>
  )
}
