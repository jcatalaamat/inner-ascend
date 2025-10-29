import { Onboarding, OnboardingStepInfo, StepContent } from '@my/ui'
import { BookOpen, Sparkles, TrendingUp } from '@tamagui/lucide-icons'
import React from 'react'
import { useRouter } from 'solito/router'

const steps: OnboardingStepInfo[] = [
  {
    theme: 'purple',
    Content: () => (
      <StepContent
        title="Your Spiritual Journey Companion"
        icon={BookOpen}
        description="A student manual for the soul. Navigate shadow work, meditation, and personal transformation with structure and clarity."
      />
    ),
  },
  {
    theme: 'blue',
    Content: () => (
      <StepContent
        title="Practice Daily, Transform Deeply"
        icon={Sparkles}
        description="Track your emotional check-ins, meditation practices, and journaling. Build streaks, measure progress, witness your evolution."
      />
    ),
  },
  {
    theme: 'yellow',
    Content: () => (
      <StepContent
        title="Guided by Ancient Wisdom"
        icon={TrendingUp}
        description="16 comprehensive modules from Being Human 101. Learn shadow work, inner child healing, and conscious living — one lesson at a time."
      />
    ),
  },
]

/**
 * note: this screen is used as a standalone page on native and as a sidebar on auth layout on web
 */
export const OnboardingScreen = () => {
  const router = useRouter()

  return (
    <Onboarding
      autoSwipe
      onOnboarded={() => {
        router.push('/sign-up')
      }}
      steps={steps}
    />
  )
}
