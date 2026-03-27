'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore(state => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mocking authentication check
    if (email && password) {
      login({ name: email.split('@')[0], role: 'student', selectedYear: null, selectedSem: null });
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="w-full max-w-[400px] bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 shadow-[var(--shadow-lg)] relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
            <span className="font-['Syne'] font-extrabold text-[22px] tracking-tight text-white">ExamEdge</span>
          </div>
          <p className="text-[14px] text-[var(--text-secondary)]">Student Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input 
              type="email" 
              placeholder="Email ending in @sviit.edu.in" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-2 text-[15px] font-['Syne']">
            Sign In to ExamEdge
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3 pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <div className="text-[12px] text-[var(--text-muted)]">
            Don't have an account? <span className="text-[var(--accent)] cursor-pointer hover:underline">Student Signup</span>
          </div>
          <button onClick={() => router.push('/admin/login')} className="text-[11px] font-bold text-[#f43f5e] hover:text-[#e11d48] uppercase tracking-wider bg-[rgba(244,63,94,0.1)] px-3 py-1.5 rounded-full transition-colors">
             Enter Core Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
