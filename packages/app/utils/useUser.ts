import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useSessionContext } from './supabase/useSessionContext'
import { useSupabase } from './supabase/useSupabase'

function useProfile() {
  const { session } = useSessionContext()
  const user = session?.user
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  const { data, isPending, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) {
        // no rows - edge case of user being deleted
        if (error.code === 'PGRST116') {
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }
      return data
    },
    enabled: !!user?.id,
  })

  // Clear all queries when user logs out
  useEffect(() => {
    if (!user) {
      queryClient.clear()
    }
  }, [user, queryClient])

  return { data, isPending, refetch }
}

export const useUser = () => {
  const { session, isLoading: isLoadingSession } = useSessionContext()
  const user = session?.user
  const { data: profile, refetch, isPending: isLoadingProfile } = useProfile()

  // Get display name with email username fallback
  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name
    if (user?.email) {
      const username = user.email.split('@')[0]
      // Capitalize first letter
      return username.charAt(0).toUpperCase() + username.slice(1)
    }
    return 'User'
  }

  const displayName = getDisplayName()

  const avatarUrl = (function () {
    if (profile?.avatar_url) return profile.avatar_url
    if (typeof user?.user_metadata.avatar_url === 'string') return user.user_metadata.avatar_url

    const params = new URLSearchParams()
    params.append('name', displayName)
    params.append('size', '512') // Higher resolution for better quality
    params.append('background', '8B5CF6') // cosmicViolet without #
    params.append('color', 'E8E8ED') // silverMoon without #
    params.append('bold', 'true')
    params.append('rounded', 'true') // Make it circular
    params.append('length', '1') // Only show first letter/character
    params.append('font-size', '0.5') // 50% of size for better centering
    return `https://ui-avatars.com/api/?${params.toString()}`
  })()

  return {
    session,
    user,
    profile,
    displayName,
    avatarUrl,
    updateProfile: () => refetch(),
    isLoadingSession,
    isLoadingProfile,
    isPending: isLoadingSession || isLoadingProfile,
  }
}
