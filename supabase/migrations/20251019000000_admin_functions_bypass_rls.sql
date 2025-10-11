-- ============================================================================
-- ADMIN FUNCTIONS WITH SECURITY DEFINER TO BYPASS RLS
-- Custom is_admin field doesn't grant Supabase permissions
-- Need functions that run as superuser to bypass RLS
-- ============================================================================

-- Drop the broken RLS policies that use is_admin checks
DROP POLICY IF EXISTS "Admins can update any event" ON events;
DROP POLICY IF EXISTS "Admins can delete any event" ON events;
DROP POLICY IF EXISTS "Admins can update any place" ON places;
DROP POLICY IF EXISTS "Admins can delete any place" ON places;

-- ============================================================================
-- FUNCTION: Admin hide event
-- ============================================================================
CREATE OR REPLACE FUNCTION admin_hide_event(event_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin_user
  FROM profiles
  WHERE id = admin_user_id;

  -- If not admin, deny
  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Hide the event
  UPDATE events
  SET hidden_by_reports = true
  WHERE id = event_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Admin delete event
-- ============================================================================
CREATE OR REPLACE FUNCTION admin_delete_event(event_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin_user
  FROM profiles
  WHERE id = admin_user_id;

  -- If not admin, deny
  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Delete the event
  DELETE FROM events
  WHERE id = event_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Admin hide place
-- ============================================================================
CREATE OR REPLACE FUNCTION admin_hide_place(place_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin_user
  FROM profiles
  WHERE id = admin_user_id;

  -- If not admin, deny
  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Hide the place
  UPDATE places
  SET hidden_by_reports = true
  WHERE id = place_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Admin delete place
-- ============================================================================
CREATE OR REPLACE FUNCTION admin_delete_place(place_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin_user
  FROM profiles
  WHERE id = admin_user_id;

  -- If not admin, deny
  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Delete the place
  DELETE FROM places
  WHERE id = place_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Grant execute permissions
-- ============================================================================
GRANT EXECUTE ON FUNCTION admin_hide_event(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_event(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_hide_place(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_place(UUID, UUID) TO authenticated;

-- ============================================================================
-- Notes:
-- - SECURITY DEFINER runs functions as the function owner (superuser)
-- - This bypasses RLS completely
-- - Functions check is_admin internally before performing action
-- - Non-admins will get "User is not an admin" error
-- ============================================================================
