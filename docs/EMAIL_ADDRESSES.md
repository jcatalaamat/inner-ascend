# Mazunte Connect Email Addresses

This document outlines all email addresses used in the Mazunte Connect application.

## Primary Contact Email

**hello@mazunteconnect.com** - Main contact email for all inquiries

This is the single, unified email address for all user communications.

## Email Usage by Type

All inquiries are directed to `hello@mazunteconnect.com`:

### User Support
- **General Support**: Technical issues, app questions, feature requests
- **Feedback**: User feedback, suggestions, bug reports
- **Account Deletion**: GDPR/data deletion requests

### Legal & Compliance
- **Privacy Inquiries**: Data rights, GDPR requests, privacy questions
- **Legal Matters**: Terms of Service questions, legal inquiries
- **Compliance**: General compliance and policy questions

### Community
- **General Contact**: Questions, suggestions, involvement opportunities
- **Partnerships**: Business inquiries, collaboration requests

## Implementation

The email is used in the following locations:

### Settings Screen
- **Feedback**: Opens email with subject "Mazunte Connect - Feedback"
- **Support Request**: Opens email with subject "Mazunte Connect - Support Request"
- **Account Deletion**: Opens email with subject "Account Deletion Request" (includes user email and ID)

### About Page
- General contact for questions and involvement

### Privacy Policy
- Data rights and privacy inquiries
- General privacy questions

### Terms of Service
- Legal and Terms of Service questions

### Fallback Messages
- Error message when email client cannot be opened

## Email Configuration

### Required Email Setup

Configure your email provider to receive emails at:
- `hello@mazunteconnect.com`

### Optional Email Aliases (for organization)

You may optionally configure these email aliases to forward to `hello@`:
- `support@mazunteconnect.com` → `hello@mazunteconnect.com` (legacy)
- `privacy@mazunteconnect.com` → `hello@mazunteconnect.com` (for dedicated privacy inbox)
- `legal@mazunteconnect.com` → `hello@mazunteconnect.com` (for dedicated legal inbox)

**Note**: These aliases are not required by the app. All emails go to `hello@` by default.

## Best Practices

1. **Monitor Regularly**: Check `hello@mazunteconnect.com` daily for user inquiries
2. **Response Time**: Aim to respond within 24-48 hours
3. **Account Deletions**: Process within 30 days per GDPR requirements
4. **Email Filters**: Use labels/folders to organize:
   - Subject line filtering (Feedback, Support Request, Account Deletion Request)
   - Priority tagging for urgent matters
5. **Auto-Responders**: Consider setting up auto-reply acknowledging receipt

## Contact Methods Comparison

| Method | Primary Use | Email |
|--------|-------------|-------|
| Email | All types of inquiries | hello@mazunteconnect.com |
| WhatsApp | Quick feedback, community | +34 611 144 170 |
| Instagram | Social engagement | @astralintegration |

## Maintenance

When updating email addresses in the app:

### Files to Update:
1. **Settings Screen**: `packages/app/features/settings/screen.tsx`
   - Line ~152: Feedback email handler
   - Line ~159: Support request email handler
   - Line ~194: Account deletion email handler

2. **Translation Files**:
   - `packages/app/i18n/locales/en.json`
     - Line ~256: Fallback message
     - Line ~338: Privacy Policy contact
     - Line ~342: Privacy Policy questions
     - Line ~360: Terms of Service contact

   - `packages/app/i18n/locales/es.json`
     - Same line numbers as English file

3. **Documentation**:
   - This file (`docs/EMAIL_ADDRESSES.md`)
   - `docs/NATIVE_ADS.md` (if applicable)

## Change History

- **2025-01-XX**: Consolidated all emails to `hello@mazunteconnect.com`
  - Changed from: `support@`, `privacy@`, `legal@`
  - Reason: Simplified to single point of contact
  - Implemented by: Claude Code

---

**Last Updated**: January 2025
**Maintained By**: Mazunte Connect Team
