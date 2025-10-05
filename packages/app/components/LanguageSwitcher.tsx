import React from 'react'
import { Settings } from '@my/ui'
import { useLanguage } from 'app/contexts/LanguageContext'
import { useTranslation } from 'react-i18next'
import { Book } from '@tamagui/lucide-icons'

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage()
  const { t } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇲🇽' },
  ]

  const currentLanguageName = languages.find(lang => lang.code === currentLanguage)?.name || 'English'

  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === 'en' ? 'es' : 'en'
    changeLanguage(nextLanguage)
  }

  return (
    <Settings.Item 
      icon={Book}
      accentTheme="green" 
      onPress={toggleLanguage} 
      rightLabel={currentLanguageName}
    >
      {t('settings.language')}
    </Settings.Item>
  )
}
