'use client';

import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Plus, Edit2, Trash2, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SubjectsManager() {
  const { subjects, addSubject, deleteSubject } = useDataStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSub, setNewSub] = useState({ id: '', code: '', name: '', shortName: '', year: 3, semester: 6, credits: 4, icon: '📚', color: '#6c63ff' });

  const handleSave = () => {
    if (!newSub.id || !newSub.name) return;
    addSubject({
      ...newSub,
      colorBg: `${newSub.color}20`,
      tags: [],
      units: [],
      updatedAt: new Date().toISOString()
    });
    setIsAdding(false);
    setNewSub({ id: '', code: '', name: '', shortName: '', year: 3, semester: 6, credits: 4, icon: '📚', color: '#6c63ff' });
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Subjects Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Manage current curriculum subjects</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-success flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {isAdding && (
        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold mb-4">Add New Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">ID (unique slug)</label>
              <input className="input-field py-2 text-[13px]" placeholder="e.g. machine-learning" value={newSub.id} onChange={e => setNewSub({...newSub, id: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">NAME</label>
              <input className="input-field py-2 text-[13px]" placeholder="Machine Learning" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">CODE</label>
              <input className="input-field py-2 text-[13px]" placeholder="BTCS801N" value={newSub.code} onChange={e => setNewSub({...newSub, code: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">SHORT NAME</label>
              <input className="input-field py-2 text-[13px]" placeholder="ML" value={newSub.shortName} onChange={e => setNewSub({...newSub, shortName: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 justify-end border-t border-[var(--border)] pt-4">
            <button onClick={() => setIsAdding(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save Subject</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(sub => (
          <div key={sub.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-lg)] p-5 hover:border-[var(--accent)] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px]" style={{ backgroundColor: sub.colorBg, color: sub.color }}>
                  {sub.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight mb-0.5">{sub.name}</h3>
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">{sub.code}</div>
                </div>
              </div>
              <div className="flex gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <button className="btn-icon w-7 h-7"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => confirm('Delete?') && deleteSubject(sub.id)} className="btn-icon w-7 h-7 text-[var(--error)] hover:bg-[#f43f5e20] hover:border-[#f43f5e]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="text-[12px] text-[var(--text-secondary)] mb-5">
              Year {sub.year} · Sem {sub.semester} · {sub.credits} Credits · Ensure data consistency when modifying.
            </div>
            <Link href={`/admin/subjects/${sub.id}`} className="block w-full text-center py-2.5 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-md text-[13px] font-bold text-[var(--text-primary)] hover:bg-[var(--glass)] hover:text-white transition-colors">
              Manage Units & Topics →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
