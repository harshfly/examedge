import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, TopicContent, QuizQuestion, Flashcard, TopicImage, CurriculumYear } from '@/types';
import { subjects as defaultSubjects, curriculum as defaultCurriculum } from '@/data/subjects';
import { cdTopics } from '@/data/content/compiler-design';

interface DataState {
  subjects: Subject[];
  topics: Record<string, TopicContent>;
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
  images: TopicImage[];

  // Curriculum
  curriculum: CurriculumYear[];
  updateSemesterStatus: (sem: number, status: 'live' | 'coming-soon' | 'locked') => void;

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
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      subjects: defaultSubjects,
      topics: cdTopics,
      quizzes: [],
      flashcards: [],
      images: [],
      curriculum: defaultCurriculum,

      updateSemesterStatus: (sem, status) => set((state) => ({
        curriculum: state.curriculum.map(y => ({
          ...y,
          status: y.semesters.some(s => s.sem === sem ? status === 'live' : s.status === 'live') ? 'live' : y.status,
          semesters: y.semesters.map(s => s.sem === sem ? { ...s, status } : s)
        }))
      })),

      // Default to Year 3, Semester 6
      selectedYear: 3,
      selectedSem: 6,
      setSelectedSemester: (year, sem) => set({ selectedYear: year, selectedSem: sem }),

      addSubject: (subject) => set((state) => ({
        subjects: [...state.subjects, subject]
      })),

      updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(s => s.id !== id)
      })),

      saveTopic: (topicId, content) => set((state) => ({
        topics: { ...state.topics, [topicId]: content }
      })),

      deleteTopic: (topicId) => set((state) => {
        const newTopics = { ...state.topics };
        delete newTopics[topicId];
        return { topics: newTopics };
      }),

      saveQuiz: (quiz) => set((state) => {
        const index = state.quizzes.findIndex(q => q.id === quiz.id);
        if (index >= 0) {
          const newQuizzes = [...state.quizzes];
          newQuizzes[index] = quiz;
          return { quizzes: newQuizzes };
        }
        return { quizzes: [...state.quizzes, quiz] };
      }),

      deleteQuiz: (id) => set((state) => ({
        quizzes: state.quizzes.filter(q => q.id !== id)
      })),

      saveFlashcard: (card) => set((state) => {
        const index = state.flashcards.findIndex(f => f.id === card.id);
        if (index >= 0) {
          const newCards = [...state.flashcards];
          newCards[index] = card;
          return { flashcards: newCards };
        }
        return { flashcards: [...state.flashcards, card] };
      }),

      deleteFlashcard: (id) => set((state) => ({
        flashcards: state.flashcards.filter(f => f.id !== id)
      })),

      saveImage: (img) => set((state) => {
        const index = state.images.findIndex(i => i.id === img.id);
        if (index >= 0) {
          const newImages = [...state.images];
          newImages[index] = img;
          return { images: newImages };
        }
        return { images: [...state.images, img] };
      }),

      deleteImage: (id) => set((state) => ({
        images: state.images.filter(i => i.id !== id)
      })),
    }),
    {
      name: 'examedge-database-mock'
    }
  )
);
