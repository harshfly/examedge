'use client';

import { useState } from "react";
import { FileText, Plus, Loader2, Trash2, ExternalLink, GraduationCap, AlertCircle, Save } from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { SyllabusLink } from "@/types";

export default function AdminSyllabusPage() {
  const { syllabi, saveSyllabus, deleteSyllabus } = useDataStore();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    year: 3,
    semester: 6,
    name: 'Official B.Tech CSE/IT Syllabus',
    pdf_url: ''
  });

  async function handleAddSyllabus() {
    if (!formData.pdf_url || !formData.name) return;
    try {
      setSaving(true);
      const newSyllabus: SyllabusLink = {
        id: `SYL-${formData.year}-${formData.semester}`,
        year: formData.year,
        semester: formData.semester,
        name: formData.name,
        pdf_url: formData.pdf_url
      };
      
      saveSyllabus(newSyllabus);
      setFormData({ ...formData, pdf_url: '' });
      alert('Syllabus updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this syllabus link?')) return;
    deleteSyllabus(id);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h2 flex items-center gap-3">
            <FileText className="text-[var(--accent)]" /> 
            Syllabus Manager
          </h1>
          <p className="text-[var(--text-muted)] text-[14px]">
            Upload or link official PDF syllabi for each Year and Semester.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Management Form */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 sticky top-8">
            <h3 className="text-[14px] font-bold mb-6">Assign Syllabus</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">YEAR</label>
                  <select 
                    className="input-field py-2.5"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">SEMESTER</label>
                  <select 
                    className="input-field py-2.5"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">DISPLAY NAME</label>
                <input 
                  type="text" 
                  className="input-field py-2.5"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider mb-2 block">PDF URL / GOOGLE DRIVE LINK</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="input-field py-2.5"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                />
                <p className="text-[10px] text-[var(--text-disabled)] mt-2 italic flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  Ensure the PDF is publically accessible.
                </p>
              </div>

              <button 
                onClick={handleAddSyllabus}
                disabled={saving || !formData.pdf_url}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-4"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Current Matrix */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
              <h3 className="text-[14px] font-bold">Active Syllabus Matrix</h3>
            </div>
            
            <div className="divide-y divide-[var(--border)]">
              {syllabi.length === 0 ? (
                <div className="p-20 text-center text-[var(--text-muted)]">No syllabi mapped yet.</div>
              ) : (
                syllabi.map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-[var(--glass)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white">Year {s.year} · Semester {s.semester}</div>
                        <div className="text-[12px] text-[var(--text-muted)]">{s.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <a 
                        href={s.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[12px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                      >
                        View Public File <ExternalLink className="w-3 h-3" />
                      </a>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--error)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
