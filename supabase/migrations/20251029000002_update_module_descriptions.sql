-- Update module descriptions to match the detailed outlines created
-- This provides users with better context in the Journey screen

-- Module 2: Core Wounds
UPDATE modules
SET description = 'Identify and understand the foundational emotional wounds that shape your reactive patterns and beliefs about self'
WHERE id = 2;

-- Module 3: Shadow Work & Radical Honesty
UPDATE modules
SET description = 'Face the disowned, hidden, and rejected aspects of yourself through radical honesty and shadow integration'
WHERE id = 3;

-- Module 4: Inner Child Healing
UPDATE modules
SET description = 'Meet and heal the younger parts of yourself through developmental trauma work and reparenting practices'
WHERE id = 4;

-- Module 5: Somatic Release
UPDATE modules
SET description = 'Release trauma stored in the body through nervous system regulation and somatic practices'
WHERE id = 5;

-- Module 6: Boundaries & Protection
UPDATE modules
SET description = 'Learn to set healthy boundaries, protect your energy, and distinguish boundaries from walls'
WHERE id = 6;

-- Module 7: Authentic Expression (fix duration from 10 to 7)
UPDATE modules
SET
  description = 'Reclaim your voice and learn to express your truth with clarity, power, and compassion',
  duration_days = 7
WHERE id = 7;

-- Module 8: Shame & Vulnerability (fix duration from 14 to 10)
UPDATE modules
SET
  description = 'Build shame resilience and learn that vulnerability is strength, not weakness',
  duration_days = 10
WHERE id = 8;

-- Module 9: Grief & Loss
UPDATE modules
SET description = 'Learn to grieve what was lost, what never was, and what will never be—and find meaning in loss'
WHERE id = 9;

-- Module 10: Anger & Power
UPDATE modules
SET description = 'Reclaim healthy anger and personal power without dominance or collapse'
WHERE id = 10;

-- Module 11: Fear & Safety
UPDATE modules
SET description = 'Understand your fear responses, build internal safety, and take courageous action despite fear'
WHERE id = 11;

-- Module 12: Love & Intimacy (fix duration from 14 to 10)
UPDATE modules
SET
  description = 'Open to love and intimacy after years of protection—learn to love from wholeness, not need',
  duration_days = 10
WHERE id = 12;

-- Module 13: Life Purpose (fix duration from 10 to 7)
UPDATE modules
SET
  description = 'Discover your unique gifts and purpose—not as career, but as your authentic contribution to the world',
  duration_days = 7
WHERE id = 13;

-- Module 14: Spiritual Integration
UPDATE modules
SET description = 'Integrate your shadow work with spiritual practice—no more spiritual bypassing, only embodied spirituality'
WHERE id = 14;

-- Module 15: Embodiment Practices
UPDATE modules
SET description = 'Live the work in daily life—maintenance practices, crisis practices, and becoming the practice itself'
WHERE id = 15;

-- Module 16: Mastery & Beyond (fix duration from 10 to 7)
UPDATE modules
SET
  description = 'Review your 155-day journey, recognize your growth, and step into the rest of your life as a conscious practitioner',
  duration_days = 7
WHERE id = 16;
