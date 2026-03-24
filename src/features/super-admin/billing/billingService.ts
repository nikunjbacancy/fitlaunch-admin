import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { BillingOverviewMetrics, Invoice, Subscription } from './billing.types'
import type { PaginatedResponse } from '@/types/api.types'

export const billingService = {
  async getMetrics(): Promise<BillingOverviewMetrics> {
    const response = await apiClient.get<BillingOverviewMetrics>(API_ENDPOINTS.BILLING.METRICS)
    return response.data
  },

  async getInvoices(page = 1, limit = 20): Promise<PaginatedResponse<Invoice>> {
    const response = await apiClient.get<PaginatedResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICES,
      { params: { page, limit } }
    )
    return response.data
  },

  async getSubscriptions(page = 1, limit = 20): Promise<PaginatedResponse<Subscription>> {
    const response = await apiClient.get<PaginatedResponse<Subscription>>(
      API_ENDPOINTS.BILLING.SUBSCRIPTIONS,
      { params: { page, limit } }
    )
    return response.data
  },
}
