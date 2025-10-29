import type { Database } from '@my/supabase/types'
import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

type Module = Database['public']['Tables']['modules']['Row']

/**
 * Fetch all modules from Supabase, ordered by sequence
 */
const getModules = async (supabase: ReturnType<typeof useSupabase>) => {
  const query = supabase
    .from('modules')
    .select('*')
    .order('sequence_order', { ascending: true })

  return query
}

/**
 * Hook to fetch all modules ordered by sequence
 */
export function useModulesQuery() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      try {
        console.log('Fetching modules...')
        const result = await getModules(supabase)

        if (result.error) {
          console.error('Modules query error:', result.error)
          throw new Error(result.error.message)
        }

        console.log('Modules fetched successfully:', result.data?.length || 0, 'modules')

        return result.data as Module[]
      } catch (error) {
        console.error('Modules query failed:', error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - modules don't change often
  })
}

/**
 * Hook to fetch a single module by ID
 */
export function useModuleQuery(id: number) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['module', id],
    queryFn: async () => {
      const result = await supabase.from('modules').select('*').eq('id', id).single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as Module
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
