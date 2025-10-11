-- ============================================================================
-- FIX RESTORE TRIGGER - STOP UNDOING ADMIN HIDE ACTIONS
-- The trigger was restoring items even when admin chose to hide them
-- ============================================================================

-- Drop the broken trigger and function
DROP TRIGGER IF EXISTS trigger_restore_item_on_dismiss ON reports;
DROP FUNCTION IF EXISTS restore_item_on_dismiss();

-- ============================================================================
-- NEW FUNCTION: Only restore items when report is DISMISSED (not resolved)
-- ============================================================================
CREATE OR REPLACE FUNCTION restore_item_on_dismiss()
RETURNS TRIGGER AS $$
DECLARE
  remaining_reports INTEGER;
BEGIN
  -- CRITICAL FIX: Only restore when report is DISMISSED with no_action
  -- Do NOT restore when report is RESOLVED with hide_item or remove_item
  IF OLD.status = 'pending'
     AND NEW.status = 'dismissed'
     AND NEW.resolution_action = 'no_action' THEN

    -- Check if any pending reports remain for this item
    SELECT COUNT(*) INTO remaining_reports
    FROM reports
    WHERE item_id = NEW.item_id
      AND item_type = NEW.item_type
      AND status = 'pending';

    -- If no pending reports remain, restore visibility
    IF remaining_reports = 0 THEN
      CASE NEW.item_type
        WHEN 'event' THEN
          UPDATE events SET hidden_by_reports = false WHERE id = NEW.item_id;
        WHEN 'place' THEN
          UPDATE places SET hidden_by_reports = false WHERE id = NEW.item_id;
        ELSE
          NULL;
      END CASE;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger with fixed function
CREATE TRIGGER trigger_restore_item_on_dismiss
  AFTER UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION restore_item_on_dismiss();

-- ============================================================================
-- Notes:
-- - Items are now ONLY restored when report is dismissed (no action)
-- - Items hidden by admin (resolution_action = 'hide_item') stay hidden
-- - Items deleted by admin (resolution_action = 'remove_item') stay deleted
-- - Admin must explicitly reopen report to unhide an item
-- ============================================================================
