export interface PmDashboardMetrics {
  totalUnits: number
  occupiedUnits: number
  vacantUnits: number
  activeMembersThisWeek: number
  activeMembersTrend: number
  challengesRunning: number
  recentPostsCount: number
  newResidentsThisMonth: number
  pendingRegistrations: number
  // kept for backwards compat with EngagementChart
  totalResidents: number
  activeResidents: number
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

export type CommunityActivityType = 'workout_completed' | 'post' | 'announcement' | 'challenge_join'

export interface CommunityActivityItem {
  id: string
  type: CommunityActivityType
  authorName: string
  authorAvatarUrl?: string | null
  /** Short headline, e.g. "completed Push Day" or "joined March Steps Challenge" */
  summary: string
  /** Optional preview body for posts/announcements */
  body?: string
  reactionCount: number
  commentCount: number
  createdAt: string
}

export type ChallengeType = 'workout_count' | 'total_sets' | 'steps' | 'weight_lost'

export interface ActiveChallengeLeader {
  rank: number
  fullName: string
  avatarUrl?: string | null
  score: number
}

export interface ActiveChallengeSummary {
  id: string
  title: string
  type: ChallengeType
  participantCount: number
  /** Days remaining until challenge ends */
  daysRemaining: number
  /** Top 3 leaders by rank */
  topLeaders: ActiveChallengeLeader[]
}
