import { YStack, Text, TextArea, Button, XStack, ScrollView, Card } from '@my/ui'
import { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useCreateJournalEntryMutation } from 'app/utils/react-query/useJournalEntriesQuery'

export default function JournalingScreen() {
  const { prompt, moduleId } = useLocalSearchParams<{ prompt?: string; moduleId?: string }>()
  const [journalText, setJournalText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isWriting, setIsWriting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const insets = useSafeAreaInsets()

  const createEntry = useCreateJournalEntryMutation()

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isWriting) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isWriting])

  const handleTextChange = (text: string) => {
    setJournalText(text)
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0)
    setWordCount(words.length)

    // Start timer on first keystroke
    if (!isWriting && text.length > 0) {
      setIsWriting(true)
    }
  }

  const handleSave = async () => {
    if (wordCount === 0) return

    try {
      await createEntry.mutateAsync({
        content: journalText,
        wordCount,
        prompt: prompt || undefined,
        moduleId: moduleId ? parseInt(moduleId) : undefined,
      })

      // Show success feedback
      setSaveSuccess(true)
      setIsWriting(false)

      // Reset form after short delay
      setTimeout(() => {
        setJournalText('')
        setWordCount(0)
        setSeconds(0)
        setSaveSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error saving journal entry:', error)
      // Could add error toast here
    }
  }

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <YStack flex={1} backgroundColor="$deepSpace1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
      >
        {/* Header */}
        <Text fontSize="$8" fontWeight="bold" color="$silverMoon" marginBottom="$3">
          Journal
        </Text>

        {/* Prompt Card */}
        {(prompt || true) && (
          <Card padding="$4" backgroundColor="$deepSpace2" marginBottom="$4">
            <Text fontSize="$5" fontWeight="600" color="$cosmicViolet" marginBottom="$2">
              {prompt ? 'Your Prompt' : "Today's Reflection"}
            </Text>
            <Text
              fontStyle="italic"
              fontSize="$4"
              color="$silverMoon2"
              lineHeight="$3"
            >
              {prompt || '"Who triggered me today? What quality in them am I disowning in myself?"'}
            </Text>
          </Card>
        )}

        {/* Text Input Area */}
        <Card padding="$3" backgroundColor="$deepSpace2" marginBottom="$4">
          <TextArea
            placeholder="Begin writing your thoughts here..."
            placeholderTextColor="$silverMoon3"
            value={journalText}
            onChangeText={handleTextChange}
            backgroundColor="transparent"
            color="$silverMoon"
            borderWidth={0}
            minHeight={300}
            fontSize="$4"
            lineHeight="$5"
          />
        </Card>

        {/* Stats Bar */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4" paddingHorizontal="$1">
          <Text fontSize="$3" color="$silverMoon3">
            {wordCount === 0 ? 'Start writing...' : `💭 ${wordCount} ${wordCount === 1 ? 'word' : 'words'}`}
          </Text>
          <Text fontSize="$3" color="$silverMoon3">
            ⏱️ {formatTime(seconds)}
          </Text>
          <Text fontSize="$3" color="$silverMoon3">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </XStack>

        {/* Success Message */}
        {saveSuccess && (
          <Card
            padding="$4"
            backgroundColor="$integrationGreen"
            marginBottom="$4"
            alignItems="center"
          >
            <Text fontSize="$5" color="$silverMoon" fontWeight="600">
              ✓ Entry Saved!
            </Text>
            <Text fontSize="$3" color="$silverMoon" marginTop="$1">
              Your journal entry has been saved
            </Text>
          </Card>
        )}

        {/* Save Button */}
        <Button
          size="$5"
          backgroundColor="$cosmicViolet"
          color="$silverMoon"
          onPress={handleSave}
          disabled={wordCount === 0 || createEntry.isPending}
          opacity={wordCount === 0 || createEntry.isPending ? 0.5 : 1}
        >
          <Text fontWeight="600">
            {createEntry.isPending ? 'Saving...' : saveSuccess ? '✓ Saved' : 'Save Entry'}
          </Text>
        </Button>

        {/* Action Buttons */}
        {!saveSuccess && (
          <XStack gap="$2" marginTop="$3">
            <Button
              size="$4"
              theme="alt2"
              flex={1}
              onPress={() => router.push('/journal-history')}
            >
              <Text>View Past Entries</Text>
            </Button>
            <Button
              size="$4"
              theme="alt2"
              flex={1}
              onPress={() => router.back()}
            >
              <Text>Cancel</Text>
            </Button>
          </XStack>
        )}

        {/* Helper Text */}
        <Text fontSize="$3" color="$silverMoon3" textAlign="center" marginTop="$3" lineHeight="$2">
          Take your time. Write freely without judgment. Your entries are private and safe.
        </Text>
      </ScrollView>
    </YStack>
  )
}
