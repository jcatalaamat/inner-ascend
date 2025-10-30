// Edge Function to send email notifications for new content reports
// Triggered automatically by database webhook when new reports are created

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Report {
  id: string
  reporter_id: string | null
  item_id: string
  item_type: 'event' | 'place' | 'review' | 'user'
  reason: 'spam' | 'inappropriate' | 'misleading' | 'harassment' | 'duplicate' | 'other'
  description: string | null
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  created_at: string
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Report
  schema: string
  old_record: Report | null
}

const ADMIN_EMAIL = 'alerts@inner-ascend.com'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

/**
 * Send email notification to admin when new content report is submitted
 */
serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parse webhook payload
    const payload: WebhookPayload = await req.json()

    // Only process INSERT events for pending reports
    if (payload.type !== 'INSERT' || payload.record.status !== 'pending') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Not a new pending report, skipping email',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const report = payload.record

    // Create Supabase client to fetch additional data
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch reporter profile
    let reporterName = 'Anonymous'
    if (report.reporter_id) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('full_name')
        .eq('id', report.reporter_id)
        .single()

      if (profile?.full_name) {
        reporterName = profile.full_name
      }
    }

    // Fetch item details based on item_type
    let itemTitle = 'Unknown'
    let itemUrl = ''

    if (report.item_type === 'event') {
      const { data: event } = await supabaseClient
        .from('events')
        .select('title')
        .eq('id', report.item_id)
        .single()

      if (event) {
        itemTitle = event.title
        itemUrl = `https://app.inner-ascend.com/event/${report.item_id}`
      }
    } else if (report.item_type === 'place') {
      const { data: place } = await supabaseClient
        .from('places')
        .select('name')
        .eq('id', report.item_id)
        .single()

      if (place) {
        itemTitle = place.name
        itemUrl = `https://app.inner-ascend.com/place/${report.item_id}`
      }
    }

    // Format reason for display
    const reasonLabels = {
      spam: 'Spam or Scam',
      inappropriate: 'Inappropriate Content',
      misleading: 'Misleading Information',
      harassment: 'Harassment or Hate Speech',
      duplicate: 'Duplicate Listing',
      other: 'Other',
    }

    const reasonLabel = reasonLabels[report.reason] || report.reason

    // Build email content
    const adminDashboardUrl = `https://app.inner-ascend.com/admin/reports/${report.id}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff4444; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .button { display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">🚨 New Content Report</h1>
            <p style="margin: 5px 0 0 0;">A new report has been submitted and requires review</p>
          </div>

          <div class="content">
            <div class="detail">
              <span class="label">Report ID:</span> ${report.id}
            </div>
            <div class="detail">
              <span class="label">Item Type:</span> ${report.item_type.charAt(0).toUpperCase() + report.item_type.slice(1)}
            </div>
            <div class="detail">
              <span class="label">Item:</span> ${itemTitle}
            </div>
            <div class="detail">
              <span class="label">Reason:</span> ${reasonLabel}
            </div>
            ${report.description ? `
            <div class="detail">
              <span class="label">Description:</span><br>
              ${report.description.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            <div class="detail">
              <span class="label">Reported by:</span> ${reporterName}
            </div>
            <div class="detail">
              <span class="label">Submitted:</span> ${new Date(report.created_at).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${adminDashboardUrl}" class="button">Review in Admin Dashboard</a>
          </div>

          ${itemUrl ? `
          <div style="text-align: center; margin-top: 10px;">
            <a href="${itemUrl}" style="color: #0066cc;">View Reported Item</a>
          </div>
          ` : ''}

          <div class="footer">
            <p>This is an automated notification from Inner Ascend's content moderation system.</p>
            <p>You're receiving this because you're an admin at Inner Ascend.</p>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Content Report - Inner Ascend

Report ID: ${report.id}
Item Type: ${report.item_type}
Item: ${itemTitle}
Reason: ${reasonLabel}
${report.description ? `Description: ${report.description}\n` : ''}
Reported by: ${reporterName}
Submitted: ${new Date(report.created_at).toLocaleString()}

Review in Admin Dashboard: ${adminDashboardUrl}
${itemUrl ? `View Reported Item: ${itemUrl}` : ''}
    `

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email send')
      console.log('Email content (HTML):', emailHtml)
      console.log('Email content (Text):', emailText)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'RESEND_API_KEY not configured, email logged to console',
          report_id: report.id,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Inner Ascend Alerts <alerts@inner-ascend.com>',
        to: [ADMIN_EMAIL],
        subject: `🚨 New Report: ${reasonLabel} - ${itemTitle}`,
        html: emailHtml,
        text: emailText,
      }),
    })

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      throw new Error(`Resend API error: ${resendResponse.status} - ${errorText}`)
    }

    const resendResult = await resendResponse.json()

    console.log('✅ Email sent successfully:', resendResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification sent',
        report_id: report.id,
        email_id: resendResult.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('❌ Error sending report email:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        report_id: payload?.record?.id,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
