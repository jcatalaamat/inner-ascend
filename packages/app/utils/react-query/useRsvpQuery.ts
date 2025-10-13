import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import type { AttendeeStatus, AttendeeWithProfile, EventAttendee } from 'app/utils/attendee-types'

/**
 * Hook to get attendees for an event
 */
export function useEventAttendeesQuery(eventId: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['event_attendees', eventId],
    queryFn: async (): Promise<AttendeeWithProfile[]> => {
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          profile:profiles(id, name, avatar_url)
        `)
        .eq('event_id', eventId)
        .eq('status', 'going')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return (data || []).map(item => ({
        ...item,
        profile: item.profile
      })) as AttendeeWithProfile[]
    },
    enabled: !!eventId,
  })
}

/**
 * Hook to get attendee counts for an event
 */
export function useEventAttendeeCountsQuery(eventId: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['event_attendee_counts', eventId],
    queryFn: async () => {
      // Get counts by status (excluding 'cant_go' from public counts)
      const { data, error } = await supabase
        .from('event_attendees')
        .select('status')
        .eq('event_id', eventId)
        .neq('status', 'cant_go') // Don't include "cant_go" in public counts

      if (error) {
        throw error
      }

      const counts = {
        going: 0,
        interested: 0,
        maybe: 0,
        watching: 0,
        cant_go: 0, // Always 0 in public view
        total: 0,
      }

      data?.forEach(item => {
        if (item.status === 'going') counts.going++
        else if (item.status === 'interested') counts.interested++
        else if (item.status === 'maybe') counts.maybe++
        else if (item.status === 'watching') counts.watching++
        counts.total++
      })

      return counts
    },
    enabled: !!eventId,
  })
}

/**
 * Hook to get user's RSVP status for an event
 */
export function useUserRsvpQuery(eventId: string) {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['user_rsvp', eventId, user?.id],
    queryFn: async (): Promise<EventAttendee | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        throw error
      }

      return data
    },
    enabled: !!eventId && !!user?.id,
  })
}

/**
 * Hook to get all events user has RSVP'd to
 */
export function useUserRsvpsQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['user_rsvps', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          event:events(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },
    enabled: !!user?.id,
  })
}

/**
 * Mutation hook to create/update RSVP
 */
export function useRsvpMutation() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { user } = useUser()

  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: AttendeeStatus }) => {
      if (!user?.id) {
        throw new Error('User must be logged in to RSVP')
      }

      const { data, error } = await supabase
        .from('event_attendees')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        }, {
          onConflict: 'event_id,user_id'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['event_attendees', variables.eventId] })
      queryClient.invalidateQueries({ queryKey: ['event_attendee_counts', variables.eventId] })
      queryClient.invalidateQueries({ queryKey: ['user_rsvp', variables.eventId, user?.id] })
      queryClient.invalidateQueries({ queryKey: ['user_rsvps', user?.id] })
    },
  })
}

/**
 * Mutation hook to remove RSVP
 */
export function useRemoveRsvpMutation() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in')
      }

      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }
    },
    onSuccess: (_, eventId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['event_attendees', eventId] })
      queryClient.invalidateQueries({ queryKey: ['event_attendee_counts', eventId] })
      queryClient.invalidateQueries({ queryKey: ['user_rsvp', eventId, user?.id] })
      queryClient.invalidateQueries({ queryKey: ['user_rsvps', user?.id] })
    },
  })
}
