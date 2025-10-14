import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
    id: number;
    email: string;
    username: string;
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: 'user', // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist the user
    }
  )
)