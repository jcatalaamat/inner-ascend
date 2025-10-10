// Follow this setup guide to integrate the Deno runtime into your IDE
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

interface PushNotification {
  to: string // Expo push token
  title: string
  body: string
  data?: Record<string, any>
  sound?: 'default' | null
  badge?: number
  priority?: 'default' | 'normal' | 'high'
}

interface RequestBody {
  user_id?: string
  user_ids?: string[]
  notification: {
    title: string
    body: string
    data?: Record<string, any>
  }
}

/**
 * Send push notifications via Expo Push API
 * Can send to a single user or multiple users
 *
 * Example request:
 * {
 *   "user_id": "uuid",
 *   "notification": {
 *     "title": "New Event!",
 *     "body": "Yoga class starting in 1 hour",
 *     "data": { "eventId": "event-uuid" }
 *   }
 * }
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

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Parse request body
    const { user_id, user_ids, notification }: RequestBody = await req.json()

    if (!user_id && !user_ids) {
      return new Response(JSON.stringify({ error: 'user_id or user_ids required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get user IDs to send to
    const targetUserIds = user_ids || [user_id!]

    // Fetch active push tokens for all target users
    const { data: tokens, error: tokensError } = await supabaseClient
      .from('push_tokens')
      .select('token, user_id, platform')
      .in('user_id', targetUserIds)
      .eq('is_active', true)

    if (tokensError) {
      throw tokensError
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No active push tokens found',
          sent_count: 0,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Check quiet hours for each user
    const tokensToSend: typeof tokens = []
    for (const token of tokens) {
      const { data: inQuietHours } = await supabaseClient.rpc('is_in_quiet_hours', {
        p_user_id: token.user_id,
      })

      if (!inQuietHours) {
        tokensToSend.push(token)
      } else {
        console.log(`Skipping notification for user ${token.user_id}: in quiet hours`)
      }
    }

    if (tokensToSend.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All users are in quiet hours',
          sent_count: 0,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Prepare Expo push notifications
    const messages: PushNotification[] = tokensToSend.map((token) => ({
      to: token.token,
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      sound: 'default',
      priority: 'high',
    }))

    // Send to Expo Push API
    const expoResponse = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(messages),
    })

    const expoResult = await expoResponse.json()

    // Log to notification_history
    for (let i = 0; i < tokensToSend.length; i++) {
      const token = tokensToSend[i]
      const ticket = expoResult.data?.[i]

      await supabaseClient.from('notification_history').insert({
        user_id: token.user_id,
        push_token_id: null, // We'd need to fetch the full token ID if needed
        notification_type: notification.data?.type || 'unknown',
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sent_at: new Date().toISOString(),
        delivered: ticket?.status === 'ok',
        expo_ticket_id: ticket?.id,
        expo_receipt: ticket,
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent_count: tokensToSend.length,
        expo_result: expoResult,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending push notification:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
