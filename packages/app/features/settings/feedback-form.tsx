import { useState } from 'react'
import { Button, Dialog, H4, Input, Select, TextArea, YStack, Sheet, Adapt, useToastController } from '@my/ui'
import { MessageSquarePlus, X } from '@tamagui/lucide-icons'
import { useTranslation } from 'react-i18next'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import * as Device from 'expo-device'
import * as Application from 'expo-application'

type FeedbackType = 'feedback' | 'feature_request' | 'bug_report'

export const FeedbackButton = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button icon={MessageSquarePlus} onPress={() => setOpen(true)}>
          {t('settings.send_feedback')}
        </Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          animation="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          snapPointsMode="fit"
        >
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxWidth={600}
        >
          <Dialog.Title>
            <H4>{t('feedback.title')}</H4>
          </Dialog.Title>

          <Dialog.Description>
            {t('feedback.description')}
          </Dialog.Description>

          <FeedbackForm onSuccess={() => setOpen(false)} />

          <Dialog.Close asChild>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$2"
              circular
              icon={X}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const FeedbackForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const toast = useToastController()

  const [type, setType] = useState<FeedbackType>('feedback')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.show(t('feedback.validation_error'), {
        preset: 'error',
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

      toast.show(t('feedback.success'), {
        preset: 'done',
        duration: 3000
      })

      // Reset form
      setTitle('')
      setDescription('')
      setType('feedback')

      onSuccess()
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.show(t('feedback.error'), {
        preset: 'error',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <Select value={type} onValueChange={(val) => setType(val as FeedbackType)}>
          <Select.Trigger>
            <Select.Value placeholder={t('feedback.type_placeholder')} />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet
              modal
              dismissOnSnapToBottom
              snapPointsMode="fit"
              animation="medium"
            >
              <Sheet.Frame>
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay />
            </Sheet>
          </Adapt>

          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton />
            <Select.Viewport>
              <Select.Item index={0} value="feedback">
                <Select.ItemText>{t('feedback.types.feedback')}</Select.ItemText>
              </Select.Item>
              <Select.Item index={1} value="feature_request">
                <Select.ItemText>{t('feedback.types.feature_request')}</Select.ItemText>
              </Select.Item>
              <Select.Item index={2} value="bug_report">
                <Select.ItemText>{t('feedback.types.bug_report')}</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
      </YStack>

      <Input
        placeholder={t('feedback.title_placeholder')}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />

      <TextArea
        placeholder={t('feedback.description_placeholder')}
        value={description}
        onChangeText={setDescription}
        minHeight={120}
        maxLength={1000}
      />

      <Button
        theme="blue"
        onPress={handleSubmit}
        disabled={submitting || !title.trim() || !description.trim()}
        icon={MessageSquarePlus}
      >
        {submitting ? t('common.loading') : t('feedback.submit')}
      </Button>
    </YStack>
  )
}
