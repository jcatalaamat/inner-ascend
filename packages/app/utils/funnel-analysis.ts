// No-op funnel analysis implementation (PostHog removed)

export const useFunnelAnalysis = () => {
  return {
    trackFunnelStep: (
      funnelName: string,
      step: string,
      stepNumber: number,
      totalSteps: number,
      properties?: Record<string, any>
    ) => {
      // No-op
    },
    trackFunnelConversion: (
      funnelName: string,
      conversionType: string,
      properties?: Record<string, any>
    ) => {
      // No-op
    },
    trackFunnelDropoff: (
      funnelName: string,
      step: string,
      stepNumber: number,
      reason?: string,
      properties?: Record<string, any>
    ) => {
      // No-op
    },
  }
}

// Predefined funnels (kept for backward compatibility)
export const FUNNELS = {
  USER_ONBOARDING: {
    name: 'user_onboarding',
    steps: [
      'app_opened',
      'signup_started',
      'signup_completed',
      'profile_created',
      'first_event_viewed',
      'first_place_viewed',
    ],
  },
  EVENT_CREATION: {
    name: 'event_creation',
    steps: [
      'create_button_clicked',
      'event_form_opened',
      'event_details_filled',
      'event_location_selected',
      'event_submitted',
      'event_published',
    ],
  },
  PLACE_CREATION: {
    name: 'place_creation',
    steps: [
      'create_button_clicked',
      'place_form_opened',
      'place_details_filled',
      'place_location_selected',
      'place_submitted',
      'place_published',
    ],
  },
  EVENT_ENGAGEMENT: {
    name: 'event_engagement',
    steps: [
      'event_discovered',
      'event_viewed',
      'event_details_viewed',
      'event_favorited',
      'event_shared',
      'event_attended',
    ],
  },
} as const

// Helper functions (no-op)
export const trackUserOnboardingStep = (step: string, stepNumber: number) => {
  // No-op
}

export const trackEventCreationStep = (step: string, stepNumber: number) => {
  // No-op
}

export const trackPlaceCreationStep = (step: string, stepNumber: number) => {
  // No-op
}
