import { EventCard, FullscreenSpinner, SearchBar, Text, YStack, Button, XStack, H6, Paragraph } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useMemo, useEffect } from 'react'
import { X } from '@tamagui/lucide-icons'
import { CATEGORY_LABELS, EVENT_CATEGORIES, type EventCategory } from 'app/utils/constants'
import { useEventsQuery } from 'app/utils/react-query/useEventsQuery'
import { formatDate, formatTime, getRelativeDay } from 'app/utils/date-helpers'
import { useTranslation } from 'react-i18next'
import { usePostHog, useFeatureFlag } from 'posthog-react-native'
import { ScreenWrapper } from 'app/components/ScreenWrapper'

export function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const posthog = usePostHog()

  // Feature flag for event creation
  const disableEventCreation = useFeatureFlag('disable-event-creation')
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

  // Debug logging
  console.log('Events data:', { allEvents, isLoading, error })

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
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => {
                posthog?.capture('event_card_tapped', {
                  event_id: item.id,
                  event_title: item.title,
                  event_category: item.category,
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
