'use client';

import Link from "next/link";
import { User, Menu, X, ChevronRight, LayoutDashboard, BookOpen, Brain, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSemesterContext } from "@/hooks/useSemesterContext";
import { useHydrateProgress } from "@/hooks/useHydrateProgress";
import { useAppStore } from "@/store/useAppStore";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { semRoman, isLive } = useSemesterContext();
  const user = useAppStore(state => state.user);
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  useHydrateProgress();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/study', label: 'Study' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/flashcards', label: 'Neural Recall' },
    { href: '/progress', label: 'Progress' },
    { href: '/planner', label: 'Planner' },
  ];

  return (
    <>
      <nav className="h-[60px] sticky top-0 z-[100] bg-[rgba(9,9,11,0.85)] backdrop-blur-[24px] saturate-[180%] border-b border-[var(--border)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Logo - Desktop (Home) */}
            <Link href="/" className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
              <span className="font-['Syne'] font-extrabold text-[18px] tracking-[-0.03em] text-[var(--text-primary)]">ExamEdge</span>
            </Link>

            {/* Logo - Mobile (Dashboard) */}
            <Link href="/dashboard" className="flex md:hidden items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
              <span className="font-['Syne'] font-extrabold text-[16px] tracking-[-0.03em] text-[var(--text-primary)]">ExamEdge</span>
            </Link>
            <span className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${isLive ? 'bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)]' : 'bg-[var(--glass)] border-[var(--border)] text-[var(--text-muted)]'}`}>
              Sem {semRoman}
            </span>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`text-[13px] font-medium px-3 py-1.5 rounded-[var(--r-md)] transition-all duration-200 
                      ${isActive 
                        ? 'bg-[var(--glass)] text-[var(--text-primary)] border border-[var(--border)]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Exam Countdown - Navbar Version */}
            {isLive && (
              <div className="bg-[#fbbf2415] border border-[#fbbf2430] text-[#fbbf24] rounded-full px-2 md:px-3 py-1 text-[10px] md:text-[12px] font-bold flex items-center gap-1 whitespace-nowrap">
                <span className="opacity-70">⏳</span> 18d
              </div>
            )}

            <div className="bg-[rgba(249,115,22,0.15)] border border-[rgba(249,115,22,0.3)] text-[#f97316] rounded-full px-2 md:px-3 py-1 text-[10px] md:text-[12px] font-bold flex items-center gap-1">
              {user?.streak || 1} 🔥
            </div>
            
            <Link href={mounted && user ? "/profile" : "/login"} className="btn-ghost hidden sm:flex items-center gap-1.5 text-[var(--accent)] !text-[12px]">
              <User className="w-3.5 h-3.5" />
              {mounted && user ? "Profile" : "Login"}
            </Link>
            

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[rgba(9,9,11,0.8)] backdrop-blur-[20px] border-t border-[var(--border)] px-2 pb-safe-area shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-around h-[64px]">
          {[
            { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
            { href: '/study', label: 'Study', icon: BookOpen },
            { href: '/quiz', label: 'Quiz', icon: HelpCircle },
            { href: '/flashcards', label: 'Recall', icon: Brain },
            { href: '/profile', label: 'Me', icon: User },
          ].map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link 
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all
                  ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-white'}`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[var(--accent-bg)]' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-in zoom-in-75' : ''}`} />
                </div>
                <span className="text-[10px] font-bold tracking-tight uppercase">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
