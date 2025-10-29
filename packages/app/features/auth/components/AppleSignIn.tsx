import { Apple } from '@tamagui/lucide-icons'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'

import { AuthButton } from './AuthButton'

export function AppleSignIn() {
  const router = useRouter()
  const supabase = useSupabase()
  const handleOAuthSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        // your options
      },
    })
    if (error) {
      // handle error
      return
    }
    router.replace('/')
  }

  return (
    <AuthButton
      onPress={() => handleOAuthSignIn()}
      icon={Apple}
      scaleIcon={0.85}
      iconAfter={null}
    >
      Continue with Apple
    </AuthButton>
  )
}
