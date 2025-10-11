import type { Database } from '@my/supabase/types'
import { Briefcase, DollarSign, Leaf, MapPin, Users, Navigation, Video, Package } from '@tamagui/lucide-icons'
import { useState, memo } from 'react'
import { Button, Card, type CardProps, H6, Image, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'
import { FavoriteButtonWrapper } from './FavoriteButtonWrapper'
import { useTranslation } from 'react-i18next'

type Service = Database['public']['Tables']['services']['Row']

export type ServiceCardProps = {
  service: Service
  onPress?: () => void
  showFavorite?: boolean
  creatorName?: string
  creatorAvatar?: string
} & Omit<CardProps, 'onPress'>

// Category colors
const categoryColors: Record<string, string> = {
  wellness: 'purple',
  food: 'orange',
  education: 'blue',
  art: 'pink',
  transportation: 'green',
  accommodation: 'yellow',
  other: 'gray',
}

const ServiceCardComponent = ({
  service,
  onPress,
  showFavorite = false,
  creatorName,
  creatorAvatar,
  ...props
}: ServiceCardProps) => {
  const [hover, setHover] = useState(false)
  const { t } = useTranslation()

  // Format price display
  const getPriceDisplay = () => {
    if (service.price_type === 'free') {
      return t('services.price_types.free')
    }
    if (service.price_type === 'donation') {
      return t('services.price_types.donation')
    }
    if (service.price_type === 'negotiable') {
      return t('services.price_types.negotiable')
    }
    if (service.price_amount) {
      const amount = Number(service.price_amount)
      const formatted = `$${amount.toFixed(0)} ${service.price_currency || 'MXN'}`
      if (service.price_type === 'hourly') {
        return `${formatted}/${t('common.hour')}`
      }
      if (service.price_type === 'daily') {
        return `${formatted}/${t('common.day')}`
      }
      return formatted
    }
    return null
  }

  const priceDisplay = getPriceDisplay()

  const getDeliveryIcon = (option: string) => {
    const iconProps = { size: 12, color: 'white' }
    switch(option) {
      case 'in_person': return <Users {...iconProps} />
      case 'can_travel': return <Navigation {...iconProps} />
      case 'online': return <Video {...iconProps} />
      case 'delivery': return <Package {...iconProps} />
      default: return null
    }
  }

  return (
    <Card
      cursor="pointer"
      gap="$2"
      p="$3"
      borderRadius="$4"
      chromeless={!hover}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      onPress={() => onPress?.(service)}
      elevation="$2"
      shadowColor="$shadowColor"
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 2 }}
      {...props}
    >
      {/* Image with Overlay Content */}
      {service.images && service.images.length > 0 ? (
        <YStack position="relative" borderRadius="$3" overflow="hidden">
          <Image
            source={{ uri: service.images[0] }}
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
          {service.eco_conscious && (
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

          {/* Available Badge - Top Left (if no eco badge) */}
          {!service.eco_conscious && service.available && (
            <XStack
              position="absolute"
              top="$2"
              left="$2"
              ai="center"
              gap="$1"
              bg="$blue9"
              px="$2.5"
              py="$1.5"
              borderRadius="$3"
              zIndex={10}
            >
              <Briefcase size={12} color="white" />
              <Text fontSize="$2" color="white" fontWeight="700">
                {t('services.detail.available_now')}
              </Text>
            </XStack>
          )}

          {/* Favorite Button - Top Right */}
          {showFavorite && (
            <YStack position="absolute" top="$2" right="$2" zIndex={10}>
              <FavoriteButtonWrapper itemId={service.id} itemType="service" size={20} />
            </YStack>
          )}

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
              {service.title}
            </H6>

            {/* Category & Delivery Badges */}
            <XStack gap="$2" flexWrap="wrap" ai="center">
              <Theme name={categoryColors[service.category] || 'gray'}>
                <Button size="$2" px="$3" py="$1.5" borderRadius="$10" disabled opacity={0.95}>
                  <Text fontSize="$2" tt="capitalize" fontWeight="700">
                    {t(`services.categories.${service.category}`)}
                  </Text>
                </Button>
              </Theme>
              {service.delivery_options && service.delivery_options.slice(0, 2).map((option) => (
                <XStack
                  key={option}
                  ai="center"
                  gap="$1"
                  bg="rgba(255,255,255,0.25)"
                  px="$2"
                  py="$1"
                  borderRadius="$10"
                  backdropFilter="blur(8px)"
                >
                  {getDeliveryIcon(option)}
                </XStack>
              ))}
            </XStack>

            {/* Location & Price - Single Line */}
            <XStack ai="center" gap="$3" flexWrap="wrap">
              {service.service_location && (
                <XStack ai="center" gap="$1.5" f={1}>
                  <MapPin size={14} color="white" />
                  <Text fontSize="$3" color="white" numberOfLines={1} fontWeight="500" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                    {service.service_location}
                  </Text>
                </XStack>
              )}
              {priceDisplay && (
                <XStack ai="center" gap="$1">
                  <DollarSign size={14} color="white" />
                  <Text fontSize="$4" fontWeight="800" color="white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                    {priceDisplay}
                  </Text>
                </XStack>
              )}
            </XStack>
          </YStack>
        </YStack>
      ) : (
        // No image fallback
        <YStack gap="$2" py="$2">
          <XStack ai="center" jc="space-between">
            <H6 size="$6" numberOfLines={2} fontWeight="800" f={1}>
              {service.title}
            </H6>
            {showFavorite && (
              <FavoriteButtonWrapper itemId={service.id} itemType="service" size={20} />
            )}
          </XStack>

          <Theme name={categoryColors[service.category] || 'gray'}>
            <Button size="$2" px="$3" py="$1.5" borderRadius="$10" disabled als="flex-start">
              <Text fontSize="$2" tt="capitalize" fontWeight="700">
                {t(`services.categories.${service.category}`)}
              </Text>
            </Button>
          </Theme>
        </YStack>
      )}

      {/* Description Below Image */}
      {service.description && (
        <YStack pt="$1">
          <Paragraph fontSize="$3" color="$color10" numberOfLines={2} opacity={0.8} lineHeight="$2">
            {service.description}
          </Paragraph>
        </YStack>
      )}

      {/* Creator Info (if provided) */}
      {creatorName && (
        <XStack ai="center" gap="$2" pt="$1" opacity={0.7}>
          <Text fontSize="$2" color="$color10">
            {t('services.detail.offered_by')} <Text fontWeight="600">{creatorName}</Text>
          </Text>
        </XStack>
      )}
    </Card>
  )
}

export const ServiceCard = memo(ServiceCardComponent)
