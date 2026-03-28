import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  selectedYear: number | null;
  selectedSem: number | null;
  streak: number;
  lastActiveAt: string;
}

interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  isAuthHydrated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateStreak: (streak: number) => void;
  setSemesterContext: (year: number, sem: number) => void;
  setHydrated: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'dark',
      isAuthHydrated: false,
      
      login: (userData) => set({ 
        user: userData 
      }),
      
      logout: () => set({ user: null }),

      updateStreak: (streak) => set((state) => ({
        user: state.user ? { ...state.user, streak } : null
      })),
      
      setSemesterContext: (year, sem) => set((state) => ({
        user: state.user ? { ...state.user, selectedYear: year, selectedSem: sem } : null
      })),

      setHydrated: () => set({ isAuthHydrated: true })
    }),
    {
      name: 'examedge-auth-store',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      }
    }
  )
);
