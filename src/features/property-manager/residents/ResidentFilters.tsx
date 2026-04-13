import { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RESIDENT_STATUS_LABELS, RESIDENT_COPY } from './constants'
import type { ResidentFilters as ResidentFiltersType, ResidentStatus } from './resident.types'

interface ResidentFiltersProps {
  filters: ResidentFiltersType
  onChange: (filters: ResidentFiltersType) => void
}

export function ResidentFilters({ filters, onChange }: ResidentFiltersProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value })
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
        <Input
          placeholder={RESIDENT_COPY.SEARCH_PLACEHOLDER}
          defaultValue={filters.search ?? ''}
          onChange={handleSearchChange}
          className="h-10 w-64 border-zinc-200 bg-kmvmt-white pl-9 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
        />
      </div>
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v) => {
          onChange({ ...filters, status: v === 'all' ? undefined : (v as ResidentStatus) })
        }}
      >
        <SelectTrigger className="h-10 w-44 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy focus:ring-kmvmt-navy">
          <SelectValue placeholder={RESIDENT_COPY.FILTER_ALL_STATUSES} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{RESIDENT_COPY.FILTER_ALL_STATUSES}</SelectItem>
          {(Object.entries(RESIDENT_STATUS_LABELS) as [ResidentStatus, string][]).map(
            ([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
