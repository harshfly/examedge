'use client';

import { TopicContent, Subject } from '@/types';
import { Bookmark, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TopicRendererProps {
  topic: TopicContent;
  subject: Subject;
}

export default function TopicRenderer({ topic, subject }: TopicRendererProps) {
  const [notes, setNotes] = useState('');
  const router = useRouter();

  // Navigation Logic
  const unit = subject.units.find(u => u.no === topic.unitNo);
  const topicsInUnit = unit?.topics || [];
  const currentIndex = topicsInUnit.findIndex(t => t.id === topic.id);
  const totalInUnit = topicsInUnit.length;
  const completedInUnit = topicsInUnit.filter(t => t.isCompleted).length;

  const navigateTo = (index: number) => {
    if (index >= 0 && index < totalInUnit) {
      router.push(`/study/${subject.id}/${topicsInUnit[index].id}`);
    }
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-[var(--bg-base)] scroll-smooth relative">
      <div className="max-w-[840px] px-5 md:px-10 py-6 md:py-10 w-full mx-auto pb-32">
        {/* Breadcrumb */}
        <div className="text-[10px] md:text-[12px] text-[var(--text-muted)] mb-4 md:mb-6 flex flex-wrap items-center gap-2">
          <span className="cursor-pointer hover:underline">Study</span> <span>›</span>
          <span className="cursor-pointer hover:underline truncate max-w-[100px] md:max-w-none">{subject.name}</span> <span>›</span>
          <span className="cursor-pointer hover:underline">Unit {topic.unitNo}</span> <span>›</span>
          <span className="text-[var(--text-secondary)] truncate max-w-[150px] md:max-w-none">{topic.name}</span>
        </div>

        {/* Topic Header */}
        <div className="inline-flex px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold mb-3" style={{ color: subject.color, backgroundColor: subject.colorBg }}>
          Unit {topic.unitNo} · {subject.name}
        </div>
        <h1 className="font-['Syne'] font-extrabold text-[28px] md:text-[40px] tracking-[-0.04em] leading-tight mb-3">
          {topic.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[11px] md:text-[12px] text-[var(--text-muted)] mb-8">
          <span className="flex items-center gap-1.5 py-1">📖 ~12 min read</span>
          <span className="flex items-center gap-1.5 py-1">🎯 Exam-ready</span>
          <button className="btn-icon ml-auto scale-90 md:scale-100"><Bookmark className="w-3.5 h-3.5" /></button>
          <button className="btn-icon scale-90 md:scale-100"><Copy className="w-3.5 h-3.5" /></button>
        </div>

        {/* BLOCK 1 - QUICK SUMMARY */}
        <div id="summary" className="mb-10">
          <div className="label text-[var(--accent)] mb-3">⚡ QUICK SUMMARY</div>
          <div className="rounded-r-[var(--r-lg)] p-6 border-l-[3px] border-[var(--accent)] border border-[rgba(108,99,255,0.2)]" style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.08),rgba(6,182,212,0.05))' }}>
            {topic.summary.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0"></div>
                <div className="text-[14px] leading-relaxed text-[var(--text-primary)]">{point}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 2 - DEFINITION */}
        <div id="definition" className="mb-10">
          <div className="label mb-3 text-[var(--text-muted)]">📖 DEFINITION</div>
          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-6 text-[15px] leading-relaxed text-[#c8c8e0]" 
            dangerouslySetInnerHTML={{ __html: topic.definition }} 
          />
        </div>

        {/* BLOCK 2.5 - CUSTOM SECTIONS (THEORY / REAL WORLD USE) */}
        {topic.customSections && topic.customSections.map(section => (
          <div key={section.id} id={section.id} className="mb-10">
            <div className="label mb-3 text-[var(--accent)] font-bold uppercase">{section.title}</div>
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-6 text-[15px] leading-relaxed text-[#c8c8e0] whitespace-pre-wrap" 
              dangerouslySetInnerHTML={{ __html: section.content }} 
            />
          </div>
        ))}

        {/* BLOCK 3 - DIAGRAMS */}
        {topic.diagrams && topic.diagrams.length > 0 && (
          <div id="diagrams" className="mb-10">
            <div className="label mb-3 text-[var(--text-muted)]">📐 VISUAL DIAGRAM</div>
            {topic.diagrams.map(diag => (
              <div key={diag.id} className="bg-[#06060c] border border-[rgba(108,99,255,0.15)] rounded-[var(--r-lg)] overflow-hidden mb-4 shadow-sm">
                <div className="bg-[rgba(108,99,255,0.06)] px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[var(--text-muted)] ml-2">{diag.title}</span>
                  </div>
                  <button className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-[var(--accent)] tracking-wider">⟐ Copy</button>
                </div>
                <div className="p-6 font-['JetBrains_Mono'] text-[11.5px] leading-relaxed text-[#7ef07e] whitespace-pre-wrap overflow-x-auto min-h-[200px] flex items-center justify-center">
                  <pre>{diag.content}</pre>
                </div>
                {diag.caption && <div className="text-[12px] text-[var(--text-muted)] text-center p-2.5 bg-black border-t border-[rgba(108,99,255,0.1)]">{diag.caption}</div>}
              </div>
            ))}
          </div>
        )}

        {/* BLOCK 5 - IMAGES */}
        {topic.images && topic.images.length > 0 && (
          <div id="images" className="mb-10">
            <div className="label mb-3 text-[var(--text-muted)]">🖼️ ILLUSTRATIONS</div>
            <div className="grid grid-cols-1 gap-6">
              {topic.images.map(img => (
                <figure key={img.id} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
                  <img src={img.url} alt={img.altText || img.caption} className="w-full h-auto object-cover max-h-[500px]" />
                  {img.caption && (
                    <figcaption className="p-4 text-center text-[13px] text-[var(--text-secondary)] italic border-t border-[var(--border)] bg-[var(--bg-base)]">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* BLOCK 4 - KEY POINTS */}
        <div id="keypoints" className="mb-10">
          <div className="label mb-3 text-[var(--text-muted)]">📌 KEY POINTS</div>
          <div className="flex flex-col gap-2">
            {topic.keyPoints.map((kp, idx) => (
              <div key={kp.id} className={`flex gap-3.5 p-4 rounded-r-[var(--r-md)] border border-[var(--border)] border-l-[3px] transition-colors
                ${kp.isHighlight ? 'bg-[var(--glass)]' : 'bg-[var(--bg-overlay)]'}`}
                style={{ borderLeftColor: subject.color }}
              >
                <div className="font-['JetBrains_Mono'] text-[11px] font-bold pt-0.5 min-w-[20px]" style={{ color: subject.color }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="text-[14px] leading-[1.65] text-[var(--text-primary)]">{kp.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 6 - COMPARISON TABLES */}
        {topic.tables && topic.tables.length > 0 && (
          <div id="tables" className="mb-10">
            <div className="label mb-3 text-[var(--text-muted)]">📊 COMPARISON</div>
            {topic.tables.map((table, tIdx) => (
              <div key={tIdx} className="overflow-x-auto border border-[var(--border)] rounded-[var(--r-lg)] bg-[var(--bg-overlay)]">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-elevated)] border-b-2" style={{ borderBottomColor: subject.color }}>
                      {table.headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 font-bold" style={{ color: subject.color }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className={`border-b border-[var(--border)] last:border-0 ${table.highlightRow === rIdx ? 'bg-[rgba(108,99,255,0.08)]' : (rIdx % 2 === 0 ? 'bg-transparent' : 'bg-[var(--glass)]')}`}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 leading-relaxed">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* BLOCK 7 - EXAMPLES */}
        {topic.examples && topic.examples.length > 0 && (
          <div id="examples" className="mb-10">
            <div className="label mb-3 text-[var(--text-muted)]">💡 EXAMPLES</div>
            {topic.examples.map((ex, idx) => (
              <div key={idx} className="bg-[#06060c] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden mb-3">
                <div className="bg-[rgba(255,255,255,0.03)] px-4 py-2.5 flex items-center gap-2 border-b border-[var(--border)]">
                  {ex.language && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-bg)] text-[var(--accent)] uppercase">{ex.language}</span>
                  )}
                  {ex.title && <span className="text-[12px] font-medium text-[var(--text-primary)]">{ex.title}</span>}
                </div>
                <div className="p-5 font-['JetBrains_Mono'] text-[12px] leading-[1.8] text-[#c8c8e0] whitespace-pre-wrap">
                  {ex.content}
                </div>
                {ex.explanation && (
                  <div className="px-5 py-3 border-t border-[var(--border)] text-[13px] text-[var(--text-secondary)] bg-[var(--bg-overlay)]">
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* BLOCK 9 - EXAM TIP */}
        <div id="examtip" className="mb-10">
          <div className="rounded-r-[var(--r-lg)] p-4 md:p-6 border-l-[4px] border-[#f59e0b] border border-[rgba(251,191,36,0.25)]" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.08),rgba(249,115,22,0.05))' }}>
            <div className="font-['Syne'] font-bold text-[11px] md:text-[12px] text-[#fbbf24] uppercase tracking-[0.08em] mb-4">★ WHAT TO WRITE IN EXAM</div>
            
            <div className="mb-4">
              <span className="inline-block text-[10px] md:text-[12px] font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-2 py-0.5 rounded mr-2 mb-1">3-MARK</span>
              <span className="text-[13px] md:text-[14px] text-[var(--text-primary)] leading-relaxed">{topic.examTip.threeMark}</span>
            </div>
            
            <div className="mb-4">
              <span className="inline-block text-[10px] md:text-[12px] font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-2 py-0.5 rounded mr-2 mb-1">4-MARK</span>
              <span className="text-[13px] md:text-[14px] text-[var(--text-primary)] leading-relaxed">{topic.examTip.fourMark}</span>
            </div>
 
            <div className="mb-4">
              <span className="inline-block text-[10px] md:text-[12px] font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-2 py-0.5 rounded mr-2 mb-1">6-MARK</span>
              <span className="text-[13px] md:text-[14px] text-[var(--text-primary)] leading-relaxed">{topic.examTip.sixMark}</span>
            </div>
 
            <div className="mt-5 pt-4 border-t border-[rgba(251,191,36,0.2)]">
              <div className="text-[10px] md:text-[11px] font-bold text-[#fbbf24] uppercase mb-2">NEVER FORGET</div>
              <ul className="list-disc pl-5 space-y-1 text-[12px] md:text-[13px] text-[#fbbf24]">
                {topic.examTip.neverForget.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 inline-block text-[9px] md:text-[10px] font-bold text-[#fbbf24] bg-[#fbbf24]/20 border border-[#fbbf24]/50 rounded-full px-3 py-1">
              📍 VERY HIGH FREQUENCY ({topic.examTip.previousYearRef})
            </div>
          </div>
        </div>

        {/* BLOCK 10 - RELATED TOPICS */}
        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
          <div className="mb-10">
            <div className="label mb-3 text-[var(--text-muted)]">🔗 RELATED TOPICS</div>
            <div className="flex flex-wrap gap-2">
              {topic.relatedTopics.map(rel => (
                <span key={rel} className="px-3.5 py-1.5 rounded-full text-[12px] cursor-pointer bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                  {rel}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BLOCK 11 - PERSONAL NOTES */}
        <div className="mb-8">
          <div className="label mb-3 text-[var(--text-muted)]">📝 MY NOTES</div>
          <textarea 
            id="notes"
            className="input-field min-h-[120px] resize-y"
            placeholder="Add your personal notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="pt-7 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <div className="flex w-full md:flex-1 gap-2">
            <button 
              onClick={() => navigateTo(currentIndex - 1)}
              disabled={currentIndex <= 0}
              className="btn-secondary flex-1 py-3 text-[13px] md:text-[14px] disabled:opacity-30"
            >
              ← Prev
            </button>
            <button 
              onClick={() => navigateTo(currentIndex + 1)}
              disabled={currentIndex >= totalInUnit - 1}
              className="btn-secondary flex-1 py-3 text-[13px] md:text-[14px] disabled:opacity-30"
            >
              Next →
            </button>
          </div>
          <button 
            onClick={async () => {
              const { useAppStore } = await import('@/store/useAppStore');
              const { useDataStore } = await import('@/store/useDataStore');
              const { createClient } = await import('@/lib/supabase/client');
              const { toast } = await import('sonner');
              
              const user = useAppStore.getState().user;
              if (!user) {
                toast.error('Please login to save your progress.');
                return;
              }
              
              const supabase = createClient();
              const authUser = user.id.includes('-') ? user.id : (await supabase.auth.getUser()).data.user?.id;
              
              if (!authUser) {
                toast.error('Session expired. Please login again.');
                return;
              }

              const { error } = await supabase
                .from('user_progress')
                .upsert({ 
                  user_id: authUser, 
                  subject_id: subject.id, 
                  topic_id: topic.id, 
                  completed: true 
                }, { onConflict: 'user_id,subject_id,topic_id' });
                
              if (error) {
                toast.error('Failed to save progress to cloud.');
                console.error(error);
              } else {
                toast.success('Progress saved!');
                // Update local store as well
                const saveTopic = useDataStore.getState().saveTopic;
                saveTopic(topic.id, { ...topic, isCompleted: true });
              }
            }}
            className={`w-full md:w-auto py-3 px-6 flex items-center justify-center gap-2 ${topic.isCompleted ? 'bg-[#10b981] text-[var(--bg-base)]' : 'btn-success'}`}>
            <Check strokeWidth={3} className="w-4 h-4" />
            {topic.isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}
