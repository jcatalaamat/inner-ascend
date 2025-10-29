import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

type LiveSession = Database['public']['Tables']['live_sessions']['Row']
type SessionRsvp = Database['public']['Tables']['session_rsvps']['Row']

/**
 * Hook to fetch upcoming live sessions
 * Fetches sessions from today onwards, ordered by date and time
 */
export function useUpcomingSessionsQuery() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['live-sessions', 'upcoming'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      const result = await supabase
        .from('live_sessions')
        .select('*')
        .gte('session_date', today)
        .eq('is_published', true)
        .order('session_date', { ascending: true })
        .order('session_time', { ascending: true })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as LiveSession[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch past sessions
 * Fetches sessions before today, limited to 10 most recent
 */
export function usePastSessionsQuery() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['live-sessions', 'past'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      const result = await supabase
        .from('live_sessions')
        .select('*')
        .lt('session_date', today)
        .eq('is_published', true)
        .order('session_date', { ascending: false })
        .limit(10)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as LiveSession[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to fetch user's RSVPs
 * Returns all RSVPs for the current user
 */
export function useUserRsvpsQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['session-rsvps', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return []
      }

      const result = await supabase
        .from('session_rsvps')
        .select('*')
        .eq('user_id', user.id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as SessionRsvp[]
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch RSVPs for a specific session
 * Returns all RSVPs for a session with count
 */
export function useSessionRsvpsQuery(sessionId: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['session-rsvps', sessionId],
    queryFn: async () => {
      const result = await supabase
        .from('session_rsvps')
        .select('*')
        .eq('session_id', sessionId)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as SessionRsvp[]
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to RSVP to a session
 * Creates or updates an RSVP for the current user
 */
export function useRsvpMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      status,
    }: {
      sessionId: string
      status: 'yes' | 'maybe' | 'no'
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const result = await supabase
        .from('session_rsvps')
        .upsert(
          {
            session_id: sessionId,
            user_id: user.id,
            rsvp_status: status,
          },
          {
            onConflict: 'session_id,user_id',
          }
        )
        .select()
        .single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['live-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['session-rsvps', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['session-rsvps', variables.sessionId] })
    },
  })
}

/**
 * Hook to remove RSVP from a session
 * Deletes the user's RSVP
 */
export function useRemoveRsvpMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const result = await supabase
        .from('session_rsvps')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['live-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['session-rsvps', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['session-rsvps', variables.sessionId] })
    },
  })
}
