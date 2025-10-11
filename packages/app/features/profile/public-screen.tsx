import { FullscreenSpinner, Text, YStack, XStack, H3, Button, ScrollView } from '@my/ui'
import { useProfileQuery, useProfileStatsQuery } from 'app/utils/react-query/useProfileQuery'
import { useServicesQuery } from 'app/utils/react-query/useServicesQuery'
import { User, MapPin, Globe, Instagram, MessageCircle, Mail } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { ServiceCard } from '@my/ui'
import { useRouter } from 'solito/router'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'

interface PublicProfileScreenProps {
  profileId: string
}

function PublicProfileScreenContent({ profileId }: PublicProfileScreenProps) {
  const { t } = useTranslation()
  const posthog = usePostHog()
  const router = useRouter()

  const { data: profile, isLoading: profileLoading } = useProfileQuery(profileId)
  const { data: stats } = useProfileStatsQuery(profileId)
  const { data: services = [], isLoading: servicesLoading } = useServicesQuery({
    profile_id: profileId
  })

  useEffect(() => {
    if (profile) {
      posthog?.capture('public_profile_viewed', {
        profile_id: profileId,
        profile_name: profile.name,
      })
    }
  }, [posthog, profile, profileId])

  const handleWhatsAppPress = () => {
    if (profile?.social_whatsapp) {
      Linking.openURL(`https://wa.me/${profile.social_whatsapp}`)
    }
  }

  const handleInstagramPress = () => {
    if (profile?.social_instagram) {
      Linking.openURL(`https://instagram.com/${profile.social_instagram.replace('@', '')}`)
    }
  }

  const handleWebsitePress = () => {
    if (profile?.social_website) {
      Linking.openURL(profile.social_website)
    }
  }

  if (profileLoading) {
    return <FullscreenSpinner />
  }

  if (!profile) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background" p="$4">
        <Text fontSize="$5" color="$color10">
          {t('profile.public.not_found')}
        </Text>
      </YStack>
    )
  }

  return (
    <ScrollView bg="$background">
      <YStack gap="$4" pb="$8">
        {/* Profile Header */}
        <YStack bg="$color3" p="$4" gap="$3">
          <XStack ai="center" gap="$3">
            <YStack
              bg="$color6"
              w={80}
              h={80}
              borderRadius="$10"
              ai="center"
              jc="center"
            >
              <User size={40} color="$color11" />
            </YStack>
            <YStack f={1} gap="$2">
              <H3>{profile.name || 'Anonymous'}</H3>
              {profile.location && (
                <XStack ai="center" gap="$2">
                  <MapPin size={16} color="$color10" />
                  <Text fontSize="$3" color="$color10">
                    {profile.location}
                  </Text>
                </XStack>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <XStack gap="$2" flexWrap="wrap">
                  {profile.languages.map((lang) => (
                    <Text key={lang} fontSize="$2" color="$color10" bg="$color5" px="$2" py="$1" borderRadius="$2">
                      {t(`languages.${lang}`)}
                    </Text>
                  ))}
                </XStack>
              )}
            </YStack>
          </XStack>

          {/* About */}
          {profile.about && (
            <Text fontSize="$4" color="$color11" lineHeight="$5">
              {profile.about}
            </Text>
          )}

          {/* Contact Buttons */}
          <XStack gap="$2" flexWrap="wrap">
            {profile.social_whatsapp && (
              <Button
                size="$3"
                icon={<MessageCircle size={16} />}
                theme="green"
                onPress={handleWhatsAppPress}
              >
                WhatsApp
              </Button>
            )}
            {profile.social_instagram && (
              <Button
                size="$3"
                icon={<Instagram size={16} />}
                theme="pink"
                onPress={handleInstagramPress}
              >
                Instagram
              </Button>
            )}
            {profile.social_website && (
              <Button
                size="$3"
                icon={<Globe size={16} />}
                theme="blue"
                onPress={handleWebsitePress}
              >
                {t('profile.public.website')}
              </Button>
            )}
          </XStack>
        </YStack>

        {/* Services Section */}
        <YStack px="$4" gap="$3">
          <H3>{t('profile.public.services_offered')}</H3>
          {servicesLoading ? (
            <FullscreenSpinner />
          ) : services.length === 0 ? (
            <Text fontSize="$4" color="$color10" ta="center" py="$8">
              {t('profile.public.no_services')}
            </Text>
          ) : (
            <YStack gap="$3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => router.push(`/service/${service.id}`)}
                  showFavorite
                />
              ))}
            </YStack>
          )}
        </YStack>
      </YStack>
    </ScrollView>
  )
}

export function PublicProfileScreen({ profileId }: PublicProfileScreenProps) {
  return (
    <FavoritesProvider>
      <PublicProfileScreenContent profileId={profileId} />
    </FavoritesProvider>
  )
}
