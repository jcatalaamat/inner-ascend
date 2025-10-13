-- ============================================================================
-- RSVP / "I'M GOING" SYSTEM
-- Community RSVP system for events with social proof and attendee tracking
-- ============================================================================

-- ============================================================================
-- TABLE: event_attendees
-- Store RSVP responses for events
-- ============================================================================
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event and user references
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- RSVP status
  status TEXT CHECK (status IN ('going', 'interested', 'maybe')) NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate RSVPs (one RSVP per user per event)
  UNIQUE(event_id, user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON event_attendees(status);
CREATE INDEX idx_event_attendees_created_at ON event_attendees(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_event_attendees_event_status ON event_attendees(event_id, status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Anyone can view attendees (public social proof)
CREATE POLICY "Anyone can view event attendees"
  ON event_attendees FOR SELECT
  USING (true);

-- Authenticated users can RSVP
CREATE POLICY "Authenticated users can create RSVPs"
  ON event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Users can update their own RSVPs
CREATE POLICY "Users can update their own RSVPs"
  ON event_attendees FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own RSVPs
CREATE POLICY "Users can delete their own RSVPs"
  ON event_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: Get attendee count by status
-- ============================================================================
CREATE OR REPLACE FUNCTION get_event_attendee_count(p_event_id UUID, p_status TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM event_attendees
  WHERE event_id = p_event_id
    AND status = p_status;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get total attendee count (all statuses)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_event_total_attendees(p_event_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM event_attendees
  WHERE event_id = p_event_id
    AND status = 'going';
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get user's RSVP status for an event
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_rsvp_status(p_event_id UUID, p_user_id UUID)
RETURNS TEXT AS $$
  SELECT status
  FROM event_attendees
  WHERE event_id = p_event_id
    AND user_id = p_user_id
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Update timestamp on RSVP changes
-- ============================================================================
CREATE TRIGGER update_event_attendees_modtime
  BEFORE UPDATE ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- ============================================================================
-- Grant permissions
-- ============================================================================
GRANT SELECT ON event_attendees TO authenticated;
GRANT SELECT ON event_attendees TO anon;
GRANT INSERT, UPDATE, DELETE ON event_attendees TO authenticated;
GRANT EXECUTE ON FUNCTION get_event_attendee_count(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_event_attendee_count(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_event_total_attendees(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_event_total_attendees(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_rsvp_status(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_rsvp_status(UUID, UUID) TO anon;
