import { useState, useMemo } from 'react'
import {
  Plus,
  Upload,
  Layers,
  Home,
  Users,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  Calendar,
  User,
  AlertTriangle,
  Ban,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { usePermissions } from '@/hooks/use-permissions'
import { useUnits, useUnitSummary, useRemoveUnit } from './useUnits'
import { AddUnitModal } from './AddUnitModal'
import { EditUnitModal } from './EditUnitModal'
import { GenerateRangeModal } from './GenerateRangeModal'
import { ImportUnitsModal } from './ImportUnitsModal'
import { UNITS_COPY } from './constants'
import { cn } from '@/lib/utils'
import type { Unit } from './unit.types'

type StatusFilter = 'all' | 'occupied' | 'vacant'

const UNITS_PER_PAGE = 50
const LOW_REMAINING_THRESHOLD = 10

interface UnitGroup {
  prefix: string
  units: Unit[]
  occupied: number
  vacant: number
}

function groupUnitsByPrefix(units: Unit[]): UnitGroup[] {
  const groups = new Map<string, Unit[]>()

  for (const unit of units) {
    const dashIndex = unit.code.indexOf('-')
    const prefix = dashIndex > 0 ? unit.code.substring(0, dashIndex) : 'Other'
    const existing = groups.get(prefix) ?? []
    existing.push(unit)
    groups.set(prefix, existing)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([prefix, groupUnits]) => ({
      prefix,
      units: groupUnits.sort((a, b) => {
        const aNum = parseInt(a.code.split('-')[1] ?? '0', 10)
        const bNum = parseInt(b.code.split('-')[1] ?? '0', 10)
        if (isNaN(aNum) || isNaN(bNum)) return a.code.localeCompare(b.code)
        return aNum - bNum
      }),
      occupied: groupUnits.filter((u) => u.status === 'occupied').length,
      vacant: groupUnits.filter((u) => u.status !== 'occupied').length,
    }))
}

const STATUS_TAB_LABELS: Record<StatusFilter, string> = {
  all: 'All',
  occupied: 'Occupied',
  vacant: 'Vacant',
}

export function UnitDirectory() {
  const { can } = usePermissions()
  const { data, isLoading, isError, refetch } = useUnits()
  const { data: summary } = useUnitSummary()
  const removeUnit = useRemoveUnit()
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Unit | null>(null)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<Unit | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const toggleBlock = (prefix: string) => {
    setCollapsedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(prefix)) {
        next.delete(prefix)
      } else {
        next.add(prefix)
      }
      return next
    })
  }

  const allUnits = data ?? []
  const totalUnits = allUnits.length
  const totalOccupied = allUnits.filter((u) => u.status === 'occupied').length
  const totalVacant = totalUnits - totalOccupied

  // Summary / limit
  const summaryLoaded = summary !== undefined
  const allocated = summary?.allocated ?? 0
  const remaining = summary?.remaining ?? Infinity
  const limitReached = summaryLoaded && remaining <= 0
  const limitLow = summaryLoaded && remaining > 0 && remaining < LOW_REMAINING_THRESHOLD

  // Filters
  const filteredUnits = allUnits.filter((u) => {
    if (search && !u.code.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter === 'occupied' && u.status !== 'occupied') return false
    if (statusFilter === 'vacant' && u.status === 'occupied') return false
    return true
  })

  // Pagination
  const totalFiltered = filteredUnits.length
  const totalPages = Math.ceil(totalFiltered / UNITS_PER_PAGE)
  const paginatedUnits = filteredUnits.slice((page - 1) * UNITS_PER_PAGE, page * UNITS_PER_PAGE)
  const groups = useMemo(() => groupUnitsByPrefix(paginatedUnits), [paginatedUnits])

  if (isError) {
    return (
      <ErrorState
        title={UNITS_COPY.ERROR_LOAD}
        description={UNITS_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }
  const showingFrom = totalFiltered > 0 ? (page - 1) * UNITS_PER_PAGE + 1 : 0
  const showingTo = Math.min(page * UNITS_PER_PAGE, totalFiltered)

  return (
    <div className="space-y-6">
      <PageHeader
        title={UNITS_COPY.PAGE_TITLE}
        description={UNITS_COPY.PAGE_DESCRIPTION}
        actions={
          can('manage_units') ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-zinc-300 bg-kmvmt-white text-kmvmt-navy hover:bg-kmvmt-bg"
                disabled={limitReached}
                onClick={() => {
                  setImportOpen(true)
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                {UNITS_COPY.IMPORT_CSV}
              </Button>
              <Button
                variant="outline"
                className="border-zinc-300 bg-kmvmt-white text-kmvmt-navy hover:bg-kmvmt-bg"
                disabled={limitReached}
                onClick={() => {
                  setGenerateOpen(true)
                }}
              >
                <Layers className="mr-2 h-4 w-4" />
                {UNITS_COPY.GENERATE_RANGE}
              </Button>
              <Button
                className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
                disabled={limitReached}
                onClick={() => {
                  setAddOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {UNITS_COPY.ADD_UNIT}
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Summary stats */}
      {!isLoading && (totalUnits > 0 || summaryLoaded) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          {summaryLoaded && (
            <StatCard
              title={UNITS_COPY.SUMMARY_ALLOCATED}
              value={String(allocated)}
              icon={<Package className="h-4 w-4" />}
            />
          )}
          <StatCard
            title={UNITS_COPY.SUMMARY_TOTAL}
            value={String(totalUnits)}
            icon={<Home className="h-4 w-4" />}
          />
          <StatCard
            title={UNITS_COPY.SUMMARY_OCCUPIED}
            value={String(totalOccupied)}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title={UNITS_COPY.SUMMARY_VACANT}
            value={String(totalVacant)}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          {summaryLoaded && (
            <StatCard
              title={UNITS_COPY.SUMMARY_REMAINING}
              value={String(remaining)}
              icon={
                limitReached ? (
                  <Ban className="h-4 w-4 text-kmvmt-red-dark" />
                ) : limitLow ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )
              }
            />
          )}
        </div>
      )}

      {/* Limit banners */}
      {limitReached && (
        <div className="flex items-start gap-3 rounded-lg border border-kmvmt-red-light bg-kmvmt-red-light/10 px-4 py-3">
          <Ban className="mt-0.5 h-4 w-4 shrink-0 text-kmvmt-red-dark" />
          <p className="text-sm text-kmvmt-red-dark">
            {UNITS_COPY.LIMIT_BANNER_REACHED(allocated)}
          </p>
        </div>
      )}
      {limitLow && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            {UNITS_COPY.LIMIT_BANNER_LOW(remaining, allocated)}
          </p>
        </div>
      )}

      {/* Main content */}
      {isLoading ? (
        <DataTableSkeleton columns={4} rows={8} />
      ) : allUnits.length === 0 ? (
        <EmptyState title={UNITS_COPY.EMPTY_TITLE} description={UNITS_COPY.EMPTY_DESC} />
      ) : (
        <div className="flex gap-0 overflow-hidden rounded-lg border border-zinc-200 bg-kmvmt-white">
          {/* Left panel */}
          <div
            className={cn(
              'flex flex-col border-r border-zinc-200',
              selectedUnit ? 'w-1/2' : 'w-full'
            )}
          >
            {/* Search + filter */}
            <div className="border-b border-zinc-200 p-3 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                <Input
                  placeholder="Search units..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="h-9 border-zinc-200 bg-kmvmt-bg pl-9 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                />
              </div>
              <div className="flex gap-1">
                {(Object.keys(STATUS_TAB_LABELS) as StatusFilter[]).map((tab) => {
                  const count =
                    tab === 'all' ? totalUnits : tab === 'occupied' ? totalOccupied : totalVacant
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setStatusFilter(tab)
                        setPage(1)
                      }}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                        statusFilter === tab
                          ? 'bg-kmvmt-navy text-white'
                          : 'text-kmvmt-navy/60 hover:bg-kmvmt-bg hover:text-kmvmt-navy'
                      )}
                    >
                      {STATUS_TAB_LABELS[tab]} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Unit list */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
              {groups.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-kmvmt-navy/40">
                  No units match your filters.
                </div>
              ) : (
                groups.map((group) => {
                  const isCollapsed = collapsedBlocks.has(group.prefix)
                  return (
                    <div key={group.prefix}>
                      <button
                        type="button"
                        onClick={() => {
                          toggleBlock(group.prefix)
                        }}
                        className="flex w-full items-center justify-between border-b border-zinc-100 bg-kmvmt-bg/50 px-4 py-2.5 text-left hover:bg-kmvmt-bg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isCollapsed ? (
                            <ChevronRight className="h-3.5 w-3.5 text-kmvmt-navy/40" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-kmvmt-navy/40" />
                          )}
                          <span className="text-xs font-semibold text-kmvmt-navy">
                            Block {group.prefix}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-kmvmt-navy/40">
                          <span>{String(group.units.length)}</span>
                          <span className="text-emerald-600">{String(group.occupied)} occ</span>
                          <span>{String(group.vacant)} vac</span>
                        </div>
                      </button>

                      {!isCollapsed &&
                        group.units.map((unit) => {
                          const isOccupied = unit.status === 'occupied'
                          const isSelected = selectedUnit?.id === unit.id
                          return (
                            <button
                              key={unit.id}
                              type="button"
                              onClick={() => {
                                setSelectedUnit(isSelected ? null : unit)
                              }}
                              className={cn(
                                'flex w-full items-center justify-between border-b border-zinc-50 px-4 py-2.5 text-left transition-colors',
                                isSelected
                                  ? 'bg-kmvmt-navy/5 border-l-2 border-l-kmvmt-navy'
                                  : 'hover:bg-kmvmt-bg/50'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    'h-2 w-2 rounded-full shrink-0',
                                    isOccupied ? 'bg-emerald-500' : 'bg-zinc-300'
                                  )}
                                />
                                <span className="text-sm font-medium text-kmvmt-navy">
                                  {unit.code}
                                </span>
                              </div>
                              <span className="text-xs text-kmvmt-navy/40">
                                {isOccupied
                                  ? `${String(unit.resident_count)} resident${unit.resident_count !== 1 ? 's' : ''}`
                                  : UNITS_COPY.STATUS_VACANT}
                              </span>
                            </button>
                          )
                        })}
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2.5">
                <span className="text-xs text-kmvmt-navy/40">
                  {UNITS_COPY.PAGINATION_SHOWING(showingFrom, showingTo, totalFiltered)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => p - 1)
                    }}
                  >
                    Prev
                  </Button>
                  <span className="flex items-center px-2 text-xs text-kmvmt-navy/60">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((p) => p + 1)
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel — detail */}
          {selectedUnit && (
            <div className="w-1/2 flex flex-col">
              <div className="border-b border-zinc-200 px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-kmvmt-navy">{selectedUnit.code}</h2>
                    <div className="mt-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          selectedUnit.status === 'occupied'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            selectedUnit.status === 'occupied' ? 'bg-emerald-500' : 'bg-zinc-400'
                          )}
                        />
                        {selectedUnit.status === 'occupied'
                          ? UNITS_COPY.STATUS_OCCUPIED
                          : UNITS_COPY.STATUS_VACANT}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUnit(null)
                    }}
                    className="rounded-md p-1 text-kmvmt-navy/40 hover:bg-kmvmt-bg hover:text-kmvmt-navy"
                    aria-label="Close detail"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Info */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                    {UNITS_COPY.DETAIL_SECTION_INFO}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4 shrink-0 text-kmvmt-navy/30" />
                      <div>
                        <p className="text-xs text-kmvmt-navy/50">Unit Code</p>
                        <p className="text-sm font-medium text-kmvmt-navy">{selectedUnit.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 shrink-0 text-kmvmt-navy/30" />
                      <div>
                        <p className="text-xs text-kmvmt-navy/50">Added</p>
                        <p className="text-sm font-medium text-kmvmt-navy">
                          {selectedUnit.created_at
                            ? new Date(selectedUnit.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Residents */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                    {UNITS_COPY.DETAIL_SECTION_RESIDENTS}
                  </h3>
                  {selectedUnit.residents && selectedUnit.residents.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedUnit.residents.map((resident) => (
                        <li
                          key={resident.id}
                          className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kmvmt-navy/10">
                            <User className="h-3.5 w-3.5 text-kmvmt-navy/60" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-kmvmt-navy truncate">
                              {resident.fullName}
                            </p>
                            <p className="text-xs text-kmvmt-navy/50 truncate">{resident.email}</p>
                          </div>
                          <span className="text-[11px] text-kmvmt-navy/40 shrink-0">
                            {new Date(resident.joinedAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-200 px-3 py-4">
                      <User className="h-4 w-4 text-kmvmt-navy/20" />
                      <p className="text-sm text-kmvmt-navy/40">{UNITS_COPY.DETAIL_NO_RESIDENTS}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {can('manage_units') && (
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                      {UNITS_COPY.DETAIL_SECTION_ACTIONS}
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
                        onClick={() => {
                          setEditTarget(selectedUnit)
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {UNITS_COPY.DETAIL_EDIT}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 border-kmvmt-red-light/30 text-kmvmt-red-dark hover:bg-kmvmt-red-light/10 hover:border-kmvmt-red-light"
                        onClick={() => {
                          setRemoveTarget(selectedUnit)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {UNITS_COPY.DETAIL_REMOVE}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddUnitModal open={addOpen} onOpenChange={setAddOpen} limitReached={limitReached} />
      {generateOpen && (
        <GenerateRangeModal
          open={generateOpen}
          onOpenChange={setGenerateOpen}
          remaining={summaryLoaded ? remaining : Infinity}
        />
      )}
      {importOpen && (
        <ImportUnitsModal
          open={importOpen}
          onOpenChange={setImportOpen}
          remaining={summaryLoaded ? remaining : Infinity}
        />
      )}
      {editTarget && (
        <EditUnitModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null)
          }}
          unit={editTarget}
          onSuccess={(updated) => {
            if (selectedUnit?.id === updated.id) setSelectedUnit(updated)
            setEditTarget(null)
          }}
        />
      )}

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
        title={UNITS_COPY.REMOVE_TITLE}
        description={UNITS_COPY.REMOVE_DESCRIPTION(removeTarget?.code ?? '')}
        confirmLabel={UNITS_COPY.REMOVE_CONFIRM}
        variant="destructive"
        isPending={removeUnit.isPending}
        onConfirm={() => {
          if (removeTarget) {
            removeUnit.mutate(removeTarget.id, {
              onSuccess: () => {
                setRemoveTarget(null)
                if (selectedUnit?.id === removeTarget.id) setSelectedUnit(null)
              },
            })
          }
        }}
      />
    </div>
  )
}
