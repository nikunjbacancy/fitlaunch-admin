import type { TenantType } from './auth.types'

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'lapsed' | 'pending'
export type SubscriptionPlan = 'starter' | 'growth' | 'pro' | 'per_unit'

export interface Tenant {
  id: string
  name: string
  tenantType: TenantType
  status: TenantStatus
  plan: SubscriptionPlan
  memberCount: number
  mrr: number
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  appDisplayName: string
  trialEndsAt: string | null
  createdAt: string
  updatedAt: string
}
