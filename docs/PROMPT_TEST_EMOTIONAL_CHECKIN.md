# Test Prompt: Verify Emotional Check-In Feature Works

## Copy this entire prompt and paste into a NEW Claude Code conversation:

```
I need you to verify that the Emotional Check-In feature in the Inner Ascend app is fully functional.

## Context

The Inner Ascend app has an emotional check-in feature where users select one of 4 emotional states daily:
- 🌊 Struggling
- 🌀 Processing
- ✨ Clear
- 🌟 Integrated

**Recent Fix:** Just fixed a critical bug where `useUser()` wasn't being destructured correctly.

## Your Task

Perform a systematic test of the emotional check-in feature and report if it works end-to-end.

---

## Step 1: Verify Database Schema

Check the database table exists and has correct structure:

**File:** `supabase/migrations/20251019000000_inner_ascend_schema.sql` (around line 169)

**Verify:**
- [ ] Table `emotional_checkins` exists
- [ ] Columns: `id`, `user_id`, `emotion_state`, `checkin_date`, `created_at`
- [ ] CHECK constraint on `emotion_state` (only allows: struggling, processing, clear, integrated)
- [ ] UNIQUE constraint on `(user_id, checkin_date)` - prevents duplicates
- [ ] RLS policies exist for SELECT, INSERT, UPDATE

**Expected:** Table should exist with all policies. Report any missing elements.

---

## Step 2: Check UPDATE Policy Exists

**File:** `supabase/migrations/20251029100000_add_emotional_checkin_update_policy.sql`

**Verify:**
- [ ] UPDATE policy exists: "Users can update own emotional checkins"
- [ ] Policy allows `auth.uid() = user_id`

**Expected:** Update policy should be present. Users need this to change their mind same day.

---

## Step 3: Verify React Query Hooks

**File:** `packages/app/utils/react-query/useEmotionalCheckInMutation.ts`

**Check all 3 hooks use correct destructuring:**

### Hook 1: `useEmotionalCheckInsQuery()` (line ~14)
```typescript
const { user } = useUser()  // ✅ Should have destructuring
```
- [ ] Line ~16: Has `const { user } = useUser()` with destructuring
- [ ] Line ~19: Uses `user?.id` for queryKey
- [ ] Line ~21: Checks `if (!user?.id)`
- [ ] Line ~26: Uses `user.id` in query

### Hook 2: `useTodayCheckInQuery()` (line ~44)
```typescript
const { user } = useUser()  // ✅ Should have destructuring
```
- [ ] Line ~46: Has `const { user } = useUser()` with destructuring
- [ ] Line ~49: Uses `user?.id` for queryKey
- [ ] Line ~51: Checks `if (!user?.id)`
- [ ] Line ~58: Uses `user.id` in query

### Hook 3: `useEmotionalCheckInMutation()` (line ~77)
```typescript
const { user } = useUser()  // ✅ Should have destructuring
```
- [ ] Line ~79: Has `const { user } = useUser()` with destructuring
- [ ] Line ~84: Checks `if (!user?.id)`
- [ ] Line ~94: Uses `user.id` in query
- [ ] Line ~112: Uses `user.id` in insert

**Expected:** All 3 hooks should have `const { user } = useUser()` with curly braces for destructuring.

**If any hook is missing destructuring, report it as CRITICAL BUG.**

---

## Step 4: Check UI Implementation (TODAY Tab)

**File:** `apps/expo/app/(drawer)/(tabs)/index.tsx`

**Verify emotional check-in card exists (around line 158-292):**

- [ ] Line ~8: Imports `useEmotionalCheckInMutation` and `useTodayCheckInQuery`
- [ ] Line ~60: Calls `useTodayCheckInQuery()` hook
- [ ] Line ~62: Calls `useEmotionalCheckInMutation()` hook
- [ ] Line ~82: Has `handleCheckIn` function that calls `checkInMutation.mutate(state)`
- [ ] Line ~168: Shows success message when `showSuccessMessage && todayCheckIn`
- [ ] Line ~186: Has `isSelected = todayCheckIn?.emotion_state === state.value`
- [ ] Line ~190-234: Renders 4 emotional state cards (2 left column)
- [ ] Line ~238-289: Renders 4 emotional state cards (2 right column)

**Expected:** All emotional check-in UI code should be present in the TODAY tab.

---

## Step 5: Check PROGRESS Tab Shows History

**File:** `apps/expo/app/(drawer)/(tabs)/progress.tsx`

**Verify emotional journey section exists (around line 103-164):**

- [ ] Line ~7: Imports `useEmotionalCheckInsQuery`
- [ ] Line ~15: Calls `useEmotionalCheckInsQuery()` hook
- [ ] Line ~104-164: Has "Emotional Journey" card
- [ ] Line ~115: Maps over `emotionalCheckIns.slice(0, 7)` - shows last 7 days
- [ ] Line ~119-124: Has emotion data mapping (struggling, processing, clear, integrated)
- [ ] Line ~127-153: Renders timeline with date + emotion cards

**Expected:** PROGRESS tab should display last 7 check-ins with colors and emojis.

---

## Step 6: TypeScript Check

Run TypeScript compilation to check for errors:

```bash
npx tsc --noEmit -p apps/expo/tsconfig.json
```

**Look for errors in these files:**
- `packages/app/utils/react-query/useEmotionalCheckInMutation.ts`
- `apps/expo/app/(drawer)/(tabs)/index.tsx`
- `apps/expo/app/(drawer)/(tabs)/progress.tsx`

**Expected:** No TypeScript errors related to emotional check-in hooks or user destructuring.

**If you see errors like:**
- "Property 'id' does not exist on type..."
- "Cannot read property 'id' of undefined"

**Report as CRITICAL BUG** - means destructuring wasn't fixed properly.

---

## Step 7: Logic Flow Test (Code Review)

Trace through the flow logic:

### When user taps emotional state:

1. **TODAY tab line ~192**: User presses emotional state card
2. **Line ~82**: Calls `handleCheckIn(state)`
3. **Mutation line ~83**: `mutationFn` receives `emotionState`
4. **Line ~84**: Checks if user is authenticated
5. **Line ~91-96**: Queries if check-in already exists today
6. **Line ~98-108**: If exists, UPDATE the record
7. **Line ~110-124**: If not exists, INSERT new record
8. **Line ~127-130**: On success, invalidate queries
9. **TODAY tab line ~73-80**: `useEffect` detects change, shows success message

**Expected:** Logic flow is complete and correct.

---

## Output Format

Provide your test report in this format:

---

### ✅ EMOTIONAL CHECK-IN FEATURE TEST REPORT

**Date:** [current date]
**Status:** ✅ WORKING | ⚠️ PARTIAL | ❌ BROKEN

---

#### Step 1: Database Schema
**Status:** ✅ | ❌
**Issues Found:** [list any issues or write "None"]

#### Step 2: UPDATE Policy
**Status:** ✅ | ❌
**Issues Found:** [list any issues or write "None"]

#### Step 3: React Query Hooks
**Status:** ✅ | ❌

**Hook 1 - useEmotionalCheckInsQuery:**
- Destructuring: ✅ | ❌ (line X)
- Issues: [describe]

**Hook 2 - useTodayCheckInQuery:**
- Destructuring: ✅ | ❌ (line X)
- Issues: [describe]

**Hook 3 - useEmotionalCheckInMutation:**
- Destructuring: ✅ | ❌ (line X)
- Issues: [describe]

#### Step 4: TODAY Tab UI
**Status:** ✅ | ❌
**Issues Found:** [list any issues or write "None"]

#### Step 5: PROGRESS Tab Display
**Status:** ✅ | ❌
**Issues Found:** [list any issues or write "None"]

#### Step 6: TypeScript Compilation
**Status:** ✅ | ❌
**Errors Found:** [list errors or write "No errors"]

#### Step 7: Logic Flow
**Status:** ✅ | ❌
**Issues Found:** [list any logic gaps or write "None"]

---

### 🎯 FINAL VERDICT

**Overall Status:** ✅ WORKING | ⚠️ NEEDS FIXES | ❌ BROKEN

**Critical Issues (blocking):** [number]
- Issue 1: [description with file:line]
- Issue 2: [description with file:line]

**Non-Critical Issues:** [number]
- Issue 1: [description with file:line]

**Recommended Actions:**
1. [action item]
2. [action item]

**Can ship?** YES | NO
**Reasoning:** [brief explanation]

---

## Important Notes

- Be thorough - check EVERY line number mentioned
- Report EXACT file paths and line numbers for issues
- If code doesn't match expected pattern, report as issue
- Focus on the DESTRUCTURING - that was the main bug
- Don't skip steps - verify each one systematically

## Begin Testing Now

Start with Step 1 and work through all 7 steps.
Report findings in the exact format above.
```

---

## How to Use This Test Prompt

1. **Copy the entire code block above** (lines 5-233)
2. **Open a NEW Claude Code conversation**
3. **Paste and send**
4. Claude will systematically test every aspect
5. You'll get a detailed PASS/FAIL report

---

## What You'll Get

- ✅ Step-by-step verification of database, hooks, UI, logic
- ✅ Exact line numbers for any issues found
- ✅ TypeScript compilation check
- ✅ Clear WORKING/BROKEN verdict
- ✅ Ship/No-Ship recommendation

---

## Expected Result

If the fix worked, you should get:

```
### ✅ EMOTIONAL CHECK-IN FEATURE TEST REPORT
**Status:** ✅ WORKING

All hooks have correct destructuring.
Database schema is complete.
UI is properly implemented.
TypeScript compiles without errors.

**Can ship?** YES
```

If there are still issues, you'll get specific file:line numbers to fix.

---

**This prompt is thorough and will definitively tell you if emotional check-in works!** 🎯
