import { ChevronRight } from '@tamagui/lucide-icons'
import { Text, XStack, YStack } from 'tamagui'

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
      {/* Skip button - plain pressable */}
      <YStack
        px="$4"
        py="$3"
        br="$3"
        onPress={() => handleSkip()}
        pressStyle={{
          bg: '$color5',
          scale: 0.96,
        }}
        cursor="pointer"
      >
        <Text col="$color10" fontWeight="600" size="$4">
          Skip
        </Text>
      </YStack>

      {/* Primary CTA button - bold Gumroad style */}
      <XStack
        f={1}
        px="$5"
        py="$4"
        br="$4"
        bg="$color10"
        ai="center"
        jc="center"
        gap="$2"
        borderWidth={4}
        borderColor="$color11"
        shadowColor="$color11"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={1}
        shadowRadius={0}
        onPress={() => handleGoNext()}
        pressStyle={{
          bg: '$color9',
          y: 4,
          shadowOffset: { width: 0, height: 0 },
        }}
        cursor="pointer"
      >
        <Text col="$color1" fontWeight="800" size="$5" letterSpacing={-0.5}>
          {isLastStep ? 'Start My Journey' : 'Continue'}
        </Text>
        {!isLastStep && <ChevronRight size={20} color="$color1" strokeWidth={3} />}
      </XStack>
    </XStack>
  )
}
