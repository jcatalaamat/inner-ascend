import type { Database } from '@my/supabase/types'
import { Calendar, Leaf, MapPin, Phone } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Card, type CardProps, H6, Image, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'
import { FavoriteButtonWrapper } from './FavoriteButtonWrapper'
import { useTranslation } from 'react-i18next'

type Event = Database['public']['Tables']['events']['Row']

export type EventCardProps = {
  event: Event
  onPress?: () => void
  showFavorite?: boolean
  onToggleFavorite?: () => void
} & Omit<CardProps, 'onPress'>

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Helper to format time
const formatTime = (timeString: string | null): string => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Category colors
const categoryColors: Record<string, string> = {
  yoga: 'orange',
  ceremony: 'purple',
  workshop: 'blue',
  party: 'pink',
  market: 'green',
  other: 'gray',
}

export const EventCard = ({ event, onPress, showFavorite = false, onToggleFavorite, ...props }: EventCardProps) => {
  const [hover, setHover] = useState(false)
  const { t } = useTranslation()

  return (
    <Card
      cursor="pointer"
      gap="$2"
      p="$3"
      borderRadius="$4"
      chromeless={!hover}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      onPress={onPress}
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
            {formatDate(event.date)}
            {event.time && ` • ${formatTime(event.time)}`}
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
