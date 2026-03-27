import type { TenantStatus, SubscriptionPlan, OnboardingStep } from '@/types/tenant.types'
import type { TenantType } from '@/types/auth.types'

export const TENANT_STATUS_LABELS: Record<TenantStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  trial: 'Trial',
  lapsed: 'Lapsed',
  pending: 'Pending',
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  starter: 'Starter',
  growth: 'Growth',
  pro: 'Pro',
  per_unit: 'Per Unit',
}

export const TENANT_TYPE_LABELS: Record<TenantType, string> = {
  apartment: 'Apartment',
  trainer: 'Trainer',
}

export const TENANTS_PAGE_SIZE = 50

export const TENANT_TABLE_COLUMNS = 5

/** Consolidated badge classes — shared by TenantTableRow and TenantMetaCard */
export const PLAN_BADGE_CLASSES: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-700 border-slate-200',
  growth: 'bg-blue-100 text-blue-700 border-blue-200',
  pro: 'bg-purple-100 text-purple-700 border-purple-200',
  per_unit: 'bg-teal-100 text-teal-700 border-teal-200',
}

export const TENANT_STATUS_DESCRIPTIONS: Record<string, string> = {
  active: 'This tenant is active and has full platform access.',
  pending: 'This tenant has registered but is awaiting approval before gaining platform access.',
  suspended: 'This tenant has been suspended. All member access is blocked.',
  lapsed: "This tenant's subscription has lapsed. Access is currently restricted.",
  unknown: 'Unknown status.',
}
export const TENANT_TRIAL_DESCRIPTION = (date?: string | null) =>
  date
    ? `This tenant is on a free trial that ends on ${new Date(date).toLocaleDateString()}.`
    : 'This tenant is on a free trial.'

export const ONBOARDING_STEP_LABELS: Record<OnboardingStep, string> = {
  invited: 'Invite Sent',
  password_set: 'Password Set',
  two_fa_complete: '2FA Complete',
  branding_complete: 'Branding Done',
  units_complete: 'Units Added',
  active: 'Active',
}

export const ONBOARDING_STEP_BADGE_CLASSES: Record<OnboardingStep, string> = {
  invited: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  password_set: 'bg-blue-100 text-blue-700 border-blue-200',
  two_fa_complete: 'bg-blue-100 text-blue-700 border-blue-200',
  branding_complete: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  units_complete: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  active: 'bg-green-100 text-green-700 border-green-200',
}

export const TENANT_COPY = {
  // List page
  PAGE_TITLE: 'Tenants',
  PAGE_DESCRIPTION: 'Manage all platform tenants — apartments and trainers',
  ERROR_LOAD: 'Failed to load tenants',
  EMPTY_TITLE: 'No tenants found',
  EMPTY_DESCRIPTION: 'No tenants match your current filters.',
  SEARCH_PLACEHOLDER: 'Search tenants…',
  FILTER_ALL_STATUSES: 'All statuses',
  FILTER_ALL_TYPES: 'All types',
  COL_TENANT: 'Tenant',
  COL_TYPE: 'Type',
  COL_STATUS: 'Status',
  COL_CREATED: 'Created',
  ARIA_PREV_PAGE: 'Previous page',
  ARIA_NEXT_PAGE: 'Next page',
  // Detail page
  ERROR_LOAD_DETAIL: 'Failed to load tenant details',
  ARIA_BACK: 'Back to tenants',
  DETAIL_STATUS_SECTION: 'Account Status',
  META_MEMBERS: 'Members',
  META_MRR: 'MRR',
  META_CREATED: 'Created',
  META_TRIAL_ENDS: 'Trial ends',
  META_PRIMARY_COLOR: 'Primary colour',
  META_SECONDARY_COLOR: 'Secondary colour',
  // Actions
  APPROVE_TITLE: 'Approve tenant?',
  APPROVE_DESCRIPTION: 'This will mark the tenant as active and give them full platform access.',
  APPROVE_LABEL: 'Approve',
  SUSPEND_TITLE: 'Suspend tenant',
  SUSPEND_REASON_LABEL: 'Reason for suspension',
  SUSPEND_REASON_PLACEHOLDER: 'Describe why this tenant is being suspended…',
  SUSPEND_REASON_ERROR: 'Please provide a reason of at least 10 characters',
  SUSPEND_LABEL: 'Suspend',
  REACTIVATE_TITLE: 'Reactivate tenant?',
  REACTIVATE_DESCRIPTION: "This will restore the tenant's active status and platform access.",
  REACTIVATE_LABEL: 'Reactivate',
  CANCEL_LABEL: 'Cancel',
  // Add Complex Modal
  ADD_COMPLEX_TITLE: 'Add New Apartment Complex',
  ADD_COMPLEX_DESCRIPTION: 'Create the complex and send an invite to the Property Manager.',
  ADD_COMPLEX_SUBMIT: 'Create Complex & Send Invite',
  ADD_COMPLEX_SUCCESS: 'Complex created. Invite sent to {email}.',
  // Edit Complex Modal
  EDIT_COMPLEX_TITLE: 'Edit Complex Details',
  EDIT_COMPLEX_SUBMIT: 'Save Changes',
  EDIT_COMPLEX_SUCCESS: 'Complex updated successfully.',
  // Resend Invite
  RESEND_INVITE_LABEL: 'Resend Invite',
  RESEND_INVITE_SUCCESS: 'Invite resent to {email}.',
  RESEND_INVITE_SUCCESS_GENERIC: 'Invite resent successfully.',
  RESEND_INVITE_ERROR: 'PM has already completed onboarding.',
  // Row actions
  VIEW_DETAILS_LABEL: 'View Details',
  EDIT_COMPLEX_LABEL: 'Edit Complex',
} as const
