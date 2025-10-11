import { PublicProfileScreen } from 'app/features/profile/public-screen'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function Screen() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    return null
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: t('profile.public.title') }} />
      <PublicProfileScreen profileId={id} />
    </>
  )
}
