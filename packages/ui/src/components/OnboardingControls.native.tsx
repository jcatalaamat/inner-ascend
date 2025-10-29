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
        pressStyle={{
          bg: '$color5',
          scale: 0.96,
        }}
        br="$3"
        onPress={() => handleSkip()}
      >
        <Button.Text col="$color10" fontWeight="600" size="$4">Skip</Button.Text>
      </Button>

      <Button
        f={1}
        size="$5"
        br="$4"
        bg="$color10"
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
        <Button.Text
          col="$color1"
          fontWeight="800"
          size="$5"
          letterSpacing={-0.5}
        >
          {isLastStep ? 'Start My Journey' : 'Continue'}
        </Button.Text>
      </Button>
    </XStack>
  )
}
