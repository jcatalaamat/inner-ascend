import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePostHog } from 'posthog-react-native'

import { useSupabase } from '../supabase/useSupabase'

type Favorite = Database['public']['Tables']['favorites']['Row']
type Event = Database['public']['Tables']['events']['Row']
type Place = Database['public']['Tables']['places']['Row']

export type FavoriteItem = {
  id: string
  item_id: string
  item_type: 'event' | 'place'
  created_at: string
  item: Event | Place
}

/**
 * Hook to fetch user's favorites (both events and places)
 */
export function useFavoritesQuery(userId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return []

      // Fetch all favorites
      const result = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      const favorites = result.data as Favorite[]

      // Fetch event details
      const eventIds = favorites.filter((f) => f.item_type === 'event').map((f) => f.item_id)
      const eventsResult =
        eventIds.length > 0
          ? await supabase.from('events').select('*').in('id', eventIds)
          : { data: [], error: null }

      // Fetch place details
      const placeIds = favorites.filter((f) => f.item_type === 'place').map((f) => f.item_id)
      const placesResult =
        placeIds.length > 0
          ? await supabase.from('places').select('*').in('id', placeIds)
          : { data: [], error: null }

      if (eventsResult.error || placesResult.error) {
        throw new Error('Failed to fetch favorite items')
      }

      // Map favorites to include item data
      const eventsMap = new Map((eventsResult.data as Event[]).map((e) => [e.id, e]))
      const placesMap = new Map((placesResult.data as Place[]).map((p) => [p.id, p]))

      return favorites
        .map((fav) => ({
          ...fav,
          item: fav.item_type === 'event' ? eventsMap.get(fav.item_id) : placesMap.get(fav.item_id),
        }))
        .filter((fav) => fav.item !== undefined) as FavoriteItem[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to check if a specific item is favorited
 */
export function useIsFavorited(userId: string | undefined, itemId: string, itemType: 'event' | 'place') {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['is-favorited', userId, itemId, itemType],
    queryFn: async () => {
      if (!userId) return false

      const result = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .maybeSingle()

      if (result.error) {
        console.error('Error checking favorite:', result.error)
        return false
      }

      return !!result.data
    },
    enabled: !!userId && !!itemId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to toggle favorite (add or remove)
 */
export function useToggleFavorite() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const posthog = usePostHog()

  return useMutation({
    mutationFn: async ({
      userId,
      itemId,
      itemType,
      isFavorited,
    }: {
      userId: string
      itemId: string
      itemType: 'event' | 'place'
      isFavorited: boolean
    }) => {
      if (isFavorited) {
        // Remove favorite
        const result = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('item_id', itemId)
          .eq('item_type', itemType)

        if (result.error) {
          throw new Error(result.error.message)
        }

        return { action: 'removed', itemId, itemType }
      } else {
        // Add favorite
        const result = await supabase.from('favorites').insert({
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
        })

        if (result.error) {
          throw new Error(result.error.message)
        }

        return { action: 'added', itemId, itemType }
      }
    },
    onSuccess: (data, variables) => {
      // Track favorite toggle
      posthog?.capture('favorite_toggled', {
        action: data.action,
        item_type: data.itemType,
        item_id: data.itemId
      })

      // Invalidate favorites query
      queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] })
      // Invalidate the specific is-favorited query
      queryClient.invalidateQueries({
        queryKey: ['is-favorited', variables.userId, variables.itemId, variables.itemType],
      })
    },
  })
}
