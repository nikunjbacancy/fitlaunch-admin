export interface PlatformMetrics {
  totalTenants: number
  activeTenants: number
  totalMrr: number
  activeMembers: number
  newSignupsThisMonth: number
  trialConversionRate: number
  mrrTrend: number
  tenantTrend: number
  memberTrend: number
  signupTrend: number
}

export interface MrrDataPoint {
  month: string // e.g. "Jan 24"
  mrr: number
}

export interface TenantGrowthPoint {
  month: string
  apartment: number
  trainer: number
}

export interface SignupFunnelPoint {
  stage: string
  count: number
}

export interface TopTenantByMrr {
  id: string
  name: string
  tenantType: string
  plan: string
  mrr: number
}

export interface PlatformAnalytics {
  mrrTrend: MrrDataPoint[]
  tenantGrowth: TenantGrowthPoint[]
  signupFunnel: SignupFunnelPoint[]
  topTenantsByMrr: TopTenantByMrr[]
}
