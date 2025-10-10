-- Set admin status for Jordi and Nina
UPDATE profiles
SET is_admin = true
WHERE email IN ('jordicatalaamat@gmail.com', 'ninamorel.mv@gmail.com');

-- Verify
SELECT id, email, name, is_admin
FROM profiles
WHERE email IN ('jordicatalaamat@gmail.com', 'ninamorel.mv@gmail.com');
