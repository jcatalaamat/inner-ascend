# OAuth Testing Checklist

Use this checklist to verify your OAuth implementation is working correctly.

## Pre-Testing Setup

### 1. Environment Variables Configured ✓

- [ ] `.env` file exists (copied from `.env.example`)
- [ ] `GOOGLE_IOS_CLIENT_ID` is set with your actual iOS Client ID
- [ ] `GOOGLE_IOS_SCHEME` is set (reversed iOS Client ID)
- [ ] `GOOGLE_WEB_CLIENT_ID` is set with your actual Web Client ID
- [ ] `GOOGLE_SECRET` is set with your actual Client Secret
- [ ] All IDs follow correct format (`.apps.googleusercontent.com`)

### 2. Google Cloud Console Setup ✓

- [ ] OAuth consent screen configured
- [ ] iOS OAuth Client ID created with bundle ID: `com.innerascend.app`
- [ ] Web OAuth Client ID created
- [ ] Redirect URIs added to Web Client ID
- [ ] Google+ API enabled

### 3. Supabase Dashboard Setup ✓

- [ ] Google provider enabled in Authentication > Providers
- [ ] `GOOGLE_WEB_CLIENT_ID` entered as "Client ID"
- [ ] `GOOGLE_SECRET` entered as "Client Secret"
- [ ] "Skip nonce check" enabled
- [ ] `GOOGLE_IOS_CLIENT_ID` added to "Authorized Client IDs"
- [ ] Redirect URLs configured in URL Configuration

### 4. Local Configuration ✓

- [ ] `supabase/config.toml` has `enabled = true` for Google
- [ ] `app.config.js` has `GOOGLE_IOS_SCHEME` from environment
- [ ] Run `npx expo prebuild --clean` after config changes
- [ ] Supabase local instance running: `npx supabase start`

---

## iOS Testing

### Google Sign-In on iOS Simulator

- [ ] Start app: `npx expo run:ios`
- [ ] Navigate to Sign-In screen
- [ ] "Continue with Google" button is visible
- [ ] Tap button - Google sign-in sheet appears (native UI)
- [ ] Select Google account
- [ ] Consent screen appears (first time only)
- [ ] Sign-in completes without errors
- [ ] App navigates to main screen/authenticated state
- [ ] User session persists after app restart
- [ ] Verify user in Supabase Dashboard > Authentication > Users
- [ ] Provider shows as "google"

**Common Issues:**
- ❌ "Developer Error" → Bundle ID mismatch
- ❌ "Error 10" → URL scheme not configured
- ❌ "Invalid audience" → iOS Client ID not whitelisted in Supabase

### Apple Sign-In on iOS Simulator

**Prerequisites:**
- [ ] iOS Simulator signed into Apple ID (Settings > Sign in)
- [ ] Or testing on physical iOS device

**Test Flow:**
- [ ] "Continue with Apple" button is visible (iOS only)
- [ ] Tap button - Apple sign-in sheet appears (native UI)
- [ ] Face ID/Touch ID prompt appears
- [ ] Authenticate with Face ID/Touch ID or password
- [ ] Name/email sharing options appear (first time only)
- [ ] Sign-in completes without errors
- [ ] App navigates to main screen/authenticated state
- [ ] User session persists after app restart
- [ ] Verify user in Supabase Dashboard > Authentication > Users
- [ ] Provider shows as "apple"

**Common Issues:**
- ❌ Button not appearing → Platform check (iOS only)
- ❌ "Not available" → Simulator not signed into Apple ID
- ❌ "Sign in failed" → Provisioning profile missing capability

### Google Sign-In on iOS Device

- [ ] Build for device or TestFlight
- [ ] Same flow as simulator
- [ ] Test with multiple Google accounts
- [ ] Test account switching

---

## Android Testing (When Ready)

### Google Sign-In on Android

**Prerequisites:**
- [ ] SHA-1 certificate fingerprint generated
- [ ] Android OAuth Client ID created in Google Cloud Console
- [ ] SHA-1 added to Android client in Google Cloud Console

**Test Flow:**
- [ ] Start app: `npx expo run:android`
- [ ] Navigate to Sign-In screen
- [ ] "Continue with Google" button visible
- [ ] Tap button - Google account picker appears
- [ ] Select account
- [ ] Sign-in completes
- [ ] Session persists

**Note:** Apple Sign-In is iOS-only

---

## Error Handling Tests

### User Cancellation

- [ ] Tap "Continue with Google"
- [ ] Dismiss/cancel the Google sign-in sheet
- [ ] App handles gracefully (no crash)
- [ ] Error message shown to user (optional)
- [ ] Can retry sign-in

### Network Errors

- [ ] Enable airplane mode
- [ ] Attempt sign-in
- [ ] Appropriate error message shown
- [ ] Disable airplane mode
- [ ] Retry works

### Invalid Configuration

- [ ] Temporarily set wrong Client ID in `.env`
- [ ] Run `npx expo prebuild --clean`
- [ ] Attempt sign-in
- [ ] Error handled gracefully
- [ ] Fix configuration
- [ ] Rebuild and verify works

---

## Session Management Tests

### Session Persistence

- [ ] Sign in with Google
- [ ] Close app completely
- [ ] Reopen app
- [ ] User still authenticated (no re-login required)

### Sign Out and Sign In Again

- [ ] Sign in with Google
- [ ] Sign out of app
- [ ] Sign in again with same Google account
- [ ] Works without issues
- [ ] Try different Google account
- [ ] Account switches successfully

### Token Refresh

- [ ] Sign in with Google
- [ ] Wait for token expiry (1 hour by default)
- [ ] App should refresh token automatically
- [ ] User remains authenticated

---

## Production Testing (Before Release)

### Google Cloud Console Production

- [ ] OAuth consent screen status: Published (not Testing)
- [ ] Production redirect URIs added to Web Client ID
- [ ] Remove test users restriction

### Supabase Production

- [ ] Same Google credentials configured in production project
- [ ] Production redirect URLs configured
- [ ] Test with production Supabase URL in `.env`

### App Store Submission (iOS)

- [ ] App ID has Sign in with Apple capability enabled
- [ ] Provisioning profile includes capability
- [ ] App binary signed correctly
- [ ] Test with TestFlight before submission

---

## Monitoring

### After Launch

- [ ] Monitor Supabase Dashboard > Authentication > Users for OAuth sign-ins
- [ ] Check Supabase Dashboard > Logs > Auth Logs for errors
- [ ] Track OAuth success/failure rates with analytics
- [ ] Monitor user feedback for sign-in issues

---

## Troubleshooting Quick Reference

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "Developer Error" | Bundle ID mismatch | Verify bundle ID matches Google Cloud Console |
| "Error 10" | URL scheme issue | Check `GOOGLE_IOS_SCHEME` and rebuild |
| "Invalid audience" | Client ID not whitelisted | Add iOS Client ID to Supabase authorized list |
| "Sign in cancelled" | User cancelled | Normal behavior, not an error |
| Button not showing | Platform issue (Apple) | Apple Sign-In is iOS-only |
| "Not available" | Apple ID issue | Sign into Apple ID in simulator |
| Redirect loop | Wrong redirect URI | Check Supabase redirect URL configuration |
| "Invalid login" | Provider disabled | Enable Google in Supabase Dashboard |

---

## Success Criteria

Your OAuth implementation is working correctly when:

✅ Users can sign in with Google on iOS without errors
✅ Users can sign in with Apple on iOS without errors
✅ Sessions persist across app restarts
✅ Users appear in Supabase Dashboard with correct provider
✅ Error cases are handled gracefully
✅ Sign-out and re-sign-in works smoothly
✅ Multiple accounts can be used

---

## Notes

- Test on both simulator and physical device
- Test with multiple Google accounts
- Test with personal and work Google accounts
- Monitor Supabase logs for detailed error information
- Keep Google Cloud Console and Supabase Dashboard open during testing

---

## Quick Start Command Sequence

```bash
# 1. Update environment
cp .env.example .env
# Edit .env with your credentials

# 2. Enable Google in Supabase config
# Already done in supabase/config.toml

# 3. Rebuild native projects
npx expo prebuild --clean --skip-dependency-update react-native,react

# 4. Start local Supabase (for local testing)
npx supabase start

# 5. Run on iOS
npx expo run:ios

# 6. Test OAuth flow
# Tap "Continue with Google" button
```

---

**Ready to test? Start with the iOS Google Sign-In flow first!**
