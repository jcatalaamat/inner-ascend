-- ============================================================================
-- ADD COLLABORATORS TO EVENTS AND PLACES
-- Support multiple creators/organizers for future collaboration features
-- ============================================================================

-- Add collaborator_ids to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS collaborator_ids UUID[] DEFAULT '{}';

-- Add collaborator_ids to places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS collaborator_ids UUID[] DEFAULT '{}';

-- Create indexes for array contains queries
CREATE INDEX IF NOT EXISTS idx_events_collaborator_ids ON events USING GIN(collaborator_ids);
CREATE INDEX IF NOT EXISTS idx_places_collaborator_ids ON places USING GIN(collaborator_ids);

-- Update RLS policies for events to allow collaborators to edit
DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events or events they collaborate on"
  ON events FOR UPDATE
  USING (auth.uid() = profile_id OR auth.uid() = ANY(collaborator_ids));

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events or events they collaborate on"
  ON events FOR DELETE
  USING (auth.uid() = profile_id OR auth.uid() = ANY(collaborator_ids));

-- Update RLS policies for places to allow collaborators to edit
DROP POLICY IF EXISTS "Authenticated users can create places" ON places;
CREATE POLICY "Authenticated users can create places"
  ON places FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own places" ON places;
CREATE POLICY "Users can update their own places or places they collaborate on"
  ON places FOR UPDATE
  USING (auth.uid() = ANY(collaborator_ids));

DROP POLICY IF EXISTS "Users can delete their own places" ON places;
CREATE POLICY "Users can delete their own places or places they collaborate on"
  ON places FOR DELETE
  USING (auth.uid() = ANY(collaborator_ids));

-- Backfill existing events: set collaborator_ids to [profile_id] where profile_id exists
UPDATE events
SET collaborator_ids = ARRAY[profile_id]
WHERE profile_id IS NOT NULL AND collaborator_ids = '{}';

-- For places, we don't have profile_id yet, so we'll set it when creating new ones
-- Legacy places will have empty collaborator_ids array

-- Comments
COMMENT ON COLUMN events.collaborator_ids IS 'Array of profile IDs who can edit this event - supports collaboration';
COMMENT ON COLUMN places.collaborator_ids IS 'Array of profile IDs who can edit this place - supports collaboration';
