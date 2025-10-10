-- Create cities table
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  emoji TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial cities
INSERT INTO cities (id, name_en, name_es, emoji, is_active, lat, lng) VALUES
  ('mazunte', 'Mazunte', 'Mazunte', '🌊', true, 15.6658, -96.7347),
  ('puerto-escondido', 'Puerto Escondido', 'Puerto Escondido', '🏄', false, 15.8655, -97.0536),
  ('tulum', 'Tulum', 'Tulum', '🏛️', false, 20.2114, -87.4654),
  ('playa-del-carmen', 'Playa del Carmen', 'Playa del Carmen', '🏖️', false, 20.6296, -87.0739);

-- Add city_id field to events and places tables with foreign key
ALTER TABLE events ADD COLUMN city_id TEXT NOT NULL DEFAULT 'mazunte' REFERENCES cities(id);
ALTER TABLE places ADD COLUMN city_id TEXT NOT NULL DEFAULT 'mazunte' REFERENCES cities(id);

-- Create index for faster queries
CREATE INDEX idx_events_city_id ON events(city_id);
CREATE INDEX idx_places_city_id ON places(city_id);

-- Enable RLS on cities table
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read cities
CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);
