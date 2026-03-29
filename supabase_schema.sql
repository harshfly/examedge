-- Run this in your Supabase SQL Editor to enable full cross-device synchronization for ALL modules

-- 1. Table for Global Settings (Curriculum, Exam Dates, etc.)
CREATE TABLE IF NOT EXISTS examedge_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Subjects (Syllabus)
CREATE TABLE IF NOT EXISTS examedge_subjects (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table for Topic Content
CREATE TABLE IF NOT EXISTS examedge_topics (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table for Quiz Questions
CREATE TABLE IF NOT EXISTS examedge_quizzes (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table for Flashcards (Neural Recall)
CREATE TABLE IF NOT EXISTS examedge_flashcards (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table for Diagrams
CREATE TABLE IF NOT EXISTS examedge_diagrams (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table for Motivational Quotes
CREATE TABLE IF NOT EXISTS examedge_quotes (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Official Syllabi Matrix
CREATE TABLE IF NOT EXISTS examedge_syllabi (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Image / Asset Library
CREATE TABLE IF NOT EXISTS examedge_images (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. User Profiles (IMPORTANT FOR LOGIN)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'student',
    year INTEGER DEFAULT 3,
    semester INTEGER DEFAULT 6,
    streak INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration safety for existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- 11. User Progress Tracking (Individual completions)
CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, topic_id)
);

-- Enable RLS
ALTER TABLE examedge_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_syllabi ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for students)
DROP POLICY IF EXISTS "Public Read Settings" ON examedge_settings;
CREATE POLICY "Public Read Settings" ON examedge_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Subjects" ON examedge_subjects;
CREATE POLICY "Public Read Subjects" ON examedge_subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Topics" ON examedge_topics;
CREATE POLICY "Public Read Topics" ON examedge_topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Quizzes" ON examedge_quizzes;
CREATE POLICY "Public Read Quizzes" ON examedge_quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Flashcards" ON examedge_flashcards;
CREATE POLICY "Public Read Flashcards" ON examedge_flashcards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Diagrams" ON examedge_diagrams;
CREATE POLICY "Public Read Diagrams" ON examedge_diagrams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Quotes" ON examedge_quotes;
CREATE POLICY "Public Read Quotes" ON examedge_quotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Syllabi" ON examedge_syllabi;
CREATE POLICY "Public Read Syllabi" ON examedge_syllabi FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Images" ON examedge_images;
CREATE POLICY "Public Read Images" ON examedge_images FOR SELECT USING (true);

-- Profile Policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Helper function to check if a user is an admin without recursion
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User Progress Policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own progress" ON user_progress;
CREATE POLICY "Users can read own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT USING (check_is_admin());

-- Allow all for authenticated users (admin)
DROP POLICY IF EXISTS "Admin All Settings" ON examedge_settings;
CREATE POLICY "Admin All Settings" ON examedge_settings FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Subjects" ON examedge_subjects;
CREATE POLICY "Admin All Subjects" ON examedge_subjects FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Topics" ON examedge_topics;
CREATE POLICY "Admin All Topics" ON examedge_topics FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Quizzes" ON examedge_quizzes;
CREATE POLICY "Admin All Quizzes" ON examedge_quizzes FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Flashcards" ON examedge_flashcards;
CREATE POLICY "Admin All Flashcards" ON examedge_flashcards FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Diagrams" ON examedge_diagrams;
CREATE POLICY "Admin All Diagrams" ON examedge_diagrams FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Quotes" ON examedge_quotes;
CREATE POLICY "Admin All Quotes" ON examedge_quotes FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Syllabi" ON examedge_syllabi;
CREATE POLICY "Admin All Syllabi" ON examedge_syllabi FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Admin All Images" ON examedge_images;
CREATE POLICY "Admin All Images" ON examedge_images FOR ALL USING (check_is_admin());

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, year, semester)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE((NEW.raw_user_meta_data->>'year')::integer, 3),
    COALESCE((NEW.raw_user_meta_data->>'semester')::integer, 6)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users
INSERT INTO public.profiles (id, full_name, role, year, semester, xp, level)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', email), 
  COALESCE(raw_user_meta_data->>'role', 'student'),
  COALESCE((raw_user_meta_data->>'year')::integer, 3),
  COALESCE((raw_user_meta_data->>'semester')::integer, 6),
  0,
  1
FROM auth.users
ON CONFLICT (id) DO NOTHING;
