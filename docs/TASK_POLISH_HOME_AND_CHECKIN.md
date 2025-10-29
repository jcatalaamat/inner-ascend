# Task: Polish HOME Screen and Enhance Emotional Check-In

## Context

The Inner Ascend app is a spiritual practice and healing app based on the "Being Human 101" curriculum. The **TODAY (HOME) screen** is the first thing users see and serves as their daily dashboard for their healing journey.

The screen currently works functionally but needs polish and the emotional check-in feature needs enhancement.

## Current State

**File Location:** `apps/expo/app/(drawer)/(tabs)/index.tsx`

**What Works:**
- ✅ Shows current date with moon emoji
- ✅ Displays cosmic weather (static inspirational text)
- ✅ Shows current day's practice from Module 1 (or "Begin Your Journey" empty state)
- ✅ Emotional check-in buttons (saves to database)
- ✅ Streak counter (shows real data or encouragement to start)
- ✅ Proper loading states with spinner
- ✅ Safe area handling

**Current Emotional Check-In:**
- 4 buttons: Struggling, Processing, Clear, Integrated
- Shows green checkmark when user has checked in today
- Saves to `emotional_checkins` table
- Basic button layout with theme colors

## What Needs Polish

### 1. Emotional Check-In Enhancement
**Current Issues:**
- Buttons are basic, just theme colored
- No visual feedback beyond theme change
- No explanation of what each state means
- Could feel more like a meaningful ritual
- No history/tracking visible

**Improvements Needed:**
- Better visual design for the 4 emotional states
- Add subtle icons or colors per state
- Show brief descriptions when selected (optional)
- More celebratory feedback when checking in
- Consider showing streak of check-ins
- Add subtle animations or transitions
- Make it feel like a sacred daily practice

### 2. Home Screen Overall Polish
**Areas to Improve:**
- Cosmic Weather card could be more visually interesting
- Today's Practice card could show more preview info
- Spacing and hierarchy could be refined
- Add smooth transitions between states
- Empty state ("Begin Your Journey") could be more inspiring
- Consider adding a welcome message for first-time users
- Streak section could be more prominent/celebratory

### 3. Visual Hierarchy
- Header (TODAY + date) is good
- Card sections need better visual separation
- Consider using borderColor or subtle shadows
- Typography hierarchy could be stronger

## Design System (Cosmic Theme)

**Colors:**
- `$deepSpace1` - Main background (#0A0A0F)
- `$deepSpace2` - Card backgrounds (#141420)
- `$deepSpace3` - Darker elements (#1A1A2E)
- `$cosmicViolet` - Primary accent (#9D4EDD)
- `$silverMoon` - Primary text (#E8E8E8)
- `$silverMoon2` - Secondary text (#B8B8B8)
- `$silverMoon3` - Tertiary text (#888888)
- `$integrationGreen` - Success/complete (#4CAF50)
- `$innerChildGold` - Highlights (#FFD700)

**Emotional State Color Suggestions:**
- **Struggling** - Could use warm orange/red tones (create if needed, or use existing)
- **Processing** - Could use amber/yellow tones
- **Clear** - Could use blue/teal tones (or silverMoon)
- **Integrated** - Use `$integrationGreen`

## Data & Hooks Available

**Hooks in use:**
```typescript
import { useModuleDayContentQuery } from 'app/utils/react-query/useModuleContentQuery'
import { useProgressSummaryQuery } from 'app/utils/react-query/useUserProgressQuery'
import { useStreakStatsQuery } from 'app/utils/react-query/useStreakQuery'
import { useEmotionalCheckInMutation, useTodayCheckInQuery } from 'app/utils/react-query/useEmotionalCheckInMutation'
```

**Emotional Check-In Hook:**
```typescript
const { data: todayCheckIn } = useTodayCheckInQuery()
// Returns: { emotion_state: 'struggling' | 'processing' | 'clear' | 'integrated', checkin_date: string } | null

const checkInMutation = useEmotionalCheckInMutation()
// Usage: checkInMutation.mutate('struggling')
```

## Goals

### 1. Redesign Emotional Check-In Section

**Option A: Enhanced Buttons**
- Larger, more visual buttons
- Add emoji or icon per state
- Show description on hover/press
- Better color differentiation
- Smooth press animations

**Option B: Card-Based Selection**
- Each emotional state as a card
- Tap to select
- Show brief description
- Visual feedback (border glow, color shift)

**Option C: Scale/Slider**
- Visual scale from Struggling → Integrated
- More nuanced selection
- Modern UI pattern

**Recommend: Option A or B** - Keep it simple but make it beautiful

**Suggested Emoji/Icons:**
- 😓 Struggling - "I'm having a hard time today"
- 🌀 Processing - "I'm working through something"
- ✨ Clear - "I feel aligned and clear"
- 🌟 Integrated - "I feel whole and at peace"

### 2. Add Check-In Feedback
When user checks in:
- Show a brief success message or animation
- Celebrate the practice of checking in
- Maybe show: "Thank you for honoring your journey" or similar
- Confetti effect? (optional, might be too much)
- Subtle fade-in of the checkmark

### 3. Polish Cosmic Weather Card
- Currently just text in a card
- Could add:
  - Moon phase emoji or icon
  - Rotating daily wisdom (still static, but feels fresh)
  - More poetic formatting
  - Subtle visual elements (stars, gradient?)

### 4. Enhance Today's Practice Card
**Currently shows:**
- Module title, day number
- Day title
- Teaching heading

**Could add:**
- Practice type icon (🧘 meditation, 📝 journaling)
- Time estimate
- Progress indicator (Day X of Y with visual progress bar?)
- More enticing preview
- Better call-to-action

### 5. Streak Section Enhancement
**Current:**
- Shows "🔥 X Day Streak" or encouragement message

**Could improve:**
- Bigger, more celebratory for long streaks
- Milestone celebrations (7 days! 30 days!)
- Visual progress toward next milestone?
- Animation when opening screen with active streak

### 6. Add Micro-Interactions
- Smooth fade-ins when loading
- Button press feedback
- Card press states (for Today's Practice)
- Gentle animations (not overdone)

## Reference Screens

**Well-polished screens in the app:**
- `apps/expo/app/journaling.tsx` - Recently polished, good reference for spacing and hierarchy
- `apps/expo/app/module/[id].tsx` - Excellent card hierarchy and button states
- `apps/expo/app/(drawer)/(tabs)/journey.tsx` - Good use of visual states (completed, active, locked)

## Requirements

1. **Maintain all existing functionality** - Don't break data fetching or mutations
2. **Database integration must work** - Check-in should save properly
3. **Use cosmic design system** - Consistent colors and spacing
4. **Mobile-first** - Looks great on small screens
5. **Performant** - No unnecessary re-renders
6. **Feel meaningful** - This is users' daily ritual, make it special
7. **Safe area handling** - Already implemented, keep it

## Emotional Check-In: Detailed Specs

### Database Table (Already Exists)
```sql
CREATE TABLE emotional_checkins (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  emotion_state TEXT NOT NULL CHECK (emotion_state IN ('struggling', 'processing', 'clear', 'integrated')),
  checkin_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);
```

### Hook Functions
```typescript
// Check if user checked in today
const { data: todayCheckIn } = useTodayCheckInQuery()

// Perform check-in (creates or updates today's entry)
const checkInMutation = useEmotionalCheckInMutation()
checkInMutation.mutate('struggling') // or 'processing', 'clear', 'integrated'

// Check mutation state
checkInMutation.isPending // true while saving
```

### UX Flow
1. User opens app → sees check-in section
2. If not checked in yet: All 4 options available, inviting
3. User taps one → Button shows loading state briefly
4. Success → Show feedback ("✓ You checked in as: struggling")
5. User can change their mind → Tap different button, updates DB

### Design Considerations
- Should feel **safe** and **non-judgmental**
- "Struggling" is not bad - it's honest and brave
- "Integrated" is not the goal all the time - it's a spectrum
- Language should be warm and accepting
- This is a tool for self-awareness, not performance tracking

## Suggested Copy

**Section Title Options:**
- "How are you feeling today?"
- "Today's Emotional Check-In"
- "Check in with yourself"
- "Honoring where you are"

**State Descriptions (if shown):**
- **Struggling**: "I'm having a hard time. That's okay."
- **Processing**: "I'm working through something. I'm in it."
- **Clear**: "I feel aligned and present."
- **Integrated**: "I feel whole and at peace."

**After Check-In:**
- "Thank you for honoring your journey"
- "Your honesty is your power"
- "Witnessed and held"
- Simply: "✓ Checked in"

## Success Criteria

The HOME screen should:
- ✅ Feel like a warm, welcoming daily ritual
- ✅ Make emotional check-in feel meaningful, not performative
- ✅ Have excellent visual hierarchy and spacing
- ✅ Show real data (practice, streak) in inspiring ways
- ✅ Handle empty states beautifully
- ✅ Feel cohesive with cosmic theme
- ✅ Make users excited to start their day

The emotional check-in should:
- ✅ Feel safe and non-judgmental
- ✅ Be easy and quick to use
- ✅ Provide gentle feedback
- ✅ Save properly to database
- ✅ Show visual confirmation of choice
- ✅ Feel like a meaningful practice, not a checkbox

## Notes

- This is users' **first interaction** every day - make it count
- Balance between data/functionality and inspiration/beauty
- Users are on a healing journey - meet them with warmth
- For App Store submission - this needs to shine
- Avoid being too prescriptive - trust your design instincts within the cosmic theme

## Deliverable

A polished `index.tsx` file that:
- Has a beautifully redesigned emotional check-in experience
- Maintains all current functionality
- Elevates the overall HOME screen visual design
- Feels warm, inviting, and meaningful
- Makes users look forward to checking in daily

Remember: This is their daily sanctuary. Make it feel sacred. 🌙✨

## Optional Enhancements (Nice to Have)

- Streaks: Show visual progress to milestones (7, 14, 30 days)
- Check-in history: Maybe show last 7 days as dots?
- Time of day awareness: "Good morning" vs "Good evening"
- Personalization: Show user's name if available
- Smooth page transitions/animations
- Haptic feedback on check-in (if mobile)

Focus on core polish first, then add optional enhancements if time permits!

---

## IMPORTANT: Live Calls Feature Request

The app needs a place to show **upcoming live community calls** (group sessions, workshops, healing circles, etc.).

### Placement Options:

**Option 1: Add to HOME (TODAY) screen**
- Add a "Upcoming Live Sessions" card
- Shows next 1-2 upcoming calls
- Click to see calendar/details
- Pros: High visibility, users see it daily
- Cons: Makes HOME screen longer

**Option 2: Separate "Community" or "Events" tab**
- Add a 5th tab to the navigation
- Full calendar view of live calls
- More space for details and RSVP
- Pros: Dedicated space, can be comprehensive
- Cons: Requires navigation redesign

**Option 3: Add to PRACTICES tab**
- Live calls are a type of practice
- Add 4th tab "Live Sessions" alongside Meditations/Journaling/Exercises
- Pros: Logical grouping, no nav changes
- Cons: Might get lost in practices

**Option 4: Combination approach**
- Show next live call on HOME (mini card)
- Full calendar in a dedicated place (new tab or in practices)
- Pros: Best of both worlds
- Cons: More work

### Recommended Approach:

**For MVP (minimum viable):**
Add to HOME screen as "Upcoming Live Sessions" card, showing:
- Next 1-2 upcoming calls
- Date/time
- Title
- "View Calendar" button that links to external calendar or future in-app calendar

**For future enhancement:**
Create dedicated Community/Events screen with full calendar integration.

### Data Needs:

Will need:
- Database table for `live_sessions` or integration with calendar API
- Fields: title, description, date/time, zoom_link/meeting_url, max_participants?, rsvp tracking?
- Consider using external service (Calendly, Zoom, Google Calendar) vs building in-app

### Design Considerations:

- Should feel like a **special invitation** not a calendar notification
- Use cosmic theme (moon phases for timing?)
- Show timezone handling (user's local time)
- RSVP/reminder functionality?
- Past sessions recording access?

**Note to implementer:** If adding this feature now, keep it simple - just show upcoming calls with basic info. Can be expanded later with RSVP, reminders, recordings, etc.
