import {
  Button,
  H4,
  H5,
  Paragraph,
  ScrollView,
  Separator,
  Text,
  TextArea,
  YStack,
  XStack,
  useToastController,
} from '@my/ui'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { usePostHog } from 'posthog-react-native'
import { router } from 'expo-router'
import { Flag, Eye, Trash2, Ban, X } from '@tamagui/lucide-icons'
import type { Report } from 'app/utils/report-types'
import { formatTimestamp } from 'app/utils/date-helpers'

interface ReportDetailScreenProps {
  id: string
}

export function ReportDetailScreen({ id }: ReportDetailScreenProps) {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const { user, profile } = useUser()
  const toast = useToastController()
  const posthog = usePostHog()

  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    loadReport()
  }, [id])

  const loadReport = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setReport(data)
    } catch (error) {
      console.error('Error loading report:', error)
      toast.show('Failed to load report', { duration: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnresolve = async () => {
    if (!report || !user) return

    setIsResolving(true)
    try {
      // If item was hidden (not removed), restore it
      if (report.resolution_action === 'hide_item') {
        const tableName = report.item_type === 'event' ? 'events' : 'places'
        const { error: restoreError } = await supabase
          .from(tableName)
          .update({ hidden_by_reports: false })
          .eq('id', report.item_id)

        if (restoreError) throw restoreError
      }

      // Reset report to pending status
      const { error } = await supabase
        .from('reports')
        .update({
          status: 'pending',
          resolved_by: null,
          resolution_notes: null,
          resolution_action: null,
          resolved_at: null,
        })
        .eq('id', report.id)

      if (error) throw error

      toast.show('Report reopened successfully', { duration: 3000 })
      await loadReport() // Reload to show pending state
    } catch (error) {
      console.error('Error unresolving report:', error)
      toast.show('Failed to reopen report', { duration: 3000 })
    } finally {
      setIsResolving(false)
    }
  }

  const handleResolve = async (action: 'dismiss' | 'hide' | 'remove') => {
    if (!report || !user) return

    setIsResolving(true)
    try {
      // Step 1: Perform the item action (hide or remove)
      if (action === 'hide') {
        // Manually hide the item
        const tableName = report.item_type === 'event' ? 'events' : 'places'
        const { error: hideError } = await supabase
          .from(tableName)
          .update({ hidden_by_reports: true })
          .eq('id', report.item_id)

        if (hideError) throw hideError
      } else if (action === 'remove') {
        // Actually delete the item
        const tableName = report.item_type === 'event' ? 'events' : 'places'
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', report.item_id)

        if (deleteError) throw deleteError
      }

      // Step 2: Update the report status
      const { error } = await supabase
        .from('reports')
        .update({
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
          resolved_by: user.id,
          resolution_notes: resolutionNotes.trim() || null,
          resolution_action: action === 'dismiss' ? 'no_action' : action === 'hide' ? 'hide_item' : 'remove_item',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', report.id)

      if (error) throw error

      posthog?.capture('report_resolved', {
        action,
        item_type: report.item_type,
        reason: report.reason,
      })

      const successMessage =
        action === 'dismiss' ? t('admin.resolve_success') :
        action === 'hide' ? `${t('admin.resolve_success')} - Item hidden` :
        `${t('admin.resolve_success')} - Item removed`

      toast.show(successMessage, { duration: 3000 })

      // Reload the report to show updated status
      await loadReport()
    } catch (error) {
      console.error('Error resolving report:', error)
      toast.show(t('admin.resolve_error'), { duration: 3000 })
    } finally {
      setIsResolving(false)
    }
  }

  if (!profile?.is_admin) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4">
        <Text>{t('admin.access_denied')}</Text>
      </YStack>
    )
  }

  if (isLoading || !report) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Text>{t('admin.loading')}</Text>
      </YStack>
    )
  }

  return (
    <ScrollView bg="$background">
      <YStack p="$4" gap="$4">
        {/* Header */}
        <YStack gap="$2">
          <XStack ai="center" gap="$2">
            <Flag size={24} color="$red10" />
            <H4>{t('admin.report_details')}</H4>
          </XStack>
          <XStack
            px="$3"
            py="$1.5"
            borderRadius="$10"
            alignSelf="flex-start"
            bg={
              report.status === 'pending'
                ? '$yellow4'
                : report.status === 'resolved'
                ? '$green4'
                : '$gray4'
            }
          >
            <Text
              fontSize="$3"
              fontWeight="600"
              textTransform="capitalize"
              color={
                report.status === 'pending'
                  ? '$yellow11'
                  : report.status === 'resolved'
                  ? '$green11'
                  : '$gray11'
              }
            >
              {report.status}
            </Text>
          </XStack>
        </YStack>

        <Separator />

        {/* Report Info */}
        <YStack gap="$3">
          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              {t('admin.item_type')}
            </Text>
            <Text fontSize="$4" textTransform="capitalize">
              {report.item_type}
            </Text>
          </YStack>

          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              {t('admin.reason')}
            </Text>
            <Text fontSize="$4" textTransform="capitalize">
              {t(`reports.reasons.${report.reason}`)}
            </Text>
          </YStack>

          {report.description && (
            <YStack>
              <Text fontSize="$2" theme="alt2" fontWeight="600">
                {t('admin.description')}
              </Text>
              <Paragraph fontSize="$4">{report.description}</Paragraph>
            </YStack>
          )}

          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              {t('admin.item_id')}
            </Text>
            <Text fontSize="$3" fontFamily="$mono">
              {report.item_id}
            </Text>
          </YStack>

          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              {t('admin.reported')}
            </Text>
            <Text fontSize="$4">{formatTimestamp(report.created_at, 'en')}</Text>
          </YStack>
        </YStack>

        <Separator />

        {/* View Item Button */}
        <Button
          size="$4"
          variant="outlined"
          icon={<Eye />}
          onPress={() => {
            if (report.item_type === 'event') {
              router.push(`/event/${report.item_id}`)
            } else if (report.item_type === 'place') {
              router.push(`/place/${report.item_id}`)
            }
          }}
        >
          {t('admin.view_item', { type: report.item_type })}
        </Button>

        {/* Resolution Section */}
        {report.status === 'pending' && (
          <>
            <Separator />

            <YStack gap="$3">
              <H5>{t('admin.resolution')}</H5>
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600">
                  {t('admin.notes_optional')}
                </Text>
                <TextArea
                  placeholder={t('admin.notes_placeholder')}
                  value={resolutionNotes}
                  onChangeText={setResolutionNotes}
                  numberOfLines={3}
                />
              </YStack>

              <YStack gap="$2">
                <Button
                  size="$4"
                  theme="gray"
                  icon={<X />}
                  onPress={() => handleResolve('dismiss')}
                  disabled={isResolving}
                >
                  {t('admin.dismiss_report')}
                </Button>

                <Button
                  size="$4"
                  theme="yellow"
                  icon={<Eye />}
                  onPress={() => handleResolve('hide')}
                  disabled={isResolving}
                >
                  {t('admin.hide_item')}
                </Button>

                <Button
                  size="$4"
                  theme="red"
                  icon={<Trash2 />}
                  onPress={() => handleResolve('remove')}
                  disabled={isResolving}
                >
                  {t('admin.remove_item')}
                </Button>
              </YStack>
            </YStack>
          </>
        )}

        {/* Resolution Info */}
        {report.status !== 'pending' && (
          <>
            <Separator />
            <YStack gap="$3">
              <H5>{t('admin.resolution')}</H5>

              {/* Resolution Action Taken */}
              <YStack>
                <Text fontSize="$2" theme="alt2" fontWeight="600">
                  Action Taken
                </Text>
                <Text fontSize="$4" textTransform="capitalize">
                  {report.resolution_action === 'no_action' && 'Report Dismissed - No Action'}
                  {report.resolution_action === 'hide_item' && '⚠️ Item Hidden from Public View'}
                  {report.resolution_action === 'remove_item' && '🗑️ Item Permanently Removed'}
                </Text>
              </YStack>

              {report.resolution_notes && (
                <YStack>
                  <Text fontSize="$2" theme="alt2" fontWeight="600">
                    {t('admin.notes')}
                  </Text>
                  <Paragraph>{report.resolution_notes}</Paragraph>
                </YStack>
              )}
              <YStack>
                <Text fontSize="$2" theme="alt2" fontWeight="600">
                  {t('admin.resolved_at')}
                </Text>
                <Text>{report.resolved_at ? formatTimestamp(report.resolved_at, 'en') : 'N/A'}</Text>
              </YStack>

              {/* Allow changing decision (except for removed items) */}
              {report.resolution_action !== 'remove_item' && (
                <>
                  <Separator my="$2" />
                  <YStack gap="$2">
                    <Text fontSize="$3" fontWeight="600" theme="alt2">
                      Need to change your decision?
                    </Text>
                    <Button
                      size="$4"
                      theme="blue"
                      variant="outlined"
                      onPress={handleUnresolve}
                      disabled={isResolving}
                    >
                      Reopen Report & Change Decision
                    </Button>
                  </YStack>
                </>
              )}
            </YStack>
          </>
        )}
      </YStack>
    </ScrollView>
  )
}
