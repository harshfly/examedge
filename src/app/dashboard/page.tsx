'use client';

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { BookOpen, HelpCircle, Layers, Calendar, ChevronRight, Bookmark } from "lucide-react";
import { useSemesterContext } from "@/hooks/useSemesterContext";
import SemesterSwitcher from "@/components/ui/SemesterSwitcher";
import ComingSoon from "@/components/ui/ComingSoon";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardPage() {
  const { semesterSubjects, isLive, semRoman, subjectCount, totalUnits, totalCredits } = useSemesterContext();
  const user = useAppStore(state => state.user);

  return (
    <>
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        
        {/* Breadcrumb */}
        <div className="text-[11px] md:text-[13px] text-[var(--text-muted)] mb-6 md:mb-8 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">Home</Link> 
          <span>›</span> 
          <span className="text-[var(--text-secondary)]">Semester {semRoman}</span>
        </div>

        {/* Dashboard Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-2">
            <h1 className="h1 font-['Syne'] font-extrabold text-[34px] md:text-[42px] leading-tight">
              Semester <span className="text-[var(--accent)]">{semRoman}</span> Dashboard
            </h1>
          </div>
          <p className="text-[14px] text-[var(--text-secondary)]">{subjectCount} subjects · {totalUnits} units · {totalCredits} credits</p>

          {/* Semester Switcher */}
          <div className="flex justify-center mt-6">
            <SemesterSwitcher />
          </div>
          
          {/* Centered Countdown & Streak */}
          {isLive && (
            <div className="flex justify-center mt-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full max-w-[600px] md:max-w-none">
                <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] px-6 py-4 md:px-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.1)] group hover:border-[#fbbf2450] transition-all flex-1 w-full">
                  <span className="text-[10px] md:text-[11px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold mb-2 block">Next Exam Countdown</span>
                  <div className="text-[28px] md:text-[32px] font-['Syne'] font-black text-[#fbbf24] flex items-baseline justify-center gap-1">
                    18 <span className="text-[13px] md:text-[14px] font-bold text-[var(--text-muted)] uppercase tracking-normal">Days</span>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-center">
                  <div className="w-[1px] h-12 bg-[var(--border)]"></div>
                </div>

                <div className="bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] rounded-[var(--r-xl)] px-6 py-4 md:px-8 text-center group hover:border-[var(--accent)] transition-all flex-1 w-full">
                  <span className="text-[10px] md:text-[11px] text-[var(--text-secondary)] uppercase tracking-[0.2em] font-bold mb-2 block">Daily Streak</span>
                  <div className="text-[28px] md:text-[32px] font-['Syne'] font-black text-[var(--accent)] flex items-baseline justify-center gap-1">
                    {user?.streak || 1} <span className="text-[13px] md:text-[14px] font-bold text-[var(--text-muted)] uppercase tracking-normal">Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon or Live Content */}
        {!isLive ? (
          <ComingSoon />
        ) : (
          <>
            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-9">
              {[
                { num: `${subjectCount}`, label: '📚 Subjects', color: 'var(--accent)', trend: '↑ Complete list' },
                { num: '47%', label: '✅ Progress', color: '#10b981', trend: '↑ 8% this week' },
                { num: '200+', label: '❓ Questions', color: 'var(--color-cloud)', trend: '↑ 20 added' },
                { num: '72%', label: '🎯 Quiz Avg', color: '#38bdf8', trend: '↑ 2% this week' },
                { num: '2', label: '⚠️ Weak Topics', color: 'var(--error)', trend: '↓ 1 fixed' },
              ].map((stat, i) => (
                <div key={i} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-4 md:p-5 transition-transform hover:-translate-y-1 hover:border-[var(--border-hover)]">
                  <div className="font-['Syne'] font-extrabold text-[28px] md:text-[32px] leading-none mb-2" style={{ color: stat.color }}>{stat.num}</div>
                  <div className="text-[12px] md:text-[13px] font-semibold text-[var(--text-primary)] mb-1">{stat.label}</div>
                  <div className={`text-[10px] md:text-[11px] font-mono ${stat.trend.includes('↑') && stat.color !== 'var(--error)' ? 'text-[#10b981]' : 'text-[var(--text-muted)]'}`}>{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Subjects Section */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-['Syne'] font-bold text-[20px] text-[var(--text-primary)]">Your Subjects</h2>
              <Link href="/study" className="text-[13px] text-[var(--accent)] hover:underline cursor-pointer">View All →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
              {semesterSubjects.map(sub => {
                const firstTopicLink = `/study/${sub.id}/${sub.units.find(u => u.topics.length > 0)?.topics[0]?.id || 'topic-1'}`;
                return (
                  <Link 
                    key={sub.id} 
                    href={firstTopicLink}
                    className="group relative bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 cursor-pointer overflow-hidden transition-all duration-350 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] block" 
                    style={{ borderColor: 'transparent', '--hover-border': sub.color } as any}
                  >
                    <div className="absolute inset-0 border border-[var(--border)] rounded-[var(--r-xl)] transition-colors duration-350 z-0 group-hover:border-[var(--hover-border)] [box-shadow:inset_0_0_0_1px_transparent] group-hover:[box-shadow:0_0_0_1px_var(--hover-border)] pointer-events-none"></div>
                    
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full transition-transform duration-400 group-hover:scale-150 z-0 pointer-events-none" style={{ background: `radial-gradient(circle, ${sub.colorBg}, transparent 70%)` }}></div>
  
                    <div className="relative z-10 flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[24px]" style={{ backgroundColor: sub.colorBg, color: sub.color }}>{sub.icon}</div>
                        <div>
                          <h3 className="font-['Syne'] font-bold text-[16px] tracking-tight leading-tight w-[140px] truncate text-[var(--text-primary)]">{sub.name}</h3>
                          <div className="font-mono text-[11px] text-[var(--text-muted)] mt-1">{sub.code}</div>
                        </div>
                      </div>
                      <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" onClick={(e) => { e.preventDefault(); /* Bookmark logic here */ }}>
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
  
                    <div className="relative z-10 mb-5">
                      <div className="flex justify-between text-[12px] mb-2">
                        <span className="text-[var(--text-muted)]">Progress</span>
                        <span className="font-bold" style={{ color: sub.color }}>0%</span>
                      </div>
                      <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `0%`, backgroundColor: sub.color, boxShadow: `0 0 8px ${sub.color}` }}></div>
                      </div>
                    </div>
  
                    <div className="relative z-10 pt-3.5 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-muted)]">{sub.units.length} units · Progress: 0%</span>
                      <span className="text-[13px] font-bold flex items-center gap-1 group-hover:underline" style={{ color: sub.color }}>
                        Study <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
              {[
                { icon: <HelpCircle className="w-6 h-6 text-[var(--accent)]" />, title: 'Take a Quiz', desc: 'Test your knowledge with 200+ questions', color: 'var(--accent)', href: '/quiz' },
                { icon: <Layers className="w-6 h-6 text-[var(--color-iot)]" />, title: 'Browse Flashcards', desc: 'Active recall spaced repetition', color: 'var(--color-iot)', href: '/flashcards' },
                { icon: <BookOpen className="w-6 h-6 text-[var(--color-ds)]" />, title: 'View Progress', desc: 'Detailed analytics and weak spotting', color: 'var(--color-ds)', href: '/progress' },
                { icon: <Calendar className="w-6 h-6 text-[var(--color-cd)]" />, title: 'Revision Planner', desc: 'Smart AI scheduling for exams', color: 'var(--color-cd)', href: '/planner' },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="group flex flex-col justify-between h-full bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-5 cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-1 block">
                  <div>
                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4" style={{ backgroundColor: `var(--bg-${action.color.split('-')[2]?.replace(')','')})` }}>
                      {action.icon}
                    </div>
                    <h3 className="font-['Syne'] font-bold text-[16px] text-[var(--text-primary)] mb-1.5">{action.title}</h3>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{action.desc}</p>
                  </div>
                  <div className="mt-4 flex justify-end opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span className="font-bold flex items-center gap-1" style={{ color: action.color }}><ChevronRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </>
  );
}
