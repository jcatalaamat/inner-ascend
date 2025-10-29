# Claude Code Prompt: Polish & Verify Inner Ascend for Production

## Mission

Perform a comprehensive audit and polish pass on the Inner Ascend app. For each feature, verify that:
1. Database schema is correct and complete
2. Backend logic works properly
3. UI/UX is polished and bug-free
4. All data flows work end-to-end
5. No critical issues preventing ship

---

## Instructions for Claude Code

Copy and paste this entire section into a new Claude Code conversation:

```
You are auditing the Inner Ascend spiritual practice app for production readiness.

This is a React Native (Expo) + Supabase app with 5 main tabs:
1. TODAY - Daily check-in and practice
2. JOURNEY - 16 modules (Being Human 101)
3. COMMUNITY - Live healing sessions
4. PRACTICES - Meditations, journaling prompts, exercises
5. PROGRESS - Streak tracking, stats, emotional history

## Your Task

For EACH feature below, verify implementation and report issues:

### Format for Each Feature:

**Feature Name**: [feature]

**Database Check:**
- [ ] Table exists with correct schema
- [ ] RLS policies are secure and complete (SELECT, INSERT, UPDATE, DELETE)
- [ ] Indexes exist for performance
- [ ] Constraints are correct (UNIQUE, CHECK, NOT NULL)
- [ ] Foreign keys cascade properly

**Backend Check:**
- [ ] React Query hooks exist and are correct
- [ ] Queries have proper error handling
- [ ] Mutations invalidate correct queries
- [ ] TypeScript types match database schema
- [ ] No hardcoded values or API keys

**UI/UX Check:**
- [ ] Screen exists and loads properly
- [ ] Loading states show spinner
- [ ] Empty states have helpful messages
- [ ] Error states are user-friendly
- [ ] Buttons have press feedback
- [ ] Text is not truncated
- [ ] Safe areas are respected
- [ ] Colors match cosmic theme
- [ ] Animations are smooth

**Data Flow Check:**
- [ ] Create operation works
- [ ] Read operation works
- [ ] Update operation works
- [ ] Delete operation works (if applicable)
- [ ] Real-time updates work (if applicable)
- [ ] Optimistic updates work (if implemented)

**Report Format:**
For each issue found:
- **Severity**: Critical | High | Medium | Low
- **Location**: file.ts:line
- **Issue**: Clear description
- **Fix**: Specific code fix or recommendation
- **Time**: Estimate to fix (minutes/hours)

---

## Features to Audit

### 1. TODAY Tab - Daily Check-In & Practice

**What it should do:**
- Show date, greeting, streak counter
- Emotional check-in: 4 states (struggling, processing, clear, integrated)
- Display cosmic weather message
- Show today's module practice with progress bar
- Allow user to tap and navigate to module detail

**Database Tables:**
- `emotional_checkins` (id, user_id, emotion_state, checkin_date, created_at)
- `daily_streaks` (id, user_id, practice_date, practices_completed, created_at)
- `cosmic_cache` (id, cache_date, moon_phase, daily_message, created_at)

**Files to Check:**
- apps/expo/app/(drawer)/(tabs)/index.tsx
- packages/app/utils/react-query/useEmotionalCheckInMutation.ts
- packages/app/utils/react-query/useStreakQuery.ts
- packages/app/utils/react-query/useCosmicWeatherQuery.ts
- supabase/migrations/20251019000000_inner_ascend_schema.sql (lines 145-198)

**Verify:**
- Can user select emotional state?
- Does selection save to database?
- Can user change their mind same day?
- Does success message appear?
- Is streak counter accurate?
- Does cosmic weather show?
- Does today's practice card link to module?

---

### 2. JOURNEY Tab - Module List & Progress

**What it should do:**
- Display all 16 modules from Being Human 101
- Show module states: locked (🔒), unlocked/ready (⭐), active (🔥), completed (✅)
- Unlock modules sequentially (Module 2 after completing Module 1, etc.)
- Show progress: "Day X of Y (Z% complete)"
- Allow tapping to open module detail screen

**Database Tables:**
- `modules` (id, sequence_order, title, description, duration_days, created_at)
- `user_progress` (id, user_id, module_id, day_number, completed_at)

**Files to Check:**
- apps/expo/app/(drawer)/(tabs)/journey.tsx
- apps/expo/app/module/[id].tsx
- packages/app/utils/react-query/useModulesQuery.ts
- packages/app/utils/react-query/useUserProgressQuery.ts
- packages/app/content/ (module content files)

**Verify:**
- Do all 16 modules appear?
- Is Module 1 always unlocked?
- Are other modules locked until previous is complete?
- Does progress calculation work correctly?
- Can user tap unlocked module to view detail?
- Does module detail screen load content correctly?

---

### 3. COMMUNITY Tab - Live Sessions & RSVPs

**What it should do:**
- Show upcoming live sessions (healing circles, workshops, meditations, Q&A)
- Display past sessions in separate tab
- Allow RSVP (I'm Coming / Maybe buttons)
- Show RSVP status with badge
- Join Call button opens meeting URL
- Empty states for no sessions

**Database Tables:**
- `live_sessions` (id, title, description, session_date, session_time, duration_minutes, meeting_url, facilitator, session_type, is_published, created_at)
- `session_rsvps` (id, session_id, user_id, rsvp_status, created_at)

**Files to Check:**
- apps/expo/app/(drawer)/(tabs)/community.tsx
- packages/app/utils/react-query/useLiveSessionsQuery.ts
- supabase/migrations/20251029000000_add_live_sessions.sql

**Verify:**
- Do upcoming sessions display with correct date/time?
- Can user RSVP to session?
- Does RSVP badge appear after confirming?
- Can user change RSVP same session?
- Does Join Call button open URL?
- Do past sessions appear in Past tab?
- Are empty states beautiful and encouraging?

---

### 4. PRACTICES Tab - Meditations, Journaling, Exercises

**What it should do:**
- Tab switcher: Meditations | Prompts | Exercises
- Show all meditations with duration, description, best for
- Show journaling prompts organized by theme (expandable/collapsible)
- "Open Journal" button navigates to journaling modal
- Show exercises with instructions preview

**Database Tables:**
- `practices` (id, practice_type, title, description, duration_minutes, audio_url, instructions, bestFor, created_at)

**Files to Check:**
- apps/expo/app/(drawer)/(tabs)/practices.tsx
- packages/app/utils/react-query/usePracticesQuery.ts
- packages/app/content/journaling-prompts.json (or similar)

**Verify:**
- Do all 3 tabs work (Meditations, Prompts, Exercises)?
- Do meditations display with correct info?
- Can user expand/collapse journaling prompt themes?
- Does "Open Journal" button work?
- Do exercise cards show instructions preview?
- Is content loading from database or static JSON?

---

### 5. PROGRESS Tab - Stats, History, Achievements

**What it should do:**
- Show total days practiced (big number)
- Display current streak and longest streak
- Show modules progress (dot visualization)
- Display emotional journey (last 7 check-ins with timeline)
- Show journal entry stats (total words, avg per entry)
- Preview recent journal entries (last 3)
- "View All Entries" button

**Database Tables:**
- Uses data from: daily_streaks, emotional_checkins, user_progress, journal_entries

**Files to Check:**
- apps/expo/app/(drawer)/(tabs)/progress.tsx
- packages/app/utils/react-query/useUserProgressQuery.ts
- packages/app/utils/react-query/useStreakQuery.ts
- packages/app/utils/react-query/useEmotionalCheckInMutation.ts
- packages/app/utils/react-query/useJournalEntriesQuery.ts

**Verify:**
- Do stats calculate correctly?
- Is emotional journey timeline working?
- Does it show last 7 check-ins with colors?
- Are journal previews working?
- Does "View All Entries" navigate correctly?
- Is empty state shown for new users?

---

### 6. Journaling - Write & History

**What it should do:**
- Modal/screen to write journal entries
- Support pre-filled prompts from PRACTICES tab
- Character/word counter
- Save entry to database
- View history of all entries (journal-history screen)
- Edit existing entries
- Delete entries

**Database Tables:**
- `journal_entries` (id, user_id, module_id, prompt, content, word_count, created_at, updated_at)

**Files to Check:**
- apps/expo/app/journaling.tsx
- apps/expo/app/journal-history.tsx
- apps/expo/app/journal/[id].tsx
- packages/app/utils/react-query/useJournalEntriesQuery.ts

**Verify:**
- Can user write new journal entry?
- Does word counter work?
- Does save work?
- Can user view history of entries?
- Can user edit existing entry?
- Can user delete entry?
- Does prompt pre-populate when selected from PRACTICES?

---

### 7. Module Detail Screen - Daily Content

**What it should do:**
- Show module info (title, day X of Y)
- Display teaching content (heading, body, reflection questions)
- Show practice for the day (type, duration, instructions)
- "Mark Complete" button to record progress
- Navigate between days

**Database Tables:**
- Uses: modules, user_progress
- Content from: packages/app/content/

**Files to Check:**
- apps/expo/app/module/[id].tsx
- packages/app/utils/react-query/useModuleContentQuery.ts
- packages/app/content/ (module JSON files)

**Verify:**
- Does module load with correct day content?
- Is teaching content displayed properly?
- Is practice content displayed properly?
- Does "Mark Complete" button work?
- Does it update user_progress table?
- Can user navigate between days?
- Is content loading from database or JSON?

---

### 8. Authentication - Sign In/Up/Out

**What it should do:**
- Sign up with email/password
- Sign in with email/password
- Sign in with Apple
- Sign out
- Password reset flow
- Profile creation (profiles table)

**Database Tables:**
- `profiles` (id, email, display_name, avatar_url, created_at)
- auth.users (Supabase managed)

**Files to Check:**
- Supabase RLS policies
- packages/app/utils/useUser.ts
- apps/expo/app/(auth)/ (if exists)

**Verify:**
- Can user sign up?
- Can user sign in?
- Does Sign in with Apple work?
- Can user sign out?
- Does profile get created automatically?
- Are RLS policies preventing unauthorized access?

---

### 9. TypeScript & Code Quality

**Check:**
- Run: `npx tsc --noEmit -p apps/expo/tsconfig.json`
- Report ALL TypeScript errors with file:line
- Check for:
  - Unused imports
  - Any types
  - Console.logs in production code
  - TODO/FIXME comments

---

### 10. Performance & Bundle

**Check:**
- Are images optimized?
- Are there unnecessary re-renders?
- Is React Query staleTime set appropriately?
- Are indexes on database tables?
- Is lazy loading used where appropriate?

---

## Output Format

Provide your audit in this exact format:

### ✅ Feature: [Name]
**Status**: Working | Partial | Broken
**Database**: ✅ | ⚠️ | ❌
**Backend**: ✅ | ⚠️ | ❌
**UI/UX**: ✅ | ⚠️ | ❌
**Data Flow**: ✅ | ⚠️ | ❌

**Issues Found**: [number]
**Estimated Fix Time**: [X hours]

**Critical Issues** (must fix):
- [ ] Issue description (file.ts:123) - Fix: [solution] - Time: 30min

**High Priority** (should fix):
- [ ] Issue description (file.ts:456) - Fix: [solution] - Time: 1hr

**Medium Priority** (nice to fix):
- [ ] Issue description (file.ts:789) - Fix: [solution] - Time: 15min

**Low Priority** (post-launch):
- [ ] Issue description (file.ts:999) - Fix: [solution] - Time: 5min

---

### Summary Report

**Total Features Audited**: 10
**Features Working**: X
**Features Partial**: Y
**Features Broken**: Z

**Total Issues Found**: X
- Critical: X (blocking ship)
- High: X (should fix before ship)
- Medium: X (nice to have)
- Low: X (post-launch)

**Estimated Time to Ship-Ready**: X hours

**Recommended Actions**:
1. [Priority action]
2. [Priority action]
3. [Priority action]

**Ship Decision**: ✅ Ready | ⚠️ Almost Ready | ❌ Not Ready
**Reasoning**: [Brief explanation]

---

## Important Notes

- Be thorough but practical - focus on ship-blocking issues
- Provide specific file paths and line numbers
- Include exact code fixes when possible
- Consider user experience impact
- Flag security issues as CRITICAL
- Test edge cases (new user, no data, network errors)
- Verify mobile responsiveness (iPhone SE, Pro Max, iPad)

## Begin Audit Now

Start with Feature #1 (TODAY Tab) and work through all 10 systematically.
For each feature, actually READ the code files and check the database schema.
Don't assume - verify everything works.

Ready? Begin your comprehensive audit.
```

---

## How to Use This Prompt

1. **Copy the entire prompt** from the code block above
2. **Start a NEW Claude Code conversation**
3. **Paste the prompt** and hit enter
4. **Claude will systematically audit** every feature
5. **You'll get a detailed report** with all issues, priorities, and fixes
6. **Fix critical/high issues** before shipping
7. **Optional**: Run the audit again after fixes to verify

---

## What You'll Get

After running this prompt, you'll receive:

- ✅ Complete feature-by-feature breakdown
- ✅ All bugs and issues with severity levels
- ✅ Specific file locations (file.ts:line)
- ✅ Exact code fixes or recommendations
- ✅ Time estimates for each fix
- ✅ Total time to ship-ready
- ✅ Clear ship/no-ship recommendation

---

## Example Output Snippet

```
### ✅ Feature: TODAY Tab - Emotional Check-In
**Status**: Working
**Database**: ✅
**Backend**: ⚠️
**UI/UX**: ✅
**Data Flow**: ✅

**Issues Found**: 2
**Estimated Fix Time**: 45 minutes

**High Priority**:
- [ ] Missing error handling in useEmotionalCheckInMutation when network fails
      Location: packages/app/utils/react-query/useEmotionalCheckInMutation.ts:83
      Fix: Wrap mutation in try/catch and show user-friendly error toast
      Time: 30min

**Medium Priority**:
- [ ] Success message doesn't dismiss on navigation away from screen
      Location: apps/expo/app/(drawer)/(tabs)/index.tsx:73
      Fix: Add cleanup in useEffect return function
      Time: 15min
```

---

## Pro Tips

1. **Run this audit BEFORE TestFlight** to catch issues early
2. **Fix Critical/High issues** before shipping
3. **Document Medium/Low issues** for post-launch
4. **Re-run audit after fixes** to verify
5. **Save the output** as a checklist for your team

---

**This prompt is comprehensive and will catch issues you didn't know existed.**

Good luck! 🚀🌙✨
