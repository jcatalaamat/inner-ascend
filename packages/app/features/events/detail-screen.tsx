import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, H3, Paragraph, FavoriteButtonWrapper } from '@my/ui'
import { useEventDetailQuery } from 'app/utils/react-query/useEventsQuery'
import { Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, Globe, Instagram, Navigation, Share2, MessageCircle } from '@tamagui/lucide-icons'
import { formatDate, formatTime } from 'app/utils/date-helpers'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { useEffect, useState } from 'react'
import { Linking, Platform, Share } from 'react-native'
import { ImageViewer } from 'app/components/ImageViewer'
import i18n from 'app/i18n'
import { useAdInterstitial } from 'app/components/AdInterstitial'
import AsyncStorage from '@react-native-async-storage/async-storage'
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

interface EventDetailScreenProps {
  id: string
}

const EVENT_VIEW_COUNT_KEY = '@event_detail_view_count'

function EventDetailScreenContent({ id }: EventDetailScreenProps) {
  const { data: event, isLoading } = useEventDetailQuery(id)
  const { t } = useTranslation()
  const posthog = usePostHog()
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const { showInterstitial, isEnabled } = useAdInterstitial()

  useEffect(() => {
    if (event) {
      posthog?.capture('event_detail_viewed', {
        event_id: event.id,
        event_title: event.title,
        event_category: event.category,
        is_featured: event.featured,
        is_eco_conscious: event.eco_conscious,
      })

      // Interstitial ad logic: Show after 3rd event view
      const trackViewAndShowAd = async () => {
        if (!isEnabled) return

        try {
          const countStr = await AsyncStorage.getItem(EVENT_VIEW_COUNT_KEY)
          const count = countStr ? parseInt(countStr, 10) : 0
          const newCount = count + 1

          await AsyncStorage.setItem(EVENT_VIEW_COUNT_KEY, newCount.toString())

          // Show ad on every 3rd view (3, 6, 9, etc.)
          if (newCount % 3 === 0) {
            // Small delay so user sees the event first
            setTimeout(async () => {
              const shown = await showInterstitial()
              if (shown) {
                posthog?.capture('ad_interstitial_triggered', {
                  event_id: event.id,
                  view_count: newCount,
                })
              }
            }, 1500)
          }
        } catch (error) {
          console.warn('Failed to track event view count:', error)
        }
      }

      trackViewAndShowAd()
    }
  }, [event, posthog, showInterstitial, isEnabled])

  const handlePhonePress = () => {
    if (event?.contact_phone) {
      posthog?.capture('contact_phone_clicked', {
        item_type: 'event',
        item_id: event.id
      })
      Linking.openURL(`tel:${event.contact_phone}`)
    }
  }

  const handleWhatsAppPress = () => {
    if (event?.contact_whatsapp) {
      posthog?.capture('contact_whatsapp_clicked', {
        item_type: 'event',
        item_id: event.id
      })
      Linking.openURL(`https://wa.me/${event.contact_whatsapp}`)
    }
  }

  const handleEmailPress = () => {
    if (event?.contact_email) {
      posthog?.capture('contact_email_clicked', {
        item_type: 'event',
        item_id: event.id
      })
      Linking.openURL(`mailto:${event.contact_email}`)
    }
  }

  const handleInstagramPress = () => {
    if (event?.contact_instagram) {
      posthog?.capture('contact_instagram_clicked', {
        item_type: 'event',
        item_id: event.id
      })
      Linking.openURL(`https://instagram.com/${event.contact_instagram.replace('@', '')}`)
    }
  }

  const handleImagePress = () => {
    setImageViewerVisible(true)
  }

  const handleGetDirections = () => {
    if (!event?.lat || !event?.lng) return

    posthog?.capture('get_directions_clicked', {
      item_type: 'event',
      item_id: event.id
    })

    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    })
    const url = Platform.select({
      ios: `${scheme}?q=${event.lat},${event.lng}`,
      android: `${scheme}${event.lat},${event.lng}?q=${event.lat},${event.lng}`,
    })

    if (url) Linking.openURL(url)
  }

  const handleShare = async () => {
    if (!event) return

    try {
      let eventDate = 'Date TBD'
      let eventTime = 'Time TBD'

      if (event.date) {
        try {
          eventDate = formatDate(event.date, i18n.language === 'es' ? 'es-ES' : 'en-US', t) || 'Date TBD'
        } catch (error) {
          eventDate = new Date(event.date).toLocaleDateString(i18n.language)
        }
      }

      if (event.time) {
        try {
          eventTime = formatTime(event.time, i18n.language === 'es' ? 'es-ES' : 'en-US') || 'Time TBD'
        } catch (error) {
          eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString(i18n.language, {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      }

      const shareContent = {
        title: event.title || 'Event',
        message: `${event.title || 'Event'}\n\n${event.description || 'Join us for this event!'}\n\n${eventDate} at ${eventTime}\n${event.location_name || 'Location TBD'}`,
        url: Platform.OS === 'ios' ? `https://mazunteconnect.com/event/${event.id}` : undefined,
      }

      await Share.share(shareContent)
      posthog?.capture('event_shared', {
        event_id: event.id,
        event_name: event.title,
      })
    } catch (error) {
      console.error('Error sharing event:', error)
    }
  }

  if (isLoading) {
    return <FullscreenSpinner />
  }

  if (!event) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Text fontSize="$5" color="$color10">
          {t('events.detail.not_found')}
        </Text>
      </YStack>
    )
  }

  const categoryLabel = t(`events.categories.${event.category}`)

  return (
    <ScrollView bg="$background">
      <YStack pb="$4">
        {/* Hero Image with Gradient Overlay */}
        {event.image_url && (
          <YStack position="relative" onPress={handleImagePress} cursor="pointer">
            <Image
              source={{ uri: event.image_url }}
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
                    {categoryLabel}
                  </Text>
                </XStack>
                {event.eco_conscious && (
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
                {event.featured && (
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
                {event.title}
              </H3>
            </YStack>

            {/* Favorite Button */}
            <YStack position="absolute" top="$4" right="$4">
              <FavoriteButtonWrapper itemId={event.id} itemType="event" size={32} />
            </YStack>
          </YStack>
        )}

        {/* Image Viewer */}
        {event.image_url && (
          <ImageViewer
            imageUrl={event.image_url}
            isVisible={imageViewerVisible}
            onClose={() => setImageViewerVisible(false)}
          />
        )}

        <YStack p="$4" gap="$5">
          {/* Quick Info */}
          <YStack gap="$3">
            <XStack gap="$3" ai="center">
              <Calendar size={20} color="$color11" />
              <Text fontSize="$4" color="$color12">
                {formatDate(event.date, i18n.language === 'es' ? 'es-ES' : 'en-US', t)}
              </Text>
            </XStack>
            {event.time && (
              <XStack gap="$3" ai="center">
                <Clock size={20} color="$color11" />
                <Text fontSize="$4" color="$color12">
                  {formatTime(event.time, i18n.language === 'es' ? 'es-ES' : 'en-US')}
                </Text>
              </XStack>
            )}
            {event.location_name && (
              <YStack gap="$1">
                <XStack gap="$3" ai="center">
                  <MapPin size={20} color="$color11" />
                  <Text fontSize="$4" color="$color12" f={1}>
                    {event.location_name}
                  </Text>
                </XStack>
                {event.location_directions && (
                  <Text fontSize="$3" color="$color10" pl="$7">
                    {event.location_directions}
                  </Text>
                )}
              </YStack>
            )}
            {event.price && (
              <XStack gap="$3" ai="center">
                <DollarSign size={20} color="$color11" />
                <Text fontSize="$4" color="$color12">
                  {event.price}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Primary Contact CTA */}
          {(event.contact_whatsapp || event.contact_phone) && (
            <YStack gap="$2">
              {event.contact_whatsapp && (
                <Button
                  size="$5"
                  bg="$green9"
                  color="white"
                  icon={MessageCircle}
                  onPress={handleWhatsAppPress}
                  pressStyle={{ bg: '$green10' }}
                >
                  {t('events.detail.contact_whatsapp')}
                </Button>
              )}
              {event.contact_phone && !event.contact_whatsapp && (
                <Button
                  size="$5"
                  bg="$blue9"
                  color="white"
                  icon={Phone}
                  onPress={handlePhonePress}
                  pressStyle={{ bg: '$blue10' }}
                >
                  {t('events.detail.call')} {event.contact_phone}
                </Button>
              )}
            </YStack>
          )}

          {/* No Contact Info Warning */}
          {!event.contact_whatsapp && !event.contact_phone && !event.contact_email && !event.contact_instagram && (
            <YStack bg="$yellow2" p="$3" borderRadius="$4" borderWidth={1} borderColor="$yellow6">
              <Text fontSize="$3" color="$yellow11" textAlign="center">
                ⚠️ {t('events.detail.no_contact_info')}
              </Text>
            </YStack>
          )}

          {/* Divider */}
          <YStack h={1} bg="$borderColor" />

          {/* Description */}
          {event.description && (
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="700" color="$color12">
                {t('events.detail.about')}
              </Text>
              <Paragraph fontSize="$4" color="$color11" lineHeight="$5">
                {event.description}
              </Paragraph>
            </YStack>
          )}

          {/* Organizer & Other Contact */}
          {(event.organizer_name || event.contact_email || event.contact_instagram || (event.contact_phone && event.contact_whatsapp)) && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('events.detail.organizer')}
                </Text>
                {event.organizer_name && (
                  <XStack gap="$3" ai="center">
                    <User size={20} color="$color11" />
                    <Text fontSize="$4" color="$color12">
                      {event.organizer_name}
                    </Text>
                  </XStack>
                )}
                {event.contact_phone && event.contact_whatsapp && (
                  <Button
                    onPress={handlePhonePress}
                    icon={Phone}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$blue10"
                  >
                    {event.contact_phone}
                  </Button>
                )}
                {event.contact_email && (
                  <Button
                    onPress={handleEmailPress}
                    icon={Mail}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$blue10"
                  >
                    {event.contact_email}
                  </Button>
                )}
                {event.contact_instagram && (
                  <Button
                    onPress={handleInstagramPress}
                    icon={Instagram}
                    size="$3"
                    chromeless
                    jc="flex-start"
                    color="$purple10"
                  >
                    {event.contact_instagram}
                  </Button>
                )}
              </YStack>
            </>
          )}

          {/* Map */}
          {event.lat && event.lng && MapView && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('events.detail.location')}
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
                      latitude: event.lat,
                      longitude: event.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: event.lat,
                        longitude: event.lng,
                      }}
                      title={event.location_name}
                    />
                  </MapView>
                </YStack>
              </YStack>
            </>
          )}

          {/* Action Buttons */}
          <YStack gap="$3" mt="$3">
            {event.lat && event.lng && (
              <Button
                onPress={handleGetDirections}
                icon={Navigation}
                size="$5"
                bg="$blue9"
                color="white"
                pressStyle={{ bg: '$blue10' }}
              >
                {t('events.detail.get_directions')}
              </Button>
            )}
            <Button
              onPress={handleShare}
              icon={Share2}
              size="$5"
              variant="outlined"
            >
              {t('events.detail.share_event')}
            </Button>
            <ReportButton itemId={event.id} itemType="event" variant="outlined" size="$5" />
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

export function EventDetailScreen({ id }: EventDetailScreenProps) {
  return (
    <FavoritesProvider>
      <EventDetailScreenContent id={id} />
    </FavoritesProvider>
  )
}
