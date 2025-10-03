import { Text, YStack, XStack, Button } from '@my/ui'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X } from '@tamagui/lucide-icons'
import { useEventsQuery } from 'app/utils/react-query/useEventsQuery'
import { usePlacesQuery } from 'app/utils/react-query/usePlacesQuery'
import { MAZUNTE_CENTER } from 'app/utils/constants'
import { ScreenWrapper } from 'app/components/ScreenWrapper'

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
  const [viewType, setViewType] = useState<MapViewType>('both')
  const [headerDismissed, setHeaderDismissed] = useState(false)
  const [tappedMarkers, setTappedMarkers] = useState<Set<string>>(new Set())
  const insets = useSafeAreaInsets()
  
  const { data: events = [], isLoading: eventsLoading } = useEventsQuery({})
  const { data: places = [], isLoading: placesLoading } = usePlacesQuery({})

  const isLoading = eventsLoading || placesLoading

  // Filter data based on view type
  const filteredEvents = viewType === 'events' || viewType === 'both' ? events : []
  const filteredPlaces = viewType === 'places' || viewType === 'both' ? places : []

  const handleEventPress = (eventId: string) => {
    const markerKey = `event-${eventId}`
    
    if (tappedMarkers.has(markerKey)) {
      // Second tap - navigate to detail page
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
          <Text fontSize="$5" color="$color10">Loading map...</Text>
        </YStack>
      </ScreenWrapper>
    )
  }

  // Web fallback
  if (Platform.OS === 'web' || !MapView) {
    return (
      <ScreenWrapper>
        <YStack f={1} ai="center" jc="center" gap="$4" p="$4">
          <YStack gap="$2" w="100%">
            <Text fontSize="$4" fontWeight="600" color="$color11">
              📍 Mazunte, Mexico (15.666°N, 96.556°W)
            </Text>
            <Text color="$color10">
              • Events: {filteredEvents.length} available
            </Text>
            <Text color="$color10">
              • Places: {filteredPlaces.length} available
            </Text>
          </YStack>
        </YStack>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      {/* View type toggle - always visible */}
      <YStack 
        bg="$background" 
        borderBottomWidth={1} 
        borderBottomColor="$borderColor"
      >
        <XStack 
          w="100%" 
          bg="$background" 
          px="$4"
          py="$3"
          gap="$2"
        >
        <Button
          size="$3"
          variant={viewType === 'events' ? 'outlined' : 'ghost'}
          onPress={() => setViewType('events')}
          f={1}
        >
          <Text>Events ({filteredEvents.length})</Text>
        </Button>
        <Button
          size="$3"
          variant={viewType === 'places' ? 'outlined' : 'ghost'}
          onPress={() => setViewType('places')}
          f={1}
        >
          <Text>Places ({filteredPlaces.length})</Text>
        </Button>
        <Button
          size="$3"
          variant={viewType === 'both' ? 'outlined' : 'ghost'}
          onPress={() => setViewType('both')}
          f={1}
        >
          <Text>Both</Text>
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
        {/* Event Markers - Only show if coordinates exist */}
        {filteredEvents
          .filter(event => event.lat && event.lng)
          .map((event) => {
            const markerKey = `event-${event.id}`
            const isTapped = tappedMarkers.has(markerKey)
            
            return (
              <Marker
                key={markerKey}
                coordinate={{
                  latitude: event.lat!,
                  longitude: event.lng!,
                }}
                title={event.title}
                description={isTapped 
                  ? `${event.description}\n\nTap again to view details` 
                  : `${event.description}\n\nTap to see more info`
                }
                pinColor="blue"
                onPress={() => handleEventPress(event.id)}
              />
            )
          })}

        {/* Place Markers - Only show if coordinates exist */}
        {filteredPlaces
          .filter(place => place.lat && place.lng)
          .map((place) => {
            const markerKey = `place-${place.id}`
            const isTapped = tappedMarkers.has(markerKey)
            
            return (
              <Marker
                key={markerKey}
                coordinate={{
                  latitude: place.lat!,
                  longitude: place.lng!,
                }}
                title={place.name}
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
    </ScreenWrapper>
  )
}
