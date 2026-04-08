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
  TCreateOwnerGroupPayload,
  TAssignLocationPayload,
  OwnerGroupListItem,
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

  // ── Owner Groups ──────────────────────────────────────────────────────────

  async getOwnerGroups(): Promise<OwnerGroupListItem[]> {
    const response = await apiClient.get<{ success: boolean; data: OwnerGroupListItem[] }>(
      API_ENDPOINTS.OWNER_GROUPS.LIST
    )
    return response.data.data
  },

  async createOwnerGroup(
    payload: TCreateOwnerGroupPayload
  ): Promise<ApiResponse<OwnerGroupListItem>> {
    const response = await apiClient.post<ApiResponse<OwnerGroupListItem>>(
      API_ENDPOINTS.OWNER_GROUPS.CREATE,
      payload
    )
    return response.data
  },

  async assignLocationToOwner(groupId: string, payload: TAssignLocationPayload): Promise<void> {
    await apiClient.post(API_ENDPOINTS.OWNER_GROUPS.ASSIGN_LOCATION(groupId), payload)
  },

  async removeLocationFromOwner(groupId: string, locationId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.OWNER_GROUPS.REMOVE_LOCATION(groupId, locationId))
  },
}
