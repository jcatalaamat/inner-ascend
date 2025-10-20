# Inner Ascend

A daily spiritual practice app that combines cosmic guidance with structured shadow work curriculum (Being Human 101), guided meditations, journaling, and progress tracking—all in a dark, immersive mobile experience.

## 🌟 What Is It?

**Inner Ascend is Co-Star meets Insight Timer meets Mindvalley—but make it Shadow Work.**

A comprehensive spiritual growth platform that provides:
- Daily cosmic weather and guidance
- Structured 90-day shadow work curriculum (Being Human 101)
- Guided meditations and practices
- Journaling with prompts
- Progress tracking and streaks

## 📱 Core Features

### TODAY (Home)
- Daily cosmic weather (moon phase, planetary transits) [Placeholder]
- Today's shadow work focus from curriculum [Placeholder]
- Guided practice button [Placeholder]
- Emotional check-in (struggling, processing, clear, integrated) [UI Only]
- Streak counter [Mock Data: 23 days]

### JOURNEY (Curriculum)
- Being Human 101: 16 modules [Navigation Working]
- Visual progress tracking [Placeholder]
- Module cards showing status (completed/active/locked) [Visual Only]
- Progressive unlocking system [Future]

### MODULE VIEW
- Daily teachings [Placeholder]
- Guided practices list [Placeholder]
- Journaling prompts [Placeholder]
- Progress completion button [Non-functional]

### PRACTICES LIBRARY
- 7 guided meditations tabs [Navigation Working]
- Journaling prompts by theme [Placeholder]
- Shadow work exercises [Placeholder]
- Standalone or within module flow [Future]

### PROGRESS
- Current & longest streaks [Mock Data]
- Practice breakdown [Mock Data: 42 meditations, 38 journals, 28 exercises]
- Achievement badges [Placeholder]
- Visual timeline [Placeholder]

### JOURNALING
- Daily prompts [Hardcoded]
- Minimal distraction text editor [Working]
- Word count & timer [Word count working, timer placeholder]
- Auto-save [Future]
- Entry history [Future]

---

## 🚧 Current Status: SKELETON PHASE

This is a **skeleton refactor** with navigation structure and placeholder content only.

**What's Working:**
- ✅ 4-tab navigation (TODAY, JOURNEY, PRACTICES, PROGRESS)
- ✅ Drawer navigation
- ✅ Module detail navigation (module/[id])
- ✅ Journaling screen navigation
- ✅ Cosmic color theme applied
- ✅ All screens render without errors
- ✅ Database schema created (fresh start)

**What's NOT Working Yet:**
- ❌ Real cosmic weather data
- ❌ Database queries/mutations
- ❌ Module progression logic
- ❌ Streak tracking
- ❌ Meditation audio player
- ❌ Journaling persistence
- ❌ Achievement system
- ❌ User progress tracking

**Old Features Archived:**
- Events/Places/Services marketplace → `/apps/expo/app/.archive/`
- Old feature modules → `/packages/app/features/.archive/`
- Old contexts → `/packages/app/contexts/.archive/`

**Note:** Archive folders use `.archive` (dot prefix) so Metro bundler ignores them during compilation.

---

## 🏗️ Architecture

### Monorepo Structure:
```
├── apps/
│   ├── expo/                 # React Native app
│   ├── next/                 # Next.js web app (future)
│   └── storybook/           # Component library
├── packages/
│   ├── app/                  # Shared app logic
│   ├── ui/                   # UI component library
│   └── api/                  # Backend API
└── supabase/                 # Database & migrations
```

### Key Technologies:
- **React Native** with Expo
- **Tamagui** for UI components
- **Supabase** for backend
- **TypeScript** throughout
- **React Query** for data fetching
- **Expo Router** for navigation

## 🎨 Design Philosophy

**"Dark, immersive, Pinterest-worthy"**
- Dark theme optimized for contemplation
- Minimal distractions
- Beautiful typography and spacing
- Cosmic/celestial visual elements
- Smooth animations and transitions

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
npx supabase db push

# Reset database
npx supabase db reset
```

## 🌐 Environment Variables

Required environment variables in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_URL`

## 📊 Database Schema

### Core Tables (Fresh Schema - Oct 19, 2024):
- `profiles` - User profiles, preferences, and birth chart data
- `modules` - Being Human 101 curriculum (16 modules seeded)
- `practices` - Meditation and exercise library (7 meditations seeded)
- `journal_entries` - User journaling with prompts
- `user_progress` - Module/practice completion tracking
- `daily_streaks` - Daily practice streaks
- `emotional_checkins` - Daily emotional state tracking
- `cosmic_cache` - Cached daily cosmic weather data

**Migration File:** `supabase/migrations/20251019000000_inner_ascend_schema.sql`

**Note:** All old migrations have been deleted. This is a fresh start for the spiritual practice app.

## 🚀 Deployment

### Local iOS Builds:
When building locally with `yarn ios --device`, regenerate the native iOS directory:

```bash
# From apps/expo directory
yarn expo:prebuild:clean
```

This command:
- Cleans and regenerates the `ios/` directory
- Applies the `newArchEnabled: false` configuration
- Runs `pod install` with proper UTF-8 encoding

**Note**: The `ios/` directory is gitignored and must be regenerated locally.

### EAS Build Profiles:
- **development**: For testing with development client
- **staging**: For internal testing and TestFlight
- **production**: For App Store release

## 🎯 Best Practices

### Component Development:
- Use Tamagui design system
- Implement TypeScript for type safety
- Follow consistent naming conventions
- Use React Query for data fetching

### Performance:
- Optimize images and assets
- Implement proper loading states
- Use FlatList for large lists
- Minimize re-renders

### Accessibility:
- Provide proper labels and descriptions
- Support screen readers
- Ensure proper contrast ratios
- Test with different font sizes

## 🔄 State Management

### Global State:
- **Authentication**: Supabase auth state
- **Theme**: Tamagui theme system
- **User Progress**: React Query cache

### Local State:
- **Forms**: React Hook Form with validation
- **Navigation**: Expo Router
- **Data**: React Query cache

## 📝 Contributing

1. Follow established patterns
2. Use TypeScript for all new code
3. Test on both iOS and Android
4. Maintain design system consistency
5. Write clear commit messages

## 📱 App Configuration

- **Bundle ID (iOS)**: `com.innerascend.app`
- **Package (Android)**: `com.innerascend.app`
- **App Name**: Inner Ascend
- **Slug**: `inner-ascend`
- **Owner**: `inner-ascend-expo`

## 🛠️ Common Issues

### Build Failures:
- Ensure `expo-build-properties` plugin is configured with `newArchEnabled: false`
- Run `npx expo prebuild --clean` if you see codegen errors

### Database Connection:
- Verify Supabase credentials in `.env`
- Check RLS policies are configured
- Ensure migrations are applied

## 🎭 Project Vision

Inner Ascend is designed to be the definitive shadow work companion app—combining the daily engagement of Co-Star, the meditation library of Insight Timer, and the structured curriculum of Mindvalley, all focused specifically on shadow work and inner transformation.

**Target Market**: Spiritually curious individuals (25-45) who have tried meditation apps but want deeper personal growth work with structure and guidance.

**Pricing**: $17/month or $144/year (positioned between Insight Timer and Mindvalley)

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Tamagui Documentation](https://tamagui.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)

---

Built with ❤️ for inner transformation
