-- Migration: Add live_sessions and session_rsvps tables for Community tab
-- Created: 2025-10-29

-- Create live_sessions table
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url TEXT, -- Zoom/Google Meet link
  meeting_password TEXT,
  facilitator TEXT,
  max_participants INTEGER,
  session_type TEXT CHECK (session_type IN ('healing_circle', 'workshop', 'meditation', 'q_and_a')) DEFAULT 'healing_circle',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session_rsvps table for RSVP tracking
CREATE TABLE session_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_status TEXT CHECK (rsvp_status IN ('yes', 'maybe', 'no')) DEFAULT 'yes',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_rsvps ENABLE ROW LEVEL SECURITY;

-- Policies for live_sessions (everyone can view published sessions)
CREATE POLICY "Anyone can view published live sessions"
  ON live_sessions
  FOR SELECT
  USING (is_published = true);

-- Policies for session_rsvps (users can manage their own RSVPs)
CREATE POLICY "Users can view own RSVPs"
  ON session_rsvps
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own RSVPs"
  ON session_rsvps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVPs"
  ON session_rsvps
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSVPs"
  ON session_rsvps
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_live_sessions_date ON live_sessions(session_date);
CREATE INDEX idx_live_sessions_published ON live_sessions(is_published);
CREATE INDEX idx_session_rsvps_session_id ON session_rsvps(session_id);
CREATE INDEX idx_session_rsvps_user_id ON session_rsvps(user_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_live_sessions_updated_at
  BEFORE UPDATE ON live_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_rsvps_updated_at
  BEFORE UPDATE ON session_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO live_sessions (title, description, session_date, session_time, duration_minutes, meeting_url, facilitator, session_type) VALUES
('New Moon Healing Circle', 'Join us for a sacred healing circle under the new moon. We will work with shadow integration and release what no longer serves us. This is a safe, supportive space for deep inner work.', '2024-11-15', '19:00:00', 90, 'https://zoom.us/j/example', 'Astral Amat', 'healing_circle'),
('Shadow Work Workshop', 'Deep dive into shadow work practices. Learn techniques for identifying and integrating your shadow aspects. This interactive workshop includes guided exercises and group sharing.', '2024-11-22', '18:00:00', 120, 'https://zoom.us/j/example2', 'Astral Amat', 'workshop'),
('Community Meditation', 'Group meditation session focusing on heart opening and compassion. Perfect for beginners and experienced practitioners alike. We will end with gentle sharing.', '2024-11-29', '20:00:00', 60, 'https://zoom.us/j/example3', 'Guest Facilitator', 'meditation'),
('Inner Child Integration Q&A', 'Open Q&A session about working with your inner child. Bring your questions about the practices, challenges, and breakthroughs on your journey.', '2024-12-06', '19:30:00', 75, 'https://zoom.us/j/example4', 'Astral Amat', 'q_and_a');
