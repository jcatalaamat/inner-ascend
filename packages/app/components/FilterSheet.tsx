import {
  Button,
  H4,
  Label,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  YStack,
  XStack,
  XGroup,
  Text,
} from '@my/ui'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, X } from '@tamagui/lucide-icons'
import type { EventFilters, DateRangeType, TimeOfDay } from 'app/utils/filter-types'
import { getActiveFilterCount } from 'app/utils/filter-types'
import { EVENT_CATEGORIES, PLACE_TYPES, type EventCategory, type PlaceType } from 'app/utils/constants'

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: EventFilters
  onApplyFilters: (filters: EventFilters) => void
  type?: 'event' | 'place'
}

const TIME_SLOTS: { value: TimeOfDay; labelKey: string }[] = [
  { value: 'morning', labelKey: 'filters.time_of_day.morning' },
  { value: 'afternoon', labelKey: 'filters.time_of_day.afternoon' },
  { value: 'evening', labelKey: 'filters.time_of_day.evening' },
]

export function FilterSheet({ open, onOpenChange, filters, onApplyFilters, type = 'event' }: FilterSheetProps) {
  const { t } = useTranslation()

  const [localFilters, setLocalFilters] = useState<EventFilters>(filters)

  // Sync local filters when external filters change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApply = () => {
    onApplyFilters(localFilters)
    onOpenChange(false)
  }

  const handleClear = () => {
    const clearedFilters: EventFilters = {
      categories: [],
      ...(type === 'event' && {
        dateRange: { type: 'all' },
        timeOfDay: [],
      }),
    }
    setLocalFilters(clearedFilters)
    onApplyFilters(clearedFilters)
  }

  const toggleCategory = (category: EventCategory | PlaceType) => {
    const current = localFilters.categories || []
    const updated = current.includes(category as EventCategory)
      ? current.filter((c) => c !== category)
      : [...current, category as EventCategory]
    setLocalFilters({ ...localFilters, categories: updated })
  }

  const toggleTimeOfDay = (time: TimeOfDay) => {
    const current = localFilters.timeOfDay || []
    const updated = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time]
    setLocalFilters({ ...localFilters, timeOfDay: updated })
  }

  const activeCount = getActiveFilterCount(localFilters)

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[75]}
      dismissOnSnapToBottom
      zIndex={100000}
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$0">
        <Sheet.Handle />
        <YStack f={1}>
          {/* Header */}
          <XStack jc="space-between" ai="center" p="$4" pb="$3">
            <XStack ai="center" gap="$2">
              <Filter size={24} />
              <H4>{t('filters.title')}</H4>
              {activeCount > 0 && (
                <XStack
                  bg="$blue9"
                  px="$2"
                  py="$1"
                  borderRadius="$10"
                  ml="$2"
                >
                  <Paragraph size="$2" color="white" fontWeight="600">
                    {activeCount}
                  </Paragraph>
                </XStack>
              )}
            </XStack>
            <Button
              size="$3"
              chromeless
              onPress={handleClear}
              icon={<X size={16} />}
              disabled={activeCount === 0}
            >
              {t('filters.clear')}
            </Button>
          </XStack>

          <Separator />

          <ScrollView>
            <YStack p="$4" gap="$5">
              {/* Categories / Types */}
              <YStack gap="$3">
                <Label fontSize="$5" fontWeight="600">
                  {type === 'event' ? t('events.categories_title') : t('places.types_title')}
                </Label>
                <Paragraph size="$2" theme="alt2">
                  {type === 'event' ? 'Select one or more categories' : 'Select one or more types'}
                </Paragraph>
                <XStack gap="$2" flexWrap="wrap">
                  {(type === 'event' ? EVENT_CATEGORIES : PLACE_TYPES).map((item) => {
                    const isSelected = localFilters.categories?.includes(item as EventCategory)
                    return (
                      <Button
                        key={item}
                        size="$3"
                        onPress={() => toggleCategory(item)}
                        bg={isSelected ? '$blue9' : '$background'}
                        borderColor={isSelected ? '$blue9' : '$borderColor'}
                        color={isSelected ? 'white' : '$color'}
                        borderRadius="$10"
                        pressStyle={{
                          bg: isSelected ? '$blue8' : '$gray3',
                        }}
                      >
                        {type === 'event' ? t(`events.categories.${item}`) : t(`places.types.${item}`)}
                      </Button>
                    )
                  })}
                </XStack>
              </YStack>

              {/* Date Range - Events Only */}
              {type === 'event' && (
                <>
                  <Separator />

                  <YStack gap="$3">
                    <Label fontSize="$5" fontWeight="600">
                      {t('filters.date_range.title')}
                    </Label>
                    <XStack gap="$2" flexWrap="wrap">
                      {(['all', 'today', 'this_weekend', 'next_week'] as DateRangeType[]).map((dateType) => {
                        const isSelected = localFilters.dateRange?.type === dateType
                        return (
                          <Button
                            key={dateType}
                            size="$3"
                            onPress={() =>
                              setLocalFilters({
                                ...localFilters,
                                dateRange: { type: dateType },
                              })
                            }
                            bg={isSelected ? '$blue9' : '$background'}
                            borderColor={isSelected ? '$blue9' : '$borderColor'}
                            color={isSelected ? 'white' : '$color'}
                            borderRadius="$10"
                            pressStyle={{
                              bg: isSelected ? '$blue8' : '$gray3',
                            }}
                          >
                            {t(`filters.date_range.${dateType}`)}
                          </Button>
                        )
                      })}
                    </XStack>
                  </YStack>

                  <Separator />

                  {/* Time of Day */}
                  <YStack gap="$3">
                    <Label fontSize="$5" fontWeight="600">
                      {t('filters.time_of_day.title')}
                    </Label>
                    <Paragraph size="$2" theme="alt2">
                      Select one or more time slots
                    </Paragraph>
                    <XGroup>
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = localFilters.timeOfDay?.includes(slot.value)
                        return (
                          <XGroup.Item key={slot.value}>
                            <Button
                              onPress={() => toggleTimeOfDay(slot.value)}
                              size="$3"
                              bg={isSelected ? '$blue9' : '$background'}
                              borderColor={isSelected ? '$blue9' : '$borderColor'}
                              color={isSelected ? 'white' : '$color'}
                              pressStyle={{
                                bg: isSelected ? '$blue8' : '$gray3',
                              }}
                              f={1}
                            >
                              {t(slot.labelKey).split(' ')[0]}
                            </Button>
                          </XGroup.Item>
                        )
                      })}
                    </XGroup>
                  </YStack>
                </>
              )}
            </YStack>
          </ScrollView>

          {/* Footer */}
          <YStack p="$4" pt="$3" borderTopWidth={1} borderTopColor="$borderColor">
            <Button size="$5" theme="blue" onPress={handleApply} icon={<Filter />}>
              {t('filters.apply')}
              {activeCount > 0 && ` (${activeCount})`}
            </Button>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
