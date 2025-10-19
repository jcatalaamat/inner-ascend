/**
 * Constants for Inner Ascend
 * Event categories, place types, colors, and other app-wide constants
 */

// Event categories matching database enum
export const EVENT_CATEGORIES = [
  'yoga',
  'ceremony',
  'workshop',
  'party',
  'market',
  'other',
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

// Place types matching database enum
export const PLACE_TYPES = ['retreat', 'wellness', 'restaurant', 'activity', 'community'] as const

export type PlaceType = (typeof PLACE_TYPES)[number]

// Category display names
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  yoga: 'Yoga',
  ceremony: 'Ceremony',
  workshop: 'Workshop',
  party: 'Party',
  market: 'Market',
  other: 'Other',
}

// Place type display names
export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  retreat: 'Retreat',
  wellness: 'Wellness',
  restaurant: 'Restaurant',
  activity: 'Activity',
  community: 'Community',
}

// Tamagui theme names for event categories
export const CATEGORY_COLORS: Record<EventCategory, string> = {
  yoga: 'orange',
  ceremony: 'purple',
  workshop: 'blue',
  party: 'pink',
  market: 'green',
  other: 'gray',
}

// Tamagui theme names for place types
export const PLACE_TYPE_COLORS: Record<PlaceType, string> = {
  retreat: 'green',
  wellness: 'blue',
  restaurant: 'orange',
  activity: 'yellow',
  community: 'purple',
}

// Price range options for places
export const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'] as const

export type PriceRange = (typeof PRICE_RANGES)[number]

// Default coordinates
export const MAZUNTE_CENTER = {
  latitude: 15.666,
  longitude: -96.556,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

// Common tags for places
export const COMMON_TAGS = [
  'vegan',
  'vegetarian',
  'organic',
  'plastic-free',
  'eco-friendly',
  'solar-powered',
  'ocean-view',
  'beachfront',
  'wifi',
  'co-working',
] as const

export type CommonTag = (typeof COMMON_TAGS)[number]
