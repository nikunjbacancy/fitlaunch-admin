import type { TenantType } from './auth.types'

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'lapsed' | 'pending'
export type SubscriptionPlan = 'starter' | 'growth' | 'pro' | 'per_unit'

export type OnboardingStep =
  | 'invited'
  | 'password_set'
  | 'two_fa_complete'
  | 'branding_complete'
  | 'units_complete'
  | 'active'

export interface Tenant {
  id: string
  name: string | null
  tenantType: TenantType | null
  status: TenantStatus | null
  plan: SubscriptionPlan | null
  memberCount: number | null
  mrr: number | null | undefined
  logoUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  appDisplayName: string | null
  trialEndsAt: string | null
  createdAt: string | null
  updatedAt: string | null
  unitCount?: number
  pricePerUnit?: number
  onboardingStep?: OnboardingStep
  propertyManager?: {
    id: string
    fullName: string
    email: string
    status: string
  }
}
