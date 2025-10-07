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
      onPress={onPress}
      {...props}
    >
      {/* Image */}
      {mainImage && (
        <YStack position="relative">
          <Image
            source={{ uri: mainImage }}
            width="100%"
            height={140}
            borderRadius="$3"
            resizeMode="cover"
          />

          {/* Favorite Button on Image */}
          <YStack position="absolute" top="$2" right="$2" zIndex={10}>
            <FavoriteButtonWrapper itemId={place.id} itemType="place" size={20} />
          </YStack>
        </YStack>
      )}

      <YStack gap="$2">
        {/* Title, Badges, and Favorite Button */}
        <XStack jc="space-between" ai="flex-start" gap="$2">
          <H6 size="$4" f={1} numberOfLines={2}>
            {place.name}
          </H6>
          <XStack ai="center" gap="$1">
            {place.verified && (
              <XStack ai="center" gap="$1" bg="$blue3" px="$2" py="$1" borderRadius="$2">
                <Star size={12} color="$blue10" />
              </XStack>
            )}
            {place.eco_conscious && (
              <XStack ai="center" gap="$1" bg="$green3" px="$2" py="$1" borderRadius="$2">
                <Leaf size={12} color="$green10" />
              </XStack>
            )}
            {!mainImage && <FavoriteButtonWrapper itemId={place.id} itemType="place" size={20} />}
          </XStack>
        </XStack>

        {/* Type Badge */}
        <Theme name={placeTypeColors[place.type] || 'gray'}>
          <Button size="$2" px="$3" py="$1" borderRadius="$10" disabled als="flex-start">
            <Text fontSize="$2" tt="capitalize" fontWeight="600">
              {t(`places.types.${place.type}`)}
            </Text>
          </Button>
        </Theme>

        {/* Location */}
        <XStack ai="center" gap="$2">
          <MapPin size={14} color="$color10" />
          <Text fontSize="$3" color="$color11" numberOfLines={1}>
            {place.location_name}
          </Text>
        </XStack>

        {/* Price Range */}
        {place.price_range && (
          <XStack ai="center" gap="$2">
            <Text fontSize="$4" fontWeight="700" color="$green10">
              {place.price_range}
            </Text>
            <Text fontSize="$2" color="$color10">
              {t('place_card.price_range')}
            </Text>
          </XStack>
        )}

        {/* Contact Info */}
        {(place.contact_phone || place.contact_whatsapp) && (
          <XStack ai="center" gap="$2">
            <Phone size={14} color="$color10" />
            <Text fontSize="$3" color="$color11" numberOfLines={1}>
              {t('place_card.contact_available')}
            </Text>
          </XStack>
        )}

        {/* Description Preview */}
        {place.description && (
          <Paragraph fontSize="$2" color="$color10" numberOfLines={2}>
            {place.description}
          </Paragraph>
        )}

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <XStack gap="$2" flexWrap="wrap">
            {place.tags.slice(0, 3).map((tag) => (
              <XStack key={tag} bg="$blue2" px="$2.5" py="$1.5" borderRadius="$3">
                <Text fontSize="$2" color="$blue11" fontWeight="500">
                  {t(`tags.${tag}`)}
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
