// No-op error tracking implementation (PostHog removed)

export const useErrorTracking = () => {
  return {
    trackError: (error: Error, context?: Record<string, any>) => {
      console.error('Error:', error, context)
    },
    trackCustomError: (message: string, context?: Record<string, any>) => {
      console.error('Custom Error:', message, context)
    },
    trackNetworkError: (url: string, status: number, message: string) => {
      console.error('Network Error:', { url, status, message })
    },
    trackValidationError: (field: string, value: any, rule: string) => {
      console.error('Validation Error:', { field, value, rule })
    },
  }
}

export const setupGlobalErrorHandling = (posthog?: any) => {
  // No-op: error tracking disabled
}
