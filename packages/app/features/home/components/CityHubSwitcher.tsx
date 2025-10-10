import { Text, XStack, YStack } from '@my/ui'
import { useTranslation } from 'react-i18next'
import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { useCity } from 'app/contexts/CityContext'

// Gradient colors for each city
const CITY_GRADIENTS: Record<string, string[]> = {
  'mazunte': ['#667eea', '#764ba2'],
  'puerto-escondido': ['#f093fb', '#f5576c'],
  'tulum': ['#4facfe', '#00f2fe'],
  'playa-del-carmen': ['#43e97b', '#38f9d7'],
}

// Short display names
const CITY_SHORT_NAMES: Record<string, { en: string; es: string }> = {
  'mazunte': { en: 'Mazunte', es: 'Mazunte' },
  'puerto-escondido': { en: 'Puerto', es: 'Puerto' },
  'tulum': { en: 'Tulum', es: 'Tulum' },
  'playa-del-carmen': { en: 'Playa', es: 'Playa' },
}

export const CityHubSwitcher = () => {
  const { i18n } = useTranslation()
  const { selectedCity, setSelectedCity } = useCity()
  const isEnabled = useFeatureFlag('enable-city-hub-switcher')
  const posthog = usePostHog()

  if (!isEnabled) return null

  // Hardcoded cities for now - can fetch from Supabase later
  const cities = [
    { id: 'mazunte', emoji: '🌊', isActive: true },
    { id: 'puerto-escondido', emoji: '🏄', isActive: false },
    { id: 'tulum', emoji: '🏛️', isActive: false },
    { id: 'playa-del-carmen', emoji: '🏖️', isActive: false },
  ]

  return (
    <XStack gap="$2.5" px="$4" mb="$3" mt="$2">
      {cities.map((city) => {
        const isSelected = city.id === selectedCity
        const cityName =
          i18n.language === 'es'
            ? CITY_SHORT_NAMES[city.id]?.es
            : CITY_SHORT_NAMES[city.id]?.en
        const colors = CITY_GRADIENTS[city.id] || ['#667eea', '#764ba2']

        return (
          <YStack
            key={city.id}
            f={1}
            height={56}
            borderRadius="$4"
            position="relative"
            overflow="hidden"
            pressStyle={{ scale: 0.97 }}
            cursor="pointer"
            onPress={() => {
              if (city.isActive) {
                posthog?.capture('city_switched', {
                  from_city: selectedCity,
                  to_city: city.id
                })
              }
              setSelectedCity(city.id)
            }}
            opacity={!city.isActive ? 0.5 : isSelected ? 1 : 0.85}
            animation="quick"
          >
            <LinearGradient
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              colors={colors}
              start={[0, 0]}
              end={[1, 1]}
            />

            {!city.isActive && (
              <YStack
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                backgroundColor="rgba(0,0,0,0.3)"
              />
            )}

            <YStack f={1} ai="center" jc="center">
              <Text fontSize={20} mb="$1">
                {city.emoji}
              </Text>
              <Text
                fontSize="$2"
                color="white"
                fontWeight="700"
                numberOfLines={1}
                textAlign="center"
              >
                {cityName}
              </Text>
            </YStack>

            {isSelected && (
              <YStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height={3}
                bg="white"
              />
            )}
          </YStack>
        )
      })}
    </XStack>
  )
}
