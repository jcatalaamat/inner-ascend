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
import { formatDate } from 'app/utils/date-helpers'

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

  const handleResolve = async (action: 'dismiss' | 'hide' | 'remove') => {
    if (!report || !user) return

    setIsResolving(true)
    try {
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

      toast.show('Report resolved successfully', { duration: 3000 })
      router.back()
    } catch (error) {
      console.error('Error resolving report:', error)
      toast.show('Failed to resolve report', { duration: 3000 })
    } finally {
      setIsResolving(false)
    }
  }

  if (!profile?.is_admin) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4">
        <Text>Access Denied</Text>
      </YStack>
    )
  }

  if (isLoading || !report) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Text>Loading...</Text>
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
            <H4>Report Details</H4>
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
              Item Type
            </Text>
            <Text fontSize="$4" textTransform="capitalize">
              {report.item_type}
            </Text>
          </YStack>

          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              Reason
            </Text>
            <Text fontSize="$4" textTransform="capitalize">
              {t(`reports.reasons.${report.reason}`)}
            </Text>
          </YStack>

          {report.description && (
            <YStack>
              <Text fontSize="$2" theme="alt2" fontWeight="600">
                Description
              </Text>
              <Paragraph fontSize="$4">{report.description}</Paragraph>
            </YStack>
          )}

          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              Item ID
            </Text>
            <Text fontSize="$3" fontFamily="$mono">
              {report.item_id}
            </Text>
          </YStack>

          <YStack>
            <Text fontSize="$2" theme="alt2" fontWeight="600">
              Reported
            </Text>
            <Text fontSize="$4">{formatDate(report.created_at, 'en')}</Text>
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
              router.push(`/events/${report.item_id}`)
            } else if (report.item_type === 'place') {
              router.push(`/places/${report.item_id}`)
            }
          }}
        >
          View {report.item_type}
        </Button>

        {/* Resolution Section */}
        {report.status === 'pending' && (
          <>
            <Separator />

            <YStack gap="$3">
              <H5>Resolution</H5>
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600">
                  Notes (optional)
                </Text>
                <TextArea
                  placeholder="Add notes about your decision..."
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
                  Dismiss Report (No Action)
                </Button>

                <Button
                  size="$4"
                  theme="yellow"
                  icon={<Eye />}
                  onPress={() => handleResolve('hide')}
                  disabled={isResolving}
                >
                  Hide Item (Can be restored)
                </Button>

                <Button
                  size="$4"
                  theme="red"
                  icon={<Trash2 />}
                  onPress={() => handleResolve('remove')}
                  disabled={isResolving}
                >
                  Remove Item (Permanent)
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
              <H5>Resolution</H5>
              {report.resolution_notes && (
                <YStack>
                  <Text fontSize="$2" theme="alt2" fontWeight="600">
                    Notes
                  </Text>
                  <Paragraph>{report.resolution_notes}</Paragraph>
                </YStack>
              )}
              <YStack>
                <Text fontSize="$2" theme="alt2" fontWeight="600">
                  Resolved At
                </Text>
                <Text>{report.resolved_at ? formatDate(report.resolved_at, 'en') : 'N/A'}</Text>
              </YStack>
            </YStack>
          </>
        )}
      </YStack>
    </ScrollView>
  )
}
