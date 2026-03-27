'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { QuizQuestion } from '@/types';

export default function AdminQuizManager() {
  const { quizzes, saveQuiz, deleteQuiz } = useDataStore();
  
  const handleAddDefault = () => {
    const newQuiz: QuizQuestion = {
      id: `Q-${Date.now()}`,
      subjectId: 'compiler-design',
      unitNo: 'I',
      topicId: 'cd-1-1',
      difficulty: 'medium',
      question: 'New Question Text?',
      options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
      correct: 'A',
      explanation: 'Explanation for the answer.',
      tags: []
    };
    saveQuiz(newQuiz);
  };

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Quiz Bank Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Manage multiple-choice assessment arrays.</p>
        </div>
        <button onClick={handleAddDefault} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Core Question
        </button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="w-[300px] flex-shrink-0 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-5">
           <h3 className="font-bold text-[13px] text-[var(--text-muted)] tracking-wider mb-4">BANK FILTERS</h3>
           <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">SUBJECT DATABASE</label>
                <select className="input-field py-2 text-[13px]"><option>Compiler Design</option></select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">QUESTION TYPE</label>
                <select className="input-field py-2 text-[13px]">
                  <option>Standard MCQ</option>
                  <option>Multi-Select</option>
                  <option>Assertion/Reasoning</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">DIFFICULTY POOL</label>
                <select className="input-field py-2 text-[13px]">
                  <option>All Severities</option>
                  <option>SVIIT Prev. Year</option>
                </select>
              </div>
           </div>
        </div>

        <div className="flex-1 space-y-3">
          {quizzes.length === 0 && <div className="text-center py-10 text-[var(--text-muted)]">No questions in bank. Click "Create Core Question" to start.</div>}
          {quizzes.map(q => (
            <div key={q.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] p-4 rounded-[var(--r-lg)] flex justify-between items-start hover:border-[var(--accent)] transition-colors">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(108,99,255,0.1)] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[var(--accent)] mb-1 flex gap-2">
                    <span className="font-mono text-[var(--text-muted)]">{q.id}</span>
                    <span>{q.subjectId}</span>
                  </div>
                  <h4 className="font-bold text-[15px] mb-2 leading-tight text-white">{q.question}</h4>
                  <div className="text-[13px] text-[#10b981] flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Correct: {q.correct} ({q.options[q.correct]})
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-icon w-8 h-8 bg-[var(--bg-overlay)]"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => confirm('Delete Question?') && deleteQuiz(q.id)} className="btn-icon w-8 h-8 bg-[var(--bg-overlay)] text-[#f43f5e]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
