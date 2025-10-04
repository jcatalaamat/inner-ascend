import type { Database } from '@my/supabase/types'
import { FullscreenSpinner, SubmitButton, Theme, YStack, useToastController } from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

type InsertEvent = Database['public']['Tables']['events']['Insert']

export const CreateEventForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const toast = useToastController()
  const { profile, user } = useUser()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const CreateEventFormSchema = z.object({
    title: formFields.text.min(5).describe(`${t('create.event_form.title')} // ${t('create.event_form.title')}`),
    description: formFields.textarea.describe(`${t('create.event_form.description')} // ${t('create.event_form.description')}`).nullable(),
    category: formFields.select.describe(`${t('create.event_form.category')} // ${t('create.event_form.category')}`),
    date: formFields.date.describe(`${t('create.event_form.date')} // ${t('create.event_form.date')}`),
    time: formFields.text.describe(`${t('create.event_form.time')} // e.g. 18:00 or 18:00-20:00`).nullable().optional(),
    location_name: formFields.text.describe(`${t('create.event_form.location')} // Where is the event?`),
    lat: formFields.number.describe('Latitude // GPS coordinate').default(15.6658),
    lng: formFields.number.describe('Longitude // GPS coordinate').default(-96.7347),
    price: formFields.text.describe(`${t('create.event_form.price')} // e.g. Free, $500 MXN, $20 USD`).nullable().optional(),
    eco_conscious: formFields.boolean_switch.describe(`${t('create.event_form.eco_conscious')} // Is this eco-friendly?`).default(false),
    organizer_name: formFields.text.describe(`${t('create.event_form.organizer')} // Your name or organization`).nullable().optional(),
    contact_phone: formFields.text.describe('Phone // Contact number').nullable().optional(),
    contact_whatsapp: formFields.text.describe('WhatsApp // WhatsApp number').nullable().optional(),
    contact_email: formFields.text.describe('Email // Contact email').nullable().optional(),
    contact_instagram: formFields.text.describe('Instagram // Instagram handle').nullable().optional(),
    image_url: formFields.text.describe(`${t('create.event_form.image')} // Optional event image`).nullable().optional(),
  })
  const mutation = useMutation({
    async onError(error) {
      toast.show(t('common.error'))
      console.log('error', error)
    },

    async mutationFn(data: z.infer<typeof CreateEventFormSchema>) {
      const insertData: InsertEvent = {
        title: data.title.trim(),
        description: data.description,
        category: data.category,
        date: data.date.dateValue.toISOString().split('T')[0],
        time: data.time?.trim() || null,
        location_name: data.location_name.trim(),
        lat: data.lat,
        lng: data.lng,
        price: data.price?.trim() || null,
        eco_conscious: data.eco_conscious || false,
        organizer_name: data.organizer_name?.trim() || null,
        contact_phone: data.contact_phone?.trim() || null,
        contact_whatsapp: data.contact_whatsapp?.trim() || null,
        contact_email: data.contact_email?.trim() || null,
        contact_instagram: data.contact_instagram?.trim() || null,
        image_url: data.image_url?.trim() || null,
        profile_id: user?.id,
      }
      await supabase.from('events').insert(insertData)
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
    <>
      <SchemaForm
        onSubmit={(values) => mutation.mutate(values)}
        schema={CreateEventFormSchema}
        defaultValues={{
          title: '',
          description: '',
          category: 'yoga',
          date: {
            dateValue: new Date(),
          },
          time: '',
          location_name: 'Mazunte',
          lat: 15.6658,
          lng: -96.7347,
          price: '',
          eco_conscious: false,
          organizer_name: '',
          contact_phone: '',
          contact_whatsapp: '',
          contact_email: '',
          contact_instagram: '',
          image_url: '',
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
          <YStack gap="$2" py="$4" pb="$0" pt="$0" minWidth="100%" $gtSm={{ minWidth: 480 }}>
            {Object.values(fields)}
          </YStack>
        )}
      </SchemaForm>
    </>
  )
}
