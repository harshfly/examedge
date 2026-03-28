'use client';

import React from 'react';
import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Plus, Edit2, Trash2, ChevronLeft, ArrowRight } from 'lucide-react';
import { TopicContent } from '@/types';
import Link from 'next/link';

export default function SubjectDetailsManager({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjects, updateSubject, saveTopic } = useDataStore();
  const { subjectId } = React.use(params);
  const subject = subjects.find(s => s.id === subjectId);
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<{ no: string, title: string, hours: number } | null>(null);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [subjectCode, setSubjectCode] = useState(subject?.code || '');
  const [newUnit, setNewUnit] = useState({ no: '', title: '', hours: 0 });
  const [unitAddingTopic, setUnitAddingTopic] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  if (!subject) return <div className="p-8">Subject not found.</div>;

  const handleAddUnit = () => {
    if (!newUnit.no || !newUnit.title) return;
    updateSubject(subject.id, {
      units: [...subject.units, { ...newUnit, topics: [] }]
    });
    setIsAddingUnit(false);
    setNewUnit({ no: '', title: '', hours: 0 });
  };

  const handleUpdateUnit = () => {
    if (!editingUnit) return;
    const updatedUnits = subject.units.map(u => 
      u.no === editingUnit.no ? { ...u, title: editingUnit.title, hours: editingUnit.hours } : u
    );
    updateSubject(subject.id, { units: updatedUnits });
    setEditingUnit(null);
  };

  const saveSubjectCode = () => {
    updateSubject(subject.id, { code: subjectCode });
    setIsEditingCode(false);
  };

  const deleteUnit = (no: string) => {
    updateSubject(subject.id, {
      units: subject.units.filter(u => u.no !== no)
    });
  };

  const handleAddTopic = (unitNo: string) => {
    if (!newTopicName.trim()) return;

    const topicId = `${subject.id}-${unitNo}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-');
    
    const newTopicContent: TopicContent = {
      id: topicId,
      name: newTopicName,
      subjectId: subject.id,
      unitNo: unitNo,
      subtopics: [],
      summary: ['New topic summary point'],
      definition: '<p>Start typing your definition here...</p>',
      diagrams: [],
      images: [],
      keyPoints: [],
      examples: [],
      examTip: { 
        threeMark: '', 
        fourMark: '', 
        sixMark: '', 
        neverForget: [], 
        examFrequency: 'medium' 
      },
      relatedTopics: [],
      updatedAt: new Date().toISOString()
    };
    
    saveTopic(topicId, newTopicContent);

    const updatedUnits = subject.units.map(u => {
      if (u.no === unitNo) {
        return {
          ...u,
          topics: [...u.topics, { 
            id: topicId, 
            name: newTopicName, 
            isCompleted: false, 
            difficulty: 'medium' as const,
            slug: topicId,
            estimatedMinutes: 15,
            examFrequency: 'medium' as const,
            tags: []
          }]
        };
      }
      return u;
    });

    updateSubject(subject.id, { units: updatedUnits });
    setUnitAddingTopic(null);
    setNewTopicName('');
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/subjects" className="btn-icon rounded-full"><ChevronLeft className="w-4 h-4" /></Link>
        <div>
          <h1 className="h1 mb-0">{subject.name}</h1>
          <p className="text-[13px] text-[var(--accent)] font-bold tracking-wider">UNIT & TOPIC MANAGER</p>
        </div>
      </div>

      <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-5 mb-8 flex justify-between items-center">
        <div className="flex gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">Code:</span> 
            {isEditingCode ? (
              <div className="flex items-center gap-2">
                <input 
                  className="input-field py-1 px-2 w-[120px] font-bold h-8" 
                  value={subjectCode} 
                  onChange={e => setSubjectCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveSubjectCode()}
                />
                <button onClick={saveSubjectCode} className="text-[#10b981] hover:underline font-bold">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <strong className="text-white">{subject.code}</strong>
                <button onClick={() => setIsEditingCode(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[var(--accent)]">
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div><span className="text-[var(--text-muted)]">Total Units:</span> <strong className="text-white">{subject.units.length}</strong></div>
        </div>
        <button onClick={() => setIsAddingUnit(true)} className="btn-primary flex items-center gap-2 py-2">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      {isAddingUnit && (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-lg)] p-5 mb-6 animate-in fade-in">
          <h4 className="font-bold text-[14px] mb-3">Add New Unit Target</h4>
          <div className="flex gap-4 mb-4">
            <div className="flex-col gap-1.5 flex w-[120px]">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1">Unit No</label>
              <input className="input-field" placeholder="e.g. VI" value={newUnit.no} onChange={e=>setNewUnit({...newUnit, no: e.target.value})} />
            </div>
            <div className="flex-col gap-1.5 flex flex-1">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1">Unit Name</label>
              <input className="input-field" placeholder="Full name of unit..." value={newUnit.title} onChange={e=>setNewUnit({...newUnit, title: e.target.value})} />
            </div>
            <div className="flex-col gap-1.5 flex w-[100px]">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1">Hours</label>
              <input className="input-field" type="number" placeholder="Hrs" value={newUnit.hours || ''} onChange={e=>setNewUnit({...newUnit, hours: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAddingUnit(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAddUnit} className="btn-success">Save Unit</button>
          </div>
        </div>
      )}

      {editingUnit && (
        <div className="bg-[#1a1a2e] border border-[var(--accent)] rounded-[var(--r-lg)] p-5 mb-6 shadow-xl shadow-[var(--accent)]/10">
          <h4 className="font-bold text-[14px] mb-3 text-[var(--accent)]">Modifying Unit {editingUnit.no}</h4>
          <div className="flex gap-4 mb-4">
            <div className="flex-col gap-1.5 flex flex-1">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1">Unit Name</label>
              <input className="input-field" value={editingUnit.title} onChange={e=>setEditingUnit({...editingUnit, title: e.target.value})} />
            </div>
            <div className="flex-col gap-1.5 flex w-[100px]">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1">Hours</label>
              <input className="input-field" type="number" value={editingUnit.hours || ''} onChange={e=>setEditingUnit({...editingUnit, hours: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditingUnit(null)} className="btn-ghost">Discard</button>
            <button onClick={handleUpdateUnit} className="btn-primary py-2 px-6">Apply Changes</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {subject.units.map(unit => (
          <div key={unit.no} className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[var(--bg-overlay)] overflow-hidden">
            <div className="bg-[var(--bg-elevated)] px-5 py-3 border-b border-[var(--border)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-[var(--accent-bg)] text-[var(--accent)] text-[12px] font-bold px-2 py-0.5 rounded">UNIT {unit.no}</span>
                <span className="font-bold text-[15px]">{unit.title}</span>
                <span className="text-[12px] text-[var(--text-muted)] ml-2">{unit.hours}h</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingUnit({ no: unit.no, title: unit.title, hours: unit.hours })} className="text-[var(--text-muted)] hover:text-white p-1 hover:bg-white/5 rounded transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => confirm('Delete Unit?') && deleteUnit(unit.no)} className="text-[var(--error)] hover:opacity-80 p-1 hover:bg-red-500/10 rounded transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            
            <div className="p-5">
              {unit.topics.length === 0 ? (
                <div className="text-[13px] text-[var(--text-muted)] italic py-2">No topics in this unit. Add theory topics here.</div>
              ) : (
                <div className="space-y-2 mb-4">
                  {unit.topics.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between p-3 rounded-[var(--r-md)] border border-transparent hover:border-[var(--border)] hover:bg-[var(--glass)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                        <span className="text-[14px] font-medium text-[var(--text-primary)]">{topic.name}</span>
                        <span className="text-[10px] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 border border-[var(--border)] rounded text-[var(--text-muted)] uppercase">{topic.difficulty}</span>
                      </div>
                      <Link href={`/admin/topics?id=${topic.id}`} className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] hover:underline">
                        Edit Content <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              
              {unitAddingTopic === unit.no ? (
                <div className="mt-4 p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-md)] animate-in slide-in-from-top-2">
                  <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase mb-2 block">New Topic Name</label>
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      className="input-field flex-1" 
                      placeholder="e.g. Memory Management" 
                      value={newTopicName}
                      onChange={e => setNewTopicName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddTopic(unit.no)}
                    />
                    <button onClick={() => setUnitAddingTopic(null)} className="btn-ghost">Cancel</button>
                    <button onClick={() => handleAddTopic(unit.no)} className="btn-success">Add Topic</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setUnitAddingTopic(unit.no)}
                  className="mt-2 text-[12px] font-bold text-[#10b981] bg-[#10b98115] hover:bg-[#10b98125] px-4 py-2 rounded-[var(--r-md)] transition-colors border border-[rgba(16,185,129,0.2)] flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD NEW TOPIC TO UNIT {unit.no}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
