export const DASHBOARD_COPY = {
  // Summary stats
  STAT_RESIDENTS: 'Total Residents',
  STAT_RESIDENTS_DESC: (active: number) => `${String(active)} active`,
  STAT_OCCUPANCY: 'Occupancy Rate',
  STAT_OCCUPANCY_DESC: (occupied: number, total: number) =>
    `${String(occupied)} / ${String(total)} units`,
  STAT_PENDING: 'Pending Registrations',
  STAT_ENGAGEMENT: 'Engagement Rate',
  STAT_ENGAGEMENT_DESC: 'Active last 7 days',
  // Engagement chart
  CHART_TITLE: 'Engagement Trends',
  CHART_ERROR: 'Failed to load engagement data',
  CHART_EMPTY: 'No engagement data yet',
  CHART_SERIES_ACTIVE: 'Active Users',
  CHART_SERIES_WORKOUTS: 'Workouts',
  // Pending feed
  FEED_TITLE: 'Pending Registrations',
  FEED_APPROVE_ALL: 'Approve all',
  FEED_EMPTY: 'All caught up!',
  FEED_EMPTY_DESC: 'No pending registrations.',
  FEED_ERROR: 'Failed to load pending registrations',
} as const
