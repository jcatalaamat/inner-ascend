import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, Card, H4, Paragraph, EcoBadge, FavoriteButtonWrapper, Theme } from '@my/ui'
import { useEventDetailQuery } from 'app/utils/react-query/useEventsQuery'
import { Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, Globe, Instagram, Navigation } from '@tamagui/lucide-icons'
import { formatDate, formatTime } from 'app/utils/date-helpers'
import { CATEGORY_COLORS } from 'app/utils/constants'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { useEffect, useState } from 'react'
import { Linking, Platform, Share } from 'react-native'
import { ImageViewer } from 'app/components/ImageViewer'
import i18n from 'app/i18n'

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

export function EventDetailScreen({ id }: EventDetailScreenProps) {
  const { data: event, isLoading } = useEventDetailQuery(id)
  const { t } = useTranslation()
  const posthog = usePostHog()
  const [imageViewerVisible, setImageViewerVisible] = useState(false)

  useEffect(() => {
    if (event) {
      posthog?.capture('event_detail_viewed', {
        event_id: event.id,
        event_title: event.title,
        event_category: event.category,
        is_featured: event.featured,
        is_eco_conscious: event.eco_conscious,
      })
    }
  }, [event, posthog])

  const handlePhonePress = () => {
    if (event?.contact_phone) Linking.openURL(`tel:${event.contact_phone}`)
  }

  const handleWhatsAppPress = () => {
    if (event?.contact_whatsapp) Linking.openURL(`https://wa.me/${event.contact_whatsapp}`)
  }

  const handleEmailPress = () => {
    if (event?.contact_email) Linking.openURL(`mailto:${event.contact_email}`)
  }

  const handleInstagramPress = () => {
    if (event?.contact_instagram) Linking.openURL(`https://instagram.com/${event.contact_instagram.replace('@', '')}`)
  }

  const handleImagePress = () => {
    setImageViewerVisible(true)
  }

  const handleGetDirections = () => {
    if (!event?.lat || !event?.lng) return

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
      // Debug: Log the event data
      console.log('Event data for sharing:', {
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        location_name: event.location_name
      })

      // Format date and time safely using the correct fields
      let eventDate = 'Date TBD'
      let eventTime = 'Time TBD'
      
      if (event.date) {
        try {
          eventDate = formatDate(event.date, i18n.language === 'es' ? 'es-ES' : 'en-US', t) || 'Date TBD'
        } catch (error) {
          console.log('Date formatting error:', error)
          eventDate = new Date(event.date).toLocaleDateString(i18n.language)
        }
      }
      
      if (event.time) {
        try {
          eventTime = formatTime(event.time, i18n.language === 'es' ? 'es-ES' : 'en-US') || 'Time TBD'
        } catch (error) {
          console.log('Time formatting error:', error)
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

  const categoryColor = CATEGORY_COLORS[event.category]
  const categoryLabel = t(`events.categories.${event.category}`)

  return (
    <ScrollView bg="$background">
        <YStack pb="$4">
          {/* Image */}
          {event.image_url && (
            <YStack onPress={handleImagePress} cursor="pointer">
              <Image
                source={{ uri: event.image_url }}
                height={280}
                width="100%"
              />
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

          <YStack p="$4" gap="$4">
          {/* Header */}
          <XStack jc="space-between" ai="flex-start">
            <YStack f={1} gap="$2">
              <H4>{event.title}</H4>
              <XStack gap="$2" ai="center">
                <Theme name={categoryColor}>
                  <Button size="$2" disabled>
                    {categoryLabel}
                  </Button>
                </Theme>
                {event.eco_conscious && <EcoBadge size="small" />}
                {event.featured && (
                  <Button size="$2" disabled theme="yellow">
                    {t('events.detail.featured')}
                  </Button>
                )}
              </XStack>
            </YStack>
            <FavoriteButtonWrapper itemId={event.id} itemType="event" size={28} />
          </XStack>

          {/* Details Card */}
          <Card p="$3" gap="$3">
            <XStack gap="$3" ai="center">
              <Calendar size={20} color="$color10" />
              <Text fontSize="$4">{formatDate(event.date, i18n.language === 'es' ? 'es-ES' : 'en-US', t)}</Text>
            </XStack>
            {event.time && (
              <XStack gap="$3" ai="center">
                <Clock size={20} color="$color10" />
                <Text fontSize="$4">{formatTime(event.time, i18n.language === 'es' ? 'es-ES' : 'en-US')}</Text>
              </XStack>
            )}
            {event.location_name && (
              <YStack gap="$1">
                <XStack gap="$3" ai="center">
                  <MapPin size={20} color="$color10" />
                  <Text fontSize="$4" f={1}>
                    {event.location_name}
                  </Text>
                </XStack>
                {event.location_directions && (
                  <Text fontSize="$3" color="$color11" paddingLeft="$7">
                    {event.location_directions}
                  </Text>
                )}
              </YStack>
            )}
            {event.price && (
              <XStack gap="$3" ai="center">
                <DollarSign size={20} color="$color10" />
                <Text fontSize="$4">{event.price}</Text>
              </XStack>
            )}
          </Card>

          {/* Description */}
          {event.description && (
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600">
                {t('events.detail.about')}
              </Text>
              <Paragraph fontSize="$4" color="$color11">
                {event.description}
              </Paragraph>
            </YStack>
          )}

          {/* Organizer & Contact Info */}
          {(event.organizer_name || event.contact_phone || event.contact_whatsapp || event.contact_email || event.contact_instagram) && (
            <Card p="$3" gap="$3">
              <Text fontSize="$5" fontWeight="600">
                {t('events.detail.organizer')}
              </Text>
              {event.organizer_name && (
                <XStack gap="$3" ai="center">
                  <User size={20} color="$color10" />
                  <Text fontSize="$4">{event.organizer_name}</Text>
                </XStack>
              )}
              {event.contact_phone && (
                <Button
                  onPress={handlePhonePress}
                  icon={Phone}
                  theme="blue"
                  chromeless
                  jc="flex-start"
                >
                  {event.contact_phone}
                </Button>
              )}
              {event.contact_whatsapp && (
                <Button
                  onPress={handleWhatsAppPress}
                  icon={Phone}
                  theme="green"
                  chromeless
                  jc="flex-start"
                >
                  WhatsApp: {event.contact_whatsapp}
                </Button>
              )}
              {event.contact_email && (
                <Button
                  onPress={handleEmailPress}
                  icon={Mail}
                  theme="blue"
                  chromeless
                  jc="flex-start"
                >
                  {event.contact_email}
                </Button>
              )}
              {event.contact_instagram && (
                <Button
                  onPress={handleInstagramPress}
                  icon={Instagram}
                  theme="purple"
                  chromeless
                  jc="flex-start"
                >
                  {event.contact_instagram}
                </Button>
              )}
            </Card>
          )}

          {/* Map Preview */}
          {event.lat && event.lng && MapView && (
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600">
                {t('events.detail.location')}
              </Text>
              <YStack height={200} borderRadius="$4" overflow="hidden" borderWidth={1} borderColor="$borderColor">
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: event.lat,
                    longitude: event.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
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
              <Button
                onPress={handleGetDirections}
                icon={Navigation}
                theme="blue"
                size="$4"
              >
                {t('events.detail.get_directions')}
              </Button>
            </YStack>
          )}

          {/* Share Button */}
          <Button
            onPress={handleShare}
            icon={Globe}
            theme="blue"
            size="$4"
          >
            {t('events.detail.share_event')}
          </Button>
          </YStack>
        </YStack>
      </ScrollView>
  )
}
