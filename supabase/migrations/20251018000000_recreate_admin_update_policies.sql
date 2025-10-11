-- ============================================================================
-- RECREATE ADMIN UPDATE POLICIES - THEY WERE LOST OR BROKEN
-- Error: "new row violates row-level security policy"
-- This means UPDATE policies are not working
-- ============================================================================

-- First, drop any existing admin update policies to start fresh
DROP POLICY IF EXISTS "Admins can update any event" ON events;
DROP POLICY IF EXISTS "Admins can delete any event" ON events;
DROP POLICY IF EXISTS "Admins can update any place" ON places;
DROP POLICY IF EXISTS "Admins can delete any place" ON places;

-- ============================================================================
-- Events Table - Admin UPDATE and DELETE Policies
-- ============================================================================

-- Allow admins to update any event (for hiding via hidden_by_reports)
-- IMPORTANT: WITH CHECK clause is also needed for UPDATE policies!
CREATE POLICY "Admins can update any event"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
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
-- Places Table - Admin UPDATE and DELETE Policies
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
  )
  WITH CHECK (
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
-- - UPDATE policies need BOTH USING and WITH CHECK clauses
-- - USING: checks if user can select the row
-- - WITH CHECK: checks if the new row values are allowed
-- - Both must pass for UPDATE to succeed
-- ============================================================================
