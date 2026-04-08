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
import { useManagers, useRemoveManager } from './useManagers'
import { AddManagerModal } from './AddManagerModal'
import { MANAGERS_COPY } from './constants'
import type { LocationManager } from './manager.types'

const STATUS_BADGE_CLASSES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  invited: 'bg-amber-50 text-amber-700 border-amber-200',
}

const COLUMNS = 5

export function ManagerList() {
  const { can } = usePermissions()
  const { data, isLoading, isError, refetch } = useManagers()
  const removeManager = useRemoveManager()
  const [addOpen, setAddOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<LocationManager | null>(null)

  if (isError) {
    return (
      <ErrorState
        title={MANAGERS_COPY.ERROR_LOAD}
        description={MANAGERS_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const managers = data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title={MANAGERS_COPY.PAGE_TITLE}
        description={MANAGERS_COPY.PAGE_DESCRIPTION}
        actions={
          can('manage_location_managers') ? (
            <Button
              className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
              onClick={() => {
                setAddOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {MANAGERS_COPY.ADD_BTN}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={5} />
      ) : managers.length === 0 ? (
        <EmptyState title={MANAGERS_COPY.EMPTY_TITLE} description={MANAGERS_COPY.EMPTY_DESC} />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-kmvmt-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-kmvmt-navy">{MANAGERS_COPY.COL_NAME}</TableHead>
                <TableHead className="text-kmvmt-navy">{MANAGERS_COPY.COL_EMAIL}</TableHead>
                <TableHead className="text-kmvmt-navy">{MANAGERS_COPY.COL_LOCATION}</TableHead>
                <TableHead className="text-kmvmt-navy">{MANAGERS_COPY.COL_STATUS}</TableHead>
                <TableHead className="text-kmvmt-navy">{MANAGERS_COPY.COL_ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.map((mgr) => (
                <TableRow key={`${mgr.locationId}-${mgr.id}`}>
                  <TableCell className="font-medium text-kmvmt-navy">{mgr.fullName}</TableCell>
                  <TableCell className="text-kmvmt-navy">{mgr.email}</TableCell>
                  <TableCell className="text-kmvmt-navy">{mgr.locationName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE_CLASSES[mgr.status] ?? STATUS_BADGE_CLASSES.invited}
                    >
                      {mgr.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {can('manage_location_managers') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-kmvmt-red-dark hover:bg-kmvmt-red-light/10"
                        onClick={() => {
                          setRemoveTarget(mgr)
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

      <AddManagerModal open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
        title={MANAGERS_COPY.REMOVE_TITLE}
        description={MANAGERS_COPY.REMOVE_DESCRIPTION(
          removeTarget?.fullName ?? '',
          removeTarget?.locationName ?? ''
        )}
        confirmLabel={MANAGERS_COPY.REMOVE_CONFIRM}
        variant="destructive"
        isPending={removeManager.isPending}
        onConfirm={() => {
          if (removeTarget) {
            removeManager.mutate(
              { locationId: removeTarget.locationId, managerId: removeTarget.id },
              {
                onSuccess: () => {
                  setRemoveTarget(null)
                },
              }
            )
          }
        }}
      />
    </div>
  )
}
