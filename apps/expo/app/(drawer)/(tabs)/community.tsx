import { ScrollView, Text, Card, YStack, Button, XStack, Spinner } from '@my/ui'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Linking, Alert } from 'react-native'
import {
  useUpcomingSessionsQuery,
  usePastSessionsQuery,
  useRsvpMutation,
  useUserRsvpsQuery,
} from 'app/utils/react-query/useLiveSessionsQuery'
import type { Database } from '@my/supabase/types'
import { FloatingMenuButton } from 'app/components/FloatingMenuButton'

type LiveSession = Database['public']['Tables']['live_sessions']['Row']

// Session type icon mapping
const SESSION_TYPE_ICONS: Record<string, string> = {
  healing_circle: '🌙',
  workshop: '📚',
  meditation: '🧘',
  q_and_a: '💬',
}

// Format date as "FRI, NOV 15"
const formatSessionDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase()
}

// Format time as "7:00 PM"
const formatSessionTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Session Card Component
function SessionCard({
  session,
  isPast = false,
  userRsvp,
  onRsvp,
}: {
  session: LiveSession
  isPast?: boolean
  userRsvp?: 'yes' | 'maybe' | 'no' | null
  onRsvp?: (status: 'yes' | 'maybe') => void
}) {
  const handleJoinCall = async () => {
    if (!session.meeting_url) {
      Alert.alert('No Meeting Link', 'This session does not have a meeting link yet.')
      return
    }

    try {
      const canOpen = await Linking.canOpenURL(session.meeting_url)
      if (canOpen) {
        await Linking.openURL(session.meeting_url)
      } else {
        Alert.alert('Error', 'Cannot open meeting URL')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open meeting link')
      console.error('Error opening meeting URL:', error)
    }
  }

  const sessionTypeIcon = SESSION_TYPE_ICONS[session.session_type || 'healing_circle'] || '🌙'
  const opacity = isPast ? 0.6 : 1

  return (
    <Card
      padding="$5"
      marginBottom="$4"
      backgroundColor="$deepSpace2"
      borderWidth={userRsvp === 'yes' ? 2 : 1}
      borderColor={userRsvp === 'yes' ? '$cosmicViolet' : '$deepSpace3'}
      opacity={opacity}
    >
      {/* Date and Type Header */}
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
        <YStack flex={1}>
          <Text fontSize="$8" fontWeight="bold" color="$cosmicViolet" marginBottom="$1">
            {formatSessionDate(session.session_date)}
          </Text>
          <Text fontSize="$4" color="$silverMoon2">
            {formatSessionTime(session.session_time)} · {session.duration_minutes} min
          </Text>
        </YStack>
        <Card padding="$2" paddingHorizontal="$3" backgroundColor="$deepSpace3">
          <Text fontSize="$5">{sessionTypeIcon}</Text>
        </Card>
      </XStack>

      {/* Title */}
      <Text fontSize="$7" fontWeight="600" color="$silverMoon" marginBottom="$2">
        {session.title}
      </Text>

      {/* Description */}
      {session.description && (
        <Text fontSize="$4" color="$silverMoon2" lineHeight="$3" marginBottom="$3">
          {session.description}
        </Text>
      )}

      {/* Facilitator */}
      {session.facilitator && (
        <XStack gap="$2" marginBottom="$4">
          <Text fontSize="$3" color="$silverMoon3">
            Facilitator:
          </Text>
          <Text fontSize="$3" color="$innerChildGold" fontWeight="500">
            {session.facilitator}
          </Text>
        </XStack>
      )}

      {/* Action Buttons */}
      {!isPast ? (
        <XStack gap="$2">
          {session.meeting_url && (
            <Button
              flex={1}
              size="$4"
              backgroundColor="$cosmicViolet"
              color="$silverMoon"
              onPress={handleJoinCall}
            >
              Join Call →
            </Button>
          )}
          {onRsvp && (
            <XStack gap="$2" flex={1}>
              <Button
                flex={1}
                size="$4"
                theme={userRsvp === 'yes' ? 'active' : 'alt2'}
                onPress={() => onRsvp('yes')}
              >
                {userRsvp === 'yes' ? '✓ Coming' : "I'm Coming"}
              </Button>
              <Button
                flex={1}
                size="$4"
                theme={userRsvp === 'maybe' ? 'active' : 'alt2'}
                onPress={() => onRsvp('maybe')}
              >
                {userRsvp === 'maybe' ? '✓ Maybe' : 'Maybe'}
              </Button>
            </XStack>
          )}
        </XStack>
      ) : (
        <Card padding="$3" backgroundColor="$deepSpace3">
          <Text fontSize="$3" color="$silverMoon3" textAlign="center">
            Session Completed
          </Text>
        </Card>
      )}

      {/* RSVP Badge */}
      {userRsvp && !isPast && (
        <Card
          position="absolute"
          top="$3"
          right="$3"
          padding="$2"
          paddingHorizontal="$3"
          backgroundColor="$cosmicViolet"
        >
          <Text fontSize="$2" color="$silverMoon" fontWeight="600">
            {userRsvp === 'yes' ? "You're Coming!" : "You're Interested"}
          </Text>
        </Card>
      )}
    </Card>
  )
}

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const insets = useSafeAreaInsets()

  const { data: upcomingSessions, isLoading: upcomingLoading } = useUpcomingSessionsQuery()
  const { data: pastSessions, isLoading: pastLoading } = usePastSessionsQuery()
  const { data: userRsvps } = useUserRsvpsQuery()
  const rsvpMutation = useRsvpMutation()

  const isLoading = activeTab === 'upcoming' ? upcomingLoading : pastLoading
  const sessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions

  // Create a map of session ID to RSVP status
  const rsvpMap = new Map(userRsvps?.map((rsvp) => [rsvp.session_id, rsvp.rsvp_status]))

  const handleRsvp = async (sessionId: string, status: 'yes' | 'maybe') => {
    try {
      await rsvpMutation.mutateAsync({ sessionId, status })
    } catch (error) {
      Alert.alert('Error', 'Failed to RSVP. Please try again.')
      console.error('RSVP error:', error)
    }
  }

  return (
    <YStack flex={1} backgroundColor="$deepSpace1">
      <FloatingMenuButton />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {/* Header */}
        <Text fontSize="$8" fontWeight="bold" color="$silverMoon" marginBottom="$2">
          COMMUNITY
        </Text>
        <Text fontSize="$4" color="$silverMoon2" marginBottom="$5">
          Join us for live healing circles & workshops
        </Text>

        {/* Tab Switcher */}
        <XStack gap="$2" marginBottom="$5">
          <Button
            size="$4"
            theme={activeTab === 'upcoming' ? 'active' : 'alt2'}
            onPress={() => setActiveTab('upcoming')}
            flex={1}
          >
            <Text>Upcoming</Text>
          </Button>
          <Button
            size="$4"
            theme={activeTab === 'past' ? 'active' : 'alt2'}
            onPress={() => setActiveTab('past')}
            flex={1}
          >
            <Text>Past Sessions</Text>
          </Button>
        </XStack>

        {/* Content */}
        {isLoading ? (
          <YStack alignItems="center" justifyContent="center" padding="$8">
            <Spinner size="large" color="$cosmicViolet" />
            <Text color="$silverMoon2" marginTop="$3">
              Loading sessions...
            </Text>
          </YStack>
        ) : sessions && sessions.length > 0 ? (
          <YStack>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isPast={activeTab === 'past'}
                userRsvp={rsvpMap.get(session.id) as 'yes' | 'maybe' | 'no' | null}
                onRsvp={
                  activeTab === 'upcoming'
                    ? (status) => handleRsvp(session.id, status)
                    : undefined
                }
              />
            ))}
          </YStack>
        ) : (
          <Card padding="$6" backgroundColor="$deepSpace2" alignItems="center">
            <Text fontSize="$7" marginBottom="$3">
              🌙
            </Text>
            <Text
              fontSize="$6"
              fontWeight="600"
              color="$silverMoon"
              marginBottom="$2"
              textAlign="center"
            >
              {activeTab === 'upcoming' ? 'No Upcoming Sessions' : 'No Past Sessions'}
            </Text>
            <Text color="$silverMoon2" textAlign="center" fontSize="$3" lineHeight="$3">
              {activeTab === 'upcoming'
                ? 'Live healing circles and workshops will be announced here. Stay tuned for upcoming gatherings in our sacred space.'
                : 'Previous sessions will appear here once they are completed.'}
            </Text>
          </Card>
        )}
      </ScrollView>
    </YStack>
  )
}
