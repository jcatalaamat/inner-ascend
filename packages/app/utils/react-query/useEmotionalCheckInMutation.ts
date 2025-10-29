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
      if (!user?.id) {
        console.log('[Emotional Check-ins Query] No user ID')
        return []
      }

      console.log('[Emotional Check-ins Query] Fetching check-ins for user:', user.id)
      const result = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('checkin_date', { ascending: false })
        .limit(30) // Last 30 days

      if (result.error) {
        console.error('[Emotional Check-ins Query] Error:', result.error)
        throw new Error(result.error.message)
      }

      console.log('[Emotional Check-ins Query] Found', result.data.length, 'check-ins')
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
      if (!user?.id) {
        console.log('[Today Check-in Query] No user ID')
        return null
      }

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      console.log('[Today Check-in Query] Fetching for:', today, 'user:', user.id)

      const result = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle()

      if (result.error) {
        console.error('[Today Check-in Query] Error:', result.error)
        throw new Error(result.error.message)
      }

      console.log('[Today Check-in Query] Result:', result.data ? 'Found' : 'Not found')
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

      console.log('[Emotional Check-in] Saving check-in:', { emotionState, today, userId: user.id })

      // Check if already checked in today
      const { data: existing, error: checkError } = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle()

      if (checkError) {
        console.error('[Emotional Check-in] Error checking existing:', checkError)
        throw new Error(checkError.message)
      }

      if (existing) {
        // Update existing check-in (user changed their mind)
        console.log('[Emotional Check-in] Updating existing check-in:', existing.id)
        const result = await supabase
          .from('emotional_checkins')
          .update({ emotion_state: emotionState })
          .eq('id', existing.id)
          .select()
          .single()

        if (result.error) {
          console.error('[Emotional Check-in] Update error:', result.error)
          throw new Error(result.error.message)
        }
        console.log('[Emotional Check-in] Update successful:', result.data)
        return result.data
      } else {
        // Create new check-in
        console.log('[Emotional Check-in] Creating new check-in')
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

        if (result.error) {
          console.error('[Emotional Check-in] Insert error:', result.error)
          throw new Error(result.error.message)
        }
        console.log('[Emotional Check-in] Insert successful:', result.data)
        return result.data
      }
    },
    onSuccess: (data) => {
      console.log('[Emotional Check-in] Mutation success, invalidating queries:', data)
      queryClient.invalidateQueries({ queryKey: ['emotional-checkins'] })
      queryClient.invalidateQueries({ queryKey: ['today-checkin'] })
    },
    onError: (error) => {
      console.error('[Emotional Check-in] Mutation error:', error)
    },
  })
}
