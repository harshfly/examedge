'use client';

import { curriculum } from '@/data/subjects';
import { useSemesterContext } from '@/hooks/useSemesterContext';
import { Lock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SemesterSwitcher() {
  const { selectedYear, selectedSem, setSelectedSemester } = useSemesterContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-full px-5 py-2.5 hover:border-[var(--accent)] transition-all group"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: curriculum.find(y => y.year === selectedYear)?.color || '#6c63ff' }}></span>
          <span className="text-[13px] font-bold text-[var(--text-primary)]">
            Year {selectedYear}
          </span>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-[13px] font-bold text-[var(--accent)]">
            Sem {['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][selectedSem]}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[340px] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-xl)] shadow-[var(--shadow-xl)] p-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase mb-3 px-1">Select Semester</div>
          
          <div className="space-y-2">
            {curriculum.map(year => (
              <div key={year.year}>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: year.color }}></span>
                  <span className="text-[12px] font-bold text-[var(--text-secondary)]">{year.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 ml-4">
                  {year.semesters.map(sem => {
                    const isActive = selectedYear === year.year && selectedSem === sem.sem;
                    const isLocked = sem.status !== 'live';
                    const semRoman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][sem.sem];
                    
                    return (
                      <button
                        key={sem.sem}
                        type="button"
                        onClick={() => {
                          setSelectedSemester(year.year, sem.sem);
                          setOpen(false);
                        }}
                        className={`relative text-left px-3 py-2 rounded-[var(--r-md)] border text-[12px] font-bold transition-all
                          ${isActive
                            ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-white shadow-lg'
                            : isLocked
                              ? 'border-[var(--border)] bg-[var(--bg-overlay)] text-[var(--text-disabled)] cursor-pointer hover:border-[var(--border-hover)]'
                              : 'border-[var(--border)] bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-white'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Semester {semRoman}</span>
                          {isLocked && <Lock className="w-3 h-3 text-[var(--text-disabled)]" />}
                        </div>
                        {isLocked && (
                          <span className="text-[9px] font-normal text-[var(--text-disabled)] mt-0.5 block">Coming Soon</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
