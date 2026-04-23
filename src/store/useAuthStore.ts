import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  role: 'admin' | 'vendedor';
}

interface AuthState {
  user: User | null;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (username, password) => {
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          if (res.ok) {
            const userData = await res.json();
            set({ user: userData }); // Guardamos el usuario de la DB
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error en login:", error);
          return false;
        }
      },
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
);
