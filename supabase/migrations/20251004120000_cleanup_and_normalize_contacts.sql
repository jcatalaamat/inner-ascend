-- Migration: Clean up unused tables and normalize event contact info
-- Drop template tables that are no longer used

-- Drop unused tables (posts, projects, etc.)
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;

-- Normalize event contact information to match places structure
-- Drop the single organizer_contact field
ALTER TABLE events DROP COLUMN IF EXISTS organizer_contact;

-- Add normalized contact fields
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_instagram TEXT;

-- Add comment for clarity
COMMENT ON TABLE events IS 'Events in Mazunte - yoga, ceremonies, workshops, parties, markets, etc.';
COMMENT ON TABLE places IS 'Places in Mazunte - retreats, wellness centers, restaurants, activities, community spaces';
