import { usePostHog } from 'posthog-react-native'

// Funnel analysis utilities
export const useFunnelAnalysis = () => {
  const posthog = usePostHog()

  const trackFunnelStep = (
    funnelName: string,
    step: string,
    stepNumber: number,
    totalSteps: number,
    properties?: Record<string, any>
  ) => {
    posthog?.capture('funnel_step_completed', {
      funnel_name: funnelName,
      step,
      step_number: stepNumber,
      total_steps: totalSteps,
      completion_percentage: (stepNumber / totalSteps) * 100,
      ...properties,
    })
  }

  const trackFunnelConversion = (
    funnelName: string,
    conversionType: string,
    properties?: Record<string, any>
  ) => {
    posthog?.capture('funnel_conversion', {
      funnel_name: funnelName,
      conversion_type: conversionType,
      ...properties,
    })
  }

  const trackFunnelDropoff = (
    funnelName: string,
    step: string,
    stepNumber: number,
    reason?: string,
    properties?: Record<string, any>
  ) => {
    posthog?.capture('funnel_dropoff', {
      funnel_name: funnelName,
      step,
      step_number: stepNumber,
      dropoff_reason: reason,
      ...properties,
    })
  }

  return {
    trackFunnelStep,
    trackFunnelConversion,
    trackFunnelDropoff,
  }
}

// Predefined funnels
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

// Helper functions for common funnels
export const trackUserOnboardingStep = (step: string, stepNumber: number) => {
  const { trackFunnelStep } = useFunnelAnalysis()
  trackFunnelStep(
    FUNNELS.USER_ONBOARDING.name,
    step,
    stepNumber,
    FUNNELS.USER_ONBOARDING.steps.length
  )
}

export const trackEventCreationStep = (step: string, stepNumber: number) => {
  const { trackFunnelStep } = useFunnelAnalysis()
  trackFunnelStep(
    FUNNELS.EVENT_CREATION.name,
    step,
    stepNumber,
    FUNNELS.EVENT_CREATION.steps.length
  )
}

export const trackPlaceCreationStep = (step: string, stepNumber: number) => {
  const { trackFunnelStep } = useFunnelAnalysis()
  trackFunnelStep(
    FUNNELS.PLACE_CREATION.name,
    step,
    stepNumber,
    FUNNELS.PLACE_CREATION.steps.length
  )
}
