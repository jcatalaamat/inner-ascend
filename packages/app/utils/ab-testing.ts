import { usePostHog, useFeatureFlag } from 'posthog-react-native'

// A/B testing utilities
export const useABTesting = () => {
  const posthog = usePostHog()

  const trackExperimentView = (
    experimentName: string,
    variant: string | boolean | undefined,
    properties?: Record<string, any>
  ) => {
    posthog?.capture('experiment_viewed', {
      experiment: experimentName,
      variant: variant?.toString() || 'control',
      ...properties,
    })
  }

  const trackExperimentConversion = (
    experimentName: string,
    variant: string | boolean | undefined,
    conversionType: string,
    properties?: Record<string, any>
  ) => {
    posthog?.capture('experiment_conversion', {
      experiment: experimentName,
      variant: variant?.toString() || 'control',
      conversion_type: conversionType,
      ...properties,
    })
  }

  const trackExperimentInteraction = (
    experimentName: string,
    variant: string | boolean | undefined,
    interaction: string,
    properties?: Record<string, any>
  ) => {
    posthog?.capture('experiment_interaction', {
      experiment: experimentName,
      variant: variant?.toString() || 'control',
      interaction,
      ...properties,
    })
  }

  return {
    trackExperimentView,
    trackExperimentConversion,
    trackExperimentInteraction,
  }
}

// Predefined experiments
export const EXPERIMENTS = {
  HOME_LAYOUT: 'home_layout_experiment',
  CREATE_BUTTON_PLACEMENT: 'create_button_placement_experiment',
  MAP_DEFAULT_VIEW: 'map_default_view_experiment',
  SEARCH_PLACEMENT: 'search_placement_experiment',
  ONBOARDING_FLOW: 'onboarding_flow_experiment',
} as const

// Helper hooks for common experiments
export const useHomeLayoutExperiment = () => {
  const variant = useFeatureFlag(EXPERIMENTS.HOME_LAYOUT)
  const { trackExperimentView, trackExperimentConversion } = useABTesting()

  const trackView = () => {
    trackExperimentView(EXPERIMENTS.HOME_LAYOUT, variant)
  }

  const trackConversion = (conversionType: string) => {
    trackExperimentConversion(EXPERIMENTS.HOME_LAYOUT, variant, conversionType)
  }

  return {
    variant,
    trackView,
    trackConversion,
  }
}

export const useCreateButtonExperiment = () => {
  const variant = useFeatureFlag(EXPERIMENTS.CREATE_BUTTON_PLACEMENT)
  const { trackExperimentView, trackExperimentConversion } = useABTesting()

  const trackView = () => {
    trackExperimentView(EXPERIMENTS.CREATE_BUTTON_PLACEMENT, variant)
  }

  const trackConversion = (conversionType: string) => {
    trackExperimentConversion(EXPERIMENTS.CREATE_BUTTON_PLACEMENT, variant, conversionType)
  }

  return {
    variant,
    trackView,
    trackConversion,
  }
}

export const useMapViewExperiment = () => {
  const variant = useFeatureFlag(EXPERIMENTS.MAP_DEFAULT_VIEW)
  const { trackExperimentView, trackExperimentConversion } = useABTesting()

  const trackView = () => {
    trackExperimentView(EXPERIMENTS.MAP_DEFAULT_VIEW, variant)
  }

  const trackConversion = (conversionType: string) => {
    trackExperimentConversion(EXPERIMENTS.MAP_DEFAULT_VIEW, variant, conversionType)
  }

  return {
    variant,
    trackView,
    trackConversion,
  }
}
