// No-op performance monitoring implementation (PostHog removed)
import { useEffect, useRef } from 'react'

export const usePerformanceMonitor = (screenName: string) => {
  return {
    trackUserAction: (action: string, duration?: number) => {
      // No-op
    },
    trackNetworkRequest: (url: string, duration: number, status: number) => {
      // No-op
    },
  }
}

export const useAppPerformanceMonitor = () => {
  return {
    trackAppMetric: (metric: string, value: number, unit: string = 'ms') => {
      // No-op
    }
  }
}
