import type { Session } from '@supabase/supabase-js'
import { Provider, loadThemePromise } from 'app/provider'
import { supabase } from 'app/utils/supabase/client.native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { LogBox, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Sentry from '@sentry/react-native'
import 'app/i18n' // Initialize i18n
import { LanguageProvider } from 'app/contexts/LanguageContext'
import { PostHogProvider } from 'posthog-react-native'
import { EXPO_PUBLIC_POSTHOG_API_KEY, EXPO_PUBLIC_POSTHOG_HOST } from '@env'
import { setupGlobalErrorHandling } from 'app/utils/error-tracking'

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn('Error preventing splash screen auto-hide:', error)
  Sentry.captureException(error)
})

LogBox.ignoreLogs([
  'Cannot update a component',
  'You are setting the style',
  'No route',
  'duplicate ID',
  'Require cycle',
])

function HomeLayout() {
  const [fontLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const [themeLoaded, setThemeLoaded] = useState(false)
  const [sessionLoadAttempted, setSessionLoadAttempted] = useState(false)
  const [initialSession, setInitialSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data) {
          setInitialSession(data.session)
        }
      })
      .catch((error) => {
        console.error('Failed to load session:', error)
        Sentry.captureException(error)
      })
      .finally(() => {
        setSessionLoadAttempted(true)
      })
  }, [])

  // Setup global error handling
  useEffect(() => {
    // This will be set up once PostHog is available
    const setupErrorHandling = () => {
      // We'll set this up in the PostHogProvider context
    }
    setupErrorHandling()
  }, [])

  useEffect(() => {
    loadThemePromise
      .then(() => {
        setThemeLoaded(true)
      })
      .catch((error) => {
        console.error('Failed to load theme:', error)
        Sentry.captureException(error)
        // Still set as loaded to prevent blocking
        setThemeLoaded(true)
      })
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded && sessionLoadAttempted) {
      try {
        await SplashScreen.hideAsync()
      } catch (error) {
        console.warn('Error hiding splash screen:', error)
        Sentry.captureException(error)
      }
    }
  }, [fontLoaded, sessionLoadAttempted])

  if (!themeLoaded || !fontLoaded || !sessionLoadAttempted) {
    return null
  }

  return (
    <PostHogProvider
      apiKey={EXPO_PUBLIC_POSTHOG_API_KEY}
      options={{
        host: EXPO_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // Manual tracking
        capture_pageleave: true,
        capture_performance: true,
        autocapture: false, // Manual tracking
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true,
          maskInputOptions: {
            password: true,
            email: true,
          },
          recordCrossOriginIframes: false,
        },
        person_profiles: 'identified_only',
        sanitize_properties: true,
        capture_console_log: true,
        capture_console_error: true,
        capture_console_warn: true,
        disable_compression: false,
        disable_persistence: false,
        persistence: 'localStorage',
        cross_subdomain_cookie: false,
        secure_cookie: true,
        ip: false, // Don't capture IP for privacy
        property_blacklist: ['$current_url', '$host', '$pathname'],
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Provider initialSession={initialSession}>
            <LanguageProvider>
              <Stack screenOptions={{ headerShown: false, headerBackButtonDisplayMode: 'minimal' }}>
                <Stack.Screen
                  name="(drawer)/(tabs)/index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="module/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: '',
                    presentation: 'card',
                  }}
                />
                <Stack.Screen
                  name="journaling"
                  options={{
                    headerShown: true,
                    headerTitle: 'Journaling',
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="settings/index"
                  options={{
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="settings/notifications"
                  options={{
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="settings/device-info"
                  options={{
                    headerShown: true,
                  }}
                />
              </Stack>
            </LanguageProvider>
          </Provider>
        </View>
      </GestureHandlerRootView>
    </PostHogProvider>
  )
}

// Wrap with Sentry ErrorBoundary to catch React component errors
export default Sentry.wrap(HomeLayout)
