-- ============================================================================
-- REPORTS & MODERATION SYSTEM
-- Community reporting system for events, places, reviews, and users
-- ============================================================================

-- ============================================================================
-- Add is_admin field to profiles
-- ============================================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- ============================================================================
-- Add report tracking fields to events and places
-- ============================================================================
ALTER TABLE events ADD COLUMN IF NOT EXISTS hidden_by_reports BOOLEAN DEFAULT false;
ALTER TABLE places ADD COLUMN IF NOT EXISTS hidden_by_reports BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_events_hidden_by_reports ON events(hidden_by_reports) WHERE hidden_by_reports = false;
CREATE INDEX IF NOT EXISTS idx_places_hidden_by_reports ON places(hidden_by_reports) WHERE hidden_by_reports = false;

-- ============================================================================
-- TABLE: reports
-- Store community reports for content moderation
-- ============================================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Reporter information
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Reported item
  item_id UUID NOT NULL,
  item_type TEXT CHECK (item_type IN ('event', 'place', 'review', 'user')) NOT NULL,

  -- Report details
  reason TEXT CHECK (reason IN (
    'spam',
    'inappropriate',
    'misleading',
    'harassment',
    'duplicate',
    'other'
  )) NOT NULL,
  description TEXT,

  -- Moderation workflow
  status TEXT CHECK (status IN (
    'pending',
    'investigating',
    'resolved',
    'dismissed'
  )) DEFAULT 'pending' NOT NULL,

  resolved_by UUID REFERENCES profiles(id),
  resolution_notes TEXT,
  resolution_action TEXT CHECK (resolution_action IN (
    'hide_item',
    'remove_item',
    'warn_user',
    'ban_user',
    'no_action'
  )),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_reports_item ON reports(item_id, item_type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Prevent duplicate reports (same user reporting same item)
CREATE UNIQUE INDEX idx_reports_unique_user_item
  ON reports(reporter_id, item_id, item_type)
  WHERE status = 'pending';

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Users can create reports (must be authenticated)
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id AND auth.uid() IS NOT NULL);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can update reports (resolve, dismiss)
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- FUNCTION: Get report count for an item
-- ============================================================================
CREATE OR REPLACE FUNCTION get_report_count(p_item_id UUID, p_item_type TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM reports
  WHERE item_id = p_item_id
    AND item_type = p_item_type
    AND status = 'pending';
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Auto-hide item when report threshold reached
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_hide_reported_item()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
  threshold INTEGER := 3; -- Auto-hide after 3 reports
BEGIN
  -- Only process on new pending reports
  IF NEW.status = 'pending' THEN
    -- Count total pending reports for this item
    SELECT COUNT(*) INTO report_count
    FROM reports
    WHERE item_id = NEW.item_id
      AND item_type = NEW.item_type
      AND status = 'pending';

    -- If threshold reached, hide the item
    IF report_count >= threshold THEN
      CASE NEW.item_type
        WHEN 'event' THEN
          UPDATE events SET hidden_by_reports = true WHERE id = NEW.item_id;
        WHEN 'place' THEN
          UPDATE places SET hidden_by_reports = true WHERE id = NEW.item_id;
        ELSE
          -- For reviews and users, implement later if needed
          NULL;
      END CASE;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_hide_reported_item
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_hide_reported_item();

-- ============================================================================
-- FUNCTION: Restore item visibility when reports resolved
-- ============================================================================
CREATE OR REPLACE FUNCTION restore_item_on_dismiss()
RETURNS TRIGGER AS $$
DECLARE
  remaining_reports INTEGER;
BEGIN
  -- Only process when status changes from pending to dismissed/resolved
  IF OLD.status = 'pending' AND NEW.status IN ('dismissed', 'resolved') THEN
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

CREATE TRIGGER trigger_restore_item_on_dismiss
  AFTER UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION restore_item_on_dismiss();

-- ============================================================================
-- Grant permissions
-- ============================================================================
GRANT SELECT, INSERT ON reports TO authenticated;
GRANT UPDATE ON reports TO authenticated; -- Admins will be filtered by RLS
GRANT EXECUTE ON FUNCTION get_report_count(UUID, TEXT) TO authenticated;
