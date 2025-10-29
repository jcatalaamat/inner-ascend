# Task: Add COMMUNITY Tab with Live Calls Calendar

## Context

The Inner Ascend app is a spiritual practice and healing app. Currently it has 4 tabs: TODAY, JOURNEY, PRACTICES, PROGRESS.

We need to add a **5th tab: COMMUNITY** that shows upcoming live group calls, workshops, and healing circles.

## Goal

Create a new tab in the bottom navigation that displays:
- Upcoming live community calls/sessions
- Calendar-style view
- Session details (date, time, title, description)
- Join/RSVP functionality
- Link to Zoom/meeting room

## Current Navigation Structure

**File:** `apps/expo/app/(drawer)/(tabs)/_layout.tsx`

**Current Tabs:**
1. `index.tsx` - TODAY (Home icon)
2. `journey.tsx` - JOURNEY (Map icon)
3. `practices.tsx` - PRACTICES (Heart icon)
4. `progress.tsx` - PROGRESS (Activity icon)

**Need to add:**
5. `community.tsx` - COMMUNITY (Users/People icon)

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

**UI Components:**
- Card, Button, Text, XStack, YStack, ScrollView, Spinner
- All from `@my/ui`

## Tasks

### 1. Update Navigation Layout

**File:** `apps/expo/app/(drawer)/(tabs)/_layout.tsx`

Add 5th tab for COMMUNITY:
- Icon: Users/People icon (find appropriate icon from existing icon set)
- Label: "COMMUNITY" or "Community"
- Route: `community.tsx`
- Order: Place after PROGRESS (last tab)

### 2. Create Database Schema

**New table needed:** `live_sessions`

```sql
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url TEXT, -- Zoom/Google Meet link
  meeting_password TEXT,
  facilitator TEXT,
  max_participants INTEGER,
  session_type TEXT, -- 'healing_circle', 'workshop', 'meditation', 'q_and_a'
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: RSVP tracking
CREATE TABLE session_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_status TEXT CHECK (rsvp_status IN ('yes', 'maybe', 'no')) DEFAULT 'yes',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Enable RLS
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_rsvps ENABLE ROW LEVEL SECURITY;

-- Policies (everyone can view live sessions)
CREATE POLICY "Anyone can view published live sessions" ON live_sessions
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view own RSVPs" ON session_rsvps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own RSVPs" ON session_rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVPs" ON session_rsvps
  FOR UPDATE USING (auth.uid() = user_id);
```

**Migration file location:** `supabase/migrations/YYYYMMDDHHMMSS_add_live_sessions.sql`

### 3. Create React Query Hooks

**File:** `packages/app/utils/react-query/useLiveSessionsQuery.ts`

```typescript
import type { Database } from '@my/supabase/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

type LiveSession = Database['public']['Tables']['live_sessions']['Row']
type SessionRsvp = Database['public']['Tables']['session_rsvps']['Row']

/**
 * Hook to fetch upcoming live sessions
 */
export function useUpcomingSessionsQuery() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['live-sessions', 'upcoming'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      const result = await supabase
        .from('live_sessions')
        .select('*')
        .gte('session_date', today)
        .eq('is_published', true)
        .order('session_date', { ascending: true })
        .order('session_time', { ascending: true })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as LiveSession[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch past sessions
 */
export function usePastSessionsQuery() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['live-sessions', 'past'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      const result = await supabase
        .from('live_sessions')
        .select('*')
        .lt('session_date', today)
        .eq('is_published', true)
        .order('session_date', { ascending: false })
        .limit(10)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data as LiveSession[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to RSVP to a session
 */
export function useRsvpMutation() {
  const supabase = useSupabase()
  const user = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId, status }: { sessionId: string, status: 'yes' | 'maybe' | 'no' }) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const result = await supabase
        .from('session_rsvps')
        .upsert({
          session_id: sessionId,
          user_id: user.id,
          rsvp_status: status,
        })
        .select()
        .single()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['session-rsvps'] })
    },
  })
}
```

### 4. Create Community Screen

**File:** `apps/expo/app/(drawer)/(tabs)/community.tsx`

**Screen Structure:**

```tsx
import { ScrollView, Text, Card, YStack, Button, XStack, Spinner } from '@my/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Linking } from 'react-native'
import { useUpcomingSessionsQuery, usePastSessionsQuery, useRsvpMutation } from 'app/utils/react-query/useLiveSessionsQuery'

export default function CommunityScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const { data: upcomingSessions, isLoading: upcomingLoading } = useUpcomingSessionsQuery()
  const { data: pastSessions, isLoading: pastLoading } = usePastSessionsQuery()
  const rsvpMutation = useRsvpMutation()

  // ... implementation
}
```

**Features to include:**

1. **Header**
   - Title: "COMMUNITY"
   - Subtitle: "Join us for live healing circles & workshops"

2. **Tab Switcher**
   - "Upcoming" (default)
   - "Past Sessions"

3. **Upcoming Sessions View**
   - Cards for each session showing:
     - Date & time (formatted, with timezone)
     - Title
     - Duration
     - Facilitator
     - Brief description
     - "Join Call" button (opens meeting_url)
     - RSVP buttons (Yes/Maybe)
   - Empty state: "No upcoming sessions scheduled. Check back soon! 🌙"

4. **Past Sessions View**
   - Similar cards but:
     - "Recording Available" if applicable
     - No RSVP buttons
     - Muted colors to show they're past

5. **Session Card Design**
   - Use Card component with cosmic theme
   - Show date prominently (like "FRI, NOV 15" in large text)
   - Time with timezone indicator
   - Visual indicator for session type (healing circle 🌙, workshop 📚, etc.)
   - RSVP count if available (optional)

### 5. Empty State Design

When no sessions exist:

```tsx
<Card padding="$6" backgroundColor="$deepSpace2" alignItems="center">
  <Text fontSize="$7" marginBottom="$3">
    🌙
  </Text>
  <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2" textAlign="center">
    No Upcoming Sessions
  </Text>
  <Text color="$silverMoon2" textAlign="center" fontSize="$3" lineHeight="$2">
    Live healing circles and workshops will be announced here. Stay tuned for upcoming gatherings in our sacred space.
  </Text>
</Card>
```

### 6. Date/Time Formatting

Use proper date formatting:
```typescript
const formatSessionDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).toUpperCase()
}

const formatSessionTime = (timeStr: string) => {
  // Convert 24h time to 12h format with AM/PM
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
```

### 7. Join Call Functionality

```typescript
const handleJoinCall = async (meetingUrl: string) => {
  const canOpen = await Linking.canOpenURL(meetingUrl)
  if (canOpen) {
    await Linking.openURL(meetingUrl)
  } else {
    // Show error toast or alert
    console.error('Cannot open meeting URL')
  }
}
```

## Design Reference

Look at these screens for inspiration:
- `apps/expo/app/(drawer)/(tabs)/journey.tsx` - Good card layout with states
- `apps/expo/app/module/[id].tsx` - Excellent visual hierarchy
- `apps/expo/app/(drawer)/(tabs)/practices.tsx` - Tab switching pattern

## Requirements

1. ✅ Add 5th tab to navigation
2. ✅ Create database schema and migration
3. ✅ Create React Query hooks
4. ✅ Build Community screen with upcoming/past tabs
5. ✅ Format dates/times properly with timezone
6. ✅ Enable joining calls via URL
7. ✅ Optional RSVP functionality
8. ✅ Beautiful empty states
9. ✅ Loading states
10. ✅ Match cosmic theme and design quality of other tabs

## Optional Enhancements (Nice to Have)

- Calendar month view instead of list
- Push notifications for upcoming sessions (24h before, 1h before)
- Add session to device calendar
- Show participant count/avatars
- Session recordings library
- Chat/comments per session
- Recurring sessions support
- Session categories/filters

## Success Criteria

- ✅ 5th tab appears in navigation
- ✅ Screen loads and shows sessions from database
- ✅ Users can see upcoming and past sessions
- ✅ Join call button opens meeting URL
- ✅ RSVP works and saves to database
- ✅ Empty states are beautiful and encouraging
- ✅ Design matches cosmic theme
- ✅ Feels like a sacred gathering space

## Admin Considerations

You'll need a way to create/manage sessions. Options:
1. Supabase dashboard (manual SQL inserts) - quick for now
2. Admin panel (future feature)
3. External service integration (Calendly, Google Calendar sync)

For MVP, manual SQL inserts via Supabase dashboard are fine.

## Sample Data (for testing)

```sql
INSERT INTO live_sessions (title, description, session_date, session_time, duration_minutes, meeting_url, facilitator, session_type) VALUES
('New Moon Healing Circle', 'Join us for a sacred healing circle under the new moon. We will work with shadow integration and release what no longer serves.', '2024-11-15', '19:00:00', 90, 'https://zoom.us/j/example', 'Astral Amat', 'healing_circle'),
('Shadow Work Workshop', 'Deep dive into shadow work practices. Learn techniques for identifying and integrating your shadow aspects.', '2024-11-22', '18:00:00', 120, 'https://zoom.us/j/example2', 'Astral Amat', 'workshop'),
('Community Meditation', 'Group meditation session focusing on heart opening and compassion.', '2024-11-29', '20:00:00', 60, 'https://zoom.us/j/example3', 'Guest Facilitator', 'meditation');
```

## Notes

- This is a community-building feature - make it feel warm and inviting
- Live sessions are special events - give them prominence
- Keep the tone aligned with the app's spiritual/healing nature
- Consider timezone display carefully (user's local time is crucial)
- This feature can grow significantly - start simple and expand

## Deliverable

A fully functional COMMUNITY tab that:
- Shows upcoming live sessions in beautiful cards
- Allows users to join calls
- Has RSVP functionality
- Matches the design quality of other tabs
- Feels like a sacred community gathering space

Make it feel like receiving a personal invitation to a special gathering. 🌙✨
