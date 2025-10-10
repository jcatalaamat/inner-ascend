-- ============================================================================
-- PUSH NOTIFICATIONS SCHEMA
-- ============================================================================
-- Tables for managing Expo push notifications
-- - push_tokens: Store user device tokens
-- - notification_preferences: User notification settings
-- - notification_queue: Scheduled notifications
-- - notification_history: Audit trail
-- ============================================================================

-- ============================================================================
-- TABLE: push_tokens
-- Store Expo push tokens for each user device
-- ============================================================================
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')) NOT NULL,
  device_name TEXT,
  app_version TEXT,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(token)
);

-- Indexes for performance
CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX idx_push_tokens_active ON push_tokens(is_active);
CREATE INDEX idx_push_tokens_platform ON push_tokens(platform);

-- RLS Policies
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tokens"
  ON push_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
  ON push_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON push_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
  ON push_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: notification_preferences
-- User preferences for what notifications they want to receive
-- ============================================================================
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

  -- General toggles
  enabled BOOLEAN DEFAULT true,
  event_reminders BOOLEAN DEFAULT true,
  new_events BOOLEAN DEFAULT true,
  event_updates BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,

  -- Timing preferences
  reminder_1h_before BOOLEAN DEFAULT true,
  reminder_1d_before BOOLEAN DEFAULT true,
  reminder_1w_before BOOLEAN DEFAULT false,

  -- Category preferences (JSONB array of category strings)
  favorite_categories JSONB DEFAULT '[]'::jsonb,

  -- Quiet hours (24-hour format)
  quiet_hours_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: notification_queue
-- Scheduled notifications waiting to be sent
-- ============================================================================
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Notification content
  notification_type TEXT CHECK (notification_type IN (
    'event_reminder',
    'new_event',
    'event_update',
    'weekly_digest',
    'rsvp_confirmation',
    'event_cancelled'
  )) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB, -- Additional data (event_id, etc.)

  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,

  -- Status
  status TEXT CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')) DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notification_queue_user_id ON notification_queue(user_id);
CREATE INDEX idx_notification_queue_status ON notification_queue(status);
CREATE INDEX idx_notification_queue_scheduled ON notification_queue(scheduled_for);
CREATE INDEX idx_notification_queue_type ON notification_queue(notification_type);

-- RLS Policies
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own queued notifications"
  ON notification_queue FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update/delete from queue
CREATE POLICY "Service role can manage queue"
  ON notification_queue FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- TABLE: notification_history
-- Audit trail of all sent notifications
-- ============================================================================
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  push_token_id UUID REFERENCES push_tokens(id) ON DELETE SET NULL,

  -- Notification details
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,

  -- Delivery info
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered BOOLEAN,
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,

  -- Expo response
  expo_ticket_id TEXT,
  expo_receipt JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX idx_notification_history_type ON notification_history(notification_type);
CREATE INDEX idx_notification_history_sent_at ON notification_history(sent_at);

-- RLS Policies
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification history"
  ON notification_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: Auto-create notification preferences on user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION create_notification_preferences_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences when profile is created
CREATE TRIGGER on_profile_created_create_notification_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_preferences_for_new_user();

-- ============================================================================
-- FUNCTION: Update push token last_used_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_push_token_last_used()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used_at = NOW();
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_push_token_timestamp
  BEFORE UPDATE ON push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_push_token_last_used();

-- ============================================================================
-- FUNCTION: Clean up old inactive push tokens (run via cron)
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_inactive_push_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete tokens not used in 90 days
  DELETE FROM push_tokens
  WHERE last_used_at < NOW() - INTERVAL '90 days'
    AND is_active = false;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get active push tokens for user
-- Helper function for Edge Functions
-- ============================================================================
CREATE OR REPLACE FUNCTION get_active_push_tokens(p_user_id UUID)
RETURNS TABLE (
  token TEXT,
  platform TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT pt.token, pt.platform
  FROM push_tokens pt
  WHERE pt.user_id = p_user_id
    AND pt.is_active = true
  ORDER BY pt.last_used_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Check if notification should be sent based on quiet hours
-- ============================================================================
CREATE OR REPLACE FUNCTION is_in_quiet_hours(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  prefs RECORD;
  current_time TIME;
BEGIN
  SELECT quiet_hours_enabled, quiet_hours_start, quiet_hours_end
  INTO prefs
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- If no preferences found or quiet hours disabled, allow notification
  IF NOT FOUND OR NOT prefs.quiet_hours_enabled THEN
    RETURN false;
  END IF;

  current_time := LOCALTIME;

  -- Handle overnight quiet hours (e.g., 22:00 to 08:00)
  IF prefs.quiet_hours_start > prefs.quiet_hours_end THEN
    RETURN current_time >= prefs.quiet_hours_start OR current_time < prefs.quiet_hours_end;
  ELSE
    RETURN current_time >= prefs.quiet_hours_start AND current_time < prefs.quiet_hours_end;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Grant necessary permissions
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON push_tokens TO authenticated;
GRANT ALL ON notification_preferences TO authenticated;
GRANT SELECT ON notification_queue TO authenticated;
GRANT SELECT ON notification_history TO authenticated;
