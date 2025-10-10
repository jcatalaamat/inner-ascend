require('dotenv').config({ path: '../../.env' })

export default {
  expo: {
    name: 'Mazunte Connect',
    slug: 'mazunte-connect',
    jsEngine: 'hermes',
    scheme: 'mazunteconnect',
    version: '1.1.13',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      contentFit: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/f4f14c35-489b-4fc5-bd7e-6e156faf5928',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mazunte.connect',
      buildNumber: '7',
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
        backgroundColor: '#FFFFFF',
      },
      package: 'com.mazunte.connect',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ],
      versionCode: 4,
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
          locationAlwaysAndWhenInUsePermission: 'Allow Mazunte Connect to use your location to show nearby events and places.',
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
          iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511',
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
