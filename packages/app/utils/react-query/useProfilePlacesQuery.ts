import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../supabase/useSupabase'

type Place = Database['public']['Tables']['places']['Row']

interface ProfilePlacesQueryOptions {
  profileId: string | undefined
  includeCollaborations?: boolean
}

/**
 * Hook to fetch places created by a profile
 * Filters out hidden_by_reports on client-side (matching places pattern)
 */
export function useProfilePlacesQuery({
  profileId,
  includeCollaborations = true,
}: ProfilePlacesQueryOptions) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['profile-places', profileId, includeCollaborations],
    queryFn: async () => {
      if (!profileId) return []

      const result = await supabase
        .from('places')
        .select('*')
        .eq('created_by', profileId)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Client-side filter for hidden_by_reports (matching places pattern)
      const filteredPlaces = (result.data as Place[]).filter(
        (place) => !place.hidden_by_reports
      )

      // TODO: If includeCollaborations, also fetch places where profileId IN collaborator_ids
      // This requires a separate query since PostgreSQL array contains check

      return filteredPlaces
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch verified places created by a profile
 */
export function useProfileVerifiedPlacesQuery(profileId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['profile-verified-places', profileId],
    queryFn: async () => {
      if (!profileId) return []

      const result = await supabase
        .from('places')
        .select('*')
        .eq('created_by', profileId)
        .eq('verified', true)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Client-side filter for hidden_by_reports
      return (result.data as Place[]).filter((place) => !place.hidden_by_reports)
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
