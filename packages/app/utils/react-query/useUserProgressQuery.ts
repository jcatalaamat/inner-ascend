import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

type UserProgress = Database['public']['Tables']['user_progress']['Row']
type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert']

/**
 * Hook to fetch current user's progress across all modules
 */
export function useUserProgressQuery() {
  const supabase = useSupabase()
  const user = useUser()

  return useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const result = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as UserProgress[]
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to get user's progress for a specific module
 */
export function useModuleProgressQuery(moduleId: number) {
  const supabase = useSupabase()
  const user = useUser()

  return useQuery({
    queryKey: ['module-progress', user?.id, moduleId],
    queryFn: async () => {
      if (!user?.id) return []

      const result = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .order('day_number', { ascending: true })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as UserProgress[]
    },
    enabled: !!user?.id && !!moduleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to get user's current day in a module (first incomplete day)
 */
export function useCurrentModuleDayQuery(moduleId: number, moduleDuration: number) {
  const { data: progress } = useModuleProgressQuery(moduleId)

  return useQuery({
    queryKey: ['current-module-day', moduleId, progress, moduleDuration],
    queryFn: async () => {
      if (!progress || progress.length === 0) {
        return 1 // Start at day 1
      }

      // Find first incomplete day
      for (let i = 1; i <= moduleDuration; i++) {
        const isDayComplete = progress.some(p => p.day_number === i)
        if (!isDayComplete) return i
      }

      // All complete, return last day
      return moduleDuration
    },
    enabled: !!moduleDuration,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Get overall progress summary
 */
export function useProgressSummaryQuery() {
  const { data: allProgress } = useUserProgressQuery()
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['progress-summary', allProgress],
    queryFn: async () => {
      if (!allProgress || allProgress.length === 0) {
        return {
          totalDaysCompleted: 0,
          modulesStarted: 0,
          modulesCompleted: 0,
          currentModule: 1,
          currentDay: 1
        }
      }

      // Fetch all modules to get durations
      const { data: modules, error } = await supabase
        .from('modules')
        .select('id, duration_days, sequence_order')
        .order('sequence_order', { ascending: true })

      if (error || !modules) {
        // Fallback to simple logic if can't fetch modules
        const latestProgress = allProgress[0]
        return {
          totalDaysCompleted: allProgress.length,
          modulesStarted: 1,
          modulesCompleted: 0,
          currentModule: latestProgress.module_id || 1,
          currentDay: (latestProgress.day_number || 0) + 1
        }
      }

      // Count unique modules
      const uniqueModules = new Set(allProgress.map(p => p.module_id))
      const modulesStarted = uniqueModules.size

      // Group progress by module
      const progressByModule: Record<number, number[]> = {}
      allProgress.forEach(p => {
        if (p.module_id && p.day_number) {
          if (!progressByModule[p.module_id]) {
            progressByModule[p.module_id] = []
          }
          progressByModule[p.module_id].push(p.day_number)
        }
      })

      // Count completed modules (all days completed)
      let modulesCompleted = 0
      modules.forEach(module => {
        const completedDays = progressByModule[module.id] || []
        if (completedDays.length >= module.duration_days) {
          modulesCompleted++
        }
      })

      // Find current module and day
      let currentModule = 1
      let currentDay = 1

      // Iterate through modules in order to find first incomplete day
      for (const module of modules) {
        const completedDays = progressByModule[module.id] || []

        // Find first incomplete day in this module
        for (let day = 1; day <= module.duration_days; day++) {
          if (!completedDays.includes(day)) {
            currentModule = module.id
            currentDay = day
            return {
              totalDaysCompleted: allProgress.length,
              modulesStarted,
              modulesCompleted,
              currentModule,
              currentDay
            }
          }
        }
      }

      // All modules complete - return last module's last day
      const lastModule = modules[modules.length - 1]
      currentModule = lastModule.id
      currentDay = lastModule.duration_days

      return {
        totalDaysCompleted: allProgress.length,
        modulesStarted,
        modulesCompleted,
        currentModule,
        currentDay
      }
    },
    enabled: !!allProgress,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Mutation to mark a day as complete
 */
export function useCompleteModuleDayMutation() {
  const supabase = useSupabase()
  const user = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      moduleId,
      dayNumber,
    }: {
      moduleId: number
      dayNumber: number
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const progressData: UserProgressInsert = {
        user_id: user.id,
        module_id: moduleId,
        day_number: dayNumber,
      }

      const result = await supabase
        .from('user_progress')
        .insert(progressData)
        .select()
        .single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as UserProgress
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch
      queryClient.invalidateQueries({ queryKey: ['user-progress'] })
      queryClient.invalidateQueries({ queryKey: ['module-progress', user?.id, data.module_id] })
      queryClient.invalidateQueries({ queryKey: ['daily-streaks'] })
      queryClient.invalidateQueries({ queryKey: ['progress-summary'] })
    },
  })
}
