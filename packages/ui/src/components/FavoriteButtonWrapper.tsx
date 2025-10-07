import { useFavoritesQuery, useToggleFavorite } from 'app/utils/react-query/useFavoritesQuery'
import { useUser } from 'app/utils/useUser'
import { FavoriteButton } from './FavoriteButton'
import type { ButtonProps } from 'tamagui'
import { useMemo, memo } from 'react'

export type FavoriteButtonWrapperProps = {
  itemId: string
  itemType: 'event' | 'place'
  size?: number
} & Omit<ButtonProps, 'onPress'>

const FavoriteButtonWrapperComponent = ({ itemId, itemType, size = 24, ...props }: FavoriteButtonWrapperProps) => {
  const { profile } = useUser()
  const userId = profile?.id

  // Use the favorites query cache instead of individual queries
  const { data: favorites = [] } = useFavoritesQuery(userId)
  const toggleFavorite = useToggleFavorite()

  // Check if favorited from the cached favorites list
  const isFavorited = useMemo(() =>
    favorites.some(fav => fav.item_id === itemId && fav.item_type === itemType),
    [favorites, itemId, itemType]
  )

  if (!userId) {
    // Don't show favorite button if user is not logged in
    return null
  }

  const handleToggle = () => {
    toggleFavorite.mutate({
      userId,
      itemId,
      itemType,
      isFavorited,
    })
  }

  return <FavoriteButton isFavorited={isFavorited} onToggle={handleToggle} size={size} {...props} />
}

export const FavoriteButtonWrapper = memo(FavoriteButtonWrapperComponent)
