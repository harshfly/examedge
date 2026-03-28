'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, X, Save } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { QuizQuestion } from '@/types';

export default function AdminQuizManager() {
  const { quizzes, subjects, saveQuiz, deleteQuiz } = useDataStore();
  
  // Filters
  const [filterSubject, setFilterSubject] = useState('');
  
  // Editing state
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);

  const handleAddNew = () => {
    setEditingQuiz({
      id: `Q-${Date.now()}`,
      subjectId: subjects[0]?.id || '',
      unitNo: subjects[0]?.units[0]?.no || 'I',
      topicId: subjects[0]?.units[0]?.topics[0]?.id || '',
      difficulty: 'medium',
      question: '',
      options: { A: '', B: '', C: '', D: '' },
      correct: 'A',
      explanation: '',
      tags: []
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuiz) {
      saveQuiz(editingQuiz);
      setEditingQuiz(null);
    }
  };

  // Derive cascaded options for the editor
  const selectedSubject = subjects.find(s => s.id === editingQuiz?.subjectId);
  const selectedUnit = selectedSubject?.units.find(u => u.no === editingQuiz?.unitNo);

  return (
    <div className="max-w-[1400px] relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Quiz Bank Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Manage multiple-choice assessments with targeted placement.</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Core Question
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Filters Panel */}
        <div className="w-full md:w-[300px] flex-shrink-0 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-5">
           <h3 className="font-bold text-[13px] text-[var(--text-muted)] tracking-wider mb-4">BANK FILTERS</h3>
           <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">SUBJECT FILTER</label>
                <select 
                  className="input-field py-2 text-[13px]"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
           </div>
        </div>

        {/* Quiz List */}
        <div className="flex-1 space-y-3 w-full">
          {quizzes.length === 0 && <div className="text-center py-10 text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-[var(--r-xl)]">No questions in bank. Click "Create Core Question" to start.</div>}
          {quizzes.filter(q => !filterSubject || q.subjectId === filterSubject).map(q => (
            <div key={q.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] p-4 rounded-[var(--r-lg)] flex justify-between items-start hover:border-[var(--accent)] transition-colors">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(108,99,255,0.1)] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[var(--accent)] mb-1 flex gap-2">
                    <span className="font-mono text-[var(--text-muted)]">{q.id}</span>
                    <span>{subjects.find(s => s.id === q.subjectId)?.name || q.subjectId}</span>
                    <span>· Unit {q.unitNo}</span>
                  </div>
                  <h4 className="font-bold text-[15px] mb-2 leading-tight text-white">{q.question}</h4>
                  <div className="text-[13px] text-[#10b981] flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Correct: {q.correct} ({q.options[q.correct]})
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingQuiz(q)} className="btn-icon w-8 h-8 bg-[var(--bg-overlay)]"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => confirm('Delete Question?') && deleteQuiz(q.id)} className="btn-icon w-8 h-8 bg-[var(--bg-overlay)] text-[#f43f5e]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--r-xl)] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)] sticky top-0 z-10">
              <h2 className="text-[18px] font-bold font-['Syne']">Edit Assessment Node</h2>
              <button onClick={() => setEditingQuiz(null)} className="p-2 bg-[var(--bg-overlay)] rounded-full hover:bg-[var(--glass)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              {/* Placement Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)]">
                <div>
                  <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">TARGET SUBJECT</label>
                  <select 
                    required
                    className="input-field py-2 text-[13px]"
                    value={editingQuiz.subjectId}
                    onChange={(e) => setEditingQuiz({...editingQuiz, subjectId: e.target.value, unitNo: '', topicId: ''})}
                  >
                    <option value="">Select...</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">TARGET UNIT (Optional)</label>
                  <select 
                    disabled={!selectedSubject || selectedSubject.units.length === 0}
                    className="input-field py-2 text-[13px]"
                    value={editingQuiz.unitNo}
                    onChange={(e) => setEditingQuiz({...editingQuiz, unitNo: e.target.value, topicId: ''})}
                  >
                    <option value="">Select...</option>
                    {selectedSubject?.units.map(u => <option key={u.no} value={u.no}>Unit {u.no}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">TARGET TOPIC (Optional)</label>
                  <select 
                    disabled={!selectedUnit || !selectedUnit.topics || selectedUnit.topics.length === 0}
                    className="input-field py-2 text-[13px]"
                    value={editingQuiz.topicId}
                    onChange={(e) => setEditingQuiz({...editingQuiz, topicId: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {selectedUnit?.topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2">Question Inquiry</label>
                <textarea 
                  required
                  className="input-field min-h-[100px] text-[15px]" 
                  value={editingQuiz.question}
                  onChange={(e) => setEditingQuiz({...editingQuiz, question: e.target.value})}
                  placeholder="Enter the main question text..."
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <div key={opt} className={`p-1 border rounded-[var(--r-md)] ${editingQuiz.correct === opt ? 'border-[#10b981] bg-[#10b98110]' : 'border-[var(--border)]'}`}>
                    <div className="flex items-center gap-2 mb-2 px-2 pt-1">
                      <input 
                        type="radio" 
                        name="correctAnswer" 
                        checked={editingQuiz.correct === opt}
                        onChange={() => setEditingQuiz({...editingQuiz, correct: opt})}
                        className="accent-[#10b981]"
                      />
                      <span className={`text-[12px] font-bold ${editingQuiz.correct === opt ? 'text-[#10b981]' : 'text-[var(--text-muted)]'}`}>OPTION {opt} {editingQuiz.correct === opt && '(Correct)'}</span>
                    </div>
                    <textarea 
                      required
                      className={`input-field min-h-[60px] text-[13px] border-none ${editingQuiz.correct === opt ? 'bg-transparent' : ''}`}
                      value={editingQuiz.options[opt]}
                      onChange={(e) => setEditingQuiz({...editingQuiz, options: {...editingQuiz.options, [opt]: e.target.value}})}
                      placeholder={`Text for option ${opt}...`}
                    />
                  </div>
                ))}
              </div>

              {/* Explanation & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2">Explanation for Validation</label>
                    <textarea 
                      required
                      className="input-field min-h-[100px] text-[13px]" 
                      value={editingQuiz.explanation}
                      onChange={(e) => setEditingQuiz({...editingQuiz, explanation: e.target.value})}
                      placeholder="Why is this answer correct?"
                    />
                 </div>
                 <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">DIFFICULTY</label>
                    <select 
                      className="input-field py-2 text-[13px] mb-4"
                      value={editingQuiz.difficulty}
                      onChange={(e) => setEditingQuiz({...editingQuiz, difficulty: e.target.value as any})}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>

                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">PREVIOUS YEAR REFERENCE</label>
                    <input 
                      type="text"
                      className="input-field py-2 text-[13px]"
                      value={editingQuiz.previousYear || ''}
                      onChange={(e) => setEditingQuiz({...editingQuiz, previousYear: e.target.value})}
                      placeholder="e.g. SVIIT 2023 (Optional)"
                    />
                 </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
                <button type="button" onClick={() => setEditingQuiz(null)} className="btn-ghost py-2.5 px-6">Cancel</button>
                <button type="submit" className="btn-primary py-2.5 px-8 flex items-center gap-2"><Save className="w-4 h-4" /> Save Assesment To Bank</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
