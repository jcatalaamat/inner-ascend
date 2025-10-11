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
import { usePostHog } from 'posthog-react-native'

type InsertPlace = Database['public']['Tables']['places']['Insert']

export const CreatePlaceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const toast = useToastController()
  const { profile, user } = useUser()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const imageUploadRef = useRef<UploadImageRef>(null)
  const locationPickerRef = useRef<LocationPickerRef>(null)
  const posthog = usePostHog()

  const CreatePlaceFormSchema = z.object({
    name: formFields.text.min(3).describe(`${t('create.place_form.name')} // Place name`),
    type: formFields.select.describe(`${t('create.place_form.type')} // Category`),
    description: formFields.textarea.describe(`${t('create.place_form.description')} // Tell us more`),
    price_range: formFields.select.describe(`${t('create.place_form.price_range')} // Price level`).nullable().optional(),
    contact_whatsapp: formFields.text.describe('WhatsApp // Contact number').nullable().optional(),
    contact_instagram: formFields.text.describe('Instagram // @handle').nullable().optional(),
    website_url: formFields.text.describe(`Website // URL`).nullable().optional(),
    eco_conscious: formFields.boolean_switch.describe(`Eco-Friendly?`).default(false),
  })
  const mutation = useMutation({
    async onError(error) {
      posthog?.capture('place_creation_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      toast.show(t('common.error'))
      console.log('error', error)
    },

    async mutationFn(data: z.infer<typeof CreatePlaceFormSchema>) {
      const uploadedImageUrl = imageUploadRef.current?.getImageUrl()
      const location = locationPickerRef.current?.getLocation() || {
        name: 'Mazunte',
        lat: 15.6658,
        lng: -96.5347,
        directions: undefined,
      }

      const insertData: InsertPlace = {
        name: data.name.trim(),
        type: data.type,
        category: data.type,
        description: data.description.trim(),
        location_name: location.name.trim(),
        lat: location.lat,
        lng: location.lng,
        location_directions: location.directions || null,
        price_range: data.price_range || null,
        contact_whatsapp: data.contact_whatsapp?.trim() || null,
        contact_instagram: data.contact_instagram?.trim() || null,
        website_url: data.website_url?.trim() || null,
        eco_conscious: data.eco_conscious || false,
        images: uploadedImageUrl ? [uploadedImageUrl] : null,
        created_by: user?.id,
        collaborator_ids: user?.id ? [user.id] : [],
      }
      await supabase.from('places').insert(insertData)
    },

    async onSuccess() {
      posthog?.capture('place_created', {
        place_type: mutation.variables?.type,
        has_image: !!imageUploadRef.current?.getImageUrl(),
        has_location: !!locationPickerRef.current?.getLocation(),
        is_eco_conscious: mutation.variables?.eco_conscious
      })
      onSuccess()
      await queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }

  return (
    <SchemaForm
      onSubmit={(values) => mutation.mutate(values)}
      schema={CreatePlaceFormSchema}
      defaultValues={{
          name: '',
          type: 'wellness',
          description: '',
          price_range: '$$',
          contact_whatsapp: '',
          contact_instagram: '',
          website_url: '',
          eco_conscious: false,
        }}
        props={{
          type: {
            placeholder: t('create.place_form.type'),
            options: [
              { name: t('places.types.retreat'), value: 'retreat' },
              { name: t('places.types.wellness'), value: 'wellness' },
              { name: t('places.types.restaurant'), value: 'restaurant' },
              { name: t('places.types.activity'), value: 'activity' },
              { name: t('places.types.community'), value: 'community' },
            ],
          },
          price_range: {
            placeholder: t('create.place_form.price_range'),
            options: [
              { name: '$', value: '$' },
              { name: '$$', value: '$$' },
              { name: '$$$', value: '$$$' },
              { name: '$$$$', value: '$$$$' },
            ],
          },
        }}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>{t('create.place_form.submit')}</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <YStack gap="$3" py="$4" px="$4" width="100%" maxWidth={480} alignSelf="center">
            {/* Image Upload */}
            <UploadImage
              ref={imageUploadRef}
              bucketName="place-images"
              aspectRatio={[16, 9]}
            />

            {fields.name}
            {fields.type}

            {/* Location Picker */}
            <LocationPicker ref={locationPickerRef} />

            {fields.description}
            {fields.price_range}

            <Separator marginVertical="$2" />
            <Text fontSize="$3" color="$color11" fontWeight="600">Optional Details</Text>

            {fields.contact_whatsapp}
            {fields.contact_instagram}
            {fields.website_url}
            {fields.eco_conscious}
          </YStack>
        )}
      </SchemaForm>
  )
}
