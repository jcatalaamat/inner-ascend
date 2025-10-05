import { initiateAppleSignIn } from 'app/utils/auth/initiateAppleSignIn'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'
import { useRouter } from 'solito/router'

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
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: '100%', height: 44 }}
      onPress={signInWithApple}
    />
  )
}
