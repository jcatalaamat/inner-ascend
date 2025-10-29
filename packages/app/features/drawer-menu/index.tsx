import { Avatar, Paragraph, Settings, XStack, YStack, getTokens } from '@my/ui'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Cog } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from 'app/utils/useUser'
import { SolitoImage } from 'solito/image'
import { useLink } from 'solito/link'

export function DrawerMenu(props) {
  const { profile, avatarUrl } = useUser()
  const name = profile?.name
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
              <SolitoImage
                src={avatarUrl}
                alt="your avatar"
                width={getTokens().size['3'].val}
                height={getTokens().size['3'].val}
              />
            </Avatar>
            <Paragraph ta="center" ml="$-1.5">
              {name ?? 'No Name'}
            </Paragraph>
          </XStack>
        </YStack>
      </DrawerContentScrollView>
    </YStack>
  )
}
