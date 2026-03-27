'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImage from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Image as ImageIcon, Code, Save, Eye, ChevronLeft, Plus, Trash2, HelpCircle, Layout, Info, Layers } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDataStore } from '@/store/useDataStore';
import { TopicContent, TopicDiagram, KeyPoint } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopicEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicId = searchParams.get('id') || 'cd-1-1';
  
  const { topics, saveTopic, subjects } = useDataStore();
  const initialTopic = topics[topicId] || Object.values(topics)[0];
  const subject = subjects.find(s => s.id === initialTopic?.subjectId);

  // Form State
  const [formData, setFormData] = useState<TopicContent | null>(null);

  useEffect(() => {
    if (initialTopic) {
      setFormData(initialTopic);
    }
  }, [topicId, initialTopic]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      Placeholder.configure({
        placeholder: 'Write topic summary and definition here...',
      }),
    ],
    content: initialTopic?.definition || `<h2>Definition</h2><p>Start writing...</p>`,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-p:text-[#c8c8e0] prose-headings:text-white max-w-none min-h-[300px] outline-none p-6 text-[15px]',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => prev ? ({ ...prev, definition: editor.getHTML() }) : null);
    }
  }, [topicId]);

  const handlePublish = () => {
    if (!formData) return;
    
    const updatedTopic: TopicContent = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    saveTopic(topicId, updatedTopic);
    alert(`Topic "${formData.name}" Successfully Updated!`);
  };

  if (!formData || !editor) return null;

  // Helpers for nested arrays
  const updateSummary = (idx: number, val: string) => {
    const newSummary = [...(formData.summary || [])];
    newSummary[idx] = val;
    setFormData({ ...formData, summary: newSummary });
  };

  const addSummaryPoint = () => {
    setFormData({ ...formData, summary: [...(formData.summary || []), 'New summary point...'] });
  };

  const addDiagram = () => {
    const newDiag: TopicDiagram = {
      id: `diag-${Date.now()}`,
      type: 'mermaid',
      title: 'New Diagram',
      content: 'graph TD\nA --> B'
    };
    setFormData({ ...formData, diagrams: [...(formData.diagrams || []), newDiag] });
  };

  const updateDiagram = (id: string, updates: Partial<TopicDiagram>) => {
    setFormData({
      ...formData,
      diagrams: formData.diagrams.map(d => d.id === id ? { ...d, ...updates } : d)
    });
  };

  const removeDiagram = (id: string) => {
    setFormData({
      ...formData,
      diagrams: formData.diagrams.filter(d => d.id !== id)
    });
  };

  const addKeyPoint = () => {
    const newKP: KeyPoint = {
      id: `kp-${Date.now()}`,
      text: 'New key point...',
      isHighlight: false
    };
    setFormData({ ...formData, keyPoints: [...(formData.keyPoints || []), newKP] });
  };

  return (
    <div className="h-full flex flex-col max-w-[1280px] mx-auto pb-20">
      {/* Header (Sticky) */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0 bg-[var(--bg-base)] py-4 sticky top-0 z-30 border-b border-[var(--border)]">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="btn-icon rounded-full"><ChevronLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="h1 mb-1 text-[24px]">Advanced Topic Editor</h1>
            <p className="text-[13px] text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Editing {formData.name} in {subject?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-2.5 flex items-center gap-2"><Eye className="w-4 h-4" /> Preview</button>
          <button onClick={handlePublish} className="btn-primary py-2.5 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 border-none shadow-lg"><Save className="w-4 h-4" /> Publish Changes</button>
        </div>
      </div>

      <div className="flex-1 space-y-10">
        
        {/* 1. QUICK SUMMARY (Exam-ready facts) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
              <h2 className="text-[16px] font-bold tracking-tight">Quick Summary (Exam Facts)</h2>
            </div>
            <button onClick={addSummaryPoint} className="btn-secondary py-1.5 px-4 text-[12px] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Bullet
            </button>
          </div>
          <div className="space-y-3 bg-[var(--bg-overlay)] p-6 rounded-[var(--r-xl)] border border-[var(--border)]">
            {formData.summary.map((point, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-10 flex items-center justify-center text-[var(--text-muted)] font-mono text-[11px]">{i+1}</div>
                <textarea 
                  className="input-field min-h-[60px] flex-1 py-3"
                  value={point}
                  onChange={(e) => updateSummary(i, e.target.value)}
                />
                <button 
                  onClick={() => setFormData({ ...formData, summary: formData.summary.filter((_, idx) => idx !== i) })}
                  className="text-red-400 hover:text-red-300 px-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. CORE THEORY (TipTap) */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
              <Layout className="w-4 h-4" />
            </div>
            <h2 className="text-[16px] font-bold tracking-tight">Main Theory & Characteristics</h2>
          </div>
          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
            <div className="bg-[var(--bg-elevated)] border-b border-[var(--border)] px-3 py-2 flex items-center gap-1 overflow-x-auto">
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('heading', { level: 1 }) ? 'text-[var(--accent)] bg-[var(--accent-bg)]' : 'text-[var(--text-muted)]'}`}>
                <Heading1 className="w-4 h-4" />
              </button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('heading', { level: 2 }) ? 'text-[var(--accent)] bg-[var(--accent-bg)]' : 'text-[var(--text-muted)]'}`}>
                <Heading2 className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-6 bg-[var(--border)] mx-1"></div>
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('bold') ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                <Bold className="w-4 h-4" />
              </button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('italic') ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                <Italic className="w-4 h-4" />
              </button>
              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('bulletList') ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('orderedList') ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-6 bg-[var(--border)] mx-1"></div>
              <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('blockquote') ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                <Quote className="w-4 h-4" />
              </button>
              <button onClick={() => editor.chain().focus().toggleCode().run()} className={`p-2 rounded hover:bg-[var(--glass)] ${editor.isActive('code') ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                <Code className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#09090b]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </section>

        {/* 2. EXAM TIPS (3/4/6 MARKS) */}
        <section className="bg-[var(--bg-overlay)] border border-[#f59e0b50] rounded-[var(--r-xl)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b20] flex items-center justify-center text-[#f59e0b]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-[16px] font-bold tracking-tight text-[#f59e0b]">Exam Optimization Block</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider">3-Mark Answer</label>
              <textarea 
                className="input-field min-h-[140px] border-[#f59e0b30] focus:border-[#f59e0b]" 
                value={formData.examTip.threeMark}
                onChange={(e) => setFormData({ ...formData, examTip: { ...formData.examTip, threeMark: e.target.value } })}
                placeholder="Writing strategy for 3 marks..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider">4-Mark Answer</label>
              <textarea 
                className="input-field min-h-[140px] border-[#f59e0b30] focus:border-[#f59e0b]" 
                value={formData.examTip.fourMark}
                onChange={(e) => setFormData({ ...formData, examTip: { ...formData.examTip, fourMark: e.target.value } })}
                placeholder="Writing strategy for 4 marks..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider">6-Mark Answer</label>
              <textarea 
                className="input-field min-h-[140px] border-[#f59e0b30] focus:border-[#f59e0b]" 
                value={formData.examTip.sixMark}
                onChange={(e) => setFormData({ ...formData, examTip: { ...formData.examTip, sixMark: e.target.value } })}
                placeholder="Writing strategy for 6 marks..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider">Never Forget (Student Memorization)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.examTip.neverForget.map((tip, i) => (
                <input 
                  key={i}
                  className="input-field border-[#f59e0b30] focus:border-[#f59e0b]" 
                  value={tip}
                  onChange={(e) => {
                    const nf = [...formData.examTip.neverForget];
                    nf[i] = e.target.value;
                    setFormData({ ...formData, examTip: { ...formData.examTip, neverForget: nf } });
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3. VISUAL DIAGRAMS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-bold tracking-tight">Visual Diagrams</h2>
            </div>
            <button onClick={addDiagram} className="btn-secondary py-1.5 px-4 text-[12px] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Diagram
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.diagrams.map((diag) => (
              <div key={diag.id} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]">
                  <input 
                    className="bg-transparent border-none outline-none font-bold text-[13px] text-[var(--text-primary)] w-full"
                    value={diag.title}
                    onChange={(e) => updateDiagram(diag.id, { title: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <select 
                      className="bg-transparent text-[11px] font-bold text-[var(--text-muted)] outline-none cursor-pointer"
                      value={diag.type}
                      onChange={(e) => updateDiagram(diag.id, { type: e.target.value as any })}
                    >
                      <option value="mermaid">Mermaid Code</option>
                      <option value="ascii">ASCII Art</option>
                    </select>
                    <button onClick={() => removeDiagram(diag.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex-1">
                  <textarea 
                    className="w-full h-full min-h-[220px] bg-[#06060c] p-6 font-mono text-[12px] text-green-400 outline-none resize-none"
                    value={diag.content}
                    onChange={(e) => updateDiagram(diag.id, { content: e.target.value })}
                    placeholder="Enter diagram code here..."
                  />
                </div>
                <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
                  <input 
                    placeholder="Enter diagram caption..."
                    className="w-full bg-transparent border-none outline-none text-[12px] text-[var(--text-muted)]"
                    value={diag.caption || ''}
                    onChange={(e) => updateDiagram(diag.id, { caption: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KEY LEARNING POINTS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-bold tracking-tight">Key Learning Points</h2>
            </div>
            <button onClick={addKeyPoint} className="btn-secondary py-1.5 px-4 text-[12px] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Point
            </button>
          </div>
          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden">
            {formData.keyPoints.map((kp, idx) => (
              <div key={kp.id} className="flex items-center gap-4 p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors">
                <div className="w-6 text-[11px] font-bold text-[var(--text-muted)]">{(idx+1).toString().padStart(2, '0')}</div>
                <input 
                  className="flex-1 bg-transparent border-none outline-none text-[14px]"
                  value={kp.text}
                  onChange={(e) => {
                    const kps = [...formData.keyPoints];
                    kps[idx].text = e.target.value;
                    setFormData({ ...formData, keyPoints: kps });
                  }}
                />
                <button 
                  onClick={() => {
                    const kps = [...formData.keyPoints];
                    kps[idx].isHighlight = !kps[idx].isHighlight;
                    setFormData({ ...formData, keyPoints: kps });
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${kp.isHighlight ? 'bg-indigo-500 text-white' : 'bg-[var(--border)] text-[var(--text-muted)]'}`}
                >
                  {kp.isHighlight ? 'HIGHLIGHTED' : 'STANDARD'}
                </button>
                <button 
                  onClick={() => setFormData({ ...formData, keyPoints: formData.keyPoints.filter(k => k.id !== kp.id) })}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TOPIC IMAGES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-bold tracking-tight">Embedded Illustrations</h2>
            </div>
            <button 
              onClick={() => setFormData({ ...formData, images: [...(formData.images || []), { id: Date.now().toString(), url: 'https://placehold.co/600x400/0f0f18/6c63ff?text=Illustration', caption: 'New Image', altText: '', position: 'inline' }] })}
              className="btn-secondary py-1.5 px-4 text-[12px] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Image
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formData.images?.map((img) => (
              <div key={img.id} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden group">
                <div className="aspect-video bg-black relative">
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => setFormData({ ...formData, images: formData.images?.filter(i => i.id !== img.id) })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 bg-[var(--bg-elevated)]">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[12px] text-[var(--text-primary)] font-medium mb-1"
                    placeholder="Caption..."
                    value={img.caption}
                    onChange={(e) => setFormData({ ...formData, images: formData.images?.map(i => i.id === img.id ? { ...i, caption: e.target.value } : i) })}
                  />
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[10px] text-[var(--text-muted)]"
                    placeholder="Image URL..."
                    value={img.url}
                    onChange={(e) => setFormData({ ...formData, images: formData.images?.map(i => i.id === img.id ? { ...i, url: e.target.value } : i) })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
