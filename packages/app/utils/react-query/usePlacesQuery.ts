import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'

import type { PlaceType } from '../constants'
import { useSupabase } from '../supabase/useSupabase'

type Place = Database['public']['Tables']['places']['Row']

export interface PlaceFilters {
  type?: PlaceType | null
  ecoConscious?: boolean
  verified?: boolean
  search?: string
  tags?: string[]
  city_id?: string
}

/**
 * Fetch places from Supabase with optional filters
 */
const getPlaces = async (
  supabase: ReturnType<typeof useSupabase>,
  filters: PlaceFilters = {}
) => {
  let query = supabase.from('places').select('*')

  // Filter out items hidden by reports
  query = query.eq('hidden_by_reports', false)

  // Filter by type
  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  // Filter by eco-conscious
  if (filters.ecoConscious) {
    query = query.eq('eco_conscious', true)
  }

  // Filter by verified
  if (filters.verified) {
    query = query.eq('verified', true)
  }

  // Filter by tags (contains any of the specified tags)
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags)
  }

  // Filter by city
  if (filters.city_id) {
    query = query.eq('city_id', filters.city_id)
  }

  // Search in name and description
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Sort by name
  query = query.order('name', { ascending: true })

  return query.limit(100)
}

/**
 * Hook to fetch all places with optional filters
 */
export function usePlacesQuery(filters: PlaceFilters = {}) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['places', filters],
    queryFn: async () => {
      const result = await getPlaces(supabase, filters)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Place[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (places don't change as often)
  })
}

/**
 * Hook to fetch a single place by ID
 */
export function usePlaceDetailQuery(id: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      const result = await supabase.from('places').select('*').eq('id', id).single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Place
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

/**
 * Hook to fetch places created by the current user
 */
export function useMyPlacesQuery(userId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['my-places', userId],
    queryFn: async () => {
      if (!userId) return []

      const result = await supabase
        .from('places')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Place[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  })
}
