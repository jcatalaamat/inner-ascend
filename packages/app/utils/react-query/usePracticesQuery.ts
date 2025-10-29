import { useQuery } from '@tanstack/react-query'

import practicesData from '../../content/practices.json'

export interface Practice {
  title: string
  type: 'meditation' | 'exercise' | 'journaling'
  duration_minutes: number
  description: string
  fullDescription?: string
  benefits?: string[]
  instructions?: string
  bestFor?: string
  audio_url?: string | null
}

export interface JournalingPrompts {
  shadow_work: string[]
  inner_child: string[]
  core_wounds: string[]
  radical_honesty: string[]
  integration: string[]
}

/**
 * Hook to fetch all meditation practices
 */
export function useMeditationsQuery() {
  return useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      return practicesData.meditations as Practice[]
    },
    staleTime: 1000 * 60 * 60, // 1 hour - static content
  })
}

/**
 * Hook to fetch all exercise practices
 */
export function useExercisesQuery() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      return practicesData.exercises as Practice[]
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

/**
 * Hook to fetch all journaling prompts organized by category
 */
export function useJournalingPromptsQuery() {
  return useQuery({
    queryKey: ['journaling-prompts'],
    queryFn: async () => {
      return practicesData.journaling_prompts as JournalingPrompts
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

/**
 * Hook to fetch a specific practice by title
 */
export function usePracticeQuery(title: string) {
  return useQuery({
    queryKey: ['practice', title],
    queryFn: async () => {
      const allPractices = [
        ...practicesData.meditations,
        ...practicesData.exercises
      ]
      const practice = allPractices.find(p => p.title === title)

      if (!practice) {
        throw new Error(`Practice "${title}" not found`)
      }

      return practice as Practice
    },
    enabled: !!title,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
