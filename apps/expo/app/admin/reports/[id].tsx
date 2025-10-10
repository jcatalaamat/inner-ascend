import { ReportDetailScreen } from 'app/features/admin/report-detail-screen'
import { Stack, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Report Detail',
          headerShown: true,
        }}
      />
      <ReportDetailScreen id={id} />
    </SafeAreaView>
  )
}
