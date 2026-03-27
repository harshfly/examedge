'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { Flashcard } from '@/types';

export default function AdminFlashcardManager() {
  const { flashcards, subjects, saveFlashcard, deleteFlashcard } = useDataStore();
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleAddDefault = () => {
    if (!selectedSubject) {
      alert("Please select a subject first!");
      return;
    }
    const newCard: Flashcard = {
      id: `FC-${Date.now()}`,
      subjectId: selectedSubject,
      unitNo: 'I',
      topicId: 'cd-1-1',
      front: 'New Flashcard Question?',
      back: 'The answer goes here.',
      difficulty: 'medium',
      tags: []
    };
    saveFlashcard(newCard);
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Flashcard Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Create and manage exact-recall SRS cards.</p>
        </div>
        <button onClick={handleAddDefault} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Flashcard Definition
        </button>
      </div>

      <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field py-2 text-[13px] bg-transparent w-auto"
          >
            <option value="">Select Subject...</option>
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
              .filter(card => !selectedSubject || card.subjectId === selectedSubject)
              .map(card => (
              <tr key={card.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors">
                <td className="py-3 px-5 text-[var(--text-muted)] font-mono">{card.id}</td>
                <td className="py-3 px-5 font-medium text-[var(--text-primary)] truncate max-w-[300px]">{card.front}</td>
                <td className="py-3 px-5"><span className="text-[var(--accent)] font-bold">{card.subjectId}</span> · Unit {card.unitNo}</td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold
                    ${card.difficulty === 'hard' ? 'bg-[#f43f5e15] text-[#f43f5e]' : 'bg-[#f59e0b15] text-[#f59e0b]'}
                  `}>{card.difficulty}</span>
                </td>
                <td className="py-3 px-5 text-right">
                  <div className="flex justify-end gap-1 opacity-50 hover:opacity-100 transition-opacity">
                    <button className="btn-icon w-8 h-8"><Copy className="w-3.5 h-3.5" /></button>
                    <button className="btn-icon w-8 h-8"><Edit2 className="w-3.5 h-3.5" /></button>
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
    </div>
  );
}
