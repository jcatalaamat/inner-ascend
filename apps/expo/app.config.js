require('dotenv').config({ path: '../../.env' })

export default {
  expo: {
    name: 'Inner Ascend',
    slug: 'inner-ascend',
    jsEngine: 'hermes',
    scheme: 'innerascend',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      contentFit: 'contain',
      backgroundColor: '#0A0A0F', // Deep space black (cosmic theme)
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/f4f14c35-489b-4fc5-bd7e-6e156faf5928',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.innerascend.app',
      buildNumber: '1',
      icon: './assets/icon.png',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        "NSBluetoothAlwaysUsageDescription": "This app uses Bluetooth for nearby device verification during sign-in.",
        "NSBluetoothPeripheralUsageDescription": "Bluetooth is used to discover and connect to nearby devices for sign-in flow if needed.",
        "NSUserTrackingUsageDescription": "This identifier will be used to deliver personalized ads to you.",
        CFBundleURLTypes: [
          {
            CFBundleURLName: "GoogleSignIn",
            CFBundleURLSchemes: ['com.googleusercontent.apps.7491021027-dj901lvn943vgmstd41vraejfpinucra']
          }
        ]
      },
      config: {
        googleMobileAdsAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511', // Test ID
      },
    },
    android: {
      softwareKeyboardLayoutMode: 'pan',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0A0A0F', // Deep space black (cosmic theme)
      },
      package: 'com.innerascend.app',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ],
      versionCode: 1,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
        googleMobileAdsAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713', // Test ID
      },
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-localization',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#ffffff',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          // https://react-native-google-signin.github.io/docs/setting-up/expo
          iosUrlScheme: 'com.googleusercontent.apps.7491021027-dj901lvn943vgmstd41vraejfpinucra',
        },
      ],
      'expo-apple-authentication',
      'expo-router',
      [
        'expo-build-properties',
        {
          ios: {
            newArchEnabled: false
          },
          android: {
            newArchEnabled: false
          }
        }
      ],
      'expo-font',
      'expo-secure-store',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow Inner Ascend to use your location for personalized cosmic guidance.',
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
          iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511',
          delayAppMeasurementInit: true,
          userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.',
        },
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: 'inner-ascend',
          project: 'react-native',
          url: 'https://sentry.io/',
        },
      ],
    ],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'f4f14c35-489b-4fc5-bd7e-6e156faf5928',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    owner: process.env.EXPO_OWNER || 'inner-ascend-expo',
  },
}
