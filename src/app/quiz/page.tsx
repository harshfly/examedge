'use client';

import { useDataStore } from "@/store/useDataStore";
import { useSemesterContext } from "@/hooks/useSemesterContext";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import ComingSoon from "@/components/ui/ComingSoon";
import { Filter, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";

export default function QuizEngine() {
  const { quizzes } = useDataStore();
  const { semesterSubjects, isLive, semRoman } = useSemesterContext();
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');

  const questions = selectedSubjectId === 'all'
    ? quizzes.filter(q => semesterSubjects.some(s => s.id === q.subjectId))
    : quizzes.filter(q => q.subjectId === selectedSubjectId);

  const currentSubject = semesterSubjects.find(s => s.id === questions[currentQ]?.subjectId) || semesterSubjects[0];

  useEffect(() => {
    setCurrentQ(0);
    setSelectedOpt(null);
    setShowExplanation(false);
  }, [selectedSubjectId]);

  const handleOptionSelect = (key: string) => {
    if (showExplanation) return;
    setSelectedOpt(key);
  };

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      alert("Quiz Complete!");
      setQuizActive(false);
      setCurrentQ(0);
      setSelectedOpt(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-base)]">
      <Navbar />
      
      {!isLive ? (
        <ComingSoon />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Filters */}
          {!quizActive && (
            <div className="hidden md:block w-[260px] flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] p-5 overflow-y-auto">
              <h3 className="text-[14px] font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
              <div className="mb-6 space-y-2">
                <label className="text-[11px] text-[var(--text-muted)] font-bold tracking-wider mb-2 block">SUBJECTS</label>
                <button 
                  type="button"
                  onClick={() => setSelectedSubjectId('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-[var(--r-md)] border text-[13px] transition-all
                    ${selectedSubjectId === 'all' ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-white' : 'border-[var(--border)] bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'}
                  `}
                >
                  All Subjects ({quizzes.filter(q => semesterSubjects.some(s => s.id === q.subjectId)).length})
                </button>
                {semesterSubjects.map(sub => {
                  const count = quizzes.filter(q => q.subjectId === sub.id).length;
                  return (
                    <button 
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-[var(--r-md)] border text-[13px] transition-all flex items-center justify-between
                        ${selectedSubjectId === sub.id ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-white' : 'border-[var(--border)] bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }}></span>
                        {sub.name}
                      </div>
                      {count > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--glass-light)] font-bold">{count}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mb-6">
                <label className="text-[11px] text-[var(--text-muted)] font-bold tracking-wider mb-2 block">DIFFICULTY</label>
                {['Easy', 'Medium', 'Hard', 'Previous Year'].map(dif => (
                  <label key={dif} className="flex items-center gap-2 mb-2 cursor-pointer text-[13px]">
                    <input type="checkbox" className="accent-[var(--accent)]" />
                    {dif}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Main Interface */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
            <div className="w-full max-w-[800px]">
              
              {!quizActive ? (
                <div>
                  <h1 className="h1 mb-2">Quiz Arena</h1>
                  <p className="body-lg text-[var(--text-secondary)] mb-8">Test your knowledge with curated questions for Semester {semRoman}.</p>
                  
                  {questions.length === 0 ? (
                    <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 text-center mt-12">
                      <div className="w-16 h-16 rounded-full bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 text-[24px]">📭</div>
                      <h2 className="h2 mb-2">No Quiz Questions Yet</h2>
                      <p className="text-[14px] text-[var(--text-muted)] mb-6 max-w-[400px] mx-auto">
                        {selectedSubjectId === 'all' ? 'Add questions from the Admin Panel to get started.' : `No questions found for ${currentSubject?.name || 'this subject'}.`}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 text-center mt-12">
                      <div className="w-16 h-16 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center mx-auto mb-4 text-[24px]">❓</div>
                      <h2 className="h2 mb-2">Ready to test yourself?</h2>
                      <p className="text-[14px] text-[var(--text-muted)] mb-6 max-w-[400px] mx-auto">
                        {selectedSubjectId === 'all' ? `${questions.length} questions available across all subjects.` : `${questions.length} questions for ${currentSubject?.name}.`}
                      </p>
                      <button onClick={() => setQuizActive(true)} className="btn-primary min-w-[200px]">Start Quiz Session</button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Question {currentQ + 1} <span className="text-[var(--text-disabled)] font-normal mx-1">of</span> {questions.length}
                    </div>
                    <button onClick={() => setQuizActive(false)} className="text-[12px] text-[var(--error)] hover:underline">Exit Quiz</button>
                  </div>
                  
                  <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden mb-10">
                    <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                  </div>

                  <div className="mb-8">
                    <div className="inline-block px-2.5 py-1 text-[10px] font-bold rounded mb-4" style={{ backgroundColor: `${currentSubject?.color || '#6c63ff'}20`, color: currentSubject?.color || '#6c63ff' }}>
                      {currentSubject?.shortName || 'SUB'} · {questions[currentQ].difficulty.toUpperCase()}
                    </div>
                    <h2 className="text-[20px] md:text-[24px] font-['Syne'] font-bold leading-tight text-[#f0f0f8]">
                      {questions[currentQ].question}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {Object.entries(questions[currentQ].options).map(([key, value]) => {
                      const isSelected = selectedOpt === key;
                      const isCorrect = key === questions[currentQ].correct;
                      
                      let stateClass = "bg-[var(--bg-overlay)] border-[var(--border)] hover:border-[var(--accent)]";
                      if (isSelected && !showExplanation) stateClass = "bg-[var(--accent-bg)] border-[var(--accent)]";
                      if (showExplanation) {
                        if (isCorrect) stateClass = "bg-[#10b98120] border-[#10b981]";
                        else if (isSelected && !isCorrect) stateClass = "bg-[#f43f5e20] border-[#f43f5e]";
                        else stateClass = "bg-[var(--bg-overlay)] border-[var(--border)] opacity-50";
                      }

                      return (
                        <div 
                          key={key} 
                          onClick={() => handleOptionSelect(key)}
                          className={`p-4 rounded-[var(--r-lg)] border-[2px] cursor-pointer transition-all duration-200 flex items-start gap-4 ${stateClass}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[12px] flex-shrink-0 transition-colors
                            ${isSelected && !showExplanation ? 'bg-[var(--accent)] text-white' : 'bg-[var(--glass)] text-[var(--text-muted)]'}
                            ${showExplanation && isCorrect ? 'bg-[#10b981] text-white' : ''}
                            ${showExplanation && isSelected && !isCorrect ? 'bg-[#f43f5e] text-white' : ''}
                          `}>
                            {key}
                          </div>
                          <div className={`text-[15px] pt-0.5 ${showExplanation && isCorrect ? 'text-[#10b981] font-semibold' : 'text-[#c8c8e0]'}`}>
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!showExplanation ? (
                    <button 
                      disabled={!selectedOpt}
                      onClick={handleSubmit}
                      className={`btn-primary w-full py-3.5 text-[15px] ${!selectedOpt ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className={`p-5 rounded-[var(--r-lg)] mb-6 border-l-[4px] flex gap-3
                        ${selectedOpt === questions[currentQ].correct 
                          ? 'bg-[#10b98110] border-[#10b981]' 
                          : 'bg-[#f43f5e10] border-[#f43f5e]'}`}
                      >
                        {selectedOpt === questions[currentQ].correct 
                          ? <CheckCircle2 className="w-6 h-6 text-[#10b981] flex-shrink-0" />
                          : <AlertCircle className="w-6 h-6 text-[#f43f5e] flex-shrink-0" />
                        }
                        <div>
                          <h4 className={`text-[15px] font-bold mb-1 ${selectedOpt === questions[currentQ].correct ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                            {selectedOpt === questions[currentQ].correct ? 'Correct!' : `Incorrect. The correct answer is ${questions[currentQ].correct}.`}
                          </h4>
                          <p className="text-[14px] text-[var(--text-primary)] leading-relaxed">
                            {questions[currentQ].explanation}
                          </p>
                        </div>
                      </div>
                      <button onClick={handleNext} className="btn-secondary w-full py-3.5 text-[15px] flex items-center justify-center gap-2">
                        Next Question <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
