# Task: Polish and Complete the Practices Page

## Context

The Inner Ascend app is a spiritual practice and healing app based on the "Being Human 101" curriculum. The app has 4 main tabs: TODAY, JOURNEY, PRACTICES, and PROGRESS.

The **PRACTICES tab** currently displays meditation, journaling, and exercise content from JSON files. It works functionally but needs polish to match the quality of the rest of the app.

## Current State

**File Location:** `apps/expo/app/(drawer)/(tabs)/practices.tsx`

**What Works:**
- 3 tabs: Meditations, Journaling, Exercises
- Fetches data from JSON files via React Query hooks
- Displays all 7 meditations with descriptions
- Shows journaling prompts organized by 5 themes
- Shows exercises (currently 3)
- Loading states with spinner

**What Needs Polish:**
1. **Visual Design** - Cards are basic, need more breathing room and hierarchy
2. **Meditation Cards** - Should be more inviting and tappable (add practice detail screens?)
3. **Journaling Prompts** - Could use better categorization display
4. **Exercises** - Need better visual treatment
5. **Empty States** - Exercises shows basic "coming soon" text
6. **Interactivity** - Cards should feel more interactive (press states, navigation)
7. **Typography** - Could use better hierarchy and spacing
8. **Audio Indication** - Meditations have audio_url (null for now) but no visual indicator

## Design System (Cosmic Theme)

**Colors from token-colors.ts:**
- `$deepSpace1` - Main background (#0A0A0F)
- `$deepSpace2` - Card backgrounds (#141420)
- `$deepSpace3` - Darker elements (#1A1A2E)
- `$cosmicViolet` - Primary accent (#9D4EDD)
- `$silverMoon` - Primary text (#E8E8E8)
- `$silverMoon2` - Secondary text (#B8B8B8)
- `$silverMoon3` - Tertiary text (#888888)
- `$integrationGreen` - Success/complete (#4CAF50)
- `$innerChildGold` - Highlights (#FFD700)

**UI Components Available:**
- Card, Button, Text, XStack, YStack, ScrollView, Spinner
- All from `@my/ui`

## Data Structure

**Meditations** (from `packages/app/content/practices.json`):
```typescript
{
  title: string
  type: 'meditation'
  duration_minutes: number
  description: string
  fullDescription?: string
  benefits?: string[]
  instructions?: string
  bestFor?: string
  audio_url?: string | null
}
```

**Exercises:**
```typescript
{
  title: string
  type: 'exercise'
  duration_minutes: number
  description: string
  instructions: string
}
```

**Journaling Prompts:**
```typescript
{
  shadow_work: string[]
  inner_child: string[]
  core_wounds: string[]
  radical_honesty: string[]
  integration: string[]
}
```

## Goals

### 1. Polish Meditation Cards
- Add more visual hierarchy (title, duration, description)
- Show audio indicator if audio_url exists (even if null, show 🎧 grayed out)
- Make cards feel tappable with better press states
- Consider adding "Best for:" label from the data
- Add subtle borders or shadows for depth
- Improve spacing between cards
- **DECISION NEEDED:** Should cards be tappable to show full details (fullDescription, benefits, instructions)?
  - Option A: Show all info inline (makes cards taller)
  - Option B: Show summary, tap to expand accordion-style
  - Option C: Navigate to detail screen/modal with full info
  - Recommend: Start with Option A (show more inline) or Option B (expandable). Option C might be overkill for v1.

### 2. Enhance Journaling Prompts Section
- Make theme categories more prominent (use cosmicViolet for theme titles)
- Better visual separation between themes
- Consider collapsible sections if too long
- Add icons or emojis for each theme
- Improve prompt list readability

### 3. Polish Exercise Cards
- Similar treatment to meditations
- Show duration prominently
- Make them feel actionable
- Add "Start Exercise" button or make entire card tappable

### 4. Improve Tab Experience
- Current tab buttons are basic
- Could add subtle animations or better active states
- Consider showing counts per tab (e.g., "Meditations (7)")

### 5. Add Empty States / Coming Soon
- If expanding beyond current content
- Beautiful "coming soon" states with cosmic theme
- Encouraging copy

### 6. Consider Adding:
- Search/filter for meditations (optional)
- "Recently practiced" or "Favorites" section (future feature)
- Practice detail modal/screen when tapping meditation card
- Progress indicators (e.g., "Completed 3 times")

## Example of Well-Polished Screen (for reference)

The MODULE DETAIL screen (`apps/expo/app/module/[id].tsx`) is well-polished with:
- Clear hierarchy with card sections
- Good spacing (marginBottom="$4" between sections)
- Prominent titles with icons (📖, 🧘, 📝)
- Cosmic violet accents for key elements
- Buttons with proper press states
- Day navigator with visual feedback
- Safe area handling

## Requirements

1. **Maintain existing functionality** - Don't break data fetching or tab switching
2. **Use existing design system** - Cosmic colors, proper spacing tokens
3. **Keep it performant** - No unnecessary re-renders
4. **Mobile-first** - Ensure good spacing on small screens
5. **Accessible** - Good contrast, tappable areas
6. **Consistent** - Match the quality of TODAY/JOURNEY/PROGRESS tabs

## Files to Work With

**Main file:**
- `apps/expo/app/(drawer)/(tabs)/practices.tsx`

**Data source:**
- `packages/app/content/practices.json` (read-only, don't modify)

**Hooks:**
- `packages/app/utils/react-query/usePracticesQuery.ts` (already implemented, don't modify)

**Reference screens for inspiration:**
- `apps/expo/app/(drawer)/(tabs)/index.tsx` (TODAY - good empty states)
- `apps/expo/app/(drawer)/(tabs)/journey.tsx` (JOURNEY - good card states)
- `apps/expo/app/module/[id].tsx` (MODULE DETAIL - excellent hierarchy)
- `apps/expo/app/journaling.tsx` (JOURNALING - recently polished, good reference)

## Deliverable

A polished `practices.tsx` file that:
- ✅ Looks professional and inviting
- ✅ Has excellent visual hierarchy
- ✅ Uses proper spacing and cosmic theme
- ✅ Feels cohesive with rest of app
- ✅ Makes users excited to explore practices
- ✅ Has smooth interactions and press states
- ✅ Handles all three tabs beautifully

## Notes

- The app is React Native (Expo) with Tamagui for UI
- Users are on a healing/spiritual journey - keep tone warm and encouraging
- Audio files don't exist yet (audio_url is null) but design for when they do
- This is for App Store submission, so quality matters!
- Feel free to be creative within the cosmic theme guidelines

## Success Criteria

The Practices page should feel like a sanctuary of tools - inviting, organized, and beautiful. Users should be drawn to explore the meditations and prompts. It should match the polish level of the TODAY and JOURNEY tabs.

Good luck! 🌙✨
