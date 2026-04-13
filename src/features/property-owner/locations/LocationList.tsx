import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { usePermissions } from '@/hooks/use-permissions'
import { useLocations } from './useLocations'
import { AddLocationModal } from './AddLocationModal'
import { LOCATIONS_COPY } from './constants'

const STATUS_BADGE_CLASSES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  suspended: 'bg-kmvmt-burgundy/10 text-kmvmt-burgundy border-kmvmt-burgundy/20',
  trial: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  lapsed: 'bg-kmvmt-red-dark/10 text-kmvmt-red-dark border-kmvmt-red-dark/20',
}

const COLUMNS = 7

export function LocationList() {
  const navigate = useNavigate()
  const { can } = usePermissions()
  const { data, isLoading, isError, refetch } = useLocations()
  const [addOpen, setAddOpen] = useState(false)

  if (isError) {
    return (
      <ErrorState
        title={LOCATIONS_COPY.ERROR_LOAD}
        description={LOCATIONS_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const locations = data ?? []

  return (
    <div className="space-y-8">
      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={5} />
      ) : locations.length === 0 ? (
        <EmptyState title={LOCATIONS_COPY.EMPTY_TITLE} description={LOCATIONS_COPY.EMPTY_DESC} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          {/* Card header */}
          <div className="flex items-center justify-between px-8 py-7">
            <div>
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                {LOCATIONS_COPY.PAGE_TITLE}
              </h4>
              <p className="mt-1 text-sm text-kmvmt-navy/50">{LOCATIONS_COPY.PAGE_DESCRIPTION}</p>
            </div>
            {can('add_owner_location') && (
              <button
                type="button"
                onClick={() => {
                  setAddOpen(true)
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                {LOCATIONS_COPY.ADD_LOCATION}
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-kmvmt-bg/50 border-y border-zinc-50">
                  <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {LOCATIONS_COPY.COL_NAME}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {LOCATIONS_COPY.COL_UNITS}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {LOCATIONS_COPY.COL_MEMBERS}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {LOCATIONS_COPY.COL_STATUS}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {LOCATIONS_COPY.COL_MRR}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {LOCATIONS_COPY.COL_MANAGERS}
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-50">
                {locations.map((loc) => (
                  <TableRow
                    key={loc.id}
                    className="cursor-pointer border-0 transition-colors hover:bg-kmvmt-bg/40"
                    onClick={() => {
                      void navigate(`/property-owner/locations/${loc.id}`)
                    }}
                  >
                    <TableCell className="px-8 py-5 font-semibold text-kmvmt-navy">
                      {loc.appDisplayName ?? loc.name}
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">{loc.unitCount}</TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">{loc.memberCount}</TableCell>
                    <TableCell className="py-5">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASSES[loc.status] ?? STATUS_BADGE_CLASSES.pending}`}
                      >
                        {loc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 font-semibold text-kmvmt-navy">
                      ${String(loc.mrr)}
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">
                      {loc.propertyManagers.length}
                    </TableCell>
                    <TableCell className="py-5 pr-8">
                      <span className="text-xs font-bold text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy">
                        View →
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <AddLocationModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
