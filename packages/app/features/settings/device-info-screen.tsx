import { Paragraph, ScrollView, Separator, Settings, YStack, isWeb, useMedia } from '@my/ui'
import { Book, Copy, Info, Smartphone } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { Platform, Alert, Clipboard } from 'react-native'
import { useLanguage } from 'app/contexts/LanguageContext'
import { useUser } from 'app/utils/useUser'
import { useState } from 'react'
import { ScreenWrapper } from 'app/components/ScreenWrapper'

export const DeviceInfoScreen = () => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const { profile } = useUser()
  const posthog = usePostHog()
  const [copied, setCopied] = useState(false)

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
    language: currentLanguage,
    userId: profile?.id || 'Not logged in',
    userEmail: profile?.email || 'Not logged in',
    posthogDistinctId: getPostHogId(),
    timestamp: new Date().toISOString(),
  }

  const copyDeviceInfo = async () => {
    const infoText = `Device Information for Mazunte Connect:

App: ${deviceInfo.appName} v${deviceInfo.appVersion}
Platform: ${deviceInfo.platform} ${deviceInfo.platformVersion}
Language: ${deviceInfo.language}
User ID: ${deviceInfo.userId}
User Email: ${deviceInfo.userEmail}
PostHog ID: ${deviceInfo.posthogDistinctId}
Timestamp: ${deviceInfo.timestamp}

Please include this information when reporting bugs or issues.`

    try {
      Clipboard.setString(infoText)
      setCopied(true)
      Alert.alert('Copied!', 'Device information copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      Alert.alert('Error', 'Failed to copy device information')
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
                rightLabel={copied ? 'Copied!' : 'Copy All'}
              >
                Copy Device Information
              </Settings.Item>
            </Settings.Group>
            
            <Separator boc="$color3" mx="$-4" bw="$0.25" />
            
            <Settings.Group>
              <Settings.Item icon={Info} accentTheme="gray">
                App Version: {deviceInfo.appVersion}
              </Settings.Item>
              <Settings.Item icon={Info} accentTheme="gray">
                Platform: {deviceInfo.platform} {deviceInfo.platformVersion}
              </Settings.Item>
              <Settings.Item icon={Book} accentTheme="gray">
                Language: {deviceInfo.language}
              </Settings.Item>
              <Settings.Item icon={Info} accentTheme="gray">
                User ID: {deviceInfo.userId}
              </Settings.Item>
              <Settings.Item icon={Info} accentTheme="gray">
                PostHog ID: {deviceInfo.posthogDistinctId}
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
