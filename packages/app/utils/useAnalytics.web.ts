// Web stub for analytics - returns no-op implementations
const noop = () => {}

const stubPostHog = () => ({
  capture: noop,
  identify: noop,
  reset: noop,
  isFeatureEnabled: () => false,
  getFeatureFlag: () => undefined,
  reloadFeatureFlags: noop,
  group: noop,
  alias: noop,
  screen: noop,
  register: noop,
  unregister: noop,
})

export const usePostHog = stubPostHog
export const useFeatureFlag = () => undefined
