import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

type Service = Database['public']['Tables']['services']['Row']

export interface ServiceFilters {
  category?: string
  priceType?: string
  deliveryOptions?: string[]
  available?: boolean
  searchQuery?: string
  ecoConscious?: boolean
  profile_id?: string
}

/**
 * Internal function to build services query with filters
 */
const getServices = async (
  supabase: ReturnType<typeof useSupabase>,
  filters: ServiceFilters = {}
) => {
  let query = supabase.from('services').select('*')

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  // Filter by price type
  if (filters.priceType) {
    query = query.eq('price_type', filters.priceType)
  }

  // Filter by availability
  if (filters.available !== undefined) {
    query = query.eq('available', filters.available)
  }

  // Filter by eco-conscious
  if (filters.ecoConscious) {
    query = query.eq('eco_conscious', true)
  }

  // Filter by profile_id
  if (filters.profile_id) {
    query = query.eq('profile_id', filters.profile_id)
  }

  // Filter by delivery options (array contains)
  if (filters.deliveryOptions && filters.deliveryOptions.length > 0) {
    query = query.overlaps('delivery_options', filters.deliveryOptions)
  }

  // Search in title and description
  if (filters.searchQuery) {
    query = query.or(
      `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
    )
  }

  // Sort by newest first
  query = query.order('created_at', { ascending: false })

  return query.limit(100)
}

/**
 * Hook to fetch all services with optional filters
 */
export function useServicesQuery(filters: ServiceFilters = {}) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['services', filters],
    queryFn: async () => {
      const result = await getServices(supabase, filters)

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Filter out hidden services on client side
      const visibleServices = result.data?.filter((s) => !s.hidden_by_reports) || []

      return visibleServices as Service[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch a single service by ID
 */
export function useServiceDetailQuery(id: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const result = await supabase.from('services').select('*').eq('id', id).single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Service
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to fetch services created by the current user
 */
export function useMyServicesQuery(userId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['my-services', userId],
    queryFn: async () => {
      if (!userId) return []

      const result = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Service[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to fetch services created by a specific profile
 */
export function useCreatorServicesQuery(profileId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['creator-services', profileId],
    queryFn: async () => {
      if (!profileId) return []

      const result = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', profileId)
        .eq('available', true)
        .order('created_at', { ascending: false})

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Filter out hidden services
      const visibleServices = result.data?.filter((s) => !s.hidden_by_reports) || []

      return visibleServices as Service[]
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  })
}
