import { ScrollView, Text, Card, YStack, Spinner, Button, XStack } from '@my/ui'
import { useLocalSearchParams, router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useJournalEntryQuery } from 'app/utils/react-query/useJournalEntriesQuery'

export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()

  const entryId = id && !Array.isArray(id) ? id : ''
  const { data: entry, isLoading } = useJournalEntryQuery(entryId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$cosmicViolet" />
      </YStack>
    )
  }

  if (!entry) {
    return (
      <YStack flex={1} backgroundColor="$deepSpace1" justifyContent="center" alignItems="center" padding="$4">
        <Text fontSize="$6" marginBottom="$3">
          📔
        </Text>
        <Text color="$silverMoon" textAlign="center" fontSize="$5" marginBottom="$2">
          Entry Not Found
        </Text>
        <Text color="$silverMoon2" textAlign="center" marginBottom="$4">
          This journal entry doesn't exist or you don't have permission to view it.
        </Text>
        <Button
          size="$4"
          theme="active"
          onPress={() => router.push('/journal-history')}
        >
          <Text>Back to Journal History</Text>
        </Button>
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
        {/* Back Button */}
        <Button
          size="$3"
          theme="alt2"
          marginBottom="$4"
          alignSelf="flex-start"
          onPress={() => router.back()}
        >
          <Text>← Back</Text>
        </Button>

        {/* Date Header */}
        <Text fontSize="$7" fontWeight="bold" color="$silverMoon" marginBottom="$1">
          {formatDate(entry.created_at)}
        </Text>
        <XStack gap="$3" marginBottom="$4">
          <Text fontSize="$3" color="$silverMoon3">
            {formatTime(entry.created_at)}
          </Text>
          <Text fontSize="$3" color="$silverMoon3">
            •
          </Text>
          <Text fontSize="$3" color="$cosmicViolet" fontWeight="600">
            {entry.word_count} words
          </Text>
        </XStack>

        {/* Prompt Card (if exists) */}
        {entry.prompt && (
          <Card
            padding="$4"
            backgroundColor="$deepSpace2"
            borderWidth={1}
            borderColor="$cosmicViolet"
            marginBottom="$4"
          >
            <Text fontSize="$4" color="$silverMoon3" marginBottom="$2">
              Prompt
            </Text>
            <Text fontSize="$5" color="$cosmicViolet" fontStyle="italic" lineHeight="$3">
              {entry.prompt}
            </Text>
          </Card>
        )}

        {/* Entry Content */}
        <Card
          padding="$5"
          backgroundColor="$deepSpace2"
          borderWidth={1}
          borderColor="$deepSpace3"
          marginBottom="$4"
        >
          <Text fontSize="$5" color="$silverMoon" lineHeight="$4">
            {entry.content}
          </Text>
        </Card>

        {/* Metadata Card */}
        <Card padding="$4" backgroundColor="$deepSpace2" marginBottom="$4">
          <Text fontSize="$4" color="$silverMoon3" marginBottom="$2">
            Entry Details
          </Text>
          <YStack gap="$2">
            <XStack justifyContent="space-between">
              <Text color="$silverMoon2">Created</Text>
              <Text color="$silverMoon">{formatDate(entry.created_at)}</Text>
            </XStack>
            {entry.updated_at !== entry.created_at && (
              <XStack justifyContent="space-between">
                <Text color="$silverMoon2">Last Updated</Text>
                <Text color="$silverMoon">{formatDate(entry.updated_at)}</Text>
              </XStack>
            )}
            <XStack justifyContent="space-between">
              <Text color="$silverMoon2">Word Count</Text>
              <Text color="$innerChildGold" fontWeight="bold">{entry.word_count}</Text>
            </XStack>
          </YStack>
        </Card>

        {/* Action Buttons */}
        <YStack gap="$3">
          <Button
            size="$4"
            backgroundColor="$cosmicViolet"
            color="$silverMoon"
            onPress={() => router.push('/journaling')}
          >
            <Text fontWeight="600">✍️ Write New Entry</Text>
          </Button>
          <Button
            size="$4"
            theme="alt2"
            onPress={() => router.push('/journal-history')}
          >
            <Text>View All Entries</Text>
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
