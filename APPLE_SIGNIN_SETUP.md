# Apple Sign-In Setup for Inner Ascend

## Current Status

✅ **App Configuration**: Your iOS app is already configured with Apple Sign-In
- Bundle ID: `com.innerascend.app`
- Team ID: `3R96Y2JNG8`
- Apple Sign-In capability enabled in entitlements
- Using native `expo-apple-authentication` (not OAuth)

✅ **Implementation**: Your code is correct
- Using `signInWithIdToken()` method
- Properly generating and passing nonce
- See [AppleSignIn.native.tsx](packages/app/features/auth/components/AppleSignIn.native.tsx)

## IMPORTANT: Native iOS Setup

For **native iOS** Apple Sign-In using `expo-apple-authentication`, you **DON'T need to configure OAuth settings** in the Supabase dashboard. The JWT secret and Services ID configuration is **only required for web-based OAuth flows**.

Your app uses Apple's native Authentication Services framework, which works differently:
1. User authenticates with Apple directly on the device
2. Apple returns an identity token
3. Your app passes this token to Supabase
4. Supabase validates the token with Apple and creates/logs in the user

## What's Already Done

✅ **App Configuration**
- Bundle ID is registered: `com.innerascend.app`
- Apple Sign-In entitlement enabled
- Expo Apple Authentication library installed

✅ **Code Implementation**
- Native sign-in flow implemented correctly
- Token passed to Supabase via `signInWithIdToken()`

## What You Need to Verify

### 1. Apple Developer Console

Go to: https://developer.apple.com/account/resources/identifiers/list

**Verify your App ID**:
1. Find App ID: `com.innerascend.app`
2. Ensure "Sign In with Apple" capability is **enabled**
3. Click "Sign In with Apple" → "Configure"
4. Set "Primary App ID" to your app
5. Save

**That's it!** You don't need to create a Services ID for native iOS.

## Testing

Once configured, Apple Sign-In should work in your app:

1. Build and run your iOS app
2. Go to the login screen
3. Tap "Continue with Apple"
4. Sign in with your Apple ID
5. You should be redirected back to the app, logged in

## Troubleshooting

If Apple Sign-In doesn't work:

1. **Check Supabase Logs**: Go to your Supabase dashboard → Authentication → Logs
2. **Verify Services ID**: Make sure the Services ID in Apple Developer Console matches exactly: `com.innerascend.app`
3. **Check Bundle ID**: Your app's bundle ID must match the Services ID
4. **Verify Redirect URL**: The redirect URL in Apple Developer Console must be exactly: `https://cavtcmaplbycdoyyprss.supabase.co/auth/v1/callback`
5. **Test in Simulator**: Apple Sign-In might behave differently in simulator vs real device

## Notes

- Your app code is already correctly implemented
- Google Sign-In has been fixed and should work now
- The nonce is properly generated and passed to Supabase
- Your Apple Developer account needs to be in good standing