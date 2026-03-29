'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, X, Save } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { QuizQuestion } from '@/types';
import { toast } from 'sonner';

export default function AdminQuizManager() {
  const { quizzes, subjects, saveQuiz, deleteQuiz, fetchInitialData } = useDataStore();
  
  // Filters
  const [filterYear, setFilterYear] = useState<number>(0);
  const [filterSem, setFilterSem] = useState<number>(0);
  const [filterSubject, setFilterSubject] = useState('');
  
  // Editing state
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);

  const handleAddNew = () => {
    setEditingQuiz({
      id: `Q-${Date.now()}`,
      year: filterYear || 3,
      semester: filterSem || 6,
      subjectId: filterSubject || (subjects[0]?.id || ''),
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

  const handleRefresh = () => {
    toast.promise(fetchInitialData(), {
      loading: 'Refreshing quiz bank from cloud...',
      success: 'Bank synchronized.',
      error: 'Sync failed.'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuiz) {
      saveQuiz(editingQuiz);
      setEditingQuiz(null);
    }
  };

  // Filtered Quizzes
  const filteredQuizzes = quizzes.filter(q => {
    const matchYear = !filterYear || q.year === filterYear;
    const matchSem = !filterSem || q.semester === filterSem;
    const matchSub = !filterSubject || q.subjectId === filterSubject;
    return matchYear && matchSem && matchSub;
  });

  // Derive cascaded options for the editor
  const selectedSubject = subjects.find(s => s.id === editingQuiz?.subjectId);
  const selectedUnit = selectedSubject?.units.find(u => u.no === editingQuiz?.unitNo);

  return (
    <div className="max-w-[1400px] relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1 font-['Syne']">Quiz Bank Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Manage multiple-choice assessments with targeted academic placement.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRefresh} className="btn-ghost flex items-center gap-2 border border-[var(--border)]">
            Refresh from Cloud
          </button>
          <button onClick={handleAddNew} className="btn-primary flex items-center gap-2 shadow-[0_0_20px_rgba(108,99,255,0.3)]">
            <Plus className="w-4 h-4" /> Create Assessment Node
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Filters Panel */}
        <div className="w-full md:w-[300px] flex-shrink-0 bg-[rgba(20,20,25,0.6)] backdrop-blur-md border border-[var(--border)] rounded-[var(--r-xl)] p-5 sticky top-24">
           <h3 className="font-bold text-[13px] text-[var(--text-muted)] tracking-wider mb-4 border-b border-[var(--border)] pb-2 uppercase">Bank Filters</h3>
           <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase tracking-tight">Academic Year</label>
                <select 
                  className="input-field py-2 text-[13px] bg-[var(--bg-base)]"
                  value={filterYear}
                  onChange={(e) => setFilterYear(Number(e.target.value))}
                >
                  <option value={0}>All Years</option>
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase tracking-tight">Semester</label>
                <select 
                  className="input-field py-2 text-[13px] bg-[var(--bg-base)]"
                  value={filterSem}
                  onChange={(e) => setFilterSem(Number(e.target.value))}
                >
                  <option value={0}>All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase tracking-tight">Subject Hub</label>
                <select 
                  className="input-field py-2 text-[13px] bg-[var(--bg-base)]"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Y{s.year})</option>)}
                </select>
              </div>
           </div>
        </div>

        {/* Quiz List */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[12px] font-bold text-[var(--text-muted)]">{filteredQuizzes.length} NODES FOUND</span>
          </div>
          
          {filteredQuizzes.length === 0 && (
            <div className="text-center py-20 text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-[var(--r-xl)] bg-[rgba(255,255,255,0.02)]">
              No assessments found for the current filter set.
            </div>
          )}
          
          {filteredQuizzes.map(q => (
            <div key={q.id} className="group bg-[rgba(20,20,25,0.4)] backdrop-blur-sm border border-[var(--border)] p-5 rounded-[var(--r-lg)] flex justify-between items-start hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-[rgba(108,99,255,0.1)] text-[var(--accent)] flex items-center justify-center flex-shrink-0 border border-[rgba(108,99,255,0.2)] group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold mb-1.5 flex flex-wrap gap-2 items-center">
                    <span className="bg-[var(--glass)] px-2 py-0.5 rounded text-[var(--text-muted)] border border-[var(--border)] font-mono">{q.id}</span>
                    <span className="text-[var(--accent)] uppercase tracking-wide">Year {q.year} · Sem {q.semester}</span>
                    <span className="text-[var(--text-muted)]">|</span>
                    <span className="text-[var(--text-secondary)]">{subjects.find(s => s.id === q.subjectId)?.name || q.subjectId}</span>
                    <span className="text-[var(--text-muted)] opacity-50">· Unit {q.unitNo}</span>
                  </div>
                  <h4 className="font-bold text-[16px] mb-3 leading-snug text-[var(--text-primary)] max-w-2xl">{q.question}</h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="text-[12px] text-[#10b981] font-bold flex gap-2 items-center bg-[#10b98115] px-2.5 py-1 rounded-full border border-[#10b98130]">
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Correct: {q.correct}
                    </div>
                    <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      q.difficulty === 'hard' ? 'border-[#f43f5e] text-[#f43f5e] bg-[#f43f5e10]' : 
                      q.difficulty === 'medium' ? 'border-[#fbbf24] text-[#fbbf24] bg-[#fbbf2410]' : 
                      'border-[#10b981] text-[#10b981] bg-[#10b98110]'
                    }`}>
                      {q.difficulty}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingQuiz(q)} className="btn-icon w-9 h-9 bg-[var(--bg-overlay)] hover:bg-[var(--accent)] hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => confirm('Critical: Purge this assessment node permanently?') && deleteQuiz(q.id)} className="btn-icon w-9 h-9 bg-[var(--bg-overlay)] text-[#f43f5e] hover:bg-[#f43f5e] hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--r-xl)] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-bg)] flex items-center justify-center">
                   <Save className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold font-['Syne'] leading-tight">Sync Assessment Hub</h2>
                  <p className="text-[12px] text-[var(--text-muted)]">Configure granular metadata and curriculum mapping.</p>
                </div>
              </div>
              <button onClick={() => setEditingQuiz(null)} className="p-2.5 bg-[var(--bg-overlay)] rounded-full hover:bg-[#f43f5e20] hover:text-[#f43f5e] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-8">
              
              {/* Mapping Matrix */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-[var(--accent)] tracking-widest uppercase">Academic Mapping Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]"></div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Global Year</label>
                    <select 
                      required
                      className="input-field py-2.5 text-[14px]"
                      value={editingQuiz.year}
                      onChange={(e) => setEditingQuiz({...editingQuiz, year: Number(e.target.value)})}
                    >
                      {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Semester Slot</label>
                    <select 
                      required
                      className="input-field py-2.5 text-[14px]"
                      value={editingQuiz.semester}
                      onChange={(e) => setEditingQuiz({...editingQuiz, semester: Number(e.target.value)})}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Subject Map</label>
                    <select 
                      required
                      className="input-field py-2.5 text-[14px]"
                      value={editingQuiz.subjectId}
                      onChange={(e) => setEditingQuiz({...editingQuiz, subjectId: e.target.value, unitNo: '', topicId: ''})}
                    >
                      <option value="">Select...</option>
                      {subjects.filter(s => s.year === editingQuiz.year && s.semester === editingQuiz.semester).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Unit Slice</label>
                    <select 
                      className="input-field py-2.5 text-[14px]"
                      value={editingQuiz.unitNo}
                      onChange={(e) => setEditingQuiz({...editingQuiz, unitNo: e.target.value, topicId: ''})}
                    >
                      <option value="">General (No Unit)</option>
                      {selectedSubject?.units.map(u => <option key={u.no} value={u.no}>Unit {u.no}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Assessment Core */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-[var(--accent)] tracking-widest uppercase">Assessment Content</h3>
                <div>
                  <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2 px-1">Question/Inquiry Statement</label>
                  <textarea 
                    required
                    className="input-field min-h-[120px] text-[16px] leading-relaxed p-4" 
                    value={editingQuiz.question}
                    onChange={(e) => setEditingQuiz({...editingQuiz, question: e.target.value})}
                    placeholder="Enter the critical concept question..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => (
                    <div key={opt} className={`group p-1 border rounded-[var(--r-lg)] transition-all ${editingQuiz.correct === opt ? 'border-[#10b981] bg-[#10b98108] ring-1 ring-[#10b98130]' : 'border-[var(--border)] hover:border-[var(--border-hover)]'}`}>
                      <div className="flex items-center gap-3 mb-2 px-3 pt-2">
                        <input 
                          type="radio" 
                          name="correctAnswer" 
                          id={`opt-${opt}`}
                          checked={editingQuiz.correct === opt}
                          onChange={() => setEditingQuiz({...editingQuiz, correct: opt})}
                          className="w-4 h-4 accent-[#10b981] cursor-pointer"
                        />
                        <label htmlFor={`opt-${opt}`} className={`text-[12px] font-extrabold cursor-pointer ${editingQuiz.correct === opt ? 'text-[#10b981]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>
                          OPTION {opt} {editingQuiz.correct === opt && '— MARKED AS CORRECT'}
                        </label>
                      </div>
                      <textarea 
                        required
                        className={`input-field min-h-[70px] text-[14px] border-none bg-transparent p-3 focus:ring-0`}
                        value={editingQuiz.options[opt]}
                        onChange={(e) => setEditingQuiz({...editingQuiz, options: {...editingQuiz.options, [opt]: e.target.value}})}
                        placeholder={`Text for choice ${opt}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation & Intelligence */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-[var(--accent)] tracking-widest uppercase">Validation & Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2 px-1">Conceptual Explanation</label>
                      <textarea 
                        required
                        className="input-field min-h-[120px] text-[14px] leading-relaxed p-4" 
                        value={editingQuiz.explanation}
                        onChange={(e) => setEditingQuiz({...editingQuiz, explanation: e.target.value})}
                        placeholder="Provide the rationale for the correct answer..."
                      />
                   </div>
                   <div className="space-y-6">
                      <div>
                        <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-2 uppercase">Assessment Difficulty</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['easy', 'medium', 'hard'] as const).map(d => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setEditingQuiz({...editingQuiz, difficulty: d})}
                              className={`py-2 text-[11px] font-bold uppercase rounded border transition-all ${
                                editingQuiz.difficulty === d 
                                ? 'bg-[var(--accent)] border-[var(--accent)] text-white' 
                                : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--glass)]'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-2 uppercase">Exam Reference (PYQ)</label>
                        <input 
                          type="text"
                          className="input-field py-3 text-[14px]"
                          value={editingQuiz.previousYear || ''}
                          onChange={(e) => setEditingQuiz({...editingQuiz, previousYear: e.target.value})}
                          placeholder="e.g. SVIIT University 2023"
                        />
                      </div>
                   </div>
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex justify-end gap-4 pt-8 border-t border-[var(--border)]">
                <button type="button" onClick={() => setEditingQuiz(null)} className="btn-ghost py-3 px-8 text-[14px] font-bold uppercase tracking-wider">Discard Changes</button>
                <button type="submit" className="btn-primary py-3 px-10 text-[14px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_30px_rgba(108,99,255,0.2)]">
                  <Save className="w-5 h-5" /> Commit To Global Bank
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
