import { useState } from 'react'
import { X, Link2 } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { TENANT_COPY } from './constants'
import { useOwnerGroups, useAssignLocationToOwner } from './useTenantActions'

interface AssignOwnerGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  tenantName: string
}

export function AssignOwnerGroupModal({
  open,
  onOpenChange,
  tenantId,
  tenantName,
}: AssignOwnerGroupModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { data: ownerGroups } = useOwnerGroups(open)
  const assignLocation = useAssignLocationToOwner(() => {
    setSelectedGroupId('')
    onOpenChange(false)
  })

  const handleSubmit = () => {
    if (!selectedGroupId) return
    setSubmitError(null)
    assignLocation.mutate(
      { groupId: selectedGroupId, payload: { tenant_id: tenantId } },
      {
        onError: (err) => {
          setSubmitError(getErrorMessage(err))
        },
      }
    )
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelectedGroupId('')
      setSubmitError(null)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-md [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <Link2 className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">
                {TENANT_COPY.ASSIGN_LOCATION_TITLE}
              </h2>
              <p className="text-xs text-kmvmt-navy/50">
                {TENANT_COPY.ASSIGN_LOCATION_DESCRIPTION}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              handleOpenChange(false)
            }}
            className="mt-0.5 rounded-md p-1 text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div className="rounded-md border border-zinc-200 bg-kmvmt-bg px-4 py-3">
            <p className="text-xs text-kmvmt-navy/50">Location</p>
            <p className="text-sm font-medium text-kmvmt-navy">{tenantName}</p>
          </div>

          <div>
            <Label className="mb-2 block text-xs font-medium text-kmvmt-navy">
              {TENANT_COPY.ASSIGN_LOCATION_SELECT}
            </Label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy focus:ring-kmvmt-navy">
                <SelectValue placeholder="Select an owner group…" />
              </SelectTrigger>
              <SelectContent>
                {(ownerGroups ?? []).map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.location_count} locations)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {submitError && (
          <div className="mx-6 mb-4 rounded-md border border-kmvmt-red-light bg-kmvmt-red-light/10 px-3 py-2.5">
            <p className="text-xs text-kmvmt-red-dark">{submitError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2.5 border-t border-zinc-200 bg-kmvmt-bg px-6 py-4">
          <Button
            type="button"
            className="flex-1 border border-zinc-300 bg-kmvmt-white text-sm text-kmvmt-navy hover:bg-kmvmt-bg"
            onClick={() => {
              handleOpenChange(false)
            }}
          >
            {TENANT_COPY.CANCEL_LABEL}
          </Button>
          <Button
            className="flex-1 bg-kmvmt-navy text-sm text-white hover:bg-kmvmt-blue-light/80"
            disabled={!selectedGroupId || assignLocation.isPending}
            onClick={handleSubmit}
          >
            {assignLocation.isPending ? 'Assigning…' : TENANT_COPY.ASSIGN_LOCATION_SUBMIT}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
