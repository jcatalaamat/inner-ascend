import { YStack, XStack, H2, Text, Button } from '@my/ui'
import { User, MapPin, Globe, Instagram, MessageCircle, Calendar, Eye } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import type { Database } from '@my/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileStats = Database['public']['Tables']['profile_stats']['Row']

interface ProfileHeroSectionProps {
  profile: Profile
  stats?: ProfileStats | null
  servicesCount: number
  eventsCount: number
  placesCount: number
}

/**
 * Hero section for public profile with avatar, badges, and stats
 */
export function ProfileHeroSection({
  profile,
  stats,
  servicesCount,
  eventsCount,
  placesCount,
}: ProfileHeroSectionProps) {
  const { t } = useTranslation()

  const handleWhatsAppPress = () => {
    if (profile.social_whatsapp) {
      Linking.openURL(`https://wa.me/${profile.social_whatsapp}`)
    }
  }

  const handleInstagramPress = () => {
    if (profile.social_instagram) {
      Linking.openURL(`https://instagram.com/${profile.social_instagram.replace('@', '')}`)
    }
  }

  const handleWebsitePress = () => {
    if (profile.social_website) {
      Linking.openURL(profile.social_website)
    }
  }

  const formatMemberSince = () => {
    if (stats?.member_since || profile.created_at) {
      const date = new Date(stats?.member_since || profile.created_at)
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    }
    return null
  }

  const memberSinceText = formatMemberSince()

  return (
    <YStack bg="$color3" p="$4" gap="$4">
      {/* Avatar and Name Section */}
      <XStack ai="center" gap="$3">
        {/* Avatar */}
        <YStack position="relative">
          <YStack
            bg="$color6"
            w={120}
            h={120}
            borderRadius="$12"
            ai="center"
            jc="center"
            borderWidth={3}
            borderColor="$background"
          >
            {profile.avatar_url ? (
              <YStack
                w="100%"
                h="100%"
                borderRadius="$12"
                overflow="hidden"
                ai="center"
                jc="center"
              >
                {/* TODO: Add Image component when avatar_url is set */}
                <User size={48} color="$color11" />
              </YStack>
            ) : (
              <User size={48} color="$color11" />
            )}
          </YStack>
          {/* Verified Badge Overlay */}
          {profile.creator_verified && (
            <YStack
              position="absolute"
              bottom={-4}
              right={-4}
              bg="$blue10"
              w={32}
              h={32}
              borderRadius="$10"
              ai="center"
              jc="center"
              borderWidth={3}
              borderColor="$background"
            >
              <Text fontSize="$4">✓</Text>
            </YStack>
          )}
        </YStack>

        {/* Name and Info */}
        <YStack f={1} gap="$2">
          <XStack ai="center" gap="$2" flexWrap="wrap">
            <H2>{profile.name || 'Anonymous'}</H2>
            {profile.is_admin && (
              <YStack
                bg="$purple10"
                px="$2.5"
                py="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" fontWeight="700" color="white">
                  👑 {t('profile.public.admin_badge')}
                </Text>
              </YStack>
            )}
          </XStack>

          {profile.location && (
            <XStack ai="center" gap="$2">
              <MapPin size={16} color="$color10" />
              <Text fontSize="$4" color="$color11">
                {profile.location}
              </Text>
            </XStack>
          )}

          {memberSinceText && (
            <XStack ai="center" gap="$2">
              <Calendar size={16} color="$color10" />
              <Text fontSize="$3" color="$color10">
                {t('profile.public.member_since', { date: memberSinceText })}
              </Text>
            </XStack>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <XStack gap="$1.5" flexWrap="wrap">
              {profile.languages.map((lang) => (
                <YStack
                  key={lang}
                  bg="$color5"
                  px="$2"
                  py="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="$color11" fontWeight="600">
                    {t(`languages.${lang}`)}
                  </Text>
                </YStack>
              ))}
            </XStack>
          )}
        </YStack>
      </XStack>

      {/* Stats Bar */}
      <XStack gap="$4" jc="space-around" py="$3" bg="$color4" borderRadius="$3">
        {servicesCount > 0 && (
          <YStack ai="center" gap="$1">
            <Text fontSize="$7" fontWeight="700" color="$color12">
              {servicesCount}
            </Text>
            <Text fontSize="$2" color="$color10" tt="uppercase">
              {t('profile.public.services')}
            </Text>
          </YStack>
        )}
        {eventsCount > 0 && (
          <YStack ai="center" gap="$1">
            <Text fontSize="$7" fontWeight="700" color="$color12">
              {eventsCount}
            </Text>
            <Text fontSize="$2" color="$color10" tt="uppercase">
              {t('profile.public.events')}
            </Text>
          </YStack>
        )}
        {placesCount > 0 && (
          <YStack ai="center" gap="$1">
            <Text fontSize="$7" fontWeight="700" color="$color12">
              {placesCount}
            </Text>
            <Text fontSize="$2" color="$color10" tt="uppercase">
              {t('profile.public.places')}
            </Text>
          </YStack>
        )}
        {stats?.total_views && stats.total_views > 50 && (
          <YStack ai="center" gap="$1">
            <Text fontSize="$7" fontWeight="700" color="$color12">
              {stats.total_views}
            </Text>
            <Text fontSize="$2" color="$color10" tt="uppercase">
              <Eye size={12} /> {t('profile.public.total_views', { count: stats.total_views })}
            </Text>
          </YStack>
        )}
      </XStack>

      {/* About */}
      {profile.about && (
        <Text fontSize="$4" color="$color11" lineHeight="$5">
          {profile.about}
        </Text>
      )}

      {/* Response Time */}
      {stats?.avg_response_time && (
        <XStack ai="center" gap="$2" bg="$green3" px="$3" py="$2" borderRadius="$3">
          <Text fontSize="$3" color="$green11">
            ⚡ {t('profile.public.usually_responds', { time: stats.avg_response_time })}
          </Text>
        </XStack>
      )}

      {/* Contact Buttons */}
      {profile.show_contact_on_profile && (
        <XStack gap="$2" flexWrap="wrap">
          {profile.social_whatsapp && (
            <Button
              size="$4"
              icon={<MessageCircle size={20} />}
              theme="green"
              onPress={handleWhatsAppPress}
              f={1}
            >
              WhatsApp
            </Button>
          )}
          {profile.social_instagram && (
            <Button
              size="$4"
              icon={<Instagram size={20} />}
              theme="pink"
              onPress={handleInstagramPress}
              f={1}
            >
              Instagram
            </Button>
          )}
          {profile.social_website && (
            <Button
              size="$4"
              icon={<Globe size={20} />}
              theme="blue"
              onPress={handleWebsitePress}
              f={1}
            >
              {t('profile.public.website')}
            </Button>
          )}
        </XStack>
      )}
    </YStack>
  )
}
