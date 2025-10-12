-- Update feedback webhook function with hardcoded URL and service role key
-- This avoids the need for database-level settings which require superuser permissions

CREATE OR REPLACE FUNCTION notify_new_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Make async HTTP request to Edge Function with hardcoded values
  PERFORM
    net.http_post(
      url := 'https://ddbuvzotcasyanocqcsh.supabase.co/functions/v1/send-feedback-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnV2em90Y2FzeWFub2NxY3NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIxNzY5NSwiZXhwIjoyMDc0NzkzNjk1fQ.TaZpy6zPrgytwLd-k93qii7JJkUBAA-doEbftsp_c7E'
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

COMMENT ON FUNCTION notify_new_feedback() IS 'Sends webhook to Edge Function when new feedback is submitted (with hardcoded credentials)';
