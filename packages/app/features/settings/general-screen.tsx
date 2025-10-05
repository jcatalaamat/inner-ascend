import { FormWrapper, H2, H4, KVTable, Separator, SizableText, YStack, isWeb, styled } from '@my/ui'
import { useUser } from 'app/utils/useUser'
import { Link } from 'solito/link'
import { useTranslation } from 'react-i18next'

export const GeneralSettingsScreen = () => {
  const { t } = useTranslation()
  const { user, profile } = useUser()

  return (
    <FormWrapper>
      {isWeb && (
        <YStack px="$4" py="$4" pb="$2">
          <H2>{t('settings.general')}</H2>
        </YStack>
      )}
      <FormWrapper.Body mt="$2" gap="$10">
        <Section>
          <KVTable>
            <YStack gap="$4">
              <H4>{t('settings.profile_data')}</H4>
              <Separator />
            </YStack>
            <KVTable.Row>
              <KVTable.Key>
                <SizableText fow="900">{t('settings.name')}</SizableText>
              </KVTable.Key>
              <KVTable.Value gap="$4">
                <SizableText>{profile?.name}</SizableText>
                <Link href="/profile/edit">
                  <SizableText textDecorationLine="underline">{t('settings.change')}</SizableText>
                </Link>
              </KVTable.Value>
            </KVTable.Row>
          </KVTable>
        </Section>

        <Section>
          <KVTable>
            <YStack gap="$4">
              <H4>{t('settings.account_data')}</H4>
              <Separator />
            </YStack>
            <KVTable.Row>
              <KVTable.Key>
                <SizableText fow="900">{t('settings.email')}</SizableText>
              </KVTable.Key>
              <KVTable.Value gap="$4">
                <SizableText>{user?.email}</SizableText>
                <Link href="/settings/change-email">
                  <SizableText textDecorationLine="underline">{t('settings.change')}</SizableText>
                </Link>
              </KVTable.Value>
            </KVTable.Row>

            <KVTable.Row>
              <KVTable.Key>
                <SizableText fow="900">{t('settings.user_id')}</SizableText>
              </KVTable.Key>
              <KVTable.Value>
                <SizableText>{user?.id}</SizableText>
              </KVTable.Value>
            </KVTable.Row>
          </KVTable>
        </Section>

      </FormWrapper.Body>
    </FormWrapper>
  )
}

const Section = styled(YStack, {
  boc: '$borderColor',
  bw: 1,
  p: '$4',
  br: '$4',
})
