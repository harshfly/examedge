'use client';

import Link from "next/link";
import { BookOpen, HelpCircle, Layers, Calendar, ChevronRight, Bookmark } from "lucide-react";
import { useSemesterContext } from "@/hooks/useSemesterContext";
import SemesterSwitcher from "@/components/ui/SemesterSwitcher";
import ComingSoon from "@/components/ui/ComingSoon";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Quote, FileText, ExternalLink, Sparkles } from "lucide-react";

import { useDataStore } from "@/store/useDataStore";

export default function DashboardPage() {
  const { selectedYear, selectedSem, semesterSubjects, isLive, semRoman, subjectCount, totalUnits, totalCredits } = useSemesterContext();
  const user = useAppStore(state => state.user);
  const { quotes, syllabi } = useDataStore();
  
  const [quote, setQuote] = useState<{text: string, author: string} | null>(null);
  const [syllabus, setSyllabus] = useState<{pdf_url: string, name: string} | null>(null);

  useEffect(() => {
    if (isLive) {
      // 1. Get random active quote from store
      const activeQuotes = quotes.filter(q => q.active);
      if (activeQuotes.length > 0) {
        setQuote(activeQuotes[Math.floor(Math.random() * activeQuotes.length)]);
      }

      // 2. Get syllabus for selected context from store
      const currentSyllabus = syllabi.find(s => s.year === selectedYear && s.semester === selectedSem);
      if (currentSyllabus) setSyllabus(currentSyllabus);
    }
  }, [isLive, selectedYear, selectedSem, quotes, syllabi]);

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-2 md:py-10 relative z-10">
        
        {/* Breadcrumb */}
        <div className="text-[11px] md:text-[13px] text-[var(--text-muted)] mb-6 md:mb-8 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">Home</Link> 
          <span>›</span> 
          <span className="text-[var(--text-secondary)]">Semester {semRoman}</span>
        </div>

        {/* Dashboard Header - Compressed for mobile */}
        <div className="text-center mb-4 md:mb-10">
          <div className="inline-block mb-1 md:mb-2">
            <h1 className="h1 font-['Syne'] font-extrabold text-[28px] md:text-[42px] leading-tight">
              Semester <span className="text-[var(--accent)]">{semRoman}</span> Dashboard
            </h1>
          </div>
          <p className="text-[12px] md:text-[14px] text-[var(--text-secondary)]">{subjectCount} subjects · {totalUnits} units</p>

          {/* Semester Switcher - Smaller for mobile */}
          <div className="flex justify-center mt-3 md:mt-6 scale-90 md:scale-100 relative z-30">
            <SemesterSwitcher />
          </div>
        </div>

        {/* Motivation Banner - Ultra compact for mobile */}
        {isLive && quote && (
          <div className="mb-4 md:mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="relative overflow-hidden bg-[var(--bg-overlay)] border border-[rgba(108,99,255,0.2)] rounded-[var(--r-lg)] p-3 md:p-8 flex items-center gap-3 md:gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[rgba(108,99,255,0.15)] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-[var(--accent)]" />
              </div>
              <div className="text-left flex-1 relative z-10">
                <p className="text-[13px] md:text-[18px] font-['Syne'] font-bold text-white mb-0 leading-tight italic line-clamp-2 md:line-clamp-none">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <div className="text-[9px] md:text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider opacity-80 md:opacity-100">— {quote.author || 'Anonymous'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon or Live Content */}
        {!isLive ? (
          <ComingSoon />
        ) : (
          <>
            {/* Stats Strip - Grid 3 columns on mobile */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6 md:mb-9">
              {[
                { num: `${subjectCount}`, label: '📚 Subjects', color: 'var(--accent)', trend: '↑ Complete' },
                { num: '47%', label: '✅ Progress', color: '#10b981', trend: '↑ 8%' },
                { num: '200+', label: '❓ Questions', color: 'var(--color-cloud)', trend: '↑ 20' },
                { num: '72%', label: '🎯 Quiz Avg', color: '#38bdf8', trend: '↑ 2%' },
                { num: '2', label: '⚠️ Weak', color: 'var(--error)', trend: '↓ 1' },
              ].map((stat, i) => (
                <div key={i} className={`bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-2 md:p-5 transition-transform hover:-translate-y-1 hover:border-[var(--border-hover)] ${i > 2 ? 'hidden md:block' : ''}`}>
                  <div className="font-['Syne'] font-extrabold text-[18px] md:text-[32px] leading-none mb-1 text-center md:text-left" style={{ color: stat.color }}>{stat.num}</div>
                  <div className="text-[9px] md:text-[13px] font-semibold text-[var(--text-primary)] mb-0.5 text-center md:text-left truncate">{stat.label}</div>
                  <div className={`text-[8px] md:text-[11px] font-mono text-center md:text-left ${stat.trend.includes('↑') && stat.color !== 'var(--error)' ? 'text-[#10b981]' : 'text-[var(--text-muted)]'}`}>{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Subjects Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="font-['Syne'] font-bold text-[20px] text-[var(--text-primary)]">Your Subjects</h2>
                <div className="h-[20px] w-[1px] bg-[var(--border)] mx-2 hidden md:block"></div>
                <Link href="/study" className="text-[13px] text-[var(--accent)] hover:underline cursor-pointer">View All →</Link>
              </div>

              {/* Syllabus Action */}
              {syllabus && (
                <a 
                  href={syllabus.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#10b98115] border border-[#10b98130] text-[#10b981] px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#10b98125] transition-all group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Full Semester Syllabus PDF
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-10">
              {semesterSubjects.map(sub => {
                const firstTopicLink = `/study/${sub.id}/${sub.units.find(u => u.topics.length > 0)?.topics[0]?.id || 'topic-1'}`;
                return (
                  <Link 
                    key={sub.id} 
                    href={firstTopicLink}
                    className="group relative bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[16px] md:rounded-[var(--r-xl)] p-3 md:p-6 cursor-pointer overflow-hidden transition-all duration-350 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] block" 
                    style={{ borderColor: 'transparent', '--hover-border': sub.color } as any}
                  >
                    <div className="absolute inset-0 border border-[var(--border)] rounded-[16px] md:rounded-[var(--r-xl)] transition-colors duration-350 z-0 group-hover:border-[var(--hover-border)] [box-shadow:inset_0_0_0_1px_transparent] group-hover:[box-shadow:0_0_0_1px_var(--hover-border)] pointer-events-none"></div>
                    
                    <div className="absolute -top-8 -right-8 w-24 md:w-40 h-24 md:h-40 rounded-full transition-transform duration-400 group-hover:scale-150 z-0 pointer-events-none" style={{ background: `radial-gradient(circle, ${sub.colorBg}, transparent 70%)` }}></div>
  
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-start justify-between mb-3 md:mb-4">
                      <div className="flex md:flex-row items-center gap-2 md:gap-3.5 w-full md:w-auto">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-[10px] md:rounded-[14px] flex items-center justify-center text-[18px] md:text-[24px]" style={{ backgroundColor: sub.colorBg, color: sub.color }}>{sub.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-['Syne'] font-bold text-[13px] md:text-[16px] tracking-tight leading-tight w-full truncate text-[var(--text-primary)]">{sub.name}</h3>
                          <div className="font-mono text-[9px] md:text-[11px] text-[var(--text-muted)] mt-0.5 md:mt-1">{sub.code}</div>
                        </div>
                      </div>
                      <button className="hidden md:block text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" onClick={(e) => { e.preventDefault(); }}>
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
  
                    <div className="relative z-10 mb-3 md:mb-5">
                      <div className="flex justify-between text-[10px] md:text-[12px] mb-1.5 md:mb-2">
                        <span className="text-[var(--text-muted)]">Progress</span>
                        <span className="font-bold shrink-0" style={{ color: sub.color }}>0%</span>
                      </div>
                      <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `0%`, backgroundColor: sub.color, boxShadow: `0 0 8px ${sub.color}` }}></div>
                      </div>
                    </div>
  
                    <div className="relative z-10 pt-2 md:pt-3.5 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-[9px] md:text-[12px] text-[var(--text-muted)] truncate mr-2">{sub.units.length} units</span>
                      <span className="text-[11px] md:text-[13px] font-bold flex items-center gap-0.5 md:gap-1 group-hover:underline shrink-0" style={{ color: sub.color }}>
                        Study <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
              {[
                { icon: <HelpCircle className="w-4 h-4 md:w-6 md:h-6 text-[var(--accent)]" />, title: 'Take a Quiz', desc: 'Test your knowledge with 200+ questions', color: 'var(--accent)', href: '/quiz' },
                { icon: <Layers className="w-4 h-4 md:w-6 md:h-6 text-[var(--color-iot)]" />, title: 'Flashcards', desc: 'Active recall spaced repetition', color: 'var(--color-iot)', href: '/flashcards' },
                { icon: <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-[var(--color-ds)]" />, title: 'View Progress', desc: 'Detailed analytics and weak spotting', color: 'var(--color-ds)', href: '/progress' },
                { icon: <Calendar className="w-4 h-4 md:w-6 md:h-6 text-[var(--color-cd)]" />, title: 'Revision Plan', desc: 'Smart AI scheduling for exams', color: 'var(--color-cd)', href: '/planner' },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="group flex flex-col justify-between h-full bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[16px] md:rounded-[var(--r-xl)] p-3 md:p-5 cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-1 block">
                  <div>
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-[10px] md:rounded-[14px] flex items-center justify-center mb-3 md:mb-4" style={{ backgroundColor: `var(--bg-${action.color.split('-')[2]?.replace(')','')})` }}>
                      {action.icon}
                    </div>
                    <h3 className="font-['Syne'] font-bold text-[13px] md:text-[16px] text-[var(--text-primary)] mb-0.5 md:mb-1.5 leading-tight">{action.title}</h3>
                    <p className="text-[10px] md:text-[13px] text-[var(--text-secondary)] leading-tight line-clamp-2 md:line-clamp-none">{action.desc}</p>
                  </div>
                  <div className="mt-3 md:mt-4 flex justify-end md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
                    <span className="font-bold flex items-center gap-1" style={{ color: action.color }}><ChevronRight className="w-3 md:w-4 h-3 md:h-4" /></span>
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
