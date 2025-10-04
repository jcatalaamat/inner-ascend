import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'

import type { EventCategory } from '../constants'
import { isUpcoming } from '../date-helpers'
import { useSupabase } from '../supabase/useSupabase'

type Event = Database['public']['Tables']['events']['Row']

export interface EventFilters {
  category?: EventCategory | null
  ecoConscious?: boolean
  search?: string
  includePast?: boolean
}

/**
 * Fetch events from Supabase with optional filters
 */
const getEvents = async (
  supabase: ReturnType<typeof useSupabase>,
  filters: EventFilters = {}
) => {
  let query = supabase.from('events').select('*')

  // Filter by date (only upcoming events by default)
  if (!filters.includePast) {
    const today = new Date().toISOString().split('T')[0]
    console.log('Filtering events from date:', today)
    query = query.gte('date', today)
  }

  // Filter by category
  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  // Filter by eco-conscious
  if (filters.ecoConscious) {
    query = query.eq('eco_conscious', true)
  }

  // Search in title and description
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Sort by date and time
  query = query.order('date', { ascending: true }).order('time', { ascending: true })

  return query.limit(100)
}

/**
 * Hook to fetch all events with optional filters
 */
export function useEventsQuery(filters: EventFilters = {}) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      try {
        console.log('Fetching events with filters:', filters)
        const result = await getEvents(supabase, filters)

        if (result.error) {
          console.error('Events query error:', result.error)
          throw new Error(result.error.message)
        }

        console.log('Events fetched successfully:', result.data?.length || 0, 'events')
        return result.data as Event[]
      } catch (error) {
        console.error('Events query failed:', error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch a single event by ID
 */
export function useEventDetailQuery(id: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const result = await supabase.from('events').select('*').eq('id', id).single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Event
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to fetch events created by the current user
 */
export function useMyEventsQuery(userId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['my-events', userId],
    queryFn: async () => {
      if (!userId) return []

      const result = await supabase
        .from('events')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Event[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}
