-- Backfill profiles for existing users who don't have one
-- This fixes the issue where users created before the profiles table was recreated
-- don't have corresponding profile records

INSERT INTO public.profiles (id)
SELECT id
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
