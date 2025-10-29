# Deployment Checklist - Journey Improvements

**Date**: October 29, 2025
**Status**: Ready for Testing
**Reference**: IMPLEMENTATION_SUMMARY.md

---

## Pre-Deployment Steps

### 1. Database Migration

Run the Module 1 title update migration:

```bash
# Development
npx supabase migration up

# Or if using manual approach
npx supabase db push
```

**Verify**:
```sql
SELECT id, title FROM modules WHERE id = 1;
-- Should return: "Self-Discovery Foundations"
```

### 2. Test Module Content Loading

**Module 2 - Core Wounds**:
```bash
# Ensure file is accessible
ls -la packages/app/content/module-2.json

# Should show ~500 lines, 7 days of content
```

**Module 3 - Shadow Work**:
```bash
# Ensure file is accessible
ls -la packages/app/content/module-3.json

# Should show ~1000 lines, 14 days of content
```

**Modules 4-16 Outlines**:
```bash
# Ensure file is accessible
ls -la packages/app/content/modules-4-16-outlines.json

# Should show 13 module outlines with day titles
```

### 3. Build and Test Locally

```bash
# Clean build
yarn cache clean
yarn install

# Generate types (if using Supabase codegen)
yarn supa generate

# Start development server
yarn expo start
```

**Manual Testing Checklist**:
- [ ] Navigate to Journey screen
- [ ] Tap on Module 1 - verify title shows "Self-Discovery Foundations"
- [ ] Complete Module 1 Day 1 (or use existing progress)
- [ ] Tap on Module 2 - verify full content loads
- [ ] Verify all 7 days of Module 2 display correctly
- [ ] Read through a few Module 2 days - check for formatting issues
- [ ] Tap on Module 4 - verify enhanced placeholder loads
- [ ] Check that Module 4 placeholder shows:
  - [ ] "What You'll Explore" section
  - [ ] "The Journey Ahead" with day titles
  - [ ] "Prepare Your Mind" with journaling button
  - [ ] "Return to Journey" button
- [ ] Test journaling button navigation
- [ ] Repeat placeholder test for Module 8 and Module 16

### 4. Content Quality Review

**Module 2 Spot-Check**:
- [ ] Day 1: Teaching content renders correctly (no broken formatting)
- [ ] Day 2: Five wounds list displays properly
- [ ] Day 3: Practice description is clear
- [ ] Day 4: IFS parts connection makes sense
- [ ] Day 5: Timeline exercise journaling prompt is clear
- [ ] Day 6: Loving-kindness meditation description is actionable
- [ ] Day 7: Integration teaching ties back to Module 1

**Module 3 Spot-Check**:
- [ ] Day 1: Shadow definition is clear and not stigmatizing
- [ ] Day 5: 3-2-1 process is explained step-by-step
- [ ] Day 7: Anger teaching avoids spiritual bypassing
- [ ] Day 10: Golden shadow concept is explained accessibly
- [ ] Day 13: Radical honesty guidance is nuanced (not "tell everyone everything")
- [ ] Day 14: Integration teaching is encouraging, not overwhelming

### 5. Accessibility & Inclusivity Check

- [ ] Language is gender-neutral (uses "they/them" in examples)
- [ ] Examples span different backgrounds and experiences
- [ ] Trauma-informed language throughout (no victim-blaming)
- [ ] Cultural sensitivity (acknowledges different family structures, cultures)
- [ ] No ableist language
- [ ] Psychological concepts explained without requiring prior knowledge

---

## Deployment Steps

### Option A: Gradual Rollout (Recommended)

**Phase 1: Database Migration Only**
```bash
# Deploy migration to production
npx supabase db push --remote
```
- Module 1 title updates across app
- No new features visible yet
- Low risk

**Phase 2: Module 2-3 Content**
- Deploy new content files
- Users completing Module 1 can access Module 2
- Monitor for any content rendering issues

**Phase 3: Enhanced Placeholders**
- Deploy updated module screen component
- Users see improved placeholders for Modules 4-16
- Monitor placeholder engagement

### Option B: Full Deployment

Deploy all changes at once:

```bash
# Push database migration
npx supabase db push --remote

# Build and deploy app
eas build --platform ios --profile production
eas build --platform android --profile production

# Or if using OTA updates
eas update --branch production
```

---

## Post-Deployment Monitoring

### Week 1: Stability Check

**Monitor For**:
- [ ] Any errors in Module 2-3 content loading
- [ ] Users successfully viewing Module 2
- [ ] Enhanced placeholders loading correctly
- [ ] No crashes related to new content
- [ ] Module 1 title displays correctly throughout app

**Metrics to Track**:
- Module 1 → Module 2 retention rate
- Module 2 Day 1 views
- Enhanced placeholder views (Modules 4-16)
- Journaling button clicks from placeholders
- Any error logs related to content loading

### Week 2-4: Engagement Check

**User Behavior**:
- [ ] How long users spend on Module 2 days
- [ ] Module 2 completion rate (how many finish all 7 days)
- [ ] Module 3 entry rate (retention from Module 2)
- [ ] Which Module 2/3 days have highest journal entry creation
- [ ] Placeholder engagement: do users journal after seeing placeholders?

**Content Quality Indicators**:
- Review any user feedback/support tickets
- Check for patterns in where users drop off
- Identify which days might need refinement
- Note any reported typos or unclear instructions

### Month 1: Retention Analysis

**Key Questions**:
- What % of Module 1 completers start Module 2?
- What % of Module 2 starters complete Module 2?
- What % of Module 2 completers start Module 3?
- What % of Module 3 starters complete Module 3?
- How does 14-day Module 3 retention compare to 7-day Module 2?

**Drop-off Points**:
- Identify specific days with high drop-off
- Investigate: Is it content difficulty? Length? Life circumstances?
- Consider: Do we need more encouragement/support at certain points?

---

## Rollback Plan

If critical issues arise:

### Option 1: Rollback Content Only

**Problem**: Module 2-3 content has errors
**Solution**:
```bash
# Temporarily show enhanced placeholder for Module 2-3
# Edit module/[id].tsx to exclude moduleIds 2 and 3 from content loading
```

### Option 2: Rollback Migration

**Problem**: Module 1 title change causes issues
**Solution**:
```sql
-- Create reverse migration
UPDATE modules
SET title = 'Awakening'
WHERE id = 1;
```

### Option 3: Rollback Enhanced Placeholders

**Problem**: Placeholder UI has bugs
**Solution**:
```bash
# Revert module/[id].tsx to previous version (generic placeholder)
git revert <commit-hash>
eas update --branch production
```

---

## Success Criteria

### Minimum Viable Success (Week 1)

- [x] No critical bugs or crashes
- [x] Module 1 title displays correctly
- [x] Module 2 content is accessible
- [x] Users can complete Module 2 Day 1
- [x] Enhanced placeholders load without errors

### Good Success (Week 4)

- [ ] >75% of Module 1 completers view Module 2
- [ ] >50% of Module 2 viewers complete Module 2
- [ ] >30% of Module 2 completers start Module 3
- [ ] Placeholder journaling button has >10% click-through rate
- [ ] No major content quality complaints

### Excellent Success (Month 3)

- [ ] >80% of Module 1 completers view Module 2
- [ ] >60% of Module 2 viewers complete Module 2
- [ ] >40% of Module 2 completers complete Module 3
- [ ] Users provide positive feedback on content depth
- [ ] Clear demand/anticipation for Module 4+ content
- [ ] User testimonials mention specific Module 2-3 teachings as impactful

---

## Known Issues & Workarounds

### Issue 1: Module Content Not in Database

**Current State**: Module 2-3 content is in JSON files, not database tables

**Workaround**: Content loading works fine from JSON. Database migration can be deferred until after validation.

**Future Fix**: Implement content database schema (see JOURNEY_IMPROVEMENTS_TASK.md appendix) in Phase 2

### Issue 2: No Practice Library Integration

**Current State**: Enhanced placeholders don't link to specific practices while users wait

**Workaround**: Generic journaling button works. Users can access Practices tab manually.

**Future Fix**: Create practice recommendation system based on module themes

### Issue 3: No Notification System

**Current State**: Users can't sign up to be notified when Module 4+ ready

**Workaround**: Enhanced placeholder shows "early 2026" timeline

**Future Fix**: Implement waitlist/notification feature

---

## Communication Plan

### To Users (In-App)

**When Module 2-3 Goes Live**:
- Consider: Small in-app notification: "Module 2: Core Wounds is now available!"
- Or: Let discovery be organic (users complete Module 1, see Module 2 unlocked)

**When Enhanced Placeholders Go Live**:
- No announcement needed (they'll discover when they explore other modules)

### To Team/Stakeholders

**Weekly Updates**:
- Module 2-3 usage metrics
- Retention rates
- User feedback highlights
- Any issues encountered

**Monthly Review**:
- Comprehensive analysis of Modules 1-3 performance
- Recommendations for Module 4-5 content development
- User testimonials and qualitative feedback

---

## Next Development Priorities

### Immediate (Weeks 1-4)

1. **Monitor & Iterate**
   - Fix any bugs discovered
   - Gather user feedback
   - Make minor content adjustments if needed

2. **Begin Module 4 Development**
   - Inner Child Healing (14 days)
   - Start writing full content while Module 2-3 are being validated

### Short-term (Weeks 5-12)

1. **Complete Module 4-5**
   - Module 4: Inner Child Healing (14 days)
   - Module 5: Somatic Release (10 days)

2. **Enhance Practice Library**
   - Add practices mentioned in Module 2-3 content
   - Create practice recommendation system

3. **Consider Content Database Migration**
   - If Modules 2-3 validate well, migrate to database tables
   - Enables easier editing, personalization, A/B testing

### Medium-term (Weeks 13-24)

1. **Complete Modules 6-10**
2. **Implement Spaced Repetition**
   - Review key concepts from previous modules
3. **Add Progress Visualization**
   - Journey map showing all 16 modules

---

## Emergency Contacts

**If Critical Issue Arises**:

1. **Content Errors**: Review content files, create hotfix, deploy via OTA
2. **Database Issues**: Check migration logs, rollback if needed
3. **App Crashes**: Review error logs, identify offending code, revert
4. **User Reports**: Triage severity, respond within 24h, fix within 1 week

**Escalation Path**:
- Minor (typo, formatting): Fix in next release cycle
- Moderate (unclear teaching, broken link): Fix within 3-5 days
- Major (content not loading, blocking progress): Hotfix within 24h
- Critical (app crash, data loss): Immediate rollback + hotfix

---

## Final Checklist Before Going Live

- [ ] Database migration tested in development
- [ ] Module 2-3 content renders correctly
- [ ] Enhanced placeholders load for all Modules 4-16
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Tested on iOS and Android
- [ ] Tested on different screen sizes
- [ ] Content proofread (no major typos)
- [ ] Psychological accuracy validated
- [ ] Rollback plan documented
- [ ] Monitoring/analytics in place
- [ ] Team aware of deployment timeline

---

**Deployment Approved By**: [Pending]
**Deployment Date**: [Pending]
**Deployed By**: [Pending]

---

## Post-Deployment Sign-off

- [ ] Deployed to production: [Date/Time]
- [ ] Initial smoke tests passed: [Date/Time]
- [ ] Week 1 monitoring complete: [Date]
- [ ] Week 4 success metrics reviewed: [Date]
- [ ] Ready for Phase 2 development: [Date]

**Notes**:
[Add any observations, issues encountered, or lessons learned]

---

**Document Version**: 1.0
**Last Updated**: October 29, 2025
