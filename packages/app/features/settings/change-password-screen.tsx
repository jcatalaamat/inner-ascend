import { H2, SubmitButton, Theme, YStack, isWeb, useToastController, FormWrapper } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

export const ChangePasswordScreen = () => {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const toast = useToastController()
  const router = useRouter()

  const ChangePasswordSchema = z
    .object({
      password: formFields.text.min(6).describe(`${t('settings.new_password')} // ${t('settings.new_password_placeholder')}`),
      passwordConfirm: formFields.text.min(6).describe(`${t('settings.confirm_password')} // ${t('settings.confirm_password_placeholder')}`),
    })
    .superRefine(({ passwordConfirm, password }, ctx) => {
      if (passwordConfirm !== password) {
        ctx.addIssue({
          path: ['passwordConfirm'],
          code: 'custom',
          message: t('settings.passwords_no_match'),
        })
      }
    })

  const handleChangePassword = async ({ password }: z.infer<typeof ChangePasswordSchema>) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.show(error.message)
    } else {
      toast.show(t('settings.successfully_updated'))
      if (!isWeb) {
        router.back()
      }
    }
  }

  return (
    <FormWrapper>
      <SchemaForm
        onSubmit={handleChangePassword}
        schema={ChangePasswordSchema}
        defaultValues={{
          password: '',
          passwordConfirm: '',
        }}
        props={{
          password: {
            secureTextEntry: true,
          },
          passwordConfirm: {
            secureTextEntry: true,
          },
        }}
        renderBefore={() =>
          isWeb && (
            <YStack px="$4" py="$4" pb="$2">
              <H2>{t('settings.change_password')}</H2>
            </YStack>
          )
        }
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>{t('settings.update_password')}</SubmitButton>
          </Theme>
        )}
      />
    </FormWrapper>
  )
}
