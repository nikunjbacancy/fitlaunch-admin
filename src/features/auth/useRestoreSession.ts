import { useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { jwtToAuthUser } from '@/lib/jwt'
import { logger } from '@/lib/logger'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export function useRestoreSession(): void {
  const { setUser, setSessionRestored } = useAuthStore()

  useEffect(() => {
    const restore = async () => {
      try {
        logger.info('Attempting session restore via refresh token…')
        const response = await axios.post<{ success: boolean; data: { access_token: string } }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const token = response.data.data.access_token
        const user = jwtToAuthUser(token)

        if (user) {
          setUser(user, token, true)
          logger.info('Session restored for:', user.email)
        } else {
          logger.warn('Session restore: could not decode user from token')
        }
      } catch {
        logger.info('No active session — user must log in')
      } finally {
        setSessionRestored()
      }
    }

    void restore()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
