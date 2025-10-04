-- Migration 1: Transform events table to support Mazunte Connect features
-- This migration adds location, category, pricing, and other event-specific fields

-- Add new columns for Mazunte-specific event data
ALTER TABLE events
  -- Location fields for mapping events
  ADD COLUMN location_name TEXT,
  ADD COLUMN lat NUMERIC(10, 8),
  ADD COLUMN lng NUMERIC(10, 8),

  -- Event categorization and details
  ADD COLUMN category TEXT CHECK (category IN ('yoga', 'ceremony', 'workshop', 'party', 'market', 'other')),
  ADD COLUMN price TEXT,
  ADD COLUMN image_url TEXT,
  ADD COLUMN eco_conscious BOOLEAN DEFAULT false,
  ADD COLUMN featured BOOLEAN DEFAULT false,

  -- Organizer information
  ADD COLUMN organizer_name TEXT,
  ADD COLUMN organizer_contact TEXT,

  -- Split datetime into separate date and time fields
  ADD COLUMN date DATE,
  ADD COLUMN time TIME;

-- Migrate existing data from start_time to new date/time fields
UPDATE events SET
  date = start_time::date,
  time = start_time::time,
  location_name = 'Mazunte',
  lat = 15.6658,
  lng = -96.7347,
  category = 'other'
WHERE start_time IS NOT NULL;

-- Drop old columns that are replaced by new structure
ALTER TABLE events DROP COLUMN IF EXISTS start_time;
ALTER TABLE events DROP COLUMN IF EXISTS end_time;
ALTER TABLE events DROP COLUMN IF EXISTS status;

-- Rename 'name' to 'title' for clarity
ALTER TABLE events RENAME COLUMN name TO title;

-- Add NOT NULL constraints to required fields
ALTER TABLE events ALTER COLUMN title SET NOT NULL;
ALTER TABLE events ALTER COLUMN location_name SET NOT NULL;
ALTER TABLE events ALTER COLUMN lat SET NOT NULL;
ALTER TABLE events ALTER COLUMN lng SET NOT NULL;
ALTER TABLE events ALTER COLUMN category SET NOT NULL;
ALTER TABLE events ALTER COLUMN date SET NOT NULL;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_profile_id ON events(profile_id);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(lat, lng);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- RLS Policy: Public read access (anyone can view events)
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policy: Users can update their own events
CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = profile_id);

-- RLS Policy: Users can delete their own events
CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = profile_id);
