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
    <div className="space-y-8">
      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={5} />
      ) : managers.length === 0 ? (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          <div className="flex items-center justify-between px-8 py-7">
            <div>
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                {MANAGERS_COPY.PAGE_TITLE}
              </h4>
              <p className="mt-1 text-sm text-kmvmt-navy/50">{MANAGERS_COPY.PAGE_DESCRIPTION}</p>
            </div>
            {can('manage_location_managers') && (
              <button
                type="button"
                onClick={() => {
                  setAddOpen(true)
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                {MANAGERS_COPY.ADD_BTN}
              </button>
            )}
          </div>
          <div className="px-8 pb-10">
            <EmptyState title={MANAGERS_COPY.EMPTY_TITLE} description={MANAGERS_COPY.EMPTY_DESC} />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          {/* Card header */}
          <div className="flex items-center justify-between px-8 py-7">
            <div>
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                {MANAGERS_COPY.PAGE_TITLE}
              </h4>
              <p className="mt-1 text-sm text-kmvmt-navy/50">{MANAGERS_COPY.PAGE_DESCRIPTION}</p>
            </div>
            {can('manage_location_managers') && (
              <button
                type="button"
                onClick={() => {
                  setAddOpen(true)
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                {MANAGERS_COPY.ADD_BTN}
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-kmvmt-bg/50 border-y border-zinc-50">
                  <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {MANAGERS_COPY.COL_NAME}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {MANAGERS_COPY.COL_EMAIL}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {MANAGERS_COPY.COL_LOCATION}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {MANAGERS_COPY.COL_STATUS}
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-50">
                {managers.map((mgr) => (
                  <TableRow
                    key={`${mgr.locationId}-${mgr.id}`}
                    className="border-0 transition-colors hover:bg-kmvmt-bg/40"
                  >
                    <TableCell className="px-8 py-5 font-semibold text-kmvmt-navy">
                      {mgr.fullName}
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">{mgr.email}</TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">{mgr.locationName}</TableCell>
                    <TableCell className="py-5">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[mgr.status] ?? STATUS_BADGE_CLASSES.invited}`}
                      >
                        {mgr.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 pr-8 text-right">
                      {can('manage_location_managers') && (
                        <button
                          type="button"
                          onClick={() => {
                            setRemoveTarget(mgr)
                          }}
                          className="text-xs font-bold text-kmvmt-red-dark transition-colors hover:text-kmvmt-red-light"
                        >
                          {MANAGERS_COPY.REMOVE_CONFIRM}
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
