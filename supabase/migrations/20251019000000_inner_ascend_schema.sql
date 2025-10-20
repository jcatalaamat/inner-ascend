-- Inner Ascend - Fresh Start Schema
-- Spiritual practice app with Being Human 101 curriculum

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  -- Cosmic profile data
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- MODULES TABLE (16 Being Human 101 Modules)
-- ============================================================================
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 16 modules
INSERT INTO modules (id, title, description, duration_days, sequence_order) VALUES
(1, 'Awakening', 'Begin your journey of self-discovery', 7, 1),
(2, 'Core Wounds', 'Identifying your foundational wounds', 7, 2),
(3, 'Shadow Work & Radical Honesty', 'Facing what you have been avoiding', 14, 3),
(4, 'Inner Child Healing', 'Reconnecting with your younger self', 14, 4),
(5, 'Somatic Release', 'Releasing trauma from the body', 10, 5),
(6, 'Boundaries & Protection', 'Learning to protect your energy', 7, 6),
(7, 'Authentic Expression', 'Speaking your truth', 10, 7),
(8, 'Shame & Vulnerability', 'Transforming shame into strength', 14, 8),
(9, 'Grief & Loss', 'Processing unresolved grief', 10, 9),
(10, 'Anger & Power', 'Reclaiming your power', 10, 10),
(11, 'Fear & Safety', 'Building inner safety', 10, 11),
(12, 'Love & Intimacy', 'Opening your heart', 14, 12),
(13, 'Life Purpose', 'Discovering your calling', 10, 13),
(14, 'Spiritual Integration', 'Integrating your practice', 10, 14),
(15, 'Embodiment Practices', 'Living from your truth', 10, 15),
(16, 'Mastery & Beyond', 'Continuing the journey', 10, 16);

-- ============================================================================
-- PRACTICES TABLE (Meditations, Exercises, Journaling Prompts)
-- ============================================================================
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('meditation', 'exercise', 'journaling')),
  duration_minutes INTEGER,
  audio_url TEXT,
  description TEXT,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 7 meditations
INSERT INTO practices (title, type, duration_minutes, description) VALUES
('Shadow Integration Meditation', 'meditation', 12, 'Integrate your shadow aspects with compassion'),
('Inner Child Reconnection', 'meditation', 18, 'Reconnect with your younger self'),
('Somatic Release: Shaking Practice', 'meditation', 8, 'Release trauma through movement'),
('Grounding + Anchoring', 'meditation', 5, 'Ground yourself in the present moment'),
('Parts Dialogue Guidance', 'meditation', 15, 'Communicate with different parts of yourself'),
('Heart Opening Meditation', 'meditation', 10, 'Open your heart to love and compassion'),
('Integration & Completion', 'meditation', 14, 'Integrate your practice and celebrate progress');

-- ============================================================================
-- USER PROGRESS TABLE
-- ============================================================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  day_number INTEGER, -- Which day of the module
  UNIQUE(user_id, module_id, day_number)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- JOURNAL ENTRIES TABLE
-- ============================================================================
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE SET NULL,
  prompt TEXT,
  content TEXT NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- DAILY STREAKS TABLE
-- ============================================================================
CREATE TABLE daily_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  practices_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, practice_date)
);

-- Enable RLS
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON daily_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON daily_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON daily_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- EMOTIONAL CHECK-INS TABLE
-- ============================================================================
CREATE TABLE emotional_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emotion_state TEXT NOT NULL CHECK (emotion_state IN ('struggling', 'processing', 'clear', 'integrated')),
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- Enable RLS
ALTER TABLE emotional_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotional checkins" ON emotional_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional checkins" ON emotional_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- COSMIC CACHE TABLE (for caching daily cosmic weather)
-- ============================================================================
CREATE TABLE cosmic_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_date DATE NOT NULL UNIQUE,
  moon_phase TEXT,
  moon_sign TEXT,
  planetary_transits JSONB,
  daily_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_daily_streaks_user_id ON daily_streaks(user_id);
CREATE INDEX idx_daily_streaks_date ON daily_streaks(practice_date);
CREATE INDEX idx_emotional_checkins_user_id ON emotional_checkins(user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for journal_entries updated_at
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
