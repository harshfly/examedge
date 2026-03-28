'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Verify admin role via profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profile?.role === 'admin') {
        toast.success("Welcome back, Master Admin.");
        router.push('/admin');
      } else {
        await supabase.auth.signOut();
        toast.error("Unauthorized: You do not hold Administrator privileges.");
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="w-full max-w-[400px] bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8 shadow-[var(--shadow-lg)] relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
            <span className="font-['Syne'] font-extrabold text-[22px] tracking-tight text-white">ExamEdge</span>
          </div>
          <p className="text-[14px] text-[#f43f5e] tracking-[0.1em] uppercase font-bold">Core Admin Interface</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input 
              type="email" 
              placeholder="Admin Email Address" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Admin Password" 
              className="input-field pr-10" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--text-muted)] hover:text-white transition-colors"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 text-[15px] font-['Syne'] bg-[#f43f5e] hover:bg-[#e11d48] text-white">
            {loading ? "Authenticating..." : "🔐 Authorize Access"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-[12px] text-[var(--text-muted)]">
          System recorded IP for security purposes.
        </div>
      </div>
    </div>
  );
}
