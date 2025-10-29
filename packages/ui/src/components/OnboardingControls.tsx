import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Button, XStack } from 'tamagui'

export type OnboardingControlsProps = {
  currentIdx: number
  onChange: (newIdx: number) => void
  stepsCount: number
  /**
   * native only
   */
  onFinish?: () => void
}

export const OnboardingControls = ({
  currentIdx,
  onChange,
  stepsCount,
}: OnboardingControlsProps) => {
  const handleGoNext = () => {
    if (currentIdx + 1 > stepsCount - 1) {
      // onChange(0)
      return
    }
    onChange(currentIdx + 1)
  }

  const handleGoPrev = () => {
    if (currentIdx - 1 < 0) {
      // onChange(stepsCount - 1)
      return
    }
    onChange(currentIdx - 1)
  }

  return (
    <>
      <XStack
        jc="space-between"
        ai="center"
        px="$6"
        pb="$4"
        gap="$4"
        pos="absolute"
        b={0}
        l={0}
        r={0}
        $sm={{ dsp: 'none' }}
      >
        <Button
          size="$5"
          br="$4"
          bg="$color5"
          borderWidth={3}
          borderColor="$color8"
          pressStyle={{
            bg: '$color6',
            y: 2,
          }}
          onPress={() => handleGoPrev()}
          icon={ChevronLeft}
          disabled={currentIdx === 0}
          opacity={currentIdx === 0 ? 0.3 : 1}
        />

        <Button
          size="$5"
          br="$4"
          bg="$color8"
          borderWidth={3}
          borderColor="$color10"
          col="$color1"
          fontWeight="700"
          pressStyle={{
            bg: '$color9',
            y: 2,
          }}
          onPress={() => handleGoNext()}
          icon={ChevronRight}
          disabled={currentIdx === stepsCount - 1}
          opacity={currentIdx === stepsCount - 1 ? 0.3 : 1}
        />
      </XStack>
    </>
  )
}
