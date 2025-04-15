import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  expiresIn: number | null
  setAuth: (token: string, expires: number) => void
  clearAuth: () => void
}

type ThemeState = {
  darkMode: boolean
  toggleTheme: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresIn: null,
      setAuth: (token, expires) => set({ accessToken: token, expiresIn: expires }),
      clearAuth: () => set({ accessToken: null, expiresIn: null }),
    }),
    { name: 'auth-storage' }
  )
)

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: 'theme-storage' }
  )
)