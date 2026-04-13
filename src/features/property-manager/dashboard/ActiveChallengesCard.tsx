import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useActiveChallenges } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'
import type { ActiveChallengeSummary, ChallengeType } from './pmDashboard.types'

const TYPE_LABEL: Record<ChallengeType, string> = {
  workout_count: 'workouts',
  total_sets: 'sets',
  steps: 'steps',
  weight_lost: 'lbs',
}

const RANK_BADGE: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700',
  2: 'bg-zinc-100 text-zinc-600',
  3: 'bg-orange-100 text-orange-700',
}

function formatScore(score: number): string {
  if (score >= 1_000) return `${(score / 1_000).toFixed(1)}k`
  return String(score)
}

export function ActiveChallengesCard() {
  const { data, isLoading, isError, refetch } = useActiveChallenges()

  if (isError) {
    return (
      <ErrorState
        title={DASHBOARD_COPY.CHALLENGES_ERROR}
        description={DASHBOARD_COPY.CHALLENGES_EMPTY_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const challenges = data ?? []
  const count = challenges.length

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {DASHBOARD_COPY.CHALLENGES_TITLE}
          </p>
          {count > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
              {count} running
            </span>
          )}
        </div>
        <Link
          to="/property-manager/challenges"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {DASHBOARD_COPY.CHALLENGES_VIEW_ALL}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy/40">
              <Trophy className="h-5 w-5" />
            </div>
            <p className="text-xs text-kmvmt-navy/40">{DASHBOARD_COPY.CHALLENGES_EMPTY}</p>
          </div>
        ) : (
          <div>
            {challenges.map((challenge) => (
              <ChallengeRow key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ChallengeRow({ challenge }: { challenge: ActiveChallengeSummary }) {
  const unitLabel = TYPE_LABEL[challenge.type]

  return (
    <div className="rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50">
      {/* Top: icon + title + meta */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
          <Trophy className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-kmvmt-navy">{challenge.title}</p>
          <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
            {String(challenge.participantCount)} participants ·{' '}
            {challenge.daysRemaining === 1
              ? '1 day left'
              : `${String(challenge.daysRemaining)} days left`}
          </p>
        </div>
      </div>

      {/* Leaderboard preview — 3 small chips */}
      <div className="mt-3 flex flex-wrap gap-1.5 pl-16">
        {challenge.topLeaders.map((leader) => (
          <span
            key={leader.rank}
            className="inline-flex items-center gap-1.5 rounded-full bg-kmvmt-bg px-2.5 py-1"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
                RANK_BADGE[leader.rank] ?? 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {leader.rank}
            </span>
            <span className="text-[10px] font-bold text-kmvmt-navy">{leader.fullName}</span>
            <span className="text-[10px] font-medium text-kmvmt-navy/50">
              {formatScore(leader.score)} {unitLabel}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
