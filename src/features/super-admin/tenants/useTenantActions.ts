import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { tenantService } from './tenantService'
import { TENANT_COPY } from './constants'
import type {
  SuspendTenantPayload,
  TCreateComplexPayload,
  TUpdateComplexPayload,
  TCreateOwnerGroupPayload,
  TAssignLocationPayload,
} from './tenant.types'

export function useTenantActions(tenantId: string) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['tenants'] })
    void queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] })
  }

  const approveMutation = useMutation({
    mutationFn: () => tenantService.approve(tenantId),
    onSuccess: () => {
      toast.success('Tenant approved successfully')
      invalidate()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const suspendMutation = useMutation({
    mutationFn: (payload: SuspendTenantPayload) => tenantService.suspend(tenantId, payload),
    onSuccess: () => {
      toast.success('Tenant suspended')
      invalidate()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const reactivateMutation = useMutation({
    mutationFn: () => tenantService.reactivate(tenantId),
    onSuccess: () => {
      toast.success('Tenant reactivated successfully')
      invalidate()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  return { approveMutation, suspendMutation, reactivateMutation }
}

export function useCreateComplex() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateComplexPayload) => tenantService.createApartmentComplex(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useUpdateComplex() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TUpdateComplexPayload }) =>
      tenantService.updateComplex(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['tenants'] })
      void queryClient.invalidateQueries({ queryKey: ['tenant', id] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useResendInvite() {
  return useMutation({
    mutationFn: (id: string) => tenantService.resendInvite(id),
    onSuccess: () => {
      toast.success(TENANT_COPY.RESEND_INVITE_SUCCESS_GENERIC)
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

// ── Owner Group Actions ─────────────────────────────────────────────────────

export function useOwnerGroups(enabled = true) {
  return useQuery({
    queryKey: ['owner-groups'],
    queryFn: () => tenantService.getOwnerGroups(),
    staleTime: 60_000,
    enabled,
  })
}

export function useCreateOwnerGroup(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateOwnerGroupPayload) => tenantService.createOwnerGroup(payload),
    onSuccess: () => {
      toast.success(TENANT_COPY.OWNER_GROUP_SUCCESS)
      void queryClient.invalidateQueries({ queryKey: ['owner-groups'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useAssignLocationToOwner(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: TAssignLocationPayload }) =>
      tenantService.assignLocationToOwner(groupId, payload),
    onSuccess: () => {
      toast.success(TENANT_COPY.ASSIGN_LOCATION_SUCCESS)
      void queryClient.invalidateQueries({ queryKey: ['tenants'] })
      void queryClient.invalidateQueries({ queryKey: ['owner-groups'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useRemoveLocationFromOwner() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ groupId, locationId }: { groupId: string; locationId: string }) =>
      tenantService.removeLocationFromOwner(groupId, locationId),
    onSuccess: () => {
      toast.success(TENANT_COPY.UNASSIGN_LOCATION_SUCCESS)
      void queryClient.invalidateQueries({ queryKey: ['tenants'] })
      void queryClient.invalidateQueries({ queryKey: ['owner-groups'] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
