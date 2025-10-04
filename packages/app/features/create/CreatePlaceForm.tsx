import type { Database } from '@my/supabase/types'
import { FullscreenSpinner, SubmitButton, Theme, YStack, useToastController } from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

type InsertPlace = Database['public']['Tables']['places']['Insert']

export const CreatePlaceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const toast = useToastController()
  const { profile, user } = useUser()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const CreatePlaceFormSchema = z.object({
    name: formFields.text.min(3).describe(`${t('create.place_form.name')} // ${t('create.place_form.name')}`),
    type: formFields.select.describe(`${t('create.place_form.type')} // ${t('create.place_form.type')}`),
    description: formFields.textarea.describe(`${t('create.place_form.description')} // Tell us about this place`),
    location_name: formFields.text.describe(`${t('create.place_form.location')} // e.g. Playa Mermejita, Centro`),
    lat: formFields.number.describe('Latitude // GPS coordinate').default(15.6658),
    lng: formFields.number.describe('Longitude // GPS coordinate').default(-96.7347),
    price_range: formFields.select.describe(`${t('create.place_form.price_range')} // How expensive?`).nullable().optional(),
    contact_phone: formFields.text.describe(`${t('create.place_form.contact_phone')} // Contact number`).nullable().optional(),
    contact_whatsapp: formFields.text.describe('WhatsApp // WhatsApp number').nullable().optional(),
    contact_email: formFields.text.describe(`${t('create.place_form.contact_email')} // Contact email`).nullable().optional(),
    contact_instagram: formFields.text.describe(`${t('create.place_form.contact_instagram')} // Instagram handle`).nullable().optional(),
    website_url: formFields.text.describe(`${t('create.place_form.website')} // Website URL`).nullable().optional(),
    eco_conscious: formFields.boolean_switch.describe(`${t('create.place_form.eco_conscious')} // Is this eco-friendly?`).default(false),
  })
  const mutation = useMutation({
    async onError(error) {
      toast.show(t('common.error'))
      console.log('error', error)
    },

    async mutationFn(data: z.infer<typeof CreatePlaceFormSchema>) {
      const insertData: InsertPlace = {
        name: data.name.trim(),
        type: data.type,
        category: data.type, // Use type as category for simplicity
        description: data.description,
        location_name: data.location_name.trim(),
        lat: data.lat,
        lng: data.lng,
        price_range: data.price_range || null,
        contact_phone: data.contact_phone?.trim() || null,
        contact_whatsapp: data.contact_whatsapp?.trim() || null,
        contact_email: data.contact_email?.trim() || null,
        contact_instagram: data.contact_instagram?.trim() || null,
        website_url: data.website_url?.trim() || null,
        eco_conscious: data.eco_conscious || false,
        created_by: user?.id,
      }
      await supabase.from('places').insert(insertData)
    },

    async onSuccess() {
      onSuccess()
      await queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }

  return (
    <>
      <SchemaForm
        onSubmit={(values) => mutation.mutate(values)}
        schema={CreatePlaceFormSchema}
        defaultValues={{
          name: '',
          type: 'wellness',
          description: '',
          location_name: 'Mazunte',
          lat: 15.6658,
          lng: -96.7347,
          price_range: '$$',
          contact_phone: '',
          contact_whatsapp: '',
          contact_email: '',
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
          <YStack gap="$2" py="$4" pb="$0" pt="$0" minWidth="100%" $gtSm={{ minWidth: 480 }}>
            {Object.values(fields)}
          </YStack>
        )}
      </SchemaForm>
    </>
  )
}
