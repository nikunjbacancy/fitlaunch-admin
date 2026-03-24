import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { setAccessToken } from '@/lib/axios'
import { authService } from './authService'
import type { TwoFactorPayload } from '@/types/auth.types'

export function useTwoFactor() {
  const navigate = useNavigate()
  const setTwoFactorVerified = useAuthStore((s) => s.setTwoFactorVerified)

  return useMutation({
    mutationFn: (payload: TwoFactorPayload) => authService.verifyTwoFactor(payload),
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      setTwoFactorVerified()
      void navigate('/')
    },
  })
}
