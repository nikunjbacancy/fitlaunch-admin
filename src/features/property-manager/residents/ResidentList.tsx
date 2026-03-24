import { useState } from 'react'
import { Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { ExportCsvButton } from '@/components/shared/ExportCsvButton'
import { apiClient } from '@/lib/axios'
import { useResidents } from './useResidents'
import { ResidentFilters } from './ResidentFilters'
import { ResidentTableRow } from './ResidentTableRow'
import { BulkApproveBar } from './BulkApproveBar'
import { RemoveResidentDialog } from './RemoveResidentDialog'
import { RESIDENT_COPY } from './constants'
import type { Resident, ResidentFilters as ResidentFiltersType } from './resident.types'

const COLUMNS = 7

export function ResidentList() {
  const [filters, setFilters] = useState<ResidentFiltersType>({})
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [residentToRemove, setResidentToRemove] = useState<Resident | null>(null)

  const { data, isLoading, isError, refetch } = useResidents(filters, page)
  const residents = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  const allSelected = residents.length > 0 && residents.every((r) => selectedIds.includes(r.id))
  const someSelected = residents.some((r) => selectedIds.includes(r.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? residents.map((r) => r.id) : [])
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)))
  }

  const handleFiltersChange = (next: ResidentFiltersType) => {
    setFilters(next)
    setPage(1)
    setSelectedIds([])
  }

  if (isError) {
    return (
      <ErrorState
        title={RESIDENT_COPY.ERROR_LOAD}
        description={RESIDENT_COPY.EMPTY_DESCRIPTION}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ResidentFilters filters={filters} onChange={handleFiltersChange} />
          <ExportCsvButton
            filename="residents.csv"
            onExport={async () => {
              const params = new URLSearchParams(
                Object.entries(filters).filter(([, v]) => v !== undefined) as [string, string][]
              )
              const response = await apiClient.get<Blob>(`/residents/export?${params.toString()}`, {
                responseType: 'blob',
              })
              return response.data
            }}
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    aria-label={RESIDENT_COPY.COL_RESIDENT}
                    data-state={someSelected && !allSelected ? 'indeterminate' : undefined}
                    onCheckedChange={(checked) => {
                      handleSelectAll(checked === true)
                    }}
                  />
                </TableHead>
                <TableHead>{RESIDENT_COPY.COL_RESIDENT}</TableHead>
                <TableHead>{RESIDENT_COPY.COL_UNIT}</TableHead>
                <TableHead>{RESIDENT_COPY.COL_STATUS}</TableHead>
                <TableHead>{RESIDENT_COPY.COL_JOINED}</TableHead>
                <TableHead>{RESIDENT_COPY.COL_LAST_ACTIVE}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <DataTableSkeleton columns={COLUMNS} />
            ) : residents.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={COLUMNS}>
                    <EmptyState
                      title={RESIDENT_COPY.EMPTY_TITLE}
                      description={RESIDENT_COPY.EMPTY_DESCRIPTION}
                      icon={<Users className="h-8 w-8 text-muted-foreground" />}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {residents.map((resident) => (
                  <ResidentTableRow
                    key={resident.id}
                    resident={resident}
                    isSelected={selectedIds.includes(resident.id)}
                    onSelect={handleSelectOne}
                    onRemove={setResidentToRemove}
                  />
                ))}
              </TableBody>
            )}
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              aria-label={RESIDENT_COPY.ARIA_PREV_PAGE}
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
              aria-label={RESIDENT_COPY.ARIA_NEXT_PAGE}
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

      <BulkApproveBar
        selectedIds={selectedIds}
        onClear={() => {
          setSelectedIds([])
        }}
      />

      <RemoveResidentDialog
        resident={residentToRemove}
        onClose={() => {
          setResidentToRemove(null)
        }}
      />
    </>
  )
}
