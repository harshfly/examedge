'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedBackground from '@/components/layout/AnimatedBackground';
import LandingNavbar from '@/components/layout/LandingNavbar';
import CreatorFooter from '@/components/layout/CreatorFooter';
import { useDataStore } from '@/store/useDataStore';
import LandingStats from '@/components/layout/LandingStats';

export default function LandingPage() {
  const router = useRouter();
  const { subjects } = useDataStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);

  const years = [
    { id: 1, label: 'First Year', sems: 'Sem I & II', status: 'Coming Soon', color: '#22c55e' },
    { id: 2, label: 'Second Year', sems: 'Sem III & IV', status: 'Coming Soon', color: '#38bdf8' },
    { id: 3, label: 'Third Year', sems: 'Sem V & VI', status: 'Available', color: '#6c63ff', isLive: true },
    { id: 4, label: 'Fourth Year', sems: 'Sem VII & VIII', status: 'Coming Soon', color: '#f97316' }
  ];

  const semsByYear: Record<number, { id: number, label: string, status: string, isLive?: boolean }[]> = {
    1: [
      { id: 1, label: 'Semester 1', status: 'Soon' },
      { id: 2, label: 'Semester 2', status: 'Soon' }
    ],
    2: [
      { id: 3, label: 'Semester 3', status: 'Soon' },
      { id: 4, label: 'Semester 4', status: 'Soon' }
    ],
    3: [
      { id: 5, label: 'Semester 5', status: 'Soon' },
      { id: 6, label: 'Semester 6', status: 'Live ✓', isLive: true }
    ],
    4: [
      { id: 7, label: 'Semester 7', status: 'Soon' },
      { id: 8, label: 'Semester 8', status: 'Soon' }
    ]
  };

  const currentSems = selectedYear ? semsByYear[selectedYear] : [];

  return (
    <>
      <LandingNavbar />
      <div className="w-full min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="max-w-[960px] mx-auto px-6 py-12 relative z-10 flex flex-col items-center flex-1 w-full pb-32">
        {/* Eyebrow Pill */}
        <div className="mb-6 px-4 py-1.5 rounded-full border border-[rgba(108,99,255,0.25)] bg-[rgba(108,99,255,0.12)] animate-pulse-slow">
          <span className="text-[12px] font-semibold text-[#a78bfa] tracking-[0.06em] uppercase">✦ SVIIT B.Tech — Sem 6 Curriculum Live</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="h1 text-center mb-0">Your Smart Exam</h1>
        <h1 className="display text-gradient text-center mb-4 pb-2">Companion</h1>
        <p className="body-lg text-center text-[var(--text-secondary)] max-w-[480px] mb-7">
          Select your year and semester to access personalized study materials, quizzes, flashcards, and progress tracking.
        </p>

        {/* Premium Stats Ecosystem */}
        <LandingStats />

        {/* SECTION 01: YEAR */}
        <div className="w-full mb-10">
          <div className="label text-[var(--text-muted)] mb-8 flex justify-center items-center text-center w-full px-[5%] before:content-[''] before:flex-1 before:h-[1px] before:bg-[var(--border)] before:mr-6 after:content-[''] after:flex-1 after:h-[1px] after:bg-[var(--border)] after:ml-6">
            01 — SELECT YOUR YEAR
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px]">
            {years.map((y) => (
              <div 
                key={y.id}
                onClick={() => {
                  if (y.isLive) {
                    setSelectedYear(y.id);
                  } else {
                    alert('Content for Year ' + y.id + ' is coming soon! 🚀');
                  }
                }}
                className={`flex flex-col items-center justify-center p-6 rounded-[18px] border transition-all duration-350 cursor-pointer text-center min-h-[180px]
                  ${selectedYear === y.id 
                    ? `border-[${y.color}] bg-[${y.color}]/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] shadow-[${y.color}] translate-y-[-4px]` 
                    : y.isLive ? 'bg-[var(--bg-overlay)] border-[var(--border)]' : 'bg-[var(--bg-overlay)] border-[var(--border)] opacity-60'}
                `}
                style={{ borderColor: selectedYear === y.id ? y.color : undefined }}
              >
                <span className="font-['Syne'] text-[40px] font-extrabold leading-none mb-2" style={{ color: y.color }}>0{y.id}</span>
                <span className="text-[14px] font-medium text-[var(--text-secondary)] mb-2">{y.label}</span>
                <span className="bg-[var(--glass)] rounded-full px-3 py-1 text-[11px] mb-2">{y.sems}</span>
                <span className={`text-[11px] font-bold ${y.isLive ? 'text-[#10b981]' : 'text-[#fbbf24]'}`}>{y.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 02: SEMESTER */}
        <div className="w-full mb-10">
          <div className="label text-[var(--text-muted)] mb-8 flex justify-center items-center text-center w-full px-[5%] before:content-[''] before:flex-1 before:h-[1px] before:bg-[var(--border)] before:mr-6 after:content-[''] after:flex-1 after:h-[1px] after:bg-[var(--border)] after:ml-6">
            02 — SELECT YOUR SEMESTER
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 max-w-[600px] mx-auto">
            {!selectedYear && <div className="col-span-4 text-center text-[13px] text-[var(--text-muted)] py-4">Please select a year first.</div>}
            
            {currentSems.map((s) => {
              const isSelected = selectedSem === s.id;
              
              return (
                <div 
                  key={s.id}
                  onClick={() => {
                    if (s.isLive) setSelectedSem(s.id);
                    else alert('Content for ' + s.label + ' is coming soon!');
                  }}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl text-center transition-all duration-250
                    ${s.isLive ? 'cursor-pointer hover:bg-[var(--glass-hover)] hover:-translate-y-1' : 'opacity-50 cursor-not-allowed bg-[var(--bg-overlay)]'}
                    ${isSelected ? 'bg-[rgba(108,99,255,0.1)] border-2 border-[#6c63ff] shadow-[0_8px_24px_rgba(108,99,255,0.25)]' : 'bg-[var(--bg-overlay)] border border-[var(--border)]'}
                  `}
                >
                  <span className={`font-['Syne'] font-bold text-[36px] mb-2 ${s.isLive ? 'text-[#6c63ff]' : 'text-[var(--text-primary)]'}`}>{['I','II','III','IV','V','VI','VII','VIII'][s.id-1]}</span>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">{s.label}</span>
                  <span className={`text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full ${s.isLive ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981]' : 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]'}`}>{s.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROCEED BUTTON */}
        <button 
          disabled={!selectedYear || !selectedSem}
          onClick={() => router.push('/dashboard')}
          className={`min-w-[280px] py-4 rounded-xl font-['Syne'] text-[15px] font-bold tracking-tight transition-all duration-300
            ${selectedYear && selectedSem 
              ? 'btn-primary shadow-[0_8px_32px_rgba(108,99,255,0.4)] hover:scale-[1.02]' 
              : 'bg-[var(--glass)] text-[var(--text-muted)] opacity-50 cursor-not-allowed'}
          `}
        >
          {selectedYear && selectedSem ? 'Continue to Dashboard  →' : 'Select Year & Semester to Continue'}
        </button>

        </div>
        <CreatorFooter />
      </div>
    </>
  );
}
