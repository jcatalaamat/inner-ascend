import { EventCard, FullscreenSpinner, SearchBar, Text, YStack, Button, XStack, H6, Paragraph } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { X } from '@tamagui/lucide-icons'
import { CATEGORY_LABELS, EVENT_CATEGORIES, type EventCategory } from 'app/utils/constants'
import { useEventsQuery } from 'app/utils/react-query/useEventsQuery'
import { formatDate, formatTime, getRelativeDay } from 'app/utils/date-helpers'
import { useTranslation } from 'react-i18next'
import { usePostHog, useFeatureFlag } from 'posthog-react-native'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { NativeAdEventCard } from 'app/components/NativeAdEventCard'
import { injectNativeAds, isAdItem, getAdUnitId, type DataWithAds } from 'app/utils/inject-native-ads'
import { TestIds } from 'react-native-google-mobile-ads'
import type { Tables } from '@my/supabase/types'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'

function EventsScreenContent() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const [eventsWithAds, setEventsWithAds] = useState<DataWithAds<Tables<'events'>>>([])
  const [isLoadingAds, setIsLoadingAds] = useState(false)
  const lastFilteredEventsRef = useRef<Tables<'events'>[]>([])
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const posthog = usePostHog()

  // Feature flags
  const disableEventCreation = useFeatureFlag('disable-event-creation')
  const showNativeAds = useFeatureFlag('show-native-ads')
  const showCreateButton = !disableEventCreation

  useEffect(() => {
    posthog?.capture('events_screen_viewed')
  }, [posthog])

  // Fetch all events once (including past events for now)
  const { data: allEvents = [], isLoading, error, refetch } = useEventsQuery({ includePast: true })
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  // Removed debug logging to improve performance

  // Filter locally for better performance
  const filteredEvents = useMemo(() => {
    let filtered = allEvents

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location_name?.toLowerCase().includes(query)
      )
    }

    // Sort by date (upcoming first)
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [allEvents, selectedCategory, searchQuery])

  // Create stable string key for dependency tracking
  const filteredEventsKey = useMemo(
    () => filteredEvents.map(e => e.id).join(','),
    [filteredEvents]
  )

  // Inject native ads into filtered events
  useEffect(() => {
    // ALWAYS show events immediately (no empty screen)
    setEventsWithAds(filteredEvents)

    if (!showNativeAds) {
      return
    }

    if (filteredEvents.length === 0) {
      return
    }

    let cancelled = false
    setIsLoadingAds(true)

    const prodAdUnitId = process.env.EXPO_PUBLIC_ADMOB_NATIVE_EVENTS_IOS
    const adUnitId = getAdUnitId(prodAdUnitId)

    if (!adUnitId || typeof adUnitId !== 'string') {
      if (__DEV__) console.error('❌ Invalid ad unit ID:', adUnitId)
      setIsLoadingAds(false)
      return
    }

    // Load ads in background, update when ready
    injectNativeAds(filteredEvents, adUnitId, 5)
      .then((result) => {
        if (!cancelled) {
          setEventsWithAds(result)
          setIsLoadingAds(false)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (__DEV__) console.warn('❌ Failed to inject native ads:', error)
          // Keep showing events without ads
          setIsLoadingAds(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [filteredEventsKey, showNativeAds])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    posthog?.capture('events_searched', {
      search_query: query,
      results_count: filteredEvents.length,
    })
  }

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category as EventCategory | null)
    posthog?.capture('events_category_selected', {
      category: category || 'all',
      events_count: category ? allEvents.filter(e => e.category === category).length : allEvents.length,
    })
  }

  // Memoize press handler - extract event from item
  const handleEventPress = useCallback((event: any) => {
    posthog?.capture('event_card_tapped', {
      event_id: event.id,
      event_title: event.title,
      event_category: event.category,
    })
    router.push(`/event/${event.id}`)
  }, [posthog])

  // Memoize renderItem to prevent recreating on every render
  const renderItem = useCallback(({ item }: { item: any }) => {
    if (isAdItem(item)) {
      return (
        <YStack mx="$4" mb="$3">
          <NativeAdEventCard nativeAd={item.nativeAd} />
        </YStack>
      )
    }

    return (
      <EventCard
        event={item}
        onPress={handleEventPress}
        mx="$4"
        mb="$3"
      />
    )
  }, [handleEventPress])

  const keyExtractor = useCallback((item: any, index: number) =>
    isAdItem(item) ? `ad-${index}` : item.id,
  [])

  if (isLoading) {
    return <FullscreenSpinner />
  }

  return (
    <ScreenWrapper>
      <YStack f={1} bg="$background">
        {/* Search with Map and Create Buttons */}
        <SearchBar
          placeholder={t('events.search_placeholder')}
          onSearch={handleSearch}
          defaultValue={searchQuery}
          showMapButton={true}
          mapViewType="events"
          onMapPress={() => {
            posthog?.capture('map_button_tapped', { from: 'events' })
            router.push('/map?view=events')
          }}
          showCreateButton={showCreateButton}
          createType="event"
          onCreatePress={() => {
            posthog?.capture('create_button_tapped', { from: 'events', type: 'event' })
            router.push('/create?type=event')
          }}
        />

        {/* Category Filter - Horizontal Scrollable */}
        <YStack bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <XStack gap="$2">
              <Button
                size="$3"
                variant={selectedCategory === null ? 'outlined' : undefined}
                onPress={() => handleCategorySelect(null)}
              >
                <Text>{t('events.all_events')} ({allEvents.length})</Text>
              </Button>
              {EVENT_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  size="$3"
                  variant={selectedCategory === category ? 'outlined' : undefined}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text>{t(`events.categories.${category}`)}</Text>
                </Button>
              ))}
            </XStack>
          </ScrollView>
        </YStack>


        {/* Events List */}
        <FlatList
          data={eventsWithAds}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: insets.bottom + 80,
          }}
          ListEmptyComponent={
            <YStack ai="center" jc="center" py="$10">
              <Text fontSize="$5" color="$color10">
                {t('events.no_events_found')}
              </Text>
              {(selectedCategory || searchQuery) && (
                <Text fontSize="$3" color="$color9" mt="$2">
                  {t('events.try_adjusting_filters')}
                </Text>
              )}
              {!selectedCategory && !searchQuery && (
                <YStack ai="center" gap="$3" mt="$4">
                  <Text fontSize="$4" color="$color11" ta="center">
                    {t('events.no_events_scheduled')}
                  </Text>
                  <Button onPress={() => router.push('/create')} size="$4">
                    <Text>{t('events.create_first_event')}</Text>
                  </Button>
                </YStack>
              )}
            </YStack>
          }
        />
      </YStack>
    </ScreenWrapper>
  )
}

export function EventsScreen() {
  return (
    <FavoritesProvider>
      <EventsScreenContent />
    </FavoritesProvider>
  )
}
