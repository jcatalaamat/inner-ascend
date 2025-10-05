import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import 'react-native-url-polyfill/auto'
import React from 'react'

console.log('🚀 App starting...')
console.log('📦 React Native loaded')

//NOTE: do not remove. this is a workaround for build to work with expo v51.0.0
React.AnimatedComponent = ({ children }) => <>{children}</>

// Initialize Sentry AFTER React Native polyfills are loaded
try {
  require('./sentry.config')
  console.log('✅ Sentry config loaded')
} catch (error) {
  console.error('❌ Failed to load Sentry:', error)
  // Continue without Sentry rather than crashing
}

// Must be exported or Fast Refresh won't update the context
export function App() {
  try {
    const ctx = require.context('./app')
    console.log('✅ App context loaded')
    return <ExpoRoot context={ctx} />
  } catch (error) {
    console.error('❌ Failed to load app:', error)
    // If Sentry is loaded, try to report
    if (typeof global.Sentry !== 'undefined') {
      global.Sentry.captureException(error)
    }
    throw error
  }
}

console.log('✅ Registering root component')
registerRootComponent(App)
