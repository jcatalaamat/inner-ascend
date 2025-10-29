import { ScrollView, Text, Card, XStack, Button, YStack, Spinner } from '@my/ui'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useMeditationsQuery, useExercisesQuery, useJournalingPromptsQuery } from 'app/utils/react-query/usePracticesQuery'
import { PracticeDetailSheet } from 'app/components/PracticeDetailSheet'
import { FloatingMenuButton } from 'app/components/FloatingMenuButton'

// Theme metadata for journaling prompts
const themeMetadata: Record<string, { icon: string; title: string }> = {
  shadow_work: { icon: '🌑', title: 'Shadow Work' },
  inner_child: { icon: '🧸', title: 'Inner Child' },
  core_wounds: { icon: '💔', title: 'Core Wounds' },
  radical_honesty: { icon: '🔥', title: 'Radical Honesty' },
  integration: { icon: '✨', title: 'Integration' },
}

export default function PracticesScreen() {
  const [activeTab, setActiveTab] = useState<'meditations' | 'journaling' | 'exercises'>('meditations')
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set())
  const [selectedPractice, setSelectedPractice] = useState<any>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [practiceType, setPracticeType] = useState<'meditation' | 'exercise'>('meditation')
  const insets = useSafeAreaInsets()

  const { data: meditations, isLoading: meditationsLoading } = useMeditationsQuery()
  const { data: exercises, isLoading: exercisesLoading } = useExercisesQuery()
  const { data: prompts, isLoading: promptsLoading } = useJournalingPromptsQuery()

  const isLoading = meditationsLoading || exercisesLoading || promptsLoading

  const handleOpenPractice = (practice: any, type: 'meditation' | 'exercise') => {
    setSelectedPractice(practice)
    setPracticeType(type)
    setSheetOpen(true)
  }

  const toggleTheme = (theme: string) => {
    const newExpanded = new Set(expandedThemes)
    if (newExpanded.has(theme)) {
      newExpanded.delete(theme)
    } else {
      newExpanded.add(theme)
    }
    setExpandedThemes(newExpanded)
  }

  const totalPrompts = prompts ? Object.values(prompts).reduce((sum, arr) => sum + arr.length, 0) : 0

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
        PRACTICES
      </Text>
      <Text fontSize="$4" color="$silverMoon2" marginBottom="$4">
        Your sanctuary of healing tools
      </Text>

      {/* Tab Buttons with Counts */}
      <XStack gap="$2" marginBottom="$5">
        <Button
          size="$3"
          theme={activeTab === 'meditations' ? 'active' : 'alt2'}
          onPress={() => setActiveTab('meditations')}
          flex={1}
        >
          <Text>Meditations ({meditations?.length || 0})</Text>
        </Button>
        <Button
          size="$3"
          theme={activeTab === 'journaling' ? 'active' : 'alt2'}
          onPress={() => setActiveTab('journaling')}
          flex={1}
        >
          <Text>Prompts ({totalPrompts})</Text>
        </Button>
        <Button
          size="$3"
          theme={activeTab === 'exercises' ? 'active' : 'alt2'}
          onPress={() => setActiveTab('exercises')}
          flex={1}
        >
          <Text>Exercises ({exercises?.length || 0})</Text>
        </Button>
      </XStack>

      {isLoading ? (
        <YStack alignItems="center" justifyContent="center" padding="$8">
          <Spinner size="large" color="$cosmicViolet" />
        </YStack>
      ) : (
        <>
          {/* Meditations Tab */}
          {activeTab === 'meditations' && (
            <YStack gap="$4">
              {meditations?.map((meditation, index) => (
                <Card
                  key={index}
                  padding="$5"
                  backgroundColor="$deepSpace2"
                  borderWidth={1}
                  borderColor="$deepSpace3"
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                  onPress={() => handleOpenPractice(meditation, 'meditation')}
                >
                  {/* Title and Duration Row */}
                  <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                    <YStack flex={1} marginRight="$2">
                      <Text color="$silverMoon" fontSize="$6" fontWeight="600" marginBottom="$1">
                        {meditation.title}
                      </Text>
                    </YStack>
                    <XStack gap="$2" alignItems="center">
                      <Text fontSize="$2" color="$silverMoon3">
                        🎧
                      </Text>
                      <Text fontSize="$3" color="$cosmicViolet" fontWeight="600">
                        {meditation.duration_minutes} min
                      </Text>
                    </XStack>
                  </XStack>

                  {/* Description */}
                  <Text fontSize="$4" color="$silverMoon2" lineHeight="$3" marginBottom="$3">
                    {meditation.description}
                  </Text>

                  {/* Best For Section */}
                  {meditation.bestFor && (
                    <Card padding="$3" backgroundColor="$deepSpace3" marginBottom="$3">
                      <Text fontSize="$3" color="$silverMoon3" marginBottom="$1">
                        Best for:
                      </Text>
                      <Text fontSize="$3" color="$innerChildGold" lineHeight="$2">
                        {meditation.bestFor}
                      </Text>
                    </Card>
                  )}

                  {/* Audio Status */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$2" color="$silverMoon3">
                      {meditation.audio_url ? '● Audio available' : '○ Audio coming soon'}
                    </Text>
                    <Button
                      size="$3"
                      theme="active"
                      opacity={meditation.audio_url ? 1 : 0.5}
                      onPress={(e) => {
                        e.stopPropagation()
                        handleOpenPractice(meditation, 'meditation')
                      }}
                    >
                      <Text>{meditation.audio_url ? 'Play' : 'View Details'}</Text>
                    </Button>
                  </XStack>
                </Card>
              ))}
            </YStack>
          )}

          {/* Journaling Tab */}
          {activeTab === 'journaling' && (
            <YStack gap="$4">
              <Card padding="$4" backgroundColor="$deepSpace2" borderWidth={1} borderColor="$cosmicViolet" marginBottom="$1">
                <Text fontSize="$5" color="$silverMoon" fontWeight="600" marginBottom="$2">
                  📝 Start Journaling
                </Text>
                <Text fontSize="$3" color="$silverMoon2" lineHeight="$2" marginBottom="$3">
                  Tap any prompt to begin writing. Your entries are private and safe.
                </Text>
                <Button
                  size="$4"
                  backgroundColor="$cosmicViolet"
                  color="$silverMoon"
                  onPress={() => router.push('/journaling')}
                >
                  Open Journal →
                </Button>
              </Card>

              {prompts && Object.entries(prompts).map(([theme, themePrompts]) => {
                const metadata = themeMetadata[theme] || { icon: '●', title: theme.replace(/_/g, ' ') }
                const isExpanded = expandedThemes.has(theme)

                return (
                  <Card
                    key={theme}
                    padding="$4"
                    backgroundColor="$deepSpace2"
                    borderWidth={1}
                    borderColor={isExpanded ? '$cosmicViolet' : '$deepSpace3'}
                  >
                    {/* Theme Header - Tappable */}
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom={isExpanded ? '$3' : 0}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => toggleTheme(theme)}
                    >
                      <XStack gap="$2" alignItems="center">
                        <Text fontSize="$5">{metadata.icon}</Text>
                        <Text color="$cosmicViolet" fontSize="$5" fontWeight="600">
                          {metadata.title}
                        </Text>
                        <Text fontSize="$3" color="$silverMoon3">
                          ({themePrompts.length})
                        </Text>
                      </XStack>
                      <Text fontSize="$4" color="$silverMoon3">
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    </XStack>

                    {/* Prompts - Collapsible */}
                    {isExpanded && (
                      <YStack gap="$3">
                        {(themePrompts as string[]).map((prompt, idx) => (
                          <Card
                            key={idx}
                            padding="$3"
                            backgroundColor="$deepSpace3"
                            pressStyle={{ opacity: 0.8 }}
                            onPress={() => router.push(`/journaling?prompt=${encodeURIComponent(prompt)}`)}
                          >
                            <Text color="$silverMoon2" fontSize="$3" lineHeight="$3">
                              {prompt}
                            </Text>
                          </Card>
                        ))}
                      </YStack>
                    )}
                  </Card>
                )
              })}
            </YStack>
          )}

          {/* Exercises Tab */}
          {activeTab === 'exercises' && (
            <YStack gap="$4">
              {exercises && exercises.length > 0 ? (
                exercises.map((exercise, index) => (
                  <Card
                    key={index}
                    padding="$5"
                    backgroundColor="$deepSpace2"
                    borderWidth={1}
                    borderColor="$deepSpace3"
                    pressStyle={{ opacity: 0.8, scale: 0.98 }}
                    onPress={() => handleOpenPractice(exercise, 'exercise')}
                  >
                    {/* Title and Duration */}
                    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                      <YStack flex={1} marginRight="$2">
                        <Text color="$silverMoon" fontSize="$6" fontWeight="600" marginBottom="$1">
                          {exercise.title}
                        </Text>
                      </YStack>
                      <Card padding="$2" paddingHorizontal="$3" backgroundColor="$cosmicViolet">
                        <Text fontSize="$3" color="$silverMoon" fontWeight="600">
                          ~{exercise.duration_minutes} min
                        </Text>
                      </Card>
                    </XStack>

                    {/* Description */}
                    <Text fontSize="$4" color="$silverMoon2" lineHeight="$3" marginBottom="$4">
                      {exercise.description}
                    </Text>

                    {/* Instructions Preview */}
                    <Card padding="$3" backgroundColor="$deepSpace3" marginBottom="$3">
                      <Text fontSize="$3" color="$silverMoon3" marginBottom="$1">
                        Instructions:
                      </Text>
                      <Text fontSize="$3" color="$silverMoon2" lineHeight="$2">
                        {exercise.instructions.length > 120
                          ? `${exercise.instructions.substring(0, 120)}...`
                          : exercise.instructions}
                      </Text>
                    </Card>

                    {/* Start Button */}
                    <Button
                      size="$4"
                      backgroundColor="$cosmicViolet"
                      color="$silverMoon"
                      onPress={(e) => {
                        e.stopPropagation()
                        handleOpenPractice(exercise, 'exercise')
                      }}
                    >
                      <Text>Start Exercise →</Text>
                    </Button>
                  </Card>
                ))
              ) : (
                <Card padding="$6" backgroundColor="$deepSpace2" alignItems="center">
                  <Text fontSize="$6" marginBottom="$3">
                    📋
                  </Text>
                  <Text fontSize="$5" fontWeight="600" color="$silverMoon" marginBottom="$2" textAlign="center">
                    More Exercises Coming Soon
                  </Text>
                  <Text color="$silverMoon2" textAlign="center" fontSize="$3" lineHeight="$2">
                    Additional shadow work exercises will be available soon. For now, explore the meditations and journaling prompts.
                  </Text>
                </Card>
              )}
            </YStack>
          )}
        </>
      )}
      </ScrollView>

      {/* Practice Detail Sheet */}
      <PracticeDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        practice={selectedPractice}
        type={practiceType}
      />
    </YStack>
  )
}
