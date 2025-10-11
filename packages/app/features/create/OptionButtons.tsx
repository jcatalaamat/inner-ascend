import { memo } from 'react'
import { Button, XStack, YStack, Text } from '@my/ui'

interface OptionButtonsProps {
  title: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}

export const OptionButtons = memo(({ title, options, selected, onToggle }: OptionButtonsProps) => {
  return (
    <YStack gap="$2">
      <Text fontSize="$3" color="$color11" fontWeight="600">
        {title}
      </Text>
      <XStack gap="$2" flexWrap="wrap">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <Button
              key={option.value}
              size="$3"
              onPress={() => onToggle(option.value)}
              bg={isSelected ? '$blue9' : '$background'}
              borderColor={isSelected ? '$blue9' : '$borderColor'}
              borderWidth={1}
              borderRadius="$10"
              color={isSelected ? 'white' : '$color'}
              pressStyle={{
                bg: isSelected ? '$blue8' : '$gray3',
              }}
            >
              {option.label}
            </Button>
          )
        })}
      </XStack>
    </YStack>
  )
})

OptionButtons.displayName = 'OptionButtons'
