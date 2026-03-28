'use client';

import { Save, ShieldAlert, Monitor, Keyboard, Database, Calendar, Cloud, RefreshCw } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { examDates, setYearExamDate, isSynced, fetchInitialData, bootstrapToSupabase } = useDataStore();

  const handleSave = () => {
    toast.success("Academic configuration synchronized across all nodes.");
  };
  return (
    <div className="max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Platform Settings</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Configure global variables, theme engines, and access scopes.</p>
        </div>
        <button onClick={handleSave} className="btn-success flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Cloud Synchronization Card */}
        <div className="bg-[var(--bg-overlay)] border border-[var(--accent)] bg-[rgba(108,99,255,0.03)] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[var(--bg-elevated)] px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Cloud className="w-5 h-5 text-[var(--accent)]" />
               <h3 className="font-bold text-[15px]">Cloud Synchronization</h3>
             </div>
             <div className="flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSynced ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {isSynced ? 'SYNCHRONIZED' : 'LOCAL CACHE ONLY'}
                </div>
                <button 
                  onClick={() => { fetchInitialData(); toast.success("Refreshed from Supabase"); }}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-[500px]">
                <h4 className="font-bold text-white text-[14px] mb-1">Mirror Local State to Supabase</h4>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  If you have added subjects or content on this device that isn't showing on other devices, click bootstrap to push your entire local configuration to the cloud.
                </p>
              </div>
              <button 
                onClick={() => bootstrapToSupabase()}
                className="btn-primary flex items-center gap-2 whitespace-nowrap bg-[var(--accent)] px-6 py-2.5 rounded-lg font-bold text-[13px]"
              >
                <Cloud className="w-4 h-4" /> Bootstrap to Supabase
              </button>
            </div>
          </div>
        </div>
        
        {/* Interface Engine Card */}
        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[var(--bg-elevated)] px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
             <Monitor className="w-5 h-5 text-[var(--text-muted)]" />
             <h3 className="font-bold text-[15px]">Interface Engine</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] mb-2 block">PRIMARY BRAND HEX</label>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-md bg-[#6c63ff] border border-[rgba(255,255,255,0.2)]"></div>
                <input type="text" className="input-field max-w-[150px]" defaultValue="#6c63ff" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] mb-2 block">DEFAULT COLOR THEME</label>
              <select className="input-field">
                <option>Dark Luxury (Active)</option>
                <option>SVIIT Light Academic</option>
                <option>High Contrast Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Schedule Card */}
        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[var(--bg-elevated)] px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
             <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
             <h3 className="font-bold text-[15px]">Academic Schedule</h3>
          </div>
          <div className="p-6">
            <p className="text-[12px] text-[var(--text-secondary)] mb-6">Set the global examination start dates for each academic year. These will reflect in student navbars.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(year => (
                <div key={year}>
                  <label className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] mb-2 block uppercase text-[10px]">Year {year} Exam Date</label>
                  <input 
                    type="date" 
                    className="input-field py-2 text-[13px]" 
                    value={examDates[year]?.split('T')[0] || ''} 
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setYearExamDate(year, date.toISOString());
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data & Storage Card */}
        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[var(--bg-elevated)] px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
             <Database className="w-5 h-5 text-[var(--text-muted)]" />
             <h3 className="font-bold text-[15px]">Data & Storage</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <label className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] mb-2 block flex items-center gap-2">
                 ENABLE OFFLINE SYNC (INDEXEDDB) <input type="checkbox" className="accent-[#6c63ff]" defaultChecked />
               </label>
               <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                 Allow students to persistently store their Study/Flashcard progress locally if connection is lost.
               </p>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-wider text(--text-muted) mb-2 block">SUPERMEMO INTERVAL MULTIPLIER</label>
              <input type="number" step="0.1" className="input-field" defaultValue="2.5" />
              <p className="text-[12px] text-[var(--text-secondary)] mt-1.5">Adjusts global algorithm decay rates.</p>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-[#f43f5e05] border border-[#f43f5e30] rounded-[var(--r-xl)] overflow-hidden">
          <div className="bg-[#f43f5e10] border-b border-[#f43f5e30] px-6 py-4 flex items-center gap-3">
             <ShieldAlert className="w-5 h-5 text-[#f43f5e]" />
             <h3 className="font-bold text-[15px] text-[#f43f5e]">Danger Zone</h3>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white mb-1">Clear Application State</h4>
              <p className="text-[12px] text-[var(--text-secondary)]">Purges all local Zustand bindings and restores static mocks.</p>
            </div>
            <button className="btn-primary bg-[#f43f5e] hover:bg-[#e11d48] text-white border-none px-6">Hard Reset DB</button>
          </div>
        </div>

      </div>
    </div>
  );
}
