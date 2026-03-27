'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TableOfContents() {
  const blocks = [
    { id: 'summary', label: 'Quick Summary' },
    { id: 'definition', label: 'Definition' },
    { id: 'diagrams', label: 'Visual Diagram' },
    { id: 'keypoints', label: 'Key Points' },
    { id: 'tables', label: 'Comparison' },
    { id: 'examples', label: 'Examples' },
    { id: 'examtip', label: 'Exam Tip' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-[224px] flex-shrink-0 h-full bg-[var(--bg-elevated)] border-l border-[var(--border)] p-5 overflow-y-auto sticky top-[60px]">
      <div className="label text-[var(--text-muted)] mb-4">ON THIS PAGE</div>
      
      <div className="flex flex-col gap-1 mb-8">
        {blocks.map((block, i) => (
          <button 
            key={block.id}
            onClick={() => scrollTo(block.id)}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--r-md)] text-[12px] text-left transition-colors cursor-pointer
              ${i === 0 ? 'text-[var(--accent)] bg-[var(--accent-bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)]'}
            `}
          >
            <span className="w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
            {block.label}
          </button>
        ))}
      </div>

      <hr className="border-[var(--border)] mb-4" />

      <div className="mb-4">
        <div className="text-[11px] text-[var(--text-muted)] mb-2 font-semibold">Your Progress in this unit</div>
        <div className="h-[4px] bg-[var(--border)] rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full bg-[#f97316]" style={{ width: `60%` }}></div>
        </div>
        <div className="text-[10px] text-[var(--text-muted)]">3/5 topics complete</div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button className="btn-icon w-8 h-8 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
        <button className="btn-icon w-8 h-8 rounded-full"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
