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
      elevation="$2"
      shadowColor="$shadowColor"
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 2 }}
      {...props}
    >
      {/* Image with Overlay Content */}
      {event.image_url && (
        <YStack position="relative" borderRadius="$3" overflow="hidden">
          <Image
            source={{ uri: event.image_url }}
            width="100%"
            height={200}
            borderRadius="$3"
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height="60%"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.7) 100%)',
            }}
            pointerEvents="none"
          />

          {/* Eco Badge - Top Left */}
          {event.eco_conscious && (
            <XStack
              position="absolute"
              top="$2"
              left="$2"
              ai="center"
              gap="$1"
              bg="$green9"
              px="$2.5"
              py="$1.5"
              borderRadius="$3"
              zIndex={10}
            >
              <Leaf size={12} color="white" />
              <Text fontSize="$2" color="white" fontWeight="700">
                Eco
              </Text>
            </XStack>
          )}

          {/* Favorite Button - Top Right */}
          <YStack position="absolute" top="$2" right="$2" zIndex={10}>
            <FavoriteButtonWrapper itemId={event.id} itemType="event" size={20} />
          </YStack>

          {/* Content Overlay at Bottom */}
          <YStack position="absolute" bottom="$3" left="$3" right="$3" gap="$1.5" zIndex={5}>
            {/* Title */}
            <H6
              size="$6"
              numberOfLines={2}
              fontWeight="800"
              color="white"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {event.title}
            </H6>

            {/* Category Badge */}
            <Theme name={categoryColors[event.category] || 'gray'}>
              <Button size="$2" px="$3" py="$1.5" borderRadius="$10" disabled als="flex-start" opacity={0.95}>
                <Text fontSize="$2" tt="capitalize" fontWeight="700">
                  {t(`events.categories.${event.category}`)}
                </Text>
              </Button>
            </Theme>

            {/* Date, Time & Location - Single Line */}
            <XStack ai="center" gap="$2" flexWrap="wrap">
              <XStack ai="center" gap="$1.5">
                <Calendar size={14} color="white" />
                <Text fontSize="$3" color="white" fontWeight="600" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  {formatDate(event.date, locale, t)}
                  {event.time && ` • ${formatTime(event.time, locale)}`}
                </Text>
              </XStack>
            </XStack>

            {/* Location & Price - Single Line */}
            <XStack ai="center" gap="$3" flexWrap="wrap">
              <XStack ai="center" gap="$1.5" f={1}>
                <MapPin size={14} color="white" />
                <Text fontSize="$3" color="white" numberOfLines={1} fontWeight="500" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  {event.location_name}
                </Text>
              </XStack>
              {event.price && (
                <Text fontSize="$4" fontWeight="800" color="white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  {event.price}
                </Text>
              )}
            </XStack>
          </YStack>
        </YStack>
      )}

      {/* Description Below Image (only if exists) */}
      {event.description && (
        <YStack pt="$1">
          <Paragraph fontSize="$3" color="$color10" numberOfLines={2} opacity={0.8} lineHeight="$2">
            {event.description}
          </Paragraph>
        </YStack>
      )}
    </Card>
  )
}

export const EventCard = memo(EventCardComponent)
