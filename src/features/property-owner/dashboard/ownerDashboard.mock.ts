/**
 * MOCK DATA — Property Owner dashboard preview only.
 * TODO: Revert — remove this file and revert service imports when real API is connected.
 */
import type { OwnerDashboardMetrics, OwnerLocationStats } from '@/types/tenant.types'
import type { OwnerMrrTrendPoint, OwnerBillingSnapshot } from './ownerDashboard.types'

export const MOCK_OWNER_METRICS: OwnerDashboardMetrics = {
  totalLocations: 3,
  totalUnits: 370,
  totalMembers: 298,
  totalMrr: 8200,
  activeLocations: 2,
  membersActiveThisWeek: 187,
  challengesRunning: 4,
  overallOccupancyRate: 78,
  pendingRegistrationsCount: 5,
  mrrTrend: 8,
  memberTrend: 5,
}

export const MOCK_OWNER_LOCATION_STATS: OwnerLocationStats[] = [
  {
    locationId: 'loc-1',
    locationName: 'Riverside Apartments',
    unitCount: 120,
    occupiedUnits: 102,
    memberCount: 98,
    activeThisWeek: 74,
    occupancyRate: 85,
    mrr: 4500,
    status: 'active',
    challengesRunning: 2,
    recentRegistrations: 3,
    pendingRegistrations: 2,
  },
  {
    locationId: 'loc-2',
    locationName: 'Meridian Living',
    unitCount: 85,
    occupiedUnits: 71,
    memberCount: 68,
    activeThisWeek: 52,
    occupancyRate: 84,
    mrr: 3700,
    status: 'active',
    challengesRunning: 2,
    recentRegistrations: 1,
    pendingRegistrations: 3,
  },
  {
    locationId: 'loc-3',
    locationName: 'The Heights Complex',
    unitCount: 165,
    occupiedUnits: 97,
    memberCount: 132,
    activeThisWeek: 61,
    occupancyRate: 59,
    mrr: 0,
    status: 'payment_failed',
    challengesRunning: 0,
    recentRegistrations: 0,
    pendingRegistrations: 0,
  },
]

export const MOCK_OWNER_MRR_TREND: OwnerMrrTrendPoint[] = [
  { month: 'Nov', mrr: 6800 },
  { month: 'Dec', mrr: 7100 },
  { month: 'Jan', mrr: 7350 },
  { month: 'Feb', mrr: 7600 },
  { month: 'Mar', mrr: 7900 },
  { month: 'Apr', mrr: 8200 },
]

export const MOCK_OWNER_BILLING_SNAPSHOT: OwnerBillingSnapshot = {
  totalMrr: 8200,
  nextInvoiceDate: '2026-05-01T00:00:00Z',
  nextInvoiceAmount: 8200,
  paymentMethodLast4: '4242',
  paymentFailedCount: 1,
}
