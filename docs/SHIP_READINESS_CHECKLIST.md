# Inner Ascend - Ship Readiness Checklist

## Overview
This document provides a comprehensive checklist and prompt for Claude Code to verify that Inner Ascend is ready for production deployment and App Store submission.

---

## Quick Prompt for Claude Code

```
Please perform a comprehensive ship-readiness audit for the Inner Ascend app.

Review the following critical areas and provide a detailed report with:
1. Issues found (with severity: Critical/High/Medium/Low)
2. Specific file locations and line numbers for each issue
3. Recommended fixes with code examples
4. Estimated time to fix each issue

Areas to audit:

## 1. Core Functionality
- Verify all 5 tabs work correctly: TODAY, JOURNEY, COMMUNITY, PRACTICES, PROGRESS
- Test all navigation flows and screen transitions
- Verify data fetching and React Query hooks work properly
- Check authentication flows (sign in, sign up, sign out, Apple/Google)
- Test CRUD operations for all features (journal entries, RSVPs, progress tracking)

## 2. Database & Backend
- Review all Supabase migrations for correctness
- Verify RLS policies are secure and working
- Check all database queries for performance and security
- Verify proper indexes exist for frequently queried tables
- Test edge cases (empty states, null values, missing data)

## 3. UI/UX Polish
- Check for any layout issues or broken screens
- Verify all loading states show spinners properly
- Confirm all empty states have helpful messages
- Check error states and error messages are user-friendly
- Verify all buttons and interactions have proper feedback
- Test on different screen sizes (iPhone SE, Pro, Pro Max, iPad)
- Verify safe area insets are handled correctly
- Check for any text overflow or truncation issues

## 4. TypeScript & Code Quality
- Run full TypeScript check and report all errors
- Check for any "any" types that should be properly typed
- Verify no unused imports or variables
- Check for console.logs that should be removed
- Look for TODO/FIXME comments that need addressing
- Verify proper error handling in all async functions

## 5. Performance
- Check for unnecessary re-renders
- Verify images are optimized
- Check bundle size isn't excessive
- Look for memory leaks or performance bottlenecks
- Verify proper use of React.memo and useMemo where needed

## 6. App Store Requirements
- Verify app.json has correct version and build numbers
- Check all required app icons and splash screens exist
- Verify bundle identifiers are correct (com.innerascend.ios)
- Check privacy policy and terms of service are accessible
- Verify all required permissions have proper descriptions
- Check app metadata in fastlane folder is complete and accurate

## 7. Analytics & Monitoring (if applicable)
- Verify analytics tracking is working
- Check error reporting is set up
- Verify no sensitive data is being logged

## 8. Content & Copy
- Check all text for typos and grammatical errors
- Verify translations are complete (if multilingual)
- Check that app description and marketing copy make sense
- Verify all placeholder content has been replaced with real content

## 9. Security
- Check no API keys or secrets are hardcoded
- Verify environment variables are properly used
- Check authentication tokens are stored securely
- Verify no sensitive user data is exposed

## 10. Testing
- List any critical user flows that need manual testing
- Identify areas that might break easily
- Suggest any automated tests that should be added

Please provide the audit in this format:

### Critical Issues (Must fix before ship)
- [ ] Issue description (file:line) - Est: X hours

### High Priority (Should fix before ship)
- [ ] Issue description (file:line) - Est: X hours

### Medium Priority (Nice to have)
- [ ] Issue description (file:line) - Est: X hours

### Low Priority (Post-launch)
- [ ] Issue description (file:line) - Est: X hours

### Summary
- Total critical issues: X
- Total estimated time to ship-ready: X hours
- Recommended ship date: [date after fixes]
```

---

## Manual Testing Checklist

### Authentication Flows
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Apple
- [ ] Sign in with Google (if implemented)
- [ ] Sign out
- [ ] Password reset flow
- [ ] Email verification
- [ ] Handle already-signed-in state

### TODAY Tab
- [ ] Emotional check-in displays correctly
- [ ] Can submit emotional check-in
- [ ] Streak counter displays correctly
- [ ] Daily quote shows properly
- [ ] Quick actions work
- [ ] Empty state shows when no check-in

### JOURNEY Tab
- [ ] All 16 modules display
- [ ] Module states show correctly (locked, unlocked, active, completed)
- [ ] Can tap unlocked module to view details
- [ ] Module detail screen loads content
- [ ] Progress tracking updates correctly
- [ ] Can't access locked modules

### COMMUNITY Tab
- [ ] Upcoming sessions display correctly
- [ ] Past sessions display correctly
- [ ] Can switch between tabs
- [ ] RSVP buttons work (I'm Coming / Maybe)
- [ ] Join Call button opens meeting URL
- [ ] Empty states show when no sessions
- [ ] Session cards show all info (date, time, facilitator, description)
- [ ] Visual feedback for RSVP status

### PRACTICES Tab
- [ ] Tab switcher works (Meditations, Prompts, Exercises)
- [ ] All meditations display with correct info
- [ ] Journaling prompts are organized by theme
- [ ] Can expand/collapse prompt themes
- [ ] Exercises display correctly
- [ ] "Open Journal" button works
- [ ] Empty states show appropriately

### PROGRESS Tab
- [ ] Streak counter displays correctly
- [ ] Progress charts/visualizations work
- [ ] Historical data displays correctly
- [ ] Empty state shows for new users

### Journaling
- [ ] Can open journal modal
- [ ] Can write and save journal entries
- [ ] Journal history shows all entries
- [ ] Can edit existing entries
- [ ] Can delete entries
- [ ] Character count works
- [ ] Prompts pre-populate when selected

### Navigation & UI
- [ ] All tabs are accessible
- [ ] Back navigation works consistently
- [ ] Drawer menu opens (if applicable)
- [ ] Modals open and close properly
- [ ] Keyboard handling is correct
- [ ] Safe areas respected on all screens
- [ ] Loading spinners show during data fetch
- [ ] Pull-to-refresh works where implemented

### Error Handling
- [ ] Network errors show helpful messages
- [ ] Invalid data is handled gracefully
- [ ] Failed API calls don't crash the app
- [ ] 404/not found states are handled
- [ ] Permission denied errors are clear

### Performance
- [ ] App launches quickly (< 3 seconds)
- [ ] Screens load smoothly
- [ ] No janky animations
- [ ] Scrolling is smooth
- [ ] No memory leaks after extended use

### Offline Behavior
- [ ] App handles no internet connection
- [ ] Cached data displays when offline
- [ ] Helpful offline messages shown
- [ ] App recovers when connection restored

### Different Device Sizes
- [ ] iPhone SE (small screen)
- [ ] iPhone 15/16 (standard)
- [ ] iPhone 15/16 Pro Max (large)
- [ ] iPad (if supported)

### Edge Cases
- [ ] New user with no data
- [ ] User with maximum data
- [ ] Long text entries
- [ ] Special characters in inputs
- [ ] Rapid button tapping
- [ ] App backgrounding/foregrounding

---

## Pre-Submission Checklist

### App Store Connect
- [ ] App created in App Store Connect
- [ ] Bundle ID matches (com.innerascend.ios)
- [ ] App icons uploaded (all required sizes)
- [ ] Screenshots prepared (all required sizes)
- [ ] App name: "Inner Ascend"
- [ ] Subtitle written
- [ ] Description written (compelling, clear, keyword-optimized)
- [ ] Keywords selected
- [ ] Privacy policy URL set
- [ ] Terms of service URL set
- [ ] Support URL set
- [ ] Marketing URL set (optional)
- [ ] Age rating completed
- [ ] App category selected (Health & Fitness or Lifestyle)

### Build Preparation
- [ ] Version number updated (1.0.0)
- [ ] Build number updated (incrementing)
- [ ] Release notes written
- [ ] All environment variables set correctly
- [ ] Production API endpoints configured
- [ ] Analytics/monitoring enabled
- [ ] Crash reporting enabled

### Legal & Compliance
- [ ] Privacy policy complete and accessible
- [ ] Terms of service complete and accessible
- [ ] GDPR compliance (if applicable)
- [ ] Data collection clearly stated
- [ ] User data deletion flow implemented
- [ ] Age restrictions set appropriately

### Marketing Assets
- [ ] App icon (1024x1024)
- [ ] Screenshots (iPhone 6.7", 6.5", 5.5")
- [ ] Optional: iPad screenshots
- [ ] Optional: App preview video
- [ ] Promotional text written
- [ ] What's New text written

### Technical
- [ ] No hardcoded credentials
- [ ] Environment variables properly configured
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics configured
- [ ] Push notification certificates (if applicable)
- [ ] All third-party services configured
- [ ] Rate limiting considered
- [ ] Backup strategy for user data

### Testing
- [ ] App tested on real devices (not just simulator)
- [ ] TestFlight beta tested by internal team
- [ ] External beta testing completed (optional but recommended)
- [ ] All critical bugs fixed
- [ ] No crashes in current build

---

## Common Issues to Check

### TypeScript Errors
```bash
# Run this to check for TS errors
npx tsc --noEmit -p apps/expo/tsconfig.json
npx tsc --noEmit -p packages/app/tsconfig.json
```

### Linting
```bash
# Run linter
yarn lint
```

### Build Test
```bash
# Test production build
yarn build
```

### EAS Build
```bash
# Check EAS build status
eas build:list

# Create production build
eas build --platform ios --profile production
```

---

## Post-Ship Monitoring

After shipping, monitor:
- [ ] Crash rates (should be < 1%)
- [ ] User feedback and reviews
- [ ] Analytics for user engagement
- [ ] Server/database performance
- [ ] API error rates
- [ ] User retention (Day 1, Day 7, Day 30)

---

## Estimated Timeline

Based on typical app development:

- **Critical fixes**: 0-8 hours (depending on findings)
- **High priority fixes**: 2-6 hours
- **App Store setup**: 2-4 hours
- **Testing & QA**: 4-8 hours
- **TestFlight beta**: 3-7 days
- **App Store review**: 1-3 days

**Total estimated time to ship**: 1-2 weeks from current state

---

## Contact & Support

If issues arise during audit or ship process:
- Check Inner Ascend docs in `/docs` folder
- Review Supabase dashboard for database issues
- Check EAS build logs for build failures
- Review App Store Connect for submission issues

---

## Quick Commands Reference

```bash
# Start local Supabase
npx supabase start

# Generate types after DB changes
yarn supa generate

# Run iOS app
yarn ios

# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Check build status
eas build:list

# View logs
eas build:view [build-id]
```

---

## Success Criteria

Your app is ready to ship when:
- ✅ No critical or high-priority bugs
- ✅ All core user flows work smoothly
- ✅ TypeScript compiles with no errors
- ✅ App Store metadata is complete
- ✅ Privacy policy and terms are accessible
- ✅ App has been tested on real devices
- ✅ TestFlight beta testing completed (recommended)
- ✅ Analytics and monitoring are configured
- ✅ You feel confident launching it!

---

**Remember**: Done is better than perfect. You can always ship updates after launch. Focus on making sure the core experience works well and there are no critical bugs.

Good luck with your launch! 🚀🌙✨
