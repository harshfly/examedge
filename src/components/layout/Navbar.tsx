'use client';

import Link from "next/link";
import { Moon, Search, Settings, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/study', label: 'Study' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/flashcards', label: 'Flashcards' },
    { href: '/progress', label: 'Progress' },
    { href: '/planner', label: 'Planner' },
  ];

  return (
    <>
      <nav className="h-[60px] sticky top-0 z-[100] bg-[rgba(9,9,11,0.85)] backdrop-blur-[24px] saturate-[180%] border-b border-[var(--border)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
              <span className="font-['Syne'] font-extrabold text-[16px] md:text-[18px] tracking-[-0.03em] text-[var(--text-primary)]">ExamEdge</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-[13px] font-medium text-[var(--text-secondary)] px-3 py-1.5 rounded-[var(--r-md)] transition-all duration-200 hover:bg-[var(--glass)] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-[rgba(249,115,22,0.15)] border border-[rgba(249,115,22,0.3)] text-[#f97316] rounded-full px-2 md:px-3 py-1 text-[10px] md:text-[12px] font-bold flex items-center gap-1">
              🔥 5
            </div>
            
            <button className="btn-icon hidden sm:flex">
              <Search className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            
            <Link href="/admin" className="btn-ghost hidden sm:flex items-center gap-1.5 text-[var(--accent)] !text-[12px]">
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
            
            <button className="btn-icon">
              <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay/Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-[var(--bg-elevated)] border-r border-[var(--border)] shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                <span className="font-['Syne'] font-extrabold text-[18px] tracking-[-0.03em] text-[var(--text-primary)]">ExamEdge</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--text-muted)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-[var(--r-lg)] bg-[var(--glass)] border border-transparent hover:border-[var(--border)] group transition-all"
                  >
                    <span className="text-[15px] font-semibold text-[var(--text-primary)]">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-[var(--border)] space-y-4">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full py-3 flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" /> Admin Panel
              </Link>
              <button className="btn-ghost w-full py-3 flex items-center justify-center gap-2 text-[var(--text-muted)]">
                <Search className="w-4 h-4" /> Search Topics
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
