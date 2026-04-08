import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useOwnerLocationStats } from './useOwnerDashboard'

const COLUMNS = 7
const TABLE_TITLE = 'Location Performance'
const TABLE_ERROR = 'Failed to load location stats'
const TABLE_EMPTY = 'No locations yet'
const TABLE_EMPTY_DESC = 'Add your first location to see stats here.'

export function OwnerLocationStatsTable() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useOwnerLocationStats()

  if (isError) {
    return (
      <ErrorState
        title={TABLE_ERROR}
        description={TABLE_ERROR}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (isLoading) {
    return <DataTableSkeleton columns={COLUMNS} rows={5} />
  }

  const stats = data ?? []

  if (stats.length === 0) {
    return <EmptyState title={TABLE_EMPTY} description={TABLE_EMPTY_DESC} />
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-kmvmt-navy">{TABLE_TITLE}</h3>
      <div className="rounded-lg border border-zinc-200 bg-kmvmt-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-kmvmt-navy">Location</TableHead>
              <TableHead className="text-kmvmt-navy">Units</TableHead>
              <TableHead className="text-kmvmt-navy">Members</TableHead>
              <TableHead className="text-kmvmt-navy">Active This Week</TableHead>
              <TableHead className="text-kmvmt-navy">Occupancy</TableHead>
              <TableHead className="text-kmvmt-navy">MRR</TableHead>
              <TableHead className="text-kmvmt-navy">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((location) => (
              <TableRow key={location.locationId}>
                <TableCell className="font-medium text-kmvmt-navy">
                  {location.locationName}
                </TableCell>
                <TableCell className="text-kmvmt-navy">{location.unitCount}</TableCell>
                <TableCell className="text-kmvmt-navy">{location.memberCount}</TableCell>
                <TableCell className="text-kmvmt-navy">{location.activeThisWeek}</TableCell>
                <TableCell className="text-kmvmt-navy">
                  {String(Math.round(location.occupancyRate * 100))}%
                </TableCell>
                <TableCell className="text-kmvmt-navy">${location.mrr}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-kmvmt-navy hover:bg-kmvmt-bg"
                    onClick={() => {
                      void navigate(`/property-owner/locations/${location.locationId}`)
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
    </div>
  )
}
