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
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={RESIDENT_COPY.SEARCH_PLACEHOLDER}
          defaultValue={filters.search ?? ''}
          onChange={handleSearchChange}
          className="h-8 w-56 pl-8 text-sm"
        />
      </div>
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v) => {
          onChange({ ...filters, status: v === 'all' ? undefined : (v as ResidentStatus) })
        }}
      >
        <SelectTrigger className="h-8 w-36 text-sm">
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
