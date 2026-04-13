import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { usePermissions } from '@/hooks/use-permissions'
import { useRepresentatives, useRemoveRepresentative } from './useRepresentatives'
import { InviteRepresentativeModal } from './InviteRepresentativeModal'
import { REPRESENTATIVES_COPY } from './constants'
import type { OwnerGroupRepresentative } from '@/types/tenant.types'

const STATUS_BADGE_CLASSES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  invited: 'bg-amber-50 text-amber-700 border-amber-200',
  removed: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}

const COLUMNS = 5

export function RepresentativeList() {
  const { can } = usePermissions()
  const { data, isLoading, isError, refetch } = useRepresentatives()
  const removeRep = useRemoveRepresentative()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<OwnerGroupRepresentative | null>(null)

  if (isError) {
    return (
      <ErrorState
        title={REPRESENTATIVES_COPY.ERROR_LOAD}
        description={REPRESENTATIVES_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const reps = data ?? []

  const renderHeader = () => (
    <div className="flex items-center justify-between px-8 py-7">
      <div>
        <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
          {REPRESENTATIVES_COPY.PAGE_TITLE}
        </h4>
        <p className="mt-1 text-sm text-kmvmt-navy/50">{REPRESENTATIVES_COPY.PAGE_DESCRIPTION}</p>
      </div>
      {can('invite_representative') && (
        <button
          type="button"
          onClick={() => {
            setInviteOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {REPRESENTATIVES_COPY.INVITE_BTN}
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={3} />
      ) : reps.length === 0 ? (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          {renderHeader()}
          <div className="px-8 pb-10">
            <EmptyState
              title={REPRESENTATIVES_COPY.EMPTY_TITLE}
              description={REPRESENTATIVES_COPY.EMPTY_DESC}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          {renderHeader()}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-kmvmt-bg/50 border-y border-zinc-50">
                  <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {REPRESENTATIVES_COPY.COL_NAME}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {REPRESENTATIVES_COPY.COL_EMAIL}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {REPRESENTATIVES_COPY.COL_STATUS}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {REPRESENTATIVES_COPY.COL_JOINED}
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-50">
                {reps.map((rep) => (
                  <TableRow
                    key={rep.id}
                    className="border-0 transition-colors hover:bg-kmvmt-bg/40"
                  >
                    <TableCell className="px-8 py-5 font-semibold text-kmvmt-navy">
                      {rep.fullName}
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">{rep.email}</TableCell>
                    <TableCell className="py-5">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[rep.status] ?? STATUS_BADGE_CLASSES.invited}`}
                      >
                        {rep.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">
                      {rep.joinedAt ? new Date(rep.joinedAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="py-5 pr-8 text-right">
                      {can('manage_representatives') && rep.status !== 'removed' && (
                        <button
                          type="button"
                          onClick={() => {
                            setRemoveTarget(rep)
                          }}
                          className="text-xs font-bold text-kmvmt-red-dark transition-colors hover:text-kmvmt-red-light"
                        >
                          {REPRESENTATIVES_COPY.REMOVE_CONFIRM}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <InviteRepresentativeModal open={inviteOpen} onOpenChange={setInviteOpen} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
        title={REPRESENTATIVES_COPY.REMOVE_TITLE}
        description={REPRESENTATIVES_COPY.REMOVE_DESCRIPTION(removeTarget?.fullName ?? '')}
        confirmLabel={REPRESENTATIVES_COPY.REMOVE_CONFIRM}
        variant="destructive"
        isPending={removeRep.isPending}
        onConfirm={() => {
          if (removeTarget) {
            removeRep.mutate(removeTarget.id, {
              onSuccess: () => {
                setRemoveTarget(null)
              },
            })
          }
        }}
      />
    </div>
  )
}
