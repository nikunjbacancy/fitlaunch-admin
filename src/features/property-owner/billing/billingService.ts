import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { OwnerBillingOverview, OwnerInvoice } from './billing.types'

export const ownerBillingService = {
  async getOverview(): Promise<OwnerBillingOverview> {
    const response = await apiClient.get<{ success: boolean; data: OwnerBillingOverview }>(
      API_ENDPOINTS.OWNER_BILLING.OVERVIEW
    )
    return response.data.data
  },

  async getInvoices(): Promise<OwnerInvoice[]> {
    const response = await apiClient.get<{ success: boolean; data: OwnerInvoice[] }>(
      API_ENDPOINTS.OWNER_BILLING.INVOICES
    )
    return response.data.data
  },
}
