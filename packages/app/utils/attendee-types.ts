/**
 * Type definitions for the RSVP / "I'm Going" system
 * Similar pattern to report-types.ts
 */

export type AttendeeStatus = 'going' | 'interested' | 'maybe'

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  status: AttendeeStatus
  created_at: string
  updated_at: string
}

export interface AttendeeWithProfile extends EventAttendee {
  profile?: {
    id: string
    name: string | null
    avatar_url: string | null
  }
}

export interface AttendeeSubmission {
  event_id: string
  status: AttendeeStatus
}

export interface EventAttendeeCounts {
  going: number
  interested: number
  maybe: number
  total: number
}

/**
 * Helper function to get display label for attendee status
 */
export const getAttendeeStatusLabel = (status: AttendeeStatus, t: (key: string) => string): string => {
  return t(`rsvp.status.${status}`)
}

/**
 * Helper function to get total "going" count
 */
export const getGoingCount = (counts: EventAttendeeCounts): number => {
  return counts.going
}

/**
 * Helper function to check if user has RSVP'd
 */
export const hasRsvp = (status: AttendeeStatus | null | undefined): boolean => {
  return status !== null && status !== undefined
}

/**
 * Helper function to get attendee status color
 */
export const getAttendeeStatusColor = (status: AttendeeStatus): string => {
  switch (status) {
    case 'going':
      return '$green9'
    case 'interested':
      return '$blue9'
    case 'maybe':
      return '$gray9'
    default:
      return '$gray9'
  }
}

/**
 * Helper function to get attendee status icon
 */
export const getAttendeeStatusIcon = (status: AttendeeStatus): string => {
  switch (status) {
    case 'going':
      return '✓'
    case 'interested':
      return '★'
    case 'maybe':
      return '?'
    default:
      return ''
  }
}
