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
        console.log("DataSyncProvider: No local user, validating Supabase session with getUser()...");
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authUser) {
          console.log("DataSyncProvider: Authenticated user found:", authUser.email);
          // 3. Robust Profile Fetch or Fallback Create
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileError) console.error("DataSyncProvider: Profile fetch error", profileError);

          // If profile is missing but user is authenticated, create a default one
          if (!profile || profileError) {
            console.log("DataSyncProvider: Profile missing, attempting auto-creation...");
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .upsert({
                id: authUser.id,
                full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                role: authUser.user_metadata?.role || 'student',
                year: authUser.user_metadata?.year || 3,
                semester: authUser.user_metadata?.semester || 6,
                streak: 1,
                last_active_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (createError) console.error("DataSyncProvider: Profile creation failed", createError);
            profile = createdProfile;
          }

          if (profile) {
            const displayName = profile.full_name || authUser.email?.split('@')[0] || 'Student';
            console.log("DataSyncProvider: Syncing user to store:", displayName);
            login({
              id: authUser.id,
              name: displayName,
              role: profile.role as 'student' | 'admin',
              selectedYear: profile.year,
              selectedSem: profile.semester,
              streak: profile.streak || 1,
              lastActiveAt: profile.last_active_at
            });
          }
        } else {
          console.log("DataSyncProvider: No Supabase session found.");
        }
      }
    };

    syncSession();
  }, [fetchInitialData, user, login, supabase]);

  return <>{children}</>;
}
