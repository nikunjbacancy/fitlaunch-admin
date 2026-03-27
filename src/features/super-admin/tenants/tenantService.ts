import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'

import type { PaginatedResponse, ApiResponse } from '@/types/api.types'
import type { Tenant } from '@/types/tenant.types'
import type {
  TenantFilters,
  TenantListItem,
  SuspendTenantPayload,
  TCreateComplexPayload,
  TUpdateComplexPayload,
} from './tenant.types'

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

  async createApartmentComplex(payload: TCreateComplexPayload): Promise<TenantListItem> {
    const response = await apiClient.post<ApiResponse<TenantListItem>>(
      API_ENDPOINTS.TENANTS.CREATE_APARTMENT,
      payload
    )
    return response.data.data
  },

  async updateComplex(id: string, payload: TUpdateComplexPayload): Promise<TenantListItem> {
    const response = await apiClient.patch<ApiResponse<TenantListItem>>(
      API_ENDPOINTS.TENANTS.UPDATE(id),
      payload
    )
    return response.data.data
  },

  async resendInvite(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.RESEND_INVITE(id))
  },
}
