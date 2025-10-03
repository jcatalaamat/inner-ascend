import { FullscreenSpinner, Text, YStack, XStack, Image, Button, ScrollView, Card, H4, Paragraph, EcoBadge, FavoriteButtonWrapper, Theme } from '@my/ui'
import { useEventDetailQuery } from 'app/utils/react-query/useEventsQuery'
import { Calendar, Clock, MapPin, DollarSign, User, Mail } from '@tamagui/lucide-icons'
import { formatDate, formatTime } from 'app/utils/date-helpers'
import { CATEGORY_COLORS } from 'app/utils/constants'
import { useTranslation } from 'react-i18next'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'

interface EventDetailScreenProps {
  id: string
}

export function EventDetailScreen({ id }: EventDetailScreenProps) {
  const { data: event, isLoading } = useEventDetailQuery(id)
  const { t } = useTranslation()
  const posthog = usePostHog()

  useEffect(() => {
    if (event) {
      posthog?.capture('event_detail_viewed', {
        event_id: event.id,
        event_title: event.title,
        event_category: event.category,
        is_featured: event.featured,
        is_eco_conscious: event.eco_conscious,
      })
    }
  }, [event, posthog])

  if (isLoading) {
    return <FullscreenSpinner />
  }

  if (!event) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Text fontSize="$5" color="$color10">
          {t('events.detail.not_found')}
        </Text>
      </YStack>
    )
  }

  const categoryColor = CATEGORY_COLORS[event.category]
  const categoryLabel = t(`events.categories.${event.category}`)

  return (
    <ScreenWrapper>
      <ScrollView bg="$background">
        <YStack pb="$4">
          {/* Image */}
          {event.image_url && (
            <Image
              source={{ uri: event.image_url }}
              height={280}
              width="100%"
            />
          )}

          <YStack p="$4" gap="$4">
          {/* Header */}
          <XStack jc="space-between" ai="flex-start">
            <YStack f={1} gap="$2">
              <H4>{event.title}</H4>
              <XStack gap="$2" ai="center">
                <Theme name={categoryColor}>
                  <Button size="$2" disabled>
                    {categoryLabel}
                  </Button>
                </Theme>
                {event.eco_conscious && <EcoBadge size="small" />}
                {event.featured && (
                  <Button size="$2" disabled theme="yellow">
                    {t('events.detail.featured')}
                  </Button>
                )}
              </XStack>
            </YStack>
            <FavoriteButtonWrapper itemId={event.id} itemType="event" size={28} />
          </XStack>

          {/* Details Card */}
          <Card p="$3" gap="$3">
            <XStack gap="$3" ai="center">
              <Calendar size={20} color="$color10" />
              <Text fontSize="$4">{formatDate(event.date)}</Text>
            </XStack>
            {event.time && (
              <XStack gap="$3" ai="center">
                <Clock size={20} color="$color10" />
                <Text fontSize="$4">{event.time}</Text>
              </XStack>
            )}
            {event.location_name && (
              <XStack gap="$3" ai="center">
                <MapPin size={20} color="$color10" />
                <Text fontSize="$4" f={1}>
                  {event.location_name}
                </Text>
              </XStack>
            )}
            {event.price && (
              <XStack gap="$3" ai="center">
                <DollarSign size={20} color="$color10" />
                <Text fontSize="$4">{event.price}</Text>
              </XStack>
            )}
          </Card>

          {/* Description */}
          {event.description && (
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600">
                {t('events.detail.about')}
              </Text>
              <Paragraph fontSize="$4" color="$color11">
                {event.description}
              </Paragraph>
            </YStack>
          )}

          {/* Organizer Info */}
          {(event.organizer_name || event.organizer_contact) && (
            <Card p="$3" gap="$3">
              <Text fontSize="$5" fontWeight="600">
                {t('events.detail.organizer')}
              </Text>
              {event.organizer_name && (
                <XStack gap="$3" ai="center">
                  <User size={20} color="$color10" />
                  <Text fontSize="$4">{event.organizer_name}</Text>
                </XStack>
              )}
              {event.organizer_contact && (
                <XStack gap="$3" ai="center">
                  <Mail size={20} color="$color10" />
                  <Text fontSize="$4">{event.organizer_contact}</Text>
                </XStack>
              )}
            </Card>
          )}

          {/* TODO: Add map preview with marker */}
          {/* TODO: Add share button */}
          {/* TODO: Add "Get Directions" button if lat/lng available */}
        </YStack>
      </ScrollView>
    </ScreenWrapper>
  )
}
