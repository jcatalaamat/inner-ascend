import { FullscreenSpinner, ServiceCard, Text, YStack, SearchBar } from '@my/ui'
import { router } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import { useServicesQuery } from 'app/utils/react-query/useServicesQuery'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePostHog } from 'posthog-react-native'
import { ScreenWrapper } from 'app/components/ScreenWrapper'
import { FavoritesProvider } from 'app/contexts/FavoritesContext'

function ServicesScreenContent() {
  const { t } = useTranslation()
  const posthog = usePostHog()

  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const { data: allServices = [], isLoading, refetch } = useServicesQuery()

  useEffect(() => {
    posthog?.capture('services_screen_viewed')
  }, [posthog])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  // Filter locally for better performance
  const filteredServices = useMemo(() => {
    let filtered = allServices

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [allServices, searchQuery])

  if (isLoading && !allServices.length) {
    return <FullscreenSpinner />
  }

  return (
    <ScreenWrapper>
      {/* Search with Create Button */}
      <SearchBar
        placeholder={t('services.search_placeholder')}
        onSearch={handleSearch}
        defaultValue={searchQuery}
        showCreateButton={true}
        createType="event"
        onCreatePress={() => {
          posthog?.capture('create_button_tapped', { from: 'services', type: 'service' })
          router.push('/create?type=service')
        }}
      />

      {/* Services List */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <YStack px="$4" pb="$3">
            <ServiceCard
              service={item}
              onPress={() => router.push(`/service/${item.id}`)}
              showFavorite
            />
          </YStack>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <YStack ai="center" jc="center" p="$8">
            <Text fontSize="$5" color="$color10" ta="center">
              {t('services.no_results')}
            </Text>
          </YStack>
        }
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 80,
        }}
      />
    </ScreenWrapper>
  )
}

export function ServicesScreen() {
  return (
    <FavoritesProvider>
      <ServicesScreenContent />
    </FavoritesProvider>
  )
}
