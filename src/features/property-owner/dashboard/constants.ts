export const OWNER_DASHBOARD_COPY = {
  PAGE_TITLE: 'Owner Dashboard',
  PAGE_DESCRIPTION: 'Overview across all your locations',
  STAT_LOCATIONS: 'Total Locations',
  STAT_LOCATIONS_DESC: (active: number) => `${String(active)} active`,
  STAT_UNITS: 'Total Units',
  STAT_MEMBERS: 'Total Members',
  STAT_MEMBERS_DESC: (active: number) => `${String(active)} active this week`,
  STAT_MRR: 'Monthly Revenue',
  STAT_CHALLENGES: 'Active Challenges',
  ERROR_TITLE: 'Failed to load dashboard',
  ERROR_DESCRIPTION: 'Could not retrieve owner dashboard metrics.',
} as const
