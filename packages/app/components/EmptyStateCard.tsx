import { YStack, Text, Button } from '@my/ui'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from '@tamagui/lucide-icons'

interface EmptyStateCardProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Consistent empty state component for profile sections
 */
export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <YStack
      ai="center"
      jc="center"
      py="$8"
      px="$4"
      gap="$3"
      bg="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      borderStyle="dashed"
    >
      {Icon && (
        <YStack
          w={64}
          h={64}
          borderRadius="$10"
          bg="$color4"
          ai="center"
          jc="center"
          mb="$2"
        >
          <Icon size={32} color="$color10" />
        </YStack>
      )}
      <Text fontSize="$5" fontWeight="600" color="$color11" ta="center">
        {title}
      </Text>
      {description && (
        <Text fontSize="$3" color="$color10" ta="center" maxWidth={300}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button size="$3" theme="blue" onPress={onAction} mt="$2">
          {actionLabel}
        </Button>
      )}
    </YStack>
  )
}
