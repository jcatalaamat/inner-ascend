import { Button, XStack } from '@my/ui'
import { Pencil, Eye, Share2 } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'

interface ProfileActionButtonsProps {
  onEditPress: () => void
  onViewPublicPress: () => void
  onSharePress: () => void
}

export function ProfileActionButtons({
  onEditPress,
  onViewPublicPress,
  onSharePress,
}: ProfileActionButtonsProps) {
  const { t } = useTranslation()

  return (
    <XStack px="$4" pt="$4" gap="$2">
      <Button size="$3" icon={<Pencil size={16} />} onPress={onEditPress} f={1}>
        <Button.Text>{t('profile.edit_profile_button')}</Button.Text>
      </Button>
      <Button size="$3" variant="outlined" icon={<Eye size={16} />} onPress={onViewPublicPress} f={1}>
        <Button.Text>{t('profile.view_public_profile')}</Button.Text>
      </Button>
      <Button size="$3" variant="outlined" icon={<Share2 size={16} />} onPress={onSharePress}>
        <Button.Text>{t('profile.share_my_profile')}</Button.Text>
      </Button>
    </XStack>
  )
}
