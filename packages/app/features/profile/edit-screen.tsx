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

import { api } from '../../utils/api'
import { UploadAvatar } from '../settings/components/upload-avatar'

const { useParams } = createParam<{ edit_name?: '1'; edit_about?: '1' }>()
export const EditProfileScreen = () => {
  const { profile, user } = useUser()

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }
  return <EditProfileForm userId={user.id} initial={{ name: profile.name, about: profile.about }} />
}

const ProfileSchema = z.object({
  name: formFields.text.describe('Name // John Doe'),
  about: formFields.textarea.describe('About // Tell us a bit about yourself'),
})

const EditProfileForm = ({
  initial,
  userId,
}: {
  initial: { name: string | null; about: string | null }
  userId: string
}) => {
  const { params } = useParams()
  const supabase = useSupabase()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const solitoRouter = useRouter()
  const apiUtils = api.useUtils()
  const mutation = useMutation({
    async mutationFn(data: z.infer<typeof ProfileSchema>) {
      await supabase
        .from('profiles')
        .update({ name: data.name, about: data.about })
        .eq('id', userId)
    },

    async onSuccess() {
      toast.show('Successfully updated!')
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
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          router.replace('/')
        },
      },
    ])
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
                numberOfLines: 4,
                multiline: true,
              },
            }}
            defaultValues={{
              name: initial.name ?? '',
              about: initial.about ?? '',
            }}
            onSubmit={(values) => mutation.mutate(values)}
          >
            {(fields) => (
              <>
                {Object.values(fields)}
                <Theme inverse>
                  <SubmitButton onPress={() => fields.submit()}>Update Profile</SubmitButton>
                </Theme>
              </>
            )}
          </SchemaForm>

          {/* Saved Events Section */}
          <YStack gap="$3" mt="$2">
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
          </YStack>

          {/* Saved Places Section */}
          <YStack gap="$3">
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
          </YStack>

          {/* Logout Button */}
          <Button
            bg="$red9"
            color="white"
            onPress={handleLogout}
            pressStyle={{ bg: '$red10' }}
            mt="$2"
          >
            Logout
          </Button>
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
