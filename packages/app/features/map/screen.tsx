import { Text, YStack, XStack, Button } from '@my/ui'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X } from '@tamagui/lucide-icons'
import { useEventsQuery } from 'app/utils/react-query/useEventsQuery'
import { usePlacesQuery } from 'app/utils/react-query/usePlacesQuery'
import { MAZUNTE_CENTER } from 'app/utils/constants'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'

// Import MapView only on native platforms
let MapView: any = null
let Marker: any = null

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps')
    MapView = Maps.default
    Marker = Maps.Marker
  } catch (error) {
    console.log('react-native-maps not available')
  }
}

type MapViewType = 'events' | 'places' | 'both'

export function MapScreen() {
  const params = useLocalSearchParams<{ view?: string }>()
  const [viewType, setViewType] = useState<MapViewType>('both')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const [tappedMarkers, setTappedMarkers] = useState<Set<string>>(new Set())
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const posthog = usePostHog()

  // Auto-select view type based on URL parameter
  useEffect(() => {
    if (params.view === 'events' || params.view === 'places') {
      setViewType(params.view as MapViewType)
    }
  }, [params.view])

  useEffect(() => {
    posthog?.capture('map_screen_viewed', { 
      initial_view: params.view || 'both',
      selected_view: viewType 
    })
  }, [posthog, params.view, viewType])

  const { data: events = [], isLoading: eventsLoading } = useEventsQuery({ includePast: true })
  const { data: places = [], isLoading: placesLoading } = usePlacesQuery({})

  const isLoading = eventsLoading || placesLoading

  // Filter data based on view type and ensure coordinates exist
  const filteredEvents = (viewType === 'events' || viewType === 'both') 
    ? events.filter(event => event.lat && event.lng) 
    : []
  const filteredPlaces = (viewType === 'places' || viewType === 'both') 
    ? places.filter(place => place.lat && place.lng) 
    : []

  // Debug logging (development only)
  if (__DEV__) {
    console.log('MapScreen Debug:', {
      viewType,
      filteredEvents: filteredEvents.length,
      filteredPlaces: filteredPlaces.length,
      eventsWithCoords: events.filter(e => e.lat && e.lng).length,
      placesWithCoords: places.filter(p => p.lat && p.lng).length
    })
  }

  const handleEventPress = (eventId: string) => {
    const markerKey = `event-${eventId}`

    if (tappedMarkers.has(markerKey)) {
      // Second tap - navigate to detail page
      posthog?.capture('map_event_marker_tapped', {
        event_id: eventId,
        view_type: viewType,
      })
      router.push(`/event/${eventId}`)
      setTappedMarkers(prev => {
        const newSet = new Set(prev)
        newSet.delete(markerKey)
        return newSet
      })
    } else {
      // First tap - just show info popup (handled by Marker title/description)
      setTappedMarkers(prev => new Set(prev).add(markerKey))
    }
  }

  const handlePlacePress = (placeId: string) => {
    const markerKey = `place-${placeId}`

    if (tappedMarkers.has(markerKey)) {
      // Second tap - navigate to detail page
      posthog?.capture('map_place_marker_tapped', {
        place_id: placeId,
        view_type: viewType,
      })
      router.push(`/place/${placeId}`)
      setTappedMarkers(prev => {
        const newSet = new Set(prev)
        newSet.delete(markerKey)
        return newSet
      })
    } else {
      // First tap - just show info popup (handled by Marker title/description)
      setTappedMarkers(prev => new Set(prev).add(markerKey))
    }
  }

  if (isLoading) {
    return (
      <ScreenWrapper>
        <YStack f={1} ai="center" jc="center">
          <Text fontSize="$5" color="$color10">{t('map.loading_map')}</Text>
        </YStack>
      </ScreenWrapper>
    )
  }

  // Web fallback or when maps are not available
  if (Platform.OS === 'web' || !MapView) {
    return (
      <ScreenWrapper>
        <YStack f={1} ai="center" jc="center" gap="$4" p="$4">
          <YStack gap="$2" w="100%">
            <Text fontSize="$4" fontWeight="600" color="$color11">
              {Platform.OS === 'web' ? t('map.web_not_supported') : t('map.maps_not_available')}
            </Text>
            <Text color="$color10">
              • {t('map.events_available', { count: filteredEvents.length })}
            </Text>
            <Text color="$color10">
              • {t('map.places_available', { count: filteredPlaces.length })}
            </Text>
            {Platform.OS === 'android' && (
              <Text fontSize="$3" color="$color9" mt="$2">
                {t('map.android_maps_help')}
              </Text>
            )}
          </YStack>
        </YStack>
      </ScreenWrapper>
    )
  }

  return (
    <>
      {/* Minimal view type toggle */}
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
            variant={viewType === 'events' ? 'outlined' : undefined}
            onPress={() => {
              setViewType('events')
              posthog?.capture('map_view_type_changed', { view_type: 'events' })
            }}
            f={1}
            borderRadius="$2"
          >
            <Text fontSize="$3" fontWeight={viewType === 'events' ? '600' : '400'}>
              {t('map.events')}
            </Text>
          </Button>
          <Button
            size="$2"
            variant={viewType === 'places' ? 'outlined' : undefined}
            onPress={() => {
              setViewType('places')
              posthog?.capture('map_view_type_changed', { view_type: 'places' })
            }}
            f={1}
            borderRadius="$2"
          >
            <Text fontSize="$3" fontWeight={viewType === 'places' ? '600' : '400'}>
              {t('map.places')}
            </Text>
          </Button>
          <Button
            size="$2"
            variant={viewType === 'both' ? 'outlined' : undefined}
            onPress={() => {
              setViewType('both')
              posthog?.capture('map_view_type_changed', { view_type: 'both' })
            }}
            f={1}
            borderRadius="$2"
          >
            <Text fontSize="$3" fontWeight={viewType === 'both' ? '600' : '400'}>
              {t('map.both')}
            </Text>
          </Button>
        </XStack>
      </YStack>

      {/* Map View */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: MAZUNTE_CENTER.latitude,
          longitude: MAZUNTE_CENTER.longitude,
          latitudeDelta: MAZUNTE_CENTER.latitudeDelta,
          longitudeDelta: MAZUNTE_CENTER.longitudeDelta,
        }}
        region={{
          latitude: MAZUNTE_CENTER.latitude,
          longitude: MAZUNTE_CENTER.longitude,
          latitudeDelta: MAZUNTE_CENTER.latitudeDelta,
          longitudeDelta: MAZUNTE_CENTER.longitudeDelta,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
      >
        {/* Event Markers */}
        {console.log('Rendering events:', filteredEvents.length, 'events')}
        {filteredEvents.map((event, index) => {
            const markerKey = `event-${event.id}`
            const isTapped = tappedMarkers.has(markerKey)
            
            // Add small offset to prevent overlapping with places at same coordinates
            const offset = 0.0001 * (index % 3) // Small offset based on index
            const offsetLat = event.lat! + offset
            const offsetLng = event.lng! + offset
            
            return (
              <Marker
                key={markerKey}
                coordinate={{
                  latitude: offsetLat,
                  longitude: offsetLng,
                }}
                title={`📅 ${event.title}`}
                description={isTapped 
                  ? `${event.description}\n\nTap again to view details` 
                  : `${event.description}\n\nTap to see more info`
                }
                pinColor="red"
                onPress={() => handleEventPress(event.id)}
              />
            )
          })}

        {/* Place Markers */}
        {filteredPlaces.map((place, index) => {
            const markerKey = `place-${place.id}`
            const isTapped = tappedMarkers.has(markerKey)
            
            // Add small offset to prevent overlapping with events at same coordinates
            const offset = 0.0001 * (index % 3) // Small offset based on index
            const offsetLat = place.lat! - offset // Negative offset to separate from events
            const offsetLng = place.lng! - offset
            
            return (
              <Marker
                key={markerKey}
                coordinate={{
                  latitude: offsetLat,
                  longitude: offsetLng,
                }}
                title={`📍 ${place.name}`}
                description={isTapped 
                  ? `${place.description}\n\nTap again to view details` 
                  : `${place.description}\n\nTap to see more info`
                }
                pinColor="green"
                onPress={() => handlePlacePress(place.id)}
              />
            )
          })}
      </MapView>
    </>
  )
}
