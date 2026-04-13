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
  hideTenantType?: boolean
}

export function TenantFilters({ filters, onChange, hideTenantType = false }: TenantFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  useEffect(() => {
    const id = setTimeout(() => {
      onChange({ search: searchInput, page: 1 })
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(id)
    }
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
        <Input
          placeholder={TENANT_COPY.SEARCH_PLACEHOLDER}
          value={searchInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchInput(e.target.value)
          }}
          className="h-9 border-zinc-200 bg-kmvmt-white pl-9 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
        />
      </div>

      <Select
        value={filters.status || 'all'}
        onValueChange={(val) => {
          onChange({ status: val === 'all' ? '' : (val as TenantFilters['status']), page: 1 })
        }}
      >
        <SelectTrigger className="h-9 w-full border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy sm:w-40">
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

      {!hideTenantType && (
        <Select
          value={filters.tenantType || 'all'}
          onValueChange={(val) => {
            onChange({
              tenantType: val === 'all' ? '' : (val as TenantFilters['tenantType']),
              page: 1,
            })
          }}
        >
          <SelectTrigger className="h-9 w-full border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy sm:w-36">
            <SelectValue placeholder={TENANT_COPY.FILTER_ALL_TYPES} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{TENANT_COPY.FILTER_ALL_TYPES}</SelectItem>
            {(Object.keys(TENANT_TYPE_LABELS) as (keyof typeof TENANT_TYPE_LABELS)[]).map(
              (type) => (
                <SelectItem key={type} value={type}>
                  {TENANT_TYPE_LABELS[type]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
