import type { Database } from '@my/supabase/types'
import { FullscreenSpinner, SubmitButton, Theme, YStack, useToastController, Text, Separator } from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { UploadImage, type UploadImageRef } from 'app/components/UploadImage'
import { LocationPicker, type LocationPickerRef } from 'app/components/LocationPicker'
import { useRef } from 'react'

type InsertEvent = Database['public']['Tables']['events']['Insert']

export const CreateEventForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const toast = useToastController()
  const { profile, user } = useUser()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const imageUploadRef = useRef<UploadImageRef>(null)
  const locationPickerRef = useRef<LocationPickerRef>(null)

  // Simplified schema - only essential fields
  const CreateEventFormSchema = z.object({
    title: formFields.text.min(3).describe(`${t('create.event_form.title')} // Event name`),
    category: formFields.select.describe(`${t('create.event_form.category')} // Type of event`),
    date: formFields.date.describe(`${t('create.event_form.date')} // When?`),
    time: formFields.text.describe(`${t('create.event_form.time')} // e.g. 18:00`).nullable().optional(),
    description: formFields.textarea.describe(`${t('create.event_form.description')} // Tell us more`).nullable().optional(),
    // Optional fields
    price: formFields.text.describe(`${t('create.event_form.price')} // e.g. Free, $500 MXN`).nullable().optional(),
    organizer_name: formFields.text.describe(`Organizer // Your name or organization`).nullable().optional(),
    contact_whatsapp: formFields.text.describe('WhatsApp // Contact number').nullable().optional(),
    contact_instagram: formFields.text.describe('Instagram // @handle').nullable().optional(),
    eco_conscious: formFields.boolean_switch.describe(`Eco-Friendly?`).default(false),
  })

  const mutation = useMutation({
    async onError(error) {
      toast.show(t('common.error'))
      console.log('error', error)
    },

    async mutationFn(data: z.infer<typeof CreateEventFormSchema>) {
      const location = locationPickerRef.current?.getLocation() || {
        name: 'Mazunte',
        lat: 15.6658,
        lng: -96.5347,
        directions: undefined,
      }

      const insertData: InsertEvent = {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        category: data.category,
        date: data.date.dateValue.toISOString().split('T')[0],
        time: data.time?.trim() || null,
        location_name: location.name.trim(),
        lat: location.lat,
        lng: location.lng,
        location_directions: location.directions || null,
        price: data.price?.trim() || null,
        eco_conscious: data.eco_conscious || false,
        organizer_name: data.organizer_name?.trim() || null,
        contact_whatsapp: data.contact_whatsapp?.trim() || null,
        contact_instagram: data.contact_instagram?.trim() || null,
        image_url: imageUploadRef.current?.getImageUrl() || null,
        profile_id: user?.id,
      }

      const { error } = await supabase.from('events').insert(insertData)
      if (error) throw error
    },

    async onSuccess() {
      onSuccess()
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }

  return (
    <SchemaForm
      onSubmit={(values) => mutation.mutate(values)}
      schema={CreateEventFormSchema}
      defaultValues={{
          title: '',
          category: 'yoga',
          date: { dateValue: new Date() },
          time: '',
          location_name: 'Mazunte',
          description: '',
          price: '',
          organizer_name: '',
          contact_whatsapp: '',
          contact_instagram: '',
          eco_conscious: false,
        }}
        props={{
          category: {
            placeholder: t('create.event_form.category'),
            options: [
              { name: t('events.categories.yoga'), value: 'yoga' },
              { name: t('events.categories.ceremony'), value: 'ceremony' },
              { name: t('events.categories.workshop'), value: 'workshop' },
              { name: t('events.categories.party'), value: 'party' },
              { name: t('events.categories.market'), value: 'market' },
              { name: t('events.categories.other'), value: 'other' },
            ],
          },
        }}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>{t('create.event_form.submit')}</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <YStack gap="$3" py="$4" px="$4" width="100%" maxWidth={480} alignSelf="center">
            {/* Image Upload */}
            <UploadImage
              ref={imageUploadRef}
              bucketName="event-images"
              aspectRatio={[16, 9]}
            />

            {/* Essential Fields */}
            {fields.title}
            {fields.category}
            {fields.date}
            {fields.time}

            {/* Location Picker */}
            <LocationPicker ref={locationPickerRef} />

            {fields.description}

            <Separator marginVertical="$2" />
            <Text fontSize="$3" color="$color11" fontWeight="600">Optional Details</Text>

            {/* Optional Fields */}
            {fields.price}
            {fields.organizer_name}
            {fields.contact_whatsapp}
            {fields.contact_instagram}
            {fields.eco_conscious}
          </YStack>
        )}
      </SchemaForm>
  )
}
