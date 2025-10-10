import type { Database } from '@my/supabase/types'
import { Leaf, MapPin, Phone, Star } from '@tamagui/lucide-icons'
import { useState, memo } from 'react'
import { Button, Card, type CardProps, H6, Image, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'
import { FavoriteButtonWrapper } from './FavoriteButtonWrapper'
import { useTranslation } from 'react-i18next'

type Place = Database['public']['Tables']['places']['Row']

export type PlaceCardProps = {
  place: Place
  onPress?: () => void
  showFavorite?: boolean
  onToggleFavorite?: () => void
} & Omit<CardProps, 'onPress'>

// Place type colors
const placeTypeColors: Record<string, string> = {
  retreat: 'green',
  wellness: 'blue',
  restaurant: 'orange',
  activity: 'yellow',
  community: 'purple',
}

const PlaceCardComponent = ({ place, onPress, showFavorite = false, onToggleFavorite, ...props }: PlaceCardProps) => {
  const [hover, setHover] = useState(false)
  const { t } = useTranslation()
  const mainImage = place.images && place.images.length > 0 ? place.images[0] : null

  return (
    <Card
      cursor="pointer"
      gap="$2"
      p="$3"
      borderRadius="$4"
      chromeless={!hover}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      onPress={() => onPress?.(place)}
      elevation="$2"
      shadowColor="$shadowColor"
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 2 }}
      {...props}
    >
      {/* Image with Overlay Content */}
      {mainImage && (
        <YStack position="relative" borderRadius="$3" overflow="hidden">
          <Image
            source={{ uri: mainImage }}
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

          {/* Badges - Top Left */}
          <XStack position="absolute" top="$2" left="$2" gap="$2" zIndex={10}>
            {place.verified && (
              <XStack ai="center" gap="$1" bg="$blue9" px="$2.5" py="$1.5" borderRadius="$3">
                <Star size={12} color="white" fill="white" />
                <Text fontSize="$2" color="white" fontWeight="700">
                  Verified
                </Text>
              </XStack>
            )}
            {place.eco_conscious && (
              <XStack ai="center" gap="$1" bg="$green9" px="$2.5" py="$1.5" borderRadius="$3">
                <Leaf size={12} color="white" />
                <Text fontSize="$2" color="white" fontWeight="700">
                  Eco
                </Text>
              </XStack>
            )}
          </XStack>

          {/* Favorite Button - Top Right */}
          <YStack position="absolute" top="$2" right="$2" zIndex={10}>
            <FavoriteButtonWrapper itemId={place.id} itemType="place" size={20} />
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
              {place.name}
            </H6>

            {/* Type Badge */}
            <Theme name={placeTypeColors[place.type] || 'gray'}>
              <Button size="$2" px="$3" py="$1.5" borderRadius="$10" disabled als="flex-start" opacity={0.95}>
                <Text fontSize="$2" tt="capitalize" fontWeight="700">
                  {t(`places.types.${place.type}`)}
                </Text>
              </Button>
            </Theme>

            {/* Location & Price Range */}
            <XStack ai="center" gap="$3" flexWrap="wrap">
              <XStack ai="center" gap="$1.5" f={1}>
                <MapPin size={14} color="white" />
                <Text fontSize="$3" color="white" numberOfLines={1} fontWeight="500" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  {place.location_name}
                </Text>
              </XStack>
              {place.price_range && (
                <Text fontSize="$4" fontWeight="800" color="white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  {place.price_range}
                </Text>
              )}
            </XStack>
          </YStack>
        </YStack>
      )}

      {/* Content Below Image */}
      <YStack gap="$2" pt="$1">
        {/* Description */}
        {place.description && (
          <Paragraph fontSize="$3" color="$color10" numberOfLines={2} opacity={0.8} lineHeight="$2">
            {place.description}
          </Paragraph>
        )}

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <XStack gap="$2" flexWrap="wrap">
            {place.tags.slice(0, 3).map((tag) => (
              <XStack key={tag} bg="$color3" px="$2.5" py="$1.5" borderRadius="$3">
                <Text fontSize="$2" color="$color11" fontWeight="600">
                  {tag}
                </Text>
              </XStack>
            ))}
          </XStack>
        )}
      </YStack>
    </Card>
  )
}

export const PlaceCard = memo(PlaceCardComponent)
