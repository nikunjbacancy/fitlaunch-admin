import { useQuery } from '@tanstack/react-query'
import { tenantService } from './tenantService'
import type { TenantFilters } from './tenant.types'

export function useTenants(filters: TenantFilters) {
  return useQuery({
    queryKey: ['tenants', filters],
    queryFn: () => tenantService.getAll(filters),
    staleTime: 30_000,
  })
}
