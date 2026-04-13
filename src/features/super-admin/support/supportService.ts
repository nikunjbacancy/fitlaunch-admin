// TODO: Revert to real API calls when backend is connected.
// import { apiClient } from '@/lib/axios'
// import { API_ENDPOINTS } from '@/lib/endpoints'
import { MOCK_SUPPORT_TICKETS } from '../analytics/dashboard.mock'
import type { SupportTicket, TicketFilters, TicketStatus } from './support.types'
import type { PaginatedResponse } from '@/types/api.types'

export const supportService = {
  async getAll(
    _filters: TicketFilters,
    _page = 1,
    _limit = 20
  ): Promise<PaginatedResponse<SupportTicket>> {
    return Promise.resolve(MOCK_SUPPORT_TICKETS)
  },

  async getById(id: string): Promise<SupportTicket> {
    const ticket = MOCK_SUPPORT_TICKETS.data.find((t) => t.id === id)
    if (!ticket) throw new Error('Ticket not found')
    return Promise.resolve(ticket)
  },

  async updateStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    const ticket = MOCK_SUPPORT_TICKETS.data.find((t) => t.id === id)
    if (!ticket) throw new Error('Ticket not found')
    return Promise.resolve({ ...ticket, status })
  },
}
