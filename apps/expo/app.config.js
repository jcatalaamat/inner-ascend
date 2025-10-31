require('dotenv').config({ path: '../../.env' })

export default {
  expo: {
    name: 'Inner Ascend',
    slug: 'inner-ascend',
    jsEngine: 'hermes',
    scheme: 'innerascend',
    version: '1.0.2',
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
      url: 'https://u.expo.dev/0ba86799-99f0-4ef5-9841-46061cfd6e80',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.innerascend.app',
      appleTeamId: '3R96Y2JNG8',
      buildNumber: '1',
      icon: './assets/icon.png',
      usesAppleSignIn: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        "NSBluetoothAlwaysUsageDescription": "This app uses Bluetooth for nearby device verification during sign-in.",
        "NSBluetoothPeripheralUsageDescription": "Bluetooth is used to discover and connect to nearby devices for sign-in flow if needed.",
        CFBundleURLTypes: [
          {
            CFBundleURLName: "GoogleSignIn",
            CFBundleURLSchemes: [process.env.GOOGLE_IOS_SCHEME || 'com.googleusercontent.apps.YOUR_GOOGLE_IOS_CLIENT_ID']
          }
        ]
      },
      entitlements: {
        'com.apple.developer.applesignin': ['Default'],
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
      enableProguardInReleaseBuilds: true,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
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
          // This must match the GOOGLE_IOS_SCHEME from your .env file
          iosUrlScheme: process.env.GOOGLE_IOS_SCHEME || 'com.googleusercontent.apps.YOUR_GOOGLE_IOS_CLIENT_ID',
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
        projectId: '0ba86799-99f0-4ef5-9841-46061cfd6e80',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    owner: process.env.EXPO_OWNER || 'inner-ascend-expo',
  },
}
