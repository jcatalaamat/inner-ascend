# Admin Dashboard & Report Notifications Setup

## Overview

The admin system consists of:
1. **Admin Dashboard** - In-app interface to review and moderate content reports
2. **Email Notifications** - Automatic emails sent to admins when new reports are submitted

## Admin Access

Admin users are identified by the `is_admin` field in the `profiles` table.

### Current Admins
- jordicatalaamat@gmail.com
- ninamorel.mv@gmail.com

### How to View Admin Dashboard

1. Log in to the app with an admin account
2. Go to **Settings**
3. You'll see a new section: **Admin: Content Reports** (with red Shield icon)
4. Tap to view all reports

### Admin Dashboard Features

- **Reports List**: View all pending and resolved reports
- **Filter**: Toggle between "Pending Only" and "All Reports"
- **Stats**: Quick view of pending vs total reports
- **Report Details**: Tap any report to see full details and take action

### Moderation Actions

When viewing a report detail, admins can:

1. **Dismiss Report** - Mark as false report, no action needed
2. **Hide Item** - Temporarily hide the item from public view
3. **Remove Item** - Permanently remove the item (future enhancement)

## Email Notifications

### Setup Required

To enable email notifications, you need to configure the Resend API:

#### 1. Sign up for Resend
- Go to https://resend.com
- Create an account
- Verify your domain (mazunteconnect.com)

#### 2. Get API Key
- In Resend dashboard, go to API Keys
- Create a new API key
- Copy the key (starts with `re_...`)

#### 3. Configure Supabase Edge Function
```bash
# Set the Resend API key as a secret
npx supabase secrets set RESEND_API_KEY=re_your_key_here
```

#### 4. Deploy Edge Function
```bash
# Deploy the send-report-email function
npx supabase functions deploy send-report-email
```

#### 5. Configure Database Settings
```sql
-- Set your project reference
ALTER DATABASE postgres SET app.settings.project_ref = 'your-project-ref';

-- Optional: Set custom function URL
ALTER DATABASE postgres SET app.settings.functions_url = 'https://your-project.supabase.co/functions/v1/send-report-email';

-- Set service role key for webhook authentication
ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
```

To find your project ref:
- Go to Supabase Dashboard > Project Settings > General
- Look for "Reference ID"

To find your service role key:
- Go to Supabase Dashboard > Project Settings > API
- Copy "service_role" key (keep this secret!)

### Email Configuration

**From Address**: alerts@mazunteconnect.com (requires domain verification in Resend)
**To Address**: jordicatalaamat@gmail.com (hardcoded in Edge Function)

To change the recipient email, edit:
`supabase/functions/send-report-email/index.ts`

```typescript
const ADMIN_EMAIL = 'jordicatalaamat@gmail.com'
```

### Email Content

Each email includes:
- Report ID and timestamp
- Item type (Event/Place/Review/User)
- Item title/name
- Report reason (Spam, Inappropriate, etc.)
- Reporter description (if provided)
- Reporter name (or "Anonymous")
- Direct link to review in admin dashboard
- Direct link to view the reported item

### Testing

To test the email notification system:

1. Create a test report in the app
2. Check the Edge Function logs:
   ```bash
   npx supabase functions logs send-report-email
   ```
3. Check your email inbox

### Troubleshooting

**No emails received?**

1. Check Edge Function logs for errors
2. Verify RESEND_API_KEY is set correctly
3. Verify domain is verified in Resend
4. Check spam folder
5. Verify database settings are configured

**Webhook not triggering?**

1. Check that `pg_net` extension is enabled
2. Verify database settings are configured
3. Check Postgres logs for trigger errors
4. Test manually by inserting a report

## Database Schema

### Admin Field
```sql
-- profiles table
is_admin BOOLEAN DEFAULT false
```

### Reports Table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  item_id UUID NOT NULL,
  item_type TEXT CHECK (item_type IN ('event', 'place', 'review', 'user')) NOT NULL,
  reason TEXT CHECK (reason IN ('spam', 'inappropriate', 'misleading', 'harassment', 'duplicate', 'other')) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')) DEFAULT 'pending',
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  resolution_action TEXT CHECK (resolution_action IN ('hide_item', 'remove_item', 'warn_user', 'ban_user', 'no_action')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Auto-Hide Mechanism

Items are automatically hidden after receiving 3 pending reports:

```sql
-- Trigger after each report
CREATE TRIGGER auto_hide_after_reports
  AFTER INSERT OR UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_hide_reported_item();
```

Items are automatically restored when all reports are dismissed:

```sql
-- Trigger when reports are dismissed
CREATE TRIGGER auto_restore_on_dismiss
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status = 'dismissed')
  EXECUTE FUNCTION check_restore_item();
```

## Security

### Row Level Security (RLS)

- Only admins can view reports table
- Only admins can update report status
- Users can insert reports (to report content)
- Reports are linked to user ID automatically

### Admin-Only Routes

- `/admin/reports` - Reports list
- `/admin/reports/[id]` - Report detail

These routes check `profile.is_admin` and show "Access Denied" if false.

## Future Enhancements

1. **Multiple Admin Recipients** - Support multiple admin emails
2. **Email Preferences** - Let admins opt in/out of notifications
3. **Daily Digest** - Option for daily summary instead of per-report
4. **Slack Integration** - Send notifications to Slack channel
5. **Remove Item Action** - Implement permanent deletion
6. **User Warnings/Bans** - Add user moderation actions
7. **Appeal System** - Let users appeal moderation decisions
8. **Report Analytics** - Dashboard with report trends and metrics
