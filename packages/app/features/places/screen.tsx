import { PlaceCard, SearchBar, CategoryFilter, FullscreenSpinner, Text, YStack, Button, XStack } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { X } from '@tamagui/lucide-icons'
import { PLACE_TYPE_COLORS, PLACE_TYPE_LABELS, PLACE_TYPES, type PlaceType } from 'app/utils/constants'
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
  const [selectedType, setSelectedType] = useState<PlaceType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const [placesWithAds, setPlacesWithAds] = useState<DataWithAds<Tables<'places'>>>([])
  const [isLoadingAds, setIsLoadingAds] = useState(false)
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

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(place => place.type === selectedType)
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

    return filtered
  }, [allPlaces, selectedType, searchQuery])

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

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type as PlaceType | null)
    posthog?.capture('places_type_selected', {
      type: type || 'all',
      places_count: type ? allPlaces.filter(p => p.type === type).length : allPlaces.length,
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
      {/* Search with Map and Create Buttons */}
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
        showCreateButton={showCreateButton}
        createType="place"
        onCreatePress={() => {
          posthog?.capture('create_button_tapped', { from: 'places', type: 'place' })
          router.push('/create?type=place')
        }}
      />

      {/* Type Filter - Horizontal Scrollable */}
      <YStack bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <XStack gap="$2">
            <Button
              size="$3"
              variant={selectedType === null ? 'outlined' : undefined}
              onPress={() => handleTypeSelect(null)}
            >
              <Text>{t('places.all')} ({allPlaces.length})</Text>
            </Button>
            {PLACE_TYPES.map((type) => (
              <Button
                key={type}
                size="$3"
                variant={selectedType === type ? 'outlined' : undefined}
                onPress={() => handleTypeSelect(type)}
              >
                <Text>{t(`places.types.${type}`)}</Text>
              </Button>
            ))}
          </XStack>
        </ScrollView>
      </YStack>

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
              {(selectedType || searchQuery) && (
                <Text fontSize="$3" color="$color9" mt="$2">
                  {t('places.try_adjusting_filters')}
                </Text>
              )}
            </YStack>
          )
        }
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
