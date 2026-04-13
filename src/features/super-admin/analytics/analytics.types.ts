export interface PlatformMetrics {
  totalTenants: number
  activeTenants: number
  lapsedTenants: number
  trialTenants: number
  totalMrr: number
  activeMembers: number
  newSignupsThisMonth: number
  trialConversionRate: number
  workoutLogsThisMonth: number
  mealLogsThisMonth: number
  mrrTrend: number
  tenantTrend: number
  memberTrend: number
  signupTrend: number
  workoutLogTrend: number
  mealLogTrend: number
  // 7-point sparklines (last 7 months) for each KPI card
  tenantSparkline: number[]
  mrrSparkline: number[]
  memberSparkline: number[]
  signupSparkline: number[]
  conversionSparkline: number[]
  workoutLogSparkline: number[]
  mealLogSparkline: number[]
}

export interface MrrDataPoint {
  month: string
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

export interface ActiveLapsedPoint {
  month: string
  active: number
  lapsed: number
}

export interface SignupTrendPoint {
  month: string
  signups: number
}

export interface ConversionRatePoint {
  month: string
  rate: number
}

export interface LogVolumePoint {
  month: string
  workoutLogs: number
  mealLogs: number
}

export interface PlatformAnalytics {
  mrrTrend: MrrDataPoint[]
  tenantGrowth: TenantGrowthPoint[]
  signupFunnel: SignupFunnelPoint[]
  topTenantsByMrr: TopTenantByMrr[]
  activeLapsedTrend: ActiveLapsedPoint[]
  signupTrend: SignupTrendPoint[]
  conversionRateTrend: ConversionRatePoint[]
  logVolumeTrend: LogVolumePoint[]
}
