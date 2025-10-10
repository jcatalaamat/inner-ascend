import { EventCard, FullscreenSpinner, SearchBar, Text, YStack, Button } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { FilterSheet } from 'app/components/FilterSheet'
import type { EventFilters } from 'app/utils/filter-types'
import { getDateRangePreset, isTimeInRange, getActiveFilterCount } from 'app/utils/filter-types'
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
import { useCity } from 'app/contexts/CityContext'

function EventsScreenContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const [eventsWithAds, setEventsWithAds] = useState<DataWithAds<Tables<'events'>>>([])
  const [isLoadingAds, setIsLoadingAds] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [filters, setFilters] = useState<EventFilters>({
    categories: [],
    dateRange: { type: 'all' },
    timeOfDay: [],
  })
  const lastFilteredEventsRef = useRef<Tables<'events'>[]>([])
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const posthog = usePostHog()
  const { selectedCity } = useCity()

  // Feature flags
  const disableEventCreation = useFeatureFlag('disable-event-creation')
  const disableMapButton = useFeatureFlag('disable-map-button')
  const showNativeAds = useFeatureFlag('show-native-ads')
  const showCreateButton = !disableEventCreation
  const showMapButton = !disableMapButton

  useEffect(() => {
    posthog?.capture('events_screen_viewed')
  }, [posthog])

  // Fetch upcoming events only (filter out past events) filtered by selected city
  const { data: allEvents = [], isLoading, error, refetch } = useEventsQuery({ includePast: false, city_id: selectedCity })
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

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(event => filters.categories!.includes(event.category))
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

    // Filter by date range
    if (filters.dateRange && filters.dateRange.type !== 'all') {
      const dateRange = getDateRangePreset(filters.dateRange.type)
      if (dateRange) {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate >= dateRange.start && eventDate <= dateRange.end
        })
      }
    }

    // Filter by time of day
    if (filters.timeOfDay && filters.timeOfDay.length > 0) {
      filtered = filtered.filter(event => {
        if (!event.time) return true // Include events without time
        return filters.timeOfDay!.some(timeSlot => isTimeInRange(event.time, timeSlot))
      })
    }

    // Sort by date (upcoming first)
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [allEvents, searchQuery, filters])

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
        {/* Search with Map, Filter, and Create Buttons */}
        <SearchBar
          placeholder={t('events.search_placeholder')}
          onSearch={handleSearch}
          defaultValue={searchQuery}
          showMapButton={showMapButton}
          mapViewType="events"
          onMapPress={() => {
            posthog?.capture('map_button_tapped', { from: 'events' })
            router.push('/map?view=events')
          }}
          showFilterButton={true}
          onFilterPress={() => {
            posthog?.capture('filter_button_tapped', { from: 'events' })
            setFilterSheetOpen(true)
          }}
          activeFilterCount={getActiveFilterCount(filters)}
          showCreateButton={showCreateButton}
          createType="event"
          onCreatePress={() => {
            posthog?.capture('create_button_tapped', { from: 'events', type: 'event' })
            router.push('/create?type=event')
          }}
        />


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
              {(getActiveFilterCount(filters) > 0 || searchQuery) && (
                <Text fontSize="$3" color="$color9" mt="$2">
                  {t('events.try_adjusting_filters')}
                </Text>
              )}
              {getActiveFilterCount(filters) === 0 && !searchQuery && (
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

        {/* Filter Sheet */}
        <FilterSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          filters={filters}
          type="event"
          onApplyFilters={(newFilters) => {
            setFilters(newFilters)
            posthog?.capture('filters_applied', {
              categories_count: newFilters.categories?.length || 0,
              date_range: newFilters.dateRange?.type,
              time_of_day_count: newFilters.timeOfDay?.length || 0,
            })
          }}
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
