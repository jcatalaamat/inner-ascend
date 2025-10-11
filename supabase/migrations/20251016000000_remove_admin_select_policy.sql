-- ============================================================================
-- REMOVE ADMIN SELECT POLICIES - CAUSING HIDDEN ITEMS TO SHOW FOR ADMINS
-- Admins should NOT see hidden items in public feeds
-- They can view items directly via the report detail screen if needed
-- ============================================================================

-- Remove admin SELECT policies that allow viewing all events
DROP POLICY IF EXISTS "Admins can view all events including hidden" ON events;
DROP POLICY IF EXISTS "Admins can view all places including hidden" ON places;

-- ============================================================================
-- Notes:
-- - Admins now see the same filtered view as regular users
-- - Hidden items are truly hidden for everyone
-- - Admins can still UPDATE/DELETE any item (those policies remain)
-- - If needed, admin panel can query items directly without the filter
-- ============================================================================
