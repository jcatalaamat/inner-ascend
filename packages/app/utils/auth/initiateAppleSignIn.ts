import { AppleAuthenticationScope, signInAsync } from 'expo-apple-authentication'
import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from 'expo-crypto'

/**
 * Initiates the auth flow for the native Apple Sign In.
 * Returns the token and nonce that will later be passed
 * to Supabase to complete the sign in.
 */
export async function initiateAppleSignIn() {
  console.log('[initiateAppleSignIn] Generating nonce...')
  const rawNonce = randomUUID()
  const hashedNonce = await digestStringAsync(CryptoDigestAlgorithm.SHA256, rawNonce)

  console.log('[initiateAppleSignIn] Requesting Apple credentials...')
  const credential = await signInAsync({
    requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
    nonce: hashedNonce,
  })

  console.log('[initiateAppleSignIn] Received credential:', {
    hasToken: !!credential.identityToken,
    user: credential.user,
  })

  const token = credential.identityToken
  if (!token) {
    console.error('[initiateAppleSignIn] No identity token received from Apple')
    throw new Error('Apple Sign In failed: No identity token received')
  }

  return { token, nonce: rawNonce }
}
