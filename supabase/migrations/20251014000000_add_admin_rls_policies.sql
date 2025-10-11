-- ============================================================================
-- ADMIN RLS POLICIES FOR MODERATION
-- Allow admins to update/delete ANY events and places for moderation purposes
-- ============================================================================

-- ============================================================================
-- Events Table - Admin Policies
-- ============================================================================

-- Allow admins to update any event (for hiding via hidden_by_reports)
CREATE POLICY "Admins can update any event"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to delete any event (for permanent removal)
CREATE POLICY "Admins can delete any event"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- Places Table - Admin Policies
-- ============================================================================

-- Allow admins to update any place (for hiding via hidden_by_reports)
CREATE POLICY "Admins can update any place"
  ON places FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to delete any place (for permanent removal)
CREATE POLICY "Admins can delete any place"
  ON places FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- Notes:
-- - These policies work alongside existing "Users can update their own" policies
-- - Admins can now moderate (hide/delete) ANY content, not just their own
-- - The is_admin check ensures only authorized users have this power
-- ============================================================================
