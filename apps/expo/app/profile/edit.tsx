import { useState } from 'react'
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Avatar,
  getTokens,
  Card,
  Spinner,
} from '@my/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useUser } from 'app/utils/useUser'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { UploadAvatar } from 'app/features/settings/components/upload-avatar'
import { ArrowLeft, Check } from '@tamagui/lucide-icons'
import { ScrollView, Alert } from 'react-native'

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets()
  const { profile, displayName, avatarUrl, updateProfile } = useUser()
  const supabase = useSupabase()

  const [name, setName] = useState(profile?.full_name || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!profile?.id) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() || null })
        .eq('id', profile.id)

      if (error) throw error

      await updateProfile()
      Alert.alert('Success', 'Profile updated successfully')
      router.back()
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = name.trim() !== (profile?.full_name || '')

  return (
    <YStack flex={1} backgroundColor="$deepSpace1">
      {/* Header */}
      <XStack
        paddingTop={insets.top + 16}
        paddingBottom={16}
        paddingHorizontal={20}
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor="$deepSpace3"
      >
        <Button
          size="$3"
          backgroundColor="transparent"
          color="$silverMoon"
          borderWidth={0}
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color="$silverMoon" />}
        />
        <Text fontSize="$6" fontWeight="600" color="$silverMoon">
          Edit Profile
        </Text>
        <Button
          size="$3"
          backgroundColor={hasChanges ? '$cosmicViolet' : 'transparent'}
          color={hasChanges ? '$silverMoon' : '$silverMoon3'}
          borderWidth={0}
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
          opacity={!hasChanges || isSaving ? 0.5 : 1}
        >
          {isSaving ? <Spinner size="small" color="$silverMoon" /> : <Check size={20} />}
        </Button>
      </XStack>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <YStack padding={20} gap="$6">
          {/* Avatar Section */}
          <YStack alignItems="center" gap="$4">
            <UploadAvatar>
              <Avatar circular size="$10">
                <Avatar.Image
                  source={{
                    uri: avatarUrl,
                    width: getTokens().size['10'].val,
                    height: getTokens().size['10'].val,
                  }}
                />
                <Avatar.Fallback bc="$cosmicViolet" ai="center" jc="center">
                  <Text fontSize="$12" color="$silverMoon" fontWeight="bold">
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
            </UploadAvatar>
            <Text fontSize="$3" color="$silverMoon2" textAlign="center">
              Tap to change photo
            </Text>
          </YStack>

          {/* Name Input */}
          <YStack gap="$3">
            <Text fontSize="$3" color="$silverMoon2" fontWeight="600" letterSpacing={0.5}>
              NAME
            </Text>
            <Input
              size="$5"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="$silverMoon3"
              backgroundColor="$deepSpace2"
              borderWidth={1}
              borderColor="$deepSpace3"
              color="$silverMoon"
              fontSize="$5"
              paddingHorizontal="$4"
              paddingVertical="$3"
              focusStyle={{
                borderColor: '$cosmicViolet',
                backgroundColor: '$deepSpace2',
              }}
            />
            <Text fontSize="$2" color="$silverMoon3" marginTop="$-1">
              This is how your name will appear throughout the app
            </Text>
          </YStack>

          {/* Email Display (Read-only) */}
          <YStack gap="$3">
            <Text fontSize="$3" color="$silverMoon2" fontWeight="600" letterSpacing={0.5}>
              EMAIL
            </Text>
            <Card
              padding="$4"
              backgroundColor="$deepSpace2"
              borderWidth={1}
              borderColor="$deepSpace3"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" color="$silverMoon">
                  {profile?.email || 'No email'}
                </Text>
                <Button
                  size="$2"
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor="$deepSpace3"
                  color="$silverMoon2"
                  onPress={() => router.push('/settings/change-email')}
                  paddingHorizontal="$3"
                >
                  <Text fontSize="$2">Change</Text>
                </Button>
              </XStack>
            </Card>
            <Text fontSize="$2" color="$silverMoon3" marginTop="$-1">
              Email changes require verification
            </Text>
          </YStack>

          {/* Account Settings */}
          <YStack gap="$3" marginTop="$4">
            <Text fontSize="$3" color="$silverMoon" fontWeight="600" letterSpacing={0.5}>
              ACCOUNT
            </Text>
            <Card
              padding="$4"
              backgroundColor="$silverMoon3"
              borderWidth={0}
              pressStyle={{ opacity: 0.8, backgroundColor: '$cosmicViolet' }}
              onPress={() => router.push('/settings/change-password')}
            >
              <Text fontSize="$5" color="$deepSpace1" fontWeight="600">
                Change Password
              </Text>
            </Card>
          </YStack>

          {/* Bottom spacing for visual balance */}
          <YStack height={40} />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
