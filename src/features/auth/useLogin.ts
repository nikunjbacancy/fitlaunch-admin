import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { authService } from './authService'
import type { LoginPayload, UserRole } from '@/types/auth.types'

const ROLE_REDIRECT: Record<UserRole, string> = {
  super_admin: '/super-admin',
  property_owner: '/property-owner',
  property_manager: '/dashboard',
  trainer: '/trainer',
}

export function useLogin() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const setTenantOnboardingStep = useAuthStore((s) => s.setTenantOnboardingStep)
  const setOwnerManagedTenant = useAuthStore((s) => s.setOwnerManagedTenant)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      // Pass true so isTwoFactorVerified is set atomically in one Zustand update,
      // avoiding a race where ProtectedRoute renders between setUser and setTwoFactorVerified.
      setUser(data.user, data.accessToken, true)

      // Hydrate tenant onboarding state from login response (tenant is null for super_admin).
      // Avoids a separate fetch and keeps the dashboard checklist banner accurate on first render.
      if (data.tenant) {
        setTenantOnboardingStep(data.tenant.onboarding_step)
        setOwnerManagedTenant(data.tenant.owner_group_id !== null)
      }

      void navigate(ROLE_REDIRECT[data.user.role])
    },
  })
}
