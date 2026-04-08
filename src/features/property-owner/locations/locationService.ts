import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { OwnerGroupLocation, OwnerLocationComparison } from '@/types/tenant.types'
import type { TCreateLocationPayload } from './location.types'

export const locationService = {
  async getAll(): Promise<OwnerGroupLocation[]> {
    const response = await apiClient.get<{ success: boolean; data: OwnerGroupLocation[] }>(
      API_ENDPOINTS.OWNER_LOCATIONS.LIST
    )
    return response.data.data
  },

  async getById(id: string): Promise<OwnerGroupLocation> {
    const response = await apiClient.get<{ success: boolean; data: OwnerGroupLocation }>(
      API_ENDPOINTS.OWNER_LOCATIONS.DETAIL(id)
    )
    return response.data.data
  },

  async create(payload: TCreateLocationPayload): Promise<OwnerGroupLocation> {
    const response = await apiClient.post<{ success: boolean; data: OwnerGroupLocation }>(
      API_ENDPOINTS.OWNER_LOCATIONS.CREATE,
      payload
    )
    return response.data.data
  },

  async getComparison(): Promise<OwnerLocationComparison> {
    const response = await apiClient.get<{ success: boolean; data: OwnerLocationComparison }>(
      API_ENDPOINTS.OWNER_DASHBOARD.COMPARISON
    )
    return response.data.data
  },
}
