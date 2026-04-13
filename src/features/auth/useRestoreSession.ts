import { useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { logger } from '@/lib/logger'
import type { ApiLoginResponse, AuthUser } from '@/types/auth.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

// POST /auth/refresh now returns the same shape as POST /auth/admin/login,
// so we can hydrate user + tenant straight from the response and avoid
// decoding tenant_id from the JWT (which was brittle).
export function useRestoreSession(): void {
  const setUser = useAuthStore((s) => s.setUser)
  const setSessionRestored = useAuthStore((s) => s.setSessionRestored)
  const setTenantOnboardingStep = useAuthStore((s) => s.setTenantOnboardingStep)
  const setOwnerManagedTenant = useAuthStore((s) => s.setOwnerManagedTenant)

  useEffect(() => {
    const restore = async (): Promise<void> => {
      try {
        logger.info('Attempting session restore via refresh token\u2026')
        const response = await axios.post<ApiLoginResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const { data } = response.data
        const apiUser = data.user

        const user: AuthUser = {
          id: apiUser.id,
          email: apiUser.email,
          fullName: apiUser.full_name,
          role: apiUser.role,
          // Prefer tenant.id when present — user.tenant_id may drift.
          tenantId: data.tenant?.id ?? apiUser.tenant_id,
          tenantName: data.tenant?.name ?? null,
          tenantType:
            apiUser.role === 'property_manager' || apiUser.role === 'property_owner'
              ? 'apartment'
              : apiUser.role === 'trainer'
                ? 'trainer'
                : null,
          ownerGroupId: data.tenant?.owner_group_id ?? apiUser.owner_group_id ?? null,
          isTwoFactorVerified: false,
        }

        setUser(user, data.access_token, true)

        if (data.tenant) {
          setTenantOnboardingStep(data.tenant.onboarding_step)
          setOwnerManagedTenant(data.tenant.owner_group_id !== null)
        }

        logger.info('Session restored for:', user.email)
      } catch {
        logger.info('No active session \u2014 user must log in')
      } finally {
        setSessionRestored()
      }
    }

    void restore()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
