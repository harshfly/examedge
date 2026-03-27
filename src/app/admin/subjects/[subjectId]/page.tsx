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
          <div><span className="text-[var(--text-muted)]">Code:</span> <strong className="text-white">{subject.code}</strong></div>
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
            <input className="input-field w-[100px]" placeholder="Unit No (e.g. VI)" value={newUnit.no} onChange={e=>setNewUnit({...newUnit, no: e.target.value})} />
            <input className="input-field flex-1" placeholder="Unit Title" value={newUnit.title} onChange={e=>setNewUnit({...newUnit, title: e.target.value})} />
            <input className="input-field w-[120px]" type="number" placeholder="Hours" value={newUnit.hours || ''} onChange={e=>setNewUnit({...newUnit, hours: parseInt(e.target.value)})} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAddingUnit(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAddUnit} className="btn-success">Save Unit</button>
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
                <button className="text-[var(--text-muted)] hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => confirm('Delete Unit?') && deleteUnit(unit.no)} className="text-[var(--error)] hover:opacity-80"><Trash2 className="w-3.5 h-3.5" /></button>
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
