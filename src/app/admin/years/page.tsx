'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, X, Save, RefreshCw } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { CurriculumYear } from '@/types';
import { toast } from 'sonner';

export default function AdminYearsManager() {
  const { curriculum, updateSemesterInfo, updateYearInfo, fetchInitialData } = useDataStore();
  const [editingYear, setEditingYear] = useState<CurriculumYear | null>(null);
  const [editingYearInfo, setEditingYearInfo] = useState<CurriculumYear | null>(null);

  // Sync editingYear if curriculum changes from underneath
  const currentEditingYear = editingYear ? curriculum.find(y => y.year === editingYear.year) : null;

  return (
    <div className="max-w-[1200px] relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Years & Semesters</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Configure scholastic year mappings and semester availability.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { fetchInitialData(); toast.success("Curriculum Refreshed"); }} 
            className="p-2 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-md hover:bg-[var(--glass)] transition-colors"
            title="Refresh from cloud"
          >
            <RefreshCw className="w-4 h-4 text-[var(--accent)]" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Academic Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curriculum.map(year => (
          <div key={year.year} className={`bg-[var(--bg-overlay)] border ${year.status === 'live' ? 'border-[#10b981]' : 'border-[var(--border)]'} rounded-[var(--r-xl)] p-6 group transition-all`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div 
                  className={`w-12 h-12 rounded-[var(--r-lg)] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center transition-colors`}
                  style={{ color: year.status === 'live' ? '#10b981' : 'var(--text-muted)' }}
                >
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Syne'] font-bold text-[20px] text-white">Year 0{year.year}</h3>
                  <p className="text-[13px] text-[var(--text-muted)]">{year.label}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingYearInfo(year)} className="btn-icon w-8 h-8 hover:bg-[var(--accent)] hover:text-white transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="btn-icon w-8 h-8 text-[var(--error)] hover:bg-[#f43f5e20]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">MAPPED SEMESTERS</div>
              <div className="flex flex-wrap gap-2">
                {year.semesters.map(sem => (
                  <span key={sem.sem} className={`px-3 py-1 rounded-full bg-[var(--bg-elevated)] border text-[12px] ${sem.status === 'live' ? 'border-[#10b981] text-[#10b981]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}>
                    Sem {sem.sem} ({sem.status})
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${year.status === 'live' ? 'bg-[#10b98120] text-[#10b981]' : 'bg-[#fbbf2420] text-[#fbbf24]'}`}>
                {year.status.toUpperCase()}
              </span>
              <button onClick={() => setEditingYear(year)} className="text-[12px] font-bold text-[var(--accent)] hover:underline">Configure Access →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Semester Access Modal */}
      {currentEditingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--r-xl)] w-full max-w-lg shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]">
              <h2 className="text-[18px] font-bold font-['Syne']">Configure Access: {currentEditingYear.label}</h2>
              <button onClick={() => setEditingYear(null)} className="p-2 bg-[var(--bg-overlay)] rounded-full hover:bg-[var(--glass)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {currentEditingYear.semesters.map(sem => (
                <div key={sem.sem} className="flex items-center justify-between p-4 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)]">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[14px] font-bold text-white">Semester {sem.sem}</h4>
                      <select 
                        className={`bg-[var(--bg-elevated)] border rounded-md px-2 py-1 text-[11px] font-bold focus:outline-none ${sem.status === 'live' ? 'text-[#10b981] border-[#10b98150]' : 'text-[#fbbf24] border-[#fbbf2450]'}`}
                        value={sem.status}
                        onChange={(e) => {
                          updateSemesterInfo(sem.sem, { status: e.target.value as any });
                        }}
                      >
                        <option value="live">🟢 LIVE</option>
                        <option value="coming-soon">🟡 SOON</option>
                        <option value="locked">🔴 LKD</option>
                      </select>
                    </div>
                    <input 
                      type="text" 
                      className="input-field py-1.5 text-[12px]" 
                      placeholder={`Label (e.g. Semester ${sem.sem})`}
                      value={sem.label || ''}
                      onChange={(e) => updateSemesterInfo(sem.sem, { label: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-[var(--border)] flex justify-end">
              <button onClick={() => setEditingYear(null)} className="btn-primary py-2.5 px-8 flex items-center gap-2">
                Done Configuring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Year Info Modal */}
      {editingYearInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-base)] border border-[var(--border)] rounded-[var(--r-xl)] w-full max-w-md shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]">
              <h2 className="text-[18px] font-bold font-['Syne']">Edit Year Info</h2>
              <button onClick={() => setEditingYearInfo(null)} className="p-2 bg-[var(--bg-overlay)] rounded-full hover:bg-[var(--glass)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2 block">YEAR LABEL</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingYearInfo.label} 
                  onChange={e => setEditingYearInfo({...editingYearInfo, label: e.target.value})}
                  placeholder="e.g. Third Year"
                />
              </div>
            </div>

            <div className="p-5 border-t border-[var(--border)] flex justify-end gap-3">
              <button onClick={() => setEditingYearInfo(null)} className="btn-ghost">Cancel</button>
              <button 
                onClick={() => {
                  updateYearInfo(editingYearInfo.year, { label: editingYearInfo.label });
                  setEditingYearInfo(null);
                }} 
                className="btn-primary px-6 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
