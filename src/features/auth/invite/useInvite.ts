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
  const setOwnerManagedTenant = useAuthStore((s) => s.setOwnerManagedTenant)

  return useMutation({
    mutationFn: (payload: TInviteAcceptPayload) => inviteService.acceptInvite(payload),
    onSuccess: (data) => {
      const isOwner = data.user.role === 'property_owner'
      const isOwnerManagedPm =
        data.user.role === 'property_manager' && Boolean(data.tenant?.owner_group_id)

      // Property Owner or owner-managed PM: do NOT auto-login
      // They must go through the normal login flow (with 2FA at login time)
      if (isOwner || isOwnerManagedPm) {
        setOwnerManagedTenant(isOwnerManagedPm)
        return
      }

      // Standalone PM (SA-created): auto-login and redirect to setup wizard
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.full_name,
        role: data.user.role,
        tenantId: data.user.tenant_id,
        tenantName: data.tenant?.name ?? null,
        tenantType: 'apartment',
        ownerGroupId: data.user.owner_group_id ?? null,
        isTwoFactorVerified: true,
      }

      setUser(authUser, data.access_token, true)
      setTenantOnboardingStep(data.tenant?.onboarding_step ?? 'password_set')
    },
  })
}
