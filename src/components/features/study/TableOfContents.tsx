'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Subject } from "@/types";
import { useRouter } from "next/navigation";

interface TOCProps {
  subject: Subject;
  currentTopicId: string;
}

export default function TableOfContents({ subject, currentTopicId }: TOCProps) {
  const router = useRouter();
  
  const blocks = [
    { id: 'summary', label: 'Quick Summary' },
    { id: 'definition', label: 'Definition' },
    { id: 'diagrams', label: 'Visual Diagram' },
    { id: 'keypoints', label: 'Key Points' },
    { id: 'tables', label: 'Comparison' },
    { id: 'examples', label: 'Examples' },
    { id: 'examtip', label: 'Exam Tip' },
    { id: 'notes', label: 'My Notes' },
  ];

  // Logic for unit progress
  const unit = subject.units.find(u => u.topics.some(t => t.id === currentTopicId));
  const topicsInUnit = unit?.topics || [];
  const currentIndex = topicsInUnit.findIndex(t => t.id === currentTopicId);
  const completedInUnit = topicsInUnit.filter(t => t.isCompleted).length;
  const totalInUnit = topicsInUnit.length;
  const progressPercent = totalInUnit > 0 ? (completedInUnit / totalInUnit) * 100 : 0;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateTo = (index: number) => {
    if (index >= 0 && index < totalInUnit) {
      router.push(`/study/${subject.id}/${topicsInUnit[index].id}`);
    }
  };

  return (
    <div className="w-[224px] flex-shrink-0 h-full bg-[var(--bg-elevated)] border-l border-[var(--border)] p-5 overflow-y-auto sticky top-[60px]">
      <div className="label text-[var(--text-muted)] mb-4">ON THIS PAGE</div>
      
      <div className="flex flex-col gap-1 mb-8">
        {blocks.map((block) => (
          <button 
            key={block.id}
            onClick={() => scrollTo(block.id)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--r-md)] text-[12px] text-left transition-colors cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)]"
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
          <div className="h-full rounded-full bg-[#f97316] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="text-[10px] text-[var(--text-muted)]">{completedInUnit}/{totalInUnit} topics complete</div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button 
          onClick={() => navigateTo(currentIndex - 1)}
          disabled={currentIndex <= 0}
          className="btn-icon w-8 h-8 rounded-full disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => navigateTo(currentIndex + 1)}
          disabled={currentIndex >= totalInUnit - 1}
          className="btn-icon w-8 h-8 rounded-full disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

