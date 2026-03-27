'use client';

import Navbar from "@/components/layout/Navbar";
import { useState } from "react";
import { Calendar, BrainCircuit, Play, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

export default function PlannerPage() {
  const [examDate, setExamDate] = useState('2026-05-15');
  const [generated, setGenerated] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-base)] overflow-hidden">
      <Navbar />
      
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-[1000px] mx-auto">
          
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[rgba(108,99,255,0.1)] text-[#6c63ff] mb-4">
                <BrainCircuit className="w-8 h-8" />
             </div>
            <h1 className="h1 mb-2">AI Revision Planner</h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-[600px] mx-auto">
              Drop in your exam schedule. Our SuperMemo-2 engine generates a personalized day-by-day active recall progression preventing forgetting curves.
            </p>
          </div>

          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 max-w-[700px] mx-auto mb-12 shadow-[var(--shadow-xl)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6c63ff] to-[#06b6d4]"></div>
            
            <h3 className="text-[15px] font-bold text-white mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#6c63ff]" /> Configure Target Matrix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div>
                 <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">SELECT PRIMARY SUBJECT</label>
                 <select className="input-field py-3">
                   <option>Compiler Design (CD)</option>
                   <option>Cloud Computing</option>
                   <option>Object Oriented A&D</option>
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

          {generated && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h3 className="h2 mb-6">Your Optimized Pathway</h3>
              
              <div className="space-y-4">
                {[
                  { day: 'Day 1', date: 'May 01', tasks: ['Unit I: Lexical Analysis Core Theory', 'Solve 15 Easy Flashcards'], status: 'completed' },
                  { day: 'Day 2', date: 'May 02', tasks: ['Unit II: Syntax Analysis (Top-Down)', 'Take 20Q CD Assessment'], status: 'active' },
                  { day: 'Day 3', date: 'May 03', tasks: ['Unit II: Syntax Analysis (Bottom-Up)', 'Review 30 Medium Flashcards (Spaced)'], status: 'pending' },
                  { day: 'Day 4', date: 'May 04', tasks: ['Unit III: Semantic Analysis', 'Mock Exam: Parse Trees'], status: 'pending' },
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col sm:flex-row bg-[var(--bg-overlay)] border rounded-[var(--r-lg)] overflow-hidden transition-all
                    ${item.status === 'active' ? 'border-[#6c63ff] shadow-[0_0_20px_rgba(108,99,255,0.15)] sm:scale-[1.02]' 
                    : item.status === 'completed' ? 'border-[#10b98150] opacity-60' : 'border-[var(--border)]'}
                  `}>
                    <div className={`w-full sm:w-[120px] flex sm:flex-col justify-between sm:justify-center items-center p-4 border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.05)]
                      ${item.status === 'active' ? 'bg-[#6c63ff10]' : 'bg-[var(--bg-elevated)]'}
                    `}>
                      <span className={`text-[12px] font-bold ${item.status === 'active' ? 'text-[#6c63ff]' : 'text-[var(--text-muted)]'}`}>{item.day}</span>
                      <span className={`text-[18px] font-['Syne'] font-bold ${item.status === 'active' ? 'text-white' : 'text-[var(--text-secondary)]'}`}>{item.date}</span>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      <div className="space-y-2">
                        {item.tasks.map((t, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.status === 'completed' ? 'text-[#10b981]' : 'text-[var(--text-muted)]'}`} />
                            <span className={`text-[14px] ${item.status === 'completed' ? 'line-through text-[var(--text-muted)]' : 'text-[#e0e0f0]'}`}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {item.status === 'active' && (
                       <div className="px-6 py-4 flex items-center border-t sm:border-t-0 sm:border-l border-[#6c63ff30]">
                         <Link href="/study" className="btn-primary w-full sm:w-auto text-[13px] py-2 px-6 text-center">Start Day</Link>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
