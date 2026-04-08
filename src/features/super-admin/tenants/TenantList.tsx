import { useState } from 'react'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { Building2, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useTenants } from './useTenants'
import { TenantFilters } from './TenantFilters'
import { TenantTableRow } from './TenantTableRow'
import { AddComplexModal } from './AddComplexModal'
import { TENANTS_PAGE_SIZE, TENANT_TABLE_COLUMNS, TENANT_COPY } from './constants'
import type { TenantType } from '@/types/auth.types'
import type { TenantFilters as TenantFiltersType, TenantFilterUpdate } from './tenant.types'

interface TenantListProps {
  defaultTenantType?: TenantType
}

const PAGE_CONFIG: Record<string, { title: string; description: string; showAdd: boolean }> = {
  apartment: {
    title: 'All Complexes',
    description: 'Manage apartment complexes',
    showAdd: true,
  },
  trainer: {
    title: 'All Trainers',
    description: 'Manage trainers and gym owners',
    showAdd: false,
  },
  '': {
    title: TENANT_COPY.PAGE_TITLE,
    description: TENANT_COPY.PAGE_DESCRIPTION,
    showAdd: true,
  },
}

export function TenantList({ defaultTenantType }: TenantListProps) {
  const [filters, setFilters] = useState<TenantFiltersType>({
    search: '',
    status: '',
    tenantType: defaultTenantType ?? '',
    page: 1,
    limit: TENANTS_PAGE_SIZE,
  })
  const [addModalOpen, setAddModalOpen] = useState(false)
  const config = PAGE_CONFIG[defaultTenantType ?? ''] ?? PAGE_CONFIG['']

  const { data, isLoading, isError, refetch } = useTenants(filters)

  const handleFilterChange = (update: TenantFilterUpdate) => {
    setFilters((prev) => ({ ...prev, ...update }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  // Client-side tenant type filter until API supports it
  const filteredData = defaultTenantType
    ? data?.data.filter((t) => t.tenant_type === defaultTenantType)
    : data?.data

  const totalPages = data?.meta.totalPages ?? 1
  const total = filteredData?.length ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <PageHeader title={config.title} description={config.description} />
        {config.showAdd && (
          <Button
            onClick={() => {
              setAddModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {TENANT_COPY.ADD_COMPLEX_TITLE}
          </Button>
        )}
      </div>
      {config.showAdd && <AddComplexModal open={addModalOpen} onOpenChange={setAddModalOpen} />}

      <TenantFilters
        filters={filters}
        onChange={handleFilterChange}
        hideTenantType={Boolean(defaultTenantType)}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{TENANT_COPY.COL_TENANT}</TableHead>
              <TableHead>{TENANT_COPY.COL_TYPE}</TableHead>
              <TableHead>{TENANT_COPY.COL_STATUS}</TableHead>
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
          ) : !filteredData?.length ? (
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
              {filteredData.map((tenant) => (
                <TenantTableRow key={tenant.id} tenant={tenant} />
              ))}
            </tbody>
          )}
        </Table>
      </div>

      {!isLoading && !isError && total > 0 && (
        <div className="flex items-center justify-between text-sm text-kmvmt-navy/60">
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
