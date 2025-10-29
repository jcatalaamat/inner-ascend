import {
  Fieldset,
  FormWrapper,
  H2,
  Input,
  Label,
  SubmitButton,
  Theme,
  YStack,
  isWeb,
  useToastController,
} from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { useRouter } from 'solito/router'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const ChangeEmailScreen = () => {
  const { t } = useTranslation()
  const { user } = useUser()
  const supabase = useSupabase()
  const toast = useToastController()
  const router = useRouter()

  useEffect(() => {
  }, [])
  
  const ChangeEmailSchema = z.object({
    email: formFields.text.email().describe(`${t('settings.new_email')} // ${t('settings.new_email_placeholder')}`),
  })

  const handleChangePassword = async ({ email }: z.infer<typeof ChangeEmailSchema>) => {
    const { data, error } = await supabase.auth.updateUser({ email })
    if (error) {
      toast.show(error.message)
    } else {
      toast.show(t('settings.check_inbox'), {
        message: `${t('settings.confirmation_email_sent')} ${data.user.new_email}.`,
      })
      router.back()
      if (!isWeb) {
        await supabase.auth.refreshSession()
      }
    }
  }

  return (
    <FormWrapper>
      <SchemaForm
        onSubmit={handleChangePassword}
        schema={ChangeEmailSchema}
        renderBefore={() =>
          isWeb && (
            <YStack px="$4" py="$4" pb="$2">
              <H2>{t('settings.change_email')}</H2>
            </YStack>
          )
        }
        defaultValues={{
          email: '',
        }}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>{t('settings.update_email')}</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <>
            <Fieldset>
              <Label theme="alt1" size="$3" htmlFor="current-email">
                {t('settings.current_email')}
              </Label>
              <Input
                keyboardType="email-address"
                disabled
                o={0.8}
                cur="not-allowed"
                id="current-email"
                autoComplete="email"
                value={user?.email || '*****@******.***'}
                inputMode="email"
                autoCapitalize="none"
              />
            </Fieldset>
            {Object.values(fields)}
          </>
        )}
      </SchemaForm>
    </FormWrapper>
  )
}
