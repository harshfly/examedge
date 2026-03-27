'use client';

import Navbar from "@/components/layout/Navbar";
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
    <div className="h-screen flex flex-col bg-[var(--bg-base)] overflow-hidden">
      <Navbar />
      
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displaySubjects.length === 0 && (
              <div className="col-span-full py-12 text-center text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-xl">
                No subjects found for this filter criteria.
              </div>
            )}
            
            {displaySubjects.map(sub => {
              // Forced unlock for testing demonstration
              const isLocked = false;

              return (
                <div key={sub.id} className="group bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 hover:border-[var(--accent)] transition-all duration-300 relative overflow-hidden">
                  
                  {isLocked && (
                     <div className="absolute top-4 right-4 text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1 bg-[var(--bg-base)] px-2 py-1 rounded">
                       <Lock className="w-3 h-3" /> Locked
                     </div>
                  )}

                  <div className="w-14 h-14 rounded-[var(--r-lg)] flex items-center justify-center text-[28px] mb-5 transform group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: sub.colorBg, color: sub.color }}>
                    {sub.icon}
                  </div>
                  
                  <h3 className="text-[18px] font-['Syne'] font-bold text-[#f0f0f8] mb-1 leading-tight group-hover:text-[var(--accent)] transition-colors">
                    {sub.name}
                  </h3>
                  <div className="text-[12px] font-mono text-[var(--text-muted)] mb-5">
                    {sub.code} · Sem {sub.semester}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <span className="text-[12px] font-bold text-[var(--text-secondary)]">
                      {sub.units.length} Units
                    </span>
                    
                    {!isLocked ? (
                      <Link 
                        href={`/study/${sub.id}/${sub.units.find(u => u.topics.length > 0)?.topics[0]?.id || 'cd-1-1'}`}
                        className="btn-icon w-8 h-8 rounded-full bg-[var(--accent)] text-white hover:scale-110 transition-transform"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button className="btn-icon w-8 h-8 rounded-full bg-transparent border border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed">
                         <Lock className="w-3.5 h-3.5" />
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
