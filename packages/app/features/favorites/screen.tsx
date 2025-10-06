import { EventCard, PlaceCard, FullscreenSpinner, Text, YStack, Button, XStack } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFavoritesQuery } from 'app/utils/react-query/useFavoritesQuery'
import { useUser } from 'app/utils/useUser'
import { useState, useMemo, useEffect } from 'react'
import { X } from '@tamagui/lucide-icons'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { AdBanner } from 'app/components/AdBanner'

export function FavoritesScreen() {
  const { profile } = useUser()
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<'events' | 'places'>('events')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const { t } = useTranslation()
  const posthog = usePostHog()

  const { data: favorites = [], isLoading, refetch } = useFavoritesQuery(profile?.id)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  // Separate events and places from favorites
  const { favoriteEvents, favoritePlaces } = useMemo(() => {
    const events = favorites.filter(fav => fav.item_type === 'event' && fav.item).map(fav => fav.item)
    const places = favorites.filter(fav => fav.item_type === 'place' && fav.item).map(fav => fav.item)
    return { favoriteEvents: events, favoritePlaces: places }
  }, [favorites])

  useEffect(() => {
    posthog?.capture('favorites_screen_viewed', {
      total_favorites: favorites.length,
      event_favorites: favoriteEvents.length,
      place_favorites: favoritePlaces.length,
    })
  }, [posthog, favorites.length, favoriteEvents.length, favoritePlaces.length])

  if (isLoading) {
    return <FullscreenSpinner />
  }

  // Show empty state if no favorites at all
  if (favorites.length === 0) {
  return (
    <ScreenWrapper>
        <YStack f={1} ai="center" jc="center" py="$10" px="$6">
          <Text fontSize="$6" color="$color10" ta="center" mb="$2">
            ❤️ {t('favorites.no_favorites')}
          </Text>
          <Text fontSize="$4" color="$color9" ta="center" mb="$4">
            {t('favorites.no_favorites_message')}
          </Text>
          <Button onPress={() => router.push('/')} size="$4">
            <Text>{t('favorites.explore_events_places')}</Text>
          </Button>
        </YStack>
    </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      {/* Switcher with map screen style */}
      <YStack 
        bg="$background" 
        borderBottomWidth={1} 
        borderBottomColor="$borderColor"
        px="$4"
        py="$2"
      >
        <XStack 
          w="100%" 
          bg="$color3" 
          borderRadius="$3"
          p="$1"
          gap="$1"
        >
          <Button
            size="$2"
            variant={activeTab === 'events' ? 'outlined' : undefined}
            onPress={() => {
              setActiveTab('events')
              posthog?.capture('favorites_tab_changed', { tab: 'events' })
            }}
            f={1}
            borderRadius="$2"
          >
            <Text fontSize="$3" fontWeight={activeTab === 'events' ? '600' : '400'}>
              {t('favorites.events')}
            </Text>
          </Button>
          <Button
            size="$2"
            variant={activeTab === 'places' ? 'outlined' : undefined}
            onPress={() => {
              setActiveTab('places')
              posthog?.capture('favorites_tab_changed', { tab: 'places' })
            }}
            f={1}
            borderRadius="$2"
          >
            <Text fontSize="$3" fontWeight={activeTab === 'places' ? '600' : '400'}>
              {t('favorites.places')}
            </Text>
          </Button>
        </XStack>
      </YStack>

      {activeTab === 'events' && (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => {
                posthog?.capture('favorite_event_tapped', {
                  event_id: item.id,
                  event_title: item.title,
                })
                router.push(`/event/${item.id}`)
              }}
              mx="$4"
              mb="$3"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 80,
          }}
          ListEmptyComponent={
            <YStack ai="center" jc="center" py="$10">
              <Text fontSize="$5" color="$color10">
                {t('favorites.no_favorite_events')}
              </Text>
              <Text fontSize="$3" color="$color9" mt="$2">
                {t('favorites.tap_heart_events')}
              </Text>
            </YStack>
          }
        />
      )}

      {activeTab === 'places' && (
        <FlatList
          data={favoritePlaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              onPress={() => {
                posthog?.capture('favorite_place_tapped', {
                  place_id: item.id,
                  place_name: item.name,
                })
                router.push(`/place/${item.id}`)
              }}
              mx="$4"
              mb="$3"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 80,
          }}
          ListEmptyComponent={
            <YStack ai="center" jc="center" py="$10">
              <Text fontSize="$5" color="$color10">
                {t('favorites.no_favorite_places')}
              </Text>
              <Text fontSize="$3" color="$color9" mt="$2">
                {t('favorites.tap_heart_places')}
              </Text>
            </YStack>
          }
        />
      )}

      {/* Ad Banner - Feature flag controlled */}
      <AdBanner placement="favorites" />
    </ScreenWrapper>
  )
}
