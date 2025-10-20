import { ScrollView, Text, Card, YStack, XStack } from '@my/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ProgressScreen() {
  const insets = useSafeAreaInsets()

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

      {/* Circular Progress Placeholder */}
      <Card padding="$6" marginBottom="$4" backgroundColor="$deepSpace2" alignItems="center">
        <Text fontSize="$10" color="$cosmicViolet" marginBottom="$2">
          67 / 90
        </Text>
        <Text fontSize="$4" color="$silverMoon2">
          Days Practiced
        </Text>
        <Text fontSize="$2" color="$silverMoon3" marginTop="$2">
          [Circular progress ring - placeholder]
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
            <Text color="$innerChildGold" fontWeight="bold">23 days</Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$silverMoon2">⭐ Longest Streak</Text>
            <Text color="$silverMoon">31 days</Text>
          </XStack>
        </YStack>
      </Card>

      {/* Modules Progress Card */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
          Modules Completed
        </Text>
        <Text color="$silverMoon2" marginBottom="$2">
          ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○
        </Text>
        <Text color="$silverMoon2">
          2 of 16 modules complete
        </Text>
      </Card>

      {/* Practice Breakdown Card */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
          Practice Breakdown
        </Text>
        <YStack gap="$2">
          <XStack justifyContent="space-between">
            <Text color="$silverMoon2">🧘 Meditations</Text>
            <Text color="$silverMoon" fontWeight="bold">42</Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$silverMoon2">📝 Journal Entries</Text>
            <Text color="$silverMoon" fontWeight="bold">38</Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$silverMoon2">🎯 Exercises</Text>
            <Text color="$silverMoon" fontWeight="bold">28</Text>
          </XStack>
        </YStack>
      </Card>

      {/* Achievement Badges Placeholder */}
      <Card padding="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
          Achievement Badges
        </Text>
        <Text color="$silverMoon2">
          [Badges - placeholder]
        </Text>
      </Card>
      </ScrollView>
    </YStack>
  )
}
