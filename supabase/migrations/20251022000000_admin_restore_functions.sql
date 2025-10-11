-- ============================================================================
-- ADMIN RESTORE FUNCTIONS - Unhide items when reopening reports
-- ============================================================================

-- ============================================================================
-- FUNCTION: Admin restore event visibility
-- ============================================================================
CREATE OR REPLACE FUNCTION admin_restore_event(event_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin_user FROM profiles WHERE id = admin_user_id;

  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Restore event visibility (runs as superuser, bypasses RLS)
  UPDATE events SET hidden_by_reports = false WHERE id = event_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Admin restore place visibility
-- ============================================================================
CREATE OR REPLACE FUNCTION admin_restore_place(place_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin_user FROM profiles WHERE id = admin_user_id;

  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Restore place visibility (runs as superuser, bypasses RLS)
  UPDATE places SET hidden_by_reports = false WHERE id = place_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
