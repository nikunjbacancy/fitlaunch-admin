export interface PmDashboardMetrics {
  totalResidents: number
  activeResidents: number
  pendingRegistrations: number
  occupiedUnits: number
  totalUnits: number
  engagementRate: number
}

export interface EngagementDataPoint {
  week: string
  activeUsers: number
  workouts: number
}

export interface PendingRegistration {
  id: string
  residentId: string
  fullName: string
  email: string
  unitNumber: string
  submittedAt: string
}
