// Stub for posthog-react-native on web
// This provides a no-op implementation for server-side rendering and web

const noop = () => {}
const noopAsync = async () => {}

// Create a stable posthog instance
const posthogInstance = {
  capture: noop,
  identify: noop,
  reset: noop,
  isFeatureEnabled: () => false,
  getFeatureFlag: () => undefined,
  reloadFeatureFlags: noopAsync,
  group: noop,
  alias: noop,
  screen: noop,
  register: noop,
  unregister: noop,
  opt_in_capturing: noop,
  opt_out_capturing: noop,
  has_opted_in_capturing: () => false,
  has_opted_out_capturing: () => false,
  clear_opt_in_out_capturing: noop,
}

// Return the same instance for all hook calls
const usePostHog = () => posthogInstance
const useFeatureFlag = () => undefined
const useActiveFeatureFlags = () => []

// Simple pass-through component
const PostHogProvider = ({ children }) => children

module.exports = {
  usePostHog,
  PostHogProvider,
  useFeatureFlag,
  useActiveFeatureFlags,
  withPostHogProvider: (Component) => Component,
}
