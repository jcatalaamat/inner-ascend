import { useQuery } from '@tanstack/react-query'

import module1Data from '../../content/module-1.json'

export interface ModuleDay {
  day: number
  title: string
  teaching: {
    heading: string
    content: string
    keyPoints: string[]
  }
  practice: {
    type: string
    title: string
    duration: number
    description: string
  }
  journaling: {
    prompt: string
    questions: string[]
  }
}

export interface ModuleContent {
  module: {
    id: number
    title: string
    description: string
    duration_days: number
  }
  days: ModuleDay[]
}

/**
 * Hook to fetch content for a specific module
 * Currently only Module 1 is available with full content
 */
export function useModuleContentQuery(moduleId: number) {
  return useQuery({
    queryKey: ['module-content', moduleId],
    queryFn: async () => {
      // Currently only Module 1 has content
      if (moduleId === 1) {
        return module1Data as ModuleContent
      }

      // For other modules, return placeholder
      return null
    },
    staleTime: 1000 * 60 * 60, // 1 hour - static content doesn't change
  })
}

/**
 * Hook to fetch content for a specific day of a module
 */
export function useModuleDayContentQuery(moduleId: number, dayNumber: number) {
  return useQuery({
    queryKey: ['module-day-content', moduleId, dayNumber],
    queryFn: async () => {
      if (moduleId === 1) {
        const content = module1Data as ModuleContent
        const dayContent = content.days.find(d => d.day === dayNumber)

        if (!dayContent) {
          throw new Error(`Day ${dayNumber} not found for Module ${moduleId}`)
        }

        return {
          module: content.module,
          day: dayContent
        }
      }

      return null
    },
    enabled: !!moduleId && !!dayNumber,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
