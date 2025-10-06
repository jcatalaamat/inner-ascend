import { Button } from '@my/ui'
import { statusCodes } from '@react-native-google-signin/google-signin'
import { initiateGoogleSignIn } from 'app/utils/auth/initiateGoogleSignIn'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'

import { IconGoogle } from './IconGoogle'

export function GoogleSignIn() {
  const supabase = useSupabase()
  const router = useRouter()

  async function signInWithGoogle() {
    try {
      console.log('[GoogleSignIn] Starting Google Sign-In flow...')
      const { token } = await initiateGoogleSignIn()
      console.log('[GoogleSignIn] Got Google credentials, signing in with Supabase...')

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token,
        // No nonce - using "Skip nonce check" in Supabase Dashboard
      })

      console.log('[GoogleSignIn] Supabase response:', { data, error })

      if (error) {
        console.error('[GoogleSignIn] Supabase auth error:', error)
        throw error
      }

      if (data?.session) {
        console.log('[GoogleSignIn] Sign-in successful, redirecting...')
        router.replace('/')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('[GoogleSignIn] User cancelled the login flow')
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('[GoogleSignIn] Sign-in already in progress')
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.error('[GoogleSignIn] Play Services not available')
        } else {
          console.error('[GoogleSignIn] Error with code:', error.code, error)
        }
      } else {
        console.error('[GoogleSignIn] Unexpected error:', error)
      }
    }
  }

  return (
    <Button
      onPress={() => signInWithGoogle()}
      icon={IconGoogle}
      // styles to make it look like the native Apple button on AppleSignIn.native.tsx
      scaleIcon={0.75}
      space="$1.5"
      bg="transparent"
      pressStyle={{ bg: 'transparent', o: 0.6, bw: '$0' }}
      animation="200ms"
      chromeless
    >
      Sign in with Google
    </Button>
  )
}
