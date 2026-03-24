import { useState } from 'react'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenants } from './useTenants'
import { TenantFilters } from './TenantFilters'
import { TenantTableRow } from './TenantTableRow'
import { TENANTS_PAGE_SIZE, TENANT_TABLE_COLUMNS, TENANT_COPY } from './constants'
import type { TenantFilters as TenantFiltersType, TenantFilterUpdate } from './tenant.types'

const DEFAULT_FILTERS: TenantFiltersType = {
  search: '',
  status: '',
  tenantType: '',
  page: 1,
  limit: TENANTS_PAGE_SIZE,
}

export function TenantList() {
  const [filters, setFilters] = useState<TenantFiltersType>(DEFAULT_FILTERS)

  const { data, isLoading, isError, refetch } = useTenants(filters)

  const handleFilterChange = (update: TenantFilterUpdate) => {
    setFilters((prev) => ({ ...prev, ...update }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const totalPages = data?.meta.totalPages ?? 1
  const total = data?.meta.total ?? 0

  return (
    <div className="space-y-4">
      <PageHeader title={TENANT_COPY.PAGE_TITLE} description={TENANT_COPY.PAGE_DESCRIPTION} />

      <TenantFilters filters={filters} onChange={handleFilterChange} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{TENANT_COPY.COL_TENANT}</TableHead>
              <TableHead>{TENANT_COPY.COL_TYPE}</TableHead>
              <TableHead>{TENANT_COPY.COL_STATUS}</TableHead>
              <TableHead>{TENANT_COPY.COL_PLAN}</TableHead>
              <TableHead className="text-right">{TENANT_COPY.COL_MEMBERS}</TableHead>
              <TableHead className="text-right">{TENANT_COPY.COL_MRR}</TableHead>
              <TableHead className="text-right">{TENANT_COPY.COL_CREATED}</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <DataTableSkeleton columns={TENANT_TABLE_COLUMNS} />
          ) : isError ? (
            <tbody>
              <tr>
                <td colSpan={TENANT_TABLE_COLUMNS}>
                  <ErrorState
                    message={TENANT_COPY.ERROR_LOAD}
                    onRetry={() => {
                      void refetch()
                    }}
                  />
                </td>
              </tr>
            </tbody>
          ) : !data?.data.length ? (
            <tbody>
              <tr>
                <td colSpan={TENANT_TABLE_COLUMNS}>
                  <EmptyState
                    icon={<Building2 className="h-8 w-8" />}
                    title={TENANT_COPY.EMPTY_TITLE}
                    description={TENANT_COPY.EMPTY_DESCRIPTION}
                  />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.data.map((tenant) => (
                <TenantTableRow key={tenant.id} tenant={tenant} />
              ))}
            </tbody>
          )}
        </Table>
      </div>

      {!isLoading && !isError && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} tenant{total !== 1 ? 's' : ''} total
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handlePageChange(filters.page - 1)
              }}
              disabled={filters.page <= 1}
              aria-label={TENANT_COPY.ARIA_PREV_PAGE}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 tabular-nums">
              {filters.page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handlePageChange(filters.page + 1)
              }}
              disabled={filters.page >= totalPages}
              aria-label={TENANT_COPY.ARIA_NEXT_PAGE}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
