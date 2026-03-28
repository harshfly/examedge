import { useMemo } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { curriculum } from '@/data/subjects';

export function useSemesterContext() {
  const { subjects, selectedYear, selectedSem, setSelectedSemester } = useDataStore();

  const currentYearData = useMemo(
    () => curriculum.find(y => y.year === selectedYear),
    [selectedYear]
  );

  const currentSemData = useMemo(
    () => currentYearData?.semesters.find(s => s.sem === selectedSem),
    [currentYearData, selectedSem]
  );

  const isLive = currentSemData?.status === 'live';

  const semesterSubjects = useMemo(
    () => subjects.filter(s => s.semester === selectedSem),
    [subjects, selectedSem]
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
    totalCredits,
    totalUnits,
    semRoman,
    subjectCount: semesterSubjects.length,
  };
}
