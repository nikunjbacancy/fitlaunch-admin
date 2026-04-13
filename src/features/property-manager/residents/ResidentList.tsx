import { useState } from 'react'
import { Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { isNotFoundError } from '@/lib/errors'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

  const { data, isLoading, isError, error, refetch } = useResidents(filters, page)
  const residents = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  // Treat 404 (endpoint not yet populated — residents register via mobile app)
  // as an empty state rather than a hard error.
  const showError = isError && !isNotFoundError(error)
  const hasActiveFilters = Boolean(filters.search ?? filters.status ?? filters.unitId)

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

  if (showError) {
    return (
      <ErrorState
        title={RESIDENT_COPY.ERROR_LOAD}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        {/* Card header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-7">
          <div>
            <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
              {RESIDENT_COPY.PAGE_TITLE}
            </h4>
            <p className="mt-1 text-sm text-kmvmt-navy/50">{RESIDENT_COPY.PAGE_DESCRIPTION}</p>
          </div>
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

        {/* Filter bar */}
        <div className="border-y border-kmvmt-bg bg-kmvmt-bg/30 px-8 py-4">
          <ResidentFilters filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* Table body */}
        {isLoading ? (
          <div className="px-8 py-8">
            <DataTableSkeleton columns={COLUMNS} rows={6} />
          </div>
        ) : residents.length === 0 ? (
          <div className="px-8 py-12">
            <EmptyState
              title={
                hasActiveFilters ? RESIDENT_COPY.EMPTY_FILTERED_TITLE : RESIDENT_COPY.EMPTY_TITLE
              }
              description={
                hasActiveFilters
                  ? RESIDENT_COPY.EMPTY_FILTERED_DESCRIPTION
                  : RESIDENT_COPY.EMPTY_DESCRIPTION
              }
              icon={<Users className="h-8 w-8 text-kmvmt-navy/40" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-kmvmt-bg/50 border-y border-zinc-50">
                  <TableHead className="w-10 pl-8">
                    <Checkbox
                      checked={allSelected}
                      aria-label={RESIDENT_COPY.COL_RESIDENT}
                      data-state={someSelected && !allSelected ? 'indeterminate' : undefined}
                      onCheckedChange={(checked) => {
                        handleSelectAll(checked === true)
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {RESIDENT_COPY.COL_RESIDENT}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {RESIDENT_COPY.COL_UNIT}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {RESIDENT_COPY.COL_STATUS}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {RESIDENT_COPY.COL_JOINED}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {RESIDENT_COPY.COL_LAST_ACTIVE}
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-50">
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
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 border-t border-kmvmt-bg bg-kmvmt-bg/20 px-8 py-5">
            <button
              type="button"
              aria-label={RESIDENT_COPY.ARIA_PREV_PAGE}
              disabled={page === 1 || isLoading}
              onClick={() => {
                setPage((p) => p - 1)
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-white text-kmvmt-navy transition-colors hover:bg-kmvmt-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-kmvmt-navy/60">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              aria-label={RESIDENT_COPY.ARIA_NEXT_PAGE}
              disabled={page === totalPages || isLoading}
              onClick={() => {
                setPage((p) => p + 1)
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-white text-kmvmt-navy transition-colors hover:bg-kmvmt-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
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
