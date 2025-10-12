import { Button, FullscreenSpinner, ScrollView, XStack, YStack } from '@my/ui'
import { router } from 'expo-router'
import { useUser } from 'app/utils/useUser'
import { useLink } from 'solito/link'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { Share, Platform, Alert } from 'react-native'
import { Cog } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { ProfileHeroSection } from 'app/components/ProfileHeroSection'
import { useProfileStatsQuery } from 'app/utils/react-query/useProfileQuery'
import { useServicesQuery } from 'app/utils/react-query/useServicesQuery'
import {
  useProfileUpcomingEventsQuery,
  useProfilePastEventsQuery,
} from 'app/utils/react-query/useProfileEventsQuery'
import { useProfilePlacesQuery } from 'app/utils/react-query/useProfilePlacesQuery'
import { useFavoritesQuery } from 'app/utils/react-query/useFavoritesQuery'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'
import { FeedbackSheet } from 'app/features/settings/feedback-sheet'
import {
  ProfileActionButtons,
  CreatorModeToggle,
  FavoriteEventsSection,
  FavoritePlacesSection,
  FavoriteServicesSection,
  MyServicesSection,
  MyEventsSection,
  MyPlacesSection,
  QuickSettingsSection,
  type ViewMode,
} from './components'

function ProfileScreenContent() {
  const { profile, user } = useUser()
  const { t } = useTranslation()
  const posthog = usePostHog()
  const supabase = useSupabase()
  const { toggle: toggleTheme, current: currentTheme } = useThemeSetting()

  // Call useLink hooks at top level (not conditionally)
  const notificationsLinkProps = useLink({ href: '/settings/notifications' })
  const settingsLinkProps = useLink({ href: '/settings' })

  const [viewMode, setViewMode] = useState<ViewMode>('personal')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'feedback' | 'feature_request' | 'bug_report' | 'support' | 'contact' | 'delete_account'>('support')

  const openFeedbackSheet = (type: typeof feedbackType) => {
    setFeedbackType(type)
    setFeedbackOpen(true)
  }

  // Data queries
  const { data: stats } = useProfileStatsQuery(user?.id)
  const { data: services = [], isLoading: servicesLoading } = useServicesQuery({
    profile_id: user?.id,
  })
  const { data: upcomingEvents = [], isLoading: eventsLoading } = useProfileUpcomingEventsQuery(
    user?.id
  )
  const { data: pastEvents = [] } = useProfilePastEventsQuery(user?.id)
  const { data: places = [], isLoading: placesLoading } = useProfilePlacesQuery({
    profileId: user?.id,
  })
  const { data: favorites = [], isLoading: favoritesLoading } = useFavoritesQuery(user?.id)

  // Calculate counts
  const servicesCount = services.length
  const eventsCount = upcomingEvents.length + pastEvents.length
  const placesCount = places.length

  // Separate favorites by type
  const favoriteEvents = useMemo(
    () =>
      favorites
        .filter((fav) => fav.item_type === 'event' && fav.item)
        .map((fav) => fav.item),
    [favorites]
  )

  const favoritePlaces = useMemo(
    () =>
      favorites
        .filter((fav) => fav.item_type === 'place' && fav.item)
        .map((fav) => fav.item),
    [favorites]
  )

  const favoriteServices = useMemo(
    () =>
      favorites
        .filter((fav) => fav.item_type === 'service' && fav.item)
        .map((fav) => fav.item),
    [favorites]
  )

  // Track screen view
  useEffect(() => {
    posthog?.capture('profile_screen_viewed', {
      view_mode: viewMode,
    })
  }, [posthog, viewMode])

  // Handler functions
  const handleModeSwitch = (mode: ViewMode) => {
    setViewMode(mode)
    posthog?.capture('profile_view_mode_changed', { mode })
  }

  const handleShareProfile = async () => {
    try {
      const url = `${Platform.OS === 'web' ? window.location.origin : 'https://mazunteconnect.com'}/public-profile/${user?.id}`
      const message = profile?.name
        ? `Check out ${profile.name}'s profile on Mazunte Connect!`
        : 'Check out my profile on Mazunte Connect!'

      await Share.share({
        message: Platform.OS === 'ios' ? message : `${message}\n\n${url}`,
        url: Platform.OS === 'ios' ? url : undefined,
        title: t('profile.share_my_profile'),
      })

      posthog?.capture('profile_share_tapped')
    } catch (error) {
      console.error('Error sharing profile:', error)
    }
  }

  const handleViewPublic = () => {
    posthog?.capture('profile_view_public_tapped')
    router.push(`/public-profile/${user?.id}`)
  }

  const handleEditProfile = () => {
    posthog?.capture('profile_edit_tapped')
    router.push('/profile/edit')
  }

  const handleSettings = () => {
    router.push('/settings')
  }

  const handleLogout = async () => {
    Alert.alert(t('profile.logout'), t('profile.logout_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          router.replace('/')
        },
      },
    ])
  }

  if (!profile || !user) {
    return <FullscreenSpinner />
  }

  return (
    <ScreenWrapper>
      <FeedbackSheet open={feedbackOpen} onOpenChange={setFeedbackOpen} initialType={feedbackType} />
      <ScrollView>
        <YStack gap="$0" pb="$8">
          {/* Settings Icon - Top Right */}
          <XStack position="absolute" top="$4" right="$4" zIndex={100}>
            <Button circular size="$4" onPress={handleSettings} chromeless>
              <Cog size={24} />
            </Button>
          </XStack>

          {/* Hero Section */}
          <ProfileHeroSection
            profile={profile}
            stats={stats}
            servicesCount={servicesCount}
            eventsCount={eventsCount}
            placesCount={placesCount}
          />

          {/* Action Buttons */}
          <ProfileActionButtons
            onEditPress={handleEditProfile}
            onViewPublicPress={handleViewPublic}
            onSharePress={handleShareProfile}
          />

          {/* Creator Mode Toggle */}
          <CreatorModeToggle viewMode={viewMode} onModeChange={handleModeSwitch} />

          {/* Content Sections - Conditional based on view mode */}
          <YStack gap="$5" pt="$4">
            {viewMode === 'personal' ? (
              /* Personal View - Favorites (Separated by Type) */
              <YStack gap="$5">
                <FavoriteEventsSection
                  events={favoriteEvents}
                  isLoading={favoritesLoading}
                  onViewAll={() => router.push('/favorites')}
                  onEventPress={(id) => router.push(`/event/${id}`)}
                />
                <FavoritePlacesSection
                  places={favoritePlaces}
                  isLoading={favoritesLoading}
                  onViewAll={() => router.push('/favorites')}
                  onPlacePress={(id) => router.push(`/place/${id}`)}
                />
                <FavoriteServicesSection
                  services={favoriteServices}
                  isLoading={favoritesLoading}
                  onViewAll={() => router.push('/favorites')}
                  onServicePress={(id) => router.push(`/service/${id}`)}
                />
              </YStack>
            ) : (
              /* Creator View - Services, Events, Places */
              <YStack gap="$5">
                <MyServicesSection
                  services={services}
                  isLoading={servicesLoading}
                  onViewAll={() => router.push('/services')}
                  onServicePress={(id) => router.push(`/service/${id}`)}
                  onCreatePress={() => router.push('/services')}
                />
                <MyEventsSection
                  events={upcomingEvents}
                  isLoading={eventsLoading}
                  onViewAll={() => router.push('/events')}
                  onEventPress={(id) => router.push(`/event/${id}`)}
                  onCreatePress={() => router.push('/events')}
                />
                <MyPlacesSection
                  places={places}
                  isLoading={placesLoading}
                  onViewAll={() => router.push('/places')}
                  onPlacePress={(id) => router.push(`/place/${id}`)}
                  onCreatePress={() => router.push('/places')}
                />
              </YStack>
            )}

            {/* Quick Settings - Always Visible */}
            <QuickSettingsSection
              currentTheme={currentTheme}
              onThemeToggle={toggleTheme}
              onLogout={handleLogout}
              notificationsLinkProps={notificationsLinkProps}
              settingsLinkProps={settingsLinkProps}
              openFeedbackSheet={openFeedbackSheet}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </ScreenWrapper>
  )
}

export function ProfileScreen() {
  return (
    <FavoritesProvider>
      <ProfileScreenContent />
    </FavoritesProvider>
  )
}
