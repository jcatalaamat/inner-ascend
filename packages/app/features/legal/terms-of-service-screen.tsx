import { H1, Paragraph, YStack, isWeb, Text } from '@my/ui'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'

export const TermsOfServiceScreen = () => {
  const { t } = useTranslation()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('terms_of_service_viewed')
  }, [posthog])
  
  return (
    <ScrollView>
      <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {isWeb && <H1>{t('terms_of_service.title')}</H1>}
      <Paragraph>
        {t('terms_of_service.intro')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.acceptable_use')}</Text> {t('terms_of_service.acceptable_use_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.user_content')}</Text> {t('terms_of_service.user_content_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.community_guidelines')}</Text> {t('terms_of_service.community_guidelines_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.privacy_and_data')}</Text> {t('terms_of_service.privacy_and_data_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.limitation_of_liability')}</Text> {t('terms_of_service.limitation_of_liability_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.termination')}</Text> {t('terms_of_service.termination_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('terms_of_service.contact_information')}</Text> {t('terms_of_service.contact_information_text')}
      </Paragraph>
      </YStack>
    </ScrollView>
  )
}
