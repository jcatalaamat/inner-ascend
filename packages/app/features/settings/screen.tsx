import { Paragraph, ScrollView, Separator, Settings, YStack, isWeb, useMedia } from '@my/ui'
import { Book, Cog, Info, Lock, LogOut, Mail, Moon, Smartphone, Twitter } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { redirect } from 'app/utils/redirect'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePathname } from 'app/utils/usePathname'
import { useLink } from 'solito/link'
import { LanguageSwitcher } from 'app/components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'


export const SettingsScreen = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <YStack f={1}>
      <ScrollView>
        <Settings>
          <Settings.Items>
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
                      <Settings.Item icon={Smartphone} {...useLink({ href: '/settings/device-info' })} accentTheme="purple">
                        {t('settings.device_information')}
                      </Settings.Item>
            </Settings.Group>
            {isWeb && <Separator boc="$color3" mx="$-4" bw="$0.25" />}
            <Settings.Group>
              {/* <Settings.Item
                icon={Twitter}
                onPress={() => redirect('https://twitter.com/tamagui_js')}
                accentTheme="blue"
              >
                Our Twitter
              </Settings.Item> */}
            </Settings.Group>
            {isWeb && <Separator boc="$color3" mx="$-4" bw="$0.25" />}
            <Settings.Group>
              <SettingsThemeAction />
              <LanguageSwitcher />
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

  return (
    <Settings.Item icon={Moon} accentTheme="blue" onPress={toggle} rightLabel={current}>
      {t('settings.theme')}
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
