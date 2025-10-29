// No-op analytics implementation (PostHog removed)
export const usePostHog = () => ({
  capture: () => {},
  identify: () => {},
  reset: () => {},
  alias: () => {},
  isFeatureEnabled: () => false,
  getFeatureFlag: () => undefined,
  reloadFeatureFlags: () => {},
  group: () => {},
  screen: () => {},
  register: () => {},
  unregister: () => {},
})

export const useFeatureFlag = () => false
