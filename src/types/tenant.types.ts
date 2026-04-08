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

export interface TenantManager {
  id: string
  fullName: string
  email: string
  status: string
}

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
  ownerGroupId?: string | null
  propertyManager?: TenantManager
  propertyManagers?: TenantManager[]
}

// ── Owner Group (multi-location ownership) ──────────────────────────────────

export interface OwnerGroupRepresentative {
  id: string
  fullName: string
  email: string
  status: 'active' | 'invited' | 'removed'
  joinedAt: string | null
}

export interface OwnerGroupLocation {
  id: string
  name: string | null
  appDisplayName: string | null
  logoUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  unitCount: number
  memberCount: number
  status: TenantStatus
  pricePerUnit: number
  mrr: number
  propertyManagers: TenantManager[]
  createdAt: string | null
}

export interface OwnerGroup {
  id: string
  name: string
  locations: OwnerGroupLocation[]
  representatives: OwnerGroupRepresentative[]
  totalUnits: number
  totalMembers: number
  totalMrr: number
  createdAt: string | null
}

export interface OwnerDashboardMetrics {
  totalLocations: number
  totalUnits: number
  totalMembers: number
  totalMrr: number
  activeLocations: number
  membersActiveThisWeek: number
  challengesRunning: number
}

export interface OwnerLocationStats {
  locationId: string
  locationName: string
  unitCount: number
  memberCount: number
  activeThisWeek: number
  occupancyRate: number
  mrr: number
  challengesRunning: number
  recentRegistrations: number
}

export interface OwnerLocationComparison {
  locations: OwnerLocationStats[]
}
