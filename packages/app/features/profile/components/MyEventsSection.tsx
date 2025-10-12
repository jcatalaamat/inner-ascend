import { Button, EventCard, FullscreenSpinner, H4, Text, Theme, View, XStack, YStack } from '@my/ui'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'

interface MyEventsSectionProps {
  events: any[]
  isLoading: boolean
  onViewAll: () => void
  onEventPress: (eventId: string) => void
  onCreatePress: () => void
}

export function MyEventsSection({
  events,
  isLoading,
  onViewAll,
  onEventPress,
  onCreatePress,
}: MyEventsSectionProps) {
  const { t } = useTranslation()
  const posthog = usePostHog()

  const handleViewAll = () => {
    posthog?.capture('profile_section_view_all_tapped', {
      section: 'events',
    })
    onViewAll()
  }

  return (
    <YStack gap="$3">
      <XStack paddingHorizontal="$4.5" alignItems="center" gap="$2" justifyContent="space-between">
        <H4 theme="alt1" fontWeight="400">
          {t('profile.my_events')} ({events.length})
        </H4>
        {events.length > 0 && (
          <Theme name="alt2">
            <Button size="$2" chromeless onPress={handleViewAll}>
              {t('profile.view_all')}
            </Button>
          </Theme>
        )}
      </XStack>

      {isLoading ? (
        <View height={200} ai="center" jc="center">
          <FullscreenSpinner />
        </View>
      ) : events.length === 0 ? (
        <View
          marginHorizontal="$4"
          height={200}
          ai="center"
          jc="center"
          backgroundColor="$color2"
          borderRadius="$5"
        >
          <Text fontSize="$5" color="$color10" mb="$2">
            {t('profile.no_events_yet')}
          </Text>
          <Button size="$3" mt="$3" onPress={onCreatePress}>
            {t('profile.create_your_first', { type: 'event' })}
          </Button>
        </View>
      ) : (
        <FlatList
          horizontal
          data={events.slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => onEventPress(item.id)}
              minWidth={300}
              maxWidth={300}
              mr="$3"
              showFavorite
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        />
      )}
    </YStack>
  )
}
