import type { EventCategory } from './constants'

export type DateRangeType = 'today' | 'this_weekend' | 'next_week' | 'custom' | 'all'
export type TimeOfDay = 'morning' | 'afternoon' | 'evening'
export type PriceRange = 'free' | '$' | '$$' | '$$$'

export interface DateRange {
  type: DateRangeType
  start?: string // ISO date string
  end?: string // ISO date string
}

export interface EventFilters {
  categories?: EventCategory[]
  dateRange?: DateRange
  timeOfDay?: TimeOfDay[]
  priceRanges?: PriceRange[]
  tags?: string[]
  searchQuery?: string
}

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  filters: EventFilters
  notify_on_match: boolean
  last_notified_at?: string
  created_at: string
  updated_at: string
}

// Helper functions
export const getDateRangePreset = (type: DateRangeType): { start: Date; end: Date } | null => {
  const now = new Date()
  // Set to midnight for consistent date comparisons
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  today.setHours(0, 0, 0, 0)

  switch (type) {
    case 'today': {
      // Today only
      const start = new Date(today)
      start.setHours(0, 0, 0, 0)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { start, end }
    }

    case 'this_weekend': {
      // Get next Saturday and Sunday
      const dayOfWeek = today.getDay()
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
      const saturday = new Date(today)
      saturday.setDate(today.getDate() + daysUntilSaturday)
      saturday.setHours(0, 0, 0, 0)
      const sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)
      sunday.setHours(23, 59, 59, 999)
      return { start: saturday, end: sunday }
    }

    case 'next_week': {
      // Next 7 days from today
      const start = new Date(today)
      start.setHours(0, 0, 0, 0)
      const end = new Date(today)
      end.setDate(today.getDate() + 7)
      end.setHours(23, 59, 59, 999)
      return { start, end }
    }

    case 'all':
      return null

    case 'custom':
      return null

    default:
      return null
  }
}

export const isTimeInRange = (timeString: string | null | undefined, timeOfDay: TimeOfDay): boolean => {
  if (!timeString) return true // If no time specified, don't filter

  // Parse time (format: "HH:MM" or "HH:MM:SS")
  const [hours] = timeString.split(':').map(Number)

  switch (timeOfDay) {
    case 'morning':
      return hours >= 6 && hours < 12
    case 'afternoon':
      return hours >= 12 && hours < 18
    case 'evening':
      return hours >= 18 || hours < 6
    default:
      return true
  }
}

export const matchesPriceRange = (
  price: string | null | undefined,
  ranges: PriceRange[]
): boolean => {
  if (!price) return ranges.includes('free')

  const priceText = price.toLowerCase()

  // Check for free
  if (ranges.includes('free') && (priceText.includes('free') || priceText.includes('donation'))) {
    return true
  }

  // Extract numbers from price
  const numbers = price.match(/\d+/g)
  if (!numbers || numbers.length === 0) return false

  const amount = parseInt(numbers[0], 10)

  // Price ranges (in MXN pesos)
  if (ranges.includes('$') && amount < 200) return true
  if (ranges.includes('$$') && amount >= 200 && amount < 500) return true
  if (ranges.includes('$$$') && amount >= 500) return true

  return false
}

export const hasActiveFilters = (filters: EventFilters): boolean => {
  return !!(
    (filters.categories && filters.categories.length > 0) ||
    (filters.dateRange && filters.dateRange.type !== 'all') ||
    (filters.timeOfDay && filters.timeOfDay.length > 0) ||
    (filters.priceRanges && filters.priceRanges.length > 0) ||
    (filters.tags && filters.tags.length > 0)
  )
}

export const getActiveFilterCount = (filters: EventFilters): number => {
  let count = 0
  if (filters.categories && filters.categories.length > 0) count++
  if (filters.dateRange && filters.dateRange.type !== 'all') count++
  if (filters.timeOfDay && filters.timeOfDay.length > 0) count++
  if (filters.priceRanges && filters.priceRanges.length > 0) count++
  if (filters.tags && filters.tags.length > 0) count++
  return count
}
