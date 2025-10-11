-- ============================================================================
-- REMOVE SELECT RLS POLICIES - LET APPLICATION HANDLE VISIBILITY
-- This allows events/places detail screens to show hidden items naturally
-- while home/events screens filter them client-side
-- ============================================================================

-- Drop the restrictive SELECT policies
DROP POLICY IF EXISTS "Anyone can view non-hidden events" ON events;
DROP POLICY IF EXISTS "Anyone can view non-hidden places" ON places;

-- Create permissive SELECT policies (everyone can see everything)
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view places"
  ON places FOR SELECT
  USING (true);
