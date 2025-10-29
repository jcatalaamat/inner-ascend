-- Migration: Add UPDATE policy for emotional_checkins
-- Created: 2025-10-29
-- Purpose: Allow users to change their emotional check-in for the day

-- Add UPDATE policy for emotional_checkins table
CREATE POLICY "Users can update own emotional checkins"
  ON emotional_checkins
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_emotional_checkins_user_date
  ON emotional_checkins(user_id, checkin_date);
