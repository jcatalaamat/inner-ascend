-- Update Module 1 title from "Awakening" to "Self-Discovery Foundations"
-- This aligns the database with the actual content in module-1.json
-- Rationale: "Self-Discovery Foundations" better represents the module's pedagogical intent
-- as an introduction to foundational concepts like radical honesty, self-enquiry, and parts work

UPDATE modules
SET title = 'Self-Discovery Foundations'
WHERE id = 1;
