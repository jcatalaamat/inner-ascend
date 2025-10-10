-- ============================================================================
-- FEEDBACK TABLE
-- Store user feedback and feature requests
-- ============================================================================

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Feedback details
  type TEXT NOT NULL CHECK (type IN ('feedback', 'feature_request', 'bug_report')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Optional metadata
  category TEXT, -- e.g., 'events', 'places', 'ui', 'performance'
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'planned', 'in_progress', 'completed', 'declined')),

  -- User context (captured automatically)
  device_info JSONB, -- device type, OS version, app version
  user_email TEXT, -- Store email in case profile is deleted

  -- Admin notes
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own feedback
CREATE POLICY "Users can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can submit feedback
CREATE POLICY "Authenticated users can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can view all feedback (you'll need to add admin role later)
-- For now, create a view that you can query from Supabase dashboard

-- Create index for faster queries
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
