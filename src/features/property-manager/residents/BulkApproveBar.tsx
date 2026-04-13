import { CheckCheck, Loader2, X } from 'lucide-react'
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
      <div className="flex items-center gap-3 rounded-2xl bg-kmvmt-white px-5 py-3 shadow-[0px_20px_60px_rgba(25,38,64,0.18)] ring-1 ring-kmvmt-navy/5">
        <span className="text-sm font-semibold text-kmvmt-navy">
          {selectedIds.length} resident{selectedIds.length === 1 ? '' : 's'} selected
        </span>
        <span className="h-5 w-px bg-kmvmt-bg" />
        <button
          type="button"
          disabled={isPending}
          onClick={handleApprove}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5" />
          )}
          {RESIDENT_COPY.BULK_APPROVE_LABEL}
        </button>
        <button
          type="button"
          aria-label={RESIDENT_COPY.BULK_CLEAR_LABEL}
          disabled={isPending}
          onClick={onClear}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
