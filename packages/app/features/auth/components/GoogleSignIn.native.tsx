import { Button } from '@my/ui'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'

import { IconGoogle } from './IconGoogle'

export function GoogleSignIn() {
  const supabase = useSupabase()
  const router = useRouter()

  async function signInWithGoogle() {
    try {
      console.log('[GoogleSignIn] Configuring Google Sign-In with:', {
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      })

      GoogleSignin.configure({
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      })

      console.log('[GoogleSignIn] Checking Play Services...')
      await GoogleSignin.hasPlayServices()

      console.log('[GoogleSignIn] Requesting Google Sign-In...')
      const response = await GoogleSignin.signIn()
      console.log('[GoogleSignIn] Got Google response:', {
        hasIdToken: !!response?.data?.idToken,
        user: response?.data?.user,
      })

      const token = response?.data?.idToken

      if (token) {
        console.log('[GoogleSignIn] Signing in with Supabase...')
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token,
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
      } else {
        console.error('[GoogleSignIn] No ID token received from Google')
        throw new Error('No ID token present!')
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
