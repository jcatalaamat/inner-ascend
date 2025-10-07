import type { Database } from '@my/supabase/types'
import { Calendar, Leaf, MapPin, Phone } from '@tamagui/lucide-icons'
import { useState, memo } from 'react'
import { Button, Card, type CardProps, H6, Image, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'
import { FavoriteButtonWrapper } from './FavoriteButtonWrapper'
import { useTranslation } from 'react-i18next'
import { formatDate, formatTime } from '../../../app/utils/date-helpers'
import i18n from '../../../app/i18n'

type Event = Database['public']['Tables']['events']['Row']

export type EventCardProps = {
  event: Event
  onPress?: () => void
  showFavorite?: boolean
  onToggleFavorite?: () => void
} & Omit<CardProps, 'onPress'>

// Category colors
const categoryColors: Record<string, string> = {
  yoga: 'orange',
  ceremony: 'purple',
  workshop: 'blue',
  party: 'pink',
  market: 'green',
  other: 'gray',
}

const EventCardComponent = ({ event, onPress, showFavorite = false, onToggleFavorite, ...props }: EventCardProps) => {
  const [hover, setHover] = useState(false)
  const { t } = useTranslation()
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'

  return (
    <Card
      cursor="pointer"
      gap="$2"
      p="$3"
      borderRadius="$4"
      chromeless={!hover}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      onPress={() => onPress?.(event)}
      {...props}
    >
      {/* Image */}
      {event.image_url && (
        <YStack position="relative">
          <Image
            source={{ uri: event.image_url }}
            width="100%"
            height={140}
            borderRadius="$3"
            resizeMode="cover"
          />

          {/* Favorite Button on Image */}
          <YStack position="absolute" top="$2" right="$2" zIndex={10}>
            <FavoriteButtonWrapper itemId={event.id} itemType="event" size={20} />
          </YStack>
        </YStack>
      )}

      <YStack gap="$2">
        {/* Title, Eco Badge, and Favorite Button */}
        <XStack jc="space-between" ai="flex-start" gap="$2">
          <H6 size="$5" f={1} numberOfLines={2} fontWeight="700">
            {event.title}
          </H6>
          <XStack ai="center" gap="$1">
            {event.eco_conscious && (
              <XStack ai="center" gap="$1" bg="$green3" px="$2" py="$1" borderRadius="$2">
                <Leaf size={12} color="$green10" />
                <Text fontSize="$1" color="$green11" fontWeight="600">
                  Eco
                </Text>
              </XStack>
            )}
            {!event.image_url && <FavoriteButtonWrapper itemId={event.id} itemType="event" size={20} />}
          </XStack>
        </XStack>

        {/* Category Badge */}
        <Theme name={categoryColors[event.category] || 'gray'}>
          <Button size="$2" px="$3" py="$1" borderRadius="$10" disabled als="flex-start">
            <Text fontSize="$2" tt="capitalize" fontWeight="600">
              {t(`events.categories.${event.category}`)}
            </Text>
          </Button>
        </Theme>

        {/* Date & Time */}
        <XStack ai="center" gap="$2">
          <Calendar size={14} color="$color10" />
          <Text fontSize="$3" color="$color11">
            {formatDate(event.date, locale, t)}
            {event.time && ` • ${formatTime(event.time, locale)}`}
          </Text>
        </XStack>

        {/* Location */}
        <XStack ai="center" gap="$2">
          <MapPin size={14} color="$color10" />
          <Text fontSize="$3" color="$color11" numberOfLines={1}>
            {event.location_name}
          </Text>
        </XStack>

        {/* Price */}
        {event.price && (
          <Text fontSize="$3" fontWeight="600" color="$color12">
            {event.price}
          </Text>
        )}

        {/* Contact Info */}
        {(event.contact_phone || event.contact_whatsapp || event.contact_email || event.contact_instagram) && (
          <XStack ai="center" gap="$2">
            <Phone size={14} color="$color10" />
            <Text fontSize="$3" color="$color11" numberOfLines={1}>
              {t('event_card.contact_available')}
            </Text>
          </XStack>
        )}

        {/* Description Preview */}
        {event.description && (
          <Paragraph fontSize="$3" color="$color10" numberOfLines={3} opacity={0.8}>
            {event.description}
          </Paragraph>
        )}
      </YStack>
    </Card>
  )
}

export const EventCard = memo(EventCardComponent)
