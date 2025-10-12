import { Button, XStack, YStack } from '@my/ui'
import { useTranslation } from 'react-i18next'
import type { ViewMode } from './types'

interface CreatorModeToggleProps {
  viewMode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export function CreatorModeToggle({ viewMode, onModeChange }: CreatorModeToggleProps) {
  const { t } = useTranslation()

  return (
    <YStack px="$4" py="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
      <XStack w="100%" bg="$color3" borderRadius="$3" p="$1" gap="$1">
        <Button
          size="$3"
          theme={viewMode === 'personal' ? 'blue' : undefined}
          chromeless={viewMode !== 'personal'}
          onPress={() => onModeChange('personal')}
          f={1}
          borderRadius="$2"
        >
          <Button.Text fontWeight={viewMode === 'personal' ? '600' : '400'}>
            {t('profile.personal_view')}
          </Button.Text>
        </Button>
        <Button
          size="$3"
          theme={viewMode === 'creator' ? 'blue' : undefined}
          chromeless={viewMode !== 'creator'}
          onPress={() => onModeChange('creator')}
          f={1}
          borderRadius="$2"
        >
          <Button.Text fontWeight={viewMode === 'creator' ? '600' : '400'}>
            {t('profile.creator_view')}
          </Button.Text>
        </Button>
      </XStack>
    </YStack>
  )
}
