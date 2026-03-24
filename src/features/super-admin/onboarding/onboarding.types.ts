export type OnboardingStatus = 'pending' | 'approved' | 'rejected'
export type BusinessType =
  | 'personal_trainer'
  | 'nutritionist'
  | 'gym'
  | 'online_coach'
  | 'crossfit_box'
  | 'apartment'

export interface OnboardingApplication {
  id: string
  tenantName: string
  ownerName: string
  ownerEmail: string
  businessType: BusinessType
  plan: string
  status: OnboardingStatus
  submittedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
  notes: string | null
  website: string | null
  memberCount: number | null
}

export interface ReviewPayload {
  status: 'approved' | 'rejected'
  notes?: string
}
