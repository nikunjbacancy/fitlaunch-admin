import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
// TODO: Owner Groups endpoints aren't in the API yet — these methods still use mocks.
import { MOCK_OWNER_GROUPS } from '../analytics/dashboard.mock'
import type { PaginatedResponse } from '@/types/api.types'
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
import type { Tenant } from '@/types/tenant.types'

export const tenantService = {
  async getAll(filters: TenantFilters): Promise<PaginatedResponse<TenantListItem>> {
    const response = await apiClient.get<PaginatedResponse<TenantListItem>>(
      API_ENDPOINTS.TENANTS.LIST,
      { params: filters }
    )
    return response.data
  },

  async getById(id: string): Promise<Tenant> {
    const response = await apiClient.get<{ success: boolean; data: Tenant }>(
      API_ENDPOINTS.TENANTS.DETAIL(id)
    )
    return response.data.data
  },

  async approve(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.APPROVE(id))
  },

  async suspend(id: string, payload: SuspendTenantPayload): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.SUSPEND(id), payload)
  },

  async reactivate(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.REACTIVATE(id))
  },

  async createApartmentComplex(payload: TCreateComplexPayload): Promise<TenantListItem> {
    const response = await apiClient.post<{ success: boolean; data: TenantListItem }>(
      API_ENDPOINTS.TENANTS.CREATE_APARTMENT,
      payload
    )
    return response.data.data
  },

  async updateComplex(id: string, payload: TUpdateComplexPayload): Promise<TenantListItem> {
    const response = await apiClient.patch<{ success: boolean; data: TenantListItem }>(
      API_ENDPOINTS.TENANTS.UPDATE(id),
      payload
    )
    return response.data.data
  },

  async resendInvite(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.RESEND_INVITE(id))
  },

  // ── Owner Groups ──────────────────────────────────────────────────────────
  // TODO: Switch to real API when OWNER_GROUPS endpoints are implemented on the backend.

  async getOwnerGroups(): Promise<OwnerGroupListItem[]> {
    return Promise.resolve(MOCK_OWNER_GROUPS)
  },

  async createOwnerGroup(
    _payload: TCreateOwnerGroupPayload
  ): Promise<{ success: boolean; data: OwnerGroupListItem; message: string }> {
    return Promise.resolve({ success: true, data: MOCK_OWNER_GROUPS[0], message: 'Created' })
  },

  async assignLocationToOwner(_groupId: string, _payload: TAssignLocationPayload): Promise<void> {
    return Promise.resolve()
  },

  async removeLocationFromOwner(_groupId: string, _locationId: string): Promise<void> {
    return Promise.resolve()
  },
}
