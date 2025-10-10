-- Set admin status for Jordi and Nina
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email IN ('jordicatalaamat@gmail.com', 'ninamorel.mv@gmail.com')
);
