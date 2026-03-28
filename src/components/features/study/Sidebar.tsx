'use client';

import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { Subject, Unit } from '@/types';

interface SidebarProps {
  subject: Subject;
  allSubjects: Subject[];
  currentTopicId: string;
}

export default function Sidebar({ subject, allSubjects, currentTopicId }: SidebarProps) {
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({ [subject.units[0]?.no || 'I']: true });

  const toggleUnit = (no: string) => {
    setOpenUnits(prev => ({ ...prev, [no]: !prev[no] }));
  };

  return (
    <div className="w-full lg:w-[268px] flex-shrink-0 h-full bg-[var(--bg-elevated)] border-r border-[var(--border)] flex flex-col overflow-y-auto">
      {/* Subject Dropdown Context */}
      <div className="p-4 border-b border-[var(--border)]">
        <select 
          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-[var(--r-md)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none"
          defaultValue={subject.id}
          onChange={(e) => {
            const selectedSub = allSubjects.find(s => s.id === e.target.value);
            const firstTopicId = selectedSub?.units.find(u => u.topics.length > 0)?.topics[0]?.id || 'cd-1-1';
            window.location.href = `/study/${e.target.value}/${firstTopicId}`;
          }}
        >
          {allSubjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
          ))}
        </select>
      </div>

      {/* Units List */}
      <div className="flex-1 pb-16">
        {subject.units.map((unit: Unit) => {
          const isOpen = openUnits[unit.no];
          const topicsComplete = unit.topics.filter(t => t.isCompleted).length;
          const progressPct = unit.topics.length ? (topicsComplete / unit.topics.length) * 100 : 0;
          
          return (
            <div key={unit.no} className="border-b border-[var(--border)] last:border-0">
              <button 
                onClick={() => toggleUnit(unit.no)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-[var(--glass)] transition-colors text-left group"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--accent-bg)] text-[var(--accent)]">
                      {unit.no}
                    </span>
                    <span className={`text-[13px] font-semibold leading-tight transition-colors ${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {unit.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] ml-7">
                    {unit.hours}h · {topicsComplete}/{unit.topics.length} done
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              
              <div className="px-4 mb-2">
                <div className="h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: subject.color }}></div>
                </div>
              </div>

              {isOpen && (
                <div className="overflow-hidden bg-[rgba(0,0,0,0.1)] py-2">
                  {unit.topics.length === 0 && (
                    <div className="px-7 py-2 text-[12px] text-[var(--text-muted)] italic">No topics added yet.</div>
                  )}
                  {unit.topics.map(topic => {
                    const isActive = topic.id === currentTopicId;
                    return (
                      <Link 
                        href={`/study/${subject.id}/${topic.id}`} 
                        key={topic.id}
                        className={`flex items-start gap-2.5 py-2.5 pr-4 pl-7 cursor-pointer transition-all duration-150 border-l-[2px] ml-4 text-[12px] leading-snug
                          ${isActive 
                            ? 'text-[var(--text-primary)] bg-[rgba(108,99,255,0.08)] border-l-[var(--accent)]' 
                            : 'text-[var(--text-muted)] border-l-transparent hover:text-[var(--text-primary)] hover:bg-[var(--glass)]'}
                        `}
                      >
                        <div className={`w-[14px] h-[14px] rounded-full flex-shrink-0 flex items-center justify-center border-[1.5px] mt-0.5 transition-colors
                          ${topic.isCompleted ? 'bg-[#10b981] border-[#10b981] text-[var(--bg-base)]' : 'border-[var(--text-disabled)]'}`}
                        >
                          {topic.isCompleted && <Check strokeWidth={4} className="w-[8px] h-[8px]" />}
                        </div>
                        <span>{topic.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Bottom Progress Fixed View */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)] mt-auto">
        <div className="text-[12px] text-[var(--text-muted)] mb-2">3 of 20 topics completed</div>
        <div className="h-[6px] bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `15%`, backgroundColor: subject.color }}></div>
        </div>
      </div>
    </div>
  );
}
