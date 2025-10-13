# RSVP / "I'm Going" System

## Overview

The RSVP system allows users to indicate their attendance status for events, providing social proof and helping organizers gauge interest. This feature follows the same patterns as the Reports and Filters systems.

## Features

- **Three RSVP statuses**: Going, Interested, Maybe
- **Social proof**: Display attendee counts on event cards
- **Attendee list**: Show profile pictures of people attending
- **User management**: Users can update or cancel their RSVP
- **Real-time updates**: Automatic query invalidation on RSVP changes
- **PostHog tracking**: All RSVP actions are tracked
- **Bilingual**: Full English and Spanish translations

## Database Schema

Location: `/supabase/migrations/20251012000000_add_rsvp_system.sql`

### Table: `event_attendees`

```sql
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('going', 'interested', 'maybe')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

### Security
- **Row Level Security (RLS)** enabled
- Anyone can view attendees (public social proof)
- Only authenticated users can RSVP
- Users can only update/delete their own RSVPs

### Helper Functions
- `get_event_attendee_count(event_id, status)` - Count attendees by status
- `get_event_total_attendees(event_id)` - Get total "going" count
- `get_user_rsvp_status(event_id, user_id)` - Get user's RSVP status

## TypeScript Types

Location: `/packages/app/utils/attendee-types.ts`

```typescript
export type AttendeeStatus = 'going' | 'interested' | 'maybe'

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  status: AttendeeStatus
  created_at: string
  updated_at: string
}

export interface AttendeeWithProfile extends EventAttendee {
  profile?: {
    id: string
    name: string | null
    avatar_url: string | null
  }
}
```

## Components

### RsvpButton
Location: `/packages/app/components/RsvpButton.tsx`

Main entry point for RSVP functionality. Opens the RsvpSheet on click.

**Props:**
- `eventId: string` - Event to RSVP to
- `currentStatus?: AttendeeStatus | null` - User's current RSVP status
- `variant?: 'outlined' | 'ghost' | 'primary'` - Button style
- `size?: '$2' | '$3' | '$4' | '$5'` - Button size
- `fullWidth?: boolean` - Full width button
- `showIcon?: boolean` - Show check icon
- `onRsvpChange?: () => void` - Callback when RSVP changes

**Usage:**
```tsx
<RsvpButton
  eventId={event.id}
  currentStatus={userRsvp?.status}
  size="$5"
  fullWidth
  onRsvpChange={handleRsvpChange}
/>
```

### RsvpSheet
Location: `/packages/app/components/RsvpSheet.tsx`

Bottom sheet for selecting RSVP status. Follows the same pattern as `ReportSheet` and `FilterSheet`.

**Features:**
- Radio group for status selection
- Visual feedback for selected status
- Submit button
- Cancel RSVP option (if user has existing RSVP)
- Toast notifications
- PostHog event tracking

### AttendeeList
Location: `/packages/app/components/AttendeeList.tsx`

Displays attendee avatars and count.

**Props:**
- `attendees: AttendeeWithProfile[]` - List of attendees
- `maxDisplay?: number` - Max avatars to show (default: 5)
- `showCount?: boolean` - Show attendee count (default: true)
- `size?: 'small' | 'medium' | 'large'` - Avatar size

**Usage:**
```tsx
<AttendeeList
  attendees={attendees}
  maxDisplay={5}
  size="medium"
/>
```

### AttendeesSection
Full attendees section for event detail screens.

**Props:**
- `attendees: AttendeeWithProfile[]` - List of attendees
- `goingCount: number` - Total "going" count
- `currentUserStatus?: string | null` - Current user's RSVP status

## React Query Hooks

Location: `/packages/app/utils/react-query/useRsvpQuery.ts`

### Queries

**useEventAttendeesQuery(eventId)**
Fetches all attendees for an event (only "going" status).

**useEventAttendeeCountsQuery(eventId)**
Gets counts by status (going, interested, maybe, total).

**useUserRsvpQuery(eventId)**
Gets the current user's RSVP status for an event.

**useUserRsvpsQuery()**
Gets all events the user has RSVP'd to.

### Mutations

**useRsvpMutation()**
Create or update user's RSVP.

```tsx
const rsvpMutation = useRsvpMutation()

rsvpMutation.mutate({
  eventId: 'uuid',
  status: 'going'
})
```

**useRemoveRsvpMutation()**
Remove user's RSVP.

```tsx
const removeRsvpMutation = useRemoveRsvpMutation()

removeRsvpMutation.mutate('event-id')
```

## Translations

Location: `/packages/app/i18n/locales/`

### Keys

```json
{
  "rsvp": {
    "title": "Are you attending?",
    "status": {
      "going": "Going",
      "interested": "Interested",
      "maybe": "Maybe"
    },
    "people_going": "{{count}} going",
    "attendees_section_title": "Who's Going",
    "success": "RSVP updated successfully!",
    ...
  }
}
```

## Integration

### EventCard
The EventCard component now displays the attendee count at the bottom of the card overlay.

```tsx
{showAttendees && goingCount > 0 && (
  <XStack ai="center" gap="$1.5">
    <Users size={14} color="white" />
    <Text fontSize="$3" color="white" fontWeight="600">
      {t('rsvp.people_going', { count: goingCount })}
    </Text>
  </XStack>
)}
```

### EventDetailScreen
The event detail screen shows:
1. **Primary RSVP button** - Large, prominent button at the top
2. **Attendees section** - Shows who's going with avatars
3. **User badge** - "You're going!" indicator if user RSVP'd

## PostHog Events

All RSVP actions are tracked:

```typescript
// Button click
posthog.capture('rsvp_button_clicked', {
  event_id: eventId,
  has_existing_rsvp: !!currentStatus,
  current_status: currentStatus,
})

// RSVP submitted
posthog.capture('rsvp_submitted', {
  event_id: eventId,
  status,
  is_update: !!currentStatus,
})

// RSVP removed
posthog.capture('rsvp_removed', {
  event_id: eventId,
  previous_status: currentStatus,
})
```

## Query Invalidation

When an RSVP is created/updated/deleted, the following queries are invalidated:
- `event_attendees` - Refetch attendee list
- `event_attendee_counts` - Refetch counts
- `user_rsvp` - Refetch user's RSVP status
- `user_rsvps` - Refetch user's all RSVPs

This ensures real-time updates across all components.

## Next Steps

### Future Enhancements
1. **Notifications** - Notify users when friends RSVP to events
2. **Attendee filtering** - Filter events by "Events I'm attending"
3. **Mutual friends** - Show "3 friends are going"
4. **Organizer notifications** - Alert organizers when people RSVP
5. **Attendee messaging** - Direct messaging between attendees
6. **Check-in system** - QR code check-in at events
7. **Waitlist** - For events at capacity

## Migration

To apply the database migration:

```bash
yarn supa reset  # Local development

# OR for production:
yarn supa deploy
```

## Testing

1. **Create RSVP**: Click RSVP button, select status, submit
2. **Update RSVP**: Click button again, change status
3. **Cancel RSVP**: Click button, select "Cancel RSVP"
4. **View attendees**: Check event detail screen for attendee list
5. **Social proof**: Verify count shows on event cards

## Conclusion

The RSVP system provides essential social proof and commitment mechanisms that are critical for event success. By showing attendee counts and profiles, it creates FOMO (fear of missing out) and encourages more people to attend events.

This implementation follows all existing patterns in the codebase:
- ✅ Similar component structure to ReportButton/ReportSheet
- ✅ React Query for data fetching with proper invalidation
- ✅ RLS policies for security
- ✅ Full i18n support
- ✅ PostHog analytics tracking
- ✅ Optimistic UI updates
