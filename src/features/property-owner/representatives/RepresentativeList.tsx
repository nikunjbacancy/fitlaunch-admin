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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={REPRESENTATIVES_COPY.PAGE_TITLE}
        description={REPRESENTATIVES_COPY.PAGE_DESCRIPTION}
        actions={
          can('invite_representative') ? (
            <Button
              className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
              onClick={() => {
                setInviteOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {REPRESENTATIVES_COPY.INVITE_BTN}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={3} />
      ) : reps.length === 0 ? (
        <EmptyState
          title={REPRESENTATIVES_COPY.EMPTY_TITLE}
          description={REPRESENTATIVES_COPY.EMPTY_DESC}
        />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-kmvmt-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-kmvmt-navy">{REPRESENTATIVES_COPY.COL_NAME}</TableHead>
                <TableHead className="text-kmvmt-navy">{REPRESENTATIVES_COPY.COL_EMAIL}</TableHead>
                <TableHead className="text-kmvmt-navy">{REPRESENTATIVES_COPY.COL_STATUS}</TableHead>
                <TableHead className="text-kmvmt-navy">{REPRESENTATIVES_COPY.COL_JOINED}</TableHead>
                <TableHead className="text-kmvmt-navy">
                  {REPRESENTATIVES_COPY.COL_ACTIONS}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reps.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-medium text-kmvmt-navy">{rep.fullName}</TableCell>
                  <TableCell className="text-kmvmt-navy">{rep.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE_CLASSES[rep.status] ?? STATUS_BADGE_CLASSES.invited}
                    >
                      {rep.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-kmvmt-navy">
                    {rep.joinedAt ? new Date(rep.joinedAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    {can('manage_representatives') && rep.status !== 'removed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-kmvmt-red-dark hover:bg-kmvmt-red-light/10"
                        onClick={() => {
                          setRemoveTarget(rep)
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
