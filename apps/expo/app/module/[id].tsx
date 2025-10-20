import { ScrollView, Text, Card, YStack, Button } from '@my/ui'
import { useLocalSearchParams, router } from 'expo-router'

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <ScrollView padding="$4" backgroundColor="$deepSpace1">
      <Text fontSize="$7" fontWeight="bold" color="$silverMoon" marginBottom="$2">
        Module {id}: Shadow Work
      </Text>
      <Text fontSize="$3" color="$silverMoon2" marginBottom="$4">
        Day 9 of 14
      </Text>

      {/* Progress Bar Placeholder */}
      <Card padding="$2" marginBottom="$4" backgroundColor="$deepSpace3">
        <Text fontSize="$2" color="$cosmicViolet">
          ▓▓▓▓▓▓▓▓▓░░░░░ 64%
        </Text>
      </Card>

      {/* Today's Teaching Section */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
          📖 Today's Teaching
        </Text>
        <Text color="$silverMoon" marginBottom="$2">
          The Projection Mechanism
        </Text>
        <Text fontSize="$2" color="$silverMoon3" marginBottom="$3">
          (12 min read)
        </Text>
        <Text color="$silverMoon2">
          [Placeholder: This is where the daily teaching content from Being Human 101 will appear.
          It will include the wisdom, insights, and guidance for today's practice.]
        </Text>
      </Card>

      {/* Practices Section */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
          🧘 Today's Practices
        </Text>
        <YStack gap="$2">
          <Text color="$silverMoon2">• Shadow Integration Meditation (12 min)</Text>
          <Text color="$silverMoon2">• Projection Tracker Exercise (5 min)</Text>
          <Text color="$silverMoon2">• Parts Dialogue Practice (15 min)</Text>
        </YStack>
      </Card>

      {/* Journaling Section */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
          📝 Journaling Prompt
        </Text>
        <Text fontStyle="italic" color="$silverMoon2" marginBottom="$3">
          "Who triggered me today? What quality in them am I disowning in myself?"
        </Text>
        <Button
          theme="active"
          size="$4"
          onPress={() => router.push('/journaling')}
        >
          Start Journaling →
        </Button>
      </Card>

      {/* Mark Complete Button */}
      <Button
        size="$5"
        backgroundColor="$cosmicViolet"
        color="$silverMoon"
        marginBottom="$4"
      >
        ✓ Mark Today Complete
      </Button>
    </ScrollView>
  )
}
