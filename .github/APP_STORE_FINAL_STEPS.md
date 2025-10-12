# App Store Connect - Final Steps Before Submission

Complete guide for the 5 remaining required items before you can submit Mazunte Connect for review.

## ✅ Quick Checklist

- [ ] 1. Set up Content Rights Information
- [ ] 2. Complete Age Rating questionnaire
- [ ] 3. Fill out App Privacy section
- [ ] 4. Update App Privacy for tracking (NSUserTrackingUsageDescription)
- [ ] 5. Choose a price tier

---

## 1. Content Rights Information

### Where to Find It
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Mazunte Connect**
3. Navigate to: **App Information** (left sidebar)
4. Scroll to **Content Rights** section

### What to Answer

**Question:** "Does your app contain, display, or access third-party content?"

**Answer:** **Yes** (if users can post events, places, or share content)
- Select: **"Yes, and I have the rights to use the content"**

**OR**

**Answer:** **No** (if all content is user-generated and you're just the platform)
- Select: **"No"**

### Recommended Answer for Mazunte Connect

Since Mazunte Connect is a community platform where users create their own content (events, places, profiles), answer:

✅ **"No"** - The app doesn't contain third-party content; it's a platform for user-generated content.

**Save** when done.

---

## 2. Age Rating

### Where to Find It
1. In App Store Connect, go to **App Information**
2. Scroll to **Age Rating** section
3. Click **"Edit"** next to Age Rating

### Complete the Questionnaire

Apple will ask about specific content types. Here are recommended answers for Mazunte Connect:

#### **Alcohol, Tobacco, or Drug Use**
- Does your app contain references to or depictions of alcohol, tobacco, or drug use?
  - **Answer:** **None** (unless your events feature alcohol)
  - If events may include bars/alcohol: **Infrequent/Mild**

#### **Contests**
- Does your app enable users to engage in contests?
  - **Answer:** **No**

#### **Gambling and Contests**
- Does your app simulate gambling?
  - **Answer:** **No**

#### **Horror/Fear Themes**
- Does your app contain horror or fear themes?
  - **Answer:** **None**

#### **Mature/Suggestive Themes**
- Does your app contain mature or suggestive themes?
  - **Answer:** **None**

#### **Medical/Treatment Information**
- Does your app provide medical or treatment information?
  - **Answer:** **No**

#### **Profanity or Crude Humor**
- Does your app contain profanity or crude humor?
  - **Answer:** **Infrequent/Mild** (user-generated content may contain some)

#### **Sexual Content or Nudity**
- Does your app contain sexual content or nudity?
  - **Answer:** **None**

#### **Unrestricted Web Access**
- Does your app provide unrestricted web access?
  - **Answer:** **No** (assuming you don't have a built-in web browser)

#### **Violence**
- Does your app contain violence?
  - **Answer:** **None**

### Expected Result

With these answers, your app will likely get:
- **Age Rating:** **12+** (due to user-generated content and potential mild profanity)
- Or **4+** if you answer "None" to profanity

### Save
Click **"Done"** to save your age rating responses.

---

## 3. App Privacy Section

### Where to Find It
1. In App Store Connect, go to **App Privacy** (left sidebar)
2. Click **"Get Started"** or **"Edit"**

### Step 1: Data Collection Overview

**Question:** "Do you or your third-party partners collect data from this app?"

**Answer:** **Yes** (you collect user data for accounts, profiles, events, etc.)

### Step 2: Data Types You Collect

For Mazunte Connect, you likely collect:

#### ✅ **Contact Info**
- **Email Address**
  - Purpose: Account creation, communication
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

- **Name**
  - Purpose: User profile, app functionality
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

- **Phone Number** (if applicable)
  - Purpose: Account creation, verification
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

#### ✅ **Location**
- **Approximate Location**
  - Purpose: App functionality (finding nearby events/places)
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

#### ✅ **User Content**
- **Photos or Videos** (if users can upload)
  - Purpose: App functionality (profile pictures, event photos)
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

- **Other User Content**
  - Purpose: App functionality (events, posts, messages)
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

#### ✅ **Identifiers**
- **User ID**
  - Purpose: App functionality, analytics
  - Linked to user's identity: **Yes**
  - Used for tracking: **No**

- **Device ID** (if you use analytics)
  - Purpose: Analytics, app functionality
  - Linked to user's identity: **No**
  - Used for tracking: **Yes** ⚠️ (see section 4 below)

#### ✅ **Usage Data**
- **Product Interaction**
  - Purpose: Analytics
  - Linked to user's identity: **No**
  - Used for tracking: **No**

- **Advertising Data** (if you show ads)
  - Purpose: Third-party advertising
  - Linked to user's identity: **Yes**
  - Used for tracking: **Yes** ⚠️ (see section 4 below)

### Step 3: Data Usage

For each data type, specify:
- **Used for:** App functionality, Analytics, Product personalization, etc.
- **Linked to user's identity:** Yes/No
- **Used for tracking:** Yes/No (see section 4 below)

### Important: Tracking Definition

Apple defines "tracking" as:
> Linking data collected from your app about a user or device with data collected from other companies' apps, websites, or offline properties for targeted advertising or advertising measurement purposes.

**If you use:**
- ✅ **Google Analytics** → Likely tracking
- ✅ **Facebook SDK** → Likely tracking
- ✅ **AdMob/Ads** → Definitely tracking
- ✅ **PostHog** → May be tracking (if cross-app data is shared)

### Save
Click **"Publish"** after completing all data types.

---

## 4. NSUserTrackingUsageDescription Update

### The Problem

Your app's `Info.plist` contains:
```
NSUserTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you."
```

This tells Apple your app **requests permission to track users** (for ads or cross-app data linking).

### Two Options

#### **Option A: You DO Show Ads or Track Users** ✅ Recommended if true

**If you use AdMob, Facebook Ads, or cross-app analytics:**

1. In App Privacy (section 3 above), mark these data types as **"Used for tracking: Yes"**:
   - Device ID
   - Advertising Data
   - Any identifiers used for ads

2. Keep the `NSUserTrackingUsageDescription` in your app

3. Users will see a popup when they open your app:
   ```
   "Mazunte Connect" would like permission to track you across
   apps and websites owned by other companies.

   This identifier will be used to deliver personalized ads to you.

   [Ask App Not to Track]  [Allow]
   ```

4. **In App Privacy**, answer:
   - "Do you or your third-party partners use data for tracking?" → **Yes**
   - List all tracking data types

#### **Option B: You DON'T Show Ads or Track Users** ✅ Recommended if you removed ads

**If you removed AdMob or don't track users:**

1. **Remove** `NSUserTrackingUsageDescription` from your app config:

   Edit `apps/expo/app.config.js`:
   ```javascript
   ios: {
     infoPlist: {
       // Remove or comment out this line:
       // NSUserTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you.",

       // Keep other permissions...
     }
   }
   ```

2. Rebuild and resubmit your app:
   ```bash
   yarn deploy:staging
   # or
   yarn deploy:production
   ```

3. In App Privacy, mark all data types as:
   - **"Used for tracking: No"**

4. No tracking popup will appear for users

### Which Option Should You Choose?

**Ask yourself:**
- Do you show ads (AdMob, Facebook Ads, etc.)? → **Option A**
- Do you use cross-app analytics (Facebook SDK, etc.)? → **Option A**
- Do you share user data with advertisers? → **Option A**
- Your app is ad-free and analytics are internal only? → **Option B**

---

## 5. Choose a Price Tier

### Where to Find It
1. In App Store Connect, go to **Pricing and Availability** (left sidebar)
2. Scroll to **Price** section

### For Mazunte Connect (Free App)

Since Mazunte Connect is a community app:

1. Click **"Edit"** next to Price
2. Select **"Free"** or **Tier 0**
3. Click **"Done"**

### If You Plan to Charge Later

You can change from free to paid later, **BUT:**
- ⚠️ **Warning:** You can NEVER change from paid → free
- Recommendation: Start **free**, then add in-app purchases if needed

### If You Have In-App Purchases

You can set the base app as **Free** and still have in-app purchases:
- Base price: **Free (Tier 0)**
- In-app purchases: Set up separately in **"Features"** → **"In-App Purchases"**

### Save
Click **"Save"** at the top right

---

## ✅ Completion Checklist

After completing all 5 steps, verify:

1. **App Information** page shows:
   - ✅ Content Rights: Completed
   - ✅ Age Rating: Shows a rating (e.g., "12+")

2. **App Privacy** page shows:
   - ✅ "Published" status
   - ✅ All data types listed
   - ✅ Tracking status correctly set

3. **Pricing and Availability** page shows:
   - ✅ Price: "Free" or specific tier

4. **App Store** page for version 1.2.8 (or your version) shows:
   - ✅ No red warning icons
   - ✅ All sections have green checkmarks
   - ✅ "Submit for Review" button is enabled

---

## What Happens Next

Once you complete all 5 items:

1. Go to **App Store** → **iOS App** → **Version 1.2.8**
2. Review all information one final time
3. Click **"Submit for Review"** (top right)

### Review Timeline
- **Waiting for Review:** 1-2 days
- **In Review:** 1-2 days
- **Approved or Rejected:** You'll receive an email

### If Rejected
Don't worry! Common rejection reasons:
- Missing test account credentials
- Crash during review
- Unclear functionality

Apple explains why and you can resubmit quickly with fixes.

---

## Need Help?

### Quick Reference

| Item | Location in App Store Connect |
|------|------------------------------|
| Content Rights | App Information → Content Rights |
| Age Rating | App Information → Age Rating |
| App Privacy | App Privacy (left sidebar) |
| Tracking Disclosure | App Privacy → Tracking |
| Price Tier | Pricing and Availability → Price |

### Common Questions

**Q: Should I choose manual or automatic release?**
A: Choose **"Manually release this version"** for your first release so you control when it goes live.

**Q: What if I'm not sure about tracking?**
A: If you use Google Analytics, PostHog, Facebook SDK, or any ad networks → You're probably tracking. Choose **Option A** in section 4.

**Q: Can I change these after submission?**
A: Yes! You can update App Privacy, age rating, and content rights anytime. Just resubmit the app version.

**Q: How long does review take?**
A: Typically 2-4 days total. You'll get email updates at each stage.

---

## Useful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)
- [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency)
- [Age Ratings](https://developer.apple.com/help/app-store-connect/reference/age-ratings)

---

## Related Documentation

- [APP_STORE_SETUP.md](./APP_STORE_SETUP.md) - Complete setup guide
- [RELEASE_WORKFLOW.md](./RELEASE_WORKFLOW.md) - Build and release process

---

Good luck with your submission! You're almost there! 🚀
