import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useRemoveResident } from './useResidents'
import { RESIDENT_COPY } from './constants'
import type { Resident } from './resident.types'

interface RemoveResidentDialogProps {
  resident: Resident | null
  onClose: () => void
}

export function RemoveResidentDialog({ resident, onClose }: RemoveResidentDialogProps) {
  const { mutate: remove, isPending } = useRemoveResident()

  if (!resident) return null

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={RESIDENT_COPY.REMOVE_DIALOG_TITLE}
      description={RESIDENT_COPY.REMOVE_DIALOG_DESC}
      confirmLabel={RESIDENT_COPY.REMOVE_CONFIRM_LABEL}
      variant="destructive"
      isLoading={isPending}
      onConfirm={() => {
        remove(resident.id, { onSuccess: onClose })
      }}
    />
  )
}
