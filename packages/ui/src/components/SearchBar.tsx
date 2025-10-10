import { Search, X, Map, Plus, Filter } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Input, XStack, Text } from 'tamagui'
import { router } from 'expo-router'

export type SearchBarProps = {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  showMapButton?: boolean
  onMapPress?: () => void
  mapViewType?: 'events' | 'places' | 'both'
  showFilterButton?: boolean
  onFilterPress?: () => void
  activeFilterCount?: number
  showCreateButton?: boolean
  onCreatePress?: () => void
  createType?: 'event' | 'place'
}

export const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  defaultValue = '',
  showMapButton = false,
  onMapPress,
  mapViewType = 'both',
  showFilterButton = false,
  onFilterPress,
  activeFilterCount = 0,
  showCreateButton = false,
  onCreatePress,
  createType = 'event'
}: SearchBarProps) => {
  const [query, setQuery] = useState(defaultValue)

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleChangeText = (text: string) => {
    setQuery(text)
    // Debounced search - call onSearch after user stops typing
    onSearch(text)
  }

  return (
    <XStack ai="center" gap="$2" px="$4" py="$2">
      <XStack f={1} ai="center" gap="$2" bg="$color3" px="$3" py="$2" borderRadius="$3">
        <Search size={20} color="$color10" />
        <Input
          f={1}
          placeholder={placeholder}
          value={query}
          onChangeText={handleChangeText}
          backgroundColor="transparent"
          borderWidth={0}
          placeholderTextColor="$color10"
          fontSize="$4"
        />
        {query.length > 0 && (
          <Button
            size="$2"
            circular
            chromeless
            icon={<X size={16} />}
            onPress={handleClear}
            pressStyle={{ opacity: 0.7 }}
          />
        )}
      </XStack>

      {showMapButton && (
        <Button
          size="$3"
          icon={Map}
          onPress={() => {
            if (onMapPress) {
              onMapPress()
            } else {
              router.push(`/map?view=${mapViewType}`)
            }
          }}
        />
      )}

      {showFilterButton && onFilterPress && (
        <Button
          size="$3"
          icon={Filter}
          onPress={onFilterPress}
          bg={activeFilterCount > 0 ? '$blue9' : undefined}
          borderColor={activeFilterCount > 0 ? '$blue9' : undefined}
          color={activeFilterCount > 0 ? 'white' : undefined}
          position="relative"
        >
          {activeFilterCount > 0 && (
            <XStack
              position="absolute"
              top={-6}
              right={-6}
              bg="$red9"
              borderRadius="$10"
              minWidth={18}
              height={18}
              ai="center"
              jc="center"
              px="$1"
            >
              <Text fontSize={10} color="white" fontWeight="600">
                {activeFilterCount}
              </Text>
            </XStack>
          )}
        </Button>
      )}

      {showCreateButton && onCreatePress && (
        <Button
          size="$3"
          icon={Plus}
          onPress={onCreatePress}
        />
      )}
    </XStack>
  )
}
