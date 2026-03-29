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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[850px] mb-12 relative px-4">
      {/* Decorative glow background */}
      <div className="absolute -inset-4 bg-[var(--accent)] opacity-[0.02] blur-[100px] pointer-events-none rounded-full" />
      
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: i * 0.1
          }}
          whileHover={{ 
            y: -5,
            boxShadow: `0 15px 30px ${stat.shadow}`,
            borderColor: "rgba(255,255,255,0.15)"
          }}
          className="relative group bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.06] rounded-[20px] p-4 overflow-hidden transition-all flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
          
          <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 w-full">
            {/* Icon with colored glow */}
            <div 
              className="w-9 h-9 md:w-10 md:h-10 rounded-[14px] flex items-center justify-center md:mb-4 transition-transform group-hover:scale-110 shadow-inner shrink-0"
              style={{ 
                backgroundColor: `${stat.color}12`, 
                color: stat.color,
                boxShadow: `inset 0 0 8px ${stat.color}15` 
              }}
            >
              <stat.icon size={18} strokeWidth={2.5} />
            </div>

            <div className="relative z-10 flex-1 text-left md:text-left">
              <div className="flex items-end gap-1 mb-0.5 justify-start">
                <span className="font-['Syne'] font-extrabold text-[20px] md:text-[24px] text-white leading-none tracking-tight">
                  {stat.value}
                </span>
                <Sparkles className="w-2.5 h-2.5 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity mb-1" />
              </div>
              
              <div className="text-[9px] md:text-[10px] font-bold text-white mb-1 uppercase tracking-[0.1em] opacity-80 line-clamp-1 whitespace-nowrap">
                {stat.label}
              </div>
            </div>
          </div>
          
          <p className="hidden md:block text-[11px] text-[var(--text-muted)] leading-tight font-medium opacity-70">
            {stat.desc}
          </p>

          {/* Hover highlight border */}
          <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent group-hover:w-full transition-all duration-500" />
        </motion.div>
      ))}
    </div>
  );
}
