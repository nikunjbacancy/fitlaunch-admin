import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell, MessageCircle, Megaphone, Trophy, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useCommunityActivity } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'
import type { CommunityActivityType } from './pmDashboard.types'
import type { LucideIcon } from 'lucide-react'

const TYPE_ICON: Record<CommunityActivityType, LucideIcon> = {
  workout_completed: Dumbbell,
  post: MessageCircle,
  announcement: Megaphone,
  challenge_join: Trophy,
}

const TYPE_LABEL: Record<CommunityActivityType, string> = {
  workout_completed: 'Workout',
  post: 'Post',
  announcement: 'Announcement',
  challenge_join: 'Challenge',
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${String(mins)}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${String(hours)}h ago`
  const days = Math.floor(hours / 24)
  return `${String(days)}d ago`
}

export function RecentCommunityFeed() {
  const { data, isLoading, isError, refetch } = useCommunityActivity()

  if (isError) {
    return (
      <ErrorState
        title={DASHBOARD_COPY.ACTIVITY_ERROR}
        description={DASHBOARD_COPY.ACTIVITY_EMPTY_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const items = data ?? []
  const count = items.length

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {DASHBOARD_COPY.ACTIVITY_TITLE}
          </p>
          {count > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
              {count} updates
            </span>
          )}
        </div>
        <Link
          to="/property-manager/residents"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {DASHBOARD_COPY.ACTIVITY_VIEW_ALL}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy/40">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-xs text-kmvmt-navy/40">{DASHBOARD_COPY.ACTIVITY_EMPTY}</p>
          </div>
        ) : (
          <div>
            {items.map((item) => {
              const Icon = TYPE_ICON[item.type]
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50"
                >
                  {/* Icon tile */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-kmvmt-navy">{item.authorName}</p>
                    <p className="truncate text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                      {TYPE_LABEL[item.type]} · {item.summary}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy/40">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
