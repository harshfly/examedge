'use client';

import { useEffect } from 'react';
import { useDataStore } from '@/store/useDataStore';

export default function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const fetchInitialData = useDataStore(state => state.fetchInitialData);
  const isSynced = useDataStore(state => state.isSynced);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Optionally show a loading state while the first sync happens
  // if (!isSynced) return <div className="fixed inset-0 bg-[#09090b] flex items-center justify-center z-[9999]">...</div>;

  return <>{children}</>;
}
