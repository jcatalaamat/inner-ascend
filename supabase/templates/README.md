# Inner Ascend Email Templates

Beautiful, cosmic-themed email templates for Supabase authentication emails.

## 📁 Template Files

Located in `supabase/templates/emails/`:

- **[confirm-signup.html](emails/confirm-signup.html)** - "Welcome to Inner Ascend - Confirm Your Email ✨"
- **[reset-password.html](emails/reset-password.html)** - "Reset Your Inner Ascend Password 🔐"
- **[magic-link.html](emails/magic-link.html)** - "Your Magic Link to Inner Ascend ✨"
- **[change-email.html](emails/change-email.html)** - "Confirm Your Email Change - Inner Ascend 📧"
- **[invite.html](emails/invite.html)** - "You're Invited to Inner Ascend 🌟"

## ✨ Design Features

- **Cosmic Theme**: Deep space backgrounds with purple gradients matching Inner Ascend brand
- **Responsive**: Works perfectly on mobile and desktop email clients
- **Accessible**: High contrast, clear CTAs, proper alt text
- **Professional**: Clean layout with consistent spacing and typography
- **Spiritual Tone**: Warm, inviting language aligned with Inner Ascend's mission

### Color Palette

```css
Deep Space: #0A0A0F, #1a1a2e, #16213e
Cosmic Violet: #8A67F5, #6B4FBB
Silver Moon: #E8E8F0
Warning Gold: #FFB800
Integration Green: #4ECDC4
```

## 🚀 Quick Setup

### 1. Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your Inner Ascend project
3. Navigate to **Authentication** → **Email Templates**

### 2. Copy & Paste Templates

For each email type:
1. Open the corresponding HTML file from `supabase/templates/emails/`
2. Copy the entire HTML content
3. Paste into the "Message Body (HTML)" field in Supabase Dashboard
4. Update the subject line (see below)
5. Click **Save**

### 3. Recommended Subject Lines

```
Confirm Signup: Welcome to Inner Ascend - Confirm Your Email ✨
Reset Password: Reset Your Inner Ascend Password 🔐
Magic Link: Your Magic Link to Inner Ascend ✨
Change Email: Confirm Your Email Change - Inner Ascend 📧
Invite: You're Invited to Inner Ascend 🌟
```

## 📝 Template Variables

Supabase automatically replaces these variables:

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | Action link (confirm, reset, etc.) |
| `{{ .Email }}` | User's email address |
| `{{ .SiteURL }}` | Your app's site URL |
| `{{ .Token }}` | Raw token (advanced use) |
| `{{ .TokenHash }}` | Hashed token (advanced use) |

## 🧪 Testing

### Local Testing (Inbucket)

```bash
npx supabase start
# Access Inbucket at http://localhost:54324
```

**Note**: Local Supabase uses default templates. Test custom templates in staging/production.

### Production Testing

1. Deploy templates to Supabase Dashboard
2. Create a test account with your real email
3. Trigger each email type (signup, password reset, etc.)
4. Verify rendering across email clients

## 🔧 Configuration

### Email Provider Setup

Currently configured with **Resend**:
- From: `hello@inner-ascend.com`
- Alerts: `alerts@inner-ascend.com`
- API Key stored as Supabase secret: `RESEND_API_KEY`

### SMTP Setup (Optional)

For custom SMTP in Supabase Dashboard → Settings → Auth:

```
Host: smtp.resend.com
Port: 465 (SSL) or 587 (TLS)
Username: resend
Password: [Your Resend API Key]
Sender: hello@inner-ascend.com
```

## 📋 Pre-Launch Checklist

- [ ] All auth email templates configured in Supabase Dashboard
- [ ] Subject lines updated with Inner Ascend branding
- [ ] Domain `inner-ascend.com` verified in Resend
- [ ] SMTP configured (if using custom provider)
- [ ] SPF/DKIM/DMARC records set up for domain
- [ ] Tested all email flows (signup, reset, change email, magic link)
- [ ] Emails render correctly on mobile and desktop
- [ ] All links work correctly
- [ ] Contact email updated to `hello@inner-ascend.com`

## 🎨 Customization

### Update Email Addresses

All templates reference:
- `hello@inner-ascend.com` - Primary contact
- `inner-ascend.com` - Website
- `alerts@inner-ascend.com` - System alerts

### Modify Colors

Search and replace hex codes in templates:
- Primary Purple: `#8A67F5`
- Background: `#0A0A0F`, `#1a1a2e`
- Text: `#E8E8F0`

### Change Content

Feel free to modify:
- Welcome messages and tone
- Feature lists
- Footer information
- Security notices

## 📚 Additional Resources

- [Full Setup Guide](EMAIL_SETUP_GUIDE.md) - Comprehensive configuration instructions
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Resend Documentation](https://resend.com/docs)

## 🐛 Troubleshooting

### Emails Not Sending

1. Check SMTP credentials in Supabase Dashboard
2. Verify sender email is verified in Resend
3. Check Supabase logs: Dashboard → Logs → Filter "email"

### Emails Going to Spam

1. Set up SPF, DKIM, DMARC records
2. Use verified sending domain
3. Test with [Mail Tester](https://www.mail-tester.com)

### Styling Issues

Email HTML has limited CSS support:
- Use inline styles (already done)
- Avoid modern CSS features
- Test across multiple email clients

## 💡 Tips

- Always use inline CSS for email styling
- Test on Gmail, Outlook, Apple Mail at minimum
- Keep emails under 102KB to avoid Gmail clipping
- Use alt text for all images
- Provide plain text fallback (included in templates)

---

**Created with love for the Inner Ascend journey** 🌙✨

For questions: hello@inner-ascend.com
