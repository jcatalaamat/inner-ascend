-- Fix events table to have proper contact fields matching places table
-- This migration adds individual contact fields to replace the generic organizer_contact field

-- Add proper contact fields to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_instagram TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_directions TEXT;

-- Mark organizer_contact as deprecated (keep for backward compatibility)
COMMENT ON COLUMN events.organizer_contact IS 'DEPRECATED: Use contact_whatsapp, contact_phone, or contact_email instead. This field is kept for backward compatibility only.';

-- Migrate existing organizer_contact data to appropriate new fields
-- If starts with @, it's instagram
UPDATE events SET
  contact_instagram = organizer_contact
WHERE organizer_contact LIKE '@%' AND contact_instagram IS NULL;

-- If starts with + or is all digits, it's phone/whatsapp
UPDATE events SET
  contact_whatsapp = organizer_contact
WHERE (organizer_contact LIKE '+%' OR organizer_contact ~ '^\d+$') AND contact_whatsapp IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_contact_whatsapp ON events(contact_whatsapp) WHERE contact_whatsapp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_contact_phone ON events(contact_phone) WHERE contact_phone IS NOT NULL;
