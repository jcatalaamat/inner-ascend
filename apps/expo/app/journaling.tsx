import { YStack, Text, TextArea, Button, XStack } from '@my/ui'
import { useState } from 'react'

export default function JournalingScreen() {
  const [journalText, setJournalText] = useState('')
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (text: string) => {
    setJournalText(text)
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0)
    setWordCount(words.length)
  }

  const handleSave = () => {
    // Placeholder: Will save to database in future
    console.log('Saving journal entry...', { wordCount, text: journalText })
  }

  return (
    <YStack padding="$4" backgroundColor="$deepSpace1" flex={1}>
      {/* Prompt */}
      <Text
        fontStyle="italic"
        fontSize="$5"
        color="$silverMoon2"
        marginBottom="$4"
      >
        "Who triggered me today? What quality in them am I disowning in myself?"
      </Text>

      {/* Text Input Area */}
      <TextArea
        placeholder="Begin writing..."
        placeholderTextColor="$silverMoon3"
        value={journalText}
        onChangeText={handleTextChange}
        backgroundColor="$deepSpace2"
        color="$silverMoon"
        borderColor="$deepSpace3"
        minHeight={300}
        flex={1}
        marginBottom="$4"
        fontSize="$4"
        lineHeight="$6"
      />

      {/* Word Count & Timer */}
      <XStack justifyContent="space-between" marginBottom="$4">
        <Text fontSize="$3" color="$silverMoon3">
          💭 {wordCount} words
        </Text>
        <Text fontSize="$3" color="$silverMoon3">
          ⏱️ [Timer placeholder]
        </Text>
      </XStack>

      {/* Save Button */}
      <Button
        size="$5"
        backgroundColor="$cosmicViolet"
        color="$silverMoon"
        onPress={handleSave}
      >
        Save Entry
      </Button>
    </YStack>
  )
}
