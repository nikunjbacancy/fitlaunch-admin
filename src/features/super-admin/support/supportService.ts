import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { SupportTicket, TicketFilters, TicketStatus } from './support.types'
import type { PaginatedResponse } from '@/types/api.types'

export const supportService = {
  async getAll(
    filters: TicketFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<SupportTicket>> {
    const response = await apiClient.get<PaginatedResponse<SupportTicket>>(
      API_ENDPOINTS.SUPPORT.TICKETS,
      { params: { ...filters, page, limit } }
    )
    return response.data
  },

  async getById(id: string): Promise<SupportTicket> {
    const response = await apiClient.get<SupportTicket>(API_ENDPOINTS.SUPPORT.TICKET_DETAIL(id))
    return response.data
  },

  async updateStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    const response = await apiClient.patch<SupportTicket>(API_ENDPOINTS.SUPPORT.TICKET_STATUS(id), {
      status,
    })
    return response.data
  },
}
