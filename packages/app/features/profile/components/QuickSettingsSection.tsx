import { H5, Settings, YStack, Text } from '@my/ui'
import { Moon, LogOut, Bell, Cog, HelpCircle } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'

interface QuickSettingsSectionProps {
  currentTheme: string | undefined
  onThemeToggle: () => void
  onLogout: () => void
  notificationsLinkProps: any
  settingsLinkProps: any
  openFeedbackSheet: (type: 'support') => void
}

export function QuickSettingsSection({
  currentTheme,
  onThemeToggle,
  onLogout,
  notificationsLinkProps,
  settingsLinkProps,
  openFeedbackSheet,
}: QuickSettingsSectionProps) {
  const { t } = useTranslation()

  const getThemeLabel = (theme: string | undefined) => {
    if (!theme) return t('settings.theme_system')
    return t(`settings.theme_${theme}`)
  }

  return (
    <YStack px="$4" gap="$3" pt="$3">
      <H5>{t('profile.quick_settings')}</H5>
      <Settings>
        <Settings.Items>
          <Settings.Group>
            <Settings.Item
              icon={Moon}
              accentTheme="blue"
              onPress={onThemeToggle}
              rightLabel={getThemeLabel(currentTheme)}
            >
              <Text>{t('settings.theme')}</Text>
            </Settings.Item>
            <Settings.Item icon={Bell} accentTheme="blue" {...notificationsLinkProps}>
              <Text>{t('notifications.title')}</Text>
            </Settings.Item>
            <Settings.Item icon={HelpCircle} accentTheme="orange" onPress={() => openFeedbackSheet('support')}>
              <Text>{t('settings.help_and_support')}</Text>
            </Settings.Item>
            <Settings.Item icon={Cog} accentTheme="green" {...settingsLinkProps}>
              <Text>{t('profile.more_settings')}</Text>
            </Settings.Item>
            <Settings.Item icon={LogOut} accentTheme="red" onPress={onLogout}>
              <Text>{t('profile.logout')}</Text>
            </Settings.Item>
          </Settings.Group>
        </Settings.Items>
      </Settings>
    </YStack>
  )
}
