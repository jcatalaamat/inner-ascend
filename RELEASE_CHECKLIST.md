# 🚀 Release Checklist

## Pre-Release Checklist

### 📱 Version Updates
- [ ] Update `apps/expo/app.config.js`:
  - [ ] Bump `version` (e.g., 1.0.0 → 1.0.1)
  - [ ] Increment iOS `buildNumber`
  - [ ] Increment Android `versionCode`
- [ ] Update `packages/app/package.json`:
  - [ ] Bump `version` to match app.config.js
  - [ ] Update `name` to "Mazunte Connect"

### 🧪 Testing
- [ ] Test all feature flags work correctly
- [ ] Test iOS build: `cd apps/expo && eas build --platform ios --profile development`
- [ ] Test Android build: `cd apps/expo && eas build --platform android --profile development`
- [ ] Test staging builds: `eas build --platform ios --profile staging`
- [ ] Test production builds: `eas build --platform ios --profile production`

### 🔧 Feature Flags (PostHog)
- [ ] Verify `disable-create-button` is configured correctly
- [ ] Verify `disable-map-tab` is configured correctly  
- [ ] Verify `disable-drawer-menu` is configured correctly
- [ ] Test feature flags with your distinct ID: `bbbedf2e-2aa8-5f4d-9e20-54ba43f5f9f8`

### 📝 Documentation
- [ ] Update CHANGELOG.md with new features
- [ ] Update README.md if needed
- [ ] Check all translation keys are complete (en.json, es.json)

### 🗄️ Database
- [ ] Run any pending migrations: `supabase db push`
- [ ] Verify seed data is up to date
- [ ] Test all database queries work

### 🚀 Deployment
- [ ] Commit and push all changes
- [ ] Trigger builds for all platforms and profiles
- [ ] Monitor build status in EAS dashboard
- [ ] Test builds on physical devices

## Post-Release Checklist

### 📊 Monitoring
- [ ] Check PostHog analytics are working
- [ ] Monitor crash reports in Sentry
- [ ] Verify feature flags are working for all user groups
- [ ] Check app store submission status

### 🔄 Rollback Plan
- [ ] Know how to disable feature flags if issues arise
- [ ] Have previous version ready for rollback if needed
- [ ] Monitor user feedback and crash reports

## 🎯 Feature Flag Management

### Current Feature Flags
- **`disable-create-button`**: Controls + button in header
- **`disable-map-tab`**: Controls map tab in bottom navigation
- **`disable-drawer-menu`**: Controls burger menu in header

### Feature Flag Setup
Each flag should have:
- **Set 1**: `distinct_id` doesn't equal your ID → `100%` rollout (hide from others)
- **Set 2**: `distinct_id` equals your ID → `0%` rollout (show for you)

## 📱 Build Commands

### Development Builds
```bash
cd apps/expo
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Staging Builds
```bash
cd apps/expo
eas build --platform ios --profile staging
eas build --platform android --profile staging
```

### Production Builds
```bash
cd apps/expo
eas build --platform ios --profile production
eas build --platform android --profile production
```

### All Builds at Once
```bash
cd apps/expo
eas build --platform ios --profile development --non-interactive &
eas build --platform android --profile development --non-interactive &
eas build --platform ios --profile staging --non-interactive &
eas build --platform android --profile staging --non-interactive &
eas build --platform ios --profile production --non-interactive &
eas build --platform android --profile production --non-interactive &
```

## 🐛 Troubleshooting

### Build Issues
- **Apple Account Required**: Use `--local` flag or log in to Apple account
- **Bundle Identifier Issues**: Check `app.config.js` has correct bundleIdentifier
- **Package Issues**: Check `app.config.js` has correct package name

### Feature Flag Issues
- **Flags Not Working**: Check PostHog configuration and user distinct ID
- **Wrong User Group**: Verify distinct ID in PostHog matches your device

### Database Issues
- **Migration Errors**: Run `supabase db push` to apply migrations
- **Seed Data Missing**: Check `supabase/seed.sql` and run seed commands
