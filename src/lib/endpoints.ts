/**
 * API_ENDPOINTS — single source of truth for every backend route.
 *
 * Rules:
 *  - Never hardcode a path string in a service file — always import from here.
 *  - Dynamic segments use functions: ENDPOINTS.TENANTS.DETAIL(id)
 *  - Group by feature domain to mirror the API router structure.
 */

export const API_ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/admin/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    TWO_FACTOR_VERIFY: '/auth/2fa/verify',
  },

  // ── Super Admin — Tenants ─────────────────────────────────────────────────
  TENANTS: {
    LIST: '/tenants',
    DETAIL: (id: string) => `/tenants/${id}`,
    APPROVE: (id: string) => `/tenants/${id}/approve`,
    SUSPEND: (id: string) => `/tenants/${id}/suspend`,
    REACTIVATE: (id: string) => `/tenants/${id}/reactivate`,
    CREATE_APARTMENT: '/admin/tenants/apartment',
    UPDATE: (id: string) => `/admin/tenants/${id}`,
    RESEND_INVITE: (id: string) => `/admin/tenants/${id}/resend-invite`,
  },

  // ── Invite (Property Manager onboarding) ─────────────────────────────────
  INVITE: {
    VALIDATE: '/auth/invite/validate',
    ACCEPT: '/auth/invite/accept',
  },

  // ── Property Manager — Setup Wizard ───────────────────────────────────────
  PM_SETUP: {
    BRANDING: (id: string) => `/tenants/${id}/branding`,
    ADD_UNIT: (id: string) => `/tenants/${id}/units`,
    BULK_UNITS: (id: string) => `/tenants/${id}/units/bulk`,
    COMPLETE: (id: string) => `/tenants/${id}/onboarding/complete`,
  },

  // ── Super Admin — Analytics ───────────────────────────────────────────────
  ANALYTICS: {
    METRICS: '/analytics/metrics',
    PLATFORM: '/analytics/platform',
  },

  // ── Super Admin — Billing ─────────────────────────────────────────────────
  BILLING: {
    METRICS: '/admin/billing/metrics',
    INVOICES: '/admin/billing/invoices',
    SUBSCRIPTIONS: '/admin/billing/subscriptions',
  },

  // ── Super Admin — Pricing Tiers ───────────────────────────────────────────
  PRICING: {
    GET: '/admin/pricing',
    UPDATE: '/admin/pricing',
  },

  // ── Super Admin — Promo Codes ─────────────────────────────────────────────
  PROMO_CODES: {
    LIST: '/admin/promo-codes',
    CREATE: '/admin/promo-codes',
    DEACTIVATE: (id: string) => `/admin/promo-codes/${id}/deactivate`,
    DELETE: (id: string) => `/admin/promo-codes/${id}`,
  },

  // ── Super Admin — Feature Flags ───────────────────────────────────────────
  FEATURE_FLAGS: {
    LIST: '/admin/feature-flags',
    TOGGLE: (id: string) => `/admin/feature-flags/${id}`,
  },

  // ── Super Admin — Support ─────────────────────────────────────────────────
  SUPPORT: {
    TICKETS: '/admin/support/tickets',
    TICKET_DETAIL: (id: string) => `/admin/support/tickets/${id}`,
    TICKET_STATUS: (id: string) => `/admin/support/tickets/${id}/status`,
  },

  // ── Super Admin — Onboarding Queue ────────────────────────────────────────
  ONBOARDING: {
    LIST: '/admin/onboarding',
    REVIEW: (id: string) => `/admin/onboarding/${id}/review`,
  },

  // ── Property Manager — Dashboard ─────────────────────────────────────────
  PM_DASHBOARD: {
    METRICS: '/dashboard/metrics',
    ENGAGEMENT: '/dashboard/engagement',
    PENDING_REGISTRATIONS: '/dashboard/pending-registrations',
    APPROVE_ALL_PENDING: '/dashboard/pending-registrations/approve-all',
  },

  // ── Property Manager — Residents ──────────────────────────────────────────
  RESIDENTS: {
    LIST: '/residents',
    APPROVE: (id: string) => `/residents/${id}/approve`,
    BULK_APPROVE: '/residents/bulk-approve',
    REMOVE: (id: string) => `/residents/${id}`,
    EXPORT: '/residents/export',
  },
} as const
