import { usePostHog } from 'posthog-react-native'
import { useEffect, useRef } from 'react'

// Performance monitoring utilities
export const usePerformanceMonitor = (screenName: string) => {
  const posthog = usePostHog()
  const startTime = useRef<number>(Date.now())
  const renderStartTime = useRef<number>(Date.now())

  useEffect(() => {
    // Track screen load time
    const loadTime = Date.now() - startTime.current
    posthog?.capture('$performance', {
      metric: 'screen_load_time',
      screen: screenName,
      value: loadTime,
      unit: 'ms',
    })

    // Track render time
    const renderTime = Date.now() - renderStartTime.current
    posthog?.capture('$performance', {
      metric: 'screen_render_time',
      screen: screenName,
      value: renderTime,
      unit: 'ms',
    })

    // Track memory usage if available
    if (performance.memory) {
      posthog?.capture('$performance', {
        metric: 'memory_usage',
        screen: screenName,
        value: performance.memory.usedJSHeapSize,
        unit: 'bytes',
      })
    }
  }, [posthog, screenName])

  const trackUserAction = (action: string, duration?: number) => {
    posthog?.capture('$performance', {
      metric: 'user_action_time',
      screen: screenName,
      action,
      value: duration || 0,
      unit: 'ms',
    })
  }

  const trackNetworkRequest = (url: string, duration: number, status: number) => {
    posthog?.capture('$performance', {
      metric: 'network_request',
      screen: screenName,
      url,
      value: duration,
      status,
      unit: 'ms',
    })
  }

  return {
    trackUserAction,
    trackNetworkRequest,
  }
}

// App-level performance monitoring
export const useAppPerformanceMonitor = () => {
  const posthog = usePostHog()
  const appStartTime = useRef<number>(Date.now())

  useEffect(() => {
    // Track app initialization time
    const initTime = Date.now() - appStartTime.current
    posthog?.capture('$performance', {
      metric: 'app_initialization_time',
      value: initTime,
      unit: 'ms',
    })

    // Track bundle size if available
    if (__DEV__) {
      posthog?.capture('$performance', {
        metric: 'bundle_size',
        value: 0, // Would need to be calculated
        unit: 'bytes',
      })
    }
  }, [posthog])

  return {
    trackAppMetric: (metric: string, value: number, unit: string = 'ms') => {
      posthog?.capture('$performance', {
        metric,
        value,
        unit,
      })
    }
  }
}
