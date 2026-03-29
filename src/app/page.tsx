'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from '@/components/layout/AnimatedBackground';
import LandingNavbar from '@/components/layout/LandingNavbar';
import CreatorFooter from '@/components/layout/CreatorFooter';
import { useDataStore } from '@/store/useDataStore';
import LandingStats from '@/components/layout/LandingStats';

export default function LandingPage() {
  const router = useRouter();
  const { curriculum, heroAnnouncement } = useDataStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);

  const years = curriculum.map(y => {
    // Fail-safe: check for 'live', legacy 'Available', or any live semester
    const isYearLive = (y.status as any) === 'live' || (y.status as any) === 'Available' || y.semesters.some(s => s.status === 'live');
    return {
      id: y.year,
      label: y.label,
      sems: y.year === 1 ? 'Sem I & II' : y.year === 2 ? 'Sem III & IV' : y.year === 3 ? 'Sem V & VI' : 'Sem VII & VIII',
      status: isYearLive ? 'Available' : 'Coming Soon',
      color: y.color,
      isLive: isYearLive
    };
  });

  const semsByYear = curriculum.reduce((acc, y) => {
    acc[y.year] = y.semesters.map(s => ({
      id: s.sem,
      label: s.label || `Semester ${s.sem}`,
      status: s.status === 'live' ? 'Live ✓' : s.status === 'coming-soon' ? 'Soon' : 'Locked',
      isLive: s.status === 'live'
    }));
    return acc;
  }, {} as Record<number, any[]>);

  const currentSems = selectedYear ? semsByYear[selectedYear] : [];

  return (
    <>
      <LandingNavbar />
      <div className="w-full min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="max-w-[960px] mx-auto px-5 py-6 md:py-16 relative z-10 flex flex-col items-center flex-1 w-full pb-32">
        {/* Eyebrow Pill */}
        <div className="mb-4 md:mb-8 px-4 py-1 rounded-full border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.1)] animate-pulse-slow">
          <span className="text-[10px] md:text-[12px] font-bold text-[#a78bfa] tracking-[0.05em] uppercase">{heroAnnouncement}</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="font-['Syne'] font-extrabold text-[32px] md:text-[64px] leading-tight text-center mb-0">Your Smart Exam</h1>
        <h1 className="font-['Syne'] font-extrabold text-[44px] md:text-[84px] text-gradient text-center mb-3 md:mb-6 leading-[0.9] pb-1">Companion</h1>
        <p className="text-[13px] md:text-[18px] text-center text-[var(--text-secondary)] max-w-[480px] mb-5 md:mb-12 px-2">
          Select your year and semester to access personalized study materials, quizzes, flashcards, and progress tracking.
        </p>

        {/* Premium Stats Ecosystem */}
        <LandingStats />

        {/* SECTION 01: YEAR */}
        <div className="w-full mb-8 md:mb-16 mt-2 md:mt-8">
          <div className="label text-[var(--text-muted)] mb-6 md:mb-10 flex justify-center items-center text-center w-full px-[5%] before:content-[''] before:flex-1 before:h-[1px] before:bg-white/[0.08] before:mr-6 after:content-[''] after:flex-1 after:h-[1px] after:bg-white/[0.08] after:ml-6 text-[11px] uppercase tracking-widest font-bold">
            01 — SELECT YOUR YEAR
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-[14px]">
            {years.map((y, i) => (
              <motion.div 
                key={y.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={y.isLive ? { y: -5, scale: 1.02 } : {}}
                onClick={() => {
                  if (y.isLive) {
                    setSelectedYear(y.id);
                  } else {
                    alert('Content for Year ' + y.id + ' is coming soon! 🚀');
                  }
                }}
                className={`flex flex-col items-center justify-center p-4 md:p-8 rounded-[20px] md:rounded-[22px] border transition-all duration-350 cursor-pointer text-center min-h-[140px] md:min-h-[180px] relative overflow-hidden
                  ${selectedYear === y.id 
                    ? `border-[${y.color}] bg-[${y.color}]/10 shadow-[0_12px_32px_rgba(0,0,0,0.4)]` 
                    : y.isLive ? 'bg-white/[0.03] backdrop-blur-md border-white/[0.08] hover:border-white/[0.2]' : 'bg-white/[0.01] border-white/[0.04] opacity-40'}
                `}
                style={{ borderColor: selectedYear === y.id ? y.color : undefined }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <span className="font-['Syne'] text-[28px] md:text-[40px] font-extrabold leading-none mb-1 md:mb-2" style={{ color: y.color }}>0{y.id}</span>
                <span className="text-[12px] md:text-[14px] font-bold text-white mb-1.5 md:mb-3">{y.label}</span>
                <span className="bg-white/[0.05] rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[11px] mb-1.5 md:mb-3 text-[var(--text-secondary)]">{y.sems}</span>
                <span className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full ${y.isLive ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>{y.status}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 02: SEMESTER */}
        <div className="w-full mb-10">
          <div className="label text-[var(--text-muted)] mb-8 flex justify-center items-center text-center w-full px-[5%] before:content-[''] before:flex-1 before:h-[1px] before:bg-white/[0.08] before:mr-6 after:content-[''] after:flex-1 after:h-[1px] after:bg-white/[0.08] after:ml-6">
            02 — SELECT YOUR SEMESTER
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-[640px] mx-auto">
            {!selectedYear && (
              <div className="w-full text-center text-[13px] text-[var(--text-muted)] py-4 backdrop-blur-sm bg-white/[0.02] rounded-xl border border-white/[0.05]">
                Please select a year first.
              </div>
            )}
            
            {currentSems.map((s, i) => {
              const isSelected = selectedSem === s.id;
              
              return (
                <motion.div 
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={s.isLive ? { y: -4, scale: 1.04 } : {}}
                  onClick={() => {
                    if (s.isLive) setSelectedSem(s.id);
                    else alert('Content for ' + s.label + ' is coming soon!');
                  }}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-[20px] text-center transition-all duration-250 relative overflow-hidden w-[140px] sm:w-[150px]
                    ${s.isLive ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                    ${isSelected ? 'bg-[rgba(108,99,255,0.12)] border-2 border-[#6c63ff] shadow-[0_8px_32px_rgba(108,99,255,0.25)]' : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.2]'}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <span className={`font-['Syne'] font-bold text-[32px] md:text-[36px] mb-2 ${s.isLive ? 'text-[#6c63ff]' : 'text-white/60'}`}>{['I','II','III','IV','V','VI','VII','VIII'][s.id-1]}</span>
                  <span className="text-[12px] font-semibold text-white">{s.label}</span>
                  <span className={`text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full ${s.isLive ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>{s.status}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* PROCEED BUTTON */}
        <button 
          disabled={!selectedYear || !selectedSem}
          onClick={() => {
            if (selectedYear && selectedSem) {
              const { setSelectedSemester } = useDataStore.getState();
              setSelectedSemester(selectedYear, selectedSem);
              router.push('/dashboard');
            }
          }}
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
