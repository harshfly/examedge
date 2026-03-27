'use client';

import { Save, ShieldAlert, Monitor, Keyboard, Database } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h1 mb-1">Platform Settings</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Configure global variables, theme engines, and access scopes.</p>
        </div>
        <button className="btn-success flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="space-y-6">
        
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
              <label className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] mb-2 block">SUPERMEMO INTERVAL MULTIPLIER</label>
              <input type="number" step="0.1" className="input-field" defaultValue="2.5" />
              <p className="text-[12px] text-[var(--text-secondary)] mt-1.5">Adjusts global algorithm decay rates.</p>
            </div>
          </div>
        </div>

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
