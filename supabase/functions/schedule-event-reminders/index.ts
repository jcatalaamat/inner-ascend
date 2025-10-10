// Edge Function to schedule event reminders
// This should be called via cron job (e.g., pg_cron) or manually

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Schedule event reminders for events happening soon
 * Checks events starting in the next 24 hours and creates reminder notifications
 *
 * Call this function via cron every hour:
 * SELECT cron.schedule('schedule-event-reminders', '0 * * * *', 'SELECT ...');
 */
serve(async (req) => {
  try {
    // Get authorization header (should be service_role key for cron jobs)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Find events happening in the next 24 hours
    const { data: upcomingEvents, error: eventsError } = await supabaseClient
      .from('events')
      .select('id, title, date, time, location_name')
      .gte('date', now.toISOString().split('T')[0])
      .lte('date', in24Hours.toISOString().split('T')[0])

    if (eventsError) {
      throw eventsError
    }

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No upcoming events found',
          scheduled_count: 0,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    let scheduledCount = 0

    // For each event, find users who have RSVP'd or favorited it
    for (const event of upcomingEvents) {
      // Combine event date and time
      let eventDateTime: Date
      if (event.time) {
        eventDateTime = new Date(`${event.date}T${event.time}`)
      } else {
        eventDateTime = new Date(event.date)
        eventDateTime.setHours(12, 0, 0, 0) // Default to noon if no time
      }

      // Calculate reminder times
      const oneHourBefore = new Date(eventDateTime.getTime() - 60 * 60 * 1000)
      const oneDayBefore = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000)

      // Find users who favorited this event
      const { data: favorites } = await supabaseClient
        .from('favorites')
        .select('user_id')
        .eq('item_id', event.id)
        .eq('item_type', 'event')

      if (!favorites || favorites.length === 0) {
        continue
      }

      const userIds = favorites.map((f) => f.user_id)

      // Check each user's notification preferences
      const { data: preferences } = await supabaseClient
        .from('notification_preferences')
        .select('user_id, event_reminders, reminder_1h_before, reminder_1d_before')
        .in('user_id', userIds)
        .eq('enabled', true)
        .eq('event_reminders', true)

      if (!preferences || preferences.length === 0) {
        continue
      }

      // Schedule 1-hour reminders
      for (const pref of preferences) {
        if (pref.reminder_1h_before && oneHourBefore > now) {
          const { error: queueError } = await supabaseClient.from('notification_queue').insert({
            user_id: pref.user_id,
            notification_type: 'event_reminder',
            title: `Starting Soon: ${event.title}`,
            body: `Your event starts in 1 hour at ${event.location_name}`,
            data: {
              event_id: event.id,
              reminder_type: '1h',
            },
            scheduled_for: oneHourBefore.toISOString(),
            status: 'pending',
          })

          if (!queueError) {
            scheduledCount++
          }
        }

        // Schedule 1-day reminders
        if (pref.reminder_1d_before && oneDayBefore > now) {
          const { error: queueError } = await supabaseClient.from('notification_queue').insert({
            user_id: pref.user_id,
            notification_type: 'event_reminder',
            title: `Tomorrow: ${event.title}`,
            body: `Don't forget your event tomorrow at ${event.location_name}`,
            data: {
              event_id: event.id,
              reminder_type: '1d',
            },
            scheduled_for: oneDayBefore.toISOString(),
            status: 'pending',
          })

          if (!queueError) {
            scheduledCount++
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        events_processed: upcomingEvents.length,
        reminders_scheduled: scheduledCount,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error scheduling event reminders:', error)
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
