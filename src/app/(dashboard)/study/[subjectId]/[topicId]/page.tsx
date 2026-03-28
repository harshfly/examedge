'use client';

import React, { useState } from "react";
import Sidebar from "@/components/features/study/Sidebar";
import TopicRenderer from "@/components/features/study/TopicRenderer";
import TableOfContents from "@/components/features/study/TableOfContents";
import { useDataStore } from "@/store/useDataStore";
import { Menu, ListTree, X } from "lucide-react";

export default function StudyPage({ params }: { params: Promise<{ subjectId: string, topicId: string }> }) {
  const { subjects, topics } = useDataStore();
  const { subjectId, topicId } = React.use(params);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const topic = topics[topicId] || Object.values(topics)[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-base)]">
      
      {/* Mobile Top Controls */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-elevated)] z-20">
        <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 text-[12px] font-bold text-[var(--text-secondary)]">
          <Menu className="w-4 h-4" /> Topics
        </button>
        <button onClick={() => setTocOpen(true)} className="flex items-center gap-2 text-[12px] font-bold text-[var(--text-secondary)]">
          Outline <ListTree className="w-4 h-4" />
        </button>
      </div>

      <main className="flex-1 overflow-hidden flex relative">
        
        {/* SIDEBAR - Responsive Drawer */}
        <div className={`
          fixed inset-0 z-[100] lg:relative lg:z-0 lg:block
          ${sidebarOpen ? 'block' : 'hidden'}
        `}>
          {/* Mobile Overlay */}
          <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
          
          <div className="relative w-[280px] h-full lg:w-[268px] animate-in slide-in-from-left duration-300">
            {/* Mobile Close Button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 -right-12 w-10 h-10 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar subject={subject} allSubjects={subjects} currentTopicId={topic.id} />
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 h-full overflow-hidden relative">
          <TopicRenderer subject={subject} topic={topic} />
        </div>

        {/* TABLE OF CONTENTS - Responsive Drawer */}
        <div className={`
          fixed inset-0 z-[100] lg:relative lg:z-0 lg:block
          ${tocOpen ? 'block' : 'hidden'}
        `}>
          {/* Mobile Overlay */}
          <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setTocOpen(false)}></div>
          
          <div className="absolute right-0 top-0 bottom-0 w-[240px] h-full lg:relative lg:w-[224px] lg:block animate-in slide-in-from-right duration-300">
             {/* Mobile Close Button */}
             <button 
              onClick={() => setTocOpen(false)}
              className="lg:hidden absolute top-4 -left-12 w-10 h-10 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <TableOfContents subject={subject} currentTopicId={topic.id} />
          </div>
        </div>

      </main>
    </div>
  );
}
