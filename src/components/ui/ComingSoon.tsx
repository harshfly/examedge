'use client';

import { Rocket, Bell } from 'lucide-react';
import { useSemesterContext } from '@/hooks/useSemesterContext';
import Link from 'next/link';

export default function ComingSoon() {
  const { selectedYear, semRoman, currentYearData, setSelectedSemester } = useSemesterContext();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-[480px]">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6c63ff20] to-[#f9731620] animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
            <Rocket className="w-10 h-10 text-[#6c63ff]" />
          </div>
        </div>

        <h1 className="font-['Syne'] font-extrabold text-[28px] md:text-[36px] text-[var(--text-primary)] mb-3">
          Semester {semRoman} is <span className="text-[#6c63ff]">Coming Soon</span>
        </h1>
        
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-8 max-w-[380px] mx-auto">
          We&apos;re building high-quality, exam-ready content for Year {selectedYear} Semester {semRoman}. 
          Stay tuned for curated notes, quizzes, and flashcards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => setSelectedSemester(3, 6)}
            className="btn-primary flex items-center gap-2 text-[13px]"
          >
            Go to Semester VI (Live)
          </button>
          <button className="btn-secondary flex items-center gap-2 text-[13px]">
            <Bell className="w-4 h-4" /> Notify Me
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-12 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6">
          <h3 className="text-[12px] font-bold text-[var(--text-muted)] tracking-[0.15em] uppercase mb-4">Content Roadmap</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
              <span className="text-[13px] text-[var(--text-primary)]">Semester VI — <strong className="text-[#10b981]">Live Now</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#fbbf24]"></div>
              <span className="text-[13px] text-[var(--text-secondary)]">Semester V — In Development</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--text-disabled)]"></div>
              <span className="text-[13px] text-[var(--text-muted)]">All Other Semesters — Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
