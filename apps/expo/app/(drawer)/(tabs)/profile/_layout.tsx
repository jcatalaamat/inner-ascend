import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const { t } = useTranslation()

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('navigation.profile'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: t('profile.edit_profile'),
          headerShown: true,
          headerBackTitle: t('navigation.profile'),
        }}
      />
    </Stack>
  )
}
