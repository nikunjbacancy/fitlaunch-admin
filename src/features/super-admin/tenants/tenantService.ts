import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { PaginatedResponse, ApiResponse } from '@/types/api.types'
import type { Tenant } from '@/types/tenant.types'
import type { TenantFilters, TenantListItem, SuspendTenantPayload } from './tenant.types'

export const tenantService = {
  async getAll(filters: TenantFilters): Promise<PaginatedResponse<TenantListItem>> {
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: filters.limit,
    }
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.tenantType) params.tenantType = filters.tenantType

    const response = await apiClient.get<PaginatedResponse<TenantListItem>>(
      API_ENDPOINTS.TENANTS.LIST,
      { params }
    )
    return response.data
  },

  async getById(id: string): Promise<Tenant> {
    const response = await apiClient.get<ApiResponse<Tenant>>(API_ENDPOINTS.TENANTS.DETAIL(id))
    return response.data.data
  },

  async approve(id: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.TENANTS.APPROVE(id))
  },

  async suspend(id: string, payload: SuspendTenantPayload): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.TENANTS.SUSPEND(id), payload)
  },

  async reactivate(id: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.TENANTS.REACTIVATE(id))
  },
}
