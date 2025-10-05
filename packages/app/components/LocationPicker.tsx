import { YStack, XStack, Input, Text, Button, Sheet, Label, ScrollView } from '@my/ui'
import { useState, forwardRef, useImperativeHandle } from 'react'
import { Platform, Pressable, Dimensions } from 'react-native'
import { MapPin } from '@tamagui/lucide-icons'

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

type LocationData = {
  name: string
  lat: number
  lng: number
  directions?: string
}

export type LocationPickerRef = {
  getLocation: () => LocationData
}

type LocationPickerProps = {
  initialLocation?: LocationData
  label?: string
}

const MAZUNTE_CENTER = {
  latitude: 15.6658,
  longitude: -96.5347,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
}

export const LocationPicker = forwardRef<LocationPickerRef, LocationPickerProps>(({
  initialLocation,
  label = 'Location'
}, ref) => {
  const [open, setOpen] = useState(false)
  const [locationName, setLocationName] = useState(initialLocation?.name || 'Mazunte')
  const [coordinates, setCoordinates] = useState({
    lat: initialLocation?.lat || 15.6658,
    lng: initialLocation?.lng || -96.5347,
  })
  const [directions, setDirections] = useState(initialLocation?.directions || '')

  useImperativeHandle(ref, () => ({
    getLocation: () => ({
      name: locationName,
      lat: coordinates.lat,
      lng: coordinates.lng,
      directions: directions || undefined,
    })
  }))

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate
    setCoordinates({ lat: latitude, lng: longitude })
  }

  const handleDone = () => {
    setOpen(false)
  }

  const displayText = `${locationName} (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`

  // Fallback for web or when maps not available
  if (!MapView || Platform.OS === 'web') {
    return (
      <YStack gap="$2">
        {label && <Label>{label}</Label>}
        <Input
          placeholder="Location name"
          value={locationName}
          onChangeText={setLocationName}
        />
        <Text fontSize="$2" color="$color11">
          Maps not available on web. Default coordinates will be used.
        </Text>
      </YStack>
    )
  }

  return (
    <>
      <YStack gap="$2">
        {label && <Label>{label}</Label>}
        <Pressable onPress={() => setOpen(true)}>
          <XStack
            padding="$3"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$4"
            backgroundColor="$background"
            alignItems="center"
            gap="$2"
          >
            <MapPin size={20} color="$color11" />
            <Text flex={1} color="$color12">
              {displayText}
            </Text>
          </XStack>
        </Pressable>
      </YStack>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[90]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4">
          <Sheet.Handle />
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap="$4" paddingBottom="$4">
              <Text fontSize="$6" fontWeight="600">{label}</Text>

              {/* Location Name */}
              <YStack gap="$2">
                <Label>Location Name</Label>
                <Input
                  placeholder="e.g., Punta Cometa, Casa Om"
                  value={locationName}
                  onChangeText={setLocationName}
                />
              </YStack>

              {/* Map */}
              <YStack height={Dimensions.get('window').height * 0.4} borderRadius="$4" overflow="hidden" borderWidth={1} borderColor="$borderColor">
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={MAZUNTE_CENTER}
                  region={{
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  onPress={handleMapPress}
                >
                  <Marker
                    coordinate={{
                      latitude: coordinates.lat,
                      longitude: coordinates.lng,
                    }}
                    title={locationName}
                  />
                </MapView>
              </YStack>

              <Text fontSize="$2" color="$color11" textAlign="center">
                👆 Tap on the map to set the exact location
              </Text>

              {/* Coordinates Display */}
              <Text fontSize="$2" color="$color10" textAlign="center">
                📍 {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </Text>

              {/* Directions */}
              <YStack gap="$2">
                <Label>Directions (Optional)</Label>
                <Input
                  placeholder="Additional directions"
                  value={directions}
                  onChangeText={setDirections}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </YStack>

              {/* Done Button */}
              <Button onPress={handleDone} size="$4" theme="blue">
                Done
              </Button>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
})
