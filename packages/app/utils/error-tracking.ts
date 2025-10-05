import { usePostHog } from 'posthog-react-native'
import { Platform } from 'react-native'
import * as Device from 'expo-device'

// Error tracking utilities
export const useErrorTracking = () => {
  const posthog = usePostHog()

  const trackError = (error: Error, context?: Record<string, any>) => {
    posthog?.capture('$exception', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      platform: Platform.OS,
      device_model: Device.modelName,
      device_brand: Device.brand,
      app_version: Device.appVersion,
      ...context,
    })
  }

  const trackCustomError = (message: string, context?: Record<string, any>) => {
    posthog?.capture('$exception', {
      error: message,
      platform: Platform.OS,
      device_model: Device.modelName,
      device_brand: Device.brand,
      app_version: Device.appVersion,
      ...context,
    })
  }

  const trackNetworkError = (url: string, status: number, message: string) => {
    posthog?.capture('$exception', {
      error: `Network Error: ${message}`,
      url,
      status,
      platform: Platform.OS,
      device_model: Device.modelName,
      type: 'network_error',
    })
  }

  const trackValidationError = (field: string, value: any, rule: string) => {
    posthog?.capture('$exception', {
      error: `Validation Error: ${rule}`,
      field,
      value: typeof value === 'string' ? value.substring(0, 100) : value,
      platform: Platform.OS,
      type: 'validation_error',
    })
  }

  return {
    trackError,
    trackCustomError,
    trackNetworkError,
    trackValidationError,
  }
}

// Global error handler
export const setupGlobalErrorHandling = (posthog: any) => {
  // Handle unhandled promise rejections
  const originalHandler = global.ErrorUtils?.getGlobalHandler()
  
  global.ErrorUtils?.setGlobalHandler((error, isFatal) => {
    posthog?.capture('$exception', {
      error: error.message,
      stack: error.stack,
      isFatal,
      platform: Platform.OS,
      device_model: Device.modelName,
      type: 'unhandled_error',
    })
    
    // Call original handler
    if (originalHandler) {
      originalHandler(error, isFatal)
    }
  })
}
