import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useDataStore } from '@/store/useDataStore';
import { createClient } from '@/lib/supabase/client';

export function useHydrateProgress() {
  const user = useAppStore(state => state.user);

  useEffect(() => {
    if (user) {
      const hydrate = async () => {
        const supabase = createClient();
        
        // RLS prevents users from seeing other users' data, 
        // but we still filter by completed to save memory
        const { data, error } = await supabase
          .from('user_progress')
          .select('topic_id, completed')
          .eq('completed', true);
          
        if (data && !error) {
          const { topics, saveTopic } = useDataStore.getState();
          data.forEach(row => {
            const t = topics[row.topic_id];
            if (t && !t.isCompleted) {
              saveTopic(row.topic_id, { ...t, isCompleted: true });
            }
          });
        }
      };
      hydrate();
    }
  }, [user]);
}
