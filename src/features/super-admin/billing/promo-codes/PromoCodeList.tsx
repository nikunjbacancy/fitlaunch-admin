import { useState } from 'react'
import { Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { usePromoCodes, useDeletePromoCode } from './usePromoCodes'
import { DISCOUNT_TYPE_LABELS } from './promoCode.constants'

const COLUMNS = 7

export function PromoCodeList() {
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading, isError, refetch } = usePromoCodes(page)
  const { mutate: deleteCode, isPending: isDeleting } = useDeletePromoCode()

  if (isError) {
    return (
      <ErrorState
        title="Failed to load promo codes"
        description="Could not fetch promo code data."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const codes = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <>
      <div className="space-y-3">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <DataTableSkeleton columns={COLUMNS} />
            ) : codes.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={COLUMNS}>
                    <EmptyState
                      title="No promo codes"
                      description="Create your first promo code using the form."
                      icon={<Tag className="h-8 w-8 text-muted-foreground" />}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold">
                        {code.code}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {DISCOUNT_TYPE_LABELS[code.discountType]}
                    </TableCell>
                    <TableCell className="tabular-nums font-medium">
                      {code.discountType === 'percent'
                        ? `${String(code.discountValue)}%`
                        : `$${String(code.discountValue)}`}
                    </TableCell>
                    <TableCell className="tabular-nums text-sm text-muted-foreground">
                      {code.usedCount}
                      {code.maxUses !== null ? ` / ${String(code.maxUses)}` : ''}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          code.isActive
                            ? 'bg-green-100 text-green-700 border-green-200 text-xs'
                            : 'bg-slate-100 text-slate-600 border-slate-200 text-xs'
                        }
                      >
                        {code.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${code.code}`}
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeleteId(code.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => {
                setPage((p) => p - 1)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || isLoading}
              onClick={() => {
                setPage((p) => p + 1)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Delete promo code?"
        description="This promo code will be permanently deleted and can no longer be redeemed."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => {
          if (deleteId) {
            deleteCode(deleteId, {
              onSuccess: () => {
                setDeleteId(null)
              },
            })
          }
        }}
      />
    </>
  )
}
