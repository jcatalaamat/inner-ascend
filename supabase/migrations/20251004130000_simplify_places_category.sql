-- Simplify places: make category optional and auto-populate from type
-- This reduces confusion between type (dropdown) and category (text field)

-- Make category nullable
ALTER TABLE places ALTER COLUMN category DROP NOT NULL;

-- Update existing places to use type as category if category is empty
UPDATE places SET category = type WHERE category IS NULL OR category = '';

-- Add a trigger to auto-populate category from type if not provided
CREATE OR REPLACE FUNCTION set_place_category_from_type()
RETURNS TRIGGER AS $$
BEGIN
  -- If category is null or empty, use type
  IF NEW.category IS NULL OR NEW.category = '' THEN
    NEW.category := NEW.type;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_set_category_trigger
  BEFORE INSERT OR UPDATE ON places
  FOR EACH ROW
  EXECUTE FUNCTION set_place_category_from_type();
