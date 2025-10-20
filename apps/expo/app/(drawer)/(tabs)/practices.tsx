import { ScrollView, Text, Card, XStack, Button, YStack } from '@my/ui'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PracticesScreen() {
  const [activeTab, setActiveTab] = useState<'meditations' | 'journaling' | 'exercises'>('meditations')
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
        PRACTICES
      </Text>

      {/* Tab Buttons */}
      <XStack gap="$2" marginBottom="$4">
        <Button
          size="$3"
          theme={activeTab === 'meditations' ? 'active' : 'alt2'}
          onPress={() => setActiveTab('meditations')}
          flex={1}
        >
          Meditations
        </Button>
        <Button
          size="$3"
          theme={activeTab === 'journaling' ? 'active' : 'alt2'}
          onPress={() => setActiveTab('journaling')}
          flex={1}
        >
          Journaling
        </Button>
        <Button
          size="$3"
          theme={activeTab === 'exercises' ? 'active' : 'alt2'}
          onPress={() => setActiveTab('exercises')}
          flex={1}
        >
          Exercises
        </Button>
      </XStack>

      {/* Meditations Tab */}
      {activeTab === 'meditations' && (
        <YStack gap="$3">
          <Text fontSize="$5" color="$silverMoon2" marginBottom="$2">
            Guided Meditations (7)
          </Text>
          <Card padding="$4" backgroundColor="$deepSpace2">
            <Text color="$silverMoon">Shadow Integration Meditation</Text>
            <Text fontSize="$2" color="$silverMoon3">12 min</Text>
          </Card>
          <Card padding="$4" backgroundColor="$deepSpace2">
            <Text color="$silverMoon">Inner Child Reconnection</Text>
            <Text fontSize="$2" color="$silverMoon3">18 min</Text>
          </Card>
          <Card padding="$4" backgroundColor="$deepSpace2">
            <Text color="$silverMoon">[5 more meditations - placeholder]</Text>
          </Card>
        </YStack>
      )}

      {/* Journaling Tab */}
      {activeTab === 'journaling' && (
        <YStack gap="$3">
          <Text fontSize="$5" color="$silverMoon2" marginBottom="$2">
            Journaling Prompts
          </Text>
          <Card padding="$4" backgroundColor="$deepSpace2">
            <Text color="$silverMoon2">
              [Prompts organized by theme - placeholder]
            </Text>
          </Card>
        </YStack>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <YStack gap="$3">
          <Text fontSize="$5" color="$silverMoon2" marginBottom="$2">
            Shadow Work Exercises
          </Text>
          <Card padding="$4" backgroundColor="$deepSpace2">
            <Text color="$silverMoon2">
              [Exercises list - placeholder]
            </Text>
          </Card>
        </YStack>
      )}
      </ScrollView>
    </YStack>
  )
}
