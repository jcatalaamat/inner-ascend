import { ScrollView, Text, Card, YStack, Spinner, Button, XStack } from '@my/ui'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useJournalEntriesQuery, useJournalStatsQuery } from 'app/utils/react-query/useJournalEntriesQuery'

export default function JournalHistoryScreen() {
  const insets = useSafeAreaInsets()
  const { data: entries, isLoading } = useJournalEntriesQuery()
  const { data: stats } = useJournalStatsQuery()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

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
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Text fontSize="$8" fontWeight="bold" color="$silverMoon" marginBottom="$2">
          JOURNAL HISTORY
        </Text>
        <Text fontSize="$5" color="$silverMoon2" marginBottom="$4">
          Your healing journey in words
        </Text>

        {/* Stats Card */}
        {stats && stats.totalEntries > 0 && (
          <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2" borderWidth={1} borderColor="$cosmicViolet">
            <Text fontSize="$5" fontWeight="600" color="$silverMoon" marginBottom="$3">
              📊 Your Journal Stats
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text color="$silverMoon2">Total Entries</Text>
                <Text color="$innerChildGold" fontWeight="bold">{stats.totalEntries}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text color="$silverMoon2">Total Words Written</Text>
                <Text color="$innerChildGold" fontWeight="bold">{stats.totalWords.toLocaleString()}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text color="$silverMoon2">Average Words per Entry</Text>
                <Text color="$innerChildGold" fontWeight="bold">{stats.averageWords}</Text>
              </XStack>
            </YStack>
          </Card>
        )}

        {/* New Entry Button */}
        <Button
          size="$5"
          backgroundColor="$cosmicViolet"
          color="$silverMoon"
          marginBottom="$5"
          onPress={() => router.push('/journaling')}
        >
          <Text fontWeight="600">✍️ Write New Entry</Text>
        </Button>

        {/* Entries List */}
        {entries && entries.length > 0 ? (
          <YStack gap="$4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                padding="$4"
                backgroundColor="$deepSpace2"
                borderWidth={1}
                borderColor="$deepSpace3"
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
                onPress={() => router.push(`/journal/${entry.id}`)}
              >
                {/* Date and Word Count */}
                <XStack justifyContent="space-between" marginBottom="$2" alignItems="center">
                  <Text fontSize="$3" color="$silverMoon3">
                    {formatDate(entry.created_at)}
                  </Text>
                  <XStack gap="$2" alignItems="center">
                    <Text fontSize="$3" color="$cosmicViolet" fontWeight="600">
                      {entry.word_count} words
                    </Text>
                  </XStack>
                </XStack>

                {/* Prompt (if exists) */}
                {entry.prompt && (
                  <Card padding="$3" backgroundColor="$deepSpace3" marginBottom="$2">
                    <Text fontSize="$2" color="$silverMoon3" marginBottom="$1">
                      Prompt:
                    </Text>
                    <Text fontSize="$3" color="$cosmicViolet" fontStyle="italic" numberOfLines={2}>
                      {entry.prompt}
                    </Text>
                  </Card>
                )}

                {/* Content Preview */}
                <Text fontSize="$4" color="$silverMoon" lineHeight="$3" numberOfLines={4} marginBottom="$2">
                  {entry.content}
                </Text>

                {/* Read More */}
                <Text fontSize="$3" color="$cosmicViolet" marginTop="$2">
                  Read more →
                </Text>
              </Card>
            ))}
          </YStack>
        ) : (
          // Empty State
          <Card padding="$6" backgroundColor="$deepSpace2" alignItems="center">
            <Text fontSize="$6" marginBottom="$3">
              📔
            </Text>
            <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2" textAlign="center">
              Start Your First Entry
            </Text>
            <Text color="$silverMoon2" textAlign="center" fontSize="$3" lineHeight="$3" marginBottom="$4">
              Your journal is a sacred space for reflection, processing, and growth. Begin documenting your healing journey today.
            </Text>
            <Button
              size="$4"
              backgroundColor="$cosmicViolet"
              color="$silverMoon"
              onPress={() => router.push('/journaling')}
            >
              <Text fontWeight="600">Write Your First Entry</Text>
            </Button>
          </Card>
        )}
      </ScrollView>
    </YStack>
  )
}
