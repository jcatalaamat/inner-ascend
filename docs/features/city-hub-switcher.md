# City Hub Switcher Feature

## Overview
The City Hub Switcher allows users to switch between different cities in the app (Mazunte, Puerto Escondido, Tulum, Playa del Carmen) and see events and places filtered by the selected city.

## Feature Flag
- **Flag Name**: `enable-city-hub-switcher`
- **Type**: Boolean
- **Default**: `false` (disabled)
- **Platform**: PostHog

When disabled, the switcher is hidden and the app behaves as before (showing only Mazunte content).

## Components

### CityHubSwitcher
**Location**: `packages/app/features/home/components/CityHubSwitcher.tsx`

A horizontal row of 4 city cards with:
- Gradient backgrounds (unique color per city)
- City emoji icon
- City name (shortened for space)
- Active indicator (white bar at bottom)
- Press animations and visual feedback
- Opacity dimming for inactive cities (coming soon)

### CityContext
**Location**: `packages/app/contexts/CityContext.tsx`

Global context for managing selected city state:
- Persists selected city to AsyncStorage
- Provides `selectedCity` and `setSelectedCity` to all components
- Automatically loads saved city on app launch

## Database Schema

### Cities Table
```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  emoji TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Foreign Keys
- `events.city_id` → `cities.id`
- `places.city_id` → `cities.id`

Both default to `'mazunte'` for existing data.

## Available Cities

| ID | Name (EN) | Name (ES) | Emoji | Active | Coordinates |
|----|-----------|-----------|-------|--------|-------------|
| mazunte | Mazunte | Mazunte | 🌊 | ✅ | 15.6658, -96.7347 |
| puerto-escondido | Puerto Escondido | Puerto Escondido | 🏄 | ❌ | 15.8655, -97.0536 |
| tulum | Tulum | Tulum | 🏛️ | ❌ | 20.2114, -87.4654 |
| playa-del-carmen | Playa del Carmen | Playa del Carmen | 🏖️ | ❌ | 20.6296, -87.0739 |

**Note**: Only Mazunte is currently active with events/places data.

## Gradient Colors

Each city has a unique gradient:
- **Mazunte**: Purple gradient (#667eea → #764ba2)
- **Puerto Escondido**: Pink gradient (#f093fb → #f5576c)
- **Tulum**: Blue gradient (#4facfe → #00f2fe)
- **Playa del Carmen**: Green gradient (#43e97b → #38f9d7)

## Integration Points

### Home Screen
- **Location**: `packages/app/features/home/screen.tsx`
- **Position**: Above greetings section
- **Behavior**: All event sections filter by selected city

### Events Screen
- **Location**: `packages/app/features/events/screen.tsx`
- **Query**: `useEventsQuery({ city_id: selectedCity })`
- **Behavior**: Shows only events for selected city

### Places Screen
- **Location**: `packages/app/features/places/screen.tsx`
- **Query**: `usePlacesQuery({ city_id: selectedCity })`
- **Behavior**: Shows only places for selected city

## Query Filters

### useEventsQuery
```typescript
interface EventFilters {
  category?: EventCategory | null
  ecoConscious?: boolean
  search?: string
  includePast?: boolean
  city_id?: string  // NEW
}
```

### usePlacesQuery
```typescript
interface PlaceFilters {
  type?: PlaceType | null
  ecoConscious?: boolean
  verified?: boolean
  search?: string
  tags?: string[]
  city_id?: string  // NEW
}
```

## User Flow

1. User opens app (home screen)
2. If feature flag enabled, city switcher appears at top
3. User taps on a city card
4. Selected city saves to AsyncStorage
5. All screens (Home, Events, Places) instantly filter to show that city's content
6. City selection persists across app restarts

## Empty States

When switching to cities without content (Puerto, Tulum, Playa):
- Home sections show "No events this week/weekend/next week"
- Events screen shows empty state
- Places screen shows empty state

This is expected behavior until content is added for those cities.

## Development

### Adding a New City

1. Add to cities table:
```sql
INSERT INTO cities (id, name_en, name_es, emoji, is_active, lat, lng)
VALUES ('new-city', 'New City', 'Nueva Ciudad', '🏙️', true, 0.0, 0.0);
```

2. Add gradient colors to `CityHubSwitcher.tsx`:
```typescript
const CITY_GRADIENTS: Record<string, string[]> = {
  'new-city': ['#hexcode1', '#hexcode2'],
}
```

3. Add short names:
```typescript
const CITY_SHORT_NAMES: Record<string, { en: string; es: string }> = {
  'new-city': { en: 'New City', es: 'Nueva' },
}
```

4. Add to cities array in component:
```typescript
{ id: 'new-city', emoji: '🏙️', isActive: true }
```

### Testing

1. Enable feature flag in PostHog
2. Restart app to see city switcher
3. Click different cities
4. Verify events/places filter correctly
5. Restart app to verify persistence

## Migration

**File**: `supabase/migrations/20251009180000_add_city_field.sql`

- Creates cities table with RLS policies
- Adds city_id to events and places
- Populates initial cities
- Sets all existing data to 'mazunte'
- Creates indexes for performance

## Performance Considerations

- Filtering done at database level (efficient)
- City selection cached in memory and AsyncStorage
- Queries include `city_id` in cache key
- Indexes on `city_id` columns for fast lookups

## Future Enhancements

- Fetch cities from database instead of hardcoded
- Admin panel to manage cities
- Geolocation-based city suggestion
- City-specific banners/announcements
- Multi-city event support
