-- Create storage buckets for event and place images

-- Create event-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create place-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'place-images',
  'place-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for event-images bucket
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

-- Set up RLS policies for place-images bucket
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
