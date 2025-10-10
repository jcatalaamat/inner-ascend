# Website Requirements for App Store Submission

Apple requires these web pages before you can submit to the App Store.

## Required Pages

### 1. Privacy Policy
**URL:** `https://mazunteconnect.com/privacy`

**Required content:**
- What data you collect (location, email, profile info)
- How you use the data (show events/places nearby, authentication)
- Third-party services (Supabase, PostHog, Sentry, Google Sign-In, Apple Sign-In)
- User rights (access, delete, update data)
- Contact information

**Template available in your app:**
See `packages/app/i18n/locales/en.json` → `privacy_policy` section for the content you already have.

---

### 2. Support Page
**URL:** `https://mazunteconnect.com/support`

**Required content:**
- Contact email: `hello@mazunteconnect.com`
- FAQ (optional but helpful)
- How to report issues
- How to request features

**Simple example:**
```markdown
# Support

Need help with Mazunte Connect?

**Contact us:** hello@mazunteconnect.com

**Common questions:**
- How do I create an event?
- How do I add a place?
- How do I change language?
- How do I delete my account?

We typically respond within 24-48 hours.
```

---

### 3. Main Website (Marketing)
**URL:** `https://mazunteconnect.com`

**Suggested content:**
- App description
- Screenshots
- Download links (App Store badge)
- Features overview
- Community info

**Simple example:**
```markdown
# Mazunte Connect

Discover events, explore places, and connect with your Mazunte community.

**Download on the App Store**
[App Store Badge]

**Features:**
- Browse local events (yoga, ceremonies, workshops)
- Discover places (retreats, restaurants, wellness)
- Interactive map
- Favorites
- Bilingual (English & Spanish)

**Contact:** hello@mazunteconnect.com
```

---

## Hosting Options

### Option 1: GitHub Pages (Free, Easy)
1. Create repo: `mazunte-connect-website`
2. Add 3 HTML files: `index.html`, `privacy.html`, `support.html`
3. Enable GitHub Pages in Settings
4. **Result:** `https://yourusername.github.io/mazunte-connect-website/`

### Option 2: Vercel (Free, Custom Domain)
1. Create `website` folder with HTML files
2. Deploy to Vercel: `vercel deploy`
3. Add custom domain: `mazunteconnect.com`
4. **Result:** `https://mazunteconnect.com`

### Option 3: Netlify (Free, Easy Deployment)
1. Drag & drop HTML files to Netlify
2. Add custom domain
3. **Result:** `https://mazunteconnect.com`

### Option 4: Simple Static Host (Carrd, Webflow, etc.)
- Carrd.co - Free tier for simple sites
- Super simple drag-and-drop
- Custom domain support

---

## Using Your App's Privacy Policy

You already have privacy policy content in your app! Use it for your website:

**Location:** `packages/app/i18n/locales/en.json`

Extract the `privacy_policy` section and convert to HTML:

```json
{
  "privacy_policy": {
    "title": "Privacy Policy",
    "intro": "At Mazunte Connect, we are committed to protecting...",
    ...
  }
}
```

Convert this to a simple HTML page.

---

## Custom Domain Setup

If you own `mazunteconnect.com`:

1. **Buy domain** (if you haven't):
   - Namecheap, GoDaddy, Google Domains, etc.
   - Cost: ~$10-15/year

2. **Point to hosting:**
   - GitHub Pages: Add CNAME file
   - Vercel/Netlify: Add domain in dashboard
   - Update DNS A/CNAME records

3. **SSL certificate:**
   - GitHub Pages: Automatic with custom domain
   - Vercel/Netlify: Automatic
   - Let's Encrypt: Free SSL

---

## Quick Start Template

I can create a simple HTML template for you with:
- All 3 pages pre-made
- Your privacy policy content (from app)
- Your app description (from metadata)
- Responsive design
- Ready to deploy

Just let me know if you want me to generate the HTML files!

---

## Timeline

**Before App Store submission:**
1. ✅ Create privacy page
2. ✅ Create support page
3. ✅ Create main page
4. ✅ Deploy to hosting
5. ✅ Update metadata URLs in fastlane
6. ✅ Test all URLs work
7. ✅ Submit to App Store

**Estimated time:** 1-2 hours for basic pages + deployment

---

## Current Metadata URLs

These are already configured in your Fastlane metadata:

**English:**
- Privacy: `https://mazunteconnect.com/privacy`
- Support: `https://mazunteconnect.com/support`
- Marketing: `https://mazunteconnect.com`

**Spanish:**
- Privacy: `https://mazunteconnect.com/privacy` (can add `/es` if you want Spanish version)
- Support: `https://mazunteconnect.com/support`
- Marketing: `https://mazunteconnect.com`

You can create Spanish versions at `/es/privacy` and `/es/support` if you want, or use the same URLs for both languages.

---

## Next Steps

1. **Choose hosting service** (GitHub Pages recommended for simplicity)
2. **Create 3 HTML pages** (I can help generate these)
3. **Deploy to hosting**
4. **Verify URLs work**
5. **Continue with production release**

Let me know when your pages are ready and I'll help you verify everything before submission!
