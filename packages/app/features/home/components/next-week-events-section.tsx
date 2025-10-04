import { Button, EventCard, H4, Text, Theme, View, XStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useEventsQuery } from 'app/utils/react-query/useEventsQuery'
import { filterEventsByDateRange, getNextWeekRange } from 'app/utils/date-helpers'
import { useMemo } from 'react'
import { useRouter } from 'solito/router'
import { useTranslation } from 'react-i18next'

import { ScrollAdapt } from './scroll-adapt'

export const NextWeekEventsSection = () => {
  const { data: allEvents = [], isLoading } = useEventsQuery()
  const router = useRouter()
  const { t } = useTranslation()

  const nextWeekEvents = useMemo(() => {
    const { start, end } = getNextWeekRange()
    return filterEventsByDateRange(allEvents, start, end)
  }, [allEvents])

  if (isLoading) return null

  return (
    <View>
      <XStack
        paddingHorizontal="$4.5"
        alignItems="center"
        gap="$2"
        justifyContent="space-between"
        marginBottom="$4"
      >
        <H4 theme="alt1" fontWeight="400">
          {t('home.next_week')} ({nextWeekEvents.length})
        </H4>
        <Theme name="alt2">
          <Button
            size="$2"
            chromeless
            iconAfter={ArrowRight}
            onPress={() => router.push('/events')}
          >
            {t('home.view_all')}
          </Button>
        </Theme>
      </XStack>

      <ScrollAdapt itemWidth={300}>
        <XStack gap="$3" paddingHorizontal="$4" marginBottom="$3">
          {nextWeekEvents.length > 0 ? (
            nextWeekEvents.slice(0, 6).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event/${event.id}`)}
                minWidth={300}
                maxWidth={300}
              />
            ))
          ) : (
            <View
              height={200}
              width="100%"
              alignItems="center"
              justifyContent="center"
              backgroundColor="$gray1"
              borderRadius="$5"
            >
              <Text color="$color10">{t('home.no_events_next_week')}</Text>
            </View>
          )}
        </XStack>
      </ScrollAdapt>
    </View>
  )
}
