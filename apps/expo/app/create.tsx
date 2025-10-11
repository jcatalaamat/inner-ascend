import { CreateScreen } from 'app/features/create/screen'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function Screen() {
  const { t } = useTranslation()
  const { type } = useLocalSearchParams<{ type?: string }>()

  const getTitle = () => {
    if (type === 'service') return t('create.service_form.title')
    if (type === 'place') return t('create.place_form.title')
    return t('create.event_form.title')
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: getTitle() }} />
      <CreateScreen type={(type as 'event' | 'place' | 'service') || 'event'} />
    </>
  )
}
