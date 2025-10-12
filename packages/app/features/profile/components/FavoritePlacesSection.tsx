import { Button, FullscreenSpinner, H4, PlaceCard, Text, Theme, View, XStack, YStack } from '@my/ui'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'

interface FavoritePlacesSectionProps {
  places: any[]
  isLoading: boolean
  onViewAll: () => void
  onPlacePress: (placeId: string) => void
}

export function FavoritePlacesSection({
  places,
  isLoading,
  onViewAll,
  onPlacePress,
}: FavoritePlacesSectionProps) {
  const { t } = useTranslation()
  const posthog = usePostHog()

  const handleViewAll = () => {
    posthog?.capture('profile_section_view_all_tapped', {
      section: 'favorite_places',
    })
    onViewAll()
  }

  return (
    <YStack gap="$3">
      <XStack paddingHorizontal="$4.5" alignItems="center" gap="$2" justifyContent="space-between">
        <H4 theme="alt1" fontWeight="400">
          {t('favorites.places')} ({places.length})
        </H4>
        {places.length > 0 && (
          <Theme name="alt2">
            <Button size="$2" chromeless onPress={handleViewAll}>
              {t('profile.view_all')}
            </Button>
          </Theme>
        )}
      </XStack>

      {isLoading ? (
        <View height={200} ai="center" jc="center">
          <FullscreenSpinner />
        </View>
      ) : places.length === 0 ? (
        <View
          marginHorizontal="$4"
          height={180}
          ai="center"
          jc="center"
          backgroundColor="$color2"
          borderRadius="$5"
        >
          <Text fontSize="$4" color="$color10">
            {t('favorites.no_favorite_places')}
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={places.slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              onPress={() => onPlacePress(item.id)}
              minWidth={300}
              maxWidth={300}
              mr="$3"
              showFavorite
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        />
      )}
    </YStack>
  )
}
