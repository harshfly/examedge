'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, X, Save, Brain } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { Flashcard } from '@/types';
import { toast } from 'sonner';

export default function AdminFlashcardManager() {
  const { flashcards, subjects, saveFlashcard, deleteFlashcard, fetchInitialData } = useDataStore();
  
  // Filters
  const [filterYear, setFilterYear] = useState<number>(0);
  const [filterSem, setFilterSem] = useState<number>(0);
  const [filterSubject, setFilterSubject] = useState('');
  
  // Editing state
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const handleAddNew = () => {
    setEditingCard({
      id: `FC-${Date.now()}`,
      year: filterYear || 3,
      semester: filterSem || 6,
      subjectId: filterSubject || (subjects[0]?.id || ''),
      unitNo: subjects[0]?.units[0]?.no || 'I',
      topicId: subjects[0]?.units[0]?.topics[0]?.id || '',
      front: '',
      back: '',
      difficulty: 'medium',
      tags: []
    });
  };

  const handleRefresh = () => {
    toast.promise(fetchInitialData(), {
      loading: 'Refreshing neural bank from cloud...',
      success: 'Decks synchronized.',
      error: 'Sync failed.'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard) {
      saveFlashcard(editingCard);
      setEditingCard(null);
    }
  };

  // Filtered Cards
  const filteredCards = flashcards.filter(f => {
    const matchYear = !filterYear || f.year === filterYear;
    const matchSem = !filterSem || f.semester === filterSem;
    const matchSub = !filterSubject || f.subjectId === filterSubject;
    return matchYear && matchSem && matchSub;
  });

  // Derive cascaded options for the editor
  const selectedSubject = subjects.find(s => s.id === editingCard?.subjectId);
  const selectedUnit = selectedSubject?.units.find(u => u.no === editingCard?.unitNo);

  return (
    <div className="max-w-[1400px] relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1 font-['Syne']">Neural Recall Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Organize spaced-repetition flashcards by academic semester.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRefresh} className="btn-ghost flex items-center gap-2 border border-[var(--border)]">
            Refresh Decks
          </button>
          <button onClick={handleAddNew} className="btn-primary flex items-center gap-2 shadow-[0_0_20px_rgba(108,99,255,0.3)]">
            <Plus className="w-4 h-4" /> Create Recall Card
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Filters Panel */}
        <div className="w-full md:w-[300px] flex-shrink-0 bg-[rgba(20,20,25,0.6)] backdrop-blur-md border border-[var(--border)] rounded-[var(--r-xl)] p-5 sticky top-24">
           <h3 className="font-bold text-[13px] text-[var(--text-muted)] tracking-wider mb-4 border-b border-[var(--border)] pb-2 uppercase">Deck Filters</h3>
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

        {/* Card Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
          {filteredCards.length === 0 && (
            <div className="col-span-full text-center py-20 text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-[var(--r-xl)] bg-[rgba(255,255,255,0.02)]">
              No recall cards found for the current filter set.
            </div>
          )}
          
          {filteredCards.map(f => (
            <div key={f.id} className="group bg-[rgba(20,20,25,0.4)] backdrop-blur-sm border border-[var(--border)] p-5 rounded-[var(--r-lg)] flex flex-col hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                   <div className="w-8 h-8 rounded-lg bg-[rgba(108,99,255,0.1)] text-[var(--accent)] flex items-center justify-center flex-shrink-0 border border-[rgba(108,99,255,0.2)]">
                    <Layers className="w-4 h-4" />
                   </div>
                   <div className="text-[11px] font-bold">
                      <span className="text-[var(--accent)] uppercase tracking-wide">Y{f.year} S{f.semester}</span>
                      <span className="mx-2 text-[var(--border)]">|</span>
                      <span className="text-[var(--text-muted)]">{subjects.find(s => s.id === f.subjectId)?.shortName || f.subjectId}</span>
                   </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingCard(f)} className="btn-icon w-8 h-8 bg-[var(--bg-overlay)] hover:bg-[var(--accent)] hover:text-white transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => confirm('Critical: Erase this recall node?') && deleteFlashcard(f.id)} className="btn-icon w-8 h-8 bg-[var(--bg-overlay)] text-[#f43f5e] hover:bg-[#f43f5e] hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="p-3 bg-[var(--bg-base)] rounded-lg border border-[var(--border)] min-h-[60px]">
                   <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase block mb-1 tracking-widest">Front (Prompt)</span>
                   <p className="text-[14px] font-bold leading-tight">{f.front}</p>
                </div>
                <div className="p-3 bg-[rgba(16,185,129,0.05)] rounded-lg border border-[rgba(16,185,129,0.2)] min-h-[60px]">
                   <span className="text-[9px] font-bold text-[#10b981] uppercase block mb-1 tracking-widest">Back (Knowledge)</span>
                   <p className="text-[14px] text-[var(--text-secondary)] leading-tight">{f.back}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center">
                 <div className="flex gap-2">
                    {f.tags.map(t => <span key={t} className="text-[9px] bg-[var(--glass)] px-1.5 py-0.5 rounded uppercase font-bold text-[var(--text-muted)]">{t}</span>)}
                 </div>
                 <div className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                    f.difficulty === 'hard' ? 'border-[#f43f5e] text-[#f43f5e]' : 
                    f.difficulty === 'medium' ? 'border-[#fbbf24] text-[#fbbf24]' : 
                    'border-[#10b981] text-[#10b981]'
                 }`}>
                    {f.difficulty}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--r-xl)] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-bg)] flex items-center justify-center">
                   <Brain className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold font-['Syne'] leading-tight">Sync Recall Card</h2>
                  <p className="text-[12px] text-[var(--text-muted)]">Configure neural retrieval mapping and content.</p>
                </div>
              </div>
              <button onClick={() => setEditingCard(null)} className="p-2.5 bg-[var(--bg-overlay)] rounded-full hover:bg-[#f43f5e20] hover:text-[#f43f5e] transition-all">
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
                      value={editingCard.year}
                      onChange={(e) => setEditingCard({...editingCard, year: Number(e.target.value)})}
                    >
                      {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Semester Slot</label>
                    <select 
                      required
                      className="input-field py-2.5 text-[14px]"
                      value={editingCard.semester}
                      onChange={(e) => setEditingCard({...editingCard, semester: Number(e.target.value)})}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Subject Map</label>
                    <select 
                      required
                      className="input-field py-2.5 text-[14px]"
                      value={editingCard.subjectId}
                      onChange={(e) => setEditingCard({...editingCard, subjectId: e.target.value, unitNo: '', topicId: ''})}
                    >
                      <option value="">Select...</option>
                      {subjects.filter(s => s.year === editingCard.year && s.semester === editingCard.semester).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase leading-none">Unit Slice</label>
                    <select 
                      className="input-field py-2.5 text-[14px]"
                      value={editingCard.unitNo}
                      onChange={(e) => setEditingCard({...editingCard, unitNo: e.target.value, topicId: ''})}
                    >
                      <option value="">General Deck</option>
                      {selectedSubject?.units.map(u => <option key={u.no} value={u.no}>Unit {u.no}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Content Core */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2 px-1">Front (Prompt/Inquiry)</label>
                    <textarea 
                      required
                      className="input-field min-h-[160px] text-[18px] font-bold leading-tight p-5 border-[var(--accent)] ring-1 ring-[var(--accent-bg)]" 
                      value={editingCard.front}
                      onChange={(e) => setEditingCard({...editingCard, front: e.target.value})}
                      placeholder="What is the prompt for this card?"
                    />
                 </div>
                 <div>
                    <label className="text-[12px] font-bold text-[var(--text-primary)] block mb-2 px-1">Back (Target Knowledge)</label>
                    <textarea 
                      required
                      className="input-field min-h-[160px] text-[15px] leading-relaxed p-5 border-[#10b981] ring-1 ring-[#10b98110]" 
                      value={editingCard.back}
                      onChange={(e) => setEditingCard({...editingCard, back: e.target.value})}
                      placeholder="What is the answer/explanation?"
                    />
                 </div>
              </div>

              {/* Advanced Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1 uppercase tracking-widest">ASCII Visual (Optional)</label>
                    <textarea 
                      className="input-field min-h-[120px] font-mono text-[12px] bg-[var(--bg-overlay)] p-4 leading-none whitespace-pre" 
                      value={editingCard.backDiagram || ''}
                      onChange={(e) => setEditingCard({...editingCard, backDiagram: e.target.value})}
                      placeholder="+---+   +---+\n| A |-->| B |\n+---+   +---+"
                    />
                 </div>
                 <div className="space-y-6">
                    <div>
                      <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-2 uppercase">Spaced Repetition Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['easy', 'medium', 'hard'] as const).map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setEditingCard({...editingCard, difficulty: d})}
                            className={`py-2.5 text-[11px] font-bold uppercase rounded border transition-all ${
                              editingCard.difficulty === d 
                              ? 'bg-[#10b981] border-[#10b981] text-white' 
                              : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--glass)]'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-2 uppercase">Neural Tags (Comma separated)</label>
                      <input 
                        type="text"
                        className="input-field py-3 text-[14px]"
                        value={editingCard.tags?.join(', ') || ''}
                        onChange={(e) => setEditingCard({...editingCard, tags: e.target.value.split(',').map(t => t.trim())})}
                        placeholder="e.g. definition, theorem, syntax"
                      />
                    </div>
                 </div>
              </div>

              {/* Final Actions */}
              <div className="flex justify-end gap-4 pt-8 border-t border-[var(--border)]">
                <button type="button" onClick={() => setEditingCard(null)} className="btn-ghost py-3 px-8 text-[14px] font-bold uppercase tracking-wider">Discard Changes</button>
                <button type="submit" className="btn-primary py-3 px-10 text-[14px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_30px_rgba(108,99,255,0.2)]">
                  <Save className="w-5 h-5" /> Commit To Neural Bank
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
