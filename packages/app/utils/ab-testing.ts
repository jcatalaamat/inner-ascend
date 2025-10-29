// No-op A/B testing implementation (PostHog removed)

export const useABTesting = () => {
  return {
    trackExperimentView: (
      experimentName: string,
      variant: string | boolean | undefined,
      properties?: Record<string, any>
    ) => {
      // No-op
    },
    trackExperimentConversion: (
      experimentName: string,
      variant: string | boolean | undefined,
      conversionType: string,
      properties?: Record<string, any>
    ) => {
      // No-op
    },
    trackExperimentInteraction: (
      experimentName: string,
      variant: string | boolean | undefined,
      interaction: string,
      properties?: Record<string, any>
    ) => {
      // No-op
    },
  }
}

// Predefined experiments (kept for backward compatibility)
export const EXPERIMENTS = {
  HOME_LAYOUT: 'home_layout_experiment',
  CREATE_BUTTON_PLACEMENT: 'create_button_placement_experiment',
  MAP_DEFAULT_VIEW: 'map_default_view_experiment',
  SEARCH_PLACEMENT: 'search_placement_experiment',
  ONBOARDING_FLOW: 'onboarding_flow_experiment',
} as const

// Helper hooks (no-op, always return control variant)
export const useHomeLayoutExperiment = () => {
  return {
    variant: 'control',
    trackView: () => {},
    trackConversion: (conversionType: string) => {},
  }
}

export const useCreateButtonExperiment = () => {
  return {
    variant: 'control',
    trackView: () => {},
    trackConversion: (conversionType: string) => {},
  }
}

export const useMapViewExperiment = () => {
  return {
    variant: 'control',
    trackView: () => {},
    trackConversion: (conversionType: string) => {},
  }
}
