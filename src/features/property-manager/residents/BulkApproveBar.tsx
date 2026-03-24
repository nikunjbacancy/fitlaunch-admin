import { CheckCheck, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBulkApproveResidents } from './useResidents'
import { RESIDENT_COPY } from './constants'

interface BulkApproveBarProps {
  selectedIds: string[]
  onClear: () => void
}

export function BulkApproveBar({ selectedIds, onClear }: BulkApproveBarProps) {
  const { mutate: bulkApprove, isPending } = useBulkApproveResidents()

  if (selectedIds.length === 0) return null

  const handleApprove = () => {
    bulkApprove(selectedIds, { onSuccess: onClear })
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-lg shadow-black/10">
        <span className="text-sm font-medium text-foreground">
          {selectedIds.length} resident{selectedIds.length === 1 ? '' : 's'} selected
        </span>
        <div className="h-4 w-px bg-border" />
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isPending}
          onClick={handleApprove}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCheck className="mr-2 h-3.5 w-3.5" />
          )}
          {RESIDENT_COPY.BULK_APPROVE_LABEL}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label={RESIDENT_COPY.BULK_CLEAR_LABEL}
          disabled={isPending}
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
