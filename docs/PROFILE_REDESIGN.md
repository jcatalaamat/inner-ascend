# Profile Screen Redesign

## Overview
Redesign the profile tab to create a unified personal dashboard with creator mode toggle, horizontal scrollable sections (like home screen), and integrated favorites (removing the separate favorites tab).

## Goals
- ✅ Consolidate user's personal content in one place
- ✅ Add creator mode toggle to switch between personal/creator views
- ✅ Remove favorites from bottom navigation
- ✅ Use horizontal scrollable sections (consistent with home screen UX)
- ✅ Make settings easily accessible
- ✅ Allow users to view their public profile

## Current State

### Problems
1. `/profile` tab currently shows DrawerMenu (redundant/confusing)
2. Favorites has its own bottom tab (should be integrated)
3. No way to toggle between personal view (favorites) and creator view (my content)
4. Edit profile is at `/profile/edit` but main profile is just menu items
5. Settings are buried in drawer menu

### What Works
- Public profile ([public-screen.tsx](../packages/app/features/profile/public-screen.tsx)) has good design with hero, stats, tabs
- Edit profile form works well
- Horizontal scrolling pattern on home screen is proven

## New Design

### Visual Layout
```
┌──────────────────────────────────────────┐
│ ⚙️ Settings                    [Top Right]
├──────────────────────────────────────────┤
│         HERO SECTION                      │
│   ┌──────────┐                            │
│   │  Avatar  │  Name, Location            │
│   │  (tap→   │  Bio/About                 │
│   │   edit)  │  🏷️ Languages badges       │
│   └──────────┘  ✓ Verified  👑 Admin     │
├──────────────────────────────────────────┤
│  📊 STATS BAR (tappable to scroll)       │
│  [Services: 3] [Events: 5] [Places: 2] [♥️: 12]
├──────────────────────────────────────────┤
│  🎬 ACTION BUTTONS                        │
│  [Edit Profile] [View Public] [Share]    │
├──────────────────────────────────────────┤
│  🔄 CREATOR MODE TOGGLE                   │
│  [ Personal View  |  Creator View ]      │
│                                           │
│  ─ IF PERSONAL VIEW: ─────────────────   │
│                                           │
│  ❤️ MY FAVORITES (12) ─────── View All → │
│  ┌─────┐ ┌─────┐ ┌─────┐                 │
│  │Event│ │Place│ │Svc  │ → → →          │
│  └─────┘ └─────┘ └─────┘                 │
│  (Horizontal scroll, mixed all types)    │
│                                           │
│  ─ IF CREATOR VIEW: ───────────────────  │
│                                           │
│  💼 MY SERVICES (3) ────────── View All →│
│  ┌──────┐ ┌──────┐ ┌──────┐              │
│  │Svc 1 │ │Svc 2 │ │Svc 3 │ → → →       │
│  └──────┘ └──────┘ └──────┘              │
│                                           │
│  📅 MY EVENTS (5) ──────────── View All →│
│  ┌──────┐ ┌──────┐ ┌──────┐              │
│  │Evt 1 │ │Evt 2 │ │Evt 3 │ → → →       │
│  └──────┘ └──────┘ └──────┘              │
│  (Shows "Upcoming" by default, toggle    │
│   to "Past" events)                      │
│                                           │
│  📍 MY PLACES (2) ──────────── View All →│
│  ┌──────┐ ┌──────┐                       │
│  │Plc 1 │ │Plc 2 │ → → →                 │
│  └──────┘ └──────┘                       │
│                                           │
│  ─────────────────────────────────────  │
│                                           │
│  ⚙️ QUICK SETTINGS (always visible)      │
│  • Theme: [Dark | Light | Auto]          │
│  • Language: [English | Español]         │
│  • Notifications: [On | Off]             │
│  • [More Settings →]                     │
│  • [Logout] (red/destructive)            │
└──────────────────────────────────────────┘
```

## Key Features

### 1. Creator Mode Toggle
- **Personal View**: Shows favorites (events/places/services you've saved)
- **Creator View**: Shows content you've created (services, events, places)
- State persisted with `useState` (can add AsyncStorage later)
- PostHog tracking: `profile_view_mode_changed`

### 2. Horizontal Scrollable Sections
Pattern from [this-week-events-section.tsx](../packages/app/features/home/components/this-week-events-section.tsx):
- Section header with count + "View All →" button
- Horizontal FlatList with fixed-width cards (300px)
- Reuse existing EventCard, PlaceCard, ServiceCard components
- Empty states: "No favorites yet", "No services yet"

### 3. Mixed Favorites Section
- Single horizontal scroll showing ALL favorited items (events, places, services)
- Sorted by date added (most recent first)
- Each card shows type indicator
- "View All →" navigates to full favorites screen (with tabs)

### 4. Interactive Stats Bar
- Tap "Services: 3" → Scrolls to Services section + switches to Creator View
- Tap "Favorites: 12" → Scrolls to Favorites section + switches to Personal View
- Visual indicator showing current view mode

### 5. Embedded Quick Settings
- No need to navigate away for common settings
- Theme, Language, Notifications toggles
- "More Settings →" button for full `/settings` screen
- Logout always visible

## Database Schema

### Profile Fields Available
```typescript
{
  // Basic Info
  name: string | null
  about: string | null
  avatar_url: string | null
  location: string | null
  languages: string[] | null  // ['en', 'es']

  // Social Links
  social_instagram: string | null
  social_website: string | null
  social_whatsapp: string | null
  show_contact_on_profile: boolean | null

  // Status/Badges
  creator_verified: boolean | null
  is_admin: boolean | null

  // Timestamps
  created_at: string
  updated_at: string
}
```

## Data Queries

All queries already exist, just need to wire them up:

```tsx
const { profile, user, avatarUrl } = useUser()
const { data: stats } = useProfileStatsQuery(user?.id)
const { data: services = [] } = useServicesQuery({ profile_id: user?.id })
const { data: upcomingEvents = [] } = useProfileUpcomingEventsQuery(user?.id)
const { data: pastEvents = [] } = useProfilePastEventsQuery(user?.id)
const { data: places = [] } = useProfilePlacesQuery({ profileId: user?.id })
const { data: favorites = [] } = useFavoritesQuery(user?.id)
```

## Implementation Plan

### Phase 1: Setup & Cleanup
- [x] Create this README
- [ ] Remove favorites tab from bottom navigation
- [ ] Add translations (EN/ES)

### Phase 2: Update Edit Profile
- [ ] Add location field
- [ ] Add languages multi-select
- [ ] Add social media fields (Instagram, Website, WhatsApp)
- [ ] Add "show contact on profile" toggle
- [ ] Update form validation schema

### Phase 3: Build New Profile Screen
- [ ] Create main profile screen component
- [ ] Add hero section (reuse ProfileHeroSection)
- [ ] Add stats bar (interactive)
- [ ] Add action buttons (Edit, View Public, Share)
- [ ] Add creator mode toggle
- [ ] Add favorites section (horizontal scroll)
- [ ] Add services section (horizontal scroll)
- [ ] Add events section (horizontal scroll)
- [ ] Add places section (horizontal scroll)
- [ ] Add quick settings section (embedded)

### Phase 4: Testing & Polish
- [ ] Test navigation flows
- [ ] Test data loading states
- [ ] Test empty states
- [ ] Add PostHog tracking events
- [ ] Test on iOS device
- [ ] Verify translations

## Files Modified

### Core Changes
1. **apps/expo/app/(drawer)/(tabs)/_layout.tsx** - Remove favorites tab
2. **packages/app/features/profile/screen.tsx** - Complete rewrite with new design
3. **packages/app/features/profile/edit-screen.tsx** - Add social/location fields
4. **packages/app/i18n/locales/en.json** - Add translations
5. **packages/app/i18n/locales/es.json** - Add Spanish translations

### Optional (for organization)
6. **packages/app/features/profile/components/profile-hero.tsx** - Extract hero component
7. **packages/app/features/profile/components/profile-stats-bar.tsx** - Extract stats
8. **packages/app/features/profile/components/creator-mode-toggle.tsx** - Extract toggle
9. **packages/app/features/profile/components/favorites-section.tsx** - Extract section
10. **packages/app/features/profile/components/quick-settings.tsx** - Extract settings

## Translations

### New Translation Keys

```json
{
  "profile": {
    "my_profile": "My Profile",
    "personal_view": "Personal",
    "creator_view": "Creator",
    "my_favorites": "My Favorites",
    "my_services": "My Services",
    "my_events": "My Events",
    "my_places": "My Places",
    "upcoming_events": "Upcoming",
    "past_events": "Past",
    "quick_settings": "Quick Settings",
    "more_settings": "More Settings",
    "edit_profile_button": "Edit Profile",
    "view_public_profile": "View Public",
    "share_profile": "Share",
    "no_favorites_yet": "No favorites yet",
    "no_services_yet": "No services created yet",
    "no_events_yet": "No events created yet",
    "no_places_yet": "No places added yet",
    "tap_heart_to_favorite": "Tap ❤️ on events/places to save them here",
    "create_your_first": "Create your first {{type}}",
    "view_all": "View All",
    "location_placeholder": "Mazunte, Oaxaca",
    "languages_label": "Languages",
    "social_links": "Social Links",
    "instagram_handle": "Instagram",
    "website_url": "Website",
    "whatsapp_number": "WhatsApp",
    "show_contact_on_profile": "Show contact info on public profile"
  }
}
```

## User Flows

### Flow 1: View Favorites
1. Tap Profile tab → Lands on "Personal View" (default)
2. Scroll through horizontal favorites list
3. Tap "View All →" → Navigate to full favorites screen (with tabs)
4. Tap a favorite → Navigate to event/place/service detail

### Flow 2: Creator Mode
1. Tap Profile tab → Lands on "Personal View"
2. Tap "Creator View" toggle
3. See Services, Events, Places sections appear
4. Scroll through horizontal lists
5. Tap "View All →" → Navigate to respective full screens

### Flow 3: Edit Profile
1. Tap "Edit Profile" button
2. Navigate to edit form
3. Update name, bio, location, languages, social links
4. Tap "Save"
5. Return to profile with updated info

### Flow 4: View as Public
1. Tap "View Public" button
2. Navigate to `/public-profile/[myUserId]`
3. See profile as others see it
4. Back button returns to private profile

### Flow 5: Quick Settings
1. Scroll to bottom of profile
2. Toggle theme/language/notifications inline
3. Tap "More Settings →" for full settings screen
4. Tap "Logout" to sign out

## PostHog Events

### New Tracking Events
```typescript
// View mode
posthog.capture('profile_screen_viewed', { view_mode: 'personal' | 'creator' })
posthog.capture('profile_view_mode_changed', { mode: 'personal' | 'creator' })

// Section interactions
posthog.capture('profile_section_view_all_tapped', {
  section: 'favorites' | 'services' | 'events' | 'places'
})

// Actions
posthog.capture('profile_edit_tapped')
posthog.capture('profile_view_public_tapped')
posthog.capture('profile_share_tapped')
posthog.capture('profile_stat_tapped', { stat_type: 'services' | 'events' | 'places' | 'favorites' })

// Quick settings
posthog.capture('profile_quick_setting_changed', {
  setting: 'theme' | 'language' | 'notifications',
  value: string
})
```

## Benefits

✅ **Unified Dashboard** - Everything in one scrollable screen
✅ **Creator/Personal Separation** - Clear mental model
✅ **Horizontal Scrolling** - Consistent with home screen UX
✅ **Quick Access** - Settings embedded, no extra navigation
✅ **Discoverable** - Toggle makes creator features obvious
✅ **Scalable** - Easy to add more sections later
✅ **No Favorites Tab** - Integrated into profile
✅ **Better Context** - Users see their content as others see it, with editing capabilities

## Design Inspiration

- **Instagram/LinkedIn Profile** - Personal + professional view toggle
- **Home Screen** - Horizontal scrollable sections pattern
- **Public Profile** - Hero section, stats bar, badges
- **Settings Screen** - Quick settings embedded, full screen available

## Related Files

- [ProfileHeroSection.tsx](../packages/app/components/ProfileHeroSection.tsx) - Reusable hero component
- [public-screen.tsx](../packages/app/features/profile/public-screen.tsx) - Public profile reference
- [edit-screen.tsx](../packages/app/features/profile/edit-screen.tsx) - Edit profile form
- [this-week-events-section.tsx](../packages/app/features/home/components/this-week-events-section.tsx) - Horizontal scroll pattern
- [favorites/screen.tsx](../packages/app/features/favorites/screen.tsx) - Current favorites implementation

## Notes

- Keep favorites tab file for "View All" navigation target
- Public profile screen remains unchanged
- Edit profile screen gets enhanced but keeps same navigation
- Settings screen remains full-featured at `/settings`
- All existing queries work, no database changes needed
