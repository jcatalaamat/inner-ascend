import { ScrollView, Text, Card, YStack } from '@my/ui'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function JourneyScreen() {
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
        JOURNEY
      </Text>
      <Text fontSize="$5" color="$silverMoon2" marginBottom="$4">
        Being Human 101 · 16 Modules
      </Text>

      {/* Module 1 - Completed */}
      <Card
        padding="$4"
        marginBottom="$3"
        backgroundColor="$deepSpace2"
        borderColor="$integrationGreen"
        borderWidth={1}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => router.push('/module/1')}
      >
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$1">
          ✅ Module 1: Awakening
        </Text>
        <Text fontSize="$3" color="$silverMoon2">
          7 days · Complete
        </Text>
      </Card>

      {/* Module 2 - Completed */}
      <Card
        padding="$4"
        marginBottom="$3"
        backgroundColor="$deepSpace2"
        borderColor="$integrationGreen"
        borderWidth={1}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => router.push('/module/2')}
      >
        <Text fontSize="$6" fontWeight="600" color="$silverMoon" marginBottom="$1">
          ✅ Module 2: Core Wounds
        </Text>
        <Text fontSize="$3" color="$silverMoon2">
          7 days · Complete
        </Text>
      </Card>

      {/* Module 3 - Active */}
      <Card
        padding="$4"
        marginBottom="$3"
        backgroundColor="$deepSpace2"
        borderColor="$cosmicViolet"
        borderWidth={2}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => router.push('/module/3')}
      >
        <Text fontSize="$6" fontWeight="600" color="$cosmicViolet" marginBottom="$1">
          🔥 Module 3: Shadow Work & Radical Honesty
        </Text>
        <Text fontSize="$3" color="$silverMoon2">
          14 days · Day 9 of 14 (64% complete)
        </Text>
      </Card>

      {/* Module 4 - Locked */}
      <Card padding="$4" marginBottom="$3" backgroundColor="$deepSpace2" opacity={0.5}>
        <Text fontSize="$6" fontWeight="600" color="$silverMoon3" marginBottom="$1">
          🔒 Module 4: Inner Child Healing
        </Text>
        <Text fontSize="$3" color="$silverMoon3">
          14 days · Locked
        </Text>
      </Card>

      {/* Placeholder for remaining modules */}
      <Card padding="$4" marginBottom="$3" backgroundColor="$deepSpace2">
        <Text color="$silverMoon2">
          [Modules 5-16 placeholder - will list all 16 modules from database]
        </Text>
      </Card>
      </ScrollView>
    </YStack>
  )
}
