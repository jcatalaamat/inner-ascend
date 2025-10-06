# Version Management Guide

Complete guide for managing app versions and build numbers in Mazunte Connect.

## Table of Contents
- [Understanding Versions](#understanding-versions)
- [Where Versions Are Defined](#where-versions-are-defined)
- [Version Bumping Workflow](#version-bumping-workflow)
- [Automatic Build Number Increments](#automatic-build-number-increments)
- [Quick Reference](#quick-reference)

---

## Understanding Versions

### Version Number (`version`)
- **Format:** Semantic versioning (`MAJOR.MINOR.PATCH`)
- **Example:** `1.0.2`
- **Visible to:** Users in App Store
- **Purpose:** Indicates feature updates and releases
- **Who manages:** You (manual)

**When to bump:**
- `MAJOR` (1.0.0 → 2.0.0): Breaking changes, major redesign
- `MINOR` (1.0.0 → 1.1.0): New features, enhancements
- `PATCH` (1.0.0 → 1.0.1): Bug fixes, minor tweaks

### Build Number (`buildNumber`)
- **Format:** Integer (increments: `1`, `2`, `3`, ...)
- **Example:** `7`
- **Visible to:** Only visible in App Store Connect (internal)
- **Purpose:** Uniquely identifies each build submitted to Apple
- **Who manages:** EAS automatically (via `autoIncrement: true`)

**Key point:** You rarely need to manually change build numbers!

---

## Where Versions Are Defined

### **Main Config:** [`apps/expo/app.config.js`](../apps/expo/app.config.js)

```javascript
export default {
  expo: {
    version: '1.0.2',           // ← Version number (CHANGE THIS manually)
    ios: {
      buildNumber: '7',          // ← Build number (EAS auto-increments this)
    },
    android: {
      versionCode: 4,            // ← Android build number
    },
  },
}
```

### **Runtime Version Policy**

Since we use **managed workflow** with `runtimeVersion: { policy: 'appVersion' }`:
- Runtime version automatically matches `version` field
- No need to manually manage runtime version
- Updates work automatically for same version numbers

---

## Version Bumping Workflow

### **For Staging Releases (Beta Testing)**

**You don't need to bump version for staging!**

Staging uses `autoIncrement: true`, so EAS automatically increments the build number:
- First staging build: `1.0.2 (7)`
- Second staging build: `1.0.2 (8)`
- Third staging build: `1.0.2 (9)`

**When to bump version:**
Only when you're preparing for a **production release** with new features.

---

### **For Production Releases (App Store)**

**Before releasing to production:**

1. **Decide the new version number**
   ```
   Current: 1.0.2
   New feature? → 1.1.0
   Bug fix? → 1.0.3
   Major update? → 2.0.0
   ```

2. **Update version in `app.config.js`**
   ```bash
   # Edit the file
   nano apps/expo/app.config.js

   # Change:
   version: '1.0.2',
   # To:
   version: '1.1.0',
   ```

3. **Commit the version change**
   ```bash
   git add apps/expo/app.config.js
   git commit -m "chore: bump version to 1.1.0"
   git push
   ```

4. **Build and submit production**
   ```bash
   cd apps/expo
   eas build --platform ios --profile production
   eas submit --platform ios --profile production --latest
   ```

   Or use GitHub Actions: **Deploy Production** workflow

5. **EAS automatically handles build number**
   - Finds the highest build number used for version `1.1.0`
   - Increments it automatically
   - You don't touch `buildNumber` in config!

---

## Automatic Build Number Increments

### How `autoIncrement: true` Works

In [`apps/expo/eas.json`](../apps/expo/eas.json), profiles with `autoIncrement: true`:

```json
{
  "staging": {
    "autoIncrement": true  // ← EAS increments buildNumber automatically
  },
  "production": {
    "autoIncrement": true  // ← EAS increments buildNumber automatically
  }
}
```

**What EAS does:**
1. Looks at your current `buildNumber` in `app.config.js`
2. Checks App Store Connect for the highest build number ever used
3. Uses `max(local, remote) + 1` as the new build number
4. Updates the build with the new number

**Example:**
- `app.config.js` says: `buildNumber: '7'`
- App Store Connect has builds: 7, 8, 9
- EAS builds with: `buildNumber: '10'`

**Important:** The `buildNumber` in `app.config.js` becomes a **reference point**, not the actual value used.

---

## Version Management Best Practices

### ✅ **DO:**

1. **Bump version for production releases**
   ```bash
   # Before production release
   version: '1.0.2' → '1.1.0'
   ```

2. **Commit version changes to git**
   ```bash
   git add apps/expo/app.config.js
   git commit -m "chore: bump version to 1.1.0"
   ```

3. **Use semantic versioning**
   - Features: `1.0.0` → `1.1.0`
   - Bug fixes: `1.0.0` → `1.0.1`
   - Breaking changes: `1.0.0` → `2.0.0`

4. **Let EAS handle build numbers**
   - Trust `autoIncrement: true`
   - Don't manually change `buildNumber`

5. **Tag production releases**
   ```bash
   git tag v1.1.0
   git push --tags
   ```
   (The production workflow does this automatically!)

### ❌ **DON'T:**

1. **Don't manually bump `buildNumber`** in `app.config.js`
   - EAS handles this automatically
   - Manual changes can cause conflicts

2. **Don't change version for staging builds**
   - Staging is for testing the CURRENT version
   - Only bump version when ready for production

3. **Don't forget to commit version changes**
   - Version should be tracked in git
   - Helps maintain version history

4. **Don't reuse version numbers**
   - Once you release `1.1.0` to production, never go back
   - Always increment forward

---

## Quick Reference

### Check Current Version

```bash
# In app.config.js
grep "version:" apps/expo/app.config.js

# Output: version: '1.0.2',
```

### Bump Version for Production

```bash
# 1. Edit version in app.config.js
nano apps/expo/app.config.js

# 2. Change version: '1.0.2' → '1.1.0'

# 3. Commit
git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.1.0"
git push

# 4. Build production (via GitHub Actions or locally)
cd apps/expo
eas build --platform ios --profile production
```

### Check Build History

```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

### App Store Connect Build Numbers

- Go to [App Store Connect](https://appstoreconnect.apple.com)
- Select your app
- Go to **App Store** → **iOS App** → **Version**
- See all builds under **Build** section

---

## Common Scenarios

### **"I want to test a new feature"**
```bash
# Don't change version! Just push to main
git push origin main

# Staging auto-deploys with same version, incremented build number
# Example: 1.0.2 (7) → 1.0.2 (8)
```

### **"I want to release to production"**
```bash
# 1. Bump version
version: '1.0.2' → '1.1.0'

# 2. Commit and push
git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.1.0"
git push

# 3. Trigger production workflow in GitHub Actions
# Or locally: eas build --profile production
```

### **"Build number is out of sync"**
```bash
# This is normal! EAS automatically syncs with App Store Connect
# The buildNumber in app.config.js is just a reference
# EAS will use: max(local, remote) + 1

# You can safely ignore the local buildNumber value
# Trust autoIncrement: true
```

### **"I need to hotfix production"**
```bash
# 1. Bump patch version
version: '1.1.0' → '1.1.1'

# 2. Commit and push
git add apps/expo/app.config.js
git commit -m "chore: bump version to 1.1.1 (hotfix)"
git push

# 3. Build and submit
eas build --profile production
eas submit --profile production --latest
```

---

## Troubleshooting

### **Problem: "Build number already used"**

**Cause:** EAS couldn't auto-increment (rare)

**Solution:**
```bash
# Manually increment buildNumber in app.config.js
buildNumber: '7' → buildNumber: '8'

# Commit and retry
git add apps/expo/app.config.js
git commit -m "fix: manually bump build number"
eas build --profile production
```

### **Problem: "Version mismatch with App Store"**

**Cause:** You bumped version locally but haven't submitted yet

**Solution:**
- **Option 1:** Submit the build to App Store Connect
- **Option 2:** Revert version change if you're not ready
  ```bash
  git revert HEAD
  ```

### **Problem: "Can't submit to App Store - version already exists"**

**Cause:** That version was already released to production

**Solution:**
```bash
# Bump to next version
version: '1.1.0' → '1.1.1'

# Never reuse version numbers for production releases!
```

---

## Summary

| Scenario | Version Bump? | Build Number? | Command |
|----------|--------------|---------------|---------|
| **Staging test** | ❌ No | ✅ Auto (EAS) | Push to `main` (auto-deploys) |
| **Production release** | ✅ Yes | ✅ Auto (EAS) | Bump version → Deploy Production workflow |
| **Hotfix** | ✅ Patch bump | ✅ Auto (EAS) | Bump patch version → Deploy Production |

**Key Takeaway:** Only bump `version` manually. Let EAS handle `buildNumber` via `autoIncrement: true`.

---

## Related Files

- [`apps/expo/app.config.js`](../apps/expo/app.config.js) - Version and build number
- [`apps/expo/eas.json`](../apps/expo/eas.json) - `autoIncrement` configuration
- [`.github/RELEASE_WORKFLOW.md`](./RELEASE_WORKFLOW.md) - Complete release guide

---

## Resources

- [Expo Versioning](https://docs.expo.dev/build-reference/app-versions/)
- [EAS Build autoIncrement](https://docs.expo.dev/build-reference/app-versions/#automatic-versioning)
- [Semantic Versioning](https://semver.org/)
- [App Store Connect](https://appstoreconnect.apple.com)
