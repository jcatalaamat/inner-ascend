-- Configure database settings for report email notifications
-- Run this file to set up the webhook trigger configuration

-- Set project reference (used to construct Edge Function URL)
ALTER DATABASE postgres SET app.settings.project_ref = 'ddbuvzotcasyanocqcsh';

-- Set the Edge Function URL (full path to send-report-email function)
ALTER DATABASE postgres SET app.settings.functions_url = 'https://ddbuvzotcasyanocqcsh.supabase.co/functions/v1/send-report-email';

-- Set service role key (replace with your actual service role key from Supabase Dashboard)
-- To find your service role key:
-- 1. Go to https://supabase.com/dashboard/project/ddbuvzotcasyanocqcsh/settings/api
-- 2. Copy the "service_role" key (keep this secret!)
-- 3. Replace 'YOUR_SERVICE_ROLE_KEY_HERE' below with the actual key
ALTER DATABASE postgres SET app.settings.service_role_key = 'YOUR_SERVICE_ROLE_KEY_HERE';

-- Verify settings were applied
SELECT name, setting
FROM pg_settings
WHERE name LIKE 'app.settings%'
ORDER BY name;

-- Test the trigger by checking if it exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_report_created';
