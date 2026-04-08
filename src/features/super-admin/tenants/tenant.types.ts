import { z } from 'zod'
import type { TenantStatus, SubscriptionPlan } from '@/types/tenant.types'
import type { TenantType } from '@/types/auth.types'

export interface TenantAdminUser {
  id: string
  email: string
  full_name: string | null
  status: string
  email_verified: boolean
}

// Matches the actual /tenants API response shape (snake_case)
export interface TenantListItem {
  id: string
  slug: string
  tenant_type: TenantType | null
  app_display_name: string | null
  logo_url: string | null
  subscription_plan: string | null
  subscription_status: string | null
  created_at: string | null
  unit_count?: number | null
  price_per_unit?: number | null
  admin_users: TenantAdminUser[]
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

export interface TCreateComplexPayload {
  complex_name: string
  unit_count: number
  price_per_unit: number
  pm_full_name: string
  pm_email: string
}

export interface TUpdateComplexPayload {
  complex_name?: string
  unit_count?: number
  price_per_unit?: number
}

export const createComplexSchema = z.object({
  complex_name: z.string().min(3, 'Complex name must be at least 3 characters'),
  unit_count: z
    .number({ invalid_type_error: 'Unit count must be a number' })
    .int('Unit count must be a whole number')
    .min(1, 'Must have at least 1 unit')
    .max(10000, 'Cannot exceed 10,000 units'),
  price_per_unit: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(2, 'Minimum price is $2.00')
    .max(5, 'Maximum price is $5.00'),
  pm_full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  pm_email: z.email('Invalid email address'),
})

export const updateComplexSchema = z.object({
  complex_name: z.string().min(3, 'Complex name must be at least 3 characters').optional(),
  unit_count: z
    .number({ invalid_type_error: 'Unit count must be a number' })
    .int('Unit count must be a whole number')
    .min(1, 'Must have at least 1 unit')
    .max(10000, 'Cannot exceed 10,000 units')
    .optional(),
  price_per_unit: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(2, 'Minimum price is $2.00')
    .max(5, 'Maximum price is $5.00')
    .optional(),
})

// ── Owner Group (Super Admin assigns locations to owners) ───────────────────

export interface TCreateOwnerGroupPayload {
  name: string
  owner_full_name: string
  owner_email: string
}

export const createOwnerGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  owner_full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  owner_email: z.email('Invalid email address'),
})

export interface TAssignLocationPayload {
  tenant_id: string
}

export interface OwnerGroupListItem {
  id: string
  name: string
  owner_full_name: string
  owner_email: string
  owner_status: 'invited' | 'active' | 'password_set'
  location_count: number
  total_units: number
  total_mrr: number
  created_at: string | null
}

// Re-export for convenience
export type { TenantStatus, SubscriptionPlan, TenantType }
