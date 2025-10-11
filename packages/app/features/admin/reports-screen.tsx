import {
  Button,
  H3,
  H5,
  Paragraph,
  ScrollView,
  Separator,
  Text,
  YStack,
  XStack,
} from '@my/ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { usePostHog } from 'posthog-react-native'
import { router, useFocusEffect } from 'expo-router'
import { Flag, AlertCircle, CheckCircle, XCircle } from '@tamagui/lucide-icons'
import type { Report } from 'app/utils/report-types'
import { formatTimestamp } from 'app/utils/date-helpers'
import { useCallback } from 'react'

export function AdminReportsScreen() {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const { user, profile } = useUser()
  const posthog = usePostHog()

  const [reports, setReports] = useState<Report[]>([])
  const [allReports, setAllReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'hidden' | 'deleted' | 'dismissed' | 'all'>(
    'pending'
  )

  useEffect(() => {
    posthog?.capture('admin_reports_viewed')
  }, [posthog])

  useEffect(() => {
    loadReports()
  }, [])

  // Reload reports when screen comes into focus (e.g., coming back from detail screen)
  useFocusEffect(
    useCallback(() => {
      console.log('📋 Reports screen focused - reloading reports')
      loadReports()
    }, [])
  )

  useEffect(() => {
    filterReports()
  }, [filter, allReports])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllReports(data || [])
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = allReports

    if (filter === 'pending') {
      filtered = allReports.filter((r) => r.status === 'pending')
    } else if (filter === 'hidden') {
      filtered = allReports.filter(
        (r) => r.status === 'resolved' && r.resolution_action === 'hide_item'
      )
    } else if (filter === 'deleted') {
      filtered = allReports.filter(
        (r) => r.status === 'resolved' && r.resolution_action === 'remove_item'
      )
    } else if (filter === 'dismissed') {
      filtered = allReports.filter((r) => r.status === 'dismissed')
    }
    // 'all' shows everything - no filtering

    setReports(filtered)
  }

  // Check if user is admin
  if (!profile?.is_admin) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" gap="$4">
        <AlertCircle size={48} color="$red10" />
        <H3 ta="center">{t('admin.access_denied')}</H3>
        <Paragraph ta="center" theme="alt2">
          {t('admin.no_permission')}
        </Paragraph>
        <Button onPress={() => router.back()}>{t('admin.go_back')}</Button>
      </YStack>
    )
  }

  const pendingCount = allReports.filter((r) => r.status === 'pending').length
  const hiddenCount = allReports.filter(
    (r) => r.status === 'resolved' && r.resolution_action === 'hide_item'
  ).length
  const deletedCount = allReports.filter(
    (r) => r.status === 'resolved' && r.resolution_action === 'remove_item'
  ).length
  const dismissedCount = allReports.filter((r) => r.status === 'dismissed').length

  return (
    <ScrollView bg="$background">
      <YStack p="$4" gap="$4">
        {/* Header */}
        <YStack gap="$2">
          <XStack ai="center" gap="$2">
            <Flag size={28} color="$red10" />
            <H3>{t('admin.title')}</H3>
          </XStack>
          <Paragraph theme="alt2">{t('admin.subtitle')}</Paragraph>
        </YStack>

        {/* Stats */}
        <XStack gap="$3">
          <YStack
            f={1}
            p="$4"
            bg="$yellow2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$yellow6"
          >
            <Text fontSize="$8" fontWeight="700" color="$yellow11">
              {pendingCount}
            </Text>
            <Text fontSize="$3" color="$yellow11">
              {t('admin.pending')}
            </Text>
          </YStack>
          <YStack
            f={1}
            p="$4"
            bg="$gray2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$8" fontWeight="700">
              {reports.length}
            </Text>
            <Text fontSize="$3" theme="alt2">
              {t('admin.total')}
            </Text>
          </YStack>
        </XStack>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2" pb="$2">
            <Button
              size="$3"
              onPress={() => setFilter('pending')}
              theme={filter === 'pending' ? 'blue' : undefined}
              variant={filter === 'pending' ? undefined : 'outlined'}
            >
              {`${t('admin.pending')} (${pendingCount})`}
            </Button>
            <Button
              size="$3"
              onPress={() => setFilter('dismissed')}
              theme={filter === 'dismissed' ? 'blue' : undefined}
              variant={filter === 'dismissed' ? undefined : 'outlined'}
            >
              {`${t('admin.dismissed')} (${dismissedCount})`}
            </Button>
            <Button
              size="$3"
              onPress={() => setFilter('hidden')}
              theme={filter === 'hidden' ? 'blue' : undefined}
              variant={filter === 'hidden' ? undefined : 'outlined'}
            >
              {`${t('admin.hidden')} (${hiddenCount})`}
            </Button>
            <Button
              size="$3"
              onPress={() => setFilter('deleted')}
              theme={filter === 'deleted' ? 'blue' : undefined}
              variant={filter === 'deleted' ? undefined : 'outlined'}
            >
              {`${t('admin.deleted')} (${deletedCount})`}
            </Button>
            <Button
              size="$3"
              onPress={() => setFilter('all')}
              theme={filter === 'all' ? 'blue' : undefined}
              variant={filter === 'all' ? undefined : 'outlined'}
            >
              {`${t('admin.all_reports')} (${allReports.length})`}
            </Button>
          </XStack>
        </ScrollView>

        <Separator />

        {/* Reports List */}
        {isLoading ? (
          <YStack ai="center" py="$8">
            <Text>{t('admin.loading')}</Text>
          </YStack>
        ) : reports.length === 0 ? (
          <YStack ai="center" py="$8" gap="$3">
            <CheckCircle size={48} color="$green10" />
            <H5>{t('admin.no_reports_title')}</H5>
            <Paragraph theme="alt2" ta="center">
              {filter === 'pending'
                ? t('admin.no_pending_reports')
                : filter === 'hidden'
                ? t('admin.no_hidden_reports')
                : filter === 'deleted'
                ? t('admin.no_deleted_reports')
                : filter === 'dismissed'
                ? t('admin.no_dismissed_reports')
                : t('admin.no_reports_yet')}
            </Paragraph>
          </YStack>
        ) : (
          <YStack gap="$3">
            {reports.map((report) => (
              <YStack
                key={report.id}
                p="$4"
                bg="$background"
                borderRadius="$4"
                borderWidth={1}
                borderColor={report.status === 'pending' ? '$yellow6' : '$borderColor'}
                gap="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => router.push(`/admin/reports/${report.id}`)}
                cursor="pointer"
              >
                {/* Header */}
                <XStack jc="space-between" ai="center">
                  <XStack ai="center" gap="$2">
                    <Flag
                      size={16}
                      color={report.status === 'pending' ? '$yellow11' : '$gray11'}
                    />
                    <Text fontWeight="600" textTransform="capitalize">
                      {report.item_type}
                    </Text>
                    <Text theme="alt2">•</Text>
                    <Text theme="alt2">
                      {t(`reports.reasons.${report.reason}`)}
                    </Text>
                  </XStack>
                  <XStack
                    px="$2"
                    py="$1"
                    borderRadius="$10"
                    bg={
                      report.status === 'pending'
                        ? '$yellow4'
                        : report.status === 'resolved'
                        ? '$green4'
                        : '$gray4'
                    }
                  >
                    <Text
                      fontSize="$2"
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
                </XStack>

                {/* Description */}
                {report.description && (
                  <Paragraph size="$3" theme="alt2" numberOfLines={2}>
                    {report.description}
                  </Paragraph>
                )}

                {/* Meta */}
                <XStack gap="$2" ai="center">
                  <Text fontSize="$2" theme="alt2">
                    {formatTimestamp(report.created_at, 'en')}
                  </Text>
                  <Text fontSize="$2" theme="alt2">•</Text>
                  <Text fontSize="$2" theme="alt2">
                    {`${t('admin.item_id')}: ${report.item_id.slice(0, 8)}...`}
                  </Text>
                </XStack>
              </YStack>
            ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  )
}
