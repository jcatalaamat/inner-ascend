# Mazunte Connect

A React Native app for discovering events and places in Mazunte, Mexico, with full Spanish/English internationalization support.

## 🌍 Internationalization (i18n)

This app supports **Spanish** and **English** languages with automatic device language detection and user preference persistence.

### Key Features:
- **Automatic language detection** based on device settings
- **Persistent language preference** using AsyncStorage (survives app restarts)
- **Real-time language switching** in settings
- **Comprehensive translations** for all UI elements
- **Localized content** for events, places, categories, and forms

### Implementation:
- **react-i18next** for translation management
- **expo-localization** for device language detection
- **AsyncStorage** for preference persistence
- **LanguageContext** for state management
- **Translation files** in `packages/app/i18n/locales/`

## 🏗️ Architecture

### Monorepo Structure:
```
├── apps/
│   ├── expo/                 # React Native app
│   ├── next/                 # Next.js web app
│   └── storybook/           # Component library
├── packages/
│   ├── app/                  # Shared app logic
│   ├── ui/                   # UI component library
│   └── api/                   # Backend API
└── supabase/                 # Database & migrations
```

### Key Technologies:
- **React Native** with Expo
- **Tamagui** for UI components
- **Supabase** for backend
- **TypeScript** throughout
- **React Query** for data fetching
- **Expo Router** for navigation

## 🎨 UI/UX Patterns

### ScreenWrapper Component:
Consistent safe area handling across all screens:
```tsx
<ScreenWrapper>
  <YourContent />
</ScreenWrapper>
```

### Horizontal Scrolling Filters:
- Events and Places pages have horizontally scrollable category/type filters
- Proper touch targets and spacing
- Localized filter labels

### Two-Step Map Interaction:
- **First tap**: Shows info popup
- **Second tap**: Navigates to detail page
- Prevents accidental navigation

## 📱 Core Features

### Events:
- Browse upcoming events with category filters
- Event details with organizer contact
- Add to favorites functionality
- Map integration with coordinates

### Places:
- Discover local businesses and attractions
- Type-based filtering (restaurant, wellness, etc.)
- Contact information and social links
- Eco-conscious and verified badges

### Map:
- Interactive map with event and place markers
- Toggle between events, places, or both
- Two-step interaction for better UX
- Real coordinates for Mazunte locations

### Favorites:
- Save events and places
- Separate tabs for events and places
- Persistent storage

## 🔧 Development

### Setup:
```bash
# Install dependencies
yarn install

# Start development server
cd apps/expo
npx expo start
```

### Building:
```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios
```

### Database:
```bash
# Apply migrations
supabase db push

# Reset database
supabase db reset
```

## 🌐 Localization Guide

### Adding New Translations:

1. **Add keys to translation files:**
```json
   // packages/app/i18n/locales/en.json
   {
     "new_section": {
       "key": "English text"
     }
   }
   ```

2. **Add Spanish translation:**
   ```json
   // packages/app/i18n/locales/es.json
   {
     "new_section": {
       "key": "Texto en español"
  }
}
```

3. **Use in components:**
```tsx
   import { useTranslation } from 'react-i18next'
   
   const { t } = useTranslation()
   return <Text>{t('new_section.key')}</Text>
   ```

### Translation Key Structure:
- `common.*` - Common UI elements (buttons, labels)
- `navigation.*` - Navigation labels
- `events.*` - Event-related content
- `places.*` - Place-related content
- `map.*` - Map interface
- `favorites.*` - Favorites functionality
- `profile.*` - User profile
- `settings.*` - Settings pages
- `auth.*` - Authentication

## 🚀 Deployment

### Local iOS Builds:
When building locally with `yarn ios --device`, you need to regenerate the native iOS directory after pulling changes:

```bash
# From apps/expo directory
yarn expo:prebuild:clean
```

This command:
- Cleans and regenerates the `ios/` directory
- Applies the `newArchEnabled: false` configuration from app.config.js
- Runs `pod install` with proper UTF-8 encoding
- Ensures react-native-google-mobile-ads builds correctly

**Note**: The `ios/` directory is gitignored and must be regenerated locally. The expo-build-properties configuration in app.config.js ensures New Architecture is disabled.

### EAS Build Profiles:
- **development**: For testing with development client
- **staging**: For internal testing and TestFlight
- **production**: For App Store release

### Environment Variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_URL`

## 📊 Database Schema

### Events:
- `id`, `title`, `description`, `date`, `time`
- `location_name`, `lat`, `lng`
- `category`, `price`, `organizer_id`
- `image_url`, `tags`, `eco_conscious`, `verified`

### Places:
- `id`, `name`, `description`, `type`, `category`
- `location_name`, `lat`, `lng`
- `hours`, `price_range`, `contact_*`
- `images`, `tags`, `eco_conscious`, `verified`

### Favorites:
- `id`, `user_id`, `item_id`, `type` (event/place)

## 🎯 Best Practices

### Component Development:
- Use `ScreenWrapper` for consistent safe areas
- Implement `useTranslation` hook for i18n
- Follow Tamagui design system
- Use TypeScript for type safety

### Performance:
- Use React Query for data fetching
- Implement proper loading states
- Optimize images and assets
- Use FlatList for large lists

### Accessibility:
- Provide proper labels and descriptions
- Support screen readers
- Ensure proper contrast ratios
- Test with different font sizes

## 🔄 State Management

### Global State:
- **Authentication**: Supabase auth state
- **Language**: LanguageContext with AsyncStorage
- **Theme**: Tamagui theme system

### Local State:
- **Forms**: React Hook Form with validation
- **Navigation**: Expo Router
- **Data**: React Query cache

## 📝 Contributing

1. Follow the established patterns for i18n
2. Use TypeScript for all new code
3. Test on both iOS and Android
4. Ensure translations are complete
5. Follow the component library patterns

## 💰 Monetization (AdMob)

### Implementation:
- **react-native-google-mobile-ads** v15.8.0 for banner and interstitial ads
- **PostHog feature flags** for independent A/B testing and gradual rollout:
  - `enable-banner-ads` - Controls banner ads on Favorites screen
  - `enable-interstitial-ads` - Controls interstitial ads on Event/Place detail screens
  - `show-native-ads` - Controls in-feed native ads on Events/Places lists
- **Banner ads** on Favorites screen (bottom)
- **Interstitial ads** after every 3rd event view (3-minute frequency cap)
- **Native ads** in Events and Places lists (every 5 items)

### Ad Placements:
- Events list screen (native ads in-feed)
- Places list screen (native ads in-feed)
- Favorites screen (bottom banner)
- Event detail screen (interstitial after 3 views)
- Place detail screen (interstitial after 3 views)

### Configuration:
Ad unit IDs are stored in `.env` file:
- `EXPO_PUBLIC_ADMOB_IOS_APP_ID`
- `EXPO_PUBLIC_ADMOB_IOS_EVENTS_BANNER`
- `EXPO_PUBLIC_ADMOB_IOS_PLACES_BANNER`
- `EXPO_PUBLIC_ADMOB_IOS_FAVORITES_BANNER`
- `EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL`
- (Similar Android keys)

### Build Configuration:
**IMPORTANT**: The app must have New Architecture explicitly disabled to build with react-native-google-mobile-ads.

The fix is configured in `apps/expo/app.config.js` using `expo-build-properties`:
```javascript
[
  'expo-build-properties',
  {
    ios: { newArchEnabled: false },
    android: { newArchEnabled: false }
  }
]
```

**📖 For detailed documentation about this fix, see [docs/ADMOB_NEW_ARCHITECTURE_FIX.md](docs/ADMOB_NEW_ARCHITECTURE_FIX.md)**

This document explains:
- Why the fix is needed
- How it works for EAS and local builds
- What happens if you delete the ios/ folder
- How to verify the configuration
- Troubleshooting steps

## 🐛 Common Issues

### AdMob Build Failures:
- Ensure `expo-build-properties` plugin is configured with `newArchEnabled: false` in `apps/expo/app.config.js`
- This prevents react-native-google-mobile-ads from looking for New Architecture codegen specs
- Run `npx expo prebuild --clean` if you see `RNGoogleMobileAdsSpec.h` not found errors

### Language Not Persisting:
- Check AsyncStorage implementation
- Verify LanguageProvider wrapping
- Ensure proper initialization order

### Safe Area Issues:
- Use ScreenWrapper component
- Check safe area insets
- Test on different device sizes

### Translation Missing:
- Add keys to both language files
- Check key structure and nesting
- Verify useTranslation hook usage