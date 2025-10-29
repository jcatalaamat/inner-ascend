import { Button, FormWrapper, H2, Paragraph, SubmitButton, Text, Theme, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useEffect } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { createParam } from 'solito'
import { Link } from 'solito/link'
import { z } from 'zod'

const { useParams, useUpdateParams } = createParam<{ email?: string }>()

const ResetPasswordSchema = z.object({
  email: formFields.text.email().describe('Email // your@email.acme'),
})

export const ResetPasswordScreen = () => {
  const supabase = useSupabase()
  const { params } = useParams()
  const updateParams = useUpdateParams()

  useEffect(() => {
    if (params?.email) {
      updateParams({ email: undefined }, { web: { replace: true } })
    }
  }, [params?.email, updateParams])

  const form = useForm<z.infer<typeof ResetPasswordSchema>>()

  async function resetPassword({ email }: z.infer<typeof ResetPasswordSchema>) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('email')) {
        form.setError('email', { type: 'custom', message: errorMessage })
      } else {
        form.setError('email', { type: 'custom', message: errorMessage })
      }
    }
  }

  return (
    <FormProvider {...form}>
      {form.formState.isSubmitSuccessful ? (
        <CheckYourEmail />
      ) : (
        <ResetPasswordForm onSubmit={form.handleSubmit(resetPassword)} />
      )}
    </FormProvider>
  )
}

function CheckYourEmail() {
  return (
    <Theme name="blue">
      <FormWrapper width={400}>
        <Link href="/sign-in">
          <Button unstyled marginBottom="$2" flexDirection="row">
            <ChevronLeft color="$color" />
            <Text color="$color">Back</Text>
          </Button>
        </Link>
        <YStack space="$4" margin="$0">
          <H2>Check Your Email</H2>
          <Paragraph theme="alt1">We sent you a password reset link.</Paragraph>
          <Link href="/sign-in">
            <Button width="100%">Go to Sign In</Button>
          </Link>
        </YStack>
      </FormWrapper>
    </Theme>
  )
}

function ResetPasswordForm({ onSubmit }: { onSubmit: () => void }) {
  const email = useWatch({ name: 'email' })
  return (
    <Theme name="blue">
      <FormWrapper width={400}>
        <Link href="/sign-in">
          <Button unstyled marginBottom="$2" flexDirection="row">
            <ChevronLeft color="$color" />
            <Text color="$color">Back</Text>
          </Button>
        </Link>
        <YStack space="$4" margin="$0">
          <H2>Reset Password</H2>
          <Paragraph theme="alt1">
            Enter the email associated with your account and we'll send you a link to reset your
            password
          </Paragraph>
          <SchemaForm schema={ResetPasswordSchema} defaultValues={{ email }} props={{}} />
          <SubmitButton onPress={onSubmit}>Reset Password</SubmitButton>
        </YStack>
      </FormWrapper>
    </Theme>
  )
}
