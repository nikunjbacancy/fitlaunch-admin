import { useState } from 'react'
import { Plus, UsersRound, RotateCw, MapPin, DollarSign } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { PageShell, PageCta } from '@/components/shared/PageShell'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useOwnerGroups } from './useTenantActions'
import { CreateOwnerGroupModal } from './CreateOwnerGroupModal'
import { TENANT_COPY } from './constants'
import type { ReactNode } from 'react'

const COLUMNS = 7

const OWNER_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  invited: { label: 'Invite Sent', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  password_set: { label: 'Password Set', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

// ── Inline stats bar ──────────────────────────────────────────────────────────
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
        <div key={stat.label} className="flex flex-1 items-center gap-4 px-6 py-4 relative">
          {/* Divider between items */}
          {i > 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-px bg-zinc-100" />
          )}

          {/* Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-kmvmt-bg text-kmvmt-navy">
            <span className="[&>svg]:h-4 [&>svg]:w-4">{stat.icon}</span>
          </div>

          {/* Label + Value */}
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40 mb-0.5">
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

// ─────────────────────────────────────────────────────────────────────────────

export function OwnerGroupList() {
  const { data, isLoading, isError, refetch } = useOwnerGroups()
  const [createOpen, setCreateOpen] = useState(false)

  const totalLocations = data?.reduce((sum, g) => sum + g.location_count, 0) ?? 0
  const totalMrr = data?.reduce((sum, g) => sum + g.total_mrr, 0) ?? 0
  const groupCount = data?.length ?? 0

  const stats: StatItem[] = [
    {
      icon: <UsersRound />,
      label: 'Owner Groups',
      value: groupCount,
    },
    {
      icon: <MapPin />,
      label: 'Total Locations',
      value: totalLocations,
    },
    {
      icon: <DollarSign />,
      label: 'Combined MRR',
      value: `$${totalMrr.toLocaleString()}`,
      trend: '+12%',
      trendUp: true,
    },
  ]

  return (
    <>
      <PageShell
        breadcrumb={['KMVMT', 'Owner Groups']}
        title={TENANT_COPY.OWNER_GROUPS_TITLE}
        cta={
          <PageCta
            label={TENANT_COPY.ADD_OWNER_GROUP}
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setCreateOpen(true)
            }}
          />
        }
        statsBar={<StatsBar stats={stats} isLoading={isLoading} />}
        tableTitle="Active Management Registry"
        tableActions
      >
        {isLoading ? (
          <DataTableSkeleton columns={COLUMNS} rows={5} />
        ) : isError ? (
          <ErrorState
            title={TENANT_COPY.ERROR_LOAD}
            description="Could not load owner groups."
            onRetry={() => {
              void refetch()
            }}
          />
        ) : !data?.length ? (
          <EmptyState
            icon={<UsersRound className="h-8 w-8" />}
            title="No owner groups yet"
            description="Create an owner group to link multiple apartment complexes under one owner."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-kmvmt-bg/50 hover:bg-kmvmt-bg/50">
                <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Group
                </TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Owner
                </TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Status
                </TableHead>
                <TableHead className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Locations
                </TableHead>
                <TableHead className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Total Units
                </TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  MRR
                </TableHead>
                <TableHead className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                  Created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((group) => {
                const statusConfig =
                  OWNER_STATUS_BADGE[group.owner_status] ?? OWNER_STATUS_BADGE.invited
                const initials = group.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
                const ownerInitials = group.owner_full_name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()

                return (
                  <TableRow
                    key={group.id}
                    className="hover:bg-kmvmt-bg/40 transition-colors duration-150"
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kmvmt-navy text-xs font-bold text-white">
                          {initials}
                        </div>
                        <p className="text-sm font-bold tracking-tight text-kmvmt-navy">
                          {group.name}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kmvmt-bg text-[10px] font-semibold text-kmvmt-navy">
                          {ownerInitials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-kmvmt-navy">
                            {group.owner_full_name}
                          </p>
                          <p className="text-[11px] text-kmvmt-navy/50">{group.owner_email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig.className}`}
                        >
                          {statusConfig.label}
                        </Badge>
                        {group.owner_status === 'invited' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-kmvmt-navy/40 hover:bg-kmvmt-bg hover:text-kmvmt-navy"
                                  aria-label="Resend invite"
                                >
                                  <RotateCw className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Resend invite</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-kmvmt-navy">
                        {group.location_count}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-kmvmt-navy">
                        {group.total_units.toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <span className="text-sm font-bold text-kmvmt-navy">
                        ${group.total_mrr.toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell className="px-8 py-5 text-right text-[11px] text-kmvmt-navy/50">
                      {group.created_at
                        ? new Date(group.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </PageShell>

      <CreateOwnerGroupModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
