import type { Database } from '@my/supabase/types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileStats = Database['public']['Tables']['profile_stats']['Row']

/**
 * Hook to fetch public profile data by ID
 */
export function useProfileQuery(profileId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) return null

      const result = await supabase.from('profiles').select('*').eq('id', profileId).single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Profile
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch profile statistics
 */
export function useProfileStatsQuery(profileId: string | undefined) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['profile-stats', profileId],
    queryFn: async () => {
      if (!profileId) return null

      const result = await supabase
        .from('profile_stats')
        .select('*')
        .eq('profile_id', profileId)
        .single()

      if (result.error) {
        // Stats may not exist yet, return default
        return {
          profile_id: profileId,
          services_count: 0,
          total_views: 0,
          avg_response_time: null,
          member_since: null,
          updated_at: new Date().toISOString(),
        } as ProfileStats
      }

      return result.data as ProfileStats
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to update profile data
 */
export function useUpdateProfileMutation() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      profileId,
      updates,
    }: {
      profileId: string
      updates: Partial<Profile>
    }) => {
      const result = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    onSuccess: (data, variables) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ['profile', variables.profileId] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
