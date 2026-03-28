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

-- Allow public read access (for students)
CREATE POLICY "Public Read Settings" ON examedge_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Subjects" ON examedge_subjects FOR SELECT USING (true);
CREATE POLICY "Public Read Topics" ON examedge_topics FOR SELECT USING (true);
CREATE POLICY "Public Read Quizzes" ON examedge_quizzes FOR SELECT USING (true);
CREATE POLICY "Public Read Flashcards" ON examedge_flashcards FOR SELECT USING (true);
CREATE POLICY "Public Read Diagrams" ON examedge_diagrams FOR SELECT USING (true);
CREATE POLICY "Public Read Quotes" ON examedge_quotes FOR SELECT USING (true);
CREATE POLICY "Public Read Syllabi" ON examedge_syllabi FOR SELECT USING (true);
CREATE POLICY "Public Read Images" ON examedge_images FOR SELECT USING (true);

-- Allow all for authenticated users (admin)
-- Replace 'authenticated' with your specific admin check if needed
CREATE POLICY "Admin All Settings" ON examedge_settings FOR ALL USING (true);
CREATE POLICY "Admin All Subjects" ON examedge_subjects FOR ALL USING (true);
CREATE POLICY "Admin All Topics" ON examedge_topics FOR ALL USING (true);
CREATE POLICY "Admin All Quizzes" ON examedge_quizzes FOR ALL USING (true);
CREATE POLICY "Admin All Flashcards" ON examedge_flashcards FOR ALL USING (true);
CREATE POLICY "Admin All Diagrams" ON examedge_diagrams FOR ALL USING (true);
CREATE POLICY "Admin All Quotes" ON examedge_quotes FOR ALL USING (true);
CREATE POLICY "Admin All Syllabi" ON examedge_syllabi FOR ALL USING (true);
CREATE POLICY "Admin All Images" ON examedge_images FOR ALL USING (true);
