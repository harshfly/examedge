'use client';

import { useState } from "react";
import { Calendar, BrainCircuit, Play, CheckCircle2 } from "lucide-react";
import { useSemesterContext } from "@/hooks/useSemesterContext";
import ComingSoon from "@/components/ui/ComingSoon";
import Link from 'next/link';

export default function PlannerPage() {
  const { semesterSubjects, isLive, semRoman } = useSemesterContext();
  const [examDate, setExamDate] = useState('2026-05-15');
  const [generated, setGenerated] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(semesterSubjects[0]?.id || '');

  const subject = semesterSubjects.find(s => s.id === selectedSubject) || semesterSubjects[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {!isLive ? (
        <ComingSoon />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="max-w-[1000px] mx-auto">
            
            <div className="text-center mb-10">
               <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[rgba(108,99,255,0.1)] text-[#6c63ff] mb-4">
                  <BrainCircuit className="w-8 h-8" />
               </div>
              <h1 className="h1 mb-2">AI Revision Planner</h1>
              <p className="body-lg text-[var(--text-secondary)] max-w-[600px] mx-auto">
                Drop in your exam schedule for Semester {semRoman}. Our engine generates a personalized day-by-day active recall progression.
              </p>
            </div>

            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 max-w-[700px] mx-auto mb-12 shadow-[var(--shadow-xl)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6c63ff] to-[#06b6d4]"></div>
              
              <h3 className="text-[15px] font-bold text-white mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#6c63ff]" /> Configure Target Matrix</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div>
                   <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">SELECT PRIMARY SUBJECT</label>
                   <select 
                     className="input-field py-3"
                     value={selectedSubject}
                     onChange={(e) => setSelectedSubject(e.target.value)}
                   >
                     {semesterSubjects.map(sub => (
                       <option key={sub.id} value={sub.id}>{sub.name} ({sub.shortName})</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">EXAM DATE</label>
                   <input type="date" className="input-field py-3" value={examDate} onChange={e=>setExamDate(e.target.value)} />
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">CURRENT CONFIDENCE</label>
                   <select className="input-field py-3">
                     <option>Low (Just starting)</option>
                     <option>Medium (Read notes once)</option>
                     <option>High (Ready to refine)</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">DAILY TIME BUDGET</label>
                   <select className="input-field py-3">
                     <option>1 Hour</option>
                     <option>2 Hours</option>
                     <option>4+ Hours (Panic Mode)</option>
                   </select>
                 </div>
              </div>

              <button onClick={() => setGenerated(true)} className="btn-primary w-full py-4 text-[16px] flex justify-center items-center gap-2">
                <Play className="w-5 h-5 fill-current" /> Generate Smart Trajectory
              </button>
            </div>

            {generated && subject && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <h3 className="h2 mb-6">Your Optimized Pathway — {subject.name}</h3>
                
                <div className="space-y-4">
                  {subject.units.map((unit, i) => {
                    const status = i === 0 ? 'completed' : i === 1 ? 'active' : 'pending';
                    const dayNum = i + 1;
                    const dateObj = new Date(examDate);
                    dateObj.setDate(dateObj.getDate() - subject.units.length + i);
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

                    return (
                      <div key={i} className={`flex flex-col sm:flex-row bg-[var(--bg-overlay)] border rounded-[var(--r-lg)] overflow-hidden transition-all
                        ${status === 'active' ? 'border-[#6c63ff] shadow-[0_0_20px_rgba(108,99,255,0.15)] sm:scale-[1.02]' 
                        : status === 'completed' ? 'border-[#10b98150] opacity-60' : 'border-[var(--border)]'}
                      `}>
                        <div className={`w-full sm:w-[120px] flex sm:flex-col justify-between sm:justify-center items-center p-4 border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.05)]
                          ${status === 'active' ? 'bg-[#6c63ff10]' : 'bg-[var(--bg-elevated)]'}
                        `}>
                          <span className={`text-[12px] font-bold ${status === 'active' ? 'text-[#6c63ff]' : 'text-[var(--text-muted)]'}`}>Day {dayNum}</span>
                          <span className={`text-[18px] font-['Syne'] font-bold ${status === 'active' ? 'text-white' : 'text-[var(--text-secondary)]'}`}>{dateStr}</span>
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-center">
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${status === 'completed' ? 'text-[#10b981]' : 'text-[var(--text-muted)]'}`} />
                              <span className={`text-[14px] ${status === 'completed' ? 'line-through text-[var(--text-muted)]' : 'text-[#e0e0f0]'}`}>
                                Unit {unit.no}: {unit.title}
                              </span>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--text-muted)]`} />
                              <span className="text-[14px] text-[#e0e0f0]">
                                Review {subject.shortName} Flashcards (Spaced)
                              </span>
                            </div>
                          </div>
                        </div>
                        {status === 'active' && (
                           <div className="px-6 py-4 flex items-center border-t sm:border-t-0 sm:border-l border-[#6c63ff30]">
                             <Link href="/study" className="btn-primary w-full sm:w-auto text-[13px] py-2 px-6 text-center">Start Day</Link>
                           </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
