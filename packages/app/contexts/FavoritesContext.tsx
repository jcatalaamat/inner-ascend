import React, { createContext, useContext, useMemo, useCallback, ReactNode } from 'react'
import { useFavoritesQuery, useToggleFavorite } from '../utils/react-query/useFavoritesQuery'
import { useUser } from '../utils/useUser'

type FavoritesContextValue = {
  favoritesSet: Set<string>
  isFavorited: (itemId: string, itemType: 'event' | 'place') => boolean
  toggleFavorite: ReturnType<typeof useToggleFavorite>
  userId: string | undefined
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider')
  }
  return context
}

type FavoritesProviderProps = {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { profile } = useUser()
  const userId = profile?.id

  // Single query for all favorites
  const { data: favorites = [] } = useFavoritesQuery(userId)
  const toggleFavorite = useToggleFavorite()

  // Convert to Set for O(1) lookups
  const favoritesSet = useMemo(() => {
    const set = new Set<string>()
    favorites.forEach(fav => {
      // Create composite key: itemType-itemId
      set.add(`${fav.item_type}-${fav.item_id}`)
    })
    return set
  }, [favorites])

  const isFavorited = useCallback(
    (itemId: string, itemType: 'event' | 'place') => {
      return favoritesSet.has(`${itemType}-${itemId}`)
    },
    [favoritesSet]
  )

  const value = useMemo(() => ({
    favoritesSet,
    isFavorited,
    toggleFavorite,
    userId,
  }), [favoritesSet, isFavorited, toggleFavorite, userId])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
