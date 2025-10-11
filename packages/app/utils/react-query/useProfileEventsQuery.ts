import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../supabase/useSupabase'

type Event = Database['public']['Tables']['events']['Row']

interface ProfileEventsQueryOptions {
  profileId: string | undefined
  includeCollaborations?: boolean
  includePast?: boolean
}

/**
 * Hook to fetch events created by a profile
 * Filters out hidden_by_reports on client-side (matching events pattern)
 */
export function useProfileEventsQuery({
  profileId,
  includeCollaborations = true,
  includePast = false,
}: ProfileEventsQueryOptions) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['profile-events', profileId, includeCollaborations, includePast],
    queryFn: async () => {
      if (!profileId) return []

      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      // Filter by profile_id (events they created)
      query = query.eq('profile_id', profileId)

      // Filter by date if not including past events
      if (!includePast) {
        const today = new Date().toISOString().split('T')[0]
        query = query.gte('date', today)
      }

      const result = await query

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Client-side filter for hidden_by_reports (matching events pattern)
      const filteredEvents = (result.data as Event[]).filter(
        (event) => !event.hidden_by_reports
      )

      // TODO: If includeCollaborations, also fetch events where profileId IN collaborator_ids
      // This requires a separate query since PostgreSQL array contains check

      return filteredEvents
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch upcoming events for a profile
 */
export function useProfileUpcomingEventsQuery(profileId: string | undefined) {
  return useProfileEventsQuery({
    profileId,
    includeCollaborations: true,
    includePast: false,
  })
}

/**
 * Hook to fetch past events for a profile
 */
export function useProfilePastEventsQuery(profileId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['profile-past-events', profileId],
    queryFn: async () => {
      if (!profileId) return []

      const today = new Date().toISOString().split('T')[0]

      const result = await supabase
        .from('events')
        .select('*')
        .eq('profile_id', profileId)
        .lt('date', today)
        .order('date', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Client-side filter for hidden_by_reports
      return (result.data as Event[]).filter((event) => !event.hidden_by_reports)
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 10, // 10 minutes (past events change less frequently)
  })
}
