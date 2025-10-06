# Release Workflow Guide

Complete guide for building and releasing Mazunte Connect from development to production.

## Table of Contents
- [EAS Build Profiles](#eas-build-profiles)
- [Recommended Workflow](#recommended-workflow)
- [Commands Reference](#commands-reference)
- [GitHub Actions](#github-actions)
- [Distribution Methods](#distribution-methods)

---

## EAS Build Profiles

All profiles are defined in [`apps/expo/eas.json`](../apps/expo/eas.json).

### Development Profiles (Hot Reload)
Create development builds that connect to Metro bundler for instant updates.

| Profile | Distribution | Use Case |
|---------|-------------|----------|
| `development:simulator` | Internal | iOS Simulator testing |
| `development:device` | Internal | Real device testing with hot reload |
| `development` | Internal | Generic development build |

**Features:**
- Hot reload via Metro bundler
- Faster iteration during development
- Can test on real devices

### Staging Profiles (Pre-Production)
Production-like builds for beta testing.

| Profile | Distribution | Use Case |
|---------|-------------|----------|
| `staging` | **Store** | TestFlight beta testing (up to 10k users) |
| `staging:device` | Internal | Ad-hoc internal testing (up to 100 devices) |

**Features:**
- Uses production environment variables
- `autoIncrement: true` - automatically bumps build number
- Goes to App Store Connect for TestFlight distribution

### Production Profile
Public release builds for App Store and Play Store.

| Profile | Distribution | Use Case |
|---------|-------------|----------|
| `production` | Store | Public App Store/Play Store release |

**Features:**
- Production environment variables
- `autoIncrement: true` - automatically bumps build number
- Submitted to App Store/Play Store for review

---

## Recommended Workflow

### 1. Daily Development (Local)

**What:** Test on your physical device with hot reload

```bash
# Start Metro bundler
yarn ios --device
```

**Benefits:**
- ✅ FREE - no EAS build minutes used
- ✅ Instant - no build time (3-5 seconds)
- ✅ Hot reload for fast iteration
- ✅ Perfect for daily development

**Limitation:** Only works on YOUR registered device

---

### 2. Beta Testing (Staging)

**What:** Share with wife, friends, and beta testers via TestFlight

#### Step 1: Build for Staging
```bash
cd apps/expo
eas build --platform ios --profile staging
```

#### Step 2: Submit to TestFlight
```bash
eas submit --platform ios --profile staging --latest
```

**Benefits:**
- ✅ Up to 10,000 beta testers
- ✅ No device registration needed
- ✅ Testers just need TestFlight app
- ✅ Push updates anytime
- ✅ Automatic notifications to testers

**Timing:**
- Build: ~15-20 minutes
- TestFlight availability: ~5-10 minutes after submit
- Total: ~25-30 minutes

**For Testers:**
1. Install TestFlight from App Store
2. Get invited via email/link
3. Download Mazunte Connect from TestFlight

---

### 3. Production Release

**What:** Submit to App Store for public release

#### Step 1: Build for Production
```bash
cd apps/expo
eas build --platform ios --profile production
```

#### Step 2: Submit to App Store
```bash
eas submit --platform ios --profile production --latest
```

#### Step 3: Wait for Review
- Apple reviews app (~1-2 days)
- You get notified via email
- App goes live after approval

**Benefits:**
- ✅ Public App Store listing
- ✅ Available to all iOS users
- ✅ Automatic updates via App Store

---

## Commands Reference

### Build Commands

```bash
# Development builds (hot reload)
eas build --platform ios --profile development:simulator
eas build --platform ios --profile development:device

# Staging builds (beta testing)
eas build --platform ios --profile staging          # For TestFlight
eas build --platform ios --profile staging:device   # For ad-hoc

# Production builds (App Store)
eas build --platform ios --profile production
```

### Submit Commands

```bash
# Submit latest staging build to TestFlight
eas submit --platform ios --profile staging --latest

# Submit latest production build to App Store
eas submit --platform ios --profile production --latest
```

### View Build Status

```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Cancel running build
eas build:cancel [BUILD_ID]
```

### Useful Commands

```bash
# Check EAS account
eas whoami

# View project info
eas project:info

# List environment variables
eas env:list

# View build logs
eas build:view --json
```

---

## GitHub Actions

### Modern Workflow Setup

You have **3 streamlined workflows** for different use cases:

#### 1. **Deploy Staging** ([`deploy-staging.yml`](./workflows/deploy-staging.yml))
**Trigger:** Automatic on push to `main` + Manual dispatch

- ✅ **Auto-deploys** staging builds when you push to `main`
- Builds iOS staging profile
- Auto-submits to TestFlight
- **Your most common workflow** - low friction!

**How to use:**
1. Just push to `main` - workflow runs automatically
2. Beta testers get the update in ~25 minutes
3. Or manually trigger: Actions → "Deploy Staging" → Run workflow

**Options:**
- `skip_submit`: Set to `true` to build without submitting to TestFlight

---

#### 2. **Deploy Production** ([`deploy-production.yml`](./workflows/deploy-production.yml))
**Trigger:** Manual only (safety!)

- ⚠️ **Manual trigger only** - production releases should be intentional
- Builds iOS production profile
- Submits to App Store for review
- Creates git release tag (`v1.0.2`)

**How to use:**
1. Go to GitHub → **Actions** tab
2. Select **"Deploy Production"**
3. Click **"Run workflow"**
4. **Enter version** (e.g., `1.0.2`) for confirmation
5. Wait ~25 minutes for build + submission

**Options:**
- `skip_submit`: Set to `true` to build without submitting to App Store

---

#### 3. **Custom Build** ([`build-custom.yml`](./workflows/build-custom.yml))
**Trigger:** Manual only (flexibility!)

- 🛠️ **Flexible builder** for special cases
- Choose platform: iOS, Android, or both
- Choose profile: development, staging, production, etc.
- Optionally auto-submit after build

**How to use:**
1. Go to GitHub → **Actions** tab
2. Select **"Custom Build"**
3. Click **"Run workflow"**
4. Select:
   - **Platform:** iOS / Android / both
   - **Profile:** development, staging, production, etc.
   - **Auto-submit:** true/false

**Use cases:**
- Android builds
- Development builds for testing
- Internal distribution (`staging:device`)
- Experiments

---

### Required Secrets

All workflows require `EXPO_TOKEN` secret:

1. Generate token: `eas build:configure` or `eas login`
2. Copy the token
3. Go to GitHub → **Settings** → **Secrets and variables** → **Actions**
4. Click **"New repository secret"**
5. Name: `EXPO_TOKEN`
6. Value: paste your token
7. Click **"Add secret"**

**Verify token is set:**
```bash
# Token should be masked in GitHub Actions logs
echo "Token status: ${{ secrets.EXPO_TOKEN != '' && '✅ Set' || '❌ Missing' }}"
```

---

### Cost Management

**Auto-deploy staging** is cost-effective because:
- Only builds when you actually push to `main` (not on every commit)
- Only builds iOS (not Android unless needed)
- Only builds staging (not dev + staging + production)

**Estimated costs:**
- Staging auto-deploy: ~1 build per push to `main` = **manageable**
- Production: Manual only = **rare, intentional**
- Custom builds: Only when needed = **infrequent**

**If costs become an issue:**
Disable auto-deploy by editing [`deploy-staging.yml`](./workflows/deploy-staging.yml):
```yaml
# Comment out the push trigger:
# on:
#   push:
#     branches: [main]
on:
  workflow_dispatch: # Manual only
```

---

## Distribution Methods

### Local Development (`yarn ios --device`)
- **Cost:** FREE
- **Speed:** Instant (3-5 seconds)
- **Distribution:** Your device only
- **Requirements:** Device connected via USB or WiFi
- **Use for:** Daily development

### Internal Distribution (`distribution: "internal"`)
- **Cost:** Uses EAS build minutes
- **Speed:** 15-20 minutes
- **Distribution:** Up to 100 registered devices
- **Method:** Download link or TestFlight (development builds)
- **Use for:** Quick team testing

### Store Distribution (`distribution: "store"`)
- **Cost:** Uses EAS build minutes
- **Speed:** 15-20 minutes (build) + 5-10 minutes (TestFlight) + 1-2 days (App Store review)
- **Distribution:** Unlimited users
- **Method:** TestFlight (beta) or App Store (production)
- **Use for:** Beta testing and public release

---

## Version Management

### Understanding Versions

**Version Number** (`version` in `app.config.js`)
- **Current:** `1.0.2`
- **Format:** Semantic versioning (`MAJOR.MINOR.PATCH`)
- **Visible to:** Users in App Store
- **Managed by:** You (manual)

**Build Number** (`buildNumber` in `app.config.js`)
- **Current:** `7`
- **Format:** Integer (increments automatically)
- **Visible to:** Only in App Store Connect (internal)
- **Managed by:** EAS automatically via `autoIncrement: true`

### When to Bump Version

**For staging builds:** ❌ **Don't bump version!**
- EAS automatically increments build number
- Example: `1.0.2 (7)` → `1.0.2 (8)` → `1.0.2 (9)`

**For production releases:** ✅ **Bump version!**
- New features: `1.0.2` → `1.1.0`
- Bug fixes: `1.0.2` → `1.0.3`
- Major updates: `1.0.2` → `2.0.0`

### How to Bump Version (Production Only)

```bash
# 1. Edit app.config.js
nano apps/expo/app.config.js

# 2. Change version
version: '1.0.2' → '1.1.0'

# 3. Commit
git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.1.0"
git push

# 4. Deploy production (GitHub Actions or locally)
# GitHub Actions will automatically create git tag (v1.1.0)
```

**Key point:** EAS handles `buildNumber` automatically. You never need to change it manually!

📖 **Full guide:** [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md)

---

## Common Scenarios

### "I want to test on my device"
```bash
yarn ios --device
```

### "I want my wife to test the app"
```bash
cd apps/expo
eas build --platform ios --profile staging
eas submit --platform ios --profile staging --latest
# Then invite her as TestFlight beta tester
```

### "I want to release to the public"
```bash
cd apps/expo
eas build --platform ios --profile production
eas submit --platform ios --profile production --latest
# Then submit for review in App Store Connect
```

### "I want to test without building locally"
```bash
cd apps/expo
eas build --platform ios --profile staging:device
# Get download link immediately
```

---

## Quick Reference

| Goal | Command | Time | Cost |
|------|---------|------|------|
| Daily dev | `yarn ios --device` | 5 sec | FREE |
| Beta test | `eas build -p ios --profile staging` + submit | 25 min | EAS minutes |
| Production | `eas build -p ios --profile production` + submit | 25 min + review | EAS minutes |

---

## Tips

1. **Use local builds for development** - Save EAS build minutes for staging/production
2. **TestFlight for beta testing** - Much easier than managing device registrations
3. **Disable GitHub Actions** - Unless you need CI/CD, manual builds are cheaper
4. **Staging before production** - Always test staging build with real users first
5. **Version bumps** - `autoIncrement: true` handles build numbers automatically

---

## Related Files

- [`apps/expo/eas.json`](../apps/expo/eas.json) - Build profile configurations
- [`apps/expo/app.config.js`](../apps/expo/app.config.js) - App configuration
- [`.github/workflows/eas-build.yml`](./workflows/eas-build.yml) - GitHub Actions workflow

---

## Support

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [TestFlight Setup](https://developer.apple.com/testflight/)
