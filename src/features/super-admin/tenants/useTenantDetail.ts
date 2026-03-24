import { useQuery } from '@tanstack/react-query'
import { tenantService } from './tenantService'

export function useTenantDetail(id: string) {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getById(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}
