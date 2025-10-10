import { Paragraph, ScrollView, Separator, Settings, YStack, isWeb, useMedia, useToastController } from '@my/ui'
import { Book, Cog, Info, Lock, LogOut, Mail, Moon, Smartphone, Twitter, MessageCircle, Instagram, HelpCircle, Trash2, MessageSquarePlus } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { redirect } from 'app/utils/redirect'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePathname } from 'app/utils/usePathname'
import { useLink } from 'solito/link'
import { LanguageSwitcher } from 'app/components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'
import * as Sentry from '@sentry/react-native'


export const SettingsScreen = () => {
  const media = useMedia()
  const pathname = usePathname()
  const { t } = useTranslation()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('settings_screen_viewed')
  }, [posthog])

  return (
    <YStack f={1}>
      <ScrollView>
        <Settings>
          <Settings.Items>
            {/* App Preferences */}
            <Settings.Group>
              <SettingsThemeAction />
              <LanguageSwitcher />
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
            {/* Help & Support */}
            <Settings.Group>
              <SettingsHelpSupportItems />
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
              <Settings.Item icon={Smartphone} {...useLink({ href: '/settings/device-info' })} accentTheme="purple">
                {t('settings.device_information')}
              </Settings.Item>
            </Settings.Group>
            {isWeb && <Separator boc="$color3" mx="$-4" bw="$0.25" />}
            {/* Account Actions */}
            <Settings.Group>
              <SettingsDeleteAccountAction />
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


const SettingsHelpSupportItems = () => {
  const { t } = useTranslation()
  const toast = useToastController()

  const handleContactPress = async (url: string, fallbackMessage: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        await Linking.openURL(url)
      } else {
        toast.show(fallbackMessage, { duration: 5000 })
      }
    } catch (error) {
      toast.show(fallbackMessage, { duration: 5000 })
    }
  }

  const handleWhatsAppPress = () => {
    handleContactPress(
      'https://wa.me/34611144170?text=Hi!%20I%27d%20like%20to%20share%20feedback%20about%20Mazunte%20Connect',
      t('settings.contact_unavailable_whatsapp')
    )
  }

  const handleInstagramPress = () => {
    handleContactPress(
      'https://instagram.com/astralintegration',
      t('settings.contact_unavailable_instagram')
    )
  }

  const handleEmailPress = () => {
    handleContactPress(
      'mailto:hello@mazunteconnect.com?subject=Mazunte%20Connect%20-%20Feedback',
      t('settings.contact_unavailable_email')
    )
  }

  const handleSupportPress = () => {
    handleContactPress(
      'mailto:hello@mazunteconnect.com?subject=Mazunte%20Connect%20-%20Support%20Request',
      t('settings.contact_unavailable_email')
    )
  }

  const handleFeedbackPress = async () => {
    // For now, use email as it's the most reliable method
    // Future: could add a custom in-app form with Supabase storage
    const subject = 'Mazunte%20Connect%20-%20Feedback%20/%20Feature%20Request'
    const body = 'Please%20share%20your%20feedback%20or%20feature%20requests%20below:%0D%0A%0D%0A'

    handleContactPress(
      `mailto:hello@mazunteconnect.com?subject=${subject}&body=${body}`,
      t('settings.contact_unavailable_email')
    )
  }

  return (
    <>
      <Settings.Item icon={MessageSquarePlus} onPress={handleFeedbackPress} accentTheme="orange">
        {t('settings.send_feedback')}
      </Settings.Item>
      <Settings.Item icon={MessageCircle} onPress={handleWhatsAppPress} accentTheme="green">
        {t('settings.contact_whatsapp')}
      </Settings.Item>
      <Settings.Item icon={Instagram} onPress={handleInstagramPress} accentTheme="purple">
        {t('settings.contact_instagram')}
      </Settings.Item>
      <Settings.Item icon={Mail} onPress={handleEmailPress} accentTheme="blue">
        {t('settings.contact_email')}
      </Settings.Item>
      <Settings.Item icon={HelpCircle} onPress={handleSupportPress} accentTheme="blue">
        {t('settings.contact_support')}
      </Settings.Item>
    </>
  )
}

const SettingsDeleteAccountAction = () => {
  const { t } = useTranslation()
  const toast = useToastController()
  const supabase = useSupabase()

  const handleDeleteAccountPress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userEmail = user?.email || 'unknown'
      const userId = user?.id || 'unknown'

      const emailBody = `I would like to request deletion of my account.%0D%0A%0D%0AUser Email: ${userEmail}%0D%0AUser ID: ${userId}`
      const url = `mailto:hello@mazunteconnect.com?subject=Account%20Deletion%20Request&body=${emailBody}`

      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        await Linking.openURL(url)
      } else {
        toast.show(t('settings.contact_unavailable_email'), { duration: 5000 })
      }
    } catch (error) {
      toast.show(t('settings.contact_unavailable_email'), { duration: 5000 })
    }
  }

  return (
    <Settings.Item icon={Trash2} accentTheme="red" onPress={handleDeleteAccountPress}>
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
