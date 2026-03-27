import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { inviteService } from './inviteService'
import type { TInviteAcceptPayload } from './invite.types'
import type { AuthUser } from '@/types/auth.types'

export function useValidateInviteToken(token: string | null) {
  return useQuery({
    queryKey: ['invite', token],
    queryFn: () => inviteService.validateToken(token ?? ''),
    enabled: token !== null,
    staleTime: Infinity,
    retry: false,
  })
}

export function useAcceptInvite() {
  const setUser = useAuthStore((s) => s.setUser)
  const setTenantOnboardingStep = useAuthStore((s) => s.setTenantOnboardingStep)

  return useMutation({
    mutationFn: (payload: TInviteAcceptPayload) => inviteService.acceptInvite(payload),
    onSuccess: (data) => {
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.full_name,
        role: data.user.role,
        tenantId: data.user.tenant_id,
        tenantName: data.tenant.name,
        tenantType: 'apartment',
        isTwoFactorVerified: true,
      }
      // isTwoFactorVerified = true so ProtectedRoute lets the PM through immediately
      setUser(authUser, data.access_token, true)
      setTenantOnboardingStep(data.tenant.onboarding_step)
    },
  })
}
