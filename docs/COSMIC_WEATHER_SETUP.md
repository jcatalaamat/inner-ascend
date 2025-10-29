# Cosmic Weather Setup Guide

## Overview

The Cosmic Weather feature generates daily personalized wisdom messages for users using **Claude 4.5 Haiku** (`claude-haiku-4-5-20251001`). Each day, a unique, compassionate message is generated and cached to provide fresh inspiration on the HOME screen.

## Features

- ✅ **Daily AI-Generated Messages** - Unique wisdom using Claude 4.5 Haiku
- ✅ **Database Caching** - Messages cached in `cosmic_cache` table for 24 hours
- ✅ **Automatic Fallback** - Static message if generation fails
- ✅ **Cost-Effective** - Uses Haiku model (fast & cheap)
- ✅ **Thematics** - Messages focus on healing, shadow work, inner child, integration

## Architecture

```
HOME Screen (index.tsx)
    ↓
useCosmicWeatherQuery hook
    ↓
1. Check cosmic_cache table for today's date
2. If found → return cached message
3. If not found → call Edge Function
    ↓
generate-cosmic-weather Edge Function
    ↓
1. Call Claude 4.5 Haiku API
2. Generate personalized message
3. Save to cosmic_cache table
4. Return message
```

## Setup Instructions

### 1. Set Anthropic API Key

You need to add your Anthropic API key to Supabase secrets.

**Get API Key:**
- Go to https://console.anthropic.com/
- Create an API key
- Copy the key (starts with `sk-ant-api...`)

**Add to Supabase (Local):**
```bash
# Create .env file in supabase/ directory
echo "ANTHROPIC_API_KEY=your-api-key-here" >> supabase/.env
```

**Add to Supabase (Remote):**
```bash
# Set secret in your Supabase project
npx supabase secrets set ANTHROPIC_API_KEY=your-api-key-here
```

### 2. Deploy Edge Function

**Deploy to local Supabase:**
```bash
# Function is already in supabase/functions/generate-cosmic-weather/
# It will be available automatically when running locally
npx supabase functions serve
```

**Deploy to remote Supabase:**
```bash
npx supabase functions deploy generate-cosmic-weather
```

### 3. Test the Function

**Test locally:**
```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-cosmic-weather' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json'
```

**Test in app:**
- Open the app
- Navigate to TODAY tab
- Check the "Cosmic Weather" card
- Refresh to see if a new message generates

## Database Schema

The `cosmic_cache` table stores daily cosmic weather:

```sql
CREATE TABLE cosmic_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_date DATE NOT NULL UNIQUE,
  moon_phase TEXT,
  moon_sign TEXT,
  planetary_transits JSONB,
  daily_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `cache_date` - Date (YYYY-MM-DD), unique per day
- `daily_message` - Generated wisdom from Claude
- `moon_phase`, `moon_sign`, `planetary_transits` - Reserved for future features
- `created_at` - Timestamp of generation

## How It Works

### Message Generation Prompt

The Edge Function sends this prompt to Claude 4.5 Haiku:

```
You are a compassionate spiritual guide for the Inner Ascend app,
where users are on a healing journey of self-discovery and shadow work.

Generate a short, poetic "cosmic weather" message for today. This should:
- Be 2-3 sentences max
- Feel warm, supportive, and non-judgmental
- Touch on themes of: healing, self-discovery, shadow work, inner child,
  integration, or authentic expression
- Use cosmic/nature metaphors (moon, stars, seasons, tides, growth)
- Encourage presence, acceptance, and trust in the process
- Avoid being preachy or prescriptive
- Feel like wisdom from a trusted guide
```

### Example Messages

- "The journey inward requires stillness. Today, let yourself simply be—without the need to fix, change, or understand everything. Trust that your healing unfolds in perfect timing."
- "Like the moon, you are allowed to go through phases. Honor where you are today, knowing that transformation is not linear."
- "What if you didn't have to carry it all alone? Today, practice asking for support—from your future self, your inner child, or the universe itself."

## Caching Strategy

### Why Cache?

1. **Cost Savings** - Claude API calls cost money; caching reduces calls
2. **Performance** - Instant load from database vs. API call
3. **Consistency** - Same message for all users for a given day
4. **Reliability** - Works even if API is down

### Cache Lifecycle

```
Day 1, 8:00 AM:
  - User opens app
  - No cache for today → Call API
  - Message generated and cached
  - User sees new message

Day 1, 2:00 PM:
  - User opens app again
  - Cache exists for today → Return cached
  - User sees same message (consistency!)

Day 2, 8:00 AM:
  - User opens app
  - No cache for Day 2 → Call API
  - New message generated and cached
```

### Manual Cache Refresh

If you want to regenerate today's message:

```sql
-- Delete today's cache
DELETE FROM cosmic_cache WHERE cache_date = CURRENT_DATE;

-- Next app load will generate a new message
```

## Cost Estimation

**Claude 4.5 Haiku Pricing:**
- Input: $0.80 / 1M tokens
- Output: $4.00 / 1M tokens

**Per Message Cost:**
- Prompt: ~200 tokens input
- Response: ~100 tokens output
- Cost per generation: ~$0.0005 (half a cent)

**Monthly Cost (1000 active users):**
- 1 message per day = 30 messages/month
- 30 messages × $0.0005 = **$0.015/month** (1.5 cents!)
- Extremely affordable 🎉

## Troubleshooting

### Message Not Generating

1. **Check API Key:**
```bash
# Local
cat supabase/.env | grep ANTHROPIC

# Remote
npx supabase secrets list
```

2. **Check Function Logs:**
```bash
npx supabase functions logs generate-cosmic-weather
```

3. **Check Database:**
```sql
SELECT * FROM cosmic_cache ORDER BY created_at DESC LIMIT 5;
```

### Using Fallback Message

If the API call fails, the app automatically uses a fallback message:

```typescript
// Fallback message in useCosmicWeatherQuery.ts
"The journey inward requires stillness. Today, let yourself simply be—
without the need to fix, change, or understand everything.
Trust that your healing unfolds in perfect timing."
```

### Testing Locally Without API Key

The hook will use the fallback message if:
- API key is not set
- Edge function fails
- API is down

So the app will always work, even without the API key configured.

## Future Enhancements

### 1. Moon Phase Integration

Add real moon phase data:

```typescript
// Use a moon phase API
const moonPhase = await fetch('https://api.example.com/moon-phase')
// Store in cosmic_cache.moon_phase
```

### 2. Astrology Integration

Add planetary transits:

```typescript
// Use an astrology API
const transits = await fetch('https://api.example.com/transits')
// Store in cosmic_cache.planetary_transits
```

### 3. Personalized Messages

Generate messages based on user's current module/progress:

```typescript
// Pass user context to Claude
const prompt = `User is on Module ${moduleId}, Day ${dayNum}.
  Theme: ${moduleTheme}. Generate relevant cosmic weather...`
```

### 4. Message History

Show past cosmic weather in a dedicated screen:

```typescript
// Already implemented in hook!
const { data: history } = useCosmicWeatherHistoryQuery(7)
// Returns last 7 days of messages
```

## Files Reference

**Edge Function:**
- `supabase/functions/generate-cosmic-weather/index.ts`

**React Query Hook:**
- `packages/app/utils/react-query/useCosmicWeatherQuery.ts`

**HOME Screen Integration:**
- `apps/expo/app/(drawer)/(tabs)/index.tsx` (lines 9, 61, 295-316)

**Database:**
- `supabase/migrations/20251019000000_inner_ascend_schema.sql` (cosmic_cache table)

## Success Criteria

✅ Cosmic weather generates daily
✅ Messages are cached for 24 hours
✅ Fallback works if API fails
✅ TypeScript errors resolved
✅ Cost is minimal (<$1/month for 1000 users)
✅ Messages feel warm and supportive
✅ Integration with HOME screen complete

The Cosmic Weather feature is now live and ready to inspire users daily! 🌙✨
