import { H1, Paragraph, YStack, isWeb, Text } from '@my/ui'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'

export const PrivacyPolicyScreen = () => {
  const { t } = useTranslation()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('privacy_policy_viewed')
  }, [posthog])
  
  return (
    <ScrollView>
      <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {isWeb && <H1>{t('privacy_policy.title')}</H1>}
      <Paragraph>
        {t('privacy_policy.intro')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('privacy_policy.information_we_collect')}</Text> {t('privacy_policy.information_we_collect_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('privacy_policy.how_we_use')}</Text> {t('privacy_policy.how_we_use_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('privacy_policy.data_security')}</Text> {t('privacy_policy.data_security_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('privacy_policy.your_rights')}</Text> {t('privacy_policy.your_rights_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('privacy_policy.changes_to_policy')}</Text> {t('privacy_policy.changes_to_policy_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('privacy_policy.contact_us')}</Text> {t('privacy_policy.contact_us_text')}
      </Paragraph>
      </YStack>
    </ScrollView>
  )
}
