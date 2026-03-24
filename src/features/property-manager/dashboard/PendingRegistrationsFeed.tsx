import { Loader2, CheckCheck, Clock, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePendingRegistrations, useApproveAllPending } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'

export function PendingRegistrationsFeed() {
  const { data: registrations, isLoading, isError, refetch } = usePendingRegistrations()
  const { mutate: approveAll, isPending: isApproving } = useApproveAllPending()

  if (isError) {
    return (
      <ErrorState
        title={DASHBOARD_COPY.FEED_ERROR}
        description={DASHBOARD_COPY.FEED_EMPTY_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const count = registrations?.length ?? 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{DASHBOARD_COPY.FEED_TITLE}</CardTitle>
            {count > 0 && (
              <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0">{count}</Badge>
            )}
          </div>
          {count > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={isApproving}
              onClick={() => {
                approveAll()
              }}
            >
              {isApproving ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              )}
              {DASHBOARD_COPY.FEED_APPROVE_ALL}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))
        ) : count === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCheck className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">{DASHBOARD_COPY.FEED_EMPTY}</p>
            <p className="text-xs text-muted-foreground">{DASHBOARD_COPY.FEED_EMPTY_DESC}</p>
          </div>
        ) : (
          registrations?.map((reg) => (
            <div
              key={reg.id}
              className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <UserPlus className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{reg.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Unit {reg.unitNumber} · {reg.email}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {new Date(reg.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
