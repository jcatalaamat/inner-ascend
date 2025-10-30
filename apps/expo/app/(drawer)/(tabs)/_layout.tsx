import { useTheme, Button } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { BookOpen, CircleDot, Home, Menu, User } from '@tamagui/lucide-icons'
import { Stack, Tabs, useNavigation, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout() {
  const { accentColor } = useTheme()
  const navigation = useNavigation()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Inner Ascend',
          headerShown: false,
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
            >
              <Menu size={24} />
            </Button>
          ),
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
          options={{
            headerShown: false,
            title: 'Today',
            tabBarIcon: ({ focused }) => (
              <Home color={focused ? '$cosmicViolet' : '$silverMoon2'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="journey"
          options={{
            headerShown: false,
            title: 'Journey',
            tabBarIcon: ({ focused }) => (
              <BookOpen color={focused ? '$cosmicViolet' : '$silverMoon2'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="practices"
          options={{
            headerShown: false,
            title: 'Practices',
            tabBarIcon: ({ focused }) => (
              <CircleDot color={focused ? '$cosmicViolet' : '$silverMoon2'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            headerShown: false,
            title: 'Me',
            tabBarIcon: ({ focused }) => (
              <User color={focused ? '$cosmicViolet' : '$silverMoon2'} size={22} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  )
}
