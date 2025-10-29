import { Sheet, Text, YStack, XStack, Button, ScrollView, Card, Separator } from '@my/ui'
import { X } from '@tamagui/lucide-icons'

type Meditation = {
  title: string
  type: 'meditation'
  duration_minutes: number
  description: string
  fullDescription: string
  benefits: string[]
  instructions: string
  bestFor: string
  audio_url: string | null
}

type Exercise = {
  title: string
  type: 'exercise'
  duration_minutes: number
  description: string
  instructions: string
}

type Practice = Meditation | Exercise

interface PracticeDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  practice: Practice | null
  type: 'meditation' | 'exercise'
}

export function PracticeDetailSheet({ open, onOpenChange, practice, type }: PracticeDetailSheetProps) {
  if (!practice) return null

  const isMeditation = type === 'meditation'
  const meditation = isMeditation ? (practice as Meditation) : null

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        backgroundColor="rgba(0,0,0,0.5)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle backgroundColor="$silverMoon3" />
      <Sheet.Frame backgroundColor="$deepSpace1" padding="$4" paddingTop="$2">
        <YStack flex={1} gap="$4">
          {/* Header */}
          <XStack alignItems="flex-start" justifyContent="space-between" gap="$3">
            <YStack flex={1}>
              <Text fontSize="$7" fontWeight="bold" color="$silverMoon">
                {practice.title}
              </Text>
              <XStack gap="$2" alignItems="center" marginTop="$1" flexWrap="wrap">
                <Text fontSize="$3" color="$silverMoon3">
                  ⏱️ {practice.duration_minutes} min
                </Text>
                {isMeditation && meditation?.bestFor && (
                  <>
                    <Text color="$silverMoon3">•</Text>
                    <Text fontSize="$3" color="$cosmicViolet">
                      {meditation.bestFor}
                    </Text>
                  </>
                )}
              </XStack>
            </YStack>
            <Button
              circular
              size="$3"
              onPress={() => onOpenChange(false)}
              backgroundColor="$deepSpace2"
              pressStyle={{ opacity: 0.7 }}
              marginTop="$1"
            >
              <X size={20} color="$silverMoon2" />
            </Button>
          </XStack>

          <Separator borderColor="$deepSpace3" />

          {/* Scrollable Content */}
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack gap="$4" paddingBottom="$4">
              {/* Full Description */}
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="600" color="$silverMoon">
                  {isMeditation ? '🧘 About This Meditation' : '💪 About This Exercise'}
                </Text>
                <Text fontSize="$4" color="$silverMoon2" lineHeight="$3">
                  {isMeditation ? meditation?.fullDescription : practice.description}
                </Text>
              </YStack>

              {/* Benefits (Meditation only) */}
              {isMeditation && meditation?.benefits && meditation.benefits.length > 0 && (
                <Card padding="$4" backgroundColor="$deepSpace2" borderColor="$cosmicViolet" borderWidth={1}>
                  <Text fontSize="$5" fontWeight="600" color="$cosmicViolet" marginBottom="$2">
                    ✨ Benefits
                  </Text>
                  <YStack gap="$2">
                    {meditation.benefits.map((benefit, idx) => (
                      <XStack key={idx} gap="$2" alignItems="flex-start">
                        <Text color="$integrationGreen" fontSize="$4">•</Text>
                        <Text flex={1} color="$silverMoon2" fontSize="$4" lineHeight="$2">
                          {benefit}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </Card>
              )}

              {/* Instructions */}
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="600" color="$silverMoon">
                  📝 Instructions
                </Text>
                <Text fontSize="$4" color="$silverMoon2" lineHeight="$3">
                  {practice.instructions}
                </Text>
              </YStack>

              {/* Audio Status (Meditation only) */}
              {isMeditation && (
                <Card padding="$4" backgroundColor="$deepSpace2" borderColor="$deepSpace3" borderWidth={1}>
                  <XStack gap="$3" alignItems="center">
                    <Text fontSize="$6">🎧</Text>
                    <YStack flex={1}>
                      <Text fontSize="$4" color="$silverMoon2">
                        Guided Audio
                      </Text>
                      <Text fontSize="$3" color="$silverMoon3">
                        {meditation?.audio_url ? 'Available to play' : 'Recording coming soon'}
                      </Text>
                    </YStack>
                  </XStack>
                </Card>
              )}
            </YStack>
          </ScrollView>

          {/* Footer Actions */}
          <YStack gap="$3" paddingTop="$2">
            <Button
              size="$5"
              backgroundColor="$cosmicViolet"
              color="$silverMoon"
              disabled={isMeditation && !meditation?.audio_url}
              opacity={isMeditation && !meditation?.audio_url ? 0.5 : 1}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text fontWeight="600" color="$silverMoon">
                {isMeditation
                  ? (meditation?.audio_url ? '▶️ Play Meditation' : '🔒 Audio Coming Soon')
                  : '▶️ Begin Exercise'
                }
              </Text>
            </Button>

            {!isMeditation && (
              <Text fontSize="$3" color="$silverMoon3" textAlign="center">
                Follow the instructions above at your own pace
              </Text>
            )}
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
