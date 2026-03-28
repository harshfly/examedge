'use client';

import { useEffect } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';

export default function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const fetchInitialData = useDataStore(state => state.fetchInitialData);
  const { user, login } = useAppStore();
  const supabase = createClient();

  useEffect(() => {
    const syncSession = async () => {
      // 1. Initial global data fetch
      fetchInitialData();

      // 2. Sync user session if not already in store
      if (!user) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session?.user) {
          // 3. Robust Profile Fetch or Fallback Create
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // If profile is missing but user is authenticated, create a default one
          if (!profile || profileError) {
            const { data: createdProfile } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                role: session.user.user_metadata?.role || 'student',
                year: session.user.user_metadata?.year || 3,
                semester: session.user.user_metadata?.semester || 6,
                streak: 1,
                last_active_at: new Date().toISOString()
              })
              .select()
              .single();
            profile = createdProfile;
          }

          if (profile) {
            login({
              id: session.user.id,
              name: profile.full_name,
              role: profile.role as 'student' | 'admin',
              selectedYear: profile.year,
              selectedSem: profile.semester,
              streak: profile.streak || 1,
              lastActiveAt: profile.last_active_at
            });
          }
        }
      }
    };

    syncSession();
  }, [fetchInitialData, user, login, supabase]);

  return <>{children}</>;
}
