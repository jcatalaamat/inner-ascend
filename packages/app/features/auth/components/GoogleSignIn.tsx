import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'

import { AuthButton } from './AuthButton'
import { IconGoogle } from './IconGoogle'

export function GoogleSignIn() {
  const router = useRouter()
  const supabase = useSupabase()

  const handleOAuthSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_URL,
      },
    })
    if (error) {
      console.error('Google OAuth error:', error)
      return
    }
    router.replace('/')
  }

  return (
    <AuthButton
      onPress={() => handleOAuthSignIn()}
      icon={IconGoogle}
      scaleIcon={0.85}
      iconAfter={null}
    >
      Continue with Google
    </AuthButton>
  )
}
