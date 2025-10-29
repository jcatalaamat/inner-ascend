import { ScrollView, Text, Card, XStack, Button, YStack, Spinner, Separator } from '@my/ui'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useModuleDayContentQuery } from 'app/utils/react-query/useModuleContentQuery'
import { useProgressSummaryQuery } from 'app/utils/react-query/useUserProgressQuery'
import { useStreakStatsQuery } from 'app/utils/react-query/useStreakQuery'
import { useEmotionalCheckInMutation, useTodayCheckInQuery } from 'app/utils/react-query/useEmotionalCheckInMutation'
import { useCosmicWeatherQuery } from 'app/utils/react-query/useCosmicWeatherQuery'
import { Pressable } from 'react-native'

type EmotionalState = 'struggling' | 'processing' | 'clear' | 'integrated'

const emotionalStates: Array<{
  value: EmotionalState
  emoji: string
  label: string
  description: string
  color: string
  bgColor: string
}> = [
  {
    value: 'struggling',
    emoji: '🌊',
    label: 'Struggling',
    description: "I'm having a hard time. That's okay.",
    color: '#FF8A65',
    bgColor: '#2D1410',
  },
  {
    value: 'processing',
    emoji: '🌀',
    label: 'Processing',
    description: "I'm working through something. I'm in it.",
    color: '#FFD93D',
    bgColor: '#2D2510',
  },
  {
    value: 'clear',
    emoji: '✨',
    label: 'Clear',
    description: 'I feel aligned and present.',
    color: '#81C3F0',
    bgColor: '#10232D',
  },
  {
    value: 'integrated',
    emoji: '🌟',
    label: 'Integrated',
    description: 'I feel whole and at peace.',
    color: '#4ECDC4',
    bgColor: '#102D2A',
  },
]

export default function TodayScreen() {
  const insets = useSafeAreaInsets()
  const { data: progressSummary } = useProgressSummaryQuery()
  const { data: streakStats } = useStreakStatsQuery()
  const { data: todayCheckIn } = useTodayCheckInQuery()
  const { data: cosmicWeather } = useCosmicWeatherQuery()
  const checkInMutation = useEmotionalCheckInMutation()

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [previousCheckIn, setPreviousCheckIn] = useState<EmotionalState | null>(null)

  // Get content for current module/day
  const currentModule = progressSummary?.currentModule || 1
  const currentDay = progressSummary?.currentDay || 1
  const { data: dayContent, isLoading } = useModuleDayContentQuery(currentModule, currentDay)

  // Show success message briefly when check-in changes
  useEffect(() => {
    if (todayCheckIn?.emotion_state && todayCheckIn.emotion_state !== previousCheckIn) {
      setPreviousCheckIn(todayCheckIn.emotion_state)
      setShowSuccessMessage(true)
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [todayCheckIn?.emotion_state])

  const handleCheckIn = (state: EmotionalState) => {
    checkInMutation.mutate(state)
  }

  // Format today's date
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  // Get greeting based on time of day
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$cosmicViolet" />
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$deepSpace1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 16,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {/* Header */}
        <Text fontSize="$9" fontWeight="bold" color="$silverMoon" marginBottom="$1">
          TODAY
        </Text>
        <Text fontSize="$4" color="$silverMoon3" marginBottom="$1">
          {greeting}
        </Text>
        <Text fontSize="$3" color="$silverMoon2" marginBottom="$5">
          🌙 {dateStr}
        </Text>

        {/* Streak Counter - Moved to top for prominence */}
        {streakStats && streakStats.currentStreak > 0 ? (
          <Card
            padding="$4"
            marginBottom="$4"
            backgroundColor="$deepSpace2"
            borderColor="$innerChildGold"
            borderWidth={streakStats.currentStreak >= 7 ? 2 : 0}
          >
            <XStack alignItems="center" justifyContent="space-between">
              <YStack flex={1}>
                <Text fontSize="$8" fontWeight="bold" color="$innerChildGold">
                  {streakStats.currentStreak} Day{streakStats.currentStreak !== 1 ? 's' : ''}
                </Text>
                <Text fontSize="$3" color="$silverMoon2">
                  {streakStats.currentStreak >= 30 ? 'You are unstoppable!' :
                   streakStats.currentStreak >= 14 ? 'Keep going! You\'re on fire!' :
                   streakStats.currentStreak >= 7 ? 'One week strong!' :
                   'Building momentum'}
                </Text>
              </YStack>
              <Text fontSize="$10">🔥</Text>
            </XStack>
          </Card>
        ) : (
          <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2" borderColor="$deepSpace3" borderWidth={1}>
            <Text fontSize="$5" color="$silverMoon2" textAlign="center" marginBottom="$1">
              Start your practice today
            </Text>
            <Text fontSize="$3" color="$silverMoon3" textAlign="center">
              Begin your streak and watch your transformation unfold
            </Text>
          </Card>
        )}

        {/* Emotional Check-In Card */}
        <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
          <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
            How are you feeling today?
          </Text>
          <Text fontSize="$3" color="$silverMoon3" marginBottom="$4">
            Honoring where you are
          </Text>

          {/* Success Message */}
          {showSuccessMessage && todayCheckIn && (
            <Card
              padding="$3"
              marginBottom="$3"
              backgroundColor="$deepSpace3"
              borderColor="$integrationGreen"
              borderWidth={1}
            >
              <Text color="$integrationGreen" fontSize="$3" textAlign="center">
                Thank you for honoring your journey
              </Text>
            </Card>
          )}

          {/* Emotional State Grid - 2x2 */}
          <XStack gap="$2.5" justifyContent="center">
            <YStack gap="$2.5" flex={1}>
              {emotionalStates.slice(0, 2).map((state) => {
                const isSelected = todayCheckIn?.emotion_state === state.value
                const isDisabled = checkInMutation.isPending

                return (
                  <Pressable
                    key={state.value}
                    onPress={() => !isDisabled && handleCheckIn(state.value)}
                    disabled={isDisabled}
                  >
                    <Card
                      padding="$3.5"
                      backgroundColor={isSelected ? state.bgColor : '$deepSpace3'}
                      borderColor={isSelected ? state.color : '$deepSpace3'}
                      borderWidth={2}
                      pressStyle={{ opacity: 0.7, scale: 0.98 }}
                      opacity={isDisabled ? 0.6 : 1}
                      minHeight={100}
                      justifyContent="center"
                    >
                      <YStack alignItems="center" gap="$2">
                        <Text fontSize="$8">{state.emoji}</Text>
                        <YStack alignItems="center" gap="$0.5">
                          <XStack alignItems="center" gap="$1.5">
                            <Text
                              fontSize="$4"
                              fontWeight="600"
                              color={isSelected ? state.color : '$silverMoon'}
                              textAlign="center"
                            >
                              {state.label}
                            </Text>
                            {isSelected && (
                              <Text fontSize="$3" color="$integrationGreen">✓</Text>
                            )}
                          </XStack>
                          <Text
                            fontSize="$1"
                            color={isSelected ? '$silverMoon2' : '$silverMoon3'}
                            textAlign="center"
                            numberOfLines={2}
                            lineHeight="$1"
                          >
                            {state.description}
                          </Text>
                        </YStack>
                      </YStack>
                    </Card>
                  </Pressable>
                )
              })}
            </YStack>

            <YStack gap="$2.5" flex={1}>
              {emotionalStates.slice(2, 4).map((state) => {
                const isSelected = todayCheckIn?.emotion_state === state.value
                const isDisabled = checkInMutation.isPending

                return (
                  <Pressable
                    key={state.value}
                    onPress={() => !isDisabled && handleCheckIn(state.value)}
                    disabled={isDisabled}
                  >
                    <Card
                      padding="$3.5"
                      backgroundColor={isSelected ? state.bgColor : '$deepSpace3'}
                      borderColor={isSelected ? state.color : '$deepSpace3'}
                      borderWidth={2}
                      pressStyle={{ opacity: 0.7, scale: 0.98 }}
                      opacity={isDisabled ? 0.6 : 1}
                      minHeight={100}
                      justifyContent="center"
                    >
                      <YStack alignItems="center" gap="$2">
                        <Text fontSize="$8">{state.emoji}</Text>
                        <YStack alignItems="center" gap="$0.5">
                          <XStack alignItems="center" gap="$1.5">
                            <Text
                              fontSize="$4"
                              fontWeight="600"
                              color={isSelected ? state.color : '$silverMoon'}
                              textAlign="center"
                            >
                              {state.label}
                            </Text>
                            {isSelected && (
                              <Text fontSize="$3" color="$integrationGreen">✓</Text>
                            )}
                          </XStack>
                          <Text
                            fontSize="$1"
                            color={isSelected ? '$silverMoon2' : '$silverMoon3'}
                            textAlign="center"
                            numberOfLines={2}
                            lineHeight="$1"
                          >
                            {state.description}
                          </Text>
                        </YStack>
                      </YStack>
                    </Card>
                  </Pressable>
                )
              })}
            </YStack>
          </XStack>
        </Card>

        {/* Cosmic Weather Card */}
        <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2" borderColor="$cosmicViolet" borderWidth={1}>
          <XStack alignItems="center" gap="$2" marginBottom="$3">
            <Text fontSize="$6">🌌</Text>
            <Text fontSize="$6" fontWeight="600" color="$cosmicViolet">
              Cosmic Weather
            </Text>
            {cosmicWeather?.cached && (
              <Text fontSize="$2" color="$silverMoon3">
                ✓
              </Text>
            )}
          </XStack>
          <Text color="$silverMoon2" fontSize="$4" lineHeight="$3" fontStyle="italic">
            {cosmicWeather?.message ||
              'The journey inward requires stillness. Today, let yourself simply be—without the need to fix, change, or understand everything. Trust that your healing unfolds in perfect timing.'}
          </Text>
          {cosmicWeather?.moonPhase && (
            <Text color="$silverMoon3" fontSize="$2" marginTop="$2">
              🌙 {cosmicWeather.moonPhase}
            </Text>
          )}
        </Card>

        {/* Today's Practice Card */}
        {dayContent ? (
          <Card
            padding="$4"
            marginBottom="$4"
            backgroundColor="$deepSpace2"
            borderColor="$cosmicViolet"
            borderWidth={1}
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
            onPress={() => router.push(`/module/${currentModule}?day=${currentDay}`)}
          >
            <XStack alignItems="center" gap="$2" marginBottom="$3">
              <Text fontSize="$6">🧘</Text>
              <Text fontSize="$6" fontWeight="600" color="$cosmicViolet">
                Today's Practice
              </Text>
            </XStack>

            {/* Module Info */}
            <XStack alignItems="center" gap="$2" marginBottom="$2">
              <Text color="$silverMoon2" fontSize="$3">
                {dayContent.module.title}
              </Text>
              <Text color="$silverMoon3" fontSize="$3">•</Text>
              <Text color="$silverMoon2" fontSize="$3">
                Day {currentDay} of {dayContent.module.duration_days}
              </Text>
            </XStack>

            {/* Progress Bar */}
            <YStack marginBottom="$3">
              <YStack
                height={6}
                backgroundColor="$deepSpace3"
                borderRadius={3}
                overflow="hidden"
              >
                <YStack
                  height="100%"
                  width={`${(currentDay / dayContent.module.duration_days) * 100}%`}
                  backgroundColor="$cosmicViolet"
                />
              </YStack>
            </YStack>

            {/* Day Title */}
            <Text color="$silverMoon" fontWeight="600" marginBottom="$2" fontSize="$5">
              {dayContent.day.title}
            </Text>

            {/* Teaching Preview */}
            <Text color="$silverMoon2" fontSize="$3" numberOfLines={2} lineHeight="$2" marginBottom="$3">
              {dayContent.day.teaching.heading}
            </Text>

            {/* Practice Details */}
            <XStack gap="$3">
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3">📝</Text>
                <Text color="$silverMoon3" fontSize="$3">
                  {dayContent.day.practice.type}
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3">⏱️</Text>
                <Text color="$silverMoon3" fontSize="$3">
                  {dayContent.day.practice.duration} min
                </Text>
              </XStack>
            </XStack>

            {/* Call to Action */}
            <Text color="$cosmicViolet" fontSize="$3" marginTop="$3" fontWeight="600">
              Tap to begin →
            </Text>
          </Card>
        ) : (
          /* No active module - Empty state */
          <Card
            padding="$5"
            marginBottom="$4"
            backgroundColor="$deepSpace2"
            borderColor="$cosmicViolet"
            borderWidth={1}
            alignItems="center"
          >
            <Text fontSize="$8" marginBottom="$3">🌟</Text>
            <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2" textAlign="center">
              Begin Your Journey
            </Text>
            <Text color="$silverMoon2" marginBottom="$4" fontSize="$4" lineHeight="$3" textAlign="center">
              Your transformative journey of self-discovery awaits. Start with Module 1: Being Human 101 to lay the foundations for your healing.
            </Text>
            <Button
              size="$5"
              backgroundColor="$cosmicViolet"
              color="$silverMoon"
              onPress={() => router.push('/module/1')}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text fontWeight="600">Start Module 1 →</Text>
            </Button>
          </Card>
        )}
      </ScrollView>
    </YStack>
  )
}
