import { Paragraph, ScrollView, Separator, Settings, YStack, isWeb, useMedia, useToastController } from '@my/ui'
import { Book, Cog, Info, Lock, LogOut, Mail, Moon, Trash2 } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { redirect } from 'app/utils/redirect'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePathname } from 'app/utils/usePathname'
import { useLink } from 'solito/link'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { useEffect, useState } from 'react'
import { useUser } from 'app/utils/useUser'


export const SettingsScreen = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { profile } = useUser()

  return (
    <YStack f={1}>
      <ScrollView>
        <Settings>
          <Settings.Items>
            {/* App Preferences */}
            <Settings.Group>
              <SettingsThemeAction />
            </Settings.Group>
            {isWeb && <Separator boc="$color3" mx="$-4" bw="$0.25" />}
            {/* Account Settings */}
            <Settings.Group $gtSm={{ space: '$1' }}>
              <Settings.Item
                icon={Cog}
                isActive={pathname === 'settings/general'}
                {...useLink({ href: media.sm ? '/settings/general' : '/settings' })}
                accentTheme="green"
              >
                {t('settings.general')}
              </Settings.Item>
              <Settings.Item
                icon={Lock}
                isActive={pathname === '/settings/change-password'}
                {...useLink({ href: '/settings/change-password' })}
                accentTheme="green"
              >
                {t('settings.change_password')}
              </Settings.Item>
              <Settings.Item
                icon={Mail}
                isActive={pathname === '/settings/change-email'}
                {...useLink({ href: '/settings/change-email' })}
                accentTheme="green"
              >
                {t('settings.change_email')}
              </Settings.Item>
            </Settings.Group>
            {isWeb && <Separator boc="$color3" mx="$-4" bw="$0.25" />}
            {/* About & Legal */}
            <Settings.Group>
              <Settings.Item
                icon={Book}
                isActive={pathname === '/privacy-policy'}
                {...useLink({ href: '/privacy-policy' })}
                accentTheme="purple"
              >
                {t('settings.privacy_policy')}
              </Settings.Item>
              <Settings.Item
                icon={Book}
                isActive={pathname === '/terms-of-service'}
                {...useLink({ href: '/terms-of-service' })}
                accentTheme="purple"
              >
                {t('settings.terms_of_service')}
              </Settings.Item>
              {/* removing about from web since landing pages are more common on web - feel free to add back if needed */}
              {!isWeb && (
                // isWeb is a constant so this isn't really a conditional hook
                // eslint-disable-next-line react-hooks/rules-of-hooks
                <Settings.Item icon={Info} {...useLink({ href: '/about' })} accentTheme="blue">
                  {t('settings.about')}
                </Settings.Item>
              )}
            </Settings.Group>
            {isWeb && <Separator boc="$color3" mx="$-4" bw="$0.25" />}
            {/* Account Actions */}
            <Settings.Group>
              <SettingsItemDeleteAccountAction />
              <SettingsItemLogoutAction />
            </Settings.Group>
          </Settings.Items>
        </Settings>
      </ScrollView>
    </YStack>
  )
}

const SettingsThemeAction = () => {
  const { toggle, current } = useThemeSetting()
  const { t } = useTranslation()

  const getThemeLabel = (theme: string | undefined) => {
    if (!theme) return t('settings.theme_system')
    return t(`settings.theme_${theme}`)
  }

  return (
    <Settings.Item icon={Moon} accentTheme="blue" onPress={toggle} rightLabel={getThemeLabel(current)}>
      {t('settings.theme')}
    </Settings.Item>
  )
}


const SettingsItemDeleteAccountAction = () => {
  const { t } = useTranslation()

  const handleDeleteAccount = () => {
    Linking.openURL('https://inner-ascend.com/delete-account.html')
  }

  return (
    <Settings.Item icon={Trash2} accentTheme="red" onPress={handleDeleteAccount}>
      {t('settings.delete_account')}
    </Settings.Item>
  )
}

const SettingsItemLogoutAction = () => {
  const supabase = useSupabase()
  const { t } = useTranslation()

  return (
    <Settings.Item icon={LogOut} accentTheme="red" onPress={() => supabase.auth.signOut()}>
      {t('settings.log_out')}
    </Settings.Item>
  )
}
