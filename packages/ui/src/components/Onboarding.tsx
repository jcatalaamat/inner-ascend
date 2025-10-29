import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import React, { useEffect, useState, useCallback } from 'react'
import { PanResponder } from 'react-native'
import {
  AnimatePresence,
  Circle,
  Theme,
  ThemeName,
  XStack,
  YStack,
  useWindowDimensions,
} from 'tamagui'

import { OnboardingControls } from './OnboardingControls'

export type OnboardingStepInfo = {
  theme: ThemeName
  Content: React.FC
}

export type OnboardingProps = {
  /**
   * native only
   */
  onOnboarded?: () => void
  /**
   * web only
   */
  autoSwipe?: boolean
  steps: OnboardingStepInfo[]
}

const AUTO_SWIPE_THRESHOLD = 15_000 // ms
export const Onboarding = ({ onOnboarded, autoSwipe, steps }: OnboardingProps) => {
  const [stepIdx, _setStepIdx] = useState(0)
  // prevent a background to ever "continue" animation / try to continue where it left off - cause looks weird

  const [key, setKey] = useState(0)
  const currentStep = steps[stepIdx]!
  const stepsCount = steps.length

  const setStepIdx = useCallback(
    (newIdx: number) => {
      if (stepIdx !== newIdx) {
        _setStepIdx(newIdx)
        setKey(key + 1)
      }
    },
    [key, stepIdx]
  )

  useEffect(() => {
    if (autoSwipe) {
      const interval = setTimeout(() => {
        if (stepIdx >= stepsCount - 1) {
          setStepIdx(0)
        } else {
          setStepIdx(stepIdx + 1)
        }
      }, AUTO_SWIPE_THRESHOLD)
      return () => clearTimeout(interval)
    }
  }, [stepIdx, autoSwipe, stepsCount, setStepIdx])

  const panResponder = React.useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_event, gesture) => {
        const THRESHOLD = 100
        if (gesture.dx > THRESHOLD) {
          setStepIdx(Math.max(0, stepIdx - 1))
          return true
        } else if (gesture.dx < -THRESHOLD) {
          setStepIdx(Math.min(stepsCount - 1, stepIdx + 1))
          return true
        }
        return false
      },
    })
  }, [setStepIdx, stepIdx, stepsCount])

  const safeAreaInsets = useSafeAreaInsets()

  return (
    <Theme name={currentStep.theme as ThemeName}>
      <YStack
        f={1}
        bg="$color2"
        ov="hidden"
        pb={safeAreaInsets.bottom}
        pr={safeAreaInsets.right}
        pt={safeAreaInsets.top}
        pl={safeAreaInsets.left}
      >
        {/* Simplified clean background - no animations for Gumroad style */}
        <YStack fullscreen bg="$color2" />

        <YStack f={1} {...panResponder.panHandlers}>
          <AnimatePresence>
            <currentStep.Content key={key} />
          </AnimatePresence>
        </YStack>

        {/* Progress dots with Gumroad-style bold borders */}
        <XStack gap={12} jc="center" my="$5">
          {Array.from(Array(stepsCount)).map((_, idx) => {
            const isActive = idx === stepIdx
            return <Point key={idx} active={isActive} onPress={() => setStepIdx(idx)} />
          })}
        </XStack>
        <OnboardingControls
          currentIdx={stepIdx}
          onChange={(val) => setStepIdx(val)}
          stepsCount={stepsCount}
          onFinish={onOnboarded}
        />
      </YStack>
    </Theme>
  )
}

const Point = ({ active, onPress }: { active: boolean; onPress: () => void }) => {
  return (
    <YStack
      br="$2"
      w={active ? 40 : 12}
      h={12}
      onPress={onPress}
      bg={active ? '$color10' : '$color6'}
      borderWidth={active ? 3 : 0}
      borderColor="$color11"
      animation="quick"
      pressStyle={{
        scale: 0.9,
      }}
    />
  )
}

export const Background = () => {
  const { height } = useWindowDimensions()
  return (
    <YStack fullscreen jc="center" ai="center">
      <Circle
        animation="lazy"
        x={0}
        y={0}
        o={1}
        scale={1}
        bg="$color3"
        enterStyle={{
          scale: 0,
        }}
        exitStyle={{
          scale: 10,
          o: 0,
        }}
        w={height * 3}
        h={height * 3}
      />
    </YStack>
  )
}
