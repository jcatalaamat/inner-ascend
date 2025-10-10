import { PlaceCard, SearchBar, FullscreenSpinner, Text, YStack } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { FilterSheet } from 'app/components/FilterSheet'
import type { EventFilters } from 'app/utils/filter-types'
import { getActiveFilterCount } from 'app/utils/filter-types'
import { type PlaceType } from 'app/utils/constants'
import { usePlacesQuery } from 'app/utils/react-query/usePlacesQuery'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { useTranslation } from 'react-i18next'
import { usePostHog, useFeatureFlag } from 'posthog-react-native'
import { NativeAdPlaceCard } from 'app/components/NativeAdPlaceCard'
import { injectNativeAds, isAdItem, getAdUnitId, type DataWithAds } from 'app/utils/inject-native-ads'
import { TestIds } from 'react-native-google-mobile-ads'
import type { Tables } from '@my/supabase/types'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'
import { useCity } from 'app/contexts/CityContext'

function PlacesScreenContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const [placesWithAds, setPlacesWithAds] = useState<DataWithAds<Tables<'places'>>>([])
  const [isLoadingAds, setIsLoadingAds] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [filters, setFilters] = useState<EventFilters>({
    categories: [],
    ecoConscious: false,
    verified: false,
    priceRanges: [],
  })
  const lastFilteredPlacesRef = useRef<Tables<'places'>[]>([])
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const posthog = usePostHog()
  const { selectedCity } = useCity()

  // Feature flags
  const disablePlaceCreation = useFeatureFlag('disable-place-creation')
  const disableMapButton = useFeatureFlag('disable-map-button')
  const showNativeAds = useFeatureFlag('show-native-ads')
  const showCreateButton = !disablePlaceCreation
  const showMapButton = !disableMapButton

  useEffect(() => {
    posthog?.capture('places_screen_viewed')
  }, [posthog])

  // Fetch all places filtered by selected city
  const { data: allPlaces = [], isLoading, refetch } = usePlacesQuery({ city_id: selectedCity })
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  // Filter locally for better performance
  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces

    // Filter by types (using categories array)
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(place => filters.categories!.includes(place.type as any))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(query) ||
        place.description?.toLowerCase().includes(query) ||
        place.location_name?.toLowerCase().includes(query)
      )
    }

    // Filter by eco-conscious
    if (filters.ecoConscious) {
      filtered = filtered.filter(place => place.eco_conscious === true)
    }

    // Filter by verified
    if (filters.verified) {
      filtered = filtered.filter(place => place.verified === true)
    }

    return filtered
  }, [allPlaces, searchQuery, filters])

  // Create stable string key for dependency tracking
  const filteredPlacesKey = useMemo(
    () => filteredPlaces.map(p => p.id).join(','),
    [filteredPlaces]
  )

  // Inject native ads into filtered places
  useEffect(() => {
    // ALWAYS show places immediately (no empty screen)
    setPlacesWithAds(filteredPlaces)

    if (!showNativeAds) {
      return
    }

    if (filteredPlaces.length === 0) {
      return
    }

    let cancelled = false
    setIsLoadingAds(true)

    const prodAdUnitId = process.env.EXPO_PUBLIC_ADMOB_NATIVE_PLACES_IOS
    const adUnitId = getAdUnitId(prodAdUnitId)

    if (!adUnitId || typeof adUnitId !== 'string') {
      if (__DEV__) console.error('❌ Invalid ad unit ID:', adUnitId)
      setIsLoadingAds(false)
      return
    }

    // Load ads in background, update when ready
    injectNativeAds(filteredPlaces, adUnitId, 5)
      .then((result) => {
        if (!cancelled) {
          setPlacesWithAds(result)
          setIsLoadingAds(false)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (__DEV__) console.warn('❌ Failed to inject native ads:', error)
          // Keep showing places without ads
          setIsLoadingAds(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [filteredPlacesKey, showNativeAds])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    posthog?.capture('places_searched', {
      search_query: query,
      results_count: filteredPlaces.length,
    })
  }

  // Memoize press handler - extract place from item
  const handlePlacePress = useCallback((place: any) => {
    posthog?.capture('place_card_tapped', {
      place_id: place.id,
      place_name: place.name,
      place_type: place.type,
    })
    router.push(`/place/${place.id}`)
  }, [posthog])

  // Memoize renderItem to prevent recreating on every render
  const renderItem = useCallback(({ item }: { item: any }) => {
    if (isAdItem(item)) {
      return (
        <YStack mx="$4" mb="$3">
          <NativeAdPlaceCard nativeAd={item.nativeAd} />
        </YStack>
      )
    }

    return (
      <PlaceCard
        place={item}
        onPress={handlePlacePress}
        mx="$4"
        mb="$3"
      />
    )
  }, [handlePlacePress])

  const keyExtractor = useCallback((item: any, index: number) =>
    isAdItem(item) ? `ad-${index}` : item.id,
  [])

  return (
    <ScreenWrapper>
      {/* Search with Map, Filter, and Create Buttons */}
      <SearchBar
        placeholder={t('places.search_placeholder')}
        onSearch={handleSearch}
        defaultValue={searchQuery}
        showMapButton={showMapButton}
        mapViewType="places"
        onMapPress={() => {
          posthog?.capture('map_button_tapped', { from: 'places' })
          router.push('/map?view=places')
        }}
        showFilterButton={true}
        onFilterPress={() => {
          posthog?.capture('filter_button_tapped', { from: 'places' })
          setFilterSheetOpen(true)
        }}
        activeFilterCount={getActiveFilterCount(filters)}
        showCreateButton={showCreateButton}
        createType="place"
        onCreatePress={() => {
          posthog?.capture('create_button_tapped', { from: 'places', type: 'place' })
          router.push('/create?type=place')
        }}
      />

      {/* Places List */}
      <FlatList
        data={placesWithAds}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 80,
        }}
        ListEmptyComponent={
          isLoading ? (
            <YStack ai="center" jc="center" py="$10">
              <FullscreenSpinner />
            </YStack>
          ) : (
            <YStack ai="center" jc="center" py="$10">
              <Text fontSize="$5" color="$color10">
                {t('places.no_places_found')}
              </Text>
              {(getActiveFilterCount(filters) > 0 || searchQuery) && (
                <Text fontSize="$3" color="$color9" mt="$2">
                  {t('places.try_adjusting_filters')}
                </Text>
              )}
            </YStack>
          )
        }
      />

      {/* Filter Sheet */}
      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        type="place"
        onApplyFilters={(newFilters) => {
          setFilters(newFilters)
          posthog?.capture('filters_applied', {
            types_count: newFilters.categories?.length || 0,
          })
        }}
      />
    </ScreenWrapper>
  )
}

export function PlacesScreen() {
  return (
    <FavoritesProvider>
      <PlacesScreenContent />
    </FavoritesProvider>
  )
}
