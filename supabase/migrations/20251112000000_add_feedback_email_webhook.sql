-- Create function to send webhook to Edge Function for feedback emails
CREATE OR REPLACE FUNCTION notify_new_feedback()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get environment settings
  function_url := current_setting('app.settings.functions_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings not configured, use project ref approach
  IF function_url IS NULL THEN
    function_url := 'https://' || current_setting('app.settings.project_ref', true) || '.supabase.co/functions/v1/send-feedback-email';
  ELSE
    function_url := function_url || '/send-feedback-email';
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
        'table', 'feedback',
        'record', row_to_json(NEW)::jsonb,
        'schema', 'public',
        'old_record', null
      )
    );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send feedback notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after new feedback is inserted
CREATE TRIGGER on_feedback_created
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_feedback();

COMMENT ON FUNCTION notify_new_feedback() IS 'Sends webhook to Edge Function when new feedback is submitted';
COMMENT ON TRIGGER on_feedback_created ON feedback IS 'Triggers email notification for new feedback submissions';
