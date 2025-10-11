import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, H3, Paragraph } from '@my/ui'
import { useServiceDetailQuery } from 'app/utils/react-query/useServicesQuery'
import { useProfileQuery } from 'app/utils/react-query/useProfileQuery'
import { DollarSign, MapPin, User, Mail, Phone, Instagram, Globe, MessageCircle, Share2, Clock, Users, Navigation, Video, Package } from '@tamagui/lucide-icons'
import { Linking, Platform, Share, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { usePostHog } from 'posthog-react-native'
import { useRouter } from 'solito/router'
import { ReportButton } from 'app/components/ReportButton'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'

interface ServiceDetailScreenProps {
  id: string
}

function ServiceDetailScreenContent({ id }: ServiceDetailScreenProps) {
  const { data: service, isLoading, error } = useServiceDetailQuery(id)
  const { data: creator } = useProfileQuery(service?.profile_id)
  const { t } = useTranslation()
  const posthog = usePostHog()
  const router = useRouter()

  useEffect(() => {
    if (service) {
      posthog?.capture('service_detail_viewed', {
        service_id: service.id,
        service_title: service.title,
        service_category: service.category,
        creator_id: service.profile_id,
      })
    }
  }, [posthog, service])

  const handleWhatsAppPress = () => {
    if (creator?.social_whatsapp) {
      posthog?.capture('contact_whatsapp_clicked', {
        item_type: 'service',
        item_id: service?.id,
      })
      Linking.openURL(`https://wa.me/${creator.social_whatsapp}`)
    }
  }

  const handleInstagramPress = () => {
    if (creator?.social_instagram) {
      posthog?.capture('contact_instagram_clicked', {
        item_type: 'service',
        item_id: service?.id,
      })
      Linking.openURL(`https://instagram.com/${creator.social_instagram.replace('@', '')}`)
    }
  }

  const handleWebsitePress = () => {
    if (creator?.social_website) {
      posthog?.capture('contact_website_clicked', {
        item_type: 'service',
        item_id: service?.id,
      })
      Linking.openURL(creator.social_website)
    }
  }

  const handleShare = async () => {
    if (!service) return

    try {
      const url = `mazunteconnect://service/${service.id}`
      const message = `${service.title} - ${service.description?.substring(0, 100)}...`

      await Share.share({
        message: Platform.OS === 'ios' ? message : `${message}\n\n${url}`,
        url: Platform.OS === 'ios' ? url : undefined,
      })

      posthog?.capture('service_shared', {
        service_id: service.id,
        service_category: service.category,
      })
    } catch (error) {
      console.error('Error sharing service:', error)
    }
  }

  if (isLoading) {
    return <FullscreenSpinner />
  }

  if (error) {
    console.error('Service detail error:', error)
    return (
      <YStack f={1} ai="center" jc="center" bg="$background" gap="$2">
        <Text fontSize="$5" color="$red10">
          {t('services.detail.not_found')}
        </Text>
        <Text fontSize="$3" color="$color10">
          {error.message}
        </Text>
      </YStack>
    )
  }

  if (!service) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Text fontSize="$5" color="$color10">
          {t('services.detail.not_found')}
        </Text>
      </YStack>
    )
  }

  const categoryLabel = t(`services.categories.${service.category}`)

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

  return (
    <ScrollView pt="$4" bg="$background">
      <YStack gap="$4" pb="$8">
        {/* Hero Image */}
        {service.images && service.images.length > 0 && (
          <Image
            source={{ uri: service.images[0] }}
            width="100%"
            height={300}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <YStack gap="$4" px="$4">
          {/* Header */}
          <YStack gap="$2">
            <H3>{service.title}</H3>
            <XStack ai="center" gap="$2">
              <Button size="$2" px="$3" py="$1" borderRadius="$10" disabled theme={service.category}>
                <Text fontSize="$2" tt="capitalize" fontWeight="700">
                  {categoryLabel}
                </Text>
              </Button>
              {service.available && (
                <Button size="$2" px="$3" py="$1" borderRadius="$10" disabled theme="blue">
                  <Text fontSize="$2" fontWeight="700">
                    {t('services.detail.available_now')}
                  </Text>
                </Button>
              )}
              {service.eco_conscious && (
                <Button size="$2" px="$3" py="$1" borderRadius="$10" disabled theme="green">
                  <Text fontSize="$2" fontWeight="700">
                    Eco
                  </Text>
                </Button>
              )}
            </XStack>
          </YStack>

          {/* Description */}
          <Paragraph fontSize="$4" color="$color11" lineHeight="$5">
            {service.description}
          </Paragraph>

          {/* Pricing */}
          {priceDisplay && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('services.detail.pricing')}
                </Text>
                <XStack ai="center" gap="$2">
                  <DollarSign size={20} color="$color11" />
                  <Text fontSize="$5" fontWeight="600" color="$color12">
                    {priceDisplay}
                  </Text>
                </XStack>
                {service.price_notes && (
                  <Text fontSize="$3" color="$color10">
                    {service.price_notes}
                  </Text>
                )}
              </YStack>
            </>
          )}

          {/* Delivery Options */}
          {service.delivery_options && service.delivery_options.length > 0 && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('services.detail.delivery')}
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {service.delivery_options.map((option) => {
                    const getIcon = () => {
                      switch(option) {
                        case 'in_person': return <Users size={16} />
                        case 'can_travel': return <Navigation size={16} />
                        case 'online': return <Video size={16} />
                        case 'delivery': return <Package size={16} />
                        default: return null
                      }
                    }
                    return (
                      <Button
                        key={option}
                        size="$3"
                        px="$3"
                        py="$2"
                        borderRadius="$10"
                        disabled
                        theme="blue"
                        icon={getIcon()}
                      >
                        <Text fontSize="$3" fontWeight="600">
                          {t(`services.delivery_options.${option}`)}
                        </Text>
                      </Button>
                    )
                  })}
                </XStack>
              </YStack>
            </>
          )}

          {/* Location */}
          {service.service_location && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('services.detail.location')}
                </Text>
                <XStack ai="center" gap="$2">
                  <MapPin size={20} color="$color11" />
                  <Text fontSize="$4" color="$color12">
                    {service.service_location}
                  </Text>
                </XStack>
              </YStack>
            </>
          )}

          {/* Creator Section */}
          {creator && (
            <>
              <YStack h={1} bg="$borderColor" />
              <YStack gap="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {t('services.detail.offered_by')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push(`/public-profile/${creator.id}`)}
                >
                  <XStack
                    ai="center"
                    gap="$3"
                    p="$3"
                    bg="$background"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <YStack f={1} gap="$1">
                      <XStack ai="center" gap="$2">
                        <User size={16} color="$color11" />
                        <Text fontSize="$5" fontWeight="600" color="$color12">
                          {creator.name || 'Anonymous'}
                        </Text>
                        {creator.creator_verified && (
                          <Text fontSize="$2" color="$blue10">
                            ✓
                          </Text>
                        )}
                      </XStack>
                      {creator.location && (
                        <Text fontSize="$3" color="$color10">
                          {creator.location}
                        </Text>
                      )}
                      {creator.languages && creator.languages.length > 0 && (
                        <XStack gap="$1" flexWrap="wrap">
                          {creator.languages.map((lang) => (
                            <Text key={lang} fontSize="$2" color="$color10">
                              {lang}
                            </Text>
                          ))}
                        </XStack>
                      )}
                    </YStack>
                    <Button size="$3" theme="blue" chromeless pointerEvents="none">
                      {t('profile.public.view_profile')}
                    </Button>
                  </XStack>
                </TouchableOpacity>

                {/* Contact Methods */}
                {service.contact_methods && service.contact_methods.length > 0 && (
                  <YStack gap="$2">
                    <Text fontSize="$5" fontWeight="600" color="$color12">
                      {t('services.detail.contact')}
                    </Text>
                    <XStack gap="$2" flexWrap="wrap">
                      {service.contact_methods.includes('whatsapp') && creator.social_whatsapp && (
                        <Button
                          size="$4"
                          icon={<MessageCircle size={20} />}
                          theme="green"
                          onPress={handleWhatsAppPress}
                        >
                          WhatsApp
                        </Button>
                      )}
                      {service.contact_methods.includes('instagram') && creator.social_instagram && (
                        <Button
                          size="$4"
                          icon={<Instagram size={20} />}
                          theme="pink"
                          onPress={handleInstagramPress}
                        >
                          Instagram
                        </Button>
                      )}
                      {service.contact_methods.includes('website') && creator.social_website && (
                        <Button
                          size="$4"
                          icon={<Globe size={20} />}
                          theme="blue"
                          onPress={handleWebsitePress}
                        >
                          Website
                        </Button>
                      )}
                    </XStack>
                    {service.response_time && (
                      <XStack ai="center" gap="$2" mt="$2">
                        <Clock size={16} color="$color10" />
                        <Text fontSize="$3" color="$color10">
                          {t('services.detail.response_time', { time: service.response_time })}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                )}
              </YStack>
            </>
          )}

          {/* Actions */}
          <YStack h={1} bg="$borderColor" />
          <XStack gap="$3">
            <Button
              size="$4"
              icon={<Share2 size={20} />}
              variant="outlined"
              onPress={handleShare}
              f={1}
            >
              {t('services.detail.share')}
            </Button>
            <ReportButton
              itemId={service.id}
              itemType="service"
              iconOnly={false}
            />
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

export function ServiceDetailScreen({ id }: ServiceDetailScreenProps) {
  return (
    <FavoritesProvider>
      <ServiceDetailScreenContent id={id} />
    </FavoritesProvider>
  )
}
