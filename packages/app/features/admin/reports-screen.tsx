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
import { router } from 'expo-router'
import { Flag, AlertCircle, CheckCircle, XCircle } from '@tamagui/lucide-icons'
import type { Report } from 'app/utils/report-types'
import { formatDate } from 'app/utils/date-helpers'

export function AdminReportsScreen() {
  const { t } = useTranslation()
  const supabase = useSupabase()
  const { user, profile } = useUser()
  const posthog = usePostHog()

  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')

  useEffect(() => {
    posthog?.capture('admin_reports_viewed')
  }, [posthog])

  useEffect(() => {
    loadReports()
  }, [filter])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'pending') {
        query = query.eq('status', 'pending')
      }

      const { data, error } = await query

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user is admin
  if (!profile?.is_admin) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" gap="$4">
        <AlertCircle size={48} color="$red10" />
        <H3 ta="center">Access Denied</H3>
        <Paragraph ta="center" theme="alt2">
          You don't have permission to access this page.
        </Paragraph>
        <Button onPress={() => router.back()}>Go Back</Button>
      </YStack>
    )
  }

  const pendingCount = reports.filter((r) => r.status === 'pending').length

  return (
    <ScrollView bg="$background">
      <YStack p="$4" gap="$4">
        {/* Header */}
        <YStack gap="$2">
          <XStack ai="center" gap="$2">
            <Flag size={28} color="$red10" />
            <H3>Content Reports</H3>
          </XStack>
          <Paragraph theme="alt2">Review and moderate reported content</Paragraph>
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
              Pending
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
              Total
            </Text>
          </YStack>
        </XStack>

        {/* Filter */}
        <XStack gap="$2">
          <Button
            size="$3"
            onPress={() => setFilter('pending')}
            theme={filter === 'pending' ? 'blue' : undefined}
            variant={filter === 'pending' ? undefined : 'outlined'}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            size="$3"
            onPress={() => setFilter('all')}
            theme={filter === 'all' ? 'blue' : undefined}
            variant={filter === 'all' ? undefined : 'outlined'}
          >
            All Reports ({reports.length})
          </Button>
        </XStack>

        <Separator />

        {/* Reports List */}
        {isLoading ? (
          <YStack ai="center" py="$8">
            <Text>Loading reports...</Text>
          </YStack>
        ) : reports.length === 0 ? (
          <YStack ai="center" py="$8" gap="$3">
            <CheckCircle size={48} color="$green10" />
            <H5>No reports to review!</H5>
            <Paragraph theme="alt2" ta="center">
              {filter === 'pending'
                ? 'All caught up! No pending reports.'
                : 'No reports have been submitted yet.'}
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
                    <Text theme="alt2" textTransform="capitalize">
                      {report.reason.replace('_', ' ')}
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
                <XStack gap="$3">
                  <Text fontSize="$2" theme="alt2">
                    {formatDate(report.created_at, 'en')}
                  </Text>
                  <Text fontSize="$2" theme="alt2">
                    •
                  </Text>
                  <Text fontSize="$2" theme="alt2">
                    ID: {report.item_id.slice(0, 8)}...
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
