-- ============================================================================
-- SERVICES MARKETPLACE
-- Users can offer services with pricing, availability, and contact info
-- Examples: Ayurveda massage, bread delivery, yoga classes, healing, etc.
-- ============================================================================

-- ============================================================================
-- TABLE: services
-- ============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'wellness',      -- Massage, healing, reiki, yoga
    'food',          -- Catering, meal prep, bakery, private chef
    'education',     -- Classes, tutoring, workshops, coaching
    'art',           -- Crafts, photography, painting, music
    'transportation', -- Airport pickup, tours, bike rental
    'accommodation', -- Room rental, house sitting
    'other'
  )),

  -- Pricing
  price_type TEXT CHECK (price_type IN ('free', 'fixed', 'hourly', 'daily', 'negotiable', 'donation')) DEFAULT 'fixed',
  price_amount DECIMAL(10,2),
  price_currency TEXT DEFAULT 'MXN',
  price_notes TEXT, -- "Sliding scale available", "Package deals"

  -- Availability
  available BOOLEAN DEFAULT true,
  availability_schedule JSONB, -- {"monday": ["9am-12pm", "2pm-6pm"], "tuesday": ...}
  delivery_options TEXT[], -- ['in_person', 'can_travel', 'online', 'delivery']
  service_location TEXT, -- "Mazunte Centro", "Your location", "Online"

  -- Contact preferences
  contact_methods TEXT[], -- ['whatsapp', 'instagram', 'email', 'phone']
  response_time TEXT, -- "Usually responds within 1 hour"

  -- Media
  images TEXT[],

  -- Flags
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  eco_conscious BOOLEAN DEFAULT false,

  -- Moderation (same as events/places)
  hidden_by_reports BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_services_profile_id ON services(profile_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_available ON services(available);

-- RLS Policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true); -- Filter hidden_by_reports client-side like events/places

CREATE POLICY "Authenticated users can create services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = profile_id);

-- ============================================================================
-- ENHANCE PROFILES TABLE - Marketplace Creator Fields
-- ============================================================================

-- Add marketplace fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_whatsapp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS creator_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_contact_on_profile BOOLEAN DEFAULT false;

-- ============================================================================
-- TABLE: profile_stats
-- ============================================================================

CREATE TABLE profile_stats (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  services_count INT DEFAULT 0,
  total_views INT DEFAULT 0,
  avg_response_time TEXT,
  member_since TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize stats for existing profiles
INSERT INTO profile_stats (profile_id, member_since)
SELECT id, created_at FROM profiles
ON CONFLICT (profile_id) DO NOTHING;

-- ============================================================================
-- FUNCTION: Update profile stats on service changes
-- ============================================================================

CREATE OR REPLACE FUNCTION update_profile_stats_services()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment services count
    UPDATE profile_stats
    SET services_count = services_count + 1,
        updated_at = NOW()
    WHERE profile_id = NEW.profile_id;

    -- Create stats row if doesn't exist
    INSERT INTO profile_stats (profile_id, services_count, member_since)
    SELECT NEW.profile_id, 1, p.created_at
    FROM profiles p
    WHERE p.id = NEW.profile_id
    ON CONFLICT (profile_id) DO NOTHING;

  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement services count
    UPDATE profile_stats
    SET services_count = GREATEST(0, services_count - 1),
        updated_at = NOW()
    WHERE profile_id = OLD.profile_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update stats
CREATE TRIGGER trigger_update_profile_stats_services
  AFTER INSERT OR DELETE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats_services();

-- ============================================================================
-- EXTEND REPORTS TABLE - Add services support
-- ============================================================================

-- Reports table already exists, just add comment for clarity
COMMENT ON COLUMN reports.item_type IS 'Type of reported item: event, place, service, review, user';

-- Note: No schema change needed, 'service' is not in CHECK constraint
-- If we want to enforce it, we can alter:
-- ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_item_type_check;
-- ALTER TABLE reports ADD CONSTRAINT reports_item_type_check
--   CHECK (item_type IN ('event', 'place', 'service', 'review', 'user'));
