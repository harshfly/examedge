'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, HelpCircle, Layers, Sparkles } from 'lucide-react';

const stats = [
  {
    label: "SVIIT Core Subjects",
    value: "7",
    desc: "Tailored for the current curriculum",
    icon: BookOpen,
    color: "#6c63ff",
    shadow: "rgba(108,99,255,0.2)"
  },
  {
    label: "High-Yield Units",
    value: "35",
    desc: "Exam-focused structured topics",
    icon: Layers,
    color: "#10b981",
    shadow: "rgba(16,185,129,0.2)"
  },
  {
    label: "Neural Questions",
    value: "200+",
    desc: "Active recall for deep mastery",
    icon: HelpCircle,
    color: "#38bdf8",
    shadow: "rgba(56,189,248,0.2)"
  },
  {
    label: "Active Flashcards",
    value: "150+",
    desc: "Spaced repetition for memory",
    icon: Brain,
    color: "#f97316",
    shadow: "rgba(249,115,22,0.2)"
  }
];

export default function LandingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[960px] mb-16 relative">
      {/* Decorative glow background */}
      <div className="absolute -inset-4 bg-[var(--accent)] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
      
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: i * 0.12 
          }}
          whileHover={{ 
            y: -8,
            boxShadow: `0 20px 40px ${stat.shadow}`,
            borderColor: "rgba(255,255,255,0.25)"
          }}
          className="relative group bg-[rgba(15,15,20,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-[24px] p-5 md:p-6 overflow-hidden transition-all flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
          
          {/* Icon with colored glow */}
          <div 
            className="w-12 h-12 rounded-[18px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner"
            style={{ 
              backgroundColor: `${stat.color}15`, 
              color: stat.color,
              boxShadow: `inset 0 0 10px ${stat.color}20` 
            }}
          >
            <stat.icon size={22} strokeWidth={2.5} />
          </div>

          <div className="relative z-10 w-full">
            <div className="flex items-end gap-1.5 mb-1.5 justify-center md:justify-start">
              <span className="font-['Syne'] font-extrabold text-[28px] md:text-[36px] text-white leading-none tracking-tighter">
                {stat.value}
              </span>
              <Sparkles className="w-3 h-3 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity mb-2" />
            </div>
            
            <div className="text-[11px] md:text-[12px] font-bold text-white mb-2 uppercase tracking-[0.1em] opacity-90">
              {stat.label}
            </div>
            
            <p className="text-[10px] md:text-[12px] text-[var(--text-muted)] leading-snug font-medium">
              {stat.desc}
            </p>
          </div>

          {/* Hover highlight border */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent group-hover:w-full transition-all duration-500" />
        </motion.div>
      ))}
    </div>
  );
}
