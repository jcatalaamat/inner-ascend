// Edge Function to send email notifications for user feedback
// Triggered automatically by database webhook when new feedback is created

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Feedback {
  id: string
  user_id: string | null
  user_email: string | null
  type: 'feedback' | 'feature_request' | 'bug_report' | 'support' | 'contact' | 'delete_account'
  title: string
  description: string
  device_info: Record<string, any> | null
  created_at: string
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Feedback
  schema: string
  old_record: Feedback | null
}

const ADMIN_EMAIL = 'alerts@innerascend.app'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

/**
 * Send email notification when user submits feedback
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

    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Not a new feedback, skipping email',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const feedback = payload.record

    // Create Supabase client to fetch user profile
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch user profile
    let userName = 'Anonymous User'
    let userEmail = feedback.user_email || 'Not provided'

    if (feedback.user_id) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('name')
        .eq('id', feedback.user_id)
        .single()

      if (profile?.name) {
        userName = profile.name
      }
    }

    // Format type for display
    const typeLabels = {
      feedback: 'General Feedback',
      feature_request: 'Feature Request',
      bug_report: 'Bug Report',
      support: 'Support Request',
      contact: 'General Contact',
      delete_account: 'Account Deletion Request',
    }

    const typeLabel = typeLabels[feedback.type] || feedback.type

    // Select emoji based on type
    let typeEmoji = '💬'
    if (feedback.type === 'bug_report') typeEmoji = '🐛'
    else if (feedback.type === 'feature_request') typeEmoji = '✨'
    else if (feedback.type === 'support') typeEmoji = '🆘'
    else if (feedback.type === 'contact') typeEmoji = '📧'
    else if (feedback.type === 'delete_account') typeEmoji = '🗑️'

    // Format device info
    let deviceInfoHtml = ''
    if (feedback.device_info) {
      deviceInfoHtml = `
        <div class="detail">
          <span class="label">Device Info:</span><br>
          <div style="font-size: 13px; color: #666; margin-top: 5px;">
            ${feedback.device_info.deviceName ? `Device: ${feedback.device_info.deviceName}<br>` : ''}
            ${feedback.device_info.osName ? `OS: ${feedback.device_info.osName} ${feedback.device_info.osVersion || ''}<br>` : ''}
            ${feedback.device_info.appVersion ? `App Version: ${feedback.device_info.appVersion} (${feedback.device_info.buildVersion || 'unknown'})<br>` : ''}
          </div>
        </div>
      `
    }

    // Build email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .detail { margin: 15px 0; }
            .label { font-weight: bold; color: #666; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">${typeEmoji} New ${typeLabel}</h1>
            <p style="margin: 5px 0 0 0;">User feedback submitted via Inner Ascend app</p>
          </div>

          <div class="content">
            <div class="detail">
              <span class="label">Type:</span> ${typeLabel}
            </div>
            <div class="detail">
              <span class="label">Title:</span> ${feedback.title}
            </div>
            <div class="detail">
              <span class="label">Description:</span><br>
              ${feedback.description.replace(/\n/g, '<br>')}
            </div>
            <div class="detail">
              <span class="label">From:</span> ${userName} (${userEmail})
            </div>
            ${deviceInfoHtml}
            <div class="detail">
              <span class="label">Submitted:</span> ${new Date(feedback.created_at).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </div>
          </div>

          <div class="footer">
            <p>This is an automated notification from Inner Ascend's feedback system.</p>
            <p>Reply directly to this email to contact the user.</p>
          </div>
        </body>
      </html>
    `

    const emailText = `
New ${typeLabel} - Inner Ascend

Type: ${typeLabel}
Title: ${feedback.title}
Description: ${feedback.description}
From: ${userName} (${userEmail})
${feedback.device_info ? `Device: ${feedback.device_info.deviceName || 'Unknown'}, OS: ${feedback.device_info.osName || 'Unknown'}\n` : ''}
Submitted: ${new Date(feedback.created_at).toLocaleString()}
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
          feedback_id: feedback.id,
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
        from: 'Inner Ascend Alerts <alerts@innerascend.app>',
        to: [ADMIN_EMAIL],
        reply_to: feedback.user_email || ADMIN_EMAIL,
        subject: `${typeEmoji} ${typeLabel}: ${feedback.title}`,
        html: emailHtml,
        text: emailText,
      }),
    })

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      throw new Error(`Resend API error: ${resendResponse.status} - ${errorText}`)
    }

    const resendResult = await resendResponse.json()

    console.log('✅ Feedback email sent successfully:', resendResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Feedback email sent',
        feedback_id: feedback.id,
        email_id: resendResult.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('❌ Error sending feedback email:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        feedback_id: payload?.record?.id,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
