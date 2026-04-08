export type ResidentStatus = 'active' | 'pending' | 'suspended' | 'removed'

export interface Resident {
  id: string
  fullName: string
  email: string
  unitCode: string
  unitId: string
  status: ResidentStatus
  joinedAt: string
  lastActiveAt: string | null
  avatarUrl: string | null
}

export interface ResidentFilters {
  search?: string
  status?: ResidentStatus
  unitId?: string
}
