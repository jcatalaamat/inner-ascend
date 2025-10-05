import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, Card, H4, Paragraph, EcoBadge, FavoriteButtonWrapper, Theme } from '@my/ui'
import { usePlaceDetailQuery } from 'app/utils/react-query/usePlacesQuery'
import { MapPin, DollarSign, Phone, Mail, Globe, Instagram, Navigation } from '@tamagui/lucide-icons'
import { PLACE_TYPE_COLORS } from 'app/utils/constants'
import { Linking, Platform, Share } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { ImageViewer } from 'app/components/ImageViewer'
import { usePostHog } from 'posthog-react-native'

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

interface PlaceDetailScreenProps {
  id: string
}

export function PlaceDetailScreen({ id }: PlaceDetailScreenProps) {
  const { data: place, isLoading } = usePlaceDetailQuery(id)
  const { t } = useTranslation()
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    if (place) {
      posthog?.capture('place_detail_viewed', {
        place_id: place.id,
        place_name: place.name,
        place_type: place.type,
        has_coordinates: !!(place.lat && place.lng),
        has_contact_info: !!(place.contact_phone || place.contact_email || place.contact_whatsapp),
        is_verified: place.verified,
        is_featured: place.featured,
        is_eco_conscious: place.eco_conscious
      })
    }
  }, [posthog, place])

  if (isLoading) {
    return <FullscreenSpinner />
  }

  if (!place) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Text fontSize="$5" color="$color10">
          {t('places.detail.not_found')}
        </Text>
      </YStack>
    )
  }

  const typeColor = PLACE_TYPE_COLORS[place.type]
  const typeLabel = t(`places.types.${place.type}`)

  const handlePhonePress = () => {
    if (place.contact_phone) Linking.openURL(`tel:${place.contact_phone}`)
  }

  const handleWhatsAppPress = () => {
    if (place.contact_whatsapp) Linking.openURL(`https://wa.me/${place.contact_whatsapp}`)
  }

  const handleEmailPress = () => {
    if (place.contact_email) Linking.openURL(`mailto:${place.contact_email}`)
  }

  const handleWebsitePress = () => {
    if (place.website_url) Linking.openURL(place.website_url)
  }

  const handleInstagramPress = () => {
    if (place.contact_instagram) Linking.openURL(`https://instagram.com/${place.contact_instagram.replace('@', '')}`)
  }

  const handleImagePress = () => {
    setImageViewerVisible(true)
  }

  const handleGetDirections = () => {
    if (!place?.lat || !place?.lng) return

    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    })
    const url = Platform.select({
      ios: `${scheme}?q=${place.lat},${place.lng}`,
      android: `${scheme}${place.lat},${place.lng}?q=${place.lat},${place.lng}`,
    })

    if (url) Linking.openURL(url)
  }

  const handleShare = async () => {
    if (!place) return

    const shareContent = {
      title: place.name,
      message: `${place.name}\n\n${place.description}\n\n${place.location_name}`,
      url: Platform.OS === 'ios' ? `https://mazunteconnect.com/place/${place.id}` : undefined,
    }

    try {
      await Share.share(shareContent)
      posthog?.capture('place_shared', {
        place_id: place.id,
        place_name: place.name,
      })
    } catch (error) {
      console.error('Error sharing place:', error)
    }
  }

  return (
    <ScrollView bg="$background">
        <YStack pb="$4">
          {/* Image */}
          {place.images && place.images.length > 0 && (
            <YStack onPress={handleImagePress} cursor="pointer">
              <Image
                source={{ uri: place.images[0] }}
                height={280}
                width="100%"
              />
            </YStack>
          )}

          {/* Image Viewer */}
          {place.images && place.images.length > 0 && (
            <ImageViewer
              imageUrl={place.images[0]}
              isVisible={imageViewerVisible}
              onClose={() => setImageViewerVisible(false)}
            />
          )}

          <YStack p="$4" gap="$4">
          {/* Header */}
          <XStack jc="space-between" ai="flex-start">
            <YStack f={1} gap="$2">
              <H4>{place.name}</H4>
              <XStack gap="$2" ai="center" flexWrap="wrap">
                <Theme name={typeColor}>
                  <Button size="$2" disabled>
                    {typeLabel}
                  </Button>
                </Theme>
                {place.eco_conscious && <EcoBadge size="small" />}
                {place.verified && (
                  <Button size="$2" disabled theme="blue">
                    Verified
                  </Button>
                )}
                {place.featured && (
                  <Button size="$2" disabled theme="yellow">
                    Featured
                  </Button>
                )}
              </XStack>
            </YStack>
            <FavoriteButtonWrapper itemId={place.id} itemType="place" size={28} />
          </XStack>

          {/* Quick Info */}
          <Card p="$3" gap="$3">
            {place.location_name && (
              <YStack gap="$1">
                <XStack gap="$3" ai="center">
                  <MapPin size={20} color="$color10" />
                  <Text fontSize="$4" f={1}>
                    {place.location_name}
                  </Text>
                </XStack>
                {place.location_directions && (
                  <Text fontSize="$3" color="$color11" paddingLeft="$7">
                    {place.location_directions}
                  </Text>
                )}
              </YStack>
            )}
            {place.price_range && (
              <XStack gap="$3" ai="center">
                <DollarSign size={20} color="$color10" />
                <Text fontSize="$4">{place.price_range}</Text>
              </XStack>
            )}
          </Card>

          {/* Description */}
          {place.description && (
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600">
                {t('places.detail.about')}
              </Text>
              <Paragraph fontSize="$4" color="$color11">
                {place.description}
              </Paragraph>
            </YStack>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <XStack gap="$2" flexWrap="wrap">
              {place.tags.map((tag) => (
                <Button key={tag} size="$2" disabled theme="gray">
                  {t(`tags.${tag}`)}
                </Button>
              ))}
            </XStack>
          )}

          {/* Contact Info */}
          <Card p="$3" gap="$3">
            <Text fontSize="$5" fontWeight="600">
              {t('places.detail.contact')}
            </Text>
            {place.contact_phone && (
              <Button
                onPress={handlePhonePress}
                icon={Phone}
                theme="blue"
                chromeless
                jc="flex-start"
              >
                {place.contact_phone}
              </Button>
            )}
            {place.contact_whatsapp && (
              <Button
                onPress={handleWhatsAppPress}
                icon={Phone}
                theme="green"
                chromeless
                jc="flex-start"
              >
                WhatsApp: {place.contact_whatsapp}
              </Button>
            )}
            {place.contact_email && (
              <Button
                onPress={handleEmailPress}
                icon={Mail}
                theme="blue"
                chromeless
                jc="flex-start"
              >
                {place.contact_email}
              </Button>
            )}
            {place.contact_instagram && (
              <Button
                onPress={handleInstagramPress}
                icon={Instagram}
                theme="purple"
                chromeless
                jc="flex-start"
              >
                {place.contact_instagram}
              </Button>
            )}
            {place.website_url && (
              <Button
                onPress={handleWebsitePress}
                icon={Globe}
                theme="blue"
                chromeless
                jc="flex-start"
              >
{t('places.detail.visit_website')}
              </Button>
            )}
          </Card>

          {/* Map Preview */}
          {place.lat && place.lng && MapView && (
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600">
                {t('places.detail.location')}
              </Text>
              <YStack height={200} borderRadius="$4" overflow="hidden" borderWidth={1} borderColor="$borderColor">
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: place.lat,
                    longitude: place.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: place.lat,
                      longitude: place.lng,
                    }}
                    title={place.location_name}
                  />
                </MapView>
              </YStack>
              <Button
                onPress={handleGetDirections}
                icon={Navigation}
                theme="blue"
                size="$4"
              >
                {t('places.detail.get_directions')}
              </Button>
            </YStack>
          )}

          {/* TODO: Add image gallery if multiple images */}
          
          {/* Share Button */}
          <Button
            onPress={handleShare}
            icon={Globe}
            theme="blue"
            size="$4"
          >
            {t('places.detail.share_place')}
          </Button>
          </YStack>
        </YStack>
      </ScrollView>
  )
}
