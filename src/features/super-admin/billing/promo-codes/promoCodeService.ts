import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { PromoCode, CreatePromoCodeValues } from './promoCode.types'
import type { PaginatedResponse } from '@/types/api.types'

export const promoCodeService = {
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<PromoCode>> {
    const response = await apiClient.get<PaginatedResponse<PromoCode>>(
      API_ENDPOINTS.PROMO_CODES.LIST,
      { params: { page, limit } }
    )
    return response.data
  },

  async create(payload: CreatePromoCodeValues): Promise<PromoCode> {
    const response = await apiClient.post<PromoCode>(API_ENDPOINTS.PROMO_CODES.CREATE, payload)
    return response.data
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.PROMO_CODES.DEACTIVATE(id))
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PROMO_CODES.DELETE(id))
  },
}
