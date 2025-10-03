import * as Sentry from '@sentry/react-native';

// Determine environment from NODE_ENV (supports dev/staging/production)
const getEnvironment = () => {
  return process.env.NODE_ENV || 'production';
};

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development';

// Simple, safe initialization for Expo
Sentry.init({
  dsn: 'https://2f77c6b4748e9a863a593894e56f4cff@o4510118163906560.ingest.de.sentry.io/4510118172491856',

  // Enable debug mode in development
  debug: isDev,

  // Set environment
  environment: getEnvironment(),

  // Enable Sentry in both development and production
  enabled: true,

  // Performance monitoring sample rate
  tracesSampleRate: isDev ? 1.0 : 0.2,

  // Enable native crash handling
  enableNative: true,

  // Enable automatic session tracking
  enableAutoSessionTracking: true,

  // Before send hook
  beforeSend(event, hint) {
    if (isDev) {
      console.log('📨 Sentry Event:', event.message || event.exception);
    }
    return event;
  },
});

// Log initialization (always log to help debug crashes)
console.log('✅ Sentry initialized');
console.log('🌍 Environment:', getEnvironment());
console.log('📍 Debug mode:', isDev);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
