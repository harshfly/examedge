import { useMemo } from 'react';
import { useDataStore } from '@/store/useDataStore';
export function useSemesterContext() {
  const { subjects, curriculum, selectedYear, selectedSem, setSelectedSemester } = useDataStore();

  const currentYearData = useMemo(
    () => curriculum.find(y => y.year === selectedYear),
    [curriculum, selectedYear]
  );

  const currentSemData = useMemo(
    () => currentYearData?.semesters.find(s => s.sem === selectedSem),
    [currentYearData, selectedSem]
  );

  const isLive = currentSemData?.status === 'live';

  const semesterSubjects = useMemo(
    () => subjects.filter(s => s.year === selectedYear && s.semester === selectedSem),
    [subjects, selectedYear, selectedSem]
  );

  const semesterQuizzes = useMemo(
    () => {
      const { quizzes } = useDataStore.getState();
      return quizzes.filter(q => q.year === selectedYear && q.semester === selectedSem);
    },
    [selectedYear, selectedSem]
  );

  const semesterFlashcards = useMemo(
    () => {
      const { flashcards } = useDataStore.getState();
      return flashcards.filter(f => f.year === selectedYear && f.semester === selectedSem);
    },
    [selectedYear, selectedSem]
  );

  const totalCredits = useMemo(
    () => semesterSubjects.reduce((sum, s) => sum + s.credits, 0),
    [semesterSubjects]
  );

  const totalUnits = useMemo(
    () => semesterSubjects.reduce((sum, s) => sum + s.units.length, 0),
    [semesterSubjects]
  );

  const semLabel = selectedSem <= 2 ? 'I' : selectedSem <= 4 ? 'III' : selectedSem <= 6 ? 'V' : 'VII';
  const semRoman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][selectedSem] || `${selectedSem}`;

  return {
    selectedYear,
    selectedSem,
    setSelectedSemester,
    currentYearData,
    currentSemData,
    isLive,
    semesterSubjects,
    semesterQuizzes,
    semesterFlashcards,
    totalCredits,
    totalUnits,
    semRoman,
    subjectCount: semesterSubjects.length,
    quizCount: semesterQuizzes.length,
    flashcardCount: semesterFlashcards.length,
  };
}
