import { YStack } from '@my/ui'

import { AppleSignIn } from './AppleSignIn'
import { GoogleSignIn } from './GoogleSignIn'

/**
 * Social login buttons (Apple + Google)
 * Designed to be the primary auth method
 */
export function SocialLogin() {
  return (
    <YStack gap="$3" w="100%">
      <AppleSignIn />
      <GoogleSignIn />
    </YStack>
  )
}
