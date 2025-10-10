import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, H3, Paragraph, FavoriteButtonWrapper } from '@my/ui'
import { usePlaceDetailQuery } from 'app/utils/react-query/usePlacesQuery'
import { MapPin, DollarSign, Phone, Mail, Globe, Instagram, Navigation, Share2 } from '@tamagui/lucide-icons'
import { Linking, Platform, Share } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { ImageViewer } from 'app/components/ImageViewer'
import { usePostHog } from 'posthog-react-native'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'
import { LinearGradient } from '@tamagui/linear-gradient'
import { ReportButton } from 'app/components/ReportButton'

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

function PlaceDetailScreenContent({ id }: PlaceDetailScreenProps) {
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

  const typeLabel = t(`places.types.${place.type}`)

  const handlePhonePress = () => {
    if (place.contact_phone) {
      posthog?.capture('contact_phone_clicked', {
        item_type: 'place',
        item_id: place.id
      })
      Linking.openURL(`tel:${place.contact_phone}`)
    }
  }

  const handleWhatsAppPress = () => {
    if (place.contact_whatsapp) {
      posthog?.capture('contact_whatsapp_clicked', {
        item_type: 'place',
        item_id: place.id
      })
      Linking.openURL(`https://wa.me/${place.contact_whatsapp}`)
    }
  }

  const handleEmailPress = () => {
    if (place.contact_email) {
      posthog?.capture('contact_email_clicked', {
        item_type: 'place',
        item_id: place.id
      })
      Linking.openURL(`mailto:${place.contact_email}`)
    }
  }

  const handleWebsitePress = () => {
    if (place.website_url) {
      posthog?.capture('contact_website_clicked', {
        item_type: 'place',
        item_id: place.id
      })
      Linking.openURL(place.website_url)
    }
  }

  const handleInstagramPress = () => {
    if (place.contact_instagram) {
      posthog?.capture('contact_instagram_clicked', {
        item_type: 'place',
        item_id: place.id
      })
      Linking.openURL(`https://instagram.com/${place.contact_instagram.replace('@', '')}`)
    }
  }

  const handleImagePress = () => {
    setImageViewerVisible(true)
  }

  const handleGetDirections = () => {
    if (!place?.lat || !place?.lng) return

    posthog?.capture('get_directions_clicked', {
      item_type: 'place',
      item_id: place.id
    })

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

    try {
      const shareContent = {
        title: place.name,
        message: `${place.name}\n\n${place.description || 'Check out this place in Mazunte!'}\n\n${place.location_name || 'Mazunte, Oaxaca'}`,
        url: Platform.OS === 'ios' ? `https://mazunteconnect.com/place/${place.id}` : undefined,
      }

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
        {/* Hero Image with Gradient Overlay */}
        {place.images && place.images.length > 0 && (
          <YStack position="relative" onPress={handleImagePress} cursor="pointer">
            <Image
              source={{ uri: place.images[0] }}
              height={400}
              width="100%"
            />

            {/* Gradient Overlay */}
            <LinearGradient
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="60%"
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={[0, 0]}
              end={[0, 1]}
            />

            {/* Content Overlay */}
            <YStack position="absolute" bottom="$4" left="$4" right="$4" gap="$2">
              {/* Badges */}
              <XStack gap="$2" ai="center" flexWrap="wrap">
                <XStack
                  bg="rgba(255,255,255,0.25)"
                  px="$2.5"
                  py="$1.5"
                  borderRadius="$10"
                  backdropFilter="blur(10px)"
                >
                  <Text fontSize="$2" color="white" fontWeight="700">
                    {typeLabel}
                  </Text>
                </XStack>
                {place.eco_conscious && (
                  <XStack
                    bg="rgba(67, 233, 123, 0.3)"
                    px="$2.5"
                    py="$1.5"
                    borderRadius="$10"
                    backdropFilter="blur(10px)"
                  >
                    <Text fontSize="$2" color="white" fontWeight="700">
                      🌿 Eco
                    </Text>
                  </XStack>
                )}
                {place.verified && (
                  <XStack
                    bg="rgba(59, 130, 246, 0.3)"
                    px="$2.5"
                    py="$1.5"
                    borderRadius="$10"
                    backdropFilter="blur(10px)"
                  >
                    <Text fontSize="$2" color="white" fontWeight="700">
                      ✓ Verified
                    </Text>
                  </XStack>
                )}
                {place.featured && (
                  <XStack
                    bg="rgba(255, 200, 0, 0.3)"
                    px="$2.5"
                    py="$1.5"
                    borderRadius="$10"
                    backdropFilter="blur(10px)"
                  >
                    <Text fontSize="$2" color="white" fontWeight="700">
                      ⭐ Featured
                    </Text>
                  </XStack>
                )}
              </XStack>

              {/* Title */}
              <H3 color="white" textShadowColor="rgba(0,0,0,0.5)" textShadowRadius={10}>
                {place.name}
              </H3>
            </YStack>

            {/* Favorite Button */}
            <YStack position="absolute" top="$4" right="$4">
              <FavoriteButtonWrapper itemId={place.id} itemType="place" size={32} />
            </YStack>
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

        <YStack p="$4" gap="$5">
          {/* Quick Info */}
          <YStack gap="$3">
            {place.location_name && (
              <YStack gap="$1">
                <XStack gap="$3" ai="center">
                  <MapPin size={20} color="$color11" />
                  <Text fontSize="$4" color="$color12" f={1}>
                    {place.location_name}
                  </Text>
                </XStack>
                {place.location_directions && (
                  <Text fontSize="$3" color="$color10" pl="$7">
                    {place.location_directions}
                  </Text>
                )}
              </YStack>
            )}
            {place.price_range && (
              <XStack gap="$3" ai="center">
                <DollarSign size={20} color="$color11" />
                <Text fontSize="$4" color="$color12">
                  {place.price_range}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Divider */}
          <YStack h={1} bg="$borderColor" />

          {/* Description */}
          {place.description && (
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="700" color="$color12">
                {t('places.detail.about')}
              </Text>
              <Paragraph fontSize="$4" color="$color11" lineHeight="$5">
                {place.description}
              </Paragraph>
            </YStack>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <XStack gap="$2" flexWrap="wrap">
              {place.tags.map((tag) => (
                <XStack
                  key={tag}
                  bg="$gray3"
                  px="$2.5"
                  py="$1.5"
                  borderRadius="$10"
                >
                  <Text fontSize="$2" color="$color11" fontWeight="600">
                    {t(`tags.${tag}`)}
                  </Text>
                </XStack>
              ))}
            </XStack>
          )}

          {/* Contact Info */}
          {(place.contact_phone || place.contact_whatsapp || place.contact_email || place.contact_instagram || place.website_url) && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('places.detail.contact')}
                </Text>
                {place.contact_phone && (
                  <Button
                    onPress={handlePhonePress}
                    icon={Phone}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$blue10"
                  >
                    {place.contact_phone}
                  </Button>
                )}
                {place.contact_whatsapp && (
                  <Button
                    onPress={handleWhatsAppPress}
                    icon={Phone}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$green10"
                  >
                    WhatsApp: {place.contact_whatsapp}
                  </Button>
                )}
                {place.contact_email && (
                  <Button
                    onPress={handleEmailPress}
                    icon={Mail}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$blue10"
                  >
                    {place.contact_email}
                  </Button>
                )}
                {place.contact_instagram && (
                  <Button
                    onPress={handleInstagramPress}
                    icon={Instagram}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$purple10"
                  >
                    {place.contact_instagram}
                  </Button>
                )}
                {place.website_url && (
                  <Button
                    onPress={handleWebsitePress}
                    icon={Globe}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$blue10"
                  >
                    {t('places.detail.visit_website')}
                  </Button>
                )}
              </YStack>
            </>
          )}

          {/* Map */}
          {place.lat && place.lng && MapView && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('places.detail.location')}
                </Text>
                <YStack
                  height={300}
                  borderRadius="$4"
                  overflow="hidden"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: place.lat,
                      longitude: place.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
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
              </YStack>
            </>
          )}

          {/* Action Buttons */}
          <YStack gap="$3" mt="$3">
            {place.lat && place.lng && (
              <Button
                onPress={handleGetDirections}
                icon={Navigation}
                size="$5"
                bg="$blue9"
                color="white"
                pressStyle={{ bg: '$blue10' }}
              >
                {t('places.detail.get_directions')}
              </Button>
            )}
            <Button
              onPress={handleShare}
              icon={Share2}
              size="$5"
              variant="outlined"
            >
              {t('places.detail.share_place')}
            </Button>
            <ReportButton itemId={place.id} itemType="place" variant="outlined" size="$5" />
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

export function PlaceDetailScreen({ id }: PlaceDetailScreenProps) {
  return (
    <FavoritesProvider>
      <PlaceDetailScreenContent id={id} />
    </FavoritesProvider>
  )
}
