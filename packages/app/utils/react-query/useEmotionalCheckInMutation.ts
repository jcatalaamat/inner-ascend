import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

type EmotionalCheckIn = Database['public']['Tables']['emotional_checkins']['Row']
type EmotionalCheckInInsert = Database['public']['Tables']['emotional_checkins']['Insert']
type EmotionState = 'struggling' | 'processing' | 'clear' | 'integrated'

/**
 * Hook to fetch user's emotional check-ins
 */
export function useEmotionalCheckInsQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['emotional-checkins', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const result = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('checkin_date', { ascending: false })
        .limit(30) // Last 30 days

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as EmotionalCheckIn[]
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to get today's emotional check-in
 */
export function useTodayCheckInQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['today-checkin', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      const result = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .single()

      if (result.error && result.error.code !== 'PGRST116') {
        // PGRST116 is "not found" which is okay
        throw new Error(result.error.message)
      }

      return result.data as EmotionalCheckIn | null
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Mutation to record today's emotional check-in
 */
export function useEmotionalCheckInMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (emotionState: EmotionState) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      // Check if already checked in today
      const { data: existing } = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .single()

      if (existing) {
        // Update existing check-in (user changed their mind)
        const result = await supabase
          .from('emotional_checkins')
          .update({ emotion_state: emotionState })
          .eq('id', existing.id)
          .select()
          .single()

        if (result.error) throw new Error(result.error.message)
        return result.data
      } else {
        // Create new check-in
        const checkInData: EmotionalCheckInInsert = {
          user_id: user.id,
          emotion_state: emotionState,
          checkin_date: today,
        }

        const result = await supabase
          .from('emotional_checkins')
          .insert(checkInData)
          .select()
          .single()

        if (result.error) throw new Error(result.error.message)
        return result.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotional-checkins'] })
      queryClient.invalidateQueries({ queryKey: ['today-checkin'] })
    },
  })
}
