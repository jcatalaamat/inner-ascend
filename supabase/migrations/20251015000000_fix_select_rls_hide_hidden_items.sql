-- ============================================================================
-- FIX SELECT RLS POLICIES TO HIDE REPORTED ITEMS
-- The "Anyone can view" policies currently return ALL rows (USING true)
-- This bypasses the hidden_by_reports filter in application code
-- ============================================================================

-- ============================================================================
-- Events Table - Fix SELECT Policy
-- ============================================================================

-- Drop the old policy that shows everything
DROP POLICY IF EXISTS "Anyone can view events" ON events;

-- Create new policy that excludes hidden items
CREATE POLICY "Anyone can view non-hidden events"
  ON events FOR SELECT
  USING (
    hidden_by_reports = false OR hidden_by_reports IS NULL
  );

-- Admins can see hidden events too (for moderation)
CREATE POLICY "Admins can view all events including hidden"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- Places Table - Fix SELECT Policy
-- ============================================================================

-- Drop the old policy that shows everything
DROP POLICY IF EXISTS "Anyone can view places" ON places;

-- Create new policy that excludes hidden items
CREATE POLICY "Anyone can view non-hidden places"
  ON places FOR SELECT
  USING (
    hidden_by_reports = false OR hidden_by_reports IS NULL
  );

-- Admins can see hidden places too (for moderation)
CREATE POLICY "Admins can view all places including hidden"
  ON places FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- Notes:
-- - The OR hidden_by_reports IS NULL ensures backwards compatibility
-- - Admins get a separate policy to view hidden items for moderation
-- - These policies work at the DATABASE level, not just in app code
-- ============================================================================
