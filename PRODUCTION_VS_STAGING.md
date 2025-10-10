# Production vs Staging: Complete Guide

This document clarifies the distinction between **staging** (TestFlight beta testing) and **production** (App Store release) builds in Mazunte Connect.

## Table of Contents
- [Quick Reference](#quick-reference)
- [Key Differences](#key-differences)
- [When to Use What](#when-to-use-what)
- [Version Management](#version-management)
- [Build Profiles](#build-profiles)
- [Common Workflows](#common-workflows)

---

## Quick Reference

### 🎯 Interactive Wizard (Recommended)
**The easiest way to deploy!**

```bash
yarn release
```

This launches an interactive CLI guide that:
- ✅ Shows current version prominently
- ✅ Helps you choose staging vs production
- ✅ Guides through version bumping (patch/minor/major)
- ✅ Deploys to TestFlight or App Store
- ✅ Uploads screenshots and metadata
- ✅ Shows pre-flight checklist

**Perfect for:** First-time deployments, ensuring you don't miss steps

---

### Staging (TestFlight)
**Purpose:** Beta testing before App Store release
**Profile:** `staging` in [eas.json](./apps/expo/eas.json)
**Version:** Same as current version (auto-increment build number only)
**Command:** `yarn deploy:staging` or `yarn release` → Deploy → Staging
**Distribution:** Internal beta testers via TestFlight

### Production (App Store)
**Purpose:** Public release to the App Store
**Profile:** `production` in [eas.json](./apps/expo/eas.json)
**Version:** Must bump version number manually before release
**Command:** `yarn deploy:production` or `yarn release` → Deploy → Production
**Distribution:** Public users via App Store (after Apple review)

---

## Key Differences

| Aspect | Staging (TestFlight) | Production (App Store) |
|--------|---------------------|------------------------|
| **EAS Profile** | `staging` | `production` |
| **Version Bump** | ❌ No (same version) | ✅ Yes (new version required) |
| **Build Number** | Auto-increment | Auto-increment |
| **Distribution** | Internal testers | Public release |
| **Apple Review** | ❌ No | ✅ Yes (1-2 days) |
| **Target Audience** | Beta testers | All users |
| **Rollback** | ✅ Easy | ⚠️ Requires new version |
| **Testing Required** | Optional | ✅ Mandatory |

---

## When to Use What

### Use **Staging** When:
- ✅ Testing new features before public release
- ✅ Getting feedback from beta testers
- ✅ Validating bug fixes
- ✅ Testing with real users (small group)
- ✅ Multiple test iterations (same version, different builds)

### Use **Production** When:
- ✅ Ready to release to all users
- ✅ Staging testing is complete and approved
- ✅ All bugs are fixed
- ✅ Version number has been bumped
- ✅ App Store metadata/screenshots are updated

---

## Version Management

### Staging Builds (TestFlight)
**No version bump required!**

Staging uses the **same version number** as your current app but auto-increments the **build number**:

```bash
# Example staging workflow
# Current version: 1.2.0 (build 7)

# First staging build
yarn deploy:staging
# → Version: 1.2.0 (build 8) ✅

# Fix bugs, deploy again
yarn deploy:staging
# → Version: 1.2.0 (build 9) ✅

# More testing, deploy again
yarn deploy:staging
# → Version: 1.2.0 (build 10) ✅
```

**Key point:** All staging builds for version `1.2.0` share the same version but have different build numbers.

### Production Builds (App Store)
**Version bump IS required!**

Production requires a **new version number** before deployment:

```bash
# Example production workflow
# Current version: 1.2.0 (build 10)

# Step 1: Bump version
./scripts/bump-version.sh minor
# → New version: 1.3.0 (build 10)

# Step 2: Deploy to production
yarn deploy:production
# → Version: 1.3.0 (build 11) ✅
# Build number auto-incremented by EAS
```

**Important:** Never submit the same version to production twice. Always bump version before production release.

---

## Build Profiles

Both profiles are defined in [apps/expo/eas.json](./apps/expo/eas.json):

### Staging Profile
```json
{
  "staging": {
    "distribution": "store",
    "channel": "staging",
    "autoIncrement": true,
    "env": {
      "APP_ENV": "staging",
      "NODE_ENV": "production"
    }
  }
}
```

- **Distribution:** `store` (TestFlight)
- **Channel:** `staging` (for OTA updates)
- **Auto-increment:** `true` (build number)
- **Environment:** Uses production-like settings for realistic testing

### Production Profile
```json
{
  "production": {
    "distribution": "store",
    "channel": "production",
    "autoIncrement": true,
    "env": {
      "APP_ENV": "production",
      "NODE_ENV": "production"
    }
  }
}
```

- **Distribution:** `store` (App Store)
- **Channel:** `production` (for OTA updates)
- **Auto-increment:** `true` (build number)
- **Environment:** Full production environment

---

## Common Workflows

### Workflow 1: Feature Development → Production

```bash
# 1. Develop feature locally
git checkout -b feature/new-feature
# ... develop feature ...
git commit -m "feat: add new feature"
git push

# 2. Deploy to staging for testing
yarn deploy:staging
# Version: 1.2.0 (build 8)
# ✅ Available on TestFlight

# 3. Test on TestFlight
# Beta testers use the app

# 4. Fix bugs (if any)
git commit -m "fix: address beta feedback"
git push
yarn deploy:staging
# Version: 1.2.0 (build 9)
# ✅ Updated on TestFlight

# 5. Staging approved! Ready for production
./scripts/bump-version.sh minor
# Version: 1.2.0 → 1.3.0

git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.3.0"
git push

# 6. Deploy to production
yarn deploy:production
# Version: 1.3.0 (build 10)
# ✅ Submitted to App Store for review

# 7. Wait for Apple review (1-2 days)
# ✅ App approved and released to users
```

### Workflow 2: Hotfix Production Bug

```bash
# Current production: 1.3.0
# Bug reported by users!

# 1. Create hotfix branch
git checkout -b hotfix/critical-bug
# ... fix bug ...
git commit -m "fix: critical bug in production"
git push

# 2. Test on staging first
yarn deploy:staging
# Version: 1.3.0 (build 11)
# ✅ Test the fix on TestFlight

# 3. Verify fix works
# ✅ Bug is fixed!

# 4. Bump PATCH version
./scripts/bump-version.sh patch
# Version: 1.3.0 → 1.3.1

git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.3.1 (hotfix)"
git push

# 5. Deploy hotfix to production
yarn deploy:production
# Version: 1.3.1 (build 12)
# ✅ Submitted to App Store

# 6. Expedite review if critical
# Contact Apple for expedited review if needed
```

### Workflow 3: Using Release Wizard

The interactive release wizard ([scripts/release-wizard.sh](./scripts/release-wizard.sh)) guides you through the entire process:

```bash
# Run the wizard
./scripts/release-wizard.sh

# Choose your path:
# 1. 🚀 Deploy Release
#    → Staging only (test first)
#    → Production only (straight to App Store)
#    → Both (staging → production)
#
# 2. 🔢 Bump Version
#    → Patch (1.3.0 → 1.3.1)
#    → Minor (1.3.0 → 1.4.0)
#    → Major (1.3.0 → 2.0.0)
#
# 3. 🛠️ Utilities
#    → Upload screenshots
#    → Upload metadata
#    → View checklist
```

---

## NPM Scripts Reference

### Root Package Scripts (from [apps/expo/package.json](./apps/expo/package.json))

```bash
# Staging (TestFlight)
yarn deploy:staging          # Build + submit to TestFlight
yarn build:staging           # Build only (no submit)
yarn submit:staging          # Submit existing build

# Production (App Store)
yarn deploy:production       # Build + submit to App Store
yarn build:production        # Build only (no submit)
yarn submit:production       # Submit existing build

# Detailed scripts (with environment)
yarn eas:build:staging:ios       # Build staging for iOS
yarn eas:submit:staging:ios      # Submit staging to TestFlight
yarn eas:build:production:ios    # Build production for iOS
yarn eas:submit:production:ios   # Submit production to App Store
```

### Shell Scripts (from [scripts/](./scripts/))

```bash
# Version management
./scripts/bump-version.sh patch    # 1.3.0 → 1.3.1
./scripts/bump-version.sh minor    # 1.3.0 → 1.4.0
./scripts/bump-version.sh major    # 1.3.0 → 2.0.0

# Deployment
./scripts/deploy-staging.sh        # Build + submit staging
./scripts/deploy-production.sh     # Build + submit production

# Individual steps
./scripts/build-production.sh      # Build only
./scripts/submit-production.sh     # Submit only

# Interactive wizard
./scripts/release-wizard.sh        # Guided release process
```

---

## Important Notes

### ✅ DO:

1. **Always test on staging before production**
   ```bash
   yarn deploy:staging  # Test first!
   yarn deploy:production  # Then release
   ```

2. **Bump version before production**
   ```bash
   ./scripts/bump-version.sh minor
   yarn deploy:production
   ```

3. **Use semantic versioning**
   - **Patch** (1.3.0 → 1.3.1): Bug fixes
   - **Minor** (1.3.0 → 1.4.0): New features
   - **Major** (1.3.0 → 2.0.0): Breaking changes

4. **Commit version changes**
   ```bash
   git add apps/expo/app.config.js
   git commit -m "chore: bump version to 1.4.0"
   git push
   ```

5. **Monitor builds after deployment**
   - Sentry: [Error tracking](https://sentry.io/organizations/inner-ascend/projects/react-native/)
   - TestFlight: Beta tester feedback
   - App Store Connect: Review status

### ❌ DON'T:

1. **Don't bump version for staging**
   ```bash
   # ❌ WRONG
   ./scripts/bump-version.sh minor
   yarn deploy:staging

   # ✅ CORRECT
   yarn deploy:staging  # Uses current version
   ```

2. **Don't skip staging testing**
   ```bash
   # ❌ WRONG
   yarn deploy:production  # Without testing on staging

   # ✅ CORRECT
   yarn deploy:staging     # Test first
   # ... verify on TestFlight ...
   ./scripts/bump-version.sh minor
   yarn deploy:production  # Then release
   ```

3. **Don't reuse version numbers**
   ```bash
   # ❌ WRONG
   # Version 1.4.0 already in production
   yarn deploy:production  # Don't submit again without bump!

   # ✅ CORRECT
   ./scripts/bump-version.sh patch  # 1.4.0 → 1.4.1
   yarn deploy:production
   ```

4. **Don't deploy on Fridays** (harder to fix issues over weekend)

5. **Don't ignore build errors or warnings**

---

## Troubleshooting

### "Build profile not found"

**Problem:** Script uses wrong profile name

**Solution:** Check that your command matches the correct profile:
```bash
# Staging
yarn eas:build:staging:ios      # ✅ Uses staging profile
yarn eas:build:production:ios   # ✅ Uses production profile
```

### "Version already exists in App Store Connect"

**Problem:** Trying to submit same version twice to production

**Solution:** Bump version before submitting:
```bash
./scripts/bump-version.sh patch
yarn deploy:production
```

### "Build number already used"

**Problem:** EAS auto-increment failed (rare)

**Solution:** Manually increment build number in [apps/expo/app.config.js](./apps/expo/app.config.js):
```javascript
// Before
buildNumber: '10',

// After
buildNumber: '11',
```

Then retry:
```bash
yarn deploy:production
```

### "Metadata requires a build"

**Problem:** Trying to upload metadata for version that doesn't exist

**Solution:** Either:
1. **Submit a build first**, then upload metadata
   ```bash
   yarn deploy:production  # Submit build
   yarn fastlane:upload:metadata  # Then upload metadata
   ```

2. **Or upload metadata for existing version**
   - Metadata can be updated anytime for existing versions
   - No new build required if version exists in App Store Connect

---

## Summary

| Task | Staging | Production |
|------|---------|------------|
| **Profile** | `staging` | `production` |
| **Command** | `yarn deploy:staging` | `yarn deploy:production` |
| **Version Bump** | ❌ No | ✅ Yes |
| **Testing** | For beta testers | For all users |
| **Review** | ❌ No | ✅ Yes (1-2 days) |
| **Iteration** | ✅ Fast (no review) | ⚠️ Slow (needs review) |

**Key Takeaway:**
- **Staging** = Fast iteration, same version, beta testing
- **Production** = New version, Apple review, public release

**Recommended Flow:**
```
Feature → Staging → Test → Fix → Staging → Approve → Bump Version → Production → Release
```

---

## Related Documentation

- [VERSION_MANAGEMENT.md](./.github/VERSION_MANAGEMENT.md) - Version and build number strategy
- [PRODUCTION_RELEASE_GUIDE.md](./PRODUCTION_RELEASE_GUIDE.md) - Fastlane and metadata
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) - Pre-release checklist
- [RELEASE_WORKFLOW.md](./.github/RELEASE_WORKFLOW.md) - Complete workflow guide

---

**Questions?** Review the documentation above or run the interactive wizard:
```bash
./scripts/release-wizard.sh
```
