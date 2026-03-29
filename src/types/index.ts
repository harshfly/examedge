// Curriculum structure
export interface CurriculumYear {
  year: 1|2|3|4;
  label: string;          // "Third Year"
  color: string;          // "#6c63ff"
  semesters: CurriculumSem[];
  status: 'live'|'coming-soon';
  addedByAdmin?: boolean;
}
export interface CurriculumSem {
  sem: 1|2|3|4|5|6|7|8;
  label?: string;         // Optional custom label (e.g. "Spring 2024")
  status: 'live'|'coming-soon'|'locked';
  subjectIds: string[];
  enabledAt?: string;     // ISO date when admin unlocked it
}

// Subject
export interface Subject {
  id: string;             // "compiler-design"
  code: string;           // "BTCS601N"
  name: string;           // "Compiler Design"
  shortName: string;      // "CD"
  icon: string;           // "⚙️"
  color: string;          // "#f97316"
  colorBg: string;        // "rgba(249,115,22,0.12)"
  credits: number;
  year: number; semester: number;
  units: Unit[];
  tags: string[];
  syllabusPdfUrl?: string; // link to official PDF
  updatedAt: string;
  addedByAdmin?: boolean;
}

// Unit
export interface Unit {
  no: string;             // "I"
  title: string;
  hours: number;
  topics: TopicMeta[];
}

export interface TopicMeta {
  id: string;             // "cd-1-1"
  slug: string;           // "phases-of-compiler"
  name: string;
  estimatedMinutes: number;
  difficulty: 'easy'|'medium'|'hard';
  examFrequency: 'very-high'|'high'|'medium'|'low';
  tags: string[];
  lastEditedBy?: string;
  lastEditedAt?: string;
  isCompleted?: boolean;
}

// Full topic content (stored in data files + overrideable by admin)
export interface TopicContent {
  id: string;
  name: string;
  subjectId: string;
  unitNo: string;
  subtopics: string[];
  summary: string[];        // 5-7 bullet points — exam-ready quick facts
  definition: string;       // precise 2-4 sentence definition
  diagrams: TopicDiagram[]; // ARRAY — can have multiple diagrams
  keyPoints: KeyPoint[];
  formulas?: Formula[];
  tables?: ComparisonTable[];
  examples: Example[];
  images?: TopicImage[];    // images uploaded via admin
  notes?: string;           // rich HTML notes from admin editor
  examTip: ExamTip;
  relatedTopics: string[];
  videoUrl?: string;        // [OPTIONAL] embedded YouTube URL
  updatedAt: string;
  updatedBy?: string;
  isCompleted?: boolean;    // local execution state
  customSections?: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface TopicDiagram {
  id: string;
  type: 'mermaid'|'ascii'|'image';
  title: string;
  content: string;          // mermaid code OR ascii text OR image URL
  caption?: string;
}

export interface TopicImage {
  id: string;
  url: string;              // base64 or blob URL from IndexedDB
  caption: string;
  altText: string;
  position: 'inline'|'full-width';
}

export interface KeyPoint {
  id: string;
  text: string;
  isHighlight?: boolean;
  color?: string;           // override subject color if needed
}

export interface Formula {
  name: string;
  expression: string;       // LaTeX string for KaTeX
  description: string;
  variables?: Record<string,string>;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
  highlightRow?: number;    // index of highlighted row
  highlightCol?: number;
}

export interface Example {
  title?: string;
  type: 'code'|'text'|'formula';
  language?: string;        // 'python','c','bash' etc
  content: string;
  explanation?: string;
}

export interface ExamTip {
  threeMark: string;
  fourMark: string;
  sixMark: string;
  neverForget: string[];    // 2-3 lines student MUST memorize
  examFrequency: 'very-high'|'high'|'medium'|'low';
  previousYearRef?: string; // "Asked in 2022 University Exam"
}

// Quiz
export interface QuizQuestion {
  id: string;
  year: number; semester: number;
  subjectId: string; unitNo: string; topicId: string;
  difficulty: 'easy'|'medium'|'hard';
  question: string;
  options: { A:string; B:string; C:string; D:string; };
  correct: 'A'|'B'|'C'|'D';
  explanation: string;
  tags: string[];
  previousYear?: string;    // "SVIIT 2022"
  addedBy?: string;
  addedAt?: string;
}

// Flashcard
export interface Flashcard {
  id: string;
  year: number; semester: number;
  subjectId: string; unitNo: string; topicId: string;
  front: string;
  back: string;
  backDiagram?: string;     // ASCII diagram in back
  backImage?: string;       // image URL
  difficulty: 'easy'|'medium'|'hard';
  tags: string[];
  addedBy?: string;
}

// User progress
export interface UserProgress {
  completedTopics: string[];
  topicViewCounts: Record<string,number>;
  quizAttempts: QuizAttempt[];
  questionResults: Record<string,'correct'|'wrong'>;
  flashcardSR: Record<string,SRData>;
  studyStreak: number;
  lastStudiedDate: string;
  totalStudyMinutes: number;
  xpPoints: number;
  level: number;
  examDates: Record<string,string>;
  bookmarks: string[];
  notes: Record<string,string>;  // personal notes per topic
  selectedYear: number|null;
  selectedSem: number|null;
}

export interface QuizAttempt {
  id: string; timestamp: number;
  subjectFilter: string|null; difficulty: string;
  total: number; correct: number;
  wrongIds: string[]; timeSecs: number; score: number;
}

export interface SRData {
  interval: number; easeFactor: number;
  repetitions: number; nextReview: string;
  lastResult: 'know'|'unsure'|'forgot';
}

// Admin
export interface AdminSession {
  username: string; role: 'super-admin'|'editor';
  token: string; expiresAt: number;
}

export interface ContentDraft {
  topicId: string;
  draft: Partial<TopicContent>;
  savedAt: number; isDirty: boolean;
}

export interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  active: boolean;
  created_at?: string;
}

export interface SyllabusLink {
  id: string;
  year: number;
  semester: number;
  name: string;
  pdf_url: string;
}

export interface DiagramAsset {
  id: string;
  type: 'mermaid' | 'ascii';
  title: string;
  content: string;
  caption?: string;
  updatedAt: string;
}
