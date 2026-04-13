import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth.store'
import { getErrorMessage } from '@/lib/errors'
import { brandingService } from './brandingService'
import { BRANDING_COPY } from './constants'
import type { TBrandingPayload, TBrandingResponse } from './branding.types'

// Wraps GET /tenants/:id/branding. Always returns 200 — unbranded tenants get
// DB defaults (#000000/#FFFFFF) and logo_url=null, which the form treats as
// "not yet configured" and replaces with friendlier placeholder defaults.
export function useBrandingQuery(): UseQueryResult<TBrandingResponse> {
  const tenantId = useAuthStore((s) => s.user?.tenantId ?? null)
  return useQuery({
    queryKey: ['branding', tenantId],
    queryFn: () => brandingService.getBranding(tenantId ?? ''),
    enabled: Boolean(tenantId),
    staleTime: 60_000,
  })
}

// Wraps PATCH /tenants/:id/branding.
// On success: syncs tenantOnboardingStep (backend auto-promotes to
// 'branding_complete' or 'active' once units also exist), so the dashboard
// checklist banner updates without a separate refetch.
export function useUpdateBranding(): UseMutationResult<TBrandingResponse, Error, TBrandingPayload> {
  const queryClient = useQueryClient()
  const tenantId = useAuthStore((s) => s.user?.tenantId ?? null)
  const setTenantOnboardingStep = useAuthStore((s) => s.setTenantOnboardingStep)

  return useMutation({
    mutationFn: (payload: TBrandingPayload) => {
      if (!tenantId) return Promise.reject(new Error('No tenant selected'))
      return brandingService.updateBranding(tenantId, payload)
    },
    onSuccess: (data) => {
      setTenantOnboardingStep(data.onboarding_step)
      // Write the server-echoed values straight into the query cache so the
      // form stays in sync without a refetch round-trip.
      queryClient.setQueryData<TBrandingResponse>(['branding', tenantId], data)
      toast.success(BRANDING_COPY.SUCCESS)
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
