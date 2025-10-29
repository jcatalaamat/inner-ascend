import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.27.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Anthropic client
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const anthropic = new Anthropic({
      apiKey: anthropicKey,
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get today's date
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // Check if we already have cosmic weather for today
    const { data: existingCache } = await supabase
      .from('cosmic_cache')
      .select('*')
      .eq('cache_date', today)
      .single()

    if (existingCache && existingCache.daily_message) {
      return new Response(
        JSON.stringify({
          success: true,
          cached: true,
          data: existingCache,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Generate cosmic weather with Claude Haiku 4.5
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: `You are a compassionate spiritual guide for the Inner Ascend app, where users are on a healing journey of self-discovery and shadow work.

Generate a short, poetic "cosmic weather" message for today (${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}). This should:

- Be 2-3 sentences max
- Feel warm, supportive, and non-judgmental
- Touch on themes of: healing, self-discovery, shadow work, inner child, integration, or authentic expression
- Use cosmic/nature metaphors (moon, stars, seasons, tides, growth)
- Encourage presence, acceptance, and trust in the process
- Avoid being preachy or prescriptive
- Feel like wisdom from a trusted guide

Examples of the tone:
- "The journey inward requires stillness. Today, let yourself simply be—without the need to fix, change, or understand everything. Trust that your healing unfolds in perfect timing."
- "Like the moon, you are allowed to go through phases. Honor where you are today, knowing that transformation is not linear."
- "What if you didn't have to carry it all alone? Today, practice asking for support—from your future self, your inner child, or the universe itself."

Generate today's cosmic weather message:`,
        },
      ],
    })

    const dailyMessage = message.content[0].type === 'text' ? message.content[0].text : ''

    // Save to cosmic_cache
    const { data: savedCache, error: cacheError } = await supabase
      .from('cosmic_cache')
      .upsert(
        {
          cache_date: today,
          daily_message: dailyMessage,
          moon_phase: null, // Could add real moon phase API
          moon_sign: null, // Could add real astrology API
          planetary_transits: null,
        },
        {
          onConflict: 'cache_date',
        }
      )
      .select()
      .single()

    if (cacheError) {
      console.error('Cache error:', cacheError)
      throw cacheError
    }

    return new Response(
      JSON.stringify({
        success: true,
        cached: false,
        data: savedCache,
        message: dailyMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error generating cosmic weather:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
