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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
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
  lapsed: 'bg-red-50 text-red-700 border-red-200',
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
    <div className="space-y-6">
      <PageHeader
        title={LOCATIONS_COPY.PAGE_TITLE}
        description={LOCATIONS_COPY.PAGE_DESCRIPTION}
        actions={
          can('add_owner_location') ? (
            <Button
              className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
              onClick={() => {
                setAddOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {LOCATIONS_COPY.ADD_LOCATION}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={5} />
      ) : locations.length === 0 ? (
        <EmptyState title={LOCATIONS_COPY.EMPTY_TITLE} description={LOCATIONS_COPY.EMPTY_DESC} />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-kmvmt-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_NAME}</TableHead>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_UNITS}</TableHead>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_MEMBERS}</TableHead>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_STATUS}</TableHead>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_MRR}</TableHead>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_MANAGERS}</TableHead>
                <TableHead className="text-kmvmt-navy">{LOCATIONS_COPY.COL_ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium text-kmvmt-navy">
                    {loc.appDisplayName ?? loc.name}
                  </TableCell>
                  <TableCell className="text-kmvmt-navy">{loc.unitCount}</TableCell>
                  <TableCell className="text-kmvmt-navy">{loc.memberCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE_CLASSES[loc.status] ?? STATUS_BADGE_CLASSES.pending}
                    >
                      {loc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-kmvmt-navy">${loc.mrr}</TableCell>
                  <TableCell className="text-kmvmt-navy">{loc.propertyManagers.length}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-kmvmt-navy hover:bg-kmvmt-bg"
                      onClick={() => {
                        void navigate(`/property-owner/locations/${loc.id}`)
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddLocationModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
