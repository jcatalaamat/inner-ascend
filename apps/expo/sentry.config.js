import * as Sentry from '@sentry/react-native';

// Determine environment
const getEnvironment = () => {
  if (__DEV__) return 'development';
  return 'production';
};

// Simple, safe initialization for Expo
Sentry.init({
  dsn: 'https://2f77c6b4748e9a863a593894e56f4cff@o4510118163906560.ingest.de.sentry.io/4510118172491856',

  // Enable debug mode in development
  debug: __DEV__,

  // Set environment
  environment: getEnvironment(),

  // Enable Sentry in both development and production
  enabled: true,

  // Performance monitoring sample rate
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,

  // Enable native crash handling
  enableNative: true,

  // Enable automatic session tracking
  enableAutoSessionTracking: true,

  // Before send hook
  beforeSend(event, hint) {
    if (__DEV__) {
      console.log('📨 Sentry Event:', event.message || event.exception);
    }
    return event;
  },
});

// Log initialization
if (__DEV__) {
  console.log('✅ Sentry initialized');
  console.log('🌍 Environment:', getEnvironment());
}
