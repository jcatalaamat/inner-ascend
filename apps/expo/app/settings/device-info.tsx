import { DeviceInfoScreen } from '@my/app/features/settings/device-info-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

export default function Screen() {
  const { t } = useTranslation()
  
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: t('device_info.title'),
          headerBackTitle: t('navigation.settings'),
        }}
      />
      <DeviceInfoScreen />
    </SafeAreaView>
  )
}
