'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, X, Save } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { Flashcard } from '@/types';

export default function AdminFlashcardManager() {
  const { flashcards, subjects, saveFlashcard, deleteFlashcard } = useDataStore();
  const [filterSubject, setFilterSubject] = useState('');
  
  // Editing state
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const handleAddNew = () => {
    setEditingCard({
      id: `FC-${Date.now()}`,
      subjectId: subjects[0]?.id || '',
      unitNo: subjects[0]?.units[0]?.no || 'I',
      topicId: subjects[0]?.units[0]?.topics[0]?.id || '',
      front: '',
      back: '',
      difficulty: 'medium',
      tags: []
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard) {
      saveFlashcard(editingCard);
      setEditingCard(null);
    }
  };

  const selectedSubject = subjects.find(s => s.id === editingCard?.subjectId);
  const selectedUnit = selectedSubject?.units.find(u => u.no === editingCard?.unitNo);

  return (
    <div className="max-w-[1200px] relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Flashcard Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Create and manage exact-recall SRS cards.</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Flashcard Definition
        </button>
      </div>

      <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <select 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="input-field py-2 text-[13px] bg-transparent w-auto"
          >
            <option value="">All Subjects...</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Search Front Text..." className="input-field py-2 text-[13px] bg-transparent flex-1" />
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-[#050508] border-b border-[var(--border)] text-[11px] font-bold text-[var(--text-muted)] tracking-wider">
            <tr>
              <th className="py-3 px-5 w-10">ID</th>
              <th className="py-3 px-5">FRONT PREVIEW</th>
              <th className="py-3 px-5">SUBJECT / TARGET</th>
              <th className="py-3 px-5 w-32">EST. DIFF</th>
              <th className="py-3 px-5 text-right w-32">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {flashcards
              .filter(card => !filterSubject || card.subjectId === filterSubject)
              .map(card => (
              <tr key={card.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors">
                <td className="py-3 px-5 text-[var(--text-muted)] font-mono">{card.id}</td>
                <td className="py-3 px-5 font-medium text-[var(--text-primary)] truncate max-w-[300px]">{card.front}</td>
                <td className="py-3 px-5"><span className="text-[var(--accent)] font-bold">{subjects.find(s=>s.id===card.subjectId)?.name || card.subjectId}</span> · Unit {card.unitNo}</td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold
                    ${card.difficulty === 'hard' ? 'bg-[#f43f5e15] text-[#f43f5e]' : card.difficulty === 'medium' ? 'bg-[#f59e0b15] text-[#f59e0b]' : 'bg-[#10b98115] text-[#10b981]'}
                  `}>{card.difficulty}</span>
                </td>
                <td className="py-3 px-5 text-right">
                  <div className="flex justify-end gap-1 opacity-50 hover:opacity-100 transition-opacity">
                    <button onClick={() => {
                        const newCard = {...card, id: `FC-${Date.now()}`};
                        saveFlashcard(newCard);
                        setEditingCard(newCard);
                    }} className="btn-icon w-8 h-8"><Copy className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setEditingCard(card)} className="btn-icon w-8 h-8"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => confirm('Delete Flashcard?') && deleteFlashcard(card.id)} className="btn-icon w-8 h-8 text-[#f43f5e]"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flashcards.length === 0 && (
          <div className="py-12 text-center text-[var(--text-muted)] text-[13px]">No flashcards found matching criteria.</div>
        )}
      </div>

      {/* Editor Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--r-xl)] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)] sticky top-0 z-10">
              <h2 className="text-[18px] font-bold font-['Syne']">Edit Flashcard Node</h2>
              <button onClick={() => setEditingCard(null)} className="p-2 bg-[var(--bg-overlay)] rounded-full hover:bg-[var(--glass)]">
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
                    value={editingCard.subjectId}
                    onChange={(e) => setEditingCard({...editingCard, subjectId: e.target.value, unitNo: '', topicId: ''})}
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
                    value={editingCard.unitNo}
                    onChange={(e) => setEditingCard({...editingCard, unitNo: e.target.value, topicId: ''})}
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
                    value={editingCard.topicId}
                    onChange={(e) => setEditingCard({...editingCard, topicId: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {selectedUnit?.topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Front Text */}
              <div>
                <label className="text-[12px] font-bold text-[#38bdf8] block mb-2">FRONT (Question / Term)</label>
                <textarea 
                  required
                  className="input-field min-h-[80px] text-[16px] text-center font-bold tracking-tight border-[#38bdf830] focus:border-[#38bdf8]" 
                  value={editingCard.front}
                  onChange={(e) => setEditingCard({...editingCard, front: e.target.value})}
                  placeholder="What is the concept?"
                />
              </div>

              {/* Back Text */}
              <div>
                <label className="text-[12px] font-bold text-[#10b981] block mb-2">BACK (Answer / Definition)</label>
                <textarea 
                  required
                  className="input-field min-h-[120px] text-[15px] border-[#10b98130] focus:border-[#10b981]" 
                  value={editingCard.back}
                  onChange={(e) => setEditingCard({...editingCard, back: e.target.value})}
                  placeholder="The correct definition or answer..."
                />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1.5">INITIAL DIFFICULTY</label>
                    <select 
                      className="input-field py-2 text-[13px]"
                      value={editingCard.difficulty}
                      onChange={(e) => setEditingCard({...editingCard, difficulty: e.target.value as any})}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
                <button type="button" onClick={() => setEditingCard(null)} className="btn-ghost py-2.5 px-6">Cancel</button>
                <button type="submit" className="btn-primary py-2.5 px-8 flex items-center gap-2"><Save className="w-4 h-4" /> Save Flashcard</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
