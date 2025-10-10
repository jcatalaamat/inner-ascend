-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to send webhook to Edge Function
CREATE OR REPLACE FUNCTION notify_new_report()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get environment settings (these should be set in your Supabase project)
  function_url := current_setting('app.settings.functions_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings not configured, use hardcoded approach
  -- You should set these via: ALTER DATABASE postgres SET app.settings.functions_url = 'your-url';
  IF function_url IS NULL THEN
    function_url := 'https://' || current_setting('app.settings.project_ref', true) || '.supabase.co/functions/v1/send-report-email';
  END IF;

  -- Make async HTTP request to Edge Function
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'reports',
        'record', row_to_json(NEW)::jsonb,
        'schema', 'public',
        'old_record', null
      )
    );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send report notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after new report is inserted
CREATE TRIGGER on_report_created
  AFTER INSERT ON reports
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION notify_new_report();

COMMENT ON FUNCTION notify_new_report() IS 'Sends webhook to Edge Function when new report is created';
COMMENT ON TRIGGER on_report_created ON reports IS 'Triggers email notification for new pending reports';
