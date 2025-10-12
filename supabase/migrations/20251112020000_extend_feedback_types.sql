-- Extend feedback types to include support, contact, and delete_account requests
-- This allows the feedback form to handle all user communication needs

-- Drop the old CHECK constraint
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_type_check;

-- Add the new CHECK constraint with extended types
ALTER TABLE feedback ADD CONSTRAINT feedback_type_check
  CHECK (type IN ('feedback', 'feature_request', 'bug_report', 'support', 'contact', 'delete_account'));

COMMENT ON TABLE feedback IS 'User feedback, feature requests, bug reports, support requests, and contact messages';
