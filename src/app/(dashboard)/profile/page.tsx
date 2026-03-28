'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useDataStore } from '@/store/useDataStore';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User as UserIcon, BookOpen, Award, Target, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  const topics = useDataStore(state => state.topics);
  const [email, setEmail] = useState('');
  
  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate local stats based on Zustand store
  const completedTopicsCount = Object.values(topics).filter(t => t.isCompleted).length;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Fetch actual email from Supabase to display
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setEmail(data.user.email || 'student@sviit.edu.in');
      });
    }
  }, [user, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      setNewPassword('');
      setIsChangingPassword(false);
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!user) return null; // Prevent flash

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-6 py-10 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[rgba(139,92,246,0.15)] flex items-center justify-center border border-[rgba(139,92,246,0.3)]">
            <UserIcon className="w-6 h-6 text-[#8b5cf6]" />
          </div>
          <div>
            <h1 className="h2 font-bold m-0 font-['Syne']">Student Profile</h1>
            <p className="text-[13px] text-[var(--text-muted)]">Manage your account and view study activity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 shadow-[var(--shadow-sm)] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 w-full h-24 bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-transparent border-b border-[var(--border)]"></div>
            
            <div className="relative z-10 flex flex-col items-center mt-6">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-elevated)] border-4 border-[var(--bg-base)] flex flex-col items-center justify-center shadow-xl mb-4">
                <span className="text-[32px] font-['Syne'] font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              
              <h2 className="text-[20px] font-bold text-white font-['Syne'] tracking-tight">{user.name}</h2>
              <p className="text-[13px] text-[var(--text-muted)] mt-1">{email}</p>
              
              <div className="flex items-center gap-2 mt-4 text-[12px] font-semibold">
                 <span className="bg-[rgba(16,185,129,0.1)] text-[#10b981] px-3 py-1 rounded-full border border-[rgba(16,185,129,0.2)]">Year {user.selectedYear || 3}</span>
                 <span className="bg-[rgba(56,189,248,0.1)] text-[#38bdf8] px-3 py-1 rounded-full border border-[rgba(56,189,248,0.2)]">Semester {user.selectedSem || 6}</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[var(--border)] my-6 relative z-10"></div>
            
            {/* Password Change Section */}
            <div className="w-full relative z-10 mb-4">
              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    className="input-field py-2 text-sm" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                    minLength={6}
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={isUpdating} className="btn-primary py-2 text-xs flex-1">
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setIsChangingPassword(false)} className="btn-ghost py-2 text-xs px-4">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full btn-ghost py-2.5 text-[13px] border border-transparent hover:border-[var(--border)]"
                >
                  Change Password
                </button>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              className="relative z-10 w-full btn-ghost py-3 text-[#f43f5e] hover:bg-[rgba(244,63,94,0.05)] border border-[rgba(244,63,94,0.1)] flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Stats & Activity */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <h3 className="font-['Syne'] text-[18px] font-bold text-white mb-[-8px]">Your Learning Journey</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-5 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[rgba(56,189,248,0.1)] text-[#38bdf8] flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-[28px] font-black font-['Syne'] text-white leading-none">{completedTopicsCount}</div>
                <div className="text-[12px] text-[var(--text-secondary)] mt-1 font-semibold">Topics Mastered</div>
              </div>
              
              <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-5 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[rgba(249,115,22,0.1)] text-[#f97316] flex items-center justify-center mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <div className="text-[28px] font-black font-['Syne'] text-white leading-none">0</div>
                <div className="text-[12px] text-[var(--text-secondary)] mt-1 font-semibold">Quizzes Passed</div>
              </div>

              <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-5 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[rgba(16,185,129,0.1)] text-[#10b981] flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-[28px] font-black font-['Syne'] text-white leading-none">0</div>
                <div className="text-[12px] text-[var(--text-secondary)] mt-1 font-semibold">Flashcard Decks</div>
              </div>

              <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-5 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[rgba(251,191,36,0.1)] text-[#fbbf24] flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-[28px] font-black font-['Syne'] text-white leading-none">Lv.1</div>
                <div className="text-[12px] text-[var(--text-secondary)] mt-1 font-semibold">Current Rank</div>
              </div>
            </div>

            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 shadow-[var(--shadow-sm)] flex-1 min-h-[200px]">
              <h3 className="font-['Syne'] text-[16px] font-bold text-white mb-4">Recent Activity</h3>
              
              {completedTopicsCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-[120px] text-center border border-dashed border-[var(--border)] rounded-[var(--r-lg)]">
                  <BookOpen className="w-8 h-8 text-[var(--border-hover)] mb-2" />
                  <p className="text-[13px] text-[var(--text-muted)]">No topics completed yet! Head to Study to begin.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.values(topics).filter(t => t.isCompleted).slice(0, 5).map(topic => (
                    <div key={topic.id} className="flex items-center gap-3 p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[#ffffff03] hover:border-[var(--border-hover)] transition-colors cursor-pointer" onClick={() => router.push(`/study/${topic.subjectId}/${topic.id}`)}>
                      <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                      <div className="flex-1">
                        <div className="text-[14px] font-semibold text-[var(--text-primary)]">{topic.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">{topic.id}</div>
                      </div>
                      <div className="text-[12px] font-semibold text-[#10b981] bg-[#10b98110] px-2 py-0.5 rounded border border-[#10b98130]">Completed</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
