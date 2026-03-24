import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { Resident, ResidentFilters } from './resident.types'
import type { PaginatedResponse } from '@/types/api.types'
import { RESIDENTS_PAGE_SIZE } from './constants'

export const residentService = {
  async getAll(filters: ResidentFilters, page = 1): Promise<PaginatedResponse<Resident>> {
    const response = await apiClient.get<PaginatedResponse<Resident>>(
      API_ENDPOINTS.RESIDENTS.LIST,
      { params: { ...filters, page, limit: RESIDENTS_PAGE_SIZE } }
    )
    return response.data
  },

  async approve(id: string): Promise<Resident> {
    const response = await apiClient.post<Resident>(API_ENDPOINTS.RESIDENTS.APPROVE(id))
    return response.data
  },

  async bulkApprove(ids: string[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.RESIDENTS.BULK_APPROVE, { ids })
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.RESIDENTS.REMOVE(id))
  },

  exportCsv(filters: ResidentFilters): string {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== undefined) as [string, string][]
    )
    return `${API_ENDPOINTS.RESIDENTS.EXPORT}?${params.toString()}`
  },
}
