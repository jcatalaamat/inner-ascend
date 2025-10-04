import { CreateScreen } from 'app/features/create/screen'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function Screen() {
  const { t } = useTranslation()
  const { type } = useLocalSearchParams<{ type?: string }>()

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: t('create.title') }} />
      <CreateScreen type={(type as 'event' | 'place') || 'event'} />
    </>
  )
}
