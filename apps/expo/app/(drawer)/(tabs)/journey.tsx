import { ScrollView, Text, Card, YStack, Spinner } from '@my/ui'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useModulesQuery } from 'app/utils/react-query/useModulesQuery'
import { useUserProgressQuery } from 'app/utils/react-query/useUserProgressQuery'
import { useUser } from 'app/utils/useUser'
import { FloatingMenuButton } from 'app/components/FloatingMenuButton'

export default function JourneyScreen() {
  const insets = useSafeAreaInsets()
  const user = useUser()
  const { data: modules, isLoading, error } = useModulesQuery()
  const { data: userProgress } = useUserProgressQuery()

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$cosmicViolet" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center" padding="$4">
        <Text color="$silverMoon" textAlign="center">
          Error loading modules: {error.message}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$deepSpace1">
      <FloatingMenuButton />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Text fontSize="$8" fontWeight="bold" color="$silverMoon" marginBottom="$2">
          JOURNEY
        </Text>
        <Text fontSize="$5" color="$silverMoon2" marginBottom="$4">
          Being Human 101 · {String(modules?.length || 16)} Modules
        </Text>

        {modules?.map((module) => {
          // Calculate progress for this module
          const moduleProgressEntries = userProgress?.filter(p => p.module_id === module.id) || []
          const daysCompleted = moduleProgressEntries.length
          const isCompleted = daysCompleted >= module.duration_days

          // Determine if this module is the current active one
          // Module 1 is always unlocked. Others unlock after completing previous module.
          const previousModule = modules.find(m => m.sequence_order === module.sequence_order - 1)
          const previousModuleProgress = userProgress?.filter(p => p.module_id === previousModule?.id) || []
          const isPreviousCompleted = previousModule ? previousModuleProgress.length >= previousModule.duration_days : true

          const isUnlocked = module.id === 1 || isPreviousCompleted
          const isActive = isUnlocked && !isCompleted && daysCompleted > 0
          const isLocked = !isUnlocked

          // Calculate current day (first incomplete day)
          let currentDay = 1
          let nextDayUnlockTime: Date | null = null

          if (moduleProgressEntries.length > 0) {
            for (let i = 1; i <= module.duration_days; i++) {
              const isDayComplete = moduleProgressEntries.some(p => p.day_number === i)
              if (!isDayComplete) {
                currentDay = i

                // Check if current day is time-locked
                if (i > 1) {
                  const previousDayProgress = moduleProgressEntries.find(p => p.day_number === i - 1)
                  if (previousDayProgress?.completed_at) {
                    const completedTime = new Date(previousDayProgress.completed_at)
                    const unlockTime = new Date(completedTime.getTime() + (24 * 60 * 60 * 1000))
                    if (new Date() < unlockTime) {
                      nextDayUnlockTime = unlockTime
                    }
                  }
                }
                break
              }
            }
            // If all days complete
            if (currentDay === 1 && isCompleted) {
              currentDay = module.duration_days
            }
          }

          let icon = '🔒'
          let borderColor = undefined
          let borderWidth = 0
          let textColor = '$silverMoon3'
          let opacity = 0.5
          let statusText = 'Locked'

          if (isCompleted) {
            icon = '✅'
            borderColor = '$integrationGreen'
            borderWidth = 1
            textColor = '$silverMoon'
            opacity = 1
            statusText = 'Complete'
          } else if (isActive) {
            icon = '🔥'
            borderColor = '$cosmicViolet'
            borderWidth = 2
            textColor = '$cosmicViolet'
            opacity = 1
            const percentComplete = Math.round((daysCompleted / module.duration_days) * 100)

            // Show time-locked status if next day is locked
            if (nextDayUnlockTime) {
              const hoursRemaining = Math.ceil((nextDayUnlockTime.getTime() - new Date().getTime()) / (1000 * 60 * 60))
              statusText = `Day ${currentDay} unlocks in ${hoursRemaining}h (${percentComplete}% complete)`
            } else {
              statusText = `Day ${currentDay} of ${module.duration_days} (${percentComplete}% complete)`
            }
          } else if (isUnlocked) {
            // Unlocked but not started
            icon = '⭐'
            borderColor = '$silverMoon2'
            borderWidth = 1
            textColor = '$silverMoon'
            opacity = 1
            statusText = 'Ready to start'
          } else {
            statusText = `Complete Module ${previousModule?.sequence_order} to unlock`
          }

          return (
            <Card
              key={module.id}
              padding="$4"
              marginBottom="$3"
              backgroundColor="$deepSpace2"
              borderColor={borderColor}
              borderWidth={borderWidth}
              opacity={opacity}
              pressStyle={{ opacity: isLocked ? 0.5 : 0.8 }}
              onPress={() => isUnlocked && router.push(`/module/${module.id}`)}
            >
              <Text fontSize="$6" fontWeight="600" color={textColor} marginBottom="$1">
                {icon} Module {String(module.sequence_order)}: {module.title}
              </Text>
              <Text fontSize="$3" color="$silverMoon2">
                {String(module.duration_days)} days · {statusText || 'Loading...'}
              </Text>
            </Card>
          )
        })}
      </ScrollView>
    </YStack>
  )
}
