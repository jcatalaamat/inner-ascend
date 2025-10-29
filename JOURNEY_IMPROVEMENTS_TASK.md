# Journey Content & Structure Improvements - Analysis & Proposal Task

## Your Mission
Analyze the Inner Ascend app's learning journey and **PROPOSE IMPROVEMENTS** for the following areas. Do not implement yet - first provide detailed proposals with rationale, alternatives, and recommendations. The user will review your proposals before implementation.

## Context
The Inner Ascend app is a spiritual practice and personal growth application with a 16-module curriculum called "Being Human 101". Currently, only Module 1 has full content (7 days of teaching + practice + journaling). Modules 2-16 show placeholder "Content Coming Soon" screens. This task focuses on improving the journey structure, content quality, and user experience.

## Key Files to Work With

### Database Schema
- `/supabase/migrations/20251019000000_inner_ascend_schema.sql`
- Contains the 16 module definitions with titles, descriptions, and durations

### Content Files
- `/packages/app/content/module-1.json` - Example of full content structure
- `/packages/app/content/practices.json` - Standalone practice library

### UI Components
- `/apps/expo/app/(drawer)/(tabs)/journey.tsx` - Journey screen showing all modules
- `/apps/expo/app/module/[id].tsx` - Module detail screen showing daily content

### Queries
- `/packages/app/utils/react-query/useModuleContentQuery.ts` - Loads module content
- `/packages/app/utils/react-query/useModulesQuery.ts` - Loads module metadata

## Current Module Definitions (from database)

1. **Awakening** (7 days) - Begin your journey of self-discovery
2. **Core Wounds** (7 days) - Identifying your foundational wounds
3. **Shadow Work & Radical Honesty** (14 days) - Facing what you have been avoiding
4. **Inner Child Healing** (14 days) - Reconnecting with your younger self
5. **Somatic Release** (10 days) - Releasing trauma from the body
6. **Boundaries & Protection** (7 days) - Learning to protect your energy
7. **Authentic Expression** (10 days) - Speaking your truth
8. **Shame & Vulnerability** (14 days) - Transforming shame into strength
9. **Grief & Loss** (10 days) - Processing unresolved grief
10. **Anger & Power** (10 days) - Reclaiming your power
11. **Fear & Safety** (10 days) - Building inner safety
12. **Love & Intimacy** (14 days) - Opening your heart
13. **Life Purpose** (10 days) - Discovering your calling
14. **Spiritual Integration** (10 days) - Integrating your practice
15. **Embodiment Practices** (10 days) - Living from your truth
16. **Mastery & Beyond** (10 days) - Continuing the journey

## Module 1 Content Structure Reference

Module 1 has the following JSON structure per day:
- `day`: number
- `title`: string (e.g., "The Foundation: Inside Reflects Outside")
- `teaching`: object with:
  - `heading`: main theme
  - `content`: 200-400 words of teaching
  - `keyPoints`: array of 3-4 key concepts
- `practice`: object with:
  - `type`: "meditation" | "journaling" | "exercise"
  - `duration`: number (minutes)
  - `title`: string
  - `description`: string
- `journaling`: object with:
  - `prompt`: main open-ended question
  - `reflectionQuestions`: array of 2-3 deeper inquiry questions

## Tasks to Analyze & Propose Improvements

### 1. Fix Module Title Inconsistency
**Issue**: The database defines Module 1 as "Awakening" but the content file (`module-1.json`) calls it "Self-Discovery Foundations".

**Your Task**:
- Analyze both titles against the actual Module 1 content
- Propose which title better reflects the content and why
- Suggest alternative titles if neither is ideal
- Consider how this title fits in the overall 16-module journey arc
- Recommend the best approach to fix the inconsistency
- Explain implications of changing database vs content file

### 4. Improve "Coming Soon" Placeholder
**Location**: `/apps/expo/app/module/[id].tsx` (lines 104-127)

**Current behavior**: Shows generic "Content Coming Soon" message for Modules 2-16

**Your Task**:
- Propose 3-5 different approaches for making placeholders more engaging
- Analyze pros/cons of each approach (FOMO vs transparency, detail vs brevity, etc.)
- Consider: Should placeholders show module descriptions? Day titles? Expected release dates? Waitlist signup?
- Suggest specific copy/messaging that builds anticipation
- Recommend visual treatments (icons, colors, animations)
- Consider how much to reveal vs keep mysterious
- Think about user psychology: What makes users want to come back?

### 6. Create Skeletal Content for Modules 2-16
**Your Task**: Propose a comprehensive content structure strategy for the remaining 15 modules

**Proposals Needed**:

1. **Content Depth Strategy**
   - How detailed should skeletal content be? (Just day titles? Outline of teaching? Full prompts?)
   - Should some modules have more detail than others? (e.g., Module 2 more fleshed out than Module 16)
   - What's the minimum viable content to provide value vs feeling half-baked?

2. **Module 2-3 Day Title Proposals**
   - For Module 2 (Core Wounds, 7 days) and Module 3 (Shadow Work, 14 days):
   - Propose specific day titles that form a coherent learning arc
   - Explain the progression logic
   - Show how days build on each other
   - This will serve as a template for other modules

3. **Content Creation Approach**
   - Should all 15 modules be created at once or prioritized (e.g., Modules 2-4 first)?
   - How to ensure thematic coherence across 16 modules?
   - Should there be "milestone modules" or integration points?
   - How to create variety while maintaining quality?

4. **Teaching Themes Proposal**
   - For each module, propose 3-5 key concepts that should be taught
   - Ensure concepts build on previous modules
   - Identify cross-module themes and callbacks
   - Suggest how to avoid repetition across 155 days

5. **Practice Variety Strategy**
   - What types of practices should each module emphasize?
   - How to balance meditation, journaling, somatic practices, exercises?
   - Should certain modules have unique practice types?
   - How to keep practices fresh over 5 months?

### 7. Add "Prerequisites" Indicator
**Your Task**: Propose how to communicate module dependencies and progression logic

**Proposals Needed**:

1. **Grouping & Phasing Strategy**
   - Propose a logical grouping of the 16 modules (e.g., Foundation, Healing, Integration)
   - Justify the groupings based on psychological/spiritual progression
   - Suggest how to name these phases
   - Should phases be visually distinct in the UI?

2. **Prerequisite Display Options**
   - Propose 3-5 different ways to show prerequisites:
     - Text-based ("Module 3 builds on Modules 1-2")
     - Visual connections (arrows, lines)
     - Tooltip/info icons
     - Dedicated "About this module" section
     - Journey map with connections
   - Analyze pros/cons of each approach
   - Consider mobile screen constraints

3. **Content Callbacks Strategy**
   - How should later modules reference earlier concepts?
   - Should there be explicit "Remember from Module 2..." references?
   - How to reinforce without being repetitive?
   - Propose a system for tracking which concepts users have learned

4. **User Communication**
   - What do users need to know about prerequisites?
   - How to communicate without overwhelming beginners?
   - Should advanced users be able to skip modules? Why or why not?

### 8. Journey Map Visualization
**Your Task**: Propose visual designs and UX approaches for showing the full journey

**Proposals Needed**:

1. **Visual Design Concepts**
   - Propose 3-5 different visual metaphors for the journey:
     - Linear path/timeline?
     - Spiral or circular progression?
     - Tree/branching structure?
     - Mountain/levels metaphor?
     - Constellation/cosmic map (fitting the theme)?
   - Sketch or describe each concept in detail
   - Explain which best fits the Inner Ascend theme and psychology

2. **Information Architecture**
   - What information should the map show?
     - Module titles, durations, descriptions?
     - Progress percentages, completion dates?
     - Connections between modules?
     - Time investment estimates?
   - How to balance information density with clarity?
   - Should it be interactive or static?

3. **Placement & Navigation**
   - Should this be:
     - A separate tab in the main navigation?
     - A modal/overlay from the Journey screen?
     - An expanded view with a toggle?
     - Part of the existing Journey screen redesign?
   - Analyze pros/cons of each placement
   - Consider discoverability and frequency of use

4. **User States**
   - How to represent:
     - Not yet started (locked) modules
     - Current/active modules
     - In-progress modules (partial completion)
     - Completed modules
     - Time-locked days within modules
   - Propose color coding, icons, animations
   - Ensure accessibility and clarity

5. **Engagement Features**
   - Should users be able to:
     - Zoom in/out of the map?
     - See their future path vs past journey?
     - Share their progress?
     - See community stats ("12% of users have completed Module 5")?
   - What features increase motivation vs overwhelm?

### 9. Spaced Repetition Review Mechanism
**Your Task**: Propose a system for reinforcing earlier learning throughout the journey

**Proposals Needed**:

1. **Review Timing Strategy**
   - When should reviews happen?
     - Between modules?
     - Every X days within modules?
     - User-initiated from Progress screen?
     - Randomized/spaced algorithmically?
   - How frequently is optimal without being annoying?
   - Should timing adapt based on user engagement?

2. **Review Format Options**
   - Propose 3-5 different review mechanisms:
     - "Flashback Friday" - weekly review prompts
     - Integration days between modules
     - Morning check-ins with concept recalls
     - "Before you continue..." checkpoint screens
     - Suggested re-reading of previous days
   - Analyze which format(s) fit the app's flow
   - Consider cognitive science best practices

3. **Content Selection Logic**
   - How to determine which concepts to review?
     - Most important concepts from each module?
     - Concepts users struggled with (via assessment data)?
     - Random selection for variety?
     - User-favorited content?
   - Should review focus on practices, teachings, or both?
   - How to avoid making reviews feel like homework?

4. **User Control & Opt-out**
   - Should reviews be mandatory, optional, or dismissible?
   - Can users customize review frequency?
   - How to make reviews feel valuable, not burdensome?
   - Should there be "deep dive" reviews vs "quick recall"?

5. **Database Schema Proposal**
   - What data needs to be tracked?
     - Concept IDs and mastery levels?
     - Review history and outcomes?
     - User preferences?
   - Propose table structures (don't implement, just design)
   - How to integrate with existing user_progress table?

6. **Engagement Psychology**
   - How to make reviews rewarding?
   - Should there be streak bonuses for completing reviews?
   - Visual feedback when concepts are mastered?
   - Achievement badges for review milestones?

### 10. Assessment & Comprehension System
**Your Task**: Propose assessment approaches that feel supportive, not judgmental

**Proposals Needed**:

1. **Assessment Philosophy**
   - For a personal growth app, what should "assessment" mean?
   - How to measure internal transformation (not just knowledge)?
   - Should assessments focus on:
     - Confidence/comfort with concepts?
     - Behavioral changes in daily life?
     - Emotional shifts and integration?
     - Practice consistency?
   - Propose a framework that aligns with spiritual/therapeutic growth

2. **Assessment Formats**
   - Propose 5-7 different assessment types:
     - Likert scale self-ratings ("Rate your understanding 1-5")
     - Before/after emotional state comparisons
     - Free-form reflection summaries
     - "Choose concepts that resonate" selections
     - Behavioral check-ins ("Have you practiced boundaries this week?")
     - Journaling prompt responses as implicit assessment
   - Which formats feel supportive vs evaluative?
   - How to mix quantitative and qualitative data?

3. **Timing & Frequency**
   - When should assessments occur?
     - End of each module?
     - Mid-module checkpoints?
     - After certain practices?
     - Weekly/monthly check-ins?
   - How many questions is too many?
   - Should timing vary by module length?

4. **User Value Proposition**
   - How do assessments benefit users (not just data collection)?
   - Propose ways to show users their growth:
     - "You've increased confidence in shadow work by 40%"
     - Progress charts showing emotional integration over time
     - Concept mastery visualizations
     - Personalized insights: "You engage most with somatic practices"
   - Where should this data be displayed? (Progress screen redesign ideas?)

5. **Optional vs Required**
   - Should assessments be:
     - Completely optional (skippable)?
     - Encouraged but not blocking progress?
     - Required to unlock certain features?
   - Pros/cons of each approach
   - How to incentivize participation without coercion?

6. **Data Privacy & Sensitivity**
   - This is deeply personal growth data - how to handle ethically?
   - Should users be able to delete assessment responses?
   - How to communicate data usage and privacy?
   - Should aggregated/anonymized data help improve content?

7. **Database Schema Proposal**
   - Design tables for storing assessment data
   - Consider: assessments, assessment_responses, concept_mastery, emotional_states
   - How to query for user insights and growth metrics?
   - Relationship to existing user_progress table

8. **Progress Screen Integration**
   - Propose how to show assessment insights in the Progress screen
   - Visual designs for growth charts, mastery levels, concept clouds
   - How to make data visualization motivating and meaningful?
   - Should there be a dedicated "Insights" or "Growth" section?

## Implementation Guidelines

### Code Quality
- Follow existing code patterns in the codebase
- Use TypeScript types consistently
- Follow the existing UI component library (`@my/ui`)
- Maintain the cosmic color theme: deepSpace1/2/3, cosmicViolet, silverMoon, integrationGreen, innerChildGold

### Content Quality
- Maintain the sophisticated, therapeutically-informed tone of Module 1
- Use proper psychological/spiritual terminology
- Create content that builds progressively in complexity
- Ensure module themes connect logically
- Reference established healing modalities where appropriate (IFS, somatic practices, shadow work, etc.)

### User Experience
- Keep the 24-hour time-lock mechanism intact
- Ensure new features don't disrupt existing progress tracking
- Maintain mobile-first design
- Add loading and error states for new features
- Consider accessibility (screen readers, contrast, touch targets)

### Testing Approach
- Test module progression with existing locking mechanisms
- Verify content loads correctly for all 16 modules
- Check that new features work with existing user progress data
- Test on both iOS and Android if possible

## Success Criteria for Your Proposals

Deliver a comprehensive document with:

- [ ] **Task 1**: Clear recommendation on title consistency with rationale
- [ ] **Task 4**: 3-5 placeholder improvement concepts with pros/cons and recommended approach
- [ ] **Task 6**: Complete content strategy with example day titles for Modules 2-3
- [ ] **Task 7**: Prerequisite system proposal with grouping strategy and display options
- [ ] **Task 8**: Journey map visual concepts with recommended design and placement
- [ ] **Task 9**: Spaced repetition system design with timing, format, and database schema
- [ ] **Task 10**: Assessment framework with formats, timing, database schema, and Progress screen integration

For each task:
- Provide multiple options/approaches
- Analyze pros and cons
- Make a clear recommendation
- Explain psychological/pedagogical reasoning
- Consider mobile UX constraints
- Align with Inner Ascend's cosmic theme and therapeutic approach
- Reference research or best practices where applicable

## Recommended Analysis Order

Approach the proposals in this sequence:

1. **Task 1** - Analyze title inconsistency (quick, foundational)
2. **Task 6** - Develop content strategy (informs everything else)
3. **Task 7** - Propose prerequisite system (builds on content understanding)
4. **Task 4** - Design placeholder improvements (now informed by content plan)
5. **Task 8** - Create journey map concepts (synthesizes above understanding)
6. **Task 10** - Design assessment system (requires understanding full journey)
7. **Task 9** - Propose spaced repetition (integrates with assessment)

However, feel free to work in parallel where logical.

## Notes

- The app uses Expo + React Native with Tamagui UI library
- Backend is Supabase (PostgreSQL database + Auth)
- Content is currently stored in static JSON files
- Consider future scalability - may want to move content to database eventually
- The app follows a gaming/app psychology model with streaks, unlocks, and progression mechanics
- User engagement is key - 24-hour locks create FOMO and anticipation

## Key Questions to Address in Your Proposals

Throughout your analysis, consider:

- **Content Philosophy**: What makes transformational content vs informational content?
- **User Psychology**: How to balance challenge, support, and FOMO?
- **Pacing**: How to maintain engagement over 155 days without burnout?
- **Personalization**: Should the journey adapt to individual users? How?
- **Community**: How might social features enhance (or detract from) the journey?
- **Measurement**: How do we know if the journey is "working" for users?
- **Scalability**: How do these proposals work for 10 users vs 10,000 users?
- **Business Model**: How do features align with potential monetization (premium content, coaching, etc.)?

## Deliverable Format

Provide your proposals in a well-structured markdown document with:
- Clear headings for each task
- Subsections for different proposal options
- Tables comparing pros/cons where appropriate
- Rationale and reasoning for recommendations
- Wireframe descriptions or ASCII diagrams for visual concepts
- Database schema proposals in code blocks
- References to relevant research or best practices
- Executive summary at the top with key recommendations

**Remember**: Do NOT implement code yet. This is a strategic planning and UX design task. Focus on thoughtful analysis, creative proposals, and clear recommendations. The user will review and approve before implementation begins.

Good luck! Your proposals will shape a coherent, engaging 155-day transformational journey that maintains the sophisticated, therapeutic quality of Module 1 while scaling across the full curriculum.

---

## APPENDIX: Seeding Course Material into Database

### Current Architecture
Currently, course content is stored in **static JSON files**:
- `/packages/app/content/module-1.json` - Full content for Module 1
- `/packages/app/content/practices.json` - Standalone practice library

Module metadata is in the **database** (`modules` table):
- Basic info: title, description, duration_days, sequence_order
- Seeded via SQL migration: `/supabase/migrations/20251019000000_inner_ascend_schema.sql`

### Option 1: Keep Content in JSON Files (Current Approach)

**Pros:**
- Simple to edit (just edit JSON, no database migrations)
- Version controlled with code
- Fast development iteration
- No database schema changes needed
- Works well for relatively static content

**Cons:**
- Doesn't scale well beyond 16 modules
- No admin interface for non-technical content editors
- Can't personalize content per user
- Difficult to A/B test content variations
- No analytics on which content sections users engage with most

**How to add new modules:**
1. Create new JSON file: `/packages/app/content/module-2.json`
2. Follow the same structure as `module-1.json`
3. Update `/packages/app/utils/react-query/useModuleContentQuery.ts` to load the new file
4. No database changes needed (module metadata already in DB)

### Option 2: Migrate Content to Database (Scalable Approach)

**Pros:**
- Scalable to hundreds of modules
- Enables admin CMS interface
- Can track user engagement per content section
- Supports content personalization
- Easier to update content without app releases
- Can A/B test content variations
- Enables user-generated content eventually

**Cons:**
- Requires database schema design and migration
- More complex initial setup
- Need to build admin interface
- Slower content editing workflow initially

**Proposed Database Schema:**

```sql
-- ============================================================================
-- MODULE CONTENT TABLES
-- ============================================================================

-- Days within modules (daily lessons)
CREATE TABLE module_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL, -- e.g., "The Foundation: Inside Reflects Outside"
  teaching_heading TEXT,
  teaching_content TEXT, -- Rich text/markdown
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, day_number)
);

-- Teaching key points (3-4 per day)
CREATE TABLE module_day_key_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_day_id UUID NOT NULL REFERENCES module_days(id) ON DELETE CASCADE,
  point_text TEXT NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practices within days
CREATE TABLE module_day_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_day_id UUID NOT NULL REFERENCES module_days(id) ON DELETE CASCADE,
  practice_type TEXT NOT NULL, -- 'meditation' | 'journaling' | 'exercise'
  duration_minutes INTEGER,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journaling prompts within days
CREATE TABLE module_day_journaling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_day_id UUID NOT NULL REFERENCES module_days(id) ON DELETE CASCADE,
  main_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reflection questions (2-3 per journaling section)
CREATE TABLE module_day_reflection_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_day_journaling_id UUID NOT NULL REFERENCES module_day_journaling(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all content tables
ALTER TABLE module_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_day_key_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_day_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_day_journaling ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_day_reflection_questions ENABLE ROW LEVEL SECURITY;

-- Public read access (content is not user-specific)
CREATE POLICY "Anyone can view module days" ON module_days
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view key points" ON module_day_key_points
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view practices" ON module_day_practices
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view journaling prompts" ON module_day_journaling
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view reflection questions" ON module_day_reflection_questions
  FOR SELECT USING (true);
```

**Migration Script to Seed Module 1 Content:**

```sql
-- Seed Module 1 content from module-1.json
-- This would be a new migration file: 20251030000000_seed_module_1_content.sql

-- Insert days for Module 1
INSERT INTO module_days (module_id, day_number, title, teaching_heading, teaching_content) VALUES
(1, 1, 'The Foundation: Inside Reflects Outside',
 'The Foundation: Inside Reflects Outside',
 'The work you do on the inside reflects in your outer reality. This is not metaphysical theory—it is observable fact. When you avoid your inner wounds, your life feels chaotic. When you face them with radical honesty, clarity emerges...(full content here)'),

(1, 2, 'Meeting All Parts of Yourself',
 'Radical Honesty with Self',
 'You are not one unified person. You are a collection of parts, each formed at different times in your life...(full content here)'),

-- ... continue for all 7 days

-- Insert key points for Day 1
INSERT INTO module_day_key_points (module_day_id, point_text, sequence_order)
SELECT id, 'Inner work creates outer change', 1 FROM module_days WHERE module_id = 1 AND day_number = 1
UNION ALL
SELECT id, 'Avoidance prolongs suffering', 2 FROM module_days WHERE module_id = 1 AND day_number = 1
UNION ALL
SELECT id, 'Facing wounds brings clarity', 3 FROM module_days WHERE module_id = 1 AND day_number = 1;

-- Insert practice for Day 1
INSERT INTO module_day_practices (module_day_id, practice_type, duration_minutes, title, description)
SELECT id, 'meditation', 10, 'Grounding & Centering', 'Begin with a simple grounding practice...'
FROM module_days WHERE module_id = 1 AND day_number = 1;

-- Insert journaling for Day 1
INSERT INTO module_day_journaling (module_day_id, main_prompt)
SELECT id, 'How far do I want to go in my personal transformation journey?'
FROM module_days WHERE module_id = 1 AND day_number = 1;

-- Insert reflection questions for Day 1
INSERT INTO module_day_reflection_questions (module_day_journaling_id, question_text, sequence_order)
SELECT mdj.id, 'What am I willing to face?', 1
FROM module_day_journaling mdj
JOIN module_days md ON md.id = mdj.module_day_id
WHERE md.module_id = 1 AND md.day_number = 1
UNION ALL
SELECT mdj.id, 'What am I avoiding?', 2
FROM module_day_journaling mdj
JOIN module_days md ON md.id = mdj.module_day_id
WHERE md.module_id = 1 AND md.day_number = 1;

-- ... repeat for all 7 days of Module 1
```

**Code Changes Needed:**

Update `/packages/app/utils/react-query/useModuleContentQuery.ts` to fetch from database instead of JSON:

```typescript
// OLD: Load from JSON
import module1Data from '../../content/module-1.json'

// NEW: Fetch from database
const { data, isLoading, error } = useQuery({
  queryKey: ['module-content', moduleId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('module_days')
      .select(`
        *,
        key_points:module_day_key_points(*),
        practice:module_day_practices(*),
        journaling:module_day_journaling(
          *,
          reflection_questions:module_day_reflection_questions(*)
        )
      `)
      .eq('module_id', moduleId)
      .order('day_number', { ascending: true })

    if (error) throw error
    return data
  }
})
```

### Recommendation for Your Task

**For the proposal document (this task):**
- Assume content will remain in JSON files for now (simpler, faster iteration)
- Focus on designing the content structure and day titles
- Create `module-2.json` through `module-16.json` files
- Keep database schema in mind for future migration

**For future scalability:**
- Document the database schema option in your proposals
- Recommend migrating to database once content is validated
- Propose building an admin CMS as a Phase 2 project
- This allows rapid content creation now, structured scaling later

### How to Seed New Modules (JSON Approach)

1. **Create module content file:**
   ```
   /packages/app/content/module-2.json
   ```

2. **Follow module-1.json structure:**
   ```json
   {
     "id": 2,
     "title": "Core Wounds",
     "description": "Identifying your foundational wounds",
     "duration_days": 7,
     "days": [
       {
         "day": 1,
         "title": "What is a Core Wound?",
         "teaching": {
           "heading": "Understanding Core Wounds",
           "content": "...",
           "keyPoints": ["...", "...", "..."]
         },
         "practice": {
           "type": "journaling",
           "duration": 20,
           "title": "...",
           "description": "..."
         },
         "journaling": {
           "prompt": "...",
           "reflectionQuestions": ["...", "..."]
         }
       }
     ]
   }
   ```

3. **Update useModuleContentQuery.ts:**
   Add import and switch case for module 2:
   ```typescript
   import module2Data from '../../content/module-2.json'

   // In the query function:
   if (moduleId === 1) return module1Data
   if (moduleId === 2) return module2Data
   // ... etc
   ```

4. **Test the module:**
   - Complete Module 1
   - Module 2 should unlock
   - Click Module 2 to see the content

This approach allows you to quickly create content for the proposals without database complexity.
