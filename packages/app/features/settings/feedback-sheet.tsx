import { useState } from 'react'
import { Button, Input, Select, Sheet, TextArea, YStack, XStack, H4, Text, Adapt, useToastController } from '@my/ui'
import { MessageSquarePlus, X } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePostHog } from 'posthog-react-native'
import * as Device from 'expo-device'
import * as Application from 'expo-application'

type FeedbackType = 'feedback' | 'feature_request' | 'bug_report'

interface FeedbackSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const FeedbackSheet = ({ open, onOpenChange }: FeedbackSheetProps) => {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const toast = useToastController()
  const posthog = usePostHog()

  const [type, setType] = useState<FeedbackType>('feedback')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Track when sheet is opened
  useState(() => {
    if (open) {
      posthog?.capture('feedback_sheet_opened')
    }
  })

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.show(t('feedback.validation_error') || 'Please fill in all fields', {
        duration: 3000
      })
      return
    }

    setSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Gather device info
      const deviceInfo = {
        deviceType: Device.deviceType,
        deviceName: Device.deviceName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        appVersion: Application.nativeApplicationVersion,
        buildVersion: Application.nativeBuildVersion,
      }

      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id,
        user_email: user?.email,
        type,
        title: title.trim(),
        description: description.trim(),
        device_info: deviceInfo,
      })

      if (error) throw error

      // Track successful submission
      posthog?.capture('feedback_submitted', {
        type,
        title_length: title.trim().length,
        description_length: description.trim().length,
        has_user: !!user?.id
      })

      toast.show(t('feedback.success') || 'Thank you for your feedback!', {
        duration: 3000
      })

      // Reset form
      setTitle('')
      setDescription('')
      setType('feedback')

      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      posthog?.capture('feedback_submission_failed', {
        type,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      toast.show(t('feedback.error') || 'Failed to submit feedback', {
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

      <Sheet.Frame padding="$4" gap="$4">
        <Sheet.Handle />

        <XStack ai="center" jc="space-between">
          <H4>{t('feedback.title') || 'Send Feedback'}</H4>
          <Button size="$3" circular icon={X} onPress={() => onOpenChange(false)} />
        </XStack>

        <Text color="$color11" size="$3">
          {t('feedback.description') || 'Share your feedback or request a new feature'}
        </Text>

        <YStack gap="$3" f={1}>
          <Select value={type} onValueChange={(val) => setType(val as FeedbackType)}>
            <Select.Trigger width="100%">
              <Select.Value />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet modal dismissOnSnapToBottom snapPointsMode="fit" animation="medium">
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
              <Select.Viewport>
                <Select.Item index={0} value="feedback">
                  <Select.ItemText>{t('feedback.types.feedback') || 'General Feedback'}</Select.ItemText>
                </Select.Item>
                <Select.Item index={1} value="feature_request">
                  <Select.ItemText>{t('feedback.types.feature_request') || 'Feature Request'}</Select.ItemText>
                </Select.Item>
                <Select.Item index={2} value="bug_report">
                  <Select.ItemText>{t('feedback.types.bug_report') || 'Bug Report'}</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select>

          <Input
            placeholder={t('feedback.title_placeholder') || 'Brief title...'}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextArea
            placeholder={t('feedback.description_placeholder') || 'Describe your feedback or feature request...'}
            value={description}
            onChangeText={setDescription}
            f={1}
            minHeight={150}
            maxLength={1000}
          />

          <Button
            theme="blue"
            size="$4"
            onPress={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
            icon={MessageSquarePlus}
          >
            {submitting ? t('common.loading') || 'Sending...' : t('feedback.submit') || 'Submit Feedback'}
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
