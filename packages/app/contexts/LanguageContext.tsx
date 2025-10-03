import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { usePostHog } from 'posthog-react-native'

interface LanguageContextType {
  currentLanguage: string
  changeLanguage: (language: string) => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = '@preferred_language'

// Start early - load language preference immediately
let persistedLanguage: string | null = null
export const loadLanguagePromise = AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
loadLanguagePromise.then((val) => {
  persistedLanguage = val
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null) // Start with null
  const [isRTL, setIsRTL] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    async function loadLanguage() {
      try {
        await loadLanguagePromise
        const savedLanguage = persistedLanguage || i18n.language
        await i18n.changeLanguage(savedLanguage)
        setCurrentLanguage(savedLanguage)
        setIsRTL(savedLanguage === 'ar')
      } catch (error) {
        console.error('Failed to load saved language:', error)
        setCurrentLanguage(i18n.language)
      }
    }
    loadLanguage()
  }, [i18n])

  useEffect(() => {
    if (currentLanguage) {
      AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage)
    }
  }, [currentLanguage])

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language)
      setCurrentLanguage(language)
      setIsRTL(language === 'ar')

      // Track language change in PostHog
      posthog?.capture('language_changed', {
        from_language: currentLanguage,
        to_language: language,
        preferred_language: language,
      })
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  // Don't render until language is loaded (like theme)
  if (currentLanguage === null) {
    return null
  }

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    isRTL,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
