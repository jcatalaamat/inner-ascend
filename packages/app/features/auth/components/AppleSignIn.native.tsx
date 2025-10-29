import { initiateAppleSignIn } from 'app/utils/auth/initiateAppleSignIn'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Apple } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { useRouter } from 'solito/router'

import { AuthButton } from './AuthButton'

export function AppleSignIn() {
  const supabase = useSupabase()
  const router = useRouter()
  async function signInWithApple() {
    try {
      console.log('[AppleSignIn] Starting Apple Sign-In flow...')
      const { token, nonce } = await initiateAppleSignIn()
      console.log('[AppleSignIn] Got Apple credentials, signing in with Supabase...')

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token,
        nonce,
      })

      console.log('[AppleSignIn] Supabase response:', { data, error })

      if (error) {
        console.error('[AppleSignIn] Supabase auth error:', error)
        throw error
      }

      if (data?.session) {
        console.log('[AppleSignIn] Sign-in successful, redirecting...')
        router.replace('/')
      }
    } catch (e) {
      if (e instanceof Error && 'code' in e) {
        if (e.code === 'ERR_REQUEST_CANCELED') {
          console.log('[AppleSignIn] User canceled the sign-in flow')
        } else {
          console.error('[AppleSignIn] Error with code:', e.code, e)
        }
      } else {
        console.error('[AppleSignIn] Unexpected error:', e)
      }
    }
  }

  if (Platform.OS !== 'ios') {
    // no Apple sign-in for non-iOS native devices
    return null
  }

  return (
    <AuthButton
      onPress={signInWithApple}
      icon={Apple}
      scaleIcon={0.85}
      iconAfter={null}
    >
      Continue with Apple
    </AuthButton>
  )
}
