import { Button, Sheet, YStack, Text, ScrollView, XStack } from '@my/ui'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

interface ServiceOptionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deliveryOptions: string[]
  contactMethods: string[]
  onApply: (delivery: string[], contact: string[]) => void
}

export function ServiceOptionsSheet({
  open,
  onOpenChange,
  deliveryOptions,
  contactMethods,
  onApply,
}: ServiceOptionsSheetProps) {
  const { t } = useTranslation()

  const [localDelivery, setLocalDelivery] = useState<string[]>(deliveryOptions)
  const [localContact, setLocalContact] = useState<string[]>(contactMethods)

  useEffect(() => {
    setLocalDelivery(deliveryOptions)
    setLocalContact(contactMethods)
  }, [deliveryOptions, contactMethods, open])

  const handleApply = () => {
    onApply(localDelivery, localContact)
    onOpenChange(false)
  }

  const toggleDelivery = (value: string) => {
    setLocalDelivery(prev =>
      prev.includes(value) ? prev.filter(o => o !== value) : [...prev, value]
    )
  }

  const toggleContact = (value: string) => {
    setLocalContact(prev =>
      prev.includes(value) ? prev.filter(o => o !== value) : [...prev, value]
    )
  }

  return (
    <Sheet modal open={open} onOpenChange={onOpenChange} snapPoints={[85]}>
      <Sheet.Overlay />
      <Sheet.Frame padding="$4" space="$4" bg="$background">
        <Sheet.Handle />
        <Text fontSize="$7" fontWeight="bold">
          {t('create.service_form.service_options')}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$4">
            {/* Delivery Options */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="600" color="$color12">
                {t('create.service_form.delivery_options')}
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {[
                  { value: 'in_person', label: t('services.delivery_options.in_person') },
                  { value: 'can_travel', label: t('services.delivery_options.can_travel') },
                  { value: 'online', label: t('services.delivery_options.online') },
                  { value: 'delivery', label: t('services.delivery_options.delivery') },
                ].map((option) => {
                  const isSelected = localDelivery.includes(option.value)
                  return (
                    <Button
                      key={option.value}
                      size="$3"
                      onPress={() => toggleDelivery(option.value)}
                      bg={isSelected ? '$blue9' : '$background'}
                      borderColor={isSelected ? '$blue9' : '$borderColor'}
                      color={isSelected ? 'white' : '$color'}
                      borderRadius="$10"
                      pressStyle={{
                        bg: isSelected ? '$blue8' : '$gray3',
                      }}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </XStack>
            </YStack>

            {/* Contact Methods */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="600" color="$color12">
                {t('create.service_form.contact_methods')}
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {[
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: t('common.phone') },
                ].map((option) => {
                  const isSelected = localContact.includes(option.value)
                  return (
                    <Button
                      key={option.value}
                      size="$3"
                      onPress={() => toggleContact(option.value)}
                      bg={isSelected ? '$blue9' : '$background'}
                      borderColor={isSelected ? '$blue9' : '$borderColor'}
                      color={isSelected ? 'white' : '$color'}
                      borderRadius="$10"
                      pressStyle={{
                        bg: isSelected ? '$blue8' : '$gray3',
                      }}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>

        <Button size="$4" theme="blue" onPress={handleApply} mt="$4">
          {t('common.done')}
        </Button>
      </Sheet.Frame>
    </Sheet>
  )
}
