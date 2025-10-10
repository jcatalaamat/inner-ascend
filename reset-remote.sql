-- Run this in Supabase SQL Editor to completely reset the database
-- WARNING: This deletes EVERYTHING

-- Drop all tables
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_modified_column() CASCADE;

-- Drop all storage policies
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own event images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view place images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload place images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own place images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own place images" ON storage.objects;

-- Delete storage buckets
DELETE FROM storage.buckets WHERE id IN ('avatars', 'event-images', 'place-images', 'post-images', 'places-images');

-- Now you can run: yarn supa deploy
