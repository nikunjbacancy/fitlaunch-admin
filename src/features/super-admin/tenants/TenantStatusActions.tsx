import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'
import { useTenantActions } from './useTenantActions'
import { TENANT_COPY } from './constants'
import type { TenantStatus } from './tenant.types'

const suspendSchema = z.object({
  reason: z.string().min(10, TENANT_COPY.SUSPEND_REASON_ERROR),
})
type SuspendFormValues = z.infer<typeof suspendSchema>

interface TenantStatusActionsProps {
  tenantId: string
  currentStatus: TenantStatus
}

export function TenantStatusActions({ tenantId, currentStatus }: TenantStatusActionsProps) {
  const { can } = usePermissions()
  const { approveMutation, suspendMutation, reactivateMutation } = useTenantActions(tenantId)

  const [approveOpen, setApproveOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [reactivateOpen, setReactivateOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuspendFormValues>({ resolver: zodResolver(suspendSchema) })

  const handleSuspendSubmit = (values: SuspendFormValues) => {
    suspendMutation.mutate(values, {
      onSuccess: () => {
        setSuspendOpen(false)
        reset()
      },
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {can('approve_tenant') && currentStatus === 'pending' && (
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setApproveOpen(true)
          }}
        >
          {TENANT_COPY.APPROVE_LABEL}
        </Button>
      )}

      {can('suspend_tenant') && currentStatus === 'active' && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            setSuspendOpen(true)
          }}
        >
          {TENANT_COPY.SUSPEND_LABEL}
        </Button>
      )}

      {can('reactivate_tenant') && currentStatus === 'suspended' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setReactivateOpen(true)
          }}
        >
          {TENANT_COPY.REACTIVATE_LABEL}
        </Button>
      )}

      {/* Approve confirm */}
      <ConfirmDialog
        open={approveOpen}
        onOpenChange={(open) => {
          setApproveOpen(open)
        }}
        title={TENANT_COPY.APPROVE_TITLE}
        description={TENANT_COPY.APPROVE_DESCRIPTION}
        confirmLabel={TENANT_COPY.APPROVE_LABEL}
        variant="default"
        isLoading={approveMutation.isPending}
        onConfirm={() => {
          approveMutation.mutate(undefined, {
            onSuccess: () => {
              setApproveOpen(false)
            },
          })
        }}
      />

      {/* Suspend — collects reason via dialog */}
      <Dialog
        open={suspendOpen}
        onOpenChange={(open: boolean) => {
          setSuspendOpen(open)
          if (!open) {
            reset()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{TENANT_COPY.SUSPEND_TITLE}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              void handleSubmit(handleSuspendSubmit)(e)
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="reason">{TENANT_COPY.SUSPEND_REASON_LABEL}</Label>
              <Textarea
                id="reason"
                placeholder={TENANT_COPY.SUSPEND_REASON_PLACEHOLDER}
                rows={3}
                {...register('reason')}
              />
              {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSuspendOpen(false)
                }}
                disabled={suspendMutation.isPending}
              >
                {TENANT_COPY.CANCEL_LABEL}
              </Button>
              <Button type="submit" variant="destructive" disabled={suspendMutation.isPending}>
                {suspendMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {TENANT_COPY.SUSPEND_LABEL}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reactivate confirm */}
      <ConfirmDialog
        open={reactivateOpen}
        onOpenChange={(open) => {
          setReactivateOpen(open)
        }}
        title={TENANT_COPY.REACTIVATE_TITLE}
        description={TENANT_COPY.REACTIVATE_DESCRIPTION}
        confirmLabel={TENANT_COPY.REACTIVATE_LABEL}
        variant="default"
        isLoading={reactivateMutation.isPending}
        onConfirm={() => {
          reactivateMutation.mutate(undefined, {
            onSuccess: () => {
              setReactivateOpen(false)
            },
          })
        }}
      />
    </div>
  )
}
