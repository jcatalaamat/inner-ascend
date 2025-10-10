import {
  Button,
  H4,
  Label,
  Paragraph,
  RadioGroup,
  ScrollView,
  Sheet,
  TextArea,
  YStack,
  XStack,
  useToastController,
} from '@my/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { usePostHog } from 'posthog-react-native'
import type { ReportItemType, ReportReason } from 'app/utils/report-types'
import { AlertCircle, Flag } from '@tamagui/lucide-icons'

interface ReportSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string
  itemType: ReportItemType
}

const REPORT_REASONS: { value: ReportReason; labelKey: string }[] = [
  { value: 'spam', labelKey: 'reports.reasons.spam' },
  { value: 'inappropriate', labelKey: 'reports.reasons.inappropriate' },
  { value: 'misleading', labelKey: 'reports.reasons.misleading' },
  { value: 'harassment', labelKey: 'reports.reasons.harassment' },
  { value: 'duplicate', labelKey: 'reports.reasons.duplicate' },
  { value: 'other', labelKey: 'reports.reasons.other' },
]

export function ReportSheet({ open, onOpenChange, itemId, itemType }: ReportSheetProps) {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const { user } = useUser()
  const toast = useToastController()
  const posthog = usePostHog()

  const [reason, setReason] = useState<ReportReason>('spam')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      toast.show(t('reports.error_not_logged_in'), { duration: 3000 })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from('reports').insert({
        reporter_id: user.id,
        item_id: itemId,
        item_type: itemType,
        reason,
        description: description.trim() || null,
      })

      if (error) {
        // Check if it's a duplicate report
        if (error.code === '23505') {
          toast.show(t('reports.already_reported'), { duration: 3000 })
        } else {
          throw error
        }
      } else {
        // Track successful report
        posthog?.capture('report_submitted', {
          item_type: itemType,
          reason,
          has_description: !!description.trim(),
        })

        toast.show(t('reports.success'), { duration: 3000 })

        // Reset and close
        setReason('spam')
        setDescription('')
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.show(t('reports.error'), { duration: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      dismissOnSnapToBottom
      zIndex={100000}
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$0">
        <Sheet.Handle />
        <ScrollView>
          <YStack padding="$4" gap="$4">
          {/* Header */}
          <YStack gap="$2">
            <XStack ai="center" gap="$2">
              <Flag size={24} color="$red10" />
              <H4>{t('reports.title')}</H4>
            </XStack>
            <Paragraph theme="alt2" size="$3">
              {t('reports.description')}
            </Paragraph>
          </YStack>

          {/* Warning banner */}
          <XStack
            p="$3"
            bg="$yellow2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$yellow6"
            gap="$2"
            ai="flex-start"
          >
            <AlertCircle size={16} color="$yellow11" style={{ marginTop: 2 }} />
            <Paragraph size="$2" color="$yellow11" f={1}>
              {t('reports.warning')}
            </Paragraph>
          </XStack>

          {/* Reason selection */}
          <YStack gap="$3">
            <Label>{t('reports.select_reason')}</Label>
            <RadioGroup value={reason} onValueChange={(val) => setReason(val as ReportReason)}>
              {REPORT_REASONS.map((r) => (
                <XStack key={r.value} ai="center" gap="$2" py="$2">
                  <RadioGroup.Item value={r.value} id={r.value} size="$4">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor={r.value} f={1}>
                    {t(r.labelKey)}
                  </Label>
                </XStack>
              ))}
            </RadioGroup>
          </YStack>

          {/* Description */}
          <YStack gap="$2">
            <Label>{t('reports.description_label')}</Label>
            <TextArea
              placeholder={t('reports.description_placeholder')}
              value={description}
              onChangeText={setDescription}
              numberOfLines={4}
              maxLength={500}
            />
            <Paragraph size="$1" theme="alt2" ta="right">
              {description.length}/500
            </Paragraph>
          </YStack>

          {/* Submit button */}
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting || !user}
            theme="red"
            size="$4"
            icon={<Flag />}
            mb="$4"
          >
            {isSubmitting ? t('common.loading') : t('reports.submit')}
          </Button>
        </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
