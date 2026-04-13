import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/store/auth.store'
import { unitService } from './unitService'
import { UNITS_COPY } from './constants'
import type { TAddUnitPayload, TEditUnitPayload } from './unit.types'

function useTenantId(): string | null {
  return useAuthStore((s) => s.user?.tenantId ?? null)
}

// Shared helper — unit create + bulk import both return an onboarding_step field
// that reflects auto-promotion (e.g. 'active' once branding and ≥1 unit exist).
// Pushing it into the auth store keeps the dashboard checklist banner in sync
// without a separate /auth/me refetch.
function useSyncOnboardingStep() {
  return useAuthStore((s) => s.setTenantOnboardingStep)
}

export function useUnitSummary() {
  const tenantId = useTenantId()
  return useQuery({
    queryKey: ['unit-summary', tenantId],
    queryFn: () => unitService.getSummary(tenantId ?? ''),
    staleTime: 30_000,
    enabled: Boolean(tenantId),
  })
}

export function useUnits() {
  const tenantId = useTenantId()
  return useQuery({
    queryKey: ['units', tenantId],
    queryFn: () => unitService.getAll(tenantId ?? ''),
    staleTime: 60_000,
    enabled: Boolean(tenantId),
  })
}

export function useAddUnit() {
  const tenantId = useTenantId()
  const queryClient = useQueryClient()
  const syncOnboardingStep = useSyncOnboardingStep()
  return useMutation({
    mutationFn: (payload: TAddUnitPayload) => {
      if (!tenantId) return Promise.reject(new Error('No tenant selected'))
      return unitService.add(tenantId, payload)
    },
    onSuccess: (unit) => {
      toast.success(UNITS_COPY.SUCCESS_ADDED)
      if (unit.onboarding_step) syncOnboardingStep(unit.onboarding_step)
      void queryClient.invalidateQueries({ queryKey: ['units', tenantId] })
      void queryClient.invalidateQueries({ queryKey: ['unit-summary', tenantId] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useEditUnit() {
  const tenantId = useTenantId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ unitId, payload }: { unitId: string; payload: TEditUnitPayload }) => {
      if (!tenantId) return Promise.reject(new Error('No tenant selected'))
      return unitService.update(tenantId, unitId, payload)
    },
    onSuccess: () => {
      toast.success(UNITS_COPY.SUCCESS_UPDATED)
      void queryClient.invalidateQueries({ queryKey: ['units', tenantId] })
      void queryClient.invalidateQueries({ queryKey: ['unit-summary', tenantId] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useRemoveUnit() {
  const tenantId = useTenantId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (unitId: string) => {
      if (!tenantId) return Promise.reject(new Error('No tenant selected'))
      return unitService.remove(tenantId, unitId)
    },
    onSuccess: () => {
      toast.success(UNITS_COPY.SUCCESS_REMOVED)
      void queryClient.invalidateQueries({ queryKey: ['units', tenantId] })
      void queryClient.invalidateQueries({ queryKey: ['unit-summary', tenantId] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useBulkImportUnits() {
  const tenantId = useTenantId()
  const queryClient = useQueryClient()
  const syncOnboardingStep = useSyncOnboardingStep()
  return useMutation({
    mutationFn: (file: File) => {
      if (!tenantId) return Promise.reject(new Error('No tenant selected'))
      return unitService.bulkImport(tenantId, file)
    },
    onSuccess: (result) => {
      toast.success(UNITS_COPY.SUCCESS_IMPORTED)
      if (result.onboarding_step) syncOnboardingStep(result.onboarding_step)
      void queryClient.invalidateQueries({ queryKey: ['units', tenantId] })
      void queryClient.invalidateQueries({ queryKey: ['unit-summary', tenantId] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
