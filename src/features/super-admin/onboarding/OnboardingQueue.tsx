import { useState } from 'react'
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageShell } from '@/components/shared/PageShell'
import { useOnboardingQueue } from './useOnboardingQueue'
import { OnboardingReviewCard } from './OnboardingReviewCard'
import { ONBOARDING_COPY } from './onboarding.constants'
import type { ReactNode } from 'react'

interface StatItem {
  icon: ReactNode
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
}

function StatsBar({ stats, isLoading }: { stats: StatItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-0 overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_4px_20px_rgba(25,38,64,0.06)]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-3 px-6 py-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-20 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_4px_20px_rgba(25,38,64,0.06)]">
      {stats.map((stat, i) => (
        <div key={stat.label} className="relative flex flex-1 items-center gap-4 px-6 py-4">
          {i > 0 && (
            <div className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-zinc-100" />
          )}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-kmvmt-bg text-kmvmt-navy">
            <span className="[&>svg]:h-4 [&>svg]:w-4">{stat.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black tracking-tight text-kmvmt-navy tabular-nums">
                {stat.value}
              </p>
              {stat.trend && (
                <span
                  className={
                    stat.trendUp
                      ? 'text-[11px] font-bold text-emerald-600'
                      : 'text-[11px] font-bold text-kmvmt-red-light'
                  }
                >
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const STATUS_TABS = [
  { value: 'pending', label: ONBOARDING_COPY.TAB_PENDING },
  { value: 'approved', label: ONBOARDING_COPY.TAB_APPROVED },
  { value: 'rejected', label: ONBOARDING_COPY.TAB_REJECTED },
] as const

export function OnboardingQueue() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = useOnboardingQueue(status, page)
  const { data: pendingData } = useOnboardingQueue('pending', 1)
  const { data: approvedData } = useOnboardingQueue('approved', 1)
  const { data: rejectedData } = useOnboardingQueue('rejected', 1)

  const applications = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  const pendingCount = pendingData?.meta.total ?? 0
  const approvedCount = approvedData?.meta.total ?? 0
  const rejectedCount = rejectedData?.meta.total ?? 0
  const totalCount = pendingCount + approvedCount + rejectedCount

  const stats: StatItem[] = [
    {
      icon: <Clock />,
      label: 'Pending Review',
      value: pendingCount,
      trend: pendingCount > 0 ? 'Action Required' : undefined,
      trendUp: false,
    },
    {
      icon: <CheckCircle2 />,
      label: 'Approved',
      value: approvedCount,
      trend:
        totalCount > 0
          ? `${String(Math.round((approvedCount / totalCount) * 100))}% approval`
          : undefined,
      trendUp: true,
    },
    {
      icon: <XCircle />,
      label: 'Rejected',
      value: rejectedCount,
    },
  ]

  if (isError) {
    return (
      <ErrorState
        title={ONBOARDING_COPY.ERROR_LOAD}
        description={ONBOARDING_COPY.EMPTY_DESCRIPTION}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <PageShell
      breadcrumb={['KMVMT', 'Onboarding Queue']}
      title="Onboarding Queue"
      statsBar={<StatsBar stats={stats} isLoading={isLoading} />}
      tableTitle="Applications"
      tableActions
      filters={
        <Tabs
          value={status}
          onValueChange={(v) => {
            setStatus(v as typeof status)
            setPage(1)
          }}
        >
          <TabsList className="h-10 rounded-xl bg-kmvmt-bg p-1">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg px-5 py-1.5 text-sm font-semibold text-kmvmt-navy/40 transition-all data-[state=active]:bg-kmvmt-white data-[state=active]:font-bold data-[state=active]:text-kmvmt-navy data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
      pagination={
        totalPages > 1 ? (
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-kmvmt-navy/50">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                aria-label={ONBOARDING_COPY.ARIA_PREV_PAGE}
                disabled={page === 1 || isLoading}
                className="border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
                onClick={() => {
                  setPage((p) => p - 1)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label={ONBOARDING_COPY.ARIA_NEXT_PAGE}
                disabled={page === totalPages || isLoading}
                className="border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
                onClick={() => {
                  setPage((p) => p + 1)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      <div>
        {isLoading ? (
          <div className="divide-y divide-zinc-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6 px-8 py-6">
                <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="w-44 shrink-0 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="w-36 shrink-0 space-y-2">
                  <Skeleton className="h-2.5 w-20 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <div className="w-44 shrink-0 space-y-2">
                  <Skeleton className="h-2.5 w-16 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-2.5 w-20 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
                <div className="flex shrink-0 gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-10">
            <EmptyState
              title={ONBOARDING_COPY.EMPTY_TITLE}
              description={ONBOARDING_COPY.EMPTY_DESCRIPTION}
              icon={<ClipboardList className="h-8 w-8 text-kmvmt-navy/30" />}
            />
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {applications.map((app) => (
              <OnboardingReviewCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
