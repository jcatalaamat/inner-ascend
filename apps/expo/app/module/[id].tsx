import { ScrollView, Text, Card, YStack, Button, XStack, Spinner } from '@my/ui'
import { useLocalSearchParams, router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useModuleQuery } from 'app/utils/react-query/useModulesQuery'
import { useModuleContentQuery, useModuleDayContentQuery } from 'app/utils/react-query/useModuleContentQuery'
import { useModuleProgressQuery, useCompleteModuleDayMutation, useCurrentModuleDayQuery } from 'app/utils/react-query/useUserProgressQuery'
import { useRecordPracticeMutation } from 'app/utils/react-query/useStreakQuery'
import { useState, useMemo, useEffect } from 'react'

export default function ModuleScreen() {
  const { id, day } = useLocalSearchParams<{ id: string, day?: string }>()
  const insets = useSafeAreaInsets()

  const moduleId = id && !Array.isArray(id) ? parseInt(id) : 0

  const { data: module, isLoading: moduleLoading } = useModuleQuery(moduleId)
  const { data: moduleContent } = useModuleContentQuery(moduleId)
  const { data: moduleProgress } = useModuleProgressQuery(moduleId)

  // Calculate current day (first incomplete day)
  const currentDay = useMemo(() => {
    if (!module || !moduleProgress) return 1

    for (let i = 1; i <= module.duration_days; i++) {
      const isDayComplete = moduleProgress.some(p => p.day_number === i)
      if (!isDayComplete) return i
    }

    // All days complete, show last day
    return module.duration_days
  }, [moduleProgress, module])

  // Initialize selected day from URL param or current day
  const [selectedDay, setSelectedDay] = useState(() => {
    if (day && !Array.isArray(day)) {
      const dayNum = parseInt(day)
      return !isNaN(dayNum) ? dayNum : currentDay
    }
    return currentDay
  })

  // Update selected day when current day changes (after completion)
  useEffect(() => {
    // Only auto-update if we're not viewing a completed day
    const isDayCompleted = moduleProgress?.some(p => p.day_number === selectedDay)
    if (!isDayCompleted && selectedDay !== currentDay) {
      setSelectedDay(currentDay)
    }
  }, [currentDay])

  const { data: dayContent, isLoading: dayLoading } = useModuleDayContentQuery(moduleId, selectedDay)

  const completeDay = useCompleteModuleDayMutation()
  const recordPractice = useRecordPracticeMutation()

  const isDayCompleted = moduleProgress?.some(p => p.day_number === selectedDay) || false
  const daysCompleted = moduleProgress?.length || 0
  const progressPercent = module ? Math.round((daysCompleted / module.duration_days) * 100) : 0
  const allDaysComplete = module && daysCompleted >= module.duration_days

  const handleMarkComplete = async () => {
    try {
      await completeDay.mutateAsync({ moduleId, dayNumber: selectedDay })
      await recordPractice.mutateAsync()

      // Move to next day if not last day
      if (module && selectedDay < module.duration_days) {
        setSelectedDay(selectedDay + 1)
      }
    } catch (error) {
      console.error('Error marking day complete:', error)
    }
  }

  // Handle missing or invalid id (after hooks)
  if (!id || Array.isArray(id) || isNaN(moduleId) || moduleId === 0) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center" padding="$4">
        <Text color="$silverMoon" textAlign="center">
          Invalid module
        </Text>
      </YStack>
    )
  }

  if (moduleLoading || dayLoading) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$cosmicViolet" />
      </YStack>
    )
  }

  if (!module) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center" padding="$4">
        <Text color="$silverMoon" textAlign="center">
          Module not found
        </Text>
      </YStack>
    )
  }

  // Module exists but no content (Modules 2-16) - Enhanced placeholder
  if (!moduleContent || !dayContent) {
    // Try to load outline data for this module
    const moduleOutlines = require('app/content/modules-4-16-outlines.json')
    const moduleOutline = moduleOutlines.modules.find((m: any) => m.id === moduleId)

    return (
      <ScrollView padding="$4" backgroundColor="$deepSpace1" contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Text fontSize="$7" fontWeight="bold" color="$silverMoon" marginBottom="$2">
          Module {module.sequence_order}: {module.title}
        </Text>
        <Text fontSize="$4" color="$silverMoon2" marginBottom="$4">
          {module.duration_days} days · Full content coming early 2026
        </Text>

        {/* What You'll Explore Section */}
        {moduleOutline && (
          <>
            <Card padding="$5" backgroundColor="$deepSpace2" marginBottom="$4">
              <Text fontSize="$6" fontWeight="600" color="$cosmicViolet" marginBottom="$3">
                🔍 What You'll Explore
              </Text>
              <Text color="$silverMoon2" fontSize="$3" lineHeight="$3" marginBottom="$3">
                {moduleOutline.overview}
              </Text>
              {moduleOutline.keyConceptsweek && moduleOutline.keyConceptsweek.length > 0 && (
                <YStack gap="$1">
                  {moduleOutline.keyConceptsweek.map((concept: string, idx: number) => (
                    <Text key={idx} color="$silverMoon2" fontSize="$3" lineHeight="$2">
                      • {concept}
                    </Text>
                  ))}
                </YStack>
              )}
            </Card>

            {/* The Journey Ahead - Day Titles */}
            <Card padding="$5" backgroundColor="$deepSpace2" marginBottom="$4">
              <Text fontSize="$6" fontWeight="600" color="$cosmicViolet" marginBottom="$3">
                📅 The Journey Ahead
              </Text>
              <YStack gap="$2">
                {moduleOutline.dayTitles.map((dayTitle: string, idx: number) => (
                  <Text key={idx} color="$silverMoon2" fontSize="$3" lineHeight="$2">
                    {dayTitle}
                  </Text>
                ))}
              </YStack>
            </Card>

            {/* Reflection Section */}
            <Card padding="$5" backgroundColor="$deepSpace2" marginBottom="$4">
              <Text fontSize="$6" fontWeight="600" color="$cosmicViolet" marginBottom="$3">
                💭 Prepare Your Mind
              </Text>
              <Text color="$silverMoon2" fontSize="$3" lineHeight="$3" marginBottom="$3">
                This module builds on your previous work. While you wait, consider these questions:
              </Text>
              <Button
                theme="active"
                size="$4"
                onPress={() => router.push('/journaling')}
              >
                <Text>Start Journaling →</Text>
              </Button>
            </Card>
          </>
        )}

        {/* Generic fallback if no outline exists */}
        {!moduleOutline && (
          <Card padding="$6" backgroundColor="$deepSpace2" alignItems="center">
            <Text fontSize="$6" marginBottom="$3">
              🔒
            </Text>
            <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2" textAlign="center">
              Content Coming Soon
            </Text>
            <Text color="$silverMoon2" textAlign="center" fontSize="$3" lineHeight="$2">
              This module is part of the Being Human 101 journey. Full content will be available soon.
            </Text>
          </Card>
        )}

        {/* Back to Journey Button */}
        <Button
          size="$4"
          theme="alt2"
          onPress={() => router.push('/journey')}
          marginTop="$2"
        >
          <Text>← Return to Journey</Text>
        </Button>
      </ScrollView>
    )
  }

  // Full content available (Module 1)
  const { day: dayData } = dayContent

  return (
    <ScrollView padding="$4" backgroundColor="$deepSpace1" contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Text fontSize="$7" fontWeight="bold" color="$silverMoon" marginBottom="$2">
        Module {module.sequence_order}: {module.title}
      </Text>
      <Text fontSize="$4" color="$silverMoon2" marginBottom="$4">
        Day {selectedDay} of {module.duration_days} · {progressPercent}% complete
      </Text>

      {/* Day Navigator */}
      {module.duration_days > 1 && (
        <XStack gap="$2" marginBottom="$4" flexWrap="wrap">
          {Array.from({ length: module.duration_days }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = moduleProgress?.some(p => p.day_number === dayNum)
            const isSelected = dayNum === selectedDay
            const isCurrentDay = dayNum === currentDay && !isCompleted

            // Check if previous day is completed AND if 24 hours have passed
            const previousDayProgress = dayNum === 1 ? null : moduleProgress?.find(p => p.day_number === dayNum - 1)
            const isPreviousDayCompleted = dayNum === 1 || !!previousDayProgress

            // Check if 24 hours have passed since previous day completion
            let is24HoursPassed = true
            if (previousDayProgress?.completed_at) {
              const completedTime = new Date(previousDayProgress.completed_at).getTime()
              const now = new Date().getTime()
              const hoursPassed = (now - completedTime) / (1000 * 60 * 60)
              is24HoursPassed = hoursPassed >= 24
            }

            const isLocked = !isPreviousDayCompleted || (!isCompleted && !is24HoursPassed)

            // Calculate hours remaining for locked days
            let hoursRemaining = 0
            if (isLocked && previousDayProgress?.completed_at && !isCompleted) {
              const completedTime = new Date(previousDayProgress.completed_at).getTime()
              const now = new Date().getTime()
              const hoursPassed = (now - completedTime) / (1000 * 60 * 60)
              hoursRemaining = Math.ceil(24 - hoursPassed)
            }

            return (
              <Button
                key={dayNum}
                size="$3"
                theme={isSelected ? 'active' : isCompleted ? 'alt1' : 'alt2'}
                onPress={() => !isLocked && setSelectedDay(dayNum)}
                disabled={isLocked}
                opacity={isLocked ? 0.3 : 1}
                borderColor={isCurrentDay && !isSelected ? '$cosmicViolet' : undefined}
                borderWidth={isCurrentDay && !isSelected ? 2 : 0}
              >
                <Text>
                  {isCompleted ? '✓ ' : isLocked ? '🔒 ' : isCurrentDay ? '▶️ ' : ''}
                  Day {dayNum}
                  {isLocked && hoursRemaining > 0 && !isCompleted && dayNum > 1 ? ` (${hoursRemaining}h)` : ''}
                </Text>
              </Button>
            )
          })}
        </XStack>
      )}

      {/* Day Title */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2" borderColor={isDayCompleted ? '$integrationGreen' : '$cosmicViolet'} borderWidth={1}>
        <Text fontSize="$6" fontWeight="600" color="$cosmicViolet" marginBottom="$1">
          {dayData.title}
        </Text>
        {isDayCompleted && (
          <Text fontSize="$3" color="$integrationGreen">
            ✓ Completed
          </Text>
        )}
      </Card>

      {/* Today's Teaching Section */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
          📖 Today's Teaching
        </Text>
        <Text color="$cosmicViolet" fontSize="$5" fontWeight="600" marginBottom="$2">
          {dayData.teaching.heading}
        </Text>
        <Text color="$silverMoon2" fontSize="$3" lineHeight="$3" marginBottom="$3">
          {dayData.teaching.content}
        </Text>
        {dayData.teaching.keyPoints && dayData.teaching.keyPoints.length > 0 && (
          <>
            <Text color="$silverMoon" fontSize="$4" fontWeight="600" marginBottom="$2">
              Key Points:
            </Text>
            <YStack gap="$1">
              {dayData.teaching.keyPoints.map((point, idx) => (
                <Text key={idx} color="$silverMoon2" fontSize="$3" lineHeight="$2">
                  • {point}
                </Text>
              ))}
            </YStack>
          </>
        )}
      </Card>

      {/* Practices Section */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
          🧘 Today's Practice
        </Text>
        <Text color="$silverMoon" fontSize="$4" fontWeight="600" marginBottom="$1">
          {dayData.practice.title}
        </Text>
        <Text fontSize="$3" color="$silverMoon3" marginBottom="$2">
          {dayData.practice.type} · {dayData.practice.duration} min
        </Text>
        <Text color="$silverMoon2" fontSize="$3" lineHeight="$2">
          {dayData.practice.description}
        </Text>
      </Card>

      {/* Journaling Section */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
          📝 Journaling Prompts
        </Text>
        <Text fontStyle="italic" color="$cosmicViolet" marginBottom="$3" fontSize="$4" lineHeight="$2">
          "{dayData.journaling.prompt}"
        </Text>
        <Text color="$silverMoon" fontSize="$4" fontWeight="600" marginBottom="$2">
          Reflect on:
        </Text>
        <YStack gap="$2" marginBottom="$3">
          {dayData.journaling.questions.map((question, idx) => (
            <Text key={idx} color="$silverMoon2" fontSize="$3" lineHeight="$2">
              • {question}
            </Text>
          ))}
        </YStack>
        <Button
          theme="active"
          size="$4"
          onPress={() => router.push('/journaling')}
          marginTop="$2"
        >
          <Text>Start Journaling →</Text>
        </Button>
      </Card>

      {/* Mark Complete Button / Module Completion */}
      {allDaysComplete ? (
        <Card
          padding="$6"
          backgroundColor="$deepSpace2"
          borderColor="$integrationGreen"
          borderWidth={2}
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize="$8" marginBottom="$2">🌟</Text>
          <Text fontSize="$6" fontWeight="600" color="$integrationGreen" marginBottom="$2">
            Module {module.sequence_order} Complete!
          </Text>
          <Text color="$silverMoon2" textAlign="center" fontSize="$4" marginBottom="$3">
            You've completed all {module.duration_days} days. Take a moment to integrate what you've learned.
          </Text>

          {/* Show next module button if available */}
          {module.sequence_order < 16 && (
            <Button
              theme="active"
              size="$4"
              onPress={() => router.push(`/module/${module.id + 1}`)}
            >
              <Text>Continue to Module {module.sequence_order + 1} →</Text>
            </Button>
          )}
        </Card>
      ) : !isDayCompleted ? (
        <Button
          size="$5"
          backgroundColor="$cosmicViolet"
          color="$silverMoon"
          marginBottom="$4"
          onPress={handleMarkComplete}
          disabled={completeDay.isPending}
        >
          {completeDay.isPending ? 'Marking Complete...' : '✓ Mark Day Complete'}
        </Button>
      ) : (
        <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2" borderColor="$integrationGreen" borderWidth={1} alignItems="center">
          <Text color="$integrationGreen" fontSize="$5" fontWeight="600">
            ✓ Day {selectedDay} Complete!
          </Text>
          {selectedDay < module.duration_days && (() => {
            // Check if next day is locked (same logic as day navigator)
            const nextDayNum = selectedDay + 1
            const isNextDayCompleted = moduleProgress?.some(p => p.day_number === nextDayNum)
            const currentDayProgress = moduleProgress?.find(p => p.day_number === selectedDay)

            // Check if 24 hours have passed since current day completion
            let is24HoursPassed = true
            if (currentDayProgress?.completed_at) {
              const completedTime = new Date(currentDayProgress.completed_at).getTime()
              const now = new Date().getTime()
              const hoursPassed = (now - completedTime) / (1000 * 60 * 60)
              is24HoursPassed = hoursPassed >= 24
            }

            const isNextDayLocked = !isNextDayCompleted && !is24HoursPassed

            // Calculate hours remaining
            let hoursRemaining = 0
            if (isNextDayLocked && currentDayProgress?.completed_at) {
              const completedTime = new Date(currentDayProgress.completed_at).getTime()
              const now = new Date().getTime()
              const hoursPassed = (now - completedTime) / (1000 * 60 * 60)
              hoursRemaining = Math.ceil(24 - hoursPassed)
            }

            return (
              <Button
                size="$4"
                theme="active"
                marginTop="$3"
                onPress={() => !isNextDayLocked && setSelectedDay(nextDayNum)}
                disabled={isNextDayLocked}
                opacity={isNextDayLocked ? 0.3 : 1}
              >
                <Text>
                  {isNextDayLocked
                    ? `🔒 Day ${nextDayNum} (${hoursRemaining}h)`
                    : `Continue to Day ${nextDayNum} →`
                  }
                </Text>
              </Button>
            )
          })()}
        </Card>
      )}
    </ScrollView>
  )
}
