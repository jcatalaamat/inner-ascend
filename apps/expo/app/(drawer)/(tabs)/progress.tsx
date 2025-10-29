import { ScrollView, Text, Card, YStack, XStack, Spinner, Button } from '@my/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useProgressSummaryQuery } from 'app/utils/react-query/useUserProgressQuery'
import { useStreakStatsQuery } from 'app/utils/react-query/useStreakQuery'
import { useRecentJournalEntriesQuery, useJournalStatsQuery } from 'app/utils/react-query/useJournalEntriesQuery'
import { useEmotionalCheckInsQuery } from 'app/utils/react-query/useEmotionalCheckInMutation'

export default function ProgressScreen() {
  const insets = useSafeAreaInsets()
  const { data: progressSummary, isLoading: progressLoading } = useProgressSummaryQuery()
  const { data: streakStats, isLoading: streakLoading } = useStreakStatsQuery()
  const { data: recentEntries } = useRecentJournalEntriesQuery(3)
  const { data: journalStats } = useJournalStatsQuery()
  const { data: emotionalCheckIns } = useEmotionalCheckInsQuery()

  const isLoading = progressLoading || streakLoading

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$cosmicViolet" />
      </YStack>
    )
  }

  const totalDays = progressSummary?.totalDaysCompleted || 0
  const modulesStarted = progressSummary?.modulesStarted || 0
  const currentStreak = streakStats?.currentStreak || 0
  const longestStreak = streakStats?.longestStreak || 0
  const totalPractices = streakStats?.totalPractices || 0

  // Create module dots visualization
  const moduleDots = Array.from({ length: 16 }, (_, i) => {
    const moduleNumber = i + 1
    const isStarted = modulesStarted >= moduleNumber
    return isStarted ? '●' : '○'
  }).join(' ')

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <YStack flex={1} backgroundColor="$deepSpace1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Text fontSize="$8" fontWeight="bold" color="$silverMoon" marginBottom="$4">
          PROGRESS
        </Text>

        {totalDays > 0 ? (
          <>
            {/* Days Practiced Card */}
            <Card padding="$6" marginBottom="$4" backgroundColor="$deepSpace2" alignItems="center">
              <Text fontSize="$10" color="$cosmicViolet" marginBottom="$2" fontWeight="bold">
                {totalDays}
              </Text>
              <Text fontSize="$4" color="$silverMoon2">
                Days Practiced
              </Text>
              <Text fontSize="$3" color="$silverMoon3" marginTop="$2">
                Your journey continues...
              </Text>
            </Card>

            {/* Streaks Card */}
            <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
              <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
                Streaks
              </Text>
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text color="$silverMoon2">🔥 Current Streak</Text>
                  <Text color="$innerChildGold" fontWeight="bold">
                    {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text color="$silverMoon2">⭐ Longest Streak</Text>
                  <Text color="$silverMoon">
                    {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
                  </Text>
                </XStack>
              </YStack>
            </Card>

            {/* Emotional Journey Card */}
            {emotionalCheckIns && emotionalCheckIns.length > 0 && (
              <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
                <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
                  Emotional Journey
                </Text>
                <Text fontSize="$3" color="$silverMoon3" marginBottom="$3">
                  Last 7 days
                </Text>

                {/* Visual timeline of recent check-ins */}
                <YStack gap="$2.5">
                  {emotionalCheckIns.slice(0, 7).map((checkIn) => {
                    const date = new Date(checkIn.checkin_date)
                    const dateStr = formatDate(checkIn.checkin_date)

                    const emotionData = {
                      struggling: { emoji: '🌊', label: 'Struggling', color: '#FF8A65' },
                      processing: { emoji: '🌀', label: 'Processing', color: '#FFD93D' },
                      clear: { emoji: '✨', label: 'Clear', color: '#81C3F0' },
                      integrated: { emoji: '🌟', label: 'Integrated', color: '#4ECDC4' },
                    }[checkIn.emotion_state as 'struggling' | 'processing' | 'clear' | 'integrated']

                    return (
                      <XStack key={checkIn.id} alignItems="center" gap="$3">
                        <Card
                          padding="$2"
                          paddingHorizontal="$3"
                          backgroundColor="$deepSpace3"
                          minWidth={80}
                        >
                          <Text fontSize="$2" color="$silverMoon3" textAlign="center">
                            {dateStr}
                          </Text>
                        </Card>
                        <Card
                          flex={1}
                          padding="$3"
                          backgroundColor="$deepSpace3"
                          borderColor={emotionData?.color}
                          borderWidth={1}
                        >
                          <XStack alignItems="center" gap="$2">
                            <Text fontSize="$5">{emotionData?.emoji}</Text>
                            <Text fontSize="$4" color="$silverMoon">
                              {emotionData?.label}
                            </Text>
                          </XStack>
                        </Card>
                      </XStack>
                    )
                  })}
                </YStack>

                {/* Stats Summary */}
                <Card padding="$3" backgroundColor="$deepSpace3" marginTop="$3">
                  <Text fontSize="$3" color="$silverMoon2" textAlign="center">
                    {emotionalCheckIns.length} check-in{emotionalCheckIns.length !== 1 ? 's' : ''} recorded
                  </Text>
                </Card>
              </Card>
            )}

            {/* Modules Progress Card */}
            <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
              <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
                Modules Progress
              </Text>
              <Text color="$silverMoon2" marginBottom="$2" fontSize="$4">
                {moduleDots}
              </Text>
              <Text color="$silverMoon2">
                {modulesStarted} of 16 modules started
              </Text>
            </Card>

            {/* Practice Breakdown Card */}
            <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
              <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
                Practice Summary
              </Text>
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text color="$silverMoon2">🎯 Total Practices</Text>
                  <Text color="$silverMoon" fontWeight="bold">{totalPractices}</Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text color="$silverMoon2">📅 Days Completed</Text>
                  <Text color="$silverMoon" fontWeight="bold">{totalDays}</Text>
                </XStack>
              </YStack>
            </Card>
          </>
        ) : (
          /* Empty State - No progress yet */
          <Card padding="$6" backgroundColor="$deepSpace2" alignItems="center">
            <Text fontSize="$7" marginBottom="$3">
              🌱
            </Text>
            <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
              Your Journey Awaits
            </Text>
            <Text color="$silverMoon2" textAlign="center" fontSize="$3" lineHeight="$2">
              Begin Module 1 to start tracking your progress. Every step you take will be celebrated here.
            </Text>
          </Card>
        )}

        {/* Journal Entries Section */}
        <Card padding="$4" backgroundColor="$deepSpace2" marginBottom="$4">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$6" fontWeight="600" color="$silverMoon">
              📝 Your Journal
            </Text>
            {journalStats && journalStats.totalEntries > 0 && (
              <Text fontSize="$3" color="$cosmicViolet" fontWeight="600">
                {journalStats.totalEntries} {journalStats.totalEntries === 1 ? 'entry' : 'entries'}
              </Text>
            )}
          </XStack>

          {recentEntries && recentEntries.length > 0 ? (
            <>
              {/* Stats Summary */}
              {journalStats && (
                <Card padding="$3" backgroundColor="$deepSpace3" marginBottom="$3">
                  <XStack justifyContent="space-around">
                    <YStack alignItems="center">
                      <Text fontSize="$5" color="$innerChildGold" fontWeight="bold">
                        {journalStats.totalWords.toLocaleString()}
                      </Text>
                      <Text fontSize="$2" color="$silverMoon3">
                        words
                      </Text>
                    </YStack>
                    <YStack alignItems="center">
                      <Text fontSize="$5" color="$cosmicViolet" fontWeight="bold">
                        {journalStats.averageWords}
                      </Text>
                      <Text fontSize="$2" color="$silverMoon3">
                        avg/entry
                      </Text>
                    </YStack>
                  </XStack>
                </Card>
              )}

              {/* Recent Entries Preview */}
              <YStack gap="$3" marginBottom="$3">
                {recentEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    padding="$3"
                    backgroundColor="$deepSpace3"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => router.push(`/journal/${entry.id}`)}
                  >
                    <XStack justifyContent="space-between" marginBottom="$1" alignItems="center">
                      <Text fontSize="$2" color="$silverMoon3">
                        {formatDate(entry.created_at)}
                      </Text>
                      <Text fontSize="$2" color="$cosmicViolet">
                        {entry.word_count} words
                      </Text>
                    </XStack>
                    <Text fontSize="$3" color="$silverMoon" numberOfLines={2} lineHeight="$2">
                      {entry.content}
                    </Text>
                  </Card>
                ))}
              </YStack>

              {/* View All Button */}
              <Button
                size="$4"
                theme="active"
                onPress={() => router.push('/journal-history')}
              >
                <Text>View All Entries →</Text>
              </Button>
            </>
          ) : (
            // Empty State
            <YStack alignItems="center" padding="$3">
              <Text fontSize="$5" marginBottom="$2">
                📔
              </Text>
              <Text fontSize="$4" color="$silverMoon2" textAlign="center" marginBottom="$3">
                Start documenting your journey
              </Text>
              <Button
                size="$4"
                backgroundColor="$cosmicViolet"
                color="$silverMoon"
                onPress={() => router.push('/journaling')}
              >
                <Text fontWeight="600">Write First Entry</Text>
              </Button>
            </YStack>
          )}
        </Card>

        {/* Achievement Badges - Coming Soon */}
        <Card padding="$4" backgroundColor="$deepSpace2">
          <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
            Achievements
          </Text>
          <Text color="$silverMoon2" fontSize="$3">
            Earn badges by completing practices, maintaining streaks, and finishing modules. Coming soon!
          </Text>
        </Card>
      </ScrollView>
    </YStack>
  )
}
