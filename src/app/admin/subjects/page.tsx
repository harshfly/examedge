'use client';

import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Plus, Edit2, Trash2, ChevronRight, BookOpen, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SubjectsManager() {
  const { subjects, addSubject, deleteSubject, updateSubject, fetchInitialData } = useDataStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
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

  const handleUpdate = () => {
    if (!editingSub) return;
    updateSubject(editingSub.id, {
      ...editingSub,
      colorBg: `${editingSub.color}20`,
      updatedAt: new Date().toISOString()
    });
    setEditingSub(null);
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Subjects Manager</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Manage current curriculum subjects</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { fetchInitialData(); toast.success("Subjects Refreshed"); }} 
            className="p-2 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-md hover:bg-[var(--glass)] transition-colors"
            title="Refresh from cloud"
          >
            <RefreshCw className="w-4 h-4 text-[var(--accent)]" />
          </button>
          <button onClick={() => setIsAdding(true)} className="btn-success flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {(isAdding || editingSub) && (
        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold mb-4">{isAdding ? 'Add New Subject' : 'Edit Subject'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">ID (unique slug)</label>
              <input 
                className="input-field py-2 text-[13px] disabled:opacity-50" 
                placeholder="e.g. machine-learning" 
                disabled={!isAdding}
                value={isAdding ? newSub.id : editingSub.id} 
                onChange={e => isAdding ? setNewSub({...newSub, id: e.target.value}) : setEditingSub({...editingSub, id: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">NAME</label>
              <input className="input-field py-2 text-[13px]" placeholder="Machine Learning" value={isAdding ? newSub.name : editingSub.name} onChange={e => isAdding ? setNewSub({...newSub, name: e.target.value}) : setEditingSub({...editingSub, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">CODE</label>
              <input className="input-field py-2 text-[13px]" placeholder="BTCS801N" value={isAdding ? newSub.code : editingSub.code} onChange={e => isAdding ? setNewSub({...newSub, code: e.target.value}) : setEditingSub({...editingSub, code: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">SHORT NAME</label>
              <input className="input-field py-2 text-[13px]" placeholder="ML" value={isAdding ? newSub.shortName : editingSub.shortName} onChange={e => isAdding ? setNewSub({...newSub, shortName: e.target.value}) : setEditingSub({...editingSub, shortName: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">YEAR</label>
              <select className="input-field py-2 text-[13px]" value={isAdding ? newSub.year : editingSub.year} onChange={e => isAdding ? setNewSub({...newSub, year: parseInt(e.target.value)}) : setEditingSub({...editingSub, year: parseInt(e.target.value)})}>
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">SEMESTER</label>
              <select className="input-field py-2 text-[13px]" value={isAdding ? newSub.semester : editingSub.semester} onChange={e => isAdding ? setNewSub({...newSub, semester: parseInt(e.target.value)}) : setEditingSub({...editingSub, semester: parseInt(e.target.value)})}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">ICON</label>
              <input className="input-field py-2 text-[13px]" value={isAdding ? newSub.icon : editingSub.icon} onChange={e => isAdding ? setNewSub({...newSub, icon: e.target.value}) : setEditingSub({...editingSub, icon: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">PRIMARY HEX</label>
              <div className="flex gap-2">
                <input type="color" className="w-10 h-10 rounded-md bg-transparent border border-[var(--border)] cursor-pointer" value={isAdding ? newSub.color : editingSub.color} onChange={e => isAdding ? setNewSub({...newSub, color: e.target.value}) : setEditingSub({...editingSub, color: e.target.value})} />
                <input className="input-field py-2 text-[13px] flex-1" value={isAdding ? newSub.color : editingSub.color} onChange={e => isAdding ? setNewSub({...newSub, color: e.target.value}) : setEditingSub({...editingSub, color: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end border-t border-[var(--border)] pt-4">
            <button onClick={() => { setIsAdding(false); setEditingSub(null); }} className="btn-ghost">Cancel</button>
            <button onClick={isAdding ? handleSave : handleUpdate} className="btn-primary">{isAdding ? 'Save Subject' : 'Update Subject'}</button>
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
                <button onClick={() => { setEditingSub(sub); setIsAdding(false); }} className="btn-icon w-7 h-7 hover:bg-[var(--accent)] hover:text-white hover:border-transparent transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => confirm('Delete?') && deleteSubject(sub.id)} className="btn-icon w-7 h-7 text-[var(--error)] hover:bg-[#f43f5e20] hover:border-[#f43f5e]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="text-[12px] text-[var(--text-secondary)] mb-5">
              Year {sub.year} · Sem {sub.semester} · {sub.credits} Credits · Ensure data consistency.
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
