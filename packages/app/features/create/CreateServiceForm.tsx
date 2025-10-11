import type { Database } from '@my/supabase/types'
import { FullscreenSpinner, SubmitButton, YStack, useToastController, Text, XStack, Button } from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { UploadImage, type UploadImageRef } from 'app/components/UploadImage'
import { useRef, useState, useCallback } from 'react'
import { usePostHog } from 'posthog-react-native'
import { ServiceOptionsSheet } from './ServiceOptionsSheet'
import { Settings } from '@tamagui/lucide-icons'

type InsertService = Database['public']['Tables']['services']['Insert']

export const CreateServiceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const toast = useToastController()
  const { profile, user } = useUser()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const imageUploadRef = useRef<UploadImageRef>(null)
  const posthog = usePostHog()

  const [deliveryOptions, setDeliveryOptions] = useState<string[]>(['in_person'])
  const [contactMethods, setContactMethods] = useState<string[]>(['whatsapp'])
  const [optionsSheetOpen, setOptionsSheetOpen] = useState(false)

  const handleApplyOptions = useCallback((delivery: string[], contact: string[]) => {
    setDeliveryOptions(delivery)
    setContactMethods(contact)
  }, [])

  const CreateServiceFormSchema = z.object({
    title: formFields.text.min(5).max(100).describe(`${t('create.service_form.service_title')} // ${t('create.service_form.service_title_placeholder')}`),
    category: formFields.select.describe(t('create.service_form.category')),
    description: formFields.textarea.describe(`${t('create.service_form.description')} // ${t('create.service_form.description_placeholder')}`),
    price_type: formFields.select.describe(t('create.service_form.price_type')),
    price_amount: formFields.text.describe(t('create.service_form.price_amount')).nullable().optional(),
    price_notes: formFields.text.describe(`${t('create.service_form.price_notes')} // ${t('create.service_form.price_notes_placeholder')}`).nullable().optional(),
    service_location: formFields.text.describe(`${t('create.service_form.service_location')} // ${t('create.service_form.service_location_placeholder')}`).nullable().optional(),
    eco_conscious: formFields.boolean_switch.describe(t('create.service_form.eco_conscious')).default(false),
  })

  const mutation = useMutation({
    async onError(error) {
      posthog?.capture('service_creation_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      toast.show(t('common.error'))
      console.log('error', error)
    },

    async mutationFn(data: z.infer<typeof CreateServiceFormSchema>) {
      const insertData: InsertService = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        price_type: data.price_type,
        price_amount: data.price_amount ? parseFloat(data.price_amount) : null,
        price_currency: 'MXN',
        price_notes: data.price_notes?.trim() || null,
        service_location: data.service_location?.trim() || null,
        eco_conscious: data.eco_conscious || false,
        available: true,
        delivery_options: deliveryOptions,
        contact_methods: contactMethods,
        images: imageUploadRef.current?.getImageUrl() ? [imageUploadRef.current.getImageUrl()] : [],
        profile_id: user?.id!,
      }

      const { data: newService, error } = await supabase
        .from('services')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      posthog?.capture('service_created', {
        service_id: newService.id,
        category: newService.category,
        price_type: newService.price_type,
      })

      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['my-services'] })

      return newService
    },

    async onSuccess() {
      toast.show(t('create.service_form.success'))
      onSuccess()
    },
  })

  if (!profile) {
    return <FullscreenSpinner />
  }

  return (
    <>
    <SchemaForm
      schema={CreateServiceFormSchema}
      defaultValues={{
        title: '',
        category: 'wellness',
        description: '',
        price_type: 'fixed',
        price_amount: '',
        price_notes: '',
        service_location: '',
        eco_conscious: false,
      }}
      props={{
        category: {
          placeholder: t('create.service_form.category'),
          options: [
            { name: t('services.categories.wellness'), value: 'wellness' },
            { name: t('services.categories.food'), value: 'food' },
            { name: t('services.categories.education'), value: 'education' },
            { name: t('services.categories.art'), value: 'art' },
            { name: t('services.categories.transportation'), value: 'transportation' },
            { name: t('services.categories.accommodation'), value: 'accommodation' },
            { name: t('services.categories.other'), value: 'other' },
          ],
        },
        price_type: {
          placeholder: t('create.service_form.price_type'),
          options: [
            { name: t('services.price_types.fixed'), value: 'fixed' },
            { name: t('services.price_types.hourly'), value: 'hourly' },
            { name: t('services.price_types.daily'), value: 'daily' },
            { name: t('services.price_types.negotiable'), value: 'negotiable' },
            { name: t('services.price_types.donation'), value: 'donation' },
            { name: t('services.price_types.free'), value: 'free' },
          ],
        },
      }}
      onSubmit={async (data) => {
        mutation.mutate(data)
      }}
      renderAfter={({ submit }) => (
        <SubmitButton onPress={submit} isLoading={mutation.isPending}>
          {t('create.service_form.submit')}
        </SubmitButton>
      )}
    >
      {(fields) => (
        <YStack gap="$3" py="$4" px="$4" width="100%" maxWidth={480} alignSelf="center">
          {/* Image Upload */}
          <UploadImage
            ref={imageUploadRef}
            bucketName="services"
            aspectRatio={[4, 3]}
          />

          {/* Essential Fields */}
          {fields.title}
          {fields.category}
          {fields.description}

          {/* Pricing Section */}
          <Text fontSize="$3" color="$color11" fontWeight="600" mt="$2">
            Pricing
          </Text>
          {fields.price_type}
          {fields.price_amount}
          {fields.price_notes}

          {/* Location Section */}
          <Text fontSize="$3" color="$color11" fontWeight="600" mt="$2">
            Location & Details
          </Text>
          {fields.service_location}

          {/* Service Options Button */}
          <Button
            size="$4"
            onPress={() => setOptionsSheetOpen(true)}
            bg="$background"
            borderColor="$borderColor"
            borderWidth={1}
            borderRadius="$4"
            icon={<Settings size={20} />}
            mt="$2"
          >
            <Text>
              {t('create.service_form.service_options')} ({deliveryOptions.length + contactMethods.length})
            </Text>
          </Button>

          {/* Additional Options */}
          {fields.eco_conscious}
        </YStack>
      )}
    </SchemaForm>

    <ServiceOptionsSheet
      open={optionsSheetOpen}
      onOpenChange={setOptionsSheetOpen}
      deliveryOptions={deliveryOptions}
      contactMethods={contactMethods}
      onApply={handleApplyOptions}
    />
  </>
  )
}
