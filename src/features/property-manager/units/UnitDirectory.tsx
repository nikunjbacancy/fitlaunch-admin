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
import { Input } from '@/components/ui/input'
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

  // Filters — no pagination; the list scrolls inside a fixed-height container.
  // Sort alphabetically by code so freshly-imported blocks land in a
  // predictable spot (e.g. DEF after ABC) rather than insertion-order.
  const filteredUnits = useMemo(() => {
    return allUnits
      .filter((u) => {
        if (search && !u.code.toLowerCase().includes(search.toLowerCase())) return false
        if (statusFilter === 'occupied' && u.status !== 'occupied') return false
        if (statusFilter === 'vacant' && u.status === 'occupied') return false
        return true
      })
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
  }, [allUnits, search, statusFilter])

  const groups = useMemo(() => groupUnitsByPrefix(filteredUnits), [filteredUnits])

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
  return (
    <div className="space-y-8">
      {/* Summary stats */}
      {!isLoading && (totalUnits > 0 || summaryLoaded) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
              variant={limitReached ? 'alert' : 'default'}
              icon={
                limitReached ? (
                  <Ban className="h-4 w-4" />
                ) : limitLow ? (
                  <AlertTriangle className="h-4 w-4" />
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
        <div className="flex items-start gap-3 rounded-xl bg-kmvmt-burgundy/10 px-5 py-4 ring-1 ring-kmvmt-burgundy/20">
          <Ban className="mt-0.5 h-4 w-4 shrink-0 text-kmvmt-burgundy" />
          <p className="text-sm font-semibold text-kmvmt-burgundy">
            {UNITS_COPY.LIMIT_BANNER_REACHED(allocated)}
          </p>
        </div>
      )}
      {limitLow && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">
            {UNITS_COPY.LIMIT_BANNER_LOW(remaining, allocated)}
          </p>
        </div>
      )}

      {/* Main directory card */}
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        {/* Card header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-7">
          <div>
            <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
              {UNITS_COPY.PAGE_TITLE}
            </h4>
            <p className="mt-1 text-sm text-kmvmt-navy/50">{UNITS_COPY.PAGE_DESCRIPTION}</p>
          </div>
          {can('manage_units') && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setImportOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-kmvmt-white px-4 py-2.5 text-xs font-bold text-kmvmt-navy transition-colors hover:bg-kmvmt-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                {UNITS_COPY.IMPORT_CSV}
              </button>
              <button
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setGenerateOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-kmvmt-white px-4 py-2.5 text-xs font-bold text-kmvmt-navy transition-colors hover:bg-kmvmt-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Layers className="h-3.5 w-3.5" />
                {UNITS_COPY.GENERATE_RANGE}
              </button>
              <button
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setAddOpen(true)
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {UNITS_COPY.ADD_UNIT}
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="px-8 pb-8">
            <DataTableSkeleton columns={4} rows={8} />
          </div>
        ) : allUnits.length === 0 ? (
          <div className="px-8 pb-12">
            <EmptyState title={UNITS_COPY.EMPTY_TITLE} description={UNITS_COPY.EMPTY_DESC} />
          </div>
        ) : (
          <div className="flex border-t border-kmvmt-bg">
            {/* Left panel — list */}
            <div
              className={cn(
                'flex flex-col',
                selectedUnit ? 'w-1/2 border-r border-kmvmt-bg' : 'w-full'
              )}
            >
              {/* Search + filter tabs */}
              <div className="space-y-3 border-b border-kmvmt-bg bg-kmvmt-bg/30 px-6 py-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                  <Input
                    placeholder="Search units..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                    }}
                    className="h-10 border-zinc-200 bg-kmvmt-white pl-9 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
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
                        }}
                        className={cn(
                          'rounded-lg px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors',
                          statusFilter === tab
                            ? 'bg-kmvmt-navy text-white'
                            : 'text-kmvmt-navy/50 hover:bg-kmvmt-white hover:text-kmvmt-navy'
                        )}
                      >
                        {STATUS_TAB_LABELS[tab]} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Unit list */}
              <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 480px)' }}>
                {groups.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-kmvmt-navy/40">
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
                          className="flex w-full items-center justify-between border-b border-kmvmt-bg bg-kmvmt-bg/40 px-6 py-4 text-left transition-colors hover:bg-kmvmt-bg/70"
                        >
                          <div className="flex items-center gap-2.5">
                            {isCollapsed ? (
                              <ChevronRight className="h-4 w-4 text-kmvmt-navy/60" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-kmvmt-navy/60" />
                            )}
                            <span className="text-sm font-black uppercase tracking-wider text-kmvmt-navy">
                              Block {group.prefix}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-semibold text-kmvmt-navy/60">
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
                                  'flex w-full items-center justify-between border-b border-kmvmt-bg/60 px-6 py-3 text-left transition-colors',
                                  isSelected
                                    ? 'border-l-[3px] border-l-kmvmt-navy bg-kmvmt-navy/5'
                                    : 'hover:bg-kmvmt-bg/40'
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={cn(
                                      'h-2 w-2 shrink-0 rounded-full',
                                      isOccupied ? 'bg-emerald-500' : 'bg-zinc-300'
                                    )}
                                  />
                                  <span className="text-sm font-semibold text-kmvmt-navy">
                                    {unit.code}
                                  </span>
                                </div>
                                <span className="text-[11px] text-kmvmt-navy/40">
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
            </div>

            {/* Right panel — detail */}
            {selectedUnit && (
              <div className="flex w-1/2 flex-col">
                <div className="border-b border-kmvmt-bg px-8 py-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                        {selectedUnit.code}
                      </h2>
                      <div className="mt-2">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
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
                      className="rounded-lg p-1.5 text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
                      aria-label="Close detail"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  className="flex-1 space-y-7 overflow-y-auto px-8 py-6"
                  style={{ maxHeight: 'calc(100vh - 480px)' }}
                >
                  {/* Info */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                      {UNITS_COPY.DETAIL_SECTION_INFO}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-kmvmt-bg px-4 py-3">
                        <Home className="h-4 w-4 shrink-0 text-kmvmt-navy/40" />
                        <div>
                          <p className="text-[11px] text-kmvmt-navy/50">Unit Code</p>
                          <p className="text-sm font-semibold text-kmvmt-navy">
                            {selectedUnit.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-kmvmt-bg px-4 py-3">
                        <Calendar className="h-4 w-4 shrink-0 text-kmvmt-navy/40" />
                        <div>
                          <p className="text-[11px] text-kmvmt-navy/50">Added</p>
                          <p className="text-sm font-semibold text-kmvmt-navy">
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
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                      {UNITS_COPY.DETAIL_SECTION_RESIDENTS}
                    </h3>
                    {selectedUnit.residents && selectedUnit.residents.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedUnit.residents.map((resident) => (
                          <li
                            key={resident.id}
                            className="flex items-center gap-3 rounded-xl bg-kmvmt-bg px-4 py-3"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kmvmt-navy/10">
                              <User className="h-4 w-4 text-kmvmt-navy/60" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-kmvmt-navy">
                                {resident.fullName}
                              </p>
                              <p className="truncate text-[11px] text-kmvmt-navy/50">
                                {resident.email}
                              </p>
                            </div>
                            <span className="shrink-0 text-[11px] text-kmvmt-navy/40">
                              {new Date(resident.joinedAt).toLocaleDateString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-kmvmt-bg px-4 py-4">
                        <User className="h-4 w-4 text-kmvmt-navy/30" />
                        <p className="text-sm text-kmvmt-navy/40">
                          {UNITS_COPY.DETAIL_NO_RESIDENTS}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {can('manage_units') && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                        {UNITS_COPY.DETAIL_SECTION_ACTIONS}
                      </h3>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditTarget(selectedUnit)
                          }}
                          className="flex w-full items-center justify-start gap-2 rounded-xl border border-zinc-200 bg-kmvmt-white px-4 py-2.5 text-sm font-semibold text-kmvmt-navy transition-colors hover:bg-kmvmt-bg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {UNITS_COPY.DETAIL_EDIT}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRemoveTarget(selectedUnit)
                          }}
                          className="flex w-full items-center justify-start gap-2 rounded-xl border border-kmvmt-red-light/30 bg-kmvmt-white px-4 py-2.5 text-sm font-semibold text-kmvmt-red-dark transition-colors hover:border-kmvmt-red-light hover:bg-kmvmt-red-light/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {UNITS_COPY.DETAIL_REMOVE}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
