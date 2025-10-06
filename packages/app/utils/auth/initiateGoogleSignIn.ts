import { GoogleSignin } from '@react-native-google-signin/google-signin'

/**
 * Initiates the auth flow for the native Google Sign In.
 * Returns the token that will be passed to Supabase to complete the sign in.
 *
 * Note: Nonce validation is disabled in Supabase Dashboard ("Skip nonce check")
 * because iOS Google Sign-In SDK doesn't support Supabase's nonce format.
 */
export async function initiateGoogleSignIn() {
  console.log('[initiateGoogleSignIn] Configuring Google Sign-In...')
  GoogleSignin.configure({
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  })

  console.log('[initiateGoogleSignIn] Checking Play Services...')
  await GoogleSignin.hasPlayServices()

  console.log('[initiateGoogleSignIn] Requesting Google Sign-In...')
  const response = await GoogleSignin.signIn()

  console.log('[initiateGoogleSignIn] Received credential:', {
    hasToken: !!response?.data?.idToken,
    user: response?.data?.user,
  })

  const token = response?.data?.idToken
  if (!token) {
    console.error('[initiateGoogleSignIn] No identity token received from Google')
    throw new Error('Google Sign In failed: No identity token received')
  }

  console.log('[initiateGoogleSignIn] Successfully got ID token')
  return { token }
}
