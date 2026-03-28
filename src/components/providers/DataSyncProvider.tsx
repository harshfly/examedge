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
      // 1. If we have no local user, check Supabase session
      if (!user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // 2. Fetch profile to get role and streak
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            login({
              id: session.user.id,
              name: profile.full_name || session.user.email?.split('@')[0] || 'User',
              role: profile.role as 'student' | 'admin',
              selectedYear: profile.year,
              selectedSem: profile.semester,
              streak: profile.streak || 1,
              lastActiveAt: profile.last_active_at
            });
          }
        }
      }

      // 3. Fetch global app data (subjects, topics, etc.)
      fetchInitialData();
    };

    syncSession();
  }, [fetchInitialData, user, login, supabase]);

  return <>{children}</>;
}
