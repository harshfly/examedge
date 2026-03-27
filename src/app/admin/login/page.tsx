'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Note: Form uses client-side SHA-256 validation simulation based on requirements
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'SVIIT-ADMIN-01' && password === 'Godmode@2026') {
      sessionStorage.setItem('adminToken', 'validated-mock-token');
      router.push('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 shadow-[var(--shadow-lg)] relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
            <span className="font-['Syne'] font-extrabold text-[22px] tracking-tight">ExamEdge</span>
          </div>
          <p className="text-[14px] text-[var(--accent)] tracking-[0.1em] uppercase font-bold">Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input 
              type="text" 
              placeholder="Username (Try: SVIIT-ADMIN-01)" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              className="input-field pr-10" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          
          <button type="submit" className="btn-primary w-full mt-2 text-[15px] font-['Syne']">
            🔐 Login to Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
