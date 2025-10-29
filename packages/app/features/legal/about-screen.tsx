import { H1, Paragraph, Text, YStack, isWeb } from '@my/ui'
import { Link } from 'expo-router'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const AboutScreen = () => {
  const { t } = useTranslation()

  useEffect(() => {
  }, [])
  
  return (
    <ScrollView>
      <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {isWeb && <H1>{t('about.title')}</H1>}
      
      <Paragraph>
        <Text fontWeight="bold">{t('about.welcome')}</Text> {t('about.mission_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('about.mission')}</Text> {t('about.mission_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('about.what_we_offer')}</Text> {t('about.what_we_offer_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('about.community_focus')}</Text> {t('about.community_focus_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('about.get_involved')}</Text> {t('about.get_involved_text')}
      </Paragraph>

      <Paragraph>
        <Text fontWeight="bold">{t('about.contact_us')}</Text> {t('about.contact_us_text')}
      </Paragraph>
      </YStack>
    </ScrollView>
  )
}
