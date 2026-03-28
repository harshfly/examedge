'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    year: '3',
    semester: '6'
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Account request sent! Please wait for admin approval.');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="w-full max-w-[450px] bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 shadow-[var(--shadow-lg)] relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
            <span className="font-['Syne'] font-extrabold text-[22px] tracking-tight text-white">Join ExamEdge</span>
          </div>
          <p className="text-[14px] text-[var(--text-secondary)]">SVIIT B.Tech Student Registration</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="input-field flex-1" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <input 
            type="email" 
            placeholder="Official @sviit.edu.in Email" 
            className="input-field" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <input 
            type="password" 
            placeholder="Choose Password" 
            className="input-field" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
          
          <div className="grid grid-cols-2 gap-4 mt-2">
             <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">YEAR</label>
                <select 
                  className="input-field py-2 text-[13px] bg-[var(--bg-elevated)]"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                >
                  <option value="1">I Year</option>
                  <option value="2">II Year</option>
                  <option value="3">III Year</option>
                  <option value="4">IV Year</option>
                </select>
             </div>
             <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold mb-1 block">CURRENT SEM</label>
                <select 
                  className="input-field py-2 text-[13px] bg-[var(--bg-elevated)]"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                >
                  <option value="1">SEM 1</option>
                  <option value="2">SEM 2</option>
                  <option value="3">SEM 3</option>
                  <option value="4">SEM 4</option>
                  <option value="5">SEM 5</option>
                  <option value="6">SEM 6</option>
                  <option value="7">SEM 7</option>
                  <option value="8">SEM 8</option>
                </select>
             </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-4 py-4 text-[15px] font-['Syne']">
            Create Student Profile
          </button>
        </form>

        <div className="mt-8 text-center text-[12px] text-[var(--text-muted)] pt-6 border-t border-[rgba(255,255,255,0.05)]">
          Already have an account? <Link href="/login" className="text-[var(--accent)] font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
