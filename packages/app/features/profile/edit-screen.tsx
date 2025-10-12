import {
  Avatar,
  Button,
  EventCard,
  FormWrapper,
  FullscreenSpinner,
  H5,
  PlaceCard,
  SubmitButton,
  Text,
  Theme,
  View,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { createParam } from 'solito'
import { SolitoImage } from 'solito/image'
import { useRouter } from 'solito/router'
import { z } from 'zod'
import { FlatList, Alert } from 'react-native'
import { router } from 'expo-router'
import { useFavoritesQuery } from 'app/utils/react-query/useFavoritesQuery'
import { useTranslation } from 'react-i18next'
import { Cog } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'

import { api } from '../../utils/api'
import { UploadAvatar } from '../settings/components/upload-avatar'

const { useParams } = createParam<{ edit_name?: '1'; edit_about?: '1' }>()
export const EditProfileScreen = () => {
  const { profile, user } = useUser()

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }
  return (
    <EditProfileForm
      userId={user.id}
      initial={{
        name: profile.name,
        about: profile.about,
        location: profile.location,
        social_instagram: profile.social_instagram,
        social_website: profile.social_website,
        social_whatsapp: profile.social_whatsapp,
        show_contact_on_profile: profile.show_contact_on_profile,
      }}
    />
  )
}

const EditProfileForm = ({
  initial,
  userId,
}: {
  initial: {
    name: string | null
    about: string | null
    location: string | null
    social_instagram: string | null
    social_website: string | null
    social_whatsapp: string | null
    show_contact_on_profile: boolean | null
  }
  userId: string
}) => {
  const { params } = useParams()
  const supabase = useSupabase()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const solitoRouter = useRouter()
  const apiUtils = api.useUtils()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('profile_edit_viewed')
  }, [posthog])

  const ProfileSchema = z.object({
    name: formFields.text.describe(`${t('profile.name')} // ${t('profile.name_placeholder')}`),
    about: formFields.textarea.describe(`${t('profile.about')} // ${t('profile.about_placeholder')}`),
    location: formFields.text.optional().describe(`${t('profile.location')} // ${t('profile.location_placeholder')}`),
    social_instagram: formFields.text.optional().describe(`${t('profile.instagram_handle')} // ${t('profile.instagram_placeholder')}`),
    social_website: formFields.text.optional().describe(`${t('profile.website_url')} // ${t('profile.website_placeholder')}`),
    social_whatsapp: formFields.text.optional().describe(`${t('profile.whatsapp_number')} // ${t('profile.whatsapp_placeholder')}`),
    show_contact_on_profile: formFields.boolean_checkbox.optional().describe(`${t('profile.show_contact_on_profile')}`),
  })
  const mutation = useMutation({
    async mutationFn(data: z.infer<typeof ProfileSchema>) {
      await supabase
        .from('profiles')
        .update({
          name: data.name,
          about: data.about,
          location: data.location || null,
          social_instagram: data.social_instagram || null,
          social_website: data.social_website || null,
          social_whatsapp: data.social_whatsapp || null,
          show_contact_on_profile: data.show_contact_on_profile || false,
        })
        .eq('id', userId)
    },

    async onSuccess() {
      toast.show(t('profile.update_success'))
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] })
      await apiUtils.greeting.invalidate()
      solitoRouter.back()
    },
  })

  // Fetch favorites
  const { data: favorites = [] } = useFavoritesQuery(userId)
  const favoriteEvents = favorites
    .filter((fav) => fav.item_type === 'event' && fav.item)
    .map((fav) => fav.item)
  const favoritePlaces = favorites
    .filter((fav) => fav.item_type === 'place' && fav.item)
    .map((fav) => fav.item)

  const handleLogout = async () => {
    Alert.alert(t('profile.logout'), t('profile.logout_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          router.replace('/')
        },
      },
    ])
  }
  const handleSettings = () => {
    router.push('/settings')
  }

  return (
    <FormWrapper>
      <FormWrapper.Body>
        <YStack gap="$4">
          {/* Avatar */}
          <YStack ai="center" jc="center">
            <UploadAvatar>
              <UserAvatar />
            </UploadAvatar>
          </YStack>

          {/* Profile Form */}
          <SchemaForm
            schema={ProfileSchema}
            props={{
              name: {
                autoFocus: !!params?.edit_name,
              },
              about: {
                autoFocus: !!params?.edit_about,
                multiline: true,
              },
            }}
            defaultValues={{
              name: initial.name ?? '',
              about: initial.about ?? '',
              location: initial.location ?? '',
              social_instagram: initial.social_instagram ?? '',
              social_website: initial.social_website ?? '',
              social_whatsapp: initial.social_whatsapp ?? '',
              show_contact_on_profile: initial.show_contact_on_profile ?? false,
            }}
            onSubmit={(values) => mutation.mutate(values)}
            renderAfter={({ submit }) => (
              <Theme inverse>
                <SubmitButton onPress={() => submit()}>{t('profile.update_profile')}</SubmitButton>
              </Theme>
            )}
          >
            {(fields) => (
              <>
                {Object.values(fields)}
              </>
            )}
          </SchemaForm>

          {/* Saved Events Section */}
          {/* <YStack gap="$3" mt="$2">
            <H5>Saved Events</H5>
            {favoriteEvents.length > 0 ? (
              <FlatList
                horizontal
                data={favoriteEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <EventCard
                    event={item}
                    onPress={() => router.push(`/event/${item.id}`)}
                    width={280}
                    mr="$3"
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <YStack bg="$color2" p="$4" borderRadius="$4" ai="center">
                <Text color="$color10">No saved events yet</Text>
              </YStack>
            )}
          </YStack> */}

          {/* Saved Places Section */}
          {/* <YStack gap="$3">
            <H5>Saved Places</H5>
            {favoritePlaces.length > 0 ? (
              <FlatList
                horizontal
                data={favoritePlaces}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <PlaceCard
                    place={item}
                    onPress={() => router.push(`/place/${item.id}`)}
                    width={280}
                    mr="$3"
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <YStack bg="$color2" p="$4" borderRadius="$4" ai="center">
                <Text color="$color10">No saved places yet</Text>
              </YStack>
            )}
          </YStack> */}

          {/* Settings Button */}
          {/* <Button
            variant="outlined"
            onPress={handleSettings}
          >
            Settings
          </Button> */}
        </YStack>
      </FormWrapper.Body>
    </FormWrapper>
  )
}

const UserAvatar = () => {
  const { avatarUrl } = useUser()
  return (
    <Avatar circular size={128}>
      <SolitoImage src={avatarUrl} alt="your avatar" width={128} height={128} />
    </Avatar>
  )
}
