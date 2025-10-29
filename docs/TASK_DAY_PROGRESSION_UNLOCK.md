# Task: Implement Day Progression & Unlock System

## Context

The Inner Ascend app has a module system where each module (like Module 1: Self-Discovery Foundations) has multiple days (Module 1 has 7 days).

Currently, the "Mark Day Complete" button saves progress to the database, but the **day unlocking logic and progression flow** needs testing and potential refinement.

## Current State

**What Works:**
- ✅ Module detail screen shows day content
- ✅ "Mark Day Complete" button saves to `user_progress` table
- ✅ Day navigator shows checkmarks on completed days
- ✅ After completing, shows "Continue to Day X" button
- ✅ Journey screen shows module progress

**What Needs Testing/Refinement:**
- Does completing Day 1 properly unlock Day 2?
- Should days be locked until previous day is complete?
- How should "current day" be determined?
- What happens if user skips to Day 3 without completing Day 2?
- Should there be a "Start Day X" flow?

## Current Implementation

### Module Detail Screen
**File:** `apps/expo/app/module/[id].tsx`

**Key Logic:**
```typescript
// Marks day as complete
const handleMarkComplete = async () => {
  await completeDay.mutateAsync({ moduleId, dayNumber: selectedDay })
  await recordPractice.mutateAsync() // Also records streak

  // Auto-advances to next day
  if (module && selectedDay < module.duration_days) {
    setSelectedDay(selectedDay + 1)
  }
}

// Shows completion state
const isDayCompleted = moduleProgress?.some(p => p.day_number === selectedDay)
```

**Day Navigator:**
```typescript
{Array.from({ length: module.duration_days }, (_, i) => i + 1).map((dayNum) => {
  const isCompleted = moduleProgress?.some(p => p.day_number === dayNum)
  const isSelected = dayNum === selectedDay

  return (
    <Button onPress={() => setSelectedDay(dayNum)}>
      {isCompleted ? '✓ ' : ''}Day {dayNum}
    </Button>
  )
})}
```

### Progress Tracking
**File:** `packages/app/utils/react-query/useUserProgressQuery.ts`

**Database Table:**
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id INTEGER REFERENCES modules(id),
  practice_id UUID REFERENCES practices(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  day_number INTEGER,
  UNIQUE(user_id, module_id, day_number)
);
```

**Current Day Logic:**
```typescript
export function useCurrentModuleDayQuery(moduleId: number) {
  const { data: progress } = useModuleProgressQuery(moduleId)

  return useQuery({
    queryKey: ['current-module-day', moduleId, progress],
    queryFn: async () => {
      if (!progress || progress.length === 0) {
        return 1 // Start at day 1
      }

      // Find the highest day number completed
      const maxDayCompleted = Math.max(...progress.map(p => p.day_number || 0))

      // Return next day
      return maxDayCompleted + 1
    },
  })
}
```

## Problem Statement

**Key Questions to Answer:**

1. **Day Locking:** Should users only be able to view/complete days sequentially?
   - Current: Users can click any day button in navigator
   - Proposed: Lock days until previous day is complete

2. **Navigation from HOME:** When user clicks "Today's Practice" on HOME screen:
   - Should it go to "current day" (next incomplete day)?
   - Or to last completed day?
   - Or to Day 1 if nothing completed?

3. **Skip Prevention:** Should users be prevented from skipping ahead?
   - Current: User can manually select Day 5 without completing Days 1-4
   - Proposed: Gray out/disable future days

4. **Current Day Indicator:** How to show which day user should do today?
   - Visual indicator in day navigator?
   - Default selected day when opening module?

5. **Module Completion:** What happens after completing all days?
   - Show celebration?
   - Unlock next module automatically?
   - Show "Module Complete" state?

## Recommended Design

### 1. Sequential Day Locking

**Logic:**
```typescript
{Array.from({ length: module.duration_days }, (_, i) => i + 1).map((dayNum) => {
  const isCompleted = moduleProgress?.some(p => p.day_number === dayNum)
  const isSelected = dayNum === selectedDay

  // New: Check if this day is unlocked
  const previousDayCompleted = dayNum === 1 || moduleProgress?.some(p => p.day_number === dayNum - 1)
  const isLocked = !previousDayCompleted && !isCompleted

  return (
    <Button
      key={dayNum}
      onPress={() => !isLocked && setSelectedDay(dayNum)}
      disabled={isLocked}
      opacity={isLocked ? 0.3 : 1}
      theme={isSelected ? 'active' : isCompleted ? 'alt1' : 'alt2'}
    >
      <Text>
        {isCompleted ? '✓ ' : isLocked ? '🔒 ' : ''}Day {dayNum}
      </Text>
    </Button>
  )
})}
```

### 2. Smart Default Day Selection

When user opens module, show the "current day" (next incomplete day):

```typescript
// In module screen
const currentDay = useMemo(() => {
  if (!moduleProgress || moduleProgress.length === 0) return 1

  // Find first incomplete day
  for (let i = 1; i <= module.duration_days; i++) {
    const isDayComplete = moduleProgress.some(p => p.day_number === i)
    if (!isDayComplete) return i
  }

  // All days complete, show last day
  return module.duration_days
}, [moduleProgress, module])

const [selectedDay, setSelectedDay] = useState(currentDay)

// Update when progress changes
useEffect(() => {
  setSelectedDay(currentDay)
}, [currentDay])
```

### 3. Navigation from HOME Screen

Update HOME screen navigation to go to current day:

```typescript
// In index.tsx (HOME screen)
const currentModule = progressSummary?.currentModule || 1
const currentDay = progressSummary?.currentDay || 1

<Card
  onPress={() => router.push(`/module/${currentModule}?day=${currentDay}`)}
>
  {/* Current day content */}
</Card>
```

### 4. Module Completion State

When all days are complete, show celebration:

```typescript
const allDaysComplete = moduleProgress?.length === module.duration_days

{allDaysComplete ? (
  <Card
    padding="$6"
    backgroundColor="$deepSpace2"
    borderColor="$integrationGreen"
    borderWidth={2}
    alignItems="center"
    marginBottom="$4"
  >
    <Text fontSize="$8" marginBottom="$2">🌟</Text>
    <Text fontSize="$6" fontWeight="600" color="$integrationGreen" marginBottom="$2">
      Module {module.sequence_order} Complete!
    </Text>
    <Text color="$silverMoon2" textAlign="center" fontSize="$4" marginBottom="$3">
      You've completed all {module.duration_days} days. Take a moment to integrate what you've learned.
    </Text>

    {/* Show next module button if available */}
    {module.sequence_order < 16 && (
      <Button
        theme="active"
        size="$4"
        onPress={() => router.push(`/module/${module.id + 1}`)}
      >
        <Text>Continue to Module {module.sequence_order + 1} →</Text>
      </Button>
    )}
  </Card>
) : (
  // Normal mark complete button
)}
```

### 5. Visual "Current Day" Indicator

Add a visual indicator for the current day (next to complete):

```typescript
const isCurrentDay = dayNum === currentDay && !isCompleted

<Button
  borderColor={isCurrentDay ? '$cosmicViolet' : undefined}
  borderWidth={isCurrentDay ? 2 : 0}
  // ... other props
>
  <Text>
    {isCompleted ? '✓ ' : isLocked ? '🔒 ' : isCurrentDay ? '▶️ ' : ''}Day {dayNum}
  </Text>
</Button>
```

## Tasks to Complete

### 1. Update Module Detail Screen

**File:** `apps/expo/app/module/[id].tsx`

- [ ] Implement sequential day locking logic
- [ ] Add current day detection
- [ ] Default to current day when opening module
- [ ] Disable locked days (can't click them)
- [ ] Add visual indicators (🔒 for locked, ▶️ for current)
- [ ] Add module completion state/celebration
- [ ] Add "Continue to Next Module" button when complete

### 2. Update Progress Query Hook

**File:** `packages/app/utils/react-query/useUserProgressQuery.ts`

Enhance `useCurrentModuleDayQuery` if needed:

```typescript
export function useCurrentModuleDayQuery(moduleId: number, moduleDuration: number) {
  const { data: progress } = useModuleProgressQuery(moduleId)

  return useQuery({
    queryKey: ['current-module-day', moduleId, progress],
    queryFn: async () => {
      if (!progress || progress.length === 0) {
        return 1 // Start at day 1
      }

      // Find first incomplete day
      for (let i = 1; i <= moduleDuration; i++) {
        const isDayComplete = progress.some(p => p.day_number === i)
        if (!isDayComplete) return i
      }

      // All complete, return last day
      return moduleDuration
    },
    enabled: !!moduleDuration,
  })
}
```

### 3. Update HOME Screen Navigation

**File:** `apps/expo/app/(drawer)/(tabs)/index.tsx`

- [ ] Pass `day` parameter when navigating to module
- [ ] Ensure it opens to current day, not Day 1

### 4. Update Journey Screen (Optional)

**File:** `apps/expo/app/(drawer)/(tabs)/journey.tsx`

- [ ] Show current day in module cards
- [ ] Example: "Module 1: Day 3 of 7 (42% complete)"

### 5. Add Module Completion Logic

**Consider:**
- Save module completion to separate table?
- Or just check if all days are complete?
- Unlock next module automatically?
- Show achievement/badge?

## Testing Checklist

**Test these scenarios:**

1. **New User:**
   - [ ] Opens Module 1 → Should see Day 1 as current
   - [ ] Days 2-7 should be locked (🔒)
   - [ ] Complete Day 1 → Day 2 unlocks
   - [ ] Day 1 shows checkmark (✓)

2. **Progression:**
   - [ ] Complete Day 1 → auto-advances to Day 2
   - [ ] Can't skip to Day 4 without completing Days 2-3
   - [ ] Can go back and review completed days

3. **From HOME Screen:**
   - [ ] Click "Today's Practice" → Opens current day
   - [ ] Not Day 1 every time

4. **Module Completion:**
   - [ ] Complete Day 7 → Shows celebration
   - [ ] "Continue to Module 2" button appears
   - [ ] Journey tab shows Module 1 as complete (✅)

5. **Navigation:**
   - [ ] Day buttons work correctly
   - [ ] Locked days can't be selected
   - [ ] Current day has visual indicator

## Edge Cases to Handle

1. **What if user has old progress data before locking was added?**
   - They might have Day 5 complete but not Day 3
   - Solution: Allow completed days to be viewed, but still lock incomplete days in sequence

2. **What if they want to review a completed day?**
   - Allow clicking any completed day
   - But can't mark as incomplete

3. **Module switching:**
   - Going from Module 1 to Module 2 should default to Day 1 of Module 2

4. **Deep links:**
   - If URL has `?day=5` but day 5 is locked, redirect to current day

## Design System

**Use these visual indicators:**
- ✅ `✓` - Day complete (green)
- 🔒 `🔒` - Day locked (grayed out, opacity 0.3)
- ▶️ `▶️` - Current day (cosmic violet border)
- Standard - Available but not started

**Colors:**
- Completed: `$integrationGreen`
- Current: `$cosmicViolet` border
- Locked: Opacity 0.3, `$silverMoon3`
- Available: Normal button colors

## Success Criteria

- ✅ Days unlock sequentially as user completes them
- ✅ Can't skip ahead without completing previous days
- ✅ Current day is clearly indicated
- ✅ HOME screen opens to current day
- ✅ Module completion is celebrated
- ✅ Next module unlocks after completing all days
- ✅ Journey tab accurately reflects progress
- ✅ Visual feedback is clear and beautiful
- ✅ No bugs when marking days complete

## Notes

- This is core to the learning experience - must be intuitive
- Sequential learning is important for the curriculum
- But also respect that users might want to review past days
- Balance guidance with flexibility
- Celebrate progress at each milestone
- Make the unlocking feel rewarding, not restrictive

## Deliverable

An updated module detail screen that:
- Locks days sequentially
- Shows clear visual indicators for current/locked/completed days
- Defaults to current day when opened
- Celebrates module completion
- Provides smooth progression through the curriculum
- Integrates perfectly with HOME and JOURNEY screens

Make progression feel natural and rewarding! 🌟
