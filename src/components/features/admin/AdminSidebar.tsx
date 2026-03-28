'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, BookOpen, FileEdit, Network, Image as ImageIcon, HelpCircle, Layers, BarChart, Settings, Quote, FileText } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'CONTENT',
      items: [
        { href: '/admin/years', label: 'Years & Semesters', icon: <CalendarDays className="w-4 h-4" /> },
        { href: '/admin/subjects', label: 'Manage Subjects', icon: <BookOpen className="w-4 h-4" /> },
        { href: '/admin/topics', label: 'Topic Editor', icon: <FileEdit className="w-4 h-4" /> },
        { href: '/admin/syllabus', label: 'Syllabus Manager', icon: <FileText className="w-4 h-4" /> },
        { href: '/admin/diagrams', label: 'Diagram Editor', icon: <Network className="w-4 h-4" /> },
        { href: '/admin/images', label: 'Image Manager', icon: <ImageIcon className="w-4 h-4" /> },
      ]
    },
    {
      title: 'ASSESSMENT',
      items: [
        { href: '/admin/quiz', label: 'Quiz Questions', icon: <HelpCircle className="w-4 h-4" /> },
        { href: '/admin/flashcards', label: 'Neural Recall', icon: <Layers className="w-4 h-4" /> },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { href: '/admin/analytics', label: 'Analytics', icon: <BarChart className="w-4 h-4" /> },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { href: '/admin/quotes', label: 'Student Motivation', icon: <Quote className="w-4 h-4" /> },
        { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside className="w-[240px] flex-shrink-0 h-full bg-[var(--bg-elevated)] border-r border-[var(--border)] flex flex-col relative z-20">
      {/* Brand */}
      <div className="h-[60px] flex items-center px-6 border-b border-[var(--border)] gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></div>
        <span className="font-['Syne'] font-extrabold text-[16px]">ExamEdge Admin</span>
        <span className="bg-[var(--accent-bg)] text-[var(--accent)] text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] ml-1">ADMIN</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="text-[11px] font-bold tracking-[0.12em] text-[var(--text-muted)] mb-2 px-3">{group.title}</h4>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r-md)] text-[13px] transition-all duration-200
                      ${isActive 
                        ? 'bg-[var(--accent-bg)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' 
                        : 'text-[var(--text-muted)] hover:bg-[var(--glass)] hover:text-[var(--text-primary)] border-l-2 border-transparent'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
