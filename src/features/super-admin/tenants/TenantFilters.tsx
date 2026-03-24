import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TENANT_STATUS_LABELS, TENANT_TYPE_LABELS, TENANT_COPY } from './constants'
import type { TenantFilters, TenantFilterUpdate } from './tenant.types'

const DEBOUNCE_MS = 300

interface TenantFiltersProps {
  filters: TenantFilters
  onChange: (update: TenantFilterUpdate) => void
}

export function TenantFilters({ filters, onChange }: TenantFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  // Debounce search → reset to page 1 on new search
  useEffect(() => {
    const id = setTimeout(() => {
      onChange({ search: searchInput, page: 1 })
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(id)
    }
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={TENANT_COPY.SEARCH_PLACEHOLDER}
          value={searchInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchInput(e.target.value)
          }}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status || 'all'}
        onValueChange={(val) => {
          onChange({ status: val === 'all' ? '' : (val as TenantFilters['status']), page: 1 })
        }}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder={TENANT_COPY.FILTER_ALL_STATUSES} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{TENANT_COPY.FILTER_ALL_STATUSES}</SelectItem>
          {(Object.keys(TENANT_STATUS_LABELS) as (keyof typeof TENANT_STATUS_LABELS)[]).map(
            (status) => (
              <SelectItem key={status} value={status}>
                {TENANT_STATUS_LABELS[status]}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Select
        value={filters.tenantType || 'all'}
        onValueChange={(val) => {
          onChange({
            tenantType: val === 'all' ? '' : (val as TenantFilters['tenantType']),
            page: 1,
          })
        }}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder={TENANT_COPY.FILTER_ALL_TYPES} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{TENANT_COPY.FILTER_ALL_TYPES}</SelectItem>
          {(Object.keys(TENANT_TYPE_LABELS) as (keyof typeof TENANT_TYPE_LABELS)[]).map((type) => (
            <SelectItem key={type} value={type}>
              {TENANT_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
