import { AdminReportsScreen } from 'app/features/admin/reports-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Content Reports',
          headerShown: true,
        }}
      />
      <AdminReportsScreen />
    </SafeAreaView>
  )
}
