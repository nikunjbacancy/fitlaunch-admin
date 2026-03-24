import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { tenantService } from './tenantService'
import type { SuspendTenantPayload } from './tenant.types'

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
