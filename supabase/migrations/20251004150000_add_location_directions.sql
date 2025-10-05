-- Add location_directions field to events and places tables
-- This allows users to provide additional context like "Behind the basketball court"

ALTER TABLE events ADD COLUMN IF NOT EXISTS location_directions TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS location_directions TEXT;

-- Add comments for documentation
COMMENT ON COLUMN events.location_directions IS 'Optional additional directions or context for finding the location (e.g., "Turn left at turtle museum", "Behind basketball court")';
COMMENT ON COLUMN places.location_directions IS 'Optional additional directions or context for finding the location (e.g., "Turn left at turtle museum", "Behind basketball court")';
