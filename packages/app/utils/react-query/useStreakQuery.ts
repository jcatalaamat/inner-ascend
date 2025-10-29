import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

type DailyStreak = Database['public']['Tables']['daily_streaks']['Row']
type DailyStreakInsert = Database['public']['Tables']['daily_streaks']['Insert']

/**
 * Hook to fetch user's daily streaks
 */
export function useDailyStreaksQuery() {
  const supabase = useSupabase()
  const { user } = useUser()

  return useQuery({
    queryKey: ['daily-streaks', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const result = await supabase
        .from('daily_streaks')
        .select('*')
        .eq('user_id', user.id)
        .order('practice_date', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as DailyStreak[]
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to calculate current and longest streak
 */
export function useStreakStatsQuery() {
  const { data: streaks } = useDailyStreaksQuery()

  return useQuery({
    queryKey: ['streak-stats', streaks],
    queryFn: async () => {
      if (!streaks || streaks.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          totalPractices: 0
        }
      }

      // Calculate current streak (consecutive days from today backwards)
      let currentStreak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const sortedStreaks = [...streaks].sort((a, b) =>
        new Date(b.practice_date).getTime() - new Date(a.practice_date).getTime()
      )

      // Check if practiced today or yesterday (gives grace period)
      const latestDate = new Date(sortedStreaks[0].practice_date)
      latestDate.setHours(0, 0, 0, 0)
      const daysSinceLatest = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceLatest <= 1) {
        // Count backwards from latest date
        for (let i = 0; i < sortedStreaks.length; i++) {
          const date = new Date(sortedStreaks[i].practice_date)
          date.setHours(0, 0, 0, 0)

          if (i === 0) {
            currentStreak = 1
          } else {
            const prevDate = new Date(sortedStreaks[i - 1].practice_date)
            prevDate.setHours(0, 0, 0, 0)
            const daysDiff = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

            if (daysDiff === 1) {
              currentStreak++
            } else {
              break
            }
          }
        }
      }

      // Calculate longest streak
      let longestStreak = 0
      let tempStreak = 1

      for (let i = 1; i < sortedStreaks.length; i++) {
        const currentDate = new Date(sortedStreaks[i].practice_date)
        const prevDate = new Date(sortedStreaks[i - 1].practice_date)
        currentDate.setHours(0, 0, 0, 0)
        prevDate.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff === 1) {
          tempStreak++
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)

      // Total practices completed
      const totalPractices = streaks.reduce((sum, s) => sum + (s.practices_completed || 0), 0)

      return {
        currentStreak,
        longestStreak,
        totalPractices
      }
    },
    enabled: !!streaks,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Mutation to record today's practice (increments or creates streak)
 */
export function useRecordPracticeMutation() {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      // Try to get today's streak record
      const { data: existing } = await supabase
        .from('daily_streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('practice_date', today)
        .single()

      if (existing) {
        // Update existing
        const result = await supabase
          .from('daily_streaks')
          .update({ practices_completed: (existing.practices_completed || 0) + 1 })
          .eq('id', existing.id)
          .select()
          .single()

        if (result.error) throw new Error(result.error.message)
        return result.data
      } else {
        // Create new
        const streakData: DailyStreakInsert = {
          user_id: user.id,
          practice_date: today,
          practices_completed: 1,
        }

        const result = await supabase
          .from('daily_streaks')
          .insert(streakData)
          .select()
          .single()

        if (result.error) throw new Error(result.error.message)
        return result.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-streaks'] })
      queryClient.invalidateQueries({ queryKey: ['streak-stats'] })
    },
  })
}
