-- Configure database settings for report email notifications
-- Run this file to set up the webhook trigger configuration

-- Set project reference (used to construct Edge Function URL)
ALTER DATABASE postgres SET app.settings.project_ref = 'ddbuvzotcasyanocqcsh';

-- Set the Edge Function URL (full path to send-report-email function)
ALTER DATABASE postgres SET app.settings.functions_url = 'https://ddbuvzotcasyanocqcsh.supabase.co/functions/v1/send-report-email';

-- Set service role key
ALTER DATABASE postgres SET app.settings.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnV2em90Y2FzeWFub2NxY3NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIxNzY5NSwiZXhwIjoyMDc0NzkzNjk1fQ.TaZpy6zPrgytwLd-k93qii7JJkUBAA-doEbftsp_c7E';

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
