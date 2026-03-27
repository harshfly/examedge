'use client';

import { useState } from 'react';
import { Save, Copy, Terminal, Image as ImageIcon } from 'lucide-react';

export default function DiagramStudio() {
  const [code, setCode] = useState(`graph TD
    A[Source Program] -->|Character Stream| B(Lexical Analyzer)
    B -->|Token Stream| C(Syntax Analyzer)
    C -->|Syntax Tree| D(Semantic Analyzer)
    D -->|Annotated Tree| E(Intermediate Code Gen)
    E -->|Intermediate Rep| F(Code Optimizer)
    F -->|Optimized IR| G(Target Code Gen)
    G --> H[Target Machine Code]`);

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="h1 mb-1">Diagram Studio</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Create Mermaid.js and ASCII architecture diagrams</p>
        </div>
        <button className="btn-success flex items-center gap-2"><Save className="w-4 h-4" /> Save Diagram</button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* LEFT PANE: Editor */}
        <div className="w-1/2 flex flex-col bg-[#06060c] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
          <div className="bg-[var(--bg-elevated)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[var(--accent-bg)] text-[var(--accent)] text-[12px] font-bold rounded">MERMAID</button>
              <button className="px-3 py-1 hover:bg-[var(--glass)] text-[var(--text-muted)] text-[12px] font-bold rounded flex items-center gap-1"><Terminal className="w-3 h-3" /> ASCII</button>
            </div>
            <button className="text-[var(--text-muted)] hover:text-white"><Copy className="w-4 h-4" /></button>
          </div>
          
          <textarea 
            className="flex-1 w-full p-6 bg-transparent border-none text-[#7ef07e] font-['JetBrains_Mono'] text-[13px] leading-[1.8] outline-none resize-none break-pre align-top"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* RIGHT PANE: Preview */}
        <div className="w-1/2 flex flex-col bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[var(--bg-elevated)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-bold text-[var(--text-muted)] flex items-center gap-2"><ImageIcon className="w-4 h-4" /> LIVE PREVIEW</span>
            {/* Diagram Title Configuration */}
            <input type="text" className="bg-[var(--bg-input)] border border-[var(--border)] rounded px-3 py-1 text-[12px] text-white outline-none focus:border-[var(--accent)]" defaultValue="Compiler Flow Pipeline" placeholder="Diagram Title" />
          </div>
          
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto pattern-grid">
            {/* Real implementation would use mermaid API to render the SVG here */}
            {/* For demonstration we show the code formatted as the diagram container expected in UI */}
            <div className="w-full max-w-full bg-[#06060c] border border-[rgba(108,99,255,0.15)] rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-md)]">
              <div className="p-6 font-['JetBrains_Mono'] text-[11px] leading-relaxed text-[#7ef07e] whitespace-pre-wrap flex items-center justify-center">
                 <pre>{code}</pre>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)] min-h-[60px]">
            <input type="text" className="w-full bg-transparent border-none text-[12px] text-[var(--text-primary)] outline-none" placeholder="Add an optional caption here..." defaultValue="The standard sequential flow of the 6 compiler phases." />
          </div>
        </div>

      </div>
    </div>
  );
}
