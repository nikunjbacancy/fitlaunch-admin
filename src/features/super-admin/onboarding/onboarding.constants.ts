import type { OnboardingStatus, BusinessType } from './onboarding.types'

export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const ONBOARDING_STATUS_CLASSES: Record<OnboardingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  personal_trainer: 'Personal Trainer',
  nutritionist: 'Nutritionist',
  gym: 'Gym',
  online_coach: 'Online Coach',
  crossfit_box: 'CrossFit Box',
  apartment: 'Apartment Community',
}

export const ONBOARDING_COPY = {
  PAGE_TITLE: 'Onboarding',
  PAGE_DESCRIPTION: 'Review and approve new tenant applications',
  ERROR_LOAD: 'Failed to load onboarding applications',
  EMPTY_TITLE: 'No applications',
  EMPTY_DESCRIPTION: 'No applications in this queue.',
  TAB_PENDING: 'Pending',
  TAB_APPROVED: 'Approved',
  TAB_REJECTED: 'Rejected',
  ARIA_PREV_PAGE: 'Previous page',
  ARIA_NEXT_PAGE: 'Next page',
  CARD_BUSINESS_TYPE: 'Business type',
  CARD_PLAN: 'Plan',
  CARD_OWNER: 'Owner',
  CARD_MEMBERS: 'Est. members',
  CARD_WEBSITE: 'Website',
  CARD_NOTES_LABEL: 'Review notes',
  CARD_NOTES_PLACEHOLDER: 'Add notes (optional)…',
  BTN_APPROVE: 'Approve',
  BTN_REJECT: 'Reject',
  CONFIRM_APPROVE_TITLE: 'Approve application?',
  CONFIRM_APPROVE_DESC: 'This will create an active tenant account for this applicant.',
  CONFIRM_REJECT_TITLE: 'Reject application?',
  CONFIRM_REJECT_DESC: 'This will permanently reject this application.',
} as const
