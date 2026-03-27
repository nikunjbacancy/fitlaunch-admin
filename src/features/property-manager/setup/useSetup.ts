import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/store/auth.store'
import { setupService } from './setupService'
import { SETUP_COPY } from './setup.constants'
import type { TBrandingPayload, TAddUnitPayload } from './setup.types'

export function useUpdateBranding() {
  return useMutation({
    mutationFn: ({ tenantId, payload }: { tenantId: string; payload: TBrandingPayload }) =>
      setupService.updateBranding(tenantId, payload),
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useAddUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tenantId, payload }: { tenantId: string; payload: TAddUnitPayload }) =>
      setupService.addUnit(tenantId, payload),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['units', tenantId] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useBulkImportUnits() {
  return useMutation({
    mutationFn: ({ tenantId, file }: { tenantId: string; file: File }) =>
      setupService.bulkImportUnits(tenantId, file),
    onSuccess: () => {
      toast.success(SETUP_COPY.UNITS_SUCCESS)
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useCompleteOnboarding() {
  const setTenantOnboardingStep = useAuthStore((s) => s.setTenantOnboardingStep)
  return useMutation({
    mutationFn: (tenantId: string) => setupService.completeOnboarding(tenantId),
    onSuccess: () => {
      setTenantOnboardingStep('active')
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
