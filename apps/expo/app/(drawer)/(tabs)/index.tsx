import { ScrollView, Text, Card, XStack, Button, YStack } from '@my/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TodayScreen() {
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
      <Text fontSize="$8" fontWeight="bold" color="$silverMoon" marginBottom="$2">
        TODAY
      </Text>
      <Text fontSize="$3" color="$silverMoon2" marginBottom="$4">
        🌙 Waning Crescent · October 19, 2025
      </Text>

      {/* Cosmic Weather Card */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
          Cosmic Weather
        </Text>
        <Text color="$silverMoon2">
          [Placeholder: Daily cosmic guidance will appear here]
        </Text>
      </Card>

      {/* Today's Shadow Work Card */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$2">
          Today's Shadow Work
        </Text>
        <Text color="$silverMoon2" marginBottom="$2">
          Module 3: Shadow Work · Day 9 of 14
        </Text>
        <Text color="$silverMoon2">
          [Placeholder: Today's focus and practice]
        </Text>
      </Card>

      {/* Emotional Check-In Card */}
      <Card padding="$4" marginBottom="$4" backgroundColor="$deepSpace2">
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$3">
          How are you feeling?
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          <Button size="$3" theme="alt2">Struggling</Button>
          <Button size="$3" theme="alt2">Processing</Button>
          <Button size="$3" theme="alt2">Clear</Button>
          <Button size="$3" theme="alt2">Integrated</Button>
        </XStack>
      </Card>

      {/* Streak Counter */}
      <XStack alignItems="center" justifyContent="center" padding="$4">
        <Text fontSize="$7" color="$innerChildGold">
          🔥 23 Day Streak
        </Text>
      </XStack>
      </ScrollView>
    </YStack>
  )
}
