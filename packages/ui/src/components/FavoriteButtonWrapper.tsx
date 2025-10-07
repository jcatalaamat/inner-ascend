import { useFavoritesContext } from 'app/contexts/FavoritesContext'
import { FavoriteButton } from './FavoriteButton'
import type { ButtonProps } from 'tamagui'
import { memo, useCallback, useMemo } from 'react'

export type FavoriteButtonWrapperProps = {
  itemId: string
  itemType: 'event' | 'place'
  size?: number
} & Omit<ButtonProps, 'onPress'>

const FavoriteButtonWrapperComponent = ({ itemId, itemType, size = 24, ...props }: FavoriteButtonWrapperProps) => {
  // Read from context instead of calling query - eliminates 50-100+ redundant hook calls!
  const { isFavorited, toggleFavorite, userId } = useFavoritesContext()

  // Memoize favorited value to prevent recalculations on every render
  const favorited = useMemo(
    () => isFavorited(itemId, itemType),
    [isFavorited, itemId, itemType]
  )

  // Memoize handleToggle - read isFavorited fresh instead of capturing favorited
  const handleToggle = useCallback(() => {
    toggleFavorite.mutate({
      userId,
      itemId,
      itemType,
      isFavorited: isFavorited(itemId, itemType),  // Read fresh value, don't capture
    })
  }, [toggleFavorite, userId, itemId, itemType, isFavorited])

  if (!userId) {
    // Don't show favorite button if user is not logged in
    return null
  }

  return <FavoriteButton isFavorited={favorited} onToggle={handleToggle} size={size} {...props} />
}

export const FavoriteButtonWrapper = memo(FavoriteButtonWrapperComponent)
