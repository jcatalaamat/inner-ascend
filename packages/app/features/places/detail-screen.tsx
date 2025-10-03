import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, Card, H4, Paragraph, EcoBadge, FavoriteButtonWrapper, Theme } from '@my/ui'
import { usePlaceDetailQuery } from 'app/utils/react-query/usePlacesQuery'
import { MapPin, DollarSign, Phone, Mail, Globe, Instagram } from '@tamagui/lucide-icons'
import { PLACE_TYPE_COLORS } from 'app/utils/constants'
import { Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ScreenWrapper } from 'app/components/ScreenWrapper'

interface PlaceDetailScreenProps {
  id: string
}

export function PlaceDetailScreen({ id }: PlaceDetailScreenProps) {
  const { data: place, isLoading } = usePlaceDetailQuery(id)
  const { t } = useTranslation()

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

  return (
    <ScreenWrapper>
      <ScrollView bg="$background">
        <YStack pb="$4">
          {/* Image */}
          {place.images && place.images.length > 0 && (
            <Image
              source={{ uri: place.images[0] }}
              height={280}
              width="100%"
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
              <XStack gap="$3" ai="center">
                <MapPin size={20} color="$color10" />
                <Text fontSize="$4" f={1}>
                  {place.location_name}
                </Text>
              </XStack>
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
                  {tag}
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

          {/* TODO: Add image gallery if multiple images */}
          {/* TODO: Add map preview with marker */}
          {/* TODO: Add share button */}
          {/* TODO: Add "Get Directions" button if lat/lng available */}
          </YStack>
        </YStack>
      </ScrollView>
    </ScreenWrapper>
  )
}
