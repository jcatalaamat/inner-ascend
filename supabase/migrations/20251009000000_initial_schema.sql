-- ============================================================================
-- MAZUNTE CONNECT - INITIAL SCHEMA
-- Single consolidated migration for production release
-- ============================================================================
-- This migration creates all tables, storage buckets, RLS policies, and seed data
-- Tables: profiles, events, places, favorites
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
-- Make uuid functions available in public schema
ALTER EXTENSION "uuid-ossp" SET SCHEMA public;

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  avatar_url TEXT,
  name TEXT,
  about TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- TABLE: events
-- ============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,

  -- Date and time
  date DATE NOT NULL,
  time TIME,

  -- Location
  location_name TEXT NOT NULL,
  lat NUMERIC(10, 8) NOT NULL,
  lng NUMERIC(10, 8) NOT NULL,

  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('yoga', 'ceremony', 'workshop', 'party', 'market', 'other')),
  price TEXT,
  image_url TEXT,
  eco_conscious BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,

  -- Organizer
  organizer_name TEXT,
  organizer_contact TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_profile_id ON events(profile_id);
CREATE INDEX idx_events_location ON events(lat, lng);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = profile_id);

-- ============================================================================
-- TABLE: places
-- ============================================================================
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('retreat', 'wellness', 'restaurant', 'activity', 'community')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Location
  location_name TEXT NOT NULL,
  lat NUMERIC(10, 8) NOT NULL,
  lng NUMERIC(10, 8) NOT NULL,

  -- Operating info
  hours TEXT,
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),

  -- Contact
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_instagram TEXT,
  contact_email TEXT,
  website_url TEXT,

  -- Media
  images TEXT[],
  tags TEXT[],

  -- Flags
  eco_conscious BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,

  -- Ownership
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_places_type ON places(type);
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_location ON places(lat, lng);
CREATE INDEX idx_places_created_by ON places(created_by);
CREATE INDEX idx_places_tags ON places USING gin(tags);
CREATE INDEX idx_places_eco_conscious ON places(eco_conscious);

-- RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view places"
  ON places FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON places FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own places"
  ON places FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own places"
  ON places FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- TABLE: favorites
-- ============================================================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('event', 'place')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_item ON favorites(item_id, item_type);

-- RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Event images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Place images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'place-images',
  'place-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Post images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Places images bucket (legacy support)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'places-images',
  'places-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own event images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view place images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload place images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own place images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own place images" ON storage.objects;

-- Event images policies
CREATE POLICY "Anyone can view event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Users can update own event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images' AND auth.uid()::text = owner::text);

CREATE POLICY "Users can delete own event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images' AND auth.uid()::text = owner::text);

-- Place images policies
CREATE POLICY "Anyone can view place images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'place-images');

CREATE POLICY "Authenticated users can upload place images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'place-images');

CREATE POLICY "Users can update own place images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'place-images' AND auth.uid()::text = owner::text);

CREATE POLICY "Users can delete own place images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'place-images' AND auth.uid()::text = owner::text);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_modtime ON profiles;
DROP TRIGGER IF EXISTS update_events_modtime ON events;
DROP TRIGGER IF EXISTS update_places_modtime ON places;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_modified_column() CASCADE;

-- Auto-create profile on user signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at triggers
CREATE TRIGGER update_profiles_modtime
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_events_modtime
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_places_modtime
  BEFORE UPDATE ON places
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- ============================================================================
-- SEED DATA: 5 EVENTS
-- ============================================================================
-- All dates are set relative to CURRENT_DATE to ensure they're always in the future

INSERT INTO events (title, description, date, time, location_name, lat, lng, category, price, eco_conscious, organizer_name, organizer_contact, image_url) VALUES

('Morning Vinyasa Flow', 'Start your day with energizing vinyasa flow overlooking the Pacific Ocean. All levels welcome.',
  CURRENT_DATE + INTERVAL '7 days', '07:00', 'Hola Ola Beach', 15.6658, -96.7347, 'yoga', 'Free', true, 'Maria', '@holaolamzt',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),

('Full Moon Ceremony', 'Gather under the full moon for meditation, chanting, and intention setting.',
  CURRENT_DATE + INTERVAL '10 days', '20:00', 'Punta Cometa', 15.6632, -96.7312, 'ceremony', 'Donation', true, 'Moon Circle', '@moonmzt',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),

('Plant-Based Cooking Class', 'Cook traditional Mexican dishes with a vegan twist. Eat what you make!',
  CURRENT_DATE + INTERVAL '5 days', '11:00', 'Estrella Fugaz', 15.6665, -96.7342, 'workshop', '350 MXN', true, 'Chef Rosa', '@estrellamzt',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),

('Sunset Beach Party', 'Dance barefoot under the stars with local DJs. Bring reusable cups!',
  CURRENT_DATE + INTERVAL '14 days', '21:00', 'Rinconcito Beach', 15.6645, -96.7335, 'party', 'Donation', true, 'Mazunte Collective', '@mazuntevibes',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),

('Artisan Market', 'Local crafts, jewelry, art, and handmade goods. Support local artists!',
  CURRENT_DATE + INTERVAL '3 days', '10:00', 'Main Beach Road', 15.6658, -96.7347, 'market', 'Free entry', true, 'Artisan Collective', '@artisansmzt',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4');

-- ============================================================================
-- SEED DATA: 5 PLACES
-- ============================================================================

INSERT INTO places (name, type, category, description, location_name, lat, lng, hours, price_range, contact_whatsapp, contact_instagram, contact_email, tags, eco_conscious, featured, verified, images) VALUES

('Casa Om', 'retreat', 'Yoga Retreat Center',
  'Peaceful oceanfront retreat center offering yoga, meditation, and holistic healing. Private rooms and dormitories available.',
  'Hillside overlooking beach', 15.6672, -96.7360, 'Check-in 2pm, Check-out 11am', '$$$',
  '+52 958 123 4567', '@casaommazunte', 'info@casaom.com',
  ARRAY['yoga', 'meditation', 'ocean-view', 'vegetarian'], true, true, true,
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4']),

('Solstice Yoga Studio', 'wellness', 'Yoga Studio',
  'Beautiful open-air yoga studio with ocean views. Drop-in classes daily.',
  'Main Beach Road', 15.6662, -96.7350, 'Classes 7am-7pm Mon-Sat', '$$',
  NULL, '@solsticeyogamzt', 'classes@solsticeyoga.com',
  ARRAY['yoga', 'ocean-view', 'daily-classes'], true, true, true,
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4']),

('Cometa Café Mazunte', 'restaurant', 'Specialty Coffee',
  'Known for having one of the best coffees in Mexico - they roast it themselves. Central meeting spot on main street.',
  'Calle Principal', 15.6677, -96.5545, 'Daily 7am-8pm', '$$',
  NULL, '@cometacafemazunte', NULL,
  ARRAY['coffee', 'roasted-in-house', 'meeting-spot'], true, true, true,
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4']),

('Eco-Tours Mazunte', 'activity', 'Nature Tours',
  'Guided tours to turtle sanctuary, mangroves, and bioluminescence. Kayak rentals available.',
  'Beach office', 15.6658, -96.7347, 'Daily 8am-6pm', '$$',
  '+52 958 777 8888', '@ecotoursmzt', NULL,
  ARRAY['eco-tours', 'kayaking', 'turtles', 'nature'], true, false, true,
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4']),

('Community Center Mazunte', 'community', 'Community Hub',
  'Free public space for events, workshops, and gatherings. Bulletin board and library.',
  'Main plaza', 15.6665, -96.7342, 'Daily 8am-8pm', NULL,
  NULL, NULL, 'community.mzt@gmail.com',
  ARRAY['community', 'events', 'free', 'library'], true, false, true,
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4']);
