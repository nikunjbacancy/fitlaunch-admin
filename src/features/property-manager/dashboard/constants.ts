export const DASHBOARD_COPY = {
  PAGE_TITLE: 'Dashboard',
  PAGE_DESCRIPTION: "Overview of your community's activity and registrations.",

  // KPI cards
  STAT_UNITS: 'Total Units',
  STAT_UNITS_DESC: (occupied: number, vacant: number) =>
    `${String(occupied)} occupied · ${String(vacant)} vacant`,
  STAT_ACTIVE_MEMBERS: 'Active Members',
  STAT_ACTIVE_MEMBERS_DESC: 'This week',
  STAT_CHALLENGES: 'Challenges Running',
  STAT_POSTS: 'Recent Posts',
  STAT_POSTS_DESC: 'This week',

  // Pending registrations
  FEED_TITLE: 'Pending Registrations',
  FEED_APPROVE_ALL: 'Approve all',
  FEED_EMPTY: 'All caught up!',
  FEED_EMPTY_DESC: 'No pending registrations.',
  FEED_ERROR: 'Failed to load pending registrations',

  // Subscription panel
  SUBSCRIPTION_TITLE: 'Subscription',
  SUBSCRIPTION_MANAGE: 'Manage Billing',

  // Engagement chart
  CHART_TITLE: 'Engagement Trends',
  CHART_ERROR: 'Failed to load engagement data',
  CHART_EMPTY: 'No engagement data yet',
  CHART_SERIES_ACTIVE: 'Active Users',
  CHART_SERIES_WORKOUTS: 'Workouts',

  // Recent community activity
  ACTIVITY_TITLE: 'Recent Community Activity',
  ACTIVITY_SUBTITLE: 'Latest posts, workouts, and announcements',
  ACTIVITY_VIEW_ALL: 'View feed',
  ACTIVITY_EMPTY: 'No community activity yet',
  ACTIVITY_EMPTY_DESC: 'Posts, workouts, and announcements will appear here.',
  ACTIVITY_ERROR: 'Failed to load community activity',

  // Active challenges
  CHALLENGES_TITLE: 'Active Challenges',
  CHALLENGES_SUBTITLE: 'Top performers across running challenges',
  CHALLENGES_VIEW_ALL: 'View challenges',
  CHALLENGES_EMPTY: 'No active challenges',
  CHALLENGES_EMPTY_DESC: 'Create a challenge to drive engagement in your community.',
  CHALLENGES_ERROR: 'Failed to load challenges',
  CHALLENGES_PARTICIPANTS: (n: number) => `${String(n)} participants`,
  CHALLENGES_DAYS_LEFT: (n: number) => (n === 1 ? '1 day left' : `${String(n)} days left`),
  CHALLENGES_LEADERBOARD: 'Leaderboard',

  // Onboarding checklist banner (shown until tenantOnboardingStep === 'active')
  CHECKLIST_TITLE: 'Finish setting up your workspace',
  CHECKLIST_SUBTITLE:
    'A couple of quick steps will unlock resident invites and personalize your community.',
  CHECKLIST_BRANDING_TITLE: 'Add your branding',
  CHECKLIST_BRANDING_DESC: 'Upload your logo and brand colors so residents recognize your space.',
  CHECKLIST_UNITS_TITLE: 'Build your unit directory',
  CHECKLIST_UNITS_DESC: 'Add units now so you can invite and approve residents.',
  CHECKLIST_CTA_GO: 'Set up',
  CHECKLIST_CTA_DONE: 'Complete',
  CHECKLIST_PROGRESS: (done: number, total: number) =>
    `${String(done)} of ${String(total)} complete`,
} as const

// Tenant onboarding step progression (shared with banner logic).
// Matches API enum: password_set → branding_complete → billing_complete → units_complete → active
export const BRANDING_COMPLETED_STEPS = [
  'branding_complete',
  'billing_complete',
  'units_complete',
  'active',
] as const

export const UNITS_COMPLETED_STEPS = ['units_complete', 'active'] as const

export const ONBOARDING_ACTIVE_STEP = 'active'

export const CHECKLIST_ROUTES = {
  BRANDING: '/branding',
  UNITS: '/units',
} as const
