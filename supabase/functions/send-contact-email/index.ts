// Edge Function to send contact/support emails
// Called directly from the app when users want to contact support

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ContactRequest {
  user_id?: string
  user_email?: string
  user_name?: string
  subject: string
  message: string
  type: 'support' | 'general' | 'delete_account'
}

const ADMIN_EMAIL = 'alerts@inner-ascend.com'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

/**
 * Send contact/support email to admin
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

    // Parse request body
    const contactRequest: ContactRequest = await req.json()

    // Validate required fields
    if (!contactRequest.subject || !contactRequest.message) {
      return new Response(
        JSON.stringify({ error: 'Subject and message are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client to fetch user info if user_id provided
    let userName = contactRequest.user_name || 'Anonymous User'
    let userEmail = contactRequest.user_email || 'Not provided'

    if (contactRequest.user_id) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('name')
        .eq('id', contactRequest.user_id)
        .single()

      if (profile?.name) {
        userName = profile.name
      }

      // Get user email from auth
      const { data: { user } } = await supabaseClient.auth.admin.getUserById(contactRequest.user_id)
      if (user?.email) {
        userEmail = user.email
      }
    }

    // Format type for display
    const typeLabels = {
      support: 'Support Request',
      general: 'General Inquiry',
      delete_account: 'Account Deletion Request',
    }

    const typeLabel = typeLabels[contactRequest.type] || 'Contact Request'
    const typeEmoji = contactRequest.type === 'delete_account' ? '🗑️' : contactRequest.type === 'support' ? '🆘' : '📧'

    // Build email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${contactRequest.type === 'delete_account' ? '#ff4444' : '#0066cc'}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .detail { margin: 15px 0; }
            .label { font-weight: bold; color: #666; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">${typeEmoji} ${typeLabel}</h1>
            <p style="margin: 5px 0 0 0;">${contactRequest.subject}</p>
          </div>

          <div class="content">
            <div class="detail">
              <span class="label">Type:</span> ${typeLabel}
            </div>
            <div class="detail">
              <span class="label">Subject:</span> ${contactRequest.subject}
            </div>
            <div class="detail">
              <span class="label">Message:</span><br>
              ${contactRequest.message.replace(/\n/g, '<br>')}
            </div>
            <div class="detail">
              <span class="label">From:</span> ${userName} (${userEmail})
            </div>
            ${contactRequest.user_id ? `
            <div class="detail">
              <span class="label">User ID:</span> ${contactRequest.user_id}
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>This is an automated message from Inner Ascend's contact system.</p>
            <p>Reply directly to this email to respond to the user.</p>
          </div>
        </body>
      </html>
    `

    const emailText = `
${typeLabel} - Inner Ascend

Type: ${typeLabel}
Subject: ${contactRequest.subject}
Message: ${contactRequest.message}
From: ${userName} (${userEmail})
${contactRequest.user_id ? `User ID: ${contactRequest.user_id}\n` : ''}
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
        reply_to: userEmail !== 'Not provided' ? userEmail : ADMIN_EMAIL,
        subject: `${typeEmoji} ${typeLabel}: ${contactRequest.subject}`,
        html: emailHtml,
        text: emailText,
      }),
    })

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      throw new Error(`Resend API error: ${resendResponse.status} - ${errorText}`)
    }

    const resendResult = await resendResponse.json()

    console.log('✅ Contact email sent successfully:', resendResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact email sent successfully',
        email_id: resendResult.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('❌ Error sending contact email:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
