import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { OwnerGroupRepresentative } from '@/types/tenant.types'
import type { TInviteRepresentativePayload } from './representative.types'

export const representativeService = {
  async getAll(): Promise<OwnerGroupRepresentative[]> {
    const response = await apiClient.get<{ success: boolean; data: OwnerGroupRepresentative[] }>(
      API_ENDPOINTS.OWNER_REPRESENTATIVES.LIST
    )
    return response.data.data
  },

  async invite(payload: TInviteRepresentativePayload): Promise<OwnerGroupRepresentative> {
    const response = await apiClient.post<{ success: boolean; data: OwnerGroupRepresentative }>(
      API_ENDPOINTS.OWNER_REPRESENTATIVES.INVITE,
      payload
    )
    return response.data.data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.OWNER_REPRESENTATIVES.REMOVE(id))
  },
}
