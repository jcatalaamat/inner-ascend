import { Paragraph, ScrollView, Separator, Settings, YStack, isWeb, useMedia } from '@my/ui'
import { Book, Copy, Info, Smartphone } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { Platform, Alert, Clipboard } from 'react-native'
import { useLanguage } from 'app/contexts/LanguageContext'
import { useUser } from 'app/utils/useUser'
import { useState, useEffect } from 'react'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import * as Device from 'expo-device'

export const DeviceInfoScreen = () => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const { profile } = useUser()
  const posthog = usePostHog()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    posthog?.capture('settings_device_info_viewed')
  }, [posthog])

  // Get PostHog distinct ID
  const getPostHogId = () => {
    try {
      // PostHog React Native API methods
      if (posthog?.getDistinctId) {
        return posthog.getDistinctId()
      }
      if (posthog?.distinctId) {
        return posthog.distinctId
      }
      if (posthog?.get_distinct_id) {
        return posthog.get_distinct_id()
      }
      if (posthog?.distinct_id) {
        return posthog.distinct_id
      }
      // Try to get from person properties
      if (posthog?.getPersonProperties) {
        const props = posthog.getPersonProperties()
        return props?.distinct_id || props?.$distinct_id || 'Not available'
      }
      return 'Not available'
    } catch (error) {
      console.log('PostHog ID error:', error)
      return 'Not available'
    }
  }

  const deviceInfo = {
    appName: 'Mazunte Connect',
    appVersion: '1.0.1',
    platform: Platform.OS,
    platformVersion: Platform.Version,
    deviceName: Device.deviceName || 'Unknown',
    deviceModel: Device.modelName || 'Unknown',
    deviceBrand: Device.brand || 'Unknown',
    deviceType: Device.deviceType || 'Unknown',
    deviceYear: Device.deviceYearClass || 'Unknown',
    isDevice: Device.isDevice,
    language: currentLanguage,
    userId: profile?.id || 'Not logged in',
    userEmail: profile?.email || 'Not logged in',
    posthogDistinctId: getPostHogId(),
    timestamp: new Date().toISOString(),
  }

  const copyDeviceInfo = async () => {
    const infoText = `${t('device_info.title')} - Mazunte Connect:

${t('device_info.app_version')}: ${deviceInfo.appName} v${deviceInfo.appVersion}
${t('device_info.platform')}: ${deviceInfo.platform} ${deviceInfo.platformVersion}
${t('device_info.device')}: ${deviceInfo.deviceName} (${deviceInfo.deviceModel})
${t('device_info.brand')}: ${deviceInfo.deviceBrand}
${t('device_info.language')}: ${deviceInfo.language}
${t('device_info.user_id')}: ${deviceInfo.userId}
${t('device_info.posthog_id')}: ${deviceInfo.posthogDistinctId}
Timestamp: ${deviceInfo.timestamp}

Please include this information when reporting bugs or issues.`

    try {
      Clipboard.setString(infoText)
      setCopied(true)
      Alert.alert(t('device_info.copied'), t('device_info.copy_success'))
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      Alert.alert(t('common.error'), t('device_info.copy_error'))
    }
  }

  return (
    <ScreenWrapper>
      <ScrollView>
        <Settings>
          <Settings.Items>
            <Settings.Group>
              <Settings.Item
                icon={Smartphone}
                accentTheme="blue"
                onPress={copyDeviceInfo}
                rightLabel={copied ? t('device_info.copied') : t('device_info.copy_all')}
              >
                {t('device_info.title')}
              </Settings.Item>
            </Settings.Group>
            
            <Separator boc="$color3" mx="$-4" bw="$0.25" />
            
            <Settings.Group>
              <Settings.Item icon={Info} accentTheme="gray">
                {t('device_info.app_version')}: {deviceInfo.appVersion}
              </Settings.Item>
              <Settings.Item icon={Smartphone} accentTheme="gray">
                {t('device_info.device')}: {deviceInfo.deviceName} ({deviceInfo.deviceModel})
              </Settings.Item>
              <Settings.Item icon={Info} accentTheme="gray">
                {t('device_info.platform')}: {deviceInfo.platform} {deviceInfo.platformVersion}
              </Settings.Item>
              <Settings.Item icon={Book} accentTheme="gray">
                {t('device_info.language')}: {deviceInfo.language}
              </Settings.Item>
              <Settings.Item icon={Smartphone} accentTheme="gray">
                {t('device_info.brand')}: {deviceInfo.deviceBrand}
              </Settings.Item>
              <Settings.Item icon={Info} accentTheme="gray">
                {t('device_info.user_id')}: {deviceInfo.userId}
              </Settings.Item>
              <Settings.Item icon={Info} accentTheme="gray">
                {t('device_info.posthog_id')}: {deviceInfo.posthogDistinctId}
              </Settings.Item>
            </Settings.Group>
          </Settings.Items>
        </Settings>
      </ScrollView>
      
      <Paragraph py="$2" ta="center" theme="alt2">
        {deviceInfo.appName} {deviceInfo.appVersion}
      </Paragraph>
    </ScreenWrapper>
  )
}
