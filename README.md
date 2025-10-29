# Inner Ascend

A daily spiritual practice app that combines cosmic guidance with structured shadow work curriculum (Being Human 101), guided meditations, journaling, and progress tracking—all in a dark, immersive mobile experience.

## 🌟 What Is It?

**Inner Ascend is Co-Star meets Insight Timer meets Mindvalley—but make it Shadow Work.**

A comprehensive spiritual growth platform that provides:
- Daily cosmic weather and guidance
- Structured 155+ day shadow work curriculum (Being Human 101)
- Guided meditations and practices library
- Journaling with themed prompts
- Progress tracking and streaks
- Live community healing circles and workshops

---

## 📱 Navigation Structure

### 5 Main Tabs

#### 1. **TODAY** (`/index`)
Daily practice dashboard and engagement hub
- **Greeting & Date**: Personalized welcome with current date
- **Streak Counter**: Current streak with fire emoji 🔥
- **Emotional Check-In**: 4-state emotion tracker
  - 🌊 Struggling
  - 🌀 Processing
  - ✨ Clear
  - ⭐ Integrated
- **Cosmic Weather Card**: Moon phase and daily cosmic guidance
- **Today's Practice Card**: Current module/day content preview
- **Quick Actions**: Start module or journaling buttons

#### 2. **JOURNEY** (`/journey`)
Being Human 101 curriculum overview
- **16 Module Cards** with progress indicators
- **Status System**:
  - 🔒 Locked (requires previous module completion)
  - ▶️ Ready (available to start)
  - 🔥 Active (currently working on)
  - ✅ Complete (finished)
- **Progressive Unlocking**: Complete one module to unlock the next
- **Progress Percentage**: Visual completion indicators
- **Time-Lock Display**: 24-hour wait between days

#### 3. **COMMUNITY** (`/community`)
Live healing circles and workshops
- **Upcoming/Past Tabs**: Session timeline
- **Session Types**:
  - Healing Circle
  - Workshop
  - Meditation
  - Q&A
- **RSVP System**: Coming/Maybe status
- **Join Call Buttons**: Zoom/Google Meet integration
- **Facilitator Info**: Session leader details
- **Date/Time Display**: Scheduled session information

#### 4. **PRACTICES** (`/practices`)
Library of all practices with 3 sub-tabs
- **Meditations Tab**: 7 guided meditations with audio
  - Shadow Integration (12 min)
  - Inner Child Reconnection (18 min)
  - Somatic Release: Shaking (8 min)
  - Grounding + Anchoring (5 min)
  - Parts Dialogue Guidance (15 min)
  - Heart Opening (10 min)
  - Integration & Completion (14 min)
- **Prompts Tab**: Themed journaling prompts
  - Shadow Work
  - Inner Child
  - Core Wounds
  - Radical Honesty
  - Integration
- **Exercises Tab**: Shadow work and somatic exercises

#### 5. **PROGRESS** (`/progress`)
User journey tracking and statistics
- **Days Practiced**: Total lifetime count
- **Streak Stats**: Current and longest streaks
- **Emotional Journey**: Last 7 days timeline visualization
- **Module Progress**: 16 dots showing completion status
- **Practice Breakdown**: Meditations/journals/exercises counts
- **Recent Journal Entries**: Last 3 entries preview
- **Journal Stats**: Total words, average per entry
- **Achievement Badges**: (Coming soon section)

### Modal/Stack Screens

#### Module Detail Screen (`/module/[id]`)
Daily module content and progression interface
- **Day Navigator**: Jump between days with lock indicators
- **Time-Lock System**: 24-hour wait between days
- **Today's Teaching**: Concept/theory section
- **Today's Practice**: Practice instructions
- **Journaling Section**: Reflection prompts
- **Mark Day Complete**: Progress button
- **Module Celebration**: Completion screen with confetti
- **Auto-Navigation**: Flows to next day/module

#### Journaling Screen (`/journaling`)
Distraction-free writing interface
- **Prompt Display**: From URL param or default prompt
- **Text Editor**: Full-screen minimal editor
- **Word Count**: Live character/word tracking
- **Session Timer**: Writing session duration
- **Save Button**: Persist entry to database
- **View History**: Link to past entries

#### Journal History (`/journal-history`)
All past journal entries list
- **Date-grouped Entries**: Chronological listing
- **Word Count**: Per entry metadata
- **Tap to View**: Navigate to full entry

#### Individual Journal Entry (`/journal/[id]`)
Full journal entry detail view
- **Prompt Display**: Original prompt used
- **Full Content**: Complete entry text
- **Metadata**: Date, time, word count
- **Edit/Delete**: (Feature in development)

#### Settings Screens
- **Settings Index** (`/settings/index`): App configuration hub
- **Notifications** (`/settings/notifications`): Notification preferences
- **Device Info** (`/settings/device-info`): App/device details

#### Authentication Screens (`/(auth)`)
- **Sign In**: Email/password login
- **Sign Up**: New account creation
- **Reset Password**: Password recovery
- **Onboarding**: First-time user flow

---

## 🎯 Core Features

### 1. Being Human 101 Curriculum

**16 Structured Modules** (155+ days total):

1. **Awakening** (7 days) - Introduction to shadow work
2. **Core Wounds** (7 days) - Identifying foundational pain
3. **Shadow Work & Radical Honesty** (14 days) - Deep integration
4. **Inner Child Healing** (14 days) - Reconnecting with younger self
5. **Somatic Release** (10 days) - Body-based trauma release
6. **Boundaries & Protection** (7 days) - Energetic boundaries
7. **Authentic Expression** (10 days) - Voice and truth
8. **Shame & Vulnerability** (14 days) - Brené Brown-inspired work
9. **Grief & Loss** (10 days) - Processing loss
10. **Anger & Power** (10 days) - Healthy anger expression
11. **Fear & Safety** (10 days) - Building inner safety
12. **Love & Intimacy** (14 days) - Relational healing
13. **Life Purpose** (10 days) - Finding meaning
14. **Spiritual Integration** (10 days) - Synthesizing learnings
15. **Embodiment Practices** (10 days) - Living the work
16. **Mastery & Beyond** (10 days) - Advanced practices

**Features**:
- Progressive unlocking (complete previous to unlock next)
- 24-hour time locks between days
- Daily teachings + practices + journaling prompts
- Visual progress tracking
- Module completion celebrations

### 2. Daily Practice System

**Emotional Check-In**:
- 4-state emotion tracker (Struggling → Processing → Clear → Integrated)
- One check-in per day
- Visualized in emotional journey timeline
- Emoji-based visual feedback

**Streak Tracking**:
- Current streak counter with fire emoji
- Longest streak record
- Daily practice completion triggers streak
- Motivational messages based on streak length

**Cosmic Weather**:
- Daily cosmic guidance and insights
- Moon phase display
- Planetary transit information (coming soon)
- Cached for performance

### 3. Guided Practices Library

**7 Meditations** (pre-seeded):
- Audio-guided meditation tracks
- Duration: 5-18 minutes
- Themes: Shadow integration, inner child, somatic release, grounding
- Play controls with duration display
- Can be used standalone or within modules

**Journaling Prompts**:
- Organized by theme (shadow work, inner child, core wounds, etc.)
- Deep reflection questions
- Can be used independently or from module flow

**Shadow Work Exercises**:
- Somatic practices
- Parts work exercises
- Integration activities

### 4. Journaling System

**Writing Interface**:
- Minimal, distraction-free text editor
- Full-screen mode
- Live word count tracking
- Session timer for writing duration
- Prompt display at top

**Entry Management**:
- Save entries to database
- View history of all entries
- Organized chronologically
- Word count and metadata per entry
- Stats tracking (total words, average per entry)

**Prompt Integration**:
- Accept prompts from modules
- Accept prompts from practice library
- Default prompts available
- Custom free-form writing

### 5. Community Features

**Live Sessions**:
- Healing circles
- Workshops
- Group meditations
- Q&A sessions

**RSVP System**:
- Yes/Maybe/No responses
- Track attendance
- Join call links (Zoom/Google Meet)

**Session Management**:
- Upcoming sessions view
- Past sessions archive
- Facilitator information
- Session descriptions
- Date/time/duration display

### 6. Progress Tracking

**Streak System**:
- Current streak counter
- Longest streak record
- Daily practice completion tracking
- Visual streak indicators

**Module Progress**:
- 16 dots representing all modules
- Color-coded completion status
- Percentage complete per module
- Overall curriculum progress

**Practice Statistics**:
- Total meditations completed
- Total journal entries written
- Total exercises completed
- Total days practiced

**Emotional Timeline**:
- Last 7 days of check-ins visualized
- Emoji-based representation
- Track emotional patterns over time

**Journal Metrics**:
- Total words written
- Average words per entry
- Recent entries preview
- Entry count

### 7. User Profile System

**Profile Data**:
- Avatar upload
- Full name
- Email
- Bio/description

**Birth Chart Integration**:
- Birth date
- Birth time
- Birth location
- Sun sign
- Moon sign
- Rising sign

**Settings**:
- Notification preferences
- Language selection
- Device information
- App version

---

## 📊 Database Schema

### 10 Core Tables

#### 1. **profiles**
User profiles and cosmic data
```sql
- id (UUID, references auth.users)
- email, full_name, avatar_url
- birth_date, birth_time, birth_location
- sun_sign, moon_sign, rising_sign
- created_at, updated_at
```
**RLS**: Users can view/update own profile

#### 2. **modules**
Being Human 101 curriculum modules
```sql
- id (serial primary key)
- title, description
- duration_days (7-14)
- sequence_order (1-16)
- created_at
```
**Data**: 16 modules pre-seeded
**Public Read**: No RLS (public content)

#### 3. **practices**
Meditations, exercises, journaling prompts
```sql
- id (UUID)
- title, type (meditation/exercise/journaling)
- duration_minutes
- audio_url, description, instructions
- created_at
```
**Data**: 7 meditations pre-seeded
**Public Read**: No RLS (public content)

#### 4. **user_progress**
Track module/day completion
```sql
- id (UUID)
- user_id, module_id, practice_id
- day_number (which day of module)
- completed_at
- UNIQUE(user_id, module_id, day_number)
```
**RLS**: Users can view/insert own progress

#### 5. **journal_entries**
User journal entries
```sql
- id (UUID)
- user_id, module_id (optional)
- prompt, content
- word_count
- created_at, updated_at
```
**RLS**: Full CRUD for own entries

#### 6. **daily_streaks**
Track daily practice activity
```sql
- id (UUID)
- user_id
- practice_date (date)
- practices_completed (count)
- UNIQUE(user_id, practice_date)
```
**RLS**: Users can view/insert/update own streaks

#### 7. **emotional_checkins**
Daily emotional state tracking
```sql
- id (UUID)
- user_id
- emotion_state (struggling/processing/clear/integrated)
- checkin_date
- UNIQUE(user_id, checkin_date)
```
**RLS**: Users can view/insert/update own check-ins

#### 8. **cosmic_cache**
Cache daily cosmic weather data
```sql
- id (UUID)
- cache_date (date, unique)
- moon_phase, moon_sign
- planetary_transits (JSONB)
- daily_message
```
**Public Read**: No RLS (shared cache)

#### 9. **live_sessions**
Community healing circles and workshops
```sql
- id (UUID)
- title, description
- session_date, session_time, duration_minutes
- meeting_url, meeting_password
- facilitator, max_participants
- session_type (healing_circle/workshop/meditation/q_and_a)
- is_published
```
**RLS**: Anyone can view published sessions
**Sample Data**: 4 sessions seeded

#### 10. **session_rsvps**
Track user RSVPs for sessions
```sql
- id (UUID)
- session_id, user_id
- rsvp_status (yes/maybe/no)
- UNIQUE(session_id, user_id)
```
**RLS**: Users can manage own RSVPs

### Database Functions

**handle_new_user()**: Auto-create profile on signup
**update_updated_at_column()**: Auto-update timestamps

### Indexes
- `user_progress(user_id, module_id)`
- `journal_entries(user_id)`
- `daily_streaks(user_id, practice_date)`
- `emotional_checkins(user_id, checkin_date)`
- `live_sessions(session_date, is_published)`
- `session_rsvps(session_id, user_id)`

---

## 🎨 Design System

### Color Palette: Dark Cosmic Aesthetic

**Background Layers**:
- `deepSpace1`: #0A0A0F (almost black, subtle blue)
- `deepSpace2`: #121218 (card backgrounds)
- `deepSpace3`: #1A1A24 (elevated surfaces)

**Primary Brand**:
- `cosmicViolet`: #8B7BF7 (main accent)
- `cosmicVioletHover`: #6B5BD6
- `cosmicVioletLight`: #A99BFF

**Text Colors**:
- `silverMoon`: #E8E6F0 (primary text)
- `silverMoon2`: #B8B5C8 (secondary text)
- `silverMoon3`: #6E6B7D (tertiary/disabled)

**Semantic Colors**:
- `integrationGreen`: #4ECDC4 (success/completed)
- `integrationGreenDark`: #3DA69E
- `innerChildGold`: #FFD93D (achievements/streaks)
- `innerChildGoldDark`: #E8C547

**Shadow/Depth**:
- `shadowPurple`: #2D1B3D
- `shadowPurple2`: #1F1428

### UI Components

**From Tamagui**:
- Layout: YStack, XStack, ScrollView, Card
- Typography: Text, H1-H6, Paragraph
- Inputs: Button, TextArea, Input
- Feedback: Spinner, Toast
- Media: Avatar, Image

**Custom Components**:
- PracticeDetailSheet
- EmptyStateCard
- ScreenWrapper
- LanguageSwitcher
- UploadImage
- ImageViewer

### Design Patterns

**Cards**:
- Dark backgrounds (`deepSpace2`)
- Rounded corners
- Press states with opacity/scale
- Consistent padding ($4-$5)

**Status Indicators**:
- Emoji-based (🔒 locked, ✅ complete, 🔥 active)
- Color-coded borders
- Progress bars with `cosmicViolet`
- Completion checkmarks in `integrationGreen`

**Typography Hierarchy**:
- Large headers: $8-$10
- Section titles: $6
- Body text: $3-$4
- Labels: $2-$3

**Interactive Elements**:
- Buttons with theme variants
- Press animations
- Disabled states with reduced opacity
- Loading spinners

---

## 🏗️ Architecture

### Monorepo Structure
```
├── apps/
│   ├── expo/                 # React Native app (iOS/Android)
│   │   ├── app/             # Expo Router screens
│   │   │   ├── (drawer)/   # Drawer navigation
│   │   │   │   ├── (tabs)/ # Bottom tab navigation
│   │   │   │   │   ├── index.tsx      # TODAY tab
│   │   │   │   │   ├── journey.tsx    # JOURNEY tab
│   │   │   │   │   ├── community.tsx  # COMMUNITY tab
│   │   │   │   │   ├── practices.tsx  # PRACTICES tab
│   │   │   │   │   └── progress.tsx   # PROGRESS tab
│   │   │   │   └── _layout.tsx
│   │   │   ├── module/[id].tsx        # Module detail
│   │   │   ├── journaling.tsx         # Journaling screen
│   │   │   ├── journal-history.tsx    # Entry list
│   │   │   └── journal/[id].tsx       # Entry detail
│   │   └── assets/          # Images, fonts, etc.
│   ├── next/                # Next.js web app (future)
│   └── storybook/          # Component library
├── packages/
│   ├── app/                 # Shared app logic
│   │   ├── features/       # Feature modules
│   │   ├── components/     # Shared components
│   │   ├── utils/          # Utilities and hooks
│   │   └── content/        # Module content JSON
│   ├── ui/                  # Tamagui UI library
│   └── api/                 # Backend API
└── supabase/
    └── migrations/          # Database migrations
```

### Tech Stack

**Frontend**:
- React Native 0.76.6
- Expo SDK 52
- TypeScript 5.3
- Tamagui 1.120.5 (UI library)
- Expo Router (file-based navigation)

**Backend**:
- Supabase (PostgreSQL + Auth + Storage)
- Row Level Security (RLS) policies
- Database functions and triggers

**State Management**:
- React Query (TanStack Query v5) for server state
- Zustand for client state
- Supabase Auth for authentication

**Developer Tools**:
- ESLint + Prettier
- TypeScript strict mode
- Expo DevTools
- React DevTools

---

## 🔧 Development

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd inner-ascend

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Running the App

```bash
# Start Expo development server
cd apps/expo
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on physical device
# Scan QR code with Expo Go app
```

### Database Setup

```bash
# Apply migrations
npx supabase db push

# Reset database (caution: destroys data)
npx supabase db reset

# Generate TypeScript types from schema
yarn supa generate
```

### Building for Production

```bash
# iOS development build
eas build --profile development --platform ios

# iOS staging build (TestFlight)
eas build --profile staging --platform ios

# iOS production build (App Store)
eas build --profile production --platform ios

# Android builds
eas build --profile [development|staging|production] --platform android
```

### Local iOS Builds

When building locally with `yarn ios --device`, regenerate native iOS:

```bash
cd apps/expo
yarn expo:prebuild:clean
```

This command:
- Cleans and regenerates the `ios/` directory
- Applies `newArchEnabled: false` configuration
- Runs `pod install` with UTF-8 encoding
- Resolves common build issues

**Note**: The `ios/` directory is gitignored and must be regenerated locally.

---

## 🌐 Environment Variables

Create `.env` file in project root:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
EXPO_PUBLIC_URL=https://innerascend.app

# Analytics (optional)
EXPO_PUBLIC_POSTHOG_API_KEY=your-posthog-key
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (optional)
SENTRY_AUTH_TOKEN=your-sentry-token
```

---

## 📱 App Configuration

**Bundle ID (iOS)**: `com.innerascend.app`
**Package (Android)**: `com.innerascend.app`
**App Name**: Inner Ascend
**Slug**: `inner-ascend`
**Owner**: `inner-ascend-expo`
**EAS Project ID**: `0ba86799-99f0-4ef5-9841-46061cfd6e80`

### Version Information
- **Version**: 1.0.1
- **Build Number**: 3
- **Expo SDK**: 52
- **React Native**: 0.76.6

---

## 🚀 Deployment

### EAS Build Profiles

**Development**:
- For testing with development client
- Includes debugging tools
- Fast refresh enabled

**Staging**:
- For internal testing and TestFlight
- Production-like environment
- Analytics enabled

**Production**:
- For App Store release
- Optimized builds
- Full analytics and error tracking

### TestFlight Distribution

```bash
# Build and submit to TestFlight
eas build --profile staging --platform ios
eas submit --platform ios --latest
```

### App Store Release

```bash
# Create production build
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios --latest
```

---

## 🛠️ Common Issues

### Build Failures

**Codegen Errors**:
```bash
npx expo prebuild --clean --skip-dependency-update react-native,react
```

**Metro Bundler Issues**:
```bash
npx expo start -c  # Clear cache
```

**Pod Install Failures**:
```bash
cd apps/expo/ios
rm -rf Pods Podfile.lock
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install
```

### Database Connection

**Verify Credentials**:
- Check `.env` file has correct Supabase URL and anon key
- Ensure project URL includes `https://`
- Verify anon key is not the service role key

**RLS Policy Issues**:
- Check user is authenticated
- Verify policies allow operation
- Test policies in Supabase SQL Editor

**Migration Failures**:
```bash
# View migration status
npx supabase migration list

# Repair migrations
npx supabase db reset --linked
```

### Performance Issues

**Slow Queries**:
- Check indexes on frequently queried columns
- Use React Query's caching effectively
- Implement pagination for large lists

**Re-render Issues**:
- Use React.memo for expensive components
- Memoize callbacks with useCallback
- Memoize values with useMemo

---

## 🎯 Best Practices

### Component Development
- Use Tamagui design system consistently
- Implement TypeScript with strict mode
- Follow established naming conventions
- Use React Query for all server state
- Keep components small and focused

### Performance
- Optimize images (use expo-image)
- Implement proper loading states
- Use FlatList for long lists
- Minimize re-renders with memoization
- Lazy load screens and components

### Accessibility
- Provide accessible labels
- Support screen readers
- Ensure 4.5:1 contrast ratio
- Test with different font sizes
- Support keyboard navigation

### Code Quality
- Write clear commit messages
- Use conventional commits
- Keep functions small
- Comment complex logic
- Write self-documenting code

---

## 🎭 Project Vision

Inner Ascend is designed to be **the definitive shadow work companion app**—combining the daily engagement of Co-Star, the meditation library of Insight Timer, and the structured curriculum of Mindvalley, all focused specifically on shadow work and inner transformation.

### Target Market
Spiritually curious individuals (25-45) who have tried meditation apps but want deeper personal growth work with structure and guidance.

### Pricing Model
- **Monthly**: $17/month
- **Annual**: $144/year ($12/month, save 29%)
- Positioned between Insight Timer and Mindvalley

### Competitive Advantages
1. **Structured curriculum** (16 modules, 155+ days)
2. **Shadow work focus** (unlike general meditation apps)
3. **Dark, immersive design** (optimized for contemplation)
4. **Community features** (live sessions, not just solo work)
5. **Progress tracking** (streaks, emotions, completion)

### Roadmap
- **Phase 1** (Current): Core features implementation
- **Phase 2**: Audio player, full module content (2-16)
- **Phase 3**: Community features, live sessions
- **Phase 4**: Social features, accountability partners
- **Phase 5**: Web app, admin dashboard
- **Phase 6**: AI-powered insights, personalized recommendations

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Tamagui Documentation](https://tamagui.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 📝 Contributing

1. Follow established patterns in codebase
2. Use TypeScript for all new code
3. Test on both iOS and Android
4. Maintain design system consistency
5. Write clear, conventional commit messages
6. Update documentation for new features
7. Add tests for critical functionality

---

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for inner transformation
