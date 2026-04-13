/**
 * MOCK DATA — PM dashboard preview only.
 * TODO: Revert — remove this file and revert service imports when real API is connected.
 */
import type {
  PmDashboardMetrics,
  EngagementDataPoint,
  PendingRegistration,
  CommunityActivityItem,
  ActiveChallengeSummary,
} from './pmDashboard.types'

export const MOCK_PM_METRICS: PmDashboardMetrics = {
  totalUnits: 120,
  occupiedUnits: 96,
  vacantUnits: 24,
  activeMembersThisWeek: 74,
  activeMembersTrend: 6,
  challengesRunning: 2,
  recentPostsCount: 18,
  newResidentsThisMonth: 5,
  pendingRegistrations: 3,
  totalResidents: 96,
  activeResidents: 74,
  engagementRate: 62,
}

export const MOCK_PM_ENGAGEMENT: EngagementDataPoint[] = [
  { week: 'W1', activeUsers: 58, workouts: 42 },
  { week: 'W2', activeUsers: 63, workouts: 51 },
  { week: 'W3', activeUsers: 55, workouts: 38 },
  { week: 'W4', activeUsers: 70, workouts: 58 },
  { week: 'W5', activeUsers: 67, workouts: 53 },
  { week: 'W6', activeUsers: 74, workouts: 61 },
]

export const MOCK_PM_PENDING: PendingRegistration[] = [
  {
    id: 'pr-1',
    residentId: 'r1',
    fullName: 'James Okafor',
    email: 'james@email.com',
    unitNumber: '4B',
    submittedAt: '2026-04-08T10:22:00Z',
  },
  {
    id: 'pr-2',
    residentId: 'r2',
    fullName: 'Priya Nair',
    email: 'priya@email.com',
    unitNumber: '7A',
    submittedAt: '2026-04-08T14:05:00Z',
  },
  {
    id: 'pr-3',
    residentId: 'r3',
    fullName: 'Marcus Webb',
    email: 'marcus@email.com',
    unitNumber: '2C',
    submittedAt: '2026-04-09T08:15:00Z',
  },
]

export const MOCK_PM_COMMUNITY_ACTIVITY: CommunityActivityItem[] = [
  {
    id: 'ca-1',
    type: 'announcement',
    authorName: 'The Meridian Team',
    authorAvatarUrl: null,
    summary: 'posted an announcement',
    body: 'Pool reopens Monday after maintenance — fresh towels at the front desk!',
    reactionCount: 14,
    commentCount: 3,
    createdAt: '2026-04-10T09:30:00Z',
  },
  {
    id: 'ca-2',
    type: 'workout_completed',
    authorName: 'Sasha Lin',
    authorAvatarUrl: null,
    summary: 'completed Upper Body Strength',
    reactionCount: 8,
    commentCount: 1,
    createdAt: '2026-04-10T08:14:00Z',
  },
  {
    id: 'ca-3',
    type: 'post',
    authorName: 'David Mensah',
    authorAvatarUrl: null,
    summary: 'shared a post',
    body: 'Anyone up for a 6 AM run loop tomorrow? Meet at the lobby ☀️',
    reactionCount: 11,
    commentCount: 6,
    createdAt: '2026-04-09T19:42:00Z',
  },
  {
    id: 'ca-4',
    type: 'challenge_join',
    authorName: 'Priya Nair',
    authorAvatarUrl: null,
    summary: 'joined March Steps Challenge',
    reactionCount: 4,
    commentCount: 0,
    createdAt: '2026-04-09T17:20:00Z',
  },
  {
    id: 'ca-5',
    type: 'workout_completed',
    authorName: 'Marcus Webb',
    authorAvatarUrl: null,
    summary: 'completed HIIT Cardio',
    reactionCount: 6,
    commentCount: 2,
    createdAt: '2026-04-09T15:05:00Z',
  },
]

export const MOCK_PM_ACTIVE_CHALLENGES: ActiveChallengeSummary[] = [
  {
    id: 'ch-1',
    title: 'March Steps Challenge',
    type: 'steps',
    participantCount: 42,
    daysRemaining: 6,
    topLeaders: [
      { rank: 1, fullName: 'Sasha Lin', avatarUrl: null, score: 184320 },
      { rank: 2, fullName: 'David Mensah', avatarUrl: null, score: 171005 },
      { rank: 3, fullName: 'Priya Nair', avatarUrl: null, score: 162487 },
    ],
  },
  {
    id: 'ch-2',
    title: '20 Workouts in 30 Days',
    type: 'workout_count',
    participantCount: 28,
    daysRemaining: 12,
    topLeaders: [
      { rank: 1, fullName: 'Marcus Webb', avatarUrl: null, score: 17 },
      { rank: 2, fullName: 'Elena Garcia', avatarUrl: null, score: 15 },
      { rank: 3, fullName: 'James Okafor', avatarUrl: null, score: 14 },
    ],
  },
]
