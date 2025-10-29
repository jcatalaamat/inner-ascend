import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

type CosmicCache = Database['public']['Tables']['cosmic_cache']['Row']

/**
 * Hook to fetch today's cosmic weather message
 * First checks cache, then generates if needed
 */
export function useCosmicWeatherQuery() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['cosmic-weather'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      // First, check if we have cached data for today
      const { data: cachedData } = await supabase
        .from('cosmic_cache')
        .select('*')
        .eq('cache_date', today)
        .maybeSingle()

      // If we have cached data with a message, return it
      const cache = cachedData as CosmicCache | null
      if (cache && cache.daily_message) {
        return {
          message: cache.daily_message,
          moonPhase: cache.moon_phase,
          moonSign: cache.moon_sign,
          cached: true,
        }
      }

      // Otherwise, call the edge function to generate new cosmic weather
      try {
        const { data: functionData, error: functionError } = await supabase.functions.invoke(
          'generate-cosmic-weather',
          {
            body: {},
          }
        )

        if (functionError) {
          // Silently fall through to fallback - API key may not be configured
          throw functionError
        }

        if (functionData?.success && functionData?.message) {
          return {
            message: functionData.message,
            moonPhase: functionData.data?.moon_phase || null,
            moonSign: functionData.data?.moon_sign || null,
            cached: false,
          }
        }

        throw new Error('Failed to generate cosmic weather')
      } catch (error) {
        // Gracefully use fallback message if API generation fails
        // This is expected behavior if ANTHROPIC_API_KEY is not configured
        return {
          message:
            'The journey inward requires stillness. Today, let yourself simply be—without the need to fix, change, or understand everything. Trust that your healing unfolds in perfect timing.',
          moonPhase: null,
          moonSign: null,
          cached: false,
          fallback: true,
        }
      }
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - cosmic weather doesn't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (renamed from cacheTime in React Query v5)
    retry: 1, // Only retry once since we have fallback
  })
}

/**
 * Hook to get recent cosmic weather messages (for history/archive)
 */
export function useCosmicWeatherHistoryQuery(limit: number = 7) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['cosmic-weather-history', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cosmic_cache')
        .select('*')
        .not('daily_message', 'is', null)
        .order('cache_date', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(error.message)
      }

      return data as CosmicCache[]
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
