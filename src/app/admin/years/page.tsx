'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

export default function AdminYearsManager() {
  const [years, setYears] = useState([
    { id: 1, label: 'First Year', sems: ['Sem 1', 'Sem 2'], status: 'Coming Soon' },
    { id: 2, label: 'Second Year', sems: ['Sem 3', 'Sem 4'], status: 'Coming Soon' },
    { id: 3, label: 'Third Year', sems: ['Sem 5', 'Sem 6'], status: 'Available' },
    { id: 4, label: 'Fourth Year', sems: ['Sem 7', 'Sem 8'], status: 'Coming Soon' },
  ]);

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Years & Semesters</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Configure scholastic year mappings and semester availability.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Acadamic Year
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {years.map(year => (
          <div key={year.id} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 group hover:border-[var(--accent)] transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[var(--r-lg)] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent-bg)] transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Syne'] font-bold text-[20px] text-white">Year 0{year.id}</h3>
                  <p className="text-[13px] text-[var(--text-muted)]">{year.label}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <button className="btn-icon w-8 h-8"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="btn-icon w-8 h-8 text-[var(--error)]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">MAPPED SEMESTERS</div>
              <div className="flex flex-wrap gap-2">
                {year.sems.map(sem => (
                  <span key={sem} className="px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[12px] text-[var(--text-secondary)]">
                    {sem}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${year.status === 'Available' ? 'bg-[#10b98120] text-[#10b981]' : 'bg-[#fbbf2420] text-[#fbbf24]'}`}>
                {year.status}
              </span>
              <button className="text-[12px] font-bold text-[var(--accent)] hover:underline">Configure Access →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
