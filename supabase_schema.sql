-- Run this in your Supabase SQL Editor to enable full cross-device synchronization for ALL modules
-- This version is fully optimized for 4st-4th Year Dynamic Curriculum with performance indexes.

-- 1. Table for Global Settings (Curriculum, Hero Announcement, Exam Dates)
CREATE TABLE IF NOT EXISTS examedge_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Subjects (Syllabus Core)
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
  subject_id TEXT REFERENCES examedge_subjects(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table for Flashcards (Neural Recall)
CREATE TABLE IF NOT EXISTS examedge_flashcards (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES examedge_subjects(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table for Diagrams
CREATE TABLE IF NOT EXISTS examedge_diagrams (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7-10. Common Tables
CREATE TABLE IF NOT EXISTS examedge_quotes ( id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW() );
CREATE TABLE IF NOT EXISTS examedge_syllabi ( id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW() );
CREATE TABLE IF NOT EXISTS examedge_images ( id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW() );
CREATE TABLE IF NOT EXISTS profiles ( id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, full_name TEXT, role TEXT DEFAULT 'student', streak INTEGER DEFAULT 1, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1, updated_at TIMESTAMPTZ DEFAULT NOW() );
CREATE TABLE IF NOT EXISTS user_progress ( id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, subject_id TEXT NOT NULL, topic_id TEXT NOT NULL, completed BOOLEAN DEFAULT TRUE, completed_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(user_id, subject_id, topic_id) );

-- ==========================================
-- STEP 1: MIGRATION GUARDS (Add Columns First)
-- ==========================================
ALTER TABLE examedge_subjects ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT 3;
ALTER TABLE examedge_subjects ADD COLUMN IF NOT EXISTS semester INTEGER NOT NULL DEFAULT 6;

ALTER TABLE examedge_quizzes ADD COLUMN IF NOT EXISTS subject_id TEXT REFERENCES examedge_subjects(id) ON DELETE CASCADE;
ALTER TABLE examedge_quizzes ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT 3;
ALTER TABLE examedge_quizzes ADD COLUMN IF NOT EXISTS semester INTEGER NOT NULL DEFAULT 6;

ALTER TABLE examedge_flashcards ADD COLUMN IF NOT EXISTS subject_id TEXT REFERENCES examedge_subjects(id) ON DELETE CASCADE;
ALTER TABLE examedge_flashcards ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL DEFAULT 3;
ALTER TABLE examedge_flashcards ADD COLUMN IF NOT EXISTS semester INTEGER NOT NULL DEFAULT 6;

ALTER TABLE examedge_diagrams ADD COLUMN IF NOT EXISTS subject_id TEXT REFERENCES examedge_subjects(id) ON DELETE CASCADE;
ALTER TABLE examedge_diagrams ADD COLUMN IF NOT EXISTS year INTEGER DEFAULT 3;
ALTER TABLE examedge_diagrams ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 6;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year INTEGER DEFAULT 3;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 6;

-- ==========================================
-- STEP 2: PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_subjects_year_sem ON examedge_subjects(year, semester);
CREATE INDEX IF NOT EXISTS idx_quizzes_year_sem ON examedge_quizzes(year, semester);
CREATE INDEX IF NOT EXISTS idx_flashcards_year_sem ON examedge_flashcards(year, semester);
CREATE INDEX IF NOT EXISTS idx_diagrams_year_sem ON examedge_diagrams(year, semester);

-- ==========================================
-- STEP 3: SECURITY & POLICIES
-- ==========================================
ALTER TABLE examedge_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE examedge_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.check_is_admin() RETURNS BOOLEAN AS $$
BEGIN RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Idempotent Policies
DO $$ 
BEGIN
    -- Public Read
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
    
    -- Admin All
    DROP POLICY IF EXISTS "Admin All Settings" ON examedge_settings;
    CREATE POLICY "Admin All Settings" ON examedge_settings FOR ALL USING (check_is_admin());
    DROP POLICY IF EXISTS "Admin All Subjects" ON examedge_subjects;
    CREATE POLICY "Admin All Subjects" ON examedge_subjects FOR ALL USING (check_is_admin());
    DROP POLICY IF EXISTS "Admin All Quizzes" ON examedge_quizzes;
    CREATE POLICY "Admin All Quizzes" ON examedge_quizzes FOR ALL USING (check_is_admin());
    DROP POLICY IF EXISTS "Admin All Flashcards" ON examedge_flashcards;
    CREATE POLICY "Admin All Flashcards" ON examedge_flashcards FOR ALL USING (check_is_admin());
END $$;

-- ==========================================
-- STEP 4: SEED DATA
-- ==========================================
INSERT INTO public.examedge_settings (key, value)
VALUES 
  ('hero_announcement', '{"text": "✦ SVIIT B.Tech — Sem 6 Live"}'),
  ('curriculum', '[{"id":1,"year":1,"label":"First Year","sems":"Sem I & II","status":"locked","semesters":[{"sem":1,"label":"Semester 1","status":"locked"},{"sem":2,"label":"Semester 2","status":"locked"}]},{"id":2,"year":2,"label":"Second Year","sems":"Sem III & IV","status":"locked","semesters":[{"sem":3,"label":"Semester 3","status":"locked"},{"sem":4,"label":"Semester 4","status":"locked"}]},{"id":3,"year":3,"label":"Third Year","sems":"Sem V & VI","status":"live","isLive":true,"semesters":[{"sem":5,"label":"Semester 5","status":"coming-soon"},{"sem":6,"label":"Semester 6","status":"live","isLive":true}]},{"id":4,"year":4,"label":"Fourth Year","sems":"Sem VII & VIII","status":"locked","semesters":[{"sem":7,"label":"Semester 1","status":"locked"},{"sem":8,"label":"Semester 2","status":"locked"}]}]'),
  ('exam_dates', '{"1":"","2":"","3":"","4":""}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.examedge_subjects (id, year, semester, data)
VALUES 
  ('compiler-design', 3, 6, '{"id": "compiler-design", "code": "BTCS601N", "name": "Compiler Design", "shortName": "CD", "icon": "⚙️", "color": "#f97316", "colorBg": "rgba(249,115,22,0.12)", "credits": 4, "year": 3, "semester": 6, "tags": ["Core", "Theory", "Systems"], "units": [{"no": "I", "title": "Introduction and Lexical Analysis", "hours": 8, "topics": [{"id": "cd-1-1", "slug": "phases-of-compiler", "name": "Phases of a Compiler", "estimatedMinutes": 12, "difficulty": "medium", "examFrequency": "very-high", "tags": ["Basics", "Pipeline"]}, {"id": "cd-1-2", "slug": "lexical-analysis", "name": "Lexical Analysis & Tokens", "estimatedMinutes": 15, "difficulty": "easy", "examFrequency": "high", "tags": ["Regex", "DFA"]}]}]}'),
  ('ooad', 3, 6, '{"id": "ooad", "code": "BTCS602N", "name": "Object Oriented Analysis & Design", "shortName": "OOAD", "icon": "🔷", "color": "#22c55e", "colorBg": "rgba(34,197,94,0.12)", "credits": 4, "year": 3, "semester": 6, "tags": ["Design", "UML", "Software Eng"], "units": []}'),
  ('cloud-computing', 3, 6, '{"id": "cloud-computing", "code": "BTCS603N", "name": "Cloud Computing", "shortName": "Cloud", "icon": "☁️", "color": "#38bdf8", "colorBg": "rgba(56,189,248,0.12)", "credits": 4, "year": 3, "semester": 6, "tags": ["Infrastructure", "AWS"], "units": []}'),
  ('blockchain', 3, 6, '{"id": "blockchain", "code": "BTDSE611N", "name": "Blockchain Technology", "shortName": "BC", "icon": "🔗", "color": "#a855f7", "colorBg": "rgba(168,85,247,0.12)", "credits": 3, "year": 3, "semester": 6, "tags": ["Cryptography", "Web3"], "units": []}'),
  ('robotics', 3, 6, '{"id": "robotics", "code": "BTDSE612N", "name": "Robotics", "shortName": "Robo", "icon": "🤖", "color": "#f43f5e", "colorBg": "rgba(244,63,94,0.12)", "credits": 3, "year": 3, "semester": 6, "tags": ["Hardware", "AI"], "units": []}'),
  ('iot', 3, 6, '{"id": "iot", "code": "BTDSE613N", "name": "Internet of Things", "shortName": "IoT", "icon": "📡", "color": "#10b981", "colorBg": "rgba(16,185,129,0.12)", "credits": 3, "year": 3, "semester": 6, "tags": ["Embedded", "Networking"], "units": []}'),
  ('data-science', 3, 6, '{"id": "data-science", "code": "BTCS708N", "name": "Data Science", "shortName": "DS", "icon": "📊", "color": "#06b6d4", "colorBg": "rgba(6,182,212,0.12)", "credits": 4, "year": 3, "semester": 6, "tags": ["Machine Learning", "Stats", "Python"], "units": []}')
ON CONFLICT (id) DO UPDATE SET year = EXCLUDED.year, semester = EXCLUDED.semester, data = EXCLUDED.data;
