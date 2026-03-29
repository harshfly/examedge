'use client';

import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import { FolderOpen, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StudyIndexPage() {
  const { subjects } = useDataStore();
  const { user } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'my-sem'>('my-sem');

  // If filter is 'my-sem', only show subjects matching the user's selected context.
  // For safety, providing a fallback allowing seeing all if no sem selected.
  const displaySubjects = subjects.filter(sub => {
    if (filter === 'all') return true;
    if (user?.selectedSem) return sub.semester === user.selectedSem;
    return true; // fallback
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="h1 mb-2">Subject Library</h1>
              <p className="body-lg text-[var(--text-secondary)]">
                {user?.selectedSem ? `Target Curriculum for Semester ${user.selectedSem}` : 'Browse all available interactive subjects.'}
              </p>
            </div>
            
            <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)]">
              <button 
                onClick={() => setFilter('my-sem')}
                className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all ${filter === 'my-sem' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
              >
                My Semester
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all ${filter === 'all' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
              >
                All Subjects
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {displaySubjects.length === 0 && (
              <div className="col-span-full py-12 text-center text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-xl">
                No subjects found for this filter criteria.
              </div>
            )}
            
            {displaySubjects.map(sub => {
              // Forced unlock for testing demonstration
              const isLocked = false;

              return (
                <div key={sub.id} className="group bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[16px] md:rounded-[var(--r-xl)] p-3 md:p-6 hover:border-[var(--accent)] transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                  
                  {isLocked && (
                     <div className="absolute top-2 md:top-4 right-2 md:right-4 text-[8px] md:text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1 bg-[var(--bg-base)] px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                       <Lock className="w-2.5 md:w-3 h-2.5 md:h-3" /> Locked
                     </div>
                  )}

                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-[10px] md:rounded-[var(--r-lg)] flex items-center justify-center text-[20px] md:text-[28px] mb-3 md:mb-5 transform group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: sub.colorBg, color: sub.color }}>
                    {sub.icon}
                  </div>
                  
                  <h3 className="text-[14px] md:text-[18px] font-['Syne'] font-bold text-[#f0f0f8] mb-0.5 md:mb-1 leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2 md:line-clamp-none flex-1">
                    {sub.name}
                  </h3>
                  <div className="text-[9px] md:text-[12px] font-mono text-[var(--text-muted)] mb-3 md:mb-5">
                    {sub.code} · Sem {sub.semester}
                  </div>

                  <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-[rgba(255,255,255,0.05)] mt-auto">
                    <span className="text-[10px] md:text-[12px] font-bold text-[var(--text-secondary)]">
                      {sub.units.length} Units
                    </span>
                    
                    {!isLocked ? (
                      <Link 
                        href={`/study/${sub.id}/${sub.units.find(u => u.topics.length > 0)?.topics[0]?.id || 'cd-1-1'}`}
                        className="btn-icon w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--accent)] text-white hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      </Link>
                    ) : (
                      <button className="btn-icon w-7 h-7 md:w-8 md:h-8 rounded-full bg-transparent border border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed flex items-center justify-center">
                         <Lock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
