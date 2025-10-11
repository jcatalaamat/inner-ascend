import { FullscreenSpinner, Text, YStack, XStack, Button, ScrollView, H4, EventCard, PlaceCard } from '@my/ui'
import { useProfileQuery, useProfileStatsQuery } from 'app/utils/react-query/useProfileQuery'
import { useServicesQuery } from 'app/utils/react-query/useServicesQuery'
import { useProfileUpcomingEventsQuery, useProfilePastEventsQuery } from 'app/utils/react-query/useProfileEventsQuery'
import { useProfilePlacesQuery } from 'app/utils/react-query/useProfilePlacesQuery'
import { Briefcase, Calendar, MapPin, Share2 } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { useEffect, useState } from 'react'
import { Share, Platform, Alert } from 'react-native'
import { ServiceCard } from '@my/ui'
import { useRouter } from 'solito/router'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'
import { ProfileHeroSection } from 'app/components/ProfileHeroSection'
import { EmptyStateCard } from 'app/components/EmptyStateCard'
import * as Clipboard from 'expo-clipboard'

interface PublicProfileScreenProps {
  profileId: string
}

type TabType = 'services' | 'events' | 'places'

function PublicProfileScreenContent({ profileId }: PublicProfileScreenProps) {
  const { t } = useTranslation()
  const posthog = usePostHog()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabType>('services')
  const [showPastEvents, setShowPastEvents] = useState(false)

  const { data: profile, isLoading: profileLoading } = useProfileQuery(profileId)
  const { data: stats } = useProfileStatsQuery(profileId)
  const { data: services = [], isLoading: servicesLoading } = useServicesQuery({
    profile_id: profileId,
  })
  const { data: upcomingEvents = [], isLoading: eventsLoading } = useProfileUpcomingEventsQuery(
    profileId
  )
  const { data: pastEvents = [] } = useProfilePastEventsQuery(profileId)
  const { data: places = [], isLoading: placesLoading } = useProfilePlacesQuery({
    profileId,
  })

  useEffect(() => {
    if (profile) {
      posthog?.capture('public_profile_viewed', {
        profile_id: profileId,
        profile_name: profile.name,
      })
    }
  }, [posthog, profile, profileId])

  const handleShareProfile = async () => {
    try {
      const url = `${Platform.OS === 'web' ? window.location.origin : 'mazunteconnect://'}public-profile/${profileId}`
      const message = profile?.name
        ? `Check out ${profile.name}'s profile on Mazunte Connect!`
        : 'Check out this profile on Mazunte Connect!'

      await Share.share({
        message: Platform.OS === 'ios' ? message : `${message}\n\n${url}`,
        url: Platform.OS === 'ios' ? url : undefined,
        title: t('profile.public.share_profile'),
      })

      posthog?.capture('profile_shared', {
        profile_id: profileId,
      })
    } catch (error) {
      console.error('Error sharing profile:', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      const url = `${Platform.OS === 'web' ? window.location.origin : 'https://mazunteconnect.com'}/public-profile/${profileId}`
      await Clipboard.setStringAsync(url)

      if (Platform.OS === 'web') {
        alert(t('profile.public.link_copied'))
      } else {
        Alert.alert(t('profile.public.link_copied'))
      }

      posthog?.capture('profile_link_copied', {
        profile_id: profileId,
      })
    } catch (error) {
      console.error('Error copying link:', error)
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

  const servicesCount = services.length
  const eventsCount = upcomingEvents.length + pastEvents.length
  const placesCount = places.length

  return (
    <ScrollView bg="$background">
      <YStack gap="$0" pb="$8">
        {/* Hero Section */}
        <ProfileHeroSection
          profile={profile}
          stats={stats}
          servicesCount={servicesCount}
          eventsCount={eventsCount}
          placesCount={placesCount}
        />

        {/* Share Button */}
        <XStack px="$4" pt="$4" gap="$2">
          <Button
            size="$3"
            icon={<Share2 size={16} />}
            variant="outlined"
            onPress={handleShareProfile}
            f={1}
          >
            {t('profile.public.share_profile')}
          </Button>
          <Button
            size="$3"
            variant="outlined"
            onPress={handleCopyLink}
          >
            {t('profile.public.copy_link')}
          </Button>
        </XStack>

        {/* Tabs */}
        <XStack px="$4" py="$4" gap="$2" borderBottomWidth={1} borderBottomColor="$borderColor">
          <Button
            size="$3"
            theme={activeTab === 'services' ? 'blue' : undefined}
            chromeless={activeTab !== 'services'}
            onPress={() => setActiveTab('services')}
            icon={<Briefcase size={16} />}
            f={1}
          >
            <XStack ai="center" gap="$1.5">
              <Text fontWeight={activeTab === 'services' ? '700' : '400'}>
                {t('profile.public.services')}
              </Text>
              {servicesCount > 0 && (
                <YStack
                  bg={activeTab === 'services' ? '$blue4' : '$color5'}
                  px="$2"
                  py="$0.5"
                  borderRadius="$10"
                  minWidth={20}
                  ai="center"
                >
                  <Text fontSize="$1" fontWeight="700">
                    {servicesCount}
                  </Text>
                </YStack>
              )}
            </XStack>
          </Button>

          <Button
            size="$3"
            theme={activeTab === 'events' ? 'blue' : undefined}
            chromeless={activeTab !== 'events'}
            onPress={() => setActiveTab('events')}
            icon={<Calendar size={16} />}
            f={1}
          >
            <XStack ai="center" gap="$1.5">
              <Text fontWeight={activeTab === 'events' ? '700' : '400'}>
                {t('profile.public.events')}
              </Text>
              {eventsCount > 0 && (
                <YStack
                  bg={activeTab === 'events' ? '$blue4' : '$color5'}
                  px="$2"
                  py="$0.5"
                  borderRadius="$10"
                  minWidth={20}
                  ai="center"
                >
                  <Text fontSize="$1" fontWeight="700">
                    {eventsCount}
                  </Text>
                </YStack>
              )}
            </XStack>
          </Button>

          <Button
            size="$3"
            theme={activeTab === 'places' ? 'blue' : undefined}
            chromeless={activeTab !== 'places'}
            onPress={() => setActiveTab('places')}
            icon={<MapPin size={16} />}
            f={1}
          >
            <XStack ai="center" gap="$1.5">
              <Text fontWeight={activeTab === 'places' ? '700' : '400'}>
                {t('profile.public.places')}
              </Text>
              {placesCount > 0 && (
                <YStack
                  bg={activeTab === 'places' ? '$blue4' : '$color5'}
                  px="$2"
                  py="$0.5"
                  borderRadius="$10"
                  minWidth={20}
                  ai="center"
                >
                  <Text fontSize="$1" fontWeight="700">
                    {placesCount}
                  </Text>
                </YStack>
              )}
            </XStack>
          </Button>
        </XStack>

        {/* Tab Content */}
        <YStack px="$4" pt="$4" gap="$4">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <YStack gap="$3">
              <H4>{t('profile.public.services_offered')}</H4>
              {servicesLoading ? (
                <FullscreenSpinner />
              ) : services.length === 0 ? (
                <EmptyStateCard
                  icon={Briefcase}
                  title={t('profile.public.no_services')}
                />
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
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <YStack gap="$4">
              {/* Upcoming Events */}
              <YStack gap="$3">
                <H4>{t('profile.public.upcoming_events')}</H4>
                {eventsLoading ? (
                  <FullscreenSpinner />
                ) : upcomingEvents.length === 0 ? (
                  <EmptyStateCard
                    icon={Calendar}
                    title={t('profile.public.no_events')}
                  />
                ) : (
                  <YStack gap="$3">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onPress={() => router.push(`/event/${event.id}`)}
                        showFavorite
                      />
                    ))}
                  </YStack>
                )}
              </YStack>

              {/* Past Events (Collapsible) */}
              {pastEvents.length > 0 && (
                <YStack gap="$3">
                  <XStack ai="center" jc="space-between">
                    <H4>{t('profile.public.past_events')}</H4>
                    <Button
                      size="$2"
                      chromeless
                      onPress={() => setShowPastEvents(!showPastEvents)}
                    >
                      {showPastEvents ? '−' : '+'} {pastEvents.length}
                    </Button>
                  </XStack>
                  {showPastEvents && (
                    <YStack gap="$3" opacity={0.7}>
                      {pastEvents.slice(0, 5).map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onPress={() => router.push(`/event/${event.id}`)}
                          showFavorite
                        />
                      ))}
                      {pastEvents.length > 5 && (
                        <Text fontSize="$3" color="$color10" ta="center">
                          + {pastEvents.length - 5} more
                        </Text>
                      )}
                    </YStack>
                  )}
                </YStack>
              )}
            </YStack>
          )}

          {/* Places Tab */}
          {activeTab === 'places' && (
            <YStack gap="$3">
              <H4>{t('profile.public.places_created')}</H4>
              {placesLoading ? (
                <FullscreenSpinner />
              ) : places.length === 0 ? (
                <EmptyStateCard
                  icon={MapPin}
                  title={t('profile.public.no_places')}
                />
              ) : (
                <YStack gap="$3">
                  {places.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onPress={() => router.push(`/place/${place.id}`)}
                      showFavorite
                    />
                  ))}
                </YStack>
              )}
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
