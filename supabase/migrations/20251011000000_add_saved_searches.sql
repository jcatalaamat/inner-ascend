-- ============================================================================
-- SAVED SEARCHES FEATURE
-- Allows users to save their search filters and get notified when new matches appear
-- ============================================================================

-- ============================================================================
-- TABLE: saved_searches
-- Store user's saved search filters with optional notifications
-- ============================================================================
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,

  -- Filter JSON structure:
  -- {
  --   "categories": ["yoga", "ceremony"],
  --   "date_range": {"type": "this_weekend" | "next_week" | "custom", "start": "2025-10-15", "end": "2025-10-20"},
  --   "time_of_day": ["morning", "afternoon", "evening"],
  --   "price": ["free", "$", "$$", "$$$"],
  --   "tags": ["vegan", "english", "beginners"],
  --   "search_query": "yoga beach"
  -- }
  filters JSONB NOT NULL,

  -- Notification settings
  notify_on_match BOOLEAN DEFAULT false,
  last_notified_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_notify ON saved_searches(notify_on_match) WHERE notify_on_match = true;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved searches
CREATE POLICY "Users can view their own saved searches"
  ON saved_searches FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own saved searches
CREATE POLICY "Users can create their own saved searches"
  ON saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved searches
CREATE POLICY "Users can update their own saved searches"
  ON saved_searches FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own saved searches
CREATE POLICY "Users can delete their own saved searches"
  ON saved_searches FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: Update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_searches_updated_at();

-- ============================================================================
-- Grant permissions
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON saved_searches TO authenticated;
