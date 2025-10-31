import {
  FormWrapper,
  H2,
  LoadingOverlay,
  Paragraph,
  SubmitButton,
  Text,
  Theme,
  YStack,
  isWeb,
} from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { createParam } from 'solito'
import { Link } from 'solito/link'
import { useRouter } from 'solito/router'
import { z } from 'zod'

import { SocialLogin } from './components/SocialLogin'

const { useParams, useUpdateParams } = createParam<{ email?: string }>()

const SignInSchema = z.object({
  email: formFields.text.email().describe('Email // Enter your email'),
  password: formFields.text.min(6).describe('Password // Enter your password'),
})

export const SignInScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { params } = useParams()
  const updateParams = useUpdateParams()
  useRedirectAfterSignIn()
  const { isLoadingSession } = useUser()

  useEffect(() => {
    // remove the persisted email from the url, mostly to not leak user's email in case they share it
    if (params?.email) {
      updateParams({ email: undefined }, { web: { replace: true } })
    }
  }, [params?.email, updateParams])
  const form = useForm<z.infer<typeof SignInSchema>>()

  async function signInWithEmail({ email, password }: z.infer<typeof SignInSchema>) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('email')) {
        form.setError('email', { type: 'custom', message: errorMessage })
      } else if (errorMessage.includes('password')) {
        form.setError('password', { type: 'custom', message: errorMessage })
      } else {
        form.setError('password', { type: 'custom', message: errorMessage })
      }
    } else {
      router.replace('/')
    }
  }

  return (
    <FormWrapper>
        <FormProvider {...form}>
          <SchemaForm
            form={form}
            schema={SignInSchema}
            defaultValues={{
              email: params?.email || '',
              password: '',
            }}
            onSubmit={signInWithEmail}
            props={{
              email: {
                size: '$5',
              },
              password: {
                afterElement: <ForgotPasswordLink />,
                secureTextEntry: true,
                size: '$5',
              },
            }}
            renderAfter={({ submit }) => {
              return (
                <>
                  <Theme inverse>
                    <SubmitButton onPress={() => submit()} br="$12" h={56}>
                      Sign in with email
                    </SubmitButton>
                  </Theme>
                  <SignUpLink />
                </>
              )
            }}
          >
            {(fields) => (
              <>
                <YStack gap="$3" mb="$4">
                  <H2 $sm={{ size: '$9' }} size="$10">Welcome back to Inner Ascend</H2>
                  <Paragraph theme="alt1" size="$5">Continue your journey</Paragraph>
                </YStack>

                {/* Social login first - primary method */}
                <YStack mb="$4">
                  <SocialLogin />
                </YStack>

                {/* "or" divider */}
                <YStack ai="center" jc="center" mb="$4">
                  <Paragraph theme="alt2" size="$2" tt="lowercase">or</Paragraph>
                </YStack>

                {/* Email/password fields */}
                {Object.values(fields)}
              </>
            )}
          </SchemaForm>
          {/* this is displayed when the session is being updated - usually when the user is redirected back from an auth provider */}
          {isLoadingSession && <LoadingOverlay />}
        </FormProvider>
      </FormWrapper>
  )
}

const SignUpLink = () => {
  const email = useWatch<z.infer<typeof SignInSchema>>({ name: 'email' })
  return (
    <Link href={`/sign-up?${new URLSearchParams(email ? { email } : undefined).toString()}`}>
      <Paragraph ta="center" theme="alt1" mt="$3">
        New to Inner Ascend? <Text textDecorationLine="underline">Start your journey →</Text>
      </Paragraph>
    </Link>
  )
}

const ForgotPasswordLink = () => {
  const email = useWatch<z.infer<typeof SignInSchema>>({ name: 'email' })

  return (
    <Link href={`/reset-password${email ? `?${new URLSearchParams({ email })}` : ''}`}>
      <Paragraph mt="$1" theme="alt2" textDecorationLine="underline">
        Forgot your password?
      </Paragraph>
    </Link>
  )
}

// we use this hook here because this is the page we redirect unauthenticated users to
// if they authenticate on this page, this will redirect them to the home page
function useRedirectAfterSignIn() {
  const supabase = useSupabase()
  const router = useRouter()
  useEffect(() => {
    const signOutListener = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/')
      }
    })
    return () => {
      signOutListener.data.subscription.unsubscribe()
    }
  }, [supabase, router])
}
