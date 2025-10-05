import type { Session, SessionContext as SessionContextHelper } from '@supabase/auth-helpers-react'
import { AuthError, type User } from '@supabase/supabase-js'
import { supabase } from 'app/utils/supabase/client.native'
import { router, useSegments } from 'expo-router'
import { createContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { usePostHog } from 'posthog-react-native'
import * as Device from 'expo-device'
import * as Application from 'expo-application'

import type { AuthProviderProps } from './AuthProvider'
import { AuthStateChangeHandler } from './AuthStateChangeHandler'

export const SessionContext = createContext<SessionContextHelper>({
  session: null,
  error: null,
  isLoading: false,
  supabaseClient: supabase,
})

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(initialSession || null)
  const [error, setError] = useState<AuthError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const posthog = usePostHog()

  useProtectedRoute(session?.user ?? null)

  useEffect(() => {
    setIsLoading(true)
    supabase.auth
      .getSession()
      .then(({ data: { session: newSession } }) => {
        setSession(newSession)
      })
      .catch((error) => setError(new AuthError(error.message)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)

      // Identify user in PostHog when they sign in
      if (event === 'SIGNED_IN' && newSession?.user) {
        // Enhanced user properties
        posthog?.identify(newSession.user.id, {
          email: newSession.user.email,
          created_at: newSession.user.created_at,
          app_version: Application.nativeApplicationVersion || '1.0.0',
          app_build: Application.nativeBuildVersion || '1',
          platform: Platform.OS,
          platform_version: Platform.Version,
          device_model: Device.modelName || 'Unknown',
          device_brand: Device.brand || 'Unknown',
          device_type: Device.deviceType || 'Unknown',
          device_year: Device.deviceYearClass || 'Unknown',
          is_device: Device.isDevice,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: Intl.DateTimeFormat().resolvedOptions().locale,
          is_first_session: !newSession.user.created_at || 
            (Date.now() - new Date(newSession.user.created_at).getTime()) < 60000, // Within 1 minute
        })
        
        // Set additional person properties
        posthog?.setPersonProperties({
          user_type: 'standard',
          signup_source: newSession.user.app_metadata?.provider || 'email',
          last_active: new Date().toISOString(),
          total_sessions: 1, // Will be updated on each session
        })
        
        posthog?.capture('user_signed_in', {
          provider: newSession.user.app_metadata?.provider,
          is_first_session: !newSession.user.created_at || 
            (Date.now() - new Date(newSession.user.created_at).getTime()) < 60000,
          device_info: {
            model: Device.modelName,
            brand: Device.brand,
            platform: Platform.OS,
          }
        })
      } else if (event === 'SIGNED_OUT') {
        posthog?.capture('user_signed_out')
        posthog?.reset()
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [posthog])

  return (
    <SessionContext.Provider
      value={
        session
          ? {
              session,
              isLoading: false,
              error: null,
              supabaseClient: supabase,
            }
          : error
          ? {
              error,
              isLoading: false,
              session: null,
              supabaseClient: supabase,
            }
          : {
              error: null,
              isLoading,
              session: null,
              supabaseClient: supabase,
            }
      }
    >
      <AuthStateChangeHandler />
      {children}
    </SessionContext.Provider>
  )
}

export function useProtectedRoute(user: User | null) {
  const segments = useSegments()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      replaceRoute('/onboarding')
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      replaceRoute('/')
    }
  }, [user, segments])
}

/**
 * temporary fix
 *
 * see https://github.com/expo/router/issues/740
 * see https://github.com/expo/router/issues/745
 *  */
const replaceRoute = (href: string) => {
  if (Platform.OS === 'ios') {
    setTimeout(() => {
      router.replace(href)
    }, 1)
  } else {
    setTimeout(() => {
      router.replace(href)
    }, 1)
  }
}
