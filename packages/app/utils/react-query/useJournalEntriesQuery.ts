import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert']

/**
 * Hook to fetch all user's journal entries
 */
export function useJournalEntriesQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const result = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as JournalEntry[]
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch recent journal entries (limited)
 */
export function useRecentJournalEntriesQuery(limit: number = 5) {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['recent-journal-entries', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return []

      const result = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as JournalEntry[]
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to fetch a single journal entry by ID
 */
export function useJournalEntryQuery(entryId: string) {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['journal-entry', entryId, user?.id],
    queryFn: async () => {
      if (!user?.id || !entryId) return null

      const result = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', user.id)
        .single()

      if (result.error) {
        if (result.error.code === 'PGRST116') {
          // Not found
          return null
        }
        throw new Error(result.error.message)
      }

      return result.data as JournalEntry
    },
    enabled: !!user?.id && !!entryId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to get journal entry statistics
 */
export function useJournalStatsQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['journal-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return {
          totalEntries: 0,
          totalWords: 0,
          averageWords: 0,
        }
      }

      const result = await supabase
        .from('journal_entries')
        .select('word_count')
        .eq('user_id', user.id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      const entries = result.data || []
      const totalEntries = entries.length
      const totalWords = entries.reduce((sum, entry) => sum + (entry.word_count || 0), 0)
      const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0

      return {
        totalEntries,
        totalWords,
        averageWords,
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Mutation to create a new journal entry
 */
export function useCreateJournalEntryMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      prompt,
      content,
      wordCount,
      moduleId,
    }: {
      prompt?: string
      content: string
      wordCount: number
      moduleId?: number
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const entryData: JournalEntryInsert = {
        user_id: user.id,
        prompt: prompt || null,
        content,
        word_count: wordCount,
        module_id: moduleId || null,
      }

      const result = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single()

      if (result.error) throw new Error(result.error.message)
      return result.data as JournalEntry
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
      queryClient.invalidateQueries({ queryKey: ['recent-journal-entries'] })
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] })
    },
  })
}

/**
 * Mutation to update an existing journal entry
 */
export function useUpdateJournalEntryMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      entryId,
      content,
      wordCount,
    }: {
      entryId: string
      content: string
      wordCount: number
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const result = await supabase
        .from('journal_entries')
        .update({
          content,
          word_count: wordCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (result.error) throw new Error(result.error.message)
      return result.data as JournalEntry
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
      queryClient.invalidateQueries({ queryKey: ['recent-journal-entries'] })
      queryClient.invalidateQueries({ queryKey: ['journal-entry', variables.entryId] })
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] })
    },
  })
}

/**
 * Mutation to delete a journal entry
 */
export function useDeleteJournalEntryMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const result = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id)

      if (result.error) throw new Error(result.error.message)
      return entryId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
      queryClient.invalidateQueries({ queryKey: ['recent-journal-entries'] })
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] })
    },
  })
}
