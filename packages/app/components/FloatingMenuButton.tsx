import { Button, YStack } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Menu } from '@tamagui/lucide-icons'
import { useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCallback, memo } from 'react'

export const FloatingMenuButton = memo(function FloatingMenuButton() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const handlePress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer())
  }, [navigation])

  return (
    <YStack
      position="absolute"
      top={insets.top + 12}
      right={16}
      zIndex={400}
    >
      <Button
        size="$4"
        circular
        icon={Menu}
        backgroundColor="$deepSpace3"
        color="$cosmicViolet"
        borderWidth={2}
        borderColor="$cosmicViolet"
        pressStyle={{
          backgroundColor: '$cosmicViolet',
          color: '$silverMoon',
          scale: 0.95,
        }}
        hoverStyle={{
          backgroundColor: '$deepSpace2',
        }}
        onPress={handlePress}
      />
    </YStack>
  )
})
