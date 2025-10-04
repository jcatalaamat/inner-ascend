import { Search, X, Map } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Input, XStack } from 'tamagui'
import { router } from 'expo-router'

export type SearchBarProps = {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  showMapButton?: boolean
  onMapPress?: () => void
  mapViewType?: 'events' | 'places' | 'both'
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  defaultValue = '',
  showMapButton = false,
  onMapPress,
  mapViewType = 'both'
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
    </XStack>
  )
}
