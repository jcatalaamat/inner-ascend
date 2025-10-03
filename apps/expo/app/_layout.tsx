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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Provider initialSession={initialSession}>
          <Stack screenOptions={{ headerShown: false, headerBackButtonDisplayMode: 'minimal' }}>
            <Stack.Screen
              name="(drawer)/(tabs)/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings/index"
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="event/[id]"
              options={{
                headerShown: true,
                headerTitle: '',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="place/[id]"
              options={{
                headerShown: true,
                headerTitle: '',
                presentation: 'card',
              }}
            />
          </Stack>
        </Provider>
      </View>
    </GestureHandlerRootView>
  )
}

// Wrap with Sentry ErrorBoundary to catch React component errors
export default Sentry.wrap(HomeLayout)
