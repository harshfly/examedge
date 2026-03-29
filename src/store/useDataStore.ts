import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, TopicContent, QuizQuestion, Flashcard, TopicImage, CurriculumYear, CurriculumSem, MotivationQuote, SyllabusLink, DiagramAsset } from '@/types';
import { subjects as defaultSubjects, curriculum as defaultCurriculum } from '@/data/subjects';
import { cdTopics } from '@/data/content/compiler-design';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface DataState {
  subjects: Subject[];
  topics: Record<string, TopicContent>;
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
  images: TopicImage[];
  diagrams: DiagramAsset[];
  quotes: MotivationQuote[];
  syllabi: SyllabusLink[];
  
  // Academic Schedule
  examDates: Record<number, string>; // Year -> ISO Date
  setYearExamDate: (year: number, date: string) => void;

  // Curriculum
  curriculum: CurriculumYear[];
  updateSemesterInfo: (sem: number, updates: Partial<CurriculumSem>) => void;
  updateYearInfo: (year: number, updates: Partial<CurriculumYear>) => void;

  // Hero Announcement
  heroAnnouncement: string;
  setHeroAnnouncement: (text: string) => void;

  // Semester selection
  selectedYear: number;
  selectedSem: number;
  setSelectedSemester: (year: number, sem: number) => void;

  // Subjects
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Topics
  saveTopic: (topicId: string, content: TopicContent) => void;
  deleteTopic: (topicId: string) => void;

  // Assessments
  saveQuiz: (quiz: QuizQuestion) => void;
  deleteQuiz: (id: string) => void;
  saveFlashcard: (card: Flashcard) => void;
  deleteFlashcard: (id: string) => void;

  // Assets
  saveImage: (img: TopicImage) => void;
  deleteImage: (id: string) => void;
  saveDiagram: (diagram: DiagramAsset) => void;
  deleteDiagram: (id: string) => void;

  // System
  saveQuote: (quote: MotivationQuote) => void;
  deleteQuote: (id: string) => void;
  saveSyllabus: (syllabus: SyllabusLink) => void;
  deleteSyllabus: (id: string) => void;

  // Sync Actions
  isSynced: boolean;
  fetchInitialData: () => Promise<void>;
  bootstrapToSupabase: () => Promise<void>;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      subjects: defaultSubjects,
      topics: cdTopics,
      quizzes: [],
      flashcards: [],
      images: [],
      diagrams: [],
      quotes: [],
      syllabi: [],
      curriculum: defaultCurriculum,
      heroAnnouncement: '✦ SVIIT B.Tech — Sem 6 Live',

      // Default to Year 3, Semester 6
      selectedYear: 3,
      selectedSem: 6,
      setSelectedSemester: (year, sem) => set({ selectedYear: year, selectedSem: sem }),

      isSynced: false,

      fetchInitialData: async () => {
        try {
          const [
            { data: subjects },
            { data: topics },
            { data: quizzes },
            { data: flashcards },
            { data: diagrams },
            { data: quotes },
            { data: syllabi },
            { data: settings },
            { data: images }
          ] = await Promise.all([
            supabase.from('examedge_subjects').select('*'),
            supabase.from('examedge_topics').select('*'),
            supabase.from('examedge_quizzes').select('*'),
            supabase.from('examedge_flashcards').select('*'),
            supabase.from('examedge_diagrams').select('*'),
            supabase.from('examedge_quotes').select('*'),
            supabase.from('examedge_syllabi').select('*'),
            supabase.from('examedge_settings').select('*'),
            supabase.from('examedge_images').select('*')
          ]);

          const updates: Partial<DataState> = { isSynced: true };

          if (subjects && subjects.length > 0) updates.subjects = subjects.map((s: any) => s.data);
          
          if (topics && topics.length > 0) {
            const topicsMap: Record<string, TopicContent> = {};
            topics.forEach((t: any) => { topicsMap[t.id] = t.data; });
            updates.topics = topicsMap;
          }

          if (quizzes && quizzes.length > 0) updates.quizzes = quizzes.map((q: any) => ({ ...q.data, year: q.year, semester: q.semester, subjectId: q.subject_id }));
          if (flashcards && flashcards.length > 0) updates.flashcards = flashcards.map((f: any) => ({ ...f.data, year: f.year, semester: f.semester, subjectId: f.subject_id }));
          if (diagrams && diagrams.length > 0) updates.diagrams = diagrams.map((d: any) => ({ ...d.data, year: d.year, semester: d.semester }));
          if (quotes && quotes.length > 0) updates.quotes = quotes.map((q: any) => q.data);
          if (syllabi && syllabi.length > 0) updates.syllabi = syllabi.map((s: any) => s.data);
          if (images && images.length > 0) updates.images = images.map((i: any) => i.data);

          if (settings) {
            const curriculum = settings.find(s => s.key === 'curriculum');
            const examDates = settings.find(s => s.key === 'exam_dates');
            const announcement = settings.find(s => s.key === 'hero_announcement');
            if (curriculum) updates.curriculum = curriculum.value;
            if (examDates) updates.examDates = examDates.value;
            if (announcement) updates.heroAnnouncement = announcement.value.text;
          }

          set(updates);
        } catch (error) {
          console.error("Initial fetch failed:", error);
        }
      },

      bootstrapToSupabase: async () => {
        const state = get();
        try {
          await Promise.all([
            ...state.subjects.map((s: any) => supabase.from('examedge_subjects').upsert({ id: s.id, data: s })),
            ...Object.entries(state.topics).map(([id, data]) => supabase.from('examedge_topics').upsert({ id, data })),
            ...state.quizzes.map((q: any) => supabase.from('examedge_quizzes').upsert({ id: q.id, data: q })),
            ...state.flashcards.map((f: any) => supabase.from('examedge_flashcards').upsert({ id: f.id, data: f })),
            ...state.diagrams.map((d: any) => supabase.from('examedge_diagrams').upsert({ id: d.id, data: d })),
            ...state.quotes.map((q: any) => supabase.from('examedge_quotes').upsert({ id: q.id, data: q })),
            ...state.syllabi.map((s: any) => supabase.from('examedge_syllabi').upsert({ id: s.id, data: s })),
            ...state.images.map((i: any) => supabase.from('examedge_images').upsert({ id: i.id, data: i })),
            supabase.from('examedge_settings').upsert({ key: 'curriculum', value: state.curriculum }),
            supabase.from('examedge_settings').upsert({ key: 'exam_dates', value: state.examDates }),
            supabase.from('examedge_settings').upsert({ key: 'hero_announcement', value: { text: state.heroAnnouncement } })
          ]);
          toast.success("Bootstrap complete. All data is now in Supabase.");
        } catch (error) {
          console.error("Bootstrap failed:", error);
          toast.error("Failed to bootstrap data to Supabase.");
        }
      },

      updateSemesterInfo: (sem, updates) => set((state) => {
        const newCurriculum = state.curriculum.map(y => {
          if (!y.semesters.some(s => s.sem === sem)) return y;
          const updatedSemesters = y.semesters.map(s => s.sem === sem ? { ...s, ...updates } : s);
          // If any semester is live, year is live
          const yearStatus: 'live' | 'coming-soon' = updatedSemesters.some(s => s.status === 'live') ? 'live' : 'coming-soon';
          return { ...y, semesters: updatedSemesters, status: yearStatus };
        });
        
        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_settings').upsert({ key: 'curriculum', value: newCurriculum });
            if (error) throw error;
          })(),
          {
            loading: 'Updating curriculum...',
            success: 'Semester information updated!',
            error: 'Failed to sync curriculum changes'
          }
        );

        return { curriculum: newCurriculum };
      }),

      updateYearInfo: (year, updates) => set((state) => {
        const newCurriculum = state.curriculum.map(y => y.year === year ? { ...y, ...updates } : y);
        
        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_settings').upsert({ key: 'curriculum', value: newCurriculum });
            if (error) throw error;
          })(),
          {
            loading: 'Saving year info...',
            success: `Year 0${year} updated successfully.`,
            error: 'Failed to save year info.'
          }
        );
        
        return { curriculum: newCurriculum };
      }),

      addSubject: (subject) => set((state) => {
        const newSubjects = [...state.subjects, subject];
        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_subjects').upsert({ 
              id: subject.id, 
              year: subject.year,
              semester: subject.semester,
              data: subject 
            });
            if (error) throw error;
          })(),
          {
            loading: 'Initializing subject core...',
            success: `${subject.name} added to curriculum.`,
            error: 'Database sync failed.'
          }
        );
        return { subjects: newSubjects };
      }),

      updateSubject: (id, updates) => set((state) => {
        const newSubjects = state.subjects.map(s => s.id === id ? { ...s, ...updates } : s);
        const updatedSubject = newSubjects.find(s => s.id === id);
        if (updatedSubject) {
          toast.promise(
            (async () => {
              const { error } = await supabase.from('examedge_subjects').upsert({ 
                id, 
                year: updatedSubject.year,
                semester: updatedSubject.semester,
                data: updatedSubject 
              });
              if (error) throw error;
            })(),
            {
              loading: 'Updating academic node...',
              success: 'Subject changes persisted.',
              error: 'Failed to sync subject.'
            }
          );
        }
        return { subjects: newSubjects };
      }),

      deleteSubject: (id) => set((state) => {
        const sub = state.subjects.find(s => s.id === id);
        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_subjects').delete().eq('id', id);
            if (error) throw error;
          })(),
          {
            loading: 'Purging from database...',
            success: `${sub?.name || 'Subject'} removed.`,
            error: 'Failed to delete.'
          }
        );
        return { subjects: state.subjects.filter(s => s.id !== id) };
      }),

      saveTopic: (topicId, content) => set((state) => {
        supabase.from('examedge_topics').upsert({ id: topicId, data: content }).then();
        return { topics: { ...state.topics, [topicId]: content } };
      }),

      deleteTopic: (topicId) => set((state) => {
        supabase.from('examedge_topics').delete().eq('id', topicId).then();
        const newTopics = { ...state.topics };
        delete newTopics[topicId];
        return { topics: newTopics };
      }),

      saveQuiz: (quiz) => set((state) => {
        const year = quiz.year || state.selectedYear;
        const semester = quiz.semester || state.selectedSem;
        const quizWithContext = { ...quiz, year, semester };

        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_quizzes').upsert({ 
              id: quiz.id, 
              year, 
              semester, 
              subject_id: quiz.subjectId,
              data: quizWithContext 
            });
            if (error) {
              console.error('Quiz Sync Error:', error);
              throw error;
            }
          })(),
          {
            loading: 'Syncing assessment...',
            success: 'Quiz question saved.',
            error: (err: any) => `Sync Error: ${err.message || 'Failed to sync quiz.'}`
          }
        );

        const index = state.quizzes.findIndex(q => q.id === quiz.id);
        if (index >= 0) {
          const newQuizzes = [...state.quizzes];
          newQuizzes[index] = quizWithContext;
          return { quizzes: newQuizzes };
        }
        return { quizzes: [...state.quizzes, quizWithContext] };
      }),

      deleteQuiz: (id) => set((state) => {
        supabase.from('examedge_quizzes').delete().eq('id', id).then();
        return { quizzes: state.quizzes.filter(q => q.id !== id) };
      }),

      saveFlashcard: (card) => set((state) => {
        const year = card.year || state.selectedYear;
        const semester = card.semester || state.selectedSem;
        const cardWithContext = { ...card, year, semester };

        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_flashcards').upsert({ 
              id: card.id, 
              year, 
              semester, 
              subject_id: card.subjectId,
              data: cardWithContext 
            });
            if (error) {
              console.error('Flashcard Sync Error:', error);
              throw error;
            }
          })(),
          {
            loading: 'Persisting neural recall...',
            success: 'Flashcard synced.',
            error: (err: any) => `Sync Error: ${err.message || 'Failed to sync flashcard.'}`
          }
        );

        const index = state.flashcards.findIndex(f => f.id === card.id);
        if (index >= 0) {
          const newCards = [...state.flashcards];
          newCards[index] = cardWithContext;
          return { flashcards: newCards };
        }
        return { flashcards: [...state.flashcards, cardWithContext] };
      }),

      deleteFlashcard: (id) => set((state) => {
        supabase.from('examedge_flashcards').delete().eq('id', id).then();
        return { flashcards: state.flashcards.filter(f => f.id !== id) };
      }),

      saveImage: (img) => set((state) => {
        supabase.from('examedge_images').upsert({ id: img.id, data: img }).then();
        const index = state.images.findIndex(i => i.id === img.id);
        if (index >= 0) {
          const newImages = [...state.images];
          newImages[index] = img;
          return { images: newImages };
        }
        return { images: [...state.images, img] };
      }),

      deleteImage: (id) => set((state) => {
        supabase.from('examedge_images').delete().eq('id', id).then();
        return { images: state.images.filter(i => i.id !== id) };
      }),

      saveDiagram: (diagram) => set((state) => {
        const year = state.selectedYear;
        const semester = state.selectedSem;
        const diagramWithContext = { ...diagram, year, semester };

        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_diagrams').upsert({ 
              id: diagram.id, 
              year, 
              semester, 
              data: diagramWithContext 
            });
            if (error) throw error;
          })(),
          {
            loading: 'Uploading diagram...',
            success: 'Diagram persisted.',
            error: 'Failed to sync diagram.'
          }
        );

        const index = state.diagrams.findIndex(d => d.id === diagram.id);
        if (index >= 0) {
          const newDiagrams = [...state.diagrams];
          newDiagrams[index] = diagramWithContext;
          return { diagrams: newDiagrams };
        }
        return { diagrams: [...state.diagrams, diagramWithContext] };
      }),

      deleteDiagram: (id) => set((state) => {
        supabase.from('examedge_diagrams').delete().eq('id', id).then();
        return { diagrams: state.diagrams.filter(d => d.id !== id) };
      }),

      saveQuote: (quote) => set((state) => {
        supabase.from('examedge_quotes').upsert({ id: quote.id, data: quote }).then();
        const index = state.quotes.findIndex(q => q.id === quote.id);
        if (index >= 0) {
          const newQuotes = [...state.quotes];
          newQuotes[index] = quote;
          return { quotes: newQuotes };
        }
        return { quotes: [quote, ...state.quotes] };
      }),

      deleteQuote: (id) => set((state) => {
        supabase.from('examedge_quotes').delete().eq('id', id).then();
        return { quotes: state.quotes.filter(q => q.id !== id) };
      }),

      saveSyllabus: (syllabus) => set((state) => {
        supabase.from('examedge_syllabi').upsert({ id: syllabus.id, data: syllabus }).then();
        const index = state.syllabi.findIndex(s => s.id === syllabus.id);
        if (index >= 0) {
          const newSyllabi = [...state.syllabi];
          newSyllabi[index] = syllabus;
          return { syllabi: newSyllabi };
        }
        return { syllabi: [...state.syllabi, syllabus] };
      }),

      deleteSyllabus: (id) => set((state) => {
        supabase.from('examedge_syllabi').delete().eq('id', id).then();
        return { syllabi: state.syllabi.filter(s => s.id !== id) };
      }),

      // Academic Schedule Defaults
      examDates: {
        1: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days out
        2: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days out
        3: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days out
        4: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days out
      },
      setYearExamDate: (year, date) => set((state) => {
        const newDates = { ...state.examDates, [year]: date };
        supabase.from('examedge_settings').upsert({ key: 'exam_dates', value: newDates }).then();
        return { examDates: newDates };
      }),
      setHeroAnnouncement: (text) => set((state) => {
        toast.promise(
          (async () => {
            const { error } = await supabase.from('examedge_settings').upsert({ key: 'hero_announcement', value: { text } });
            if (error) throw error;
          })(),
          {
            loading: 'Pushing landing page update...',
            success: 'Announcement broadcasted live.',
            error: 'Broadcast failed.'
          }
        );
        return { heroAnnouncement: text };
      }),
    }),
    {
      name: 'examedge-database-mock'
    }
  )
);
