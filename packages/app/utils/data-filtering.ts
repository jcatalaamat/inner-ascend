import { useUser } from 'app/utils/useUser'

// Data filtering utilities
export const useDataFiltering = () => {
  const { user } = useUser()

  // Check if user is internal (for filtering)
  const isInternalUser = () => {
    if (!user?.email) return false
    
    const internalDomains = [
      '@yourcompany.com',
      '@mazunteconnect.com',
      '@astralintegration.com',
      '@astral-integration.com',
    ]
    
    return internalDomains.some(domain => user.email?.endsWith(domain))
  }

  // Check if user is a test user
  const isTestUser = () => {
    if (!user?.email) return false
    
    const testEmails = [
      'test@',
      'demo@',
      'admin@',
    ]
    
    return testEmails.some(email => user.email?.toLowerCase().includes(email))
  }

  // Filtered capture function
  const captureFiltered = (event: string, properties?: Record<string, any>) => {
    // Skip tracking for internal users in production
    if (__DEV__ || !isInternalUser()) {
        ...properties,
        is_internal_user: isInternalUser(),
        is_test_user: isTestUser(),
      })
    } else {
      console.log(`[PostHog] Skipped tracking for internal user: ${event}`)
    }
  }

  // Filtered identify function
  const identifyFiltered = (distinctId: string, properties?: Record<string, any>) => {
    if (__DEV__ || !isInternalUser()) {
        ...properties,
        is_internal_user: isInternalUser(),
        is_test_user: isTestUser(),
      })
    } else {
      console.log(`[PostHog] Skipped identify for internal user: ${distinctId}`)
    }
  }

  return {
    isInternalUser,
    isTestUser,
    captureFiltered,
    identifyFiltered,
  }
}

// Environment-based filtering
export const shouldTrackEvent = (event: string): boolean => {
  // Skip certain events in development
  if (__DEV__) {
    const skipInDev = [
      '$performance',
      '$exception',
    ]
    
    if (skipInDev.includes(event)) {
      return false
    }
  }
  
  return true
}

// IP-based filtering (if needed)
export const isInternalIP = (ip: string): boolean => {
  const internalIPs = [
    '127.0.0.1',
    '::1',
    'localhost',
  ]
  
  return internalIPs.includes(ip)
}
