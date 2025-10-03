import { useTheme, Button } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Calendar, Heart, Map, MapPin, Menu, Plus, User } from '@tamagui/lucide-icons'
import { router, Stack, Tabs, useNavigation, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { usePostHog, useFeatureFlag } from 'posthog-react-native'
import { useEffect, useState } from 'react'

// Check if running in development mode (supports dev/staging/production)
const isDev = process.env.NODE_ENV === 'development'

export default function Layout() {
  const { accentColor } = useTheme()
  const navigation = useNavigation()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const posthog = usePostHog()

  // Use PostHog hooks for feature flags
  const disableCreateButton = useFeatureFlag('disable-create-button')
  const disableMapTab = useFeatureFlag('disable-map-tab')
  const disableDrawerMenu = useFeatureFlag('disable-drawer-menu')

  // Show features when flag is undefined (loading) or false (disabled)
  const showCreateButton = !disableCreateButton
  const showMapTab = !disableMapTab
  const showDrawerMenu = !disableDrawerMenu

  if (isDev) {
    console.log('pathname', pathname)
    console.log('🚩 Feature Flags:', {
      disableCreateButton,
      disableMapTab,
      disableDrawerMenu,
      showCreateButton,
      showMapTab,
      showDrawerMenu
    })
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: t('app.title'),
          headerShown: pathname === '/' || pathname === '/create',
          headerTintColor: accentColor.val,
          headerLeft: () => (
            <Button
              borderStyle="unset"
              borderWidth={0}
              backgroundColor="transparent"
              marginLeft="$-1"
              paddingHorizontal="$4"
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer())
              }}
              style={{ display: showDrawerMenu ? 'flex' : 'none' }}
            >
              <Menu size={24} />
            </Button>
          ),
          headerRight: showCreateButton ? () => (
            <Button
              borderStyle="unset"
              borderWidth={0}
              marginRight="$-1"
              backgroundColor="transparent"
              onPress={() => {
                posthog?.capture('create_button_tapped', {
                  from_screen: pathname,
                })
                router.navigate('create')
              }}
            >
              <Plus size={24} />
            </Button>
          ) : undefined,
        }}
      />
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          headerTintColor: accentColor.val,
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: insets.bottom + 10,
            height: insets.bottom + 70,
            alignContent: 'center',
            justifyContent: 'center',
          },
          tabBarItemStyle: {
            paddingBottom: 5,
            flex: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          key="index"
          options={{
            headerShown: false,
            title: t('navigation.events'),
            tabBarIcon: ({ size, color, focused }) => (
              <Calendar color={focused ? '$color12' : '$color10'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="places"
          key="places"
          options={{
            headerShown: false,
            title: t('navigation.places'),
            tabBarIcon: ({ size, color, focused }) => (
              <MapPin color={focused ? '$color12' : '$color10'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          key="map"
          options={{
            headerShown: false,
            title: t('navigation.map'),
            tabBarIcon: ({ size, color, focused }) => (
              <Map color={focused ? '$color12' : '$color10'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
            tabBarButton: showMapTab ? undefined : () => null,
          }}
        />
        <Tabs.Screen
          name="favorites"
          key="favorites"
          options={{
            headerShown: false,
            title: t('navigation.favorites'),
            tabBarIcon: ({ size, color, focused }) => (
              <Heart color={focused ? '$color12' : '$color10'} size={22} strokeWidth={focused ? 2.5 : 2} fill={focused ? '$color12' : 'transparent'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          key="profile"
          options={{
            headerShown: false,
            title: t('navigation.profile'),
            tabBarIcon: ({ size, color, focused }) => (
              <User color={focused ? '$color12' : '$color10'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
