'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore(state => state.login);
  const supabase = createClient();
  const isConfigured = isSupabaseConfigured();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [year, setYear] = useState('3'); // Default to year 3
  const [semester, setSemester] = useState('6'); // Default to sem 6
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              year: parseInt(year),
              semester: parseInt(semester)
            }
          }
        });
        if (error) throw error;
        
        // Auto-login locally after signup
        login({ 
          id: data.user!.id,
          name: fullName || email.split('@')[0], 
          role: 'student', 
          selectedYear: parseInt(year) || 3, 
          selectedSem: parseInt(semester) || 6,
          streak: 1,
          lastActiveAt: new Date().toISOString()
        });

        toast.success("Account created! Automatically logging you in.");
        router.push('/dashboard');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // On success, try parsing user metadata if present
        const meta = data.user?.user_metadata || {};
        const lastActive = meta.last_active_at ? new Date(meta.last_active_at) : null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let nextStreak = meta.streak || 1;
        
        if (lastActive) {
          const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
          const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            nextStreak += 1; // Consecutive day
          } else if (diffDays > 1) {
            nextStreak = 1; // Streak broken
          }
          // if diffDays === 0, it's the same day, streak stays same
        }

        // Update profile in Supabase to persist the streak
        await supabase.from('profiles').update({ 
          streak: nextStreak, 
          last_active_at: now.toISOString() 
        }).eq('id', data.user!.id);

        login({ 
          id: data.user!.id,
          name: meta.full_name || email.split('@')[0], 
          role: 'student', 
          selectedYear: meta.year || 3, 
          selectedSem: meta.semester || 6,
          streak: nextStreak,
          lastActiveAt: now.toISOString()
        });
        
        toast.success("Logged in successfully!");
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
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

        {!isConfigured && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-[12px] font-bold">!</span>
              </div>
              <div>
                <h4 className="text-rose-500 text-[13px] font-bold mb-1">Configuration Required</h4>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Supabase environment variables are missing. Please add <code className="text-rose-400 bg-rose-400/10 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-rose-400 bg-rose-400/10 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your Vercel project settings and redeploy.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {isRegistering && (
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="input-field" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
          )}
          <div>
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password (min 6 chars)" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required 
            />
          </div>

          {isRegistering && (
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5 block ml-1">Year</label>
                <select 
                  className="input-field" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5 block ml-1">Semester</label>
                <select 
                  className="input-field" 
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  {Array.from({length: 8}, (_, i) => i + 1).map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          <button type="submit" disabled={loading} className="btn-primary w-full mt-3 text-[15px] font-['Syne']">
            {loading ? "Please wait..." : (isRegistering ? "Create Account" : "Sign In to ExamEdge")}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3 pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <div className="text-[12px] text-[var(--text-muted)]">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <span 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[var(--accent)] cursor-pointer hover:underline"
            >
              {isRegistering ? "Sign In" : "Student Signup"}
            </span>
          </div>
          <button onClick={() => router.push('/admin/login')} className="text-[11px] font-bold text-[#f43f5e] hover:text-[#e11d48] uppercase tracking-wider bg-[rgba(244,63,94,0.1)] px-3 py-1.5 rounded-full transition-colors mt-2">
             Enter Core Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
