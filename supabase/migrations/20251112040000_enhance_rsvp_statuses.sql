-- ============================================================================
-- ENHANCE RSVP SYSTEM - Add New Statuses
-- Add "watching" and "cant_go" statuses for more granular user intent
-- ============================================================================

-- Drop existing CHECK constraint
ALTER TABLE event_attendees
DROP CONSTRAINT IF EXISTS event_attendees_status_check;

-- Add new CHECK constraint with additional statuses
ALTER TABLE event_attendees
ADD CONSTRAINT event_attendees_status_check
CHECK (status IN ('going', 'interested', 'maybe', 'watching', 'cant_go'));

-- Note: 'maybe' kept for backward compatibility but can be migrated to 'interested' later
-- 'waitlist' will be added in Phase 2 when event capacity feature is implemented
