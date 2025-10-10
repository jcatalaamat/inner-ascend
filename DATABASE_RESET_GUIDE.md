# Database Reset Guide

If you ever need to reset your database, follow these steps to restore the admin and reporting system.

## Automated Setup (Recommended)

All migrations are in `supabase/migrations/` and will be applied automatically when you run:

```bash
# Reset local database
npx supabase db reset

# OR push migrations to remote database
npx supabase db push
```

## What Gets Restored Automatically

When you run migrations, these are applied in order:

1. **20251009000000_initial_schema.sql** - Base schema (profiles, events, places, etc.)
2. **20251011000000_add_saved_searches.sql** - Saved searches table
3. **20251011010000_add_reports_system.sql** - Reports table with auto-hide triggers
4. **20251012000000_set_admins.sql** - Sets admin status for jordicatalaamat@gmail.com and ninamorel.mv@gmail.com
5. **20251012010000_add_report_email_webhook.sql** - Creates webhook trigger and pg_net extension
6. **20251012030000_update_webhook_with_hardcoded_values.sql** - Updates webhook function with credentials

## What Needs Manual Configuration

After a database reset, you need to reconfigure these:

### 1. Resend API Key (for email notifications)

```bash
npx supabase secrets set RESEND_API_KEY=re_your_key_here
```

**Current Key**: `re_LB4oCnK3_CqRjijWYvDtXqqh7QqCCZBDJ`

### 2. Redeploy Edge Functions

```bash
npx supabase functions deploy send-report-email --no-verify-jwt
```

## Admin Users

After reset, these users will automatically have `is_admin = true`:
- jordicatalaamat@gmail.com
- ninamorel.mv@gmail.com

This is handled by migration `20251012000000_set_admins.sql`.

## Adding New Admins

To add a new admin user:

### Option 1: Via SQL (Recommended)

```sql
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'newemail@example.com'
);
```

### Option 2: Via Migration

Create a new migration file:

```bash
# This will be created automatically, just edit it
npx supabase migration new add_new_admin
```

Then add:

```sql
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'newemail@example.com'
);
```

And push:

```bash
npx supabase db push
```

## Database Schema for Reports

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

### Profiles Table - Admin Field

```sql
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
```

### Events/Places - Hidden Field

```sql
ALTER TABLE events ADD COLUMN hidden_by_reports BOOLEAN DEFAULT false;
ALTER TABLE places ADD COLUMN hidden_by_reports BOOLEAN DEFAULT false;
```

## Auto-Hide Mechanism

Items are automatically hidden after 3 pending reports via these triggers:

1. **auto_hide_reported_item()** - Hides item when threshold reached
2. **check_restore_item()** - Restores item when all reports dismissed

These are created in migration `20251011010000_add_reports_system.sql`.

## Email Webhook

The webhook is created by migration `20251012010000_add_report_email_webhook.sql` and uses:

- **Extension**: pg_net (for HTTP requests from database)
- **Trigger**: on_report_created (fires on INSERT to reports table)
- **Function**: notify_new_report() (calls Edge Function)

Credentials are hardcoded in `20251012030000_update_webhook_with_hardcoded_values.sql`.

## Testing After Reset

1. **Verify admin access**:
   ```sql
   SELECT email, is_admin
   FROM profiles
   JOIN auth.users ON profiles.id = auth.users.id
   WHERE is_admin = true;
   ```

2. **Verify webhook trigger exists**:
   ```sql
   SELECT trigger_name, event_object_table
   FROM information_schema.triggers
   WHERE trigger_name = 'on_report_created';
   ```

3. **Test email notifications**:
   - Create a test report in the app
   - Check jordicatalaamat@gmail.com for email
   - Check Edge Function logs:
     ```bash
     npx supabase functions logs send-report-email
     ```

## Troubleshooting

### Admins not set after reset

Run this SQL manually:

```sql
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email IN ('jordicatalaamat@gmail.com', 'ninamorel.mv@gmail.com')
);
```

### Email notifications not working

1. Check Resend API key is set:
   ```bash
   npx supabase secrets list
   ```

2. Check Edge Function is deployed:
   ```bash
   npx supabase functions list
   ```

3. Redeploy if needed:
   ```bash
   npx supabase functions deploy send-report-email --no-verify-jwt
   ```

4. Check function logs:
   ```bash
   npx supabase functions logs send-report-email
   ```

### Webhook not triggering

Check if pg_net extension is enabled:

```sql
SELECT * FROM pg_extension WHERE extname = 'pg_net';
```

If not enabled:

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## Complete Reset Checklist

- [ ] Run `npx supabase db reset` or `npx supabase db push`
- [ ] Set Resend API key: `npx supabase secrets set RESEND_API_KEY=...`
- [ ] Deploy Edge Function: `npx supabase functions deploy send-report-email --no-verify-jwt`
- [ ] Verify admins are set (should be automatic)
- [ ] Test: Create a report and check email
- [ ] Test: View report in admin dashboard

## Files Reference

- **Admin Dashboard UI**: `packages/app/features/admin/`
- **Report Components**: `packages/app/components/ReportButton.tsx`, `ReportSheet.tsx`
- **Edge Function**: `supabase/functions/send-report-email/index.ts`
- **Migrations**: `supabase/migrations/2025101*.sql`
- **Types**: `packages/app/utils/report-types.ts`, `filter-types.ts`
- **Translations**: `packages/app/i18n/locales/en.json`, `es.json` (reports.* keys)

## Current Configuration

- **Resend API Key**: Set in Supabase secrets
- **Email From**: `onboarding@resend.dev` (test domain)
- **Email To**: `jordicatalaamat@gmail.com`
- **Edge Function URL**: `https://ddbuvzotcasyanocqcsh.supabase.co/functions/v1/send-report-email`
- **Service Role Key**: Hardcoded in webhook function
