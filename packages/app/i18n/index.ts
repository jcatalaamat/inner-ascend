import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import en from './locales/en.json'
import es from './locales/es.json'

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
}

// Get device language with fallback for development
const getDeviceLanguage = () => {
  try {
    // Try to import expo-localization dynamically to avoid issues in development
    const { getLocales } = require('expo-localization')
    const locales = getLocales()
    const deviceLanguage = locales[0]?.languageCode || 'en'
    // Return 'es' for Spanish, 'en' for English, default to 'en'
    return deviceLanguage.startsWith('es') ? 'es' : 'en'
  } catch (error) {
    // Fallback for development or when native module is not available
    console.warn('Failed to get device language, using fallback:', error.message)
    return 'en'
  }
}

// Check if running in development mode (supports dev/staging/production)
const isDev = process.env.NODE_ENV === 'development'

// Initialize with device language, will be overridden by LanguageProvider
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(), // This will be overridden by LanguageProvider
    fallbackLng: 'en',
    debug: isDev,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  })

export default i18n
