import { Button, EventCard, FullscreenSpinner, H4, Text, Theme, View, XStack, YStack } from '@my/ui'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'

interface FavoriteEventsSectionProps {
  events: any[]
  isLoading: boolean
  onViewAll: () => void
  onEventPress: (eventId: string) => void
}

export function FavoriteEventsSection({
  events,
  isLoading,
  onViewAll,
  onEventPress,
}: FavoriteEventsSectionProps) {
  const { t } = useTranslation()
  const posthog = usePostHog()

  const handleViewAll = () => {
    posthog?.capture('profile_section_view_all_tapped', {
      section: 'favorite_events',
    })
    onViewAll()
  }

  return (
    <YStack gap="$3">
      <XStack paddingHorizontal="$4.5" alignItems="center" gap="$2" justifyContent="space-between">
        <H4 theme="alt1" fontWeight="400">
          {t('favorites.events')} ({events.length})
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
          height={180}
          ai="center"
          jc="center"
          backgroundColor="$color2"
          borderRadius="$5"
        >
          <Text fontSize="$4" color="$color10">
            {t('favorites.no_favorite_events')}
          </Text>
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
