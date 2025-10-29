import { ChevronRight } from '@tamagui/lucide-icons'
import { Button, XStack } from 'tamagui'

import { OnboardingControlsProps } from './OnboardingControls'

export const OnboardingControls = ({
  currentIdx,
  onChange,
  stepsCount,
  onFinish,
}: OnboardingControlsProps) => {
  const isLastStep = currentIdx === stepsCount - 1

  const handleGoNext = () => {
    if (currentIdx + 1 > stepsCount - 1) {
      onFinish?.()
      return
    }
    onChange(currentIdx + 1)
  }

  const handleSkip = () => {
    onFinish?.()
  }

  return (
    <XStack jc="space-between" ai="center" px="$6" pb="$5" pt="$3" gap="$4">
      <Button
        size="$4"
        chromeless
        col="$color10"
        fontWeight="600"
        pressStyle={{
          bg: '$color5',
          scale: 0.96,
        }}
        br="$3"
        onPress={() => handleSkip()}
      >
        Skip
      </Button>

      <Button
        f={1}
        size="$5"
        br="$4"
        bg="$color10"
        col="$color1"
        fontWeight="800"
        letterSpacing={-0.5}
        borderWidth={4}
        borderColor="$color11"
        shadowColor="$color11"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={1}
        shadowRadius={0}
        pressStyle={{
          bg: '$color9',
          y: 4,
          shadowOffset: { width: 0, height: 0 },
        }}
        onPress={() => handleGoNext()}
        iconAfter={isLastStep ? undefined : ChevronRight}
      >
        {isLastStep ? 'Start My Journey' : 'Continue'}
      </Button>
    </XStack>
  )
}
