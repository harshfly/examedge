'use client';

import { useState, useEffect } from 'react';
import { Save, Copy, Terminal, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { DiagramAsset } from '@/types';
import { toast } from 'sonner';

export default function DiagramStudio() {
  const { diagrams, saveDiagram, deleteDiagram } = useDataStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');

  // Load first diagram if exists
  useEffect(() => {
    if (diagrams.length > 0 && !activeId) {
       loadDiagram(diagrams[0]);
    }
  }, [diagrams, activeId]);

  const loadDiagram = (d: DiagramAsset) => {
    setActiveId(d.id);
    setCode(d.content);
    setTitle(d.title);
    setCaption(d.caption || '');
  };

  const handleCreateNew = () => {
    setActiveId(null);
    setCode('graph TD\n    A[Start] --> B(Process)');
    setTitle('New Diagram');
    setCaption('');
  };

  const handleSave = () => {
    const id = activeId || `DIA-${Date.now()}`;
    const diagram: DiagramAsset = {
      id,
      type: 'mermaid',
      title: title || 'Untitled Diagram',
      content: code,
      caption: caption,
      updatedAt: new Date().toISOString()
    };
    saveDiagram(diagram);
    setActiveId(id);
    toast.success("Diagram saved to cloud");
  };

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
             <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="h1 mb-0.5">Diagram Studio</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">Create Mermaid.js and ASCII architecture diagrams</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCreateNew} className="btn-secondary py-2.5 px-5 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New
          </button>
          <button onClick={handleSave} className="btn-success py-2.5 px-6 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save to Cloud
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* SIDEBAR: Saved Diagrams */}
        <div className="w-[280px] bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] flex flex-col overflow-hidden">
           <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[12px] font-bold text-[var(--text-muted)]">SAVED ASSETS</div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {diagrams.length === 0 && <div className="p-4 text-center text-[11px] text-[var(--text-muted)] italic">No diagrams saved.</div>}
             {diagrams.map(d => (
               <div key={d.id} className={`group p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${activeId === d.id ? 'bg-[var(--accent-bg)] border border-[var(--accent)] text-white' : 'hover:bg-[var(--glass)] text-[var(--text-muted)]'}`} onClick={() => loadDiagram(d)}>
                  <div className="flex-1 truncate">
                    <div className="text-[13px] font-bold truncate">{d.title}</div>
                    <div className="text-[10px] opacity-60 uppercase">{d.type}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteDiagram(d.id); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-red-500 rounded-md transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
               </div>
             ))}
           </div>
        </div>

        {/* LEFT PANE: Editor */}
        <div className="flex-1 flex flex-col bg-[#06060c] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
          <div className="bg-[var(--bg-elevated)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[var(--accent-bg)] text-[var(--accent)] text-[12px] font-bold rounded">MERMAID</button>
              <button className="px-3 py-1 hover:bg-[var(--glass)] text-[var(--text-muted)] text-[12px] font-bold rounded flex items-center gap-1"><Terminal className="w-3 h-3" /> ASCII</button>
            </div>
            <button className="text-[var(--text-muted)] hover:text-white" onClick={() => navigator.clipboard.writeText(code)}><Copy className="w-4 h-4" /></button>
          </div>
          
          <textarea 
            className="flex-1 w-full p-6 bg-transparent border-none text-[#7ef07e] font-['JetBrains_Mono'] text-[13px] leading-[1.8] outline-none resize-none break-pre align-top"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* RIGHT PANE: Preview */}
        <div className="w-[450px] flex flex-col bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[var(--bg-elevated)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-bold text-[var(--text-muted)] flex items-center gap-2"><ImageIcon className="w-4 h-4" /> LIVE PREVIEW</span>
            {/* Diagram Title Configuration */}
            <input 
              type="text" 
              className="bg-[var(--bg-input)] border border-[var(--border)] rounded px-3 py-1 text-[12px] text-white outline-none focus:border-[var(--accent)]" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Diagram Title" 
            />
          </div>
          
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto pattern-grid">
            {/* Real implementation would use mermaid API to render the SVG here */}
            <div className="w-full max-w-full bg-[#06060c] border border-[rgba(108,99,255,0.15)] rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-md)]">
              <div className="p-6 font-['JetBrains_Mono'] text-[11px] leading-relaxed text-[#7ef07e] whitespace-pre-wrap flex items-center justify-center">
                 <pre>{code}</pre>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)] min-h-[60px]">
            <input 
              type="text" 
              className="w-full bg-transparent border-none text-[12px] text-[var(--text-primary)] outline-none" 
              placeholder="Add an optional caption here..." 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
