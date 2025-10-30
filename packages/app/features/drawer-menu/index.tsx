import { Avatar, Paragraph, Settings, XStack, YStack, getTokens } from '@my/ui'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Cog } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from 'app/utils/useUser'
import { useLink } from 'solito/link'

export function DrawerMenu(props) {
  const { displayName, avatarUrl } = useUser()
  const insets = useSafeAreaInsets()

  return (
    <YStack f={1} bg="$background">
      <DrawerContentScrollView {...props} f={1}>
        <YStack
          maw={600}
          mx="auto"
          w="100%"
          f={1}
          py="$4"
          pb={insets.bottom + 20}
        >
          <Settings>
            <Settings.Items>
              <Settings.Group>
                <Settings.Item {...useLink({ href: '/settings' })} icon={Cog}>
                  Settings
                </Settings.Item>
              </Settings.Group>
            </Settings.Items>
          </Settings>

          <XStack gap="$4" mb="$7" mt="auto" ai="center" px="$4">
            <Avatar circular size="$3">
              <Avatar.Image
                source={{
                  uri: avatarUrl,
                  width: getTokens().size['3'].val,
                  height: getTokens().size['3'].val,
                }}
              />
              <Avatar.Fallback bc="$cosmicViolet" ai="center" jc="center">
                <Paragraph color="$silverMoon" fontWeight="bold">
                  {displayName.charAt(0).toUpperCase()}
                </Paragraph>
              </Avatar.Fallback>
            </Avatar>
            <Paragraph ta="center" ml="$-1.5">
              {displayName}
            </Paragraph>
          </XStack>
        </YStack>
      </DrawerContentScrollView>
    </YStack>
  )
}
