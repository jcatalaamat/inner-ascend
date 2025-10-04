import { useToastController, YStack } from '@my/ui'
import { useGlobalStore } from 'app/utils/global-store'
import { usePathname } from 'app/utils/usePathname'
import { useRouter } from 'solito/router'
import { useTranslation } from 'react-i18next'

import { CreateEventForm } from './CreateEventForm'
import { CreatePlaceForm } from './CreatePlaceForm'

type CreateScreenProps = {
  type?: 'event' | 'place'
}

export const CreateScreen = ({ type = 'event' }: CreateScreenProps) => {
  const { setToggleCreateModal } = useGlobalStore()
  const pathName = usePathname()
  const toast = useToastController()
  const router = useRouter()
  const { t } = useTranslation()

  const onSuccess = () => {
    toast.show('Successfully created!')

    if (pathName === '/create') {
      router.back()
    } else {
      setToggleCreateModal()
    }
  }

  return (
    <YStack
      f={1}
      bg="$background"
      ai="center"
      w="100%"
      $gtSm={{
        maxWidth: 660,
      }}
    >
      {type === 'event' ? (
        <CreateEventForm onSuccess={onSuccess} />
      ) : (
        <CreatePlaceForm onSuccess={onSuccess} />
      )}
    </YStack>
  )
}
