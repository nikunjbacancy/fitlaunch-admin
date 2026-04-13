export const OWNER_DASHBOARD_COPY = {
  PAGE_TITLE: 'Owner Dashboard',
  PAGE_DESCRIPTION: 'Portfolio overview across all your locations',
  ADD_LOCATION: 'Add Location',

  STAT_LOCATIONS: 'Total Locations',
  STAT_LOCATIONS_DESC: (active: number) => `${String(active)} active`,
  STAT_UNITS: 'Total Units',
  STAT_UNITS_DESC: (rate: number) => `${String(rate)}% occupancy`,
  STAT_MRR: 'Total MRR',
  STAT_MEMBERS: 'Active Members',
  STAT_MEMBERS_DESC: 'This week',

  // Locations preview / step-in
  SECTION_LOCATIONS: 'Step Into Location',
  LOCATIONS_SUBTITLE: 'Click any location to manage it as the local PM',
  LOCATIONS_VIEW_ALL: 'View all',
  LOCATIONS_EMPTY: 'No locations yet',
  STATUS_ACTIVE: 'Active',
  STATUS_SUSPENDED: 'Suspended',
  STATUS_PAYMENT_FAILED: 'Payment Failed',

  // Pending registrations
  SECTION_PENDING: 'Pending Registrations',
  PENDING_VIEW_ALL: 'View all',
  PENDING_EMPTY: 'No pending registrations across your locations',

  // Billing snapshot
  SECTION_BILLING: 'Billing Snapshot',
  BILLING_SUBTITLE: 'Combined billing across your locations',
  BILLING_VIEW_ALL: 'View billing',
  BILLING_NEXT_INVOICE: 'Next invoice',
  BILLING_PAYMENT_METHOD: 'Payment method',
  BILLING_PAYMENT_FAILED: (n: number) =>
    n === 1 ? '1 location with payment failure' : `${String(n)} locations with payment failure`,
  BILLING_NO_PAYMENT_METHOD: 'No payment method on file',
  BILLING_NO_INVOICE: 'No upcoming invoice',

  // MRR trend chart
  SECTION_MRR_TREND: 'MRR Trend',
  MRR_TREND_SUBTITLE: 'Last 6 months · combined revenue',
  MRR_TREND_ERROR: 'Failed to load MRR trend',
  MRR_TREND_EMPTY: 'No revenue data yet',

  ERROR_TITLE: 'Failed to load dashboard',
  ERROR_DESCRIPTION: 'Could not retrieve owner dashboard metrics.',
} as const
