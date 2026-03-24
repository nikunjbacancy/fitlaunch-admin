import { create } from 'zustand'
import type { AuthUser } from '@/types/auth.types'
import { setAccessToken } from '@/lib/axios'

interface AuthState {
  user: AuthUser | null
  isTwoFactorVerified: boolean
  isAuthenticated: boolean
  isRestoringSession: boolean

  // Actions
  setUser: (user: AuthUser, accessToken: string, twoFactorVerified?: boolean) => void
  setTwoFactorVerified: () => void
  setSessionRestored: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isTwoFactorVerified: false,
  isAuthenticated: false,
  isRestoringSession: true, // true until the first refresh attempt completes

  setUser: (user, accessToken, twoFactorVerified = false) => {
    setAccessToken(accessToken)
    set({
      user,
      isAuthenticated: true,
      isTwoFactorVerified: twoFactorVerified,
    })
  },

  setTwoFactorVerified: () => {
    set({ isTwoFactorVerified: true })
  },

  setSessionRestored: () => {
    set({ isRestoringSession: false })
  },

  logout: () => {
    setAccessToken(null)
    set({
      user: null,
      isAuthenticated: false,
      isTwoFactorVerified: false,
    })
  },
}))
