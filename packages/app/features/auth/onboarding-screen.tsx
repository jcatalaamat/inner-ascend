import { Onboarding, OnboardingStepInfo, StepContent } from '@my/ui'
import { Calendar, Home, Shield } from '@tamagui/lucide-icons'
import React from 'react'
import { useRouter } from 'solito/router'
import { usePostHog } from 'posthog-react-native'

const steps: OnboardingStepInfo[] = [
  {
    theme: 'orange',
    Content: () => (
      <StepContent
        title="Find authentic spiritual events wherever you travel"
        icon={Calendar}
        description="No more scattered WhatsApp groups — discover satsangs, kirtans, retreats, and ceremonies in one trusted place"
      />
    ),
  },
  {
    theme: 'green',
    Content: () => (
      <StepContent
        title="Step into conscious communities"
        icon={Home}
        description="Connect with retreat centers, eco-farms, ashrams, and local conscious hubs to deepen your journey"
      />
    ),
  },
  {
    theme: 'blue',
    Content: () => (
      <StepContent
        title="Safe, inclusive, and respectful"
        icon={Shield}
        description="Verified hosts, community reviews, and cultural etiquette cards help you feel at home — anywhere in the world"
      />
    ),
  },
]

/**
 * note: this screen is used as a standalone page on native and as a sidebar on auth layout on web
 */
export const OnboardingScreen = () => {
  const router = useRouter()
  const posthog = usePostHog()

  return (
    <Onboarding
      autoSwipe
      onOnboarded={() => {
        posthog?.capture('onboarding_completed')
        router.push('/sign-up')
      }}
      steps={steps}
    />
  )
}
