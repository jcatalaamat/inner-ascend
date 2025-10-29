import * as Sentry from '@sentry/react-native';

// Determine environment from NODE_ENV (more reliable than __DEV__ in standalone builds)
const getEnvironment = () => {
  return process.env.NODE_ENV || 'production';
};

// Simple, safe initialization for Expo
Sentry.init({
  dsn: 'https://cfd237d96798eab930bed44777afa8a2@o4510118163906560.ingest.de.sentry.io/4510273641250896',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

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

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Log initialization (always log to help debug crashes)
console.log('✅ Sentry initialized');
console.log('🌍 Environment:', getEnvironment());
console.log('📍 Debug mode:', __DEV__);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
