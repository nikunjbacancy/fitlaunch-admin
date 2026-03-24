import type { Tenant, TenantStatus, SubscriptionPlan } from '@/types/tenant.types'
import type { TenantType } from '@/types/auth.types'

// Extends the global Tenant type with list-specific fields
export interface TenantListItem extends Tenant {
  ownerEmail: string
  ownerName: string
}

export interface TenantFilters {
  search: string
  status: TenantStatus | ''
  tenantType: TenantType | ''
  page: number
  limit: number
}

export type TenantFilterUpdate = Partial<Omit<TenantFilters, 'page'>> & { page?: number }

export interface SuspendTenantPayload {
  reason: string
}

// Re-export for convenience
export type { TenantStatus, SubscriptionPlan, TenantType }
