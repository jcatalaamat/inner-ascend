# Inner Ascend Email Templates Setup Guide

This guide walks you through setting up beautiful, cosmic-themed email templates for Supabase authentication emails.

## 📧 Available Templates

We've created 5 custom HTML email templates with Inner Ascend branding:

1. **confirm-signup.html** - Welcome email with signup confirmation link
2. **reset-password.html** - Password reset request email
3. **magic-link.html** - Passwordless sign-in email
4. **change-email.html** - Email address change confirmation
5. **invite.html** - User invitation email (for future features)

All templates feature:
- 🌌 Cosmic gradient design matching Inner Ascend brand
- 📱 Responsive layout (works on mobile and desktop)
- ✨ Spiritual, welcoming tone
- 🎨 Consistent purple/cosmic color palette
- 🔒 Security notices and best practices
- 💌 Professional footer with contact information

---

## 🚀 Setup Instructions

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Inner Ascend** project
3. Navigate to **Authentication** → **Email Templates** in the left sidebar

### Step 2: Configure Each Template

For each email type, follow these steps:

#### A. Confirm Signup Template

1. Click on **"Confirm signup"** in the templates list
2. Open `/supabase/templates/emails/confirm-signup.html` in your code editor
3. Copy the entire HTML content
4. Paste it into the **"Message Body (HTML)"** field in Supabase Dashboard
5. Update the **Subject Line** to: `Welcome to Inner Ascend - Confirm Your Email ✨`
6. Click **Save**

#### B. Reset Password Template

1. Click on **"Reset password"** in the templates list
2. Open `/supabase/templates/emails/reset-password.html`
3. Copy the entire HTML content
4. Paste it into the **"Message Body (HTML)"** field
5. Update the **Subject Line** to: `Reset Your Inner Ascend Password 🔐`
6. Click **Save**

#### C. Magic Link Template

1. Click on **"Magic Link"** in the templates list
2. Open `/supabase/templates/emails/magic-link.html`
3. Copy the entire HTML content
4. Paste it into the **"Message Body (HTML)"** field
5. Update the **Subject Line** to: `Your Magic Link to Inner Ascend ✨`
6. Click **Save**

#### D. Change Email Template

1. Click on **"Change Email Address"** in the templates list
2. Open `/supabase/templates/emails/change-email.html`
3. Copy the entire HTML content
4. Paste it into the **"Message Body (HTML)"** field
5. Update the **Subject Line** to: `Confirm Your Email Change - Inner Ascend 📧`
6. Click **Save**

#### E. Invite User Template (Optional)

1. Click on **"Invite User"** in the templates list
2. Open `/supabase/templates/emails/invite.html`
3. Copy the entire HTML content
4. Paste it into the **"Message Body (HTML)"** field
5. Update the **Subject Line** to: `You're Invited to Inner Ascend 🌟`
6. Click **Save**

---

## 🔧 Template Variables

Supabase provides these variables that are automatically replaced in your templates:

| Variable | Description | Used In |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | Link for user action (confirmation, reset, etc.) | All templates |
| `{{ .Email }}` | User's email address | Change email template |
| `{{ .Token }}` | Raw token (usually not needed) | Advanced use cases |
| `{{ .TokenHash }}` | Hashed token (usually not needed) | Advanced use cases |
| `{{ .SiteURL }}` | Your app's site URL | Can be added to templates |
| `{{ .RedirectTo }}` | Redirect destination after action | Can be added to templates |

These variables are already properly placed in the templates you're copying.

---

## 📝 Customization Tips

### Change Colors

To match different branding, update these hex codes in the templates:

- **Primary Purple**: `#8A67F5` (cosmicViolet)
- **Dark Purple**: `#6B4FBB` (darker cosmicViolet)
- **Deep Space**: `#0A0A0F` (background)
- **Silver Moon**: `#E8E8F0` (text)
- **Warning Gold**: `#FFB800` (alerts)

### Update Links

Make sure these links point to your actual domains:

- Website: `https://inner-ascend.com`
- Support email: `hello@inner-ascend.com`
- Alerts email: `alerts@inner-ascend.com`

### Modify Content

Feel free to adjust:
- Tone and messaging
- Emoji usage
- Feature lists
- Footer information
- Security notices

---

## 🧪 Testing Your Templates

### Local Testing (with Inbucket)

1. Make sure your local Supabase is running: `npx supabase start`
2. Access Inbucket at [http://localhost:54324](http://localhost:54324)
3. Test signup/login flows in your app
4. Check Inbucket to see rendered emails

**Note**: Local Supabase uses default templates. You'll need to test in staging/production to see your custom templates.

### Staging/Production Testing

1. Deploy your templates to Supabase Dashboard (following steps above)
2. Create a test account with a real email you control
3. Trigger each email type:
   - Signup → Sends confirmation email
   - Password reset → Sends reset email
   - Change email → Sends change confirmation
   - Magic link → Send magic link (if implemented)
4. Verify the emails:
   - Check rendering on desktop email clients
   - Check rendering on mobile email apps
   - Test all links work correctly
   - Verify styling looks good

### Email Client Testing Tools

Consider testing with:
- **Litmus** ([litmus.com](https://litmus.com)) - Professional email testing
- **Email on Acid** ([emailonacid.com](https://www.emailonacid.com)) - Preview across clients
- **Preview in Gmail, Outlook, Apple Mail** - Manual testing

---

## 🔒 SMTP Configuration (Production)

For production, you'll want to configure custom SMTP to ensure deliverability:

### Option 1: Use Supabase's Email Service (Default)

- Supabase provides email sending out of the box
- Good for development and small-scale apps
- May have sending limits

### Option 2: Custom SMTP with Resend (Recommended)

We already have Resend configured for application emails. To use it for auth emails:

1. Go to Supabase Dashboard → **Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **"Enable Custom SMTP"**
4. Configure with Resend credentials:
   ```
   Host: smtp.resend.com
   Port: 465 (SSL) or 587 (TLS)
   Username: resend
   Password: [Your Resend API Key]
   Sender email: hello@inner-ascend.com
   Sender name: Inner Ascend
   ```
5. Click **Save**

### Option 3: Other SMTP Providers

Popular alternatives:
- **SendGrid** - Scalable, reliable
- **Mailgun** - Developer-friendly
- **Amazon SES** - Cost-effective for high volume
- **Postmark** - Focus on transactional emails

---

## ✅ Pre-Launch Checklist

Before going to production, verify:

- [ ] All 4 auth email templates configured in Supabase Dashboard
- [ ] Email subject lines updated to Inner Ascend branding
- [ ] All email addresses updated from `mazunteconnect.com` to `inner-ascend.com`
- [ ] SMTP configured (if using custom provider)
- [ ] Domain verified in email provider (Resend/SendGrid/etc)
- [ ] SPF/DKIM/DMARC records configured for domain
- [ ] Tested all email flows (signup, reset, change email, magic link)
- [ ] Emails render correctly on mobile and desktop
- [ ] All links in emails work correctly
- [ ] Unsubscribe link present (if required by law)
- [ ] Privacy policy and terms links updated

---

## 🐛 Troubleshooting

### Emails Not Sending

1. Check SMTP credentials are correct
2. Verify sender email is verified in your email provider
3. Check Supabase logs: Dashboard → Logs → Filter for "email"
4. Verify user email confirmations are enabled: `supabase/config.toml` → `enable_confirmations = true`

### Emails Going to Spam

1. Set up SPF, DKIM, and DMARC records for your domain
2. Use a verified sending domain
3. Avoid spam trigger words in subject lines
4. Test with [Mail Tester](https://www.mail-tester.com)

### Template Variables Not Replacing

1. Make sure you're using the correct syntax: `{{ .VariableName }}`
2. Check Supabase Dashboard shows the template was saved
3. Clear cache and test with a fresh signup/reset request

### Styling Issues

1. Remember email HTML has limited CSS support
2. Use inline styles (already done in our templates)
3. Test across multiple email clients
4. Avoid complex layouts and modern CSS features

---

## 📚 Additional Resources

- [Supabase Auth Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Resend Documentation](https://resend.com/docs)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)
- [Can I Email?](https://www.caniemail.com) - CSS support in email clients

---

## 🎨 Design Philosophy

These templates embody Inner Ascend's brand values:

- **Cosmic & Mysterious** - Dark backgrounds with purple accents evoke the night sky and inner exploration
- **Warm & Inviting** - Friendly copy and spiritual language create psychological safety
- **Professional** - Clean layout and proper spacing show this is a serious practice
- **Accessible** - Clear CTAs, good contrast, and responsive design work for everyone
- **Spiritual but Not Religious** - Language is inclusive and non-denominational

---

## 📞 Support

If you encounter issues with email setup:

1. Check this guide first
2. Review Supabase Auth documentation
3. Contact Supabase support through Dashboard
4. Reach out to email provider (Resend, SendGrid, etc.) support

For Inner Ascend app-specific questions:
- Email: hello@inner-ascend.com
- Check project documentation in `/docs` folder

---

**May your emails reach the inboxes they're meant for, and may your users find their way home.** ✨🌙
