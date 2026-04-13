import { useState } from 'react'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { PageShell, PageCta } from '@/components/shared/PageShell'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  DollarSign,
  Dumbbell,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTenants } from './useTenants'
import { TenantFilters } from './TenantFilters'
import { TenantTableRow } from './TenantTableRow'
import { AddComplexModal } from './AddComplexModal'
import { TENANTS_PAGE_SIZE, TENANT_TABLE_COLUMNS, TENANT_COPY } from './constants'
import type { ReactNode } from 'react'
import type { TenantType } from '@/types/auth.types'
import type { TenantFilters as TenantFiltersType, TenantFilterUpdate } from './tenant.types'

interface StatItem {
  icon: ReactNode
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
}

function StatsBar({ stats, isLoading }: { stats: StatItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-0 overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_4px_20px_rgba(25,38,64,0.06)]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-3 px-6 py-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-20 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_4px_20px_rgba(25,38,64,0.06)]">
      {stats.map((stat, i) => (
        <div key={stat.label} className="relative flex flex-1 items-center gap-4 px-6 py-4">
          {i > 0 && (
            <div className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-zinc-100" />
          )}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-kmvmt-bg text-kmvmt-navy">
            <span className="[&>svg]:h-4 [&>svg]:w-4">{stat.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black tracking-tight text-kmvmt-navy tabular-nums">
                {stat.value}
              </p>
              {stat.trend && (
                <span
                  className={
                    stat.trendUp
                      ? 'text-[11px] font-bold text-emerald-600'
                      : 'text-[11px] font-bold text-kmvmt-red-light'
                  }
                >
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface TenantListProps {
  defaultTenantType?: TenantType
}

type ViewMode = 'apartment' | 'trainer' | 'all'

const PAGE_CONFIG: Record<
  string,
  { title: string; description: string; showAdd: boolean; viewMode: ViewMode }
> = {
  apartment: {
    title: 'All Complexes',
    description: 'Manage apartment complexes and their property managers',
    showAdd: true,
    viewMode: 'apartment',
  },
  trainer: {
    title: 'All Trainers',
    description: 'Manage trainers and gym owners',
    showAdd: false,
    viewMode: 'trainer',
  },
  '': {
    title: TENANT_COPY.PAGE_TITLE,
    description: TENANT_COPY.PAGE_DESCRIPTION,
    showAdd: true,
    viewMode: 'all',
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

  const filteredData = defaultTenantType
    ? data?.data.filter((t) => t.tenant_type === defaultTenantType)
    : data?.data

  const totalPages = data?.meta.totalPages ?? 1
  const total = data?.meta.total ?? 0
  const activeCount = filteredData?.filter((t) => t.subscription_status === 'active').length ?? 0
  const totalUnits = filteredData?.reduce((sum, t) => sum + (t.unit_count ?? 0), 0) ?? 0

  const isApartment = config.viewMode === 'apartment'
  const isTrainer = config.viewMode === 'trainer'

  const stats: StatItem[] = [
    {
      icon: isTrainer ? <Dumbbell /> : <Building2 />,
      label: isApartment ? 'Total Complexes' : isTrainer ? 'Total Trainers' : 'Total Tenants',
      value: total,
    },
    {
      icon: <CheckCircle />,
      label: 'Active',
      value: activeCount,
      trend: total > 0 ? `${String(Math.round((activeCount / total) * 100))}% active` : undefined,
      trendUp: true,
    },
    isApartment
      ? { icon: <Users />, label: 'Total Units', value: totalUnits.toLocaleString() }
      : { icon: <DollarSign />, label: 'Combined MRR', value: '—' },
  ]

  return (
    <>
      <PageShell
        breadcrumb={['KMVMT', config.title]}
        title={config.title}
        cta={
          config.showAdd ? (
            <PageCta
              label={TENANT_COPY.ADD_COMPLEX_TITLE}
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setAddModalOpen(true)
              }}
            />
          ) : undefined
        }
        statsBar={<StatsBar stats={stats} isLoading={isLoading} />}
        tableTitle={
          isApartment ? 'Apartment Complexes' : isTrainer ? 'Trainer Registry' : 'All Tenants'
        }
        tableActions
        filters={
          <TenantFilters
            filters={filters}
            onChange={handleFilterChange}
            hideTenantType={Boolean(defaultTenantType)}
          />
        }
        pagination={
          !isLoading && !isError && total > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-kmvmt-navy/50">
                Showing {filteredData?.length ?? 0} of {total}{' '}
                {isApartment ? 'complexes' : 'tenants'}
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
                  onClick={() => {
                    handlePageChange(filters.page - 1)
                  }}
                  disabled={filters.page <= 1}
                  aria-label={TENANT_COPY.ARIA_PREV_PAGE}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs tabular-nums text-kmvmt-navy/60">
                  {filters.page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
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
          ) : undefined
        }
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-kmvmt-bg/50 hover:bg-kmvmt-bg/50">
              <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {TENANT_COPY.COL_TENANT}
              </TableHead>
              {config.viewMode === 'all' && (
                <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  {TENANT_COPY.COL_TYPE}
                </TableHead>
              )}
              <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                Plan
              </TableHead>
              <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {TENANT_COPY.COL_STATUS}
              </TableHead>
              {config.viewMode === 'apartment' && (
                <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Units / Price
                </TableHead>
              )}
              <TableHead className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {TENANT_COPY.COL_CREATED}
              </TableHead>
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
                <TenantTableRow key={tenant.id} tenant={tenant} viewMode={config.viewMode} />
              ))}
            </tbody>
          )}
        </Table>
      </PageShell>

      {config.showAdd && <AddComplexModal open={addModalOpen} onOpenChange={setAddModalOpen} />}
    </>
  )
}
