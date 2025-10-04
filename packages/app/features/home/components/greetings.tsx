import { H2, Text } from '@my/ui'
import { useUser } from 'app/utils/useUser'
import { useTranslation } from 'react-i18next'

export const Greetings = () => {
  const { user, profile } = useUser()
  const { t } = useTranslation()

  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = profile?.name || user?.email?.split('@')[0] || 'there'
    
    if (hour < 12) {
      return t('greetings.morning', { name })
    } else if (hour < 18) {
      return t('greetings.afternoon', { name })
    } else {
      return t('greetings.evening', { name })
    }
  }

  return (
    <H2 m="$4">
      {getGreeting()}
    </H2>
  )
}
