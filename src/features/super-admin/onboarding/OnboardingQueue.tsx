import { useState } from 'react'
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useOnboardingQueue } from './useOnboardingQueue'
import { OnboardingReviewCard } from './OnboardingReviewCard'
import { ONBOARDING_COPY } from './onboarding.constants'

const STATUS_TABS = [
  { value: 'pending', label: ONBOARDING_COPY.TAB_PENDING },
  { value: 'approved', label: ONBOARDING_COPY.TAB_APPROVED },
  { value: 'rejected', label: ONBOARDING_COPY.TAB_REJECTED },
] as const

export function OnboardingQueue() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useOnboardingQueue(status, page)

  const applications = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

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
    <div className="space-y-4">
      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as typeof status)
          setPage(1)
        }}
      >
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title={ONBOARDING_COPY.EMPTY_TITLE}
          description={
            status === 'pending'
              ? ONBOARDING_COPY.EMPTY_DESCRIPTION
              : ONBOARDING_COPY.EMPTY_DESCRIPTION
          }
          icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <OnboardingReviewCard key={app.id} application={app} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label={ONBOARDING_COPY.ARIA_PREV_PAGE}
            disabled={page === 1 || isLoading}
            onClick={() => {
              setPage((p) => p - 1)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            aria-label={ONBOARDING_COPY.ARIA_NEXT_PAGE}
            disabled={page === totalPages || isLoading}
            onClick={() => {
              setPage((p) => p + 1)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
